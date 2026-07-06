import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    source: string;
}

// GET /api/admin/logs - Récupérer les logs système
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'all';
        const lines = parseInt(searchParams.get('lines') || '100');
        const search = searchParams.get('search') || '';

        const logs: LogEntry[] = [];

        // 1. Essayer de lire les logs Docker via différentes méthodes
        let rawLogs: string[] = [];

        // Méthode 1: Docker logs directement
        try {
            const { stdout } = await execAsync('docker logs --tail 200 $(hostname) 2>&1', { timeout: 5000 });
            rawLogs = stdout.split('\n').filter(Boolean);
        } catch (e) {
            // Méthode 2: Lire depuis /var/log ou PM2
            try {
                const logPaths = [
                    '/var/log/app.log',
                    '/root/.pm2/logs/app-out.log',
                    '/app/.next/server/logs.txt',
                ];

                for (const logPath of logPaths) {
                    if (existsSync(logPath)) {
                        const content = await readFile(logPath, 'utf-8');
                        rawLogs = content.split('\n').filter(Boolean).slice(-200);
                        break;
                    }
                }
            } catch (e2) {
                // Méthode 3: Lire la sortie console via dmesg ou journal
                try {
                    const { stdout } = await execAsync('journalctl --no-pager -n 100 2>/dev/null || dmesg | tail -100 2>/dev/null || echo ""', { timeout: 5000 });
                    rawLogs = stdout.split('\n').filter(Boolean);
                } catch (e3) {
                    // Aucun log disponible
                }
            }
        }

        // Parser les logs bruts
        for (const line of rawLogs) {
            let level = 'info';
            if (/error|fail|exception|fatal/i.test(line)) level = 'error';
            else if (/warn|warning/i.test(line)) level = 'warning';
            else if (/debug/i.test(line)) level = 'debug';

            if (type !== 'all' && level !== type) continue;
            if (search && !line.toLowerCase().includes(search.toLowerCase())) continue;

            // Essayer d'extraire un timestamp du log
            const timestampMatch = line.match(/^\[?(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2})/);
            const timestamp = timestampMatch ? new Date(timestampMatch[1]).toISOString() : new Date().toISOString();

            logs.push({
                timestamp,
                level,
                message: line.substring(0, 500), // Limiter la longueur
                source: detectSource(line)
            });
        }

        // 2. Ajouter des informations système en temps réel
        const systemInfo = await getSystemInfo();

        // Si aucun log n'a été trouvé, afficher les infos système
        if (logs.length === 0) {
            logs.push(
                { timestamp: new Date().toISOString(), level: 'info', message: `🖥️ Système: ${systemInfo.os}`, source: 'system' },
                { timestamp: new Date().toISOString(), level: 'info', message: `💾 Mémoire: ${systemInfo.memory}`, source: 'system' },
                { timestamp: new Date().toISOString(), level: 'info', message: `📦 Node.js: ${process.version}`, source: 'nodejs' },
                { timestamp: new Date().toISOString(), level: 'info', message: `🌐 Environnement: ${process.env.NODE_ENV || 'development'}`, source: 'nextjs' },
                { timestamp: new Date().toISOString(), level: 'info', message: `⏰ Uptime serveur: ${formatUptime(process.uptime())}`, source: 'system' },
                { timestamp: new Date().toISOString(), level: 'warning', message: 'Les logs Docker ne sont pas accessibles directement. Utilisez "docker logs <container>" depuis le serveur.', source: 'admin' },
            );

            // Ajouter les dernières requêtes si disponibles
            if (systemInfo.recentRequests) {
                logs.push({
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    message: `📊 Requêtes récentes: ${systemInfo.recentRequests}`,
                    source: 'api'
                });
            }
        }

        return NextResponse.json({
            logs: logs.slice(0, lines),
            total: logs.length,
            filters: { type, lines, search },
            systemInfo
        });
    } catch (error) {
        console.error('[Admin Logs] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des logs', details: String(error) },
            { status: 500 }
        );
    }
}

function detectSource(line: string): string {
    if (/prisma/i.test(line)) return 'prisma';
    if (/next|nextjs/i.test(line)) return 'nextjs';
    if (/auth|session/i.test(line)) return 'auth';
    if (/api/i.test(line)) return 'api';
    if (/docker/i.test(line)) return 'docker';
    return 'system';
}

async function getSystemInfo() {
    const info: Record<string, string> = {
        os: process.platform,
        memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB utilisés`,
        nodeVersion: process.version,
        uptime: formatUptime(process.uptime()),
    };

    try {
        const { stdout: hostname } = await execAsync('hostname', { timeout: 2000 });
        info.hostname = hostname.trim();
    } catch (e) {
        info.hostname = 'unknown';
    }

    try {
        const { stdout: disk } = await execAsync('df -h / | tail -1 | awk \'{print $5}\'', { timeout: 2000 });
        info.diskUsage = disk.trim();
    } catch (e) {
        info.diskUsage = 'N/A';
    }

    return info;
}

function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}j ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}
