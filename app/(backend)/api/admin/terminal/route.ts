import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend/lib/auth-config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Whitelist des commandes autorisées (sécurité)
const ALLOWED_COMMANDS: Record<string, string> = {
    // Système
    'uptime': 'uptime',
    'disk': 'df -h',
    'memory': 'free -h || vm_stat',
    'top': 'top -b -n 1 | head -20 || top -l 1 | head -20',
    'ps': 'ps aux | head -20',

    // Node/NPM
    'node-version': 'node -v',
    'npm-version': 'npm -v',
    'npm-list': 'npm list --depth=0',

    // Réseau
    'network': 'netstat -tuln 2>/dev/null | head -20 || lsof -i -P | head -20',
    'ip': 'hostname -I 2>/dev/null || ifconfig | grep inet',

    // Application
    'prisma-status': 'npx prisma migrate status 2>/dev/null || echo "Prisma non disponible"',
    'env-check': 'printenv | grep -E "^(NODE_ENV|DATABASE_URL|NEXTAUTH)" | sed "s/=.*/=***/"',

    // Logs
    'logs-tail': 'tail -50 /var/log/syslog 2>/dev/null || echo "Logs non accessibles"',

    // Docker (si disponible)
    'docker-ps': 'docker ps 2>/dev/null || echo "Docker non disponible"',
    'docker-stats': 'docker stats --no-stream 2>/dev/null || echo "Docker non disponible"',
};

// POST /api/admin/terminal - Exécuter une commande
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const { command } = await request.json();

        if (!command || typeof command !== 'string') {
            return NextResponse.json(
                { error: 'Commande invalide' },
                { status: 400 }
            );
        }

        // Vérifier si la commande est dans la whitelist
        const actualCommand = ALLOWED_COMMANDS[command];

        if (!actualCommand) {
            return NextResponse.json({
                error: 'Commande non autorisée',
                output: `Commande "${command}" non reconnue.\n\nCommandes disponibles:\n${Object.keys(ALLOWED_COMMANDS).map(c => `  - ${c}`).join('\n')}`,
                exitCode: 1
            });
        }

        try {
            const { stdout, stderr } = await execAsync(actualCommand, {
                timeout: 10000, // 10 secondes max
                maxBuffer: 1024 * 1024, // 1MB max
            });

            console.log(`[Admin Terminal] ${session.user.email} exécuté: ${command}`);

            return NextResponse.json({
                command,
                actualCommand,
                output: stdout || stderr || 'Commande exécutée sans sortie',
                exitCode: 0,
                timestamp: new Date().toISOString()
            });
        } catch (execError: any) {
            return NextResponse.json({
                command,
                actualCommand,
                output: execError.stderr || execError.message || 'Erreur lors de l\'exécution',
                exitCode: execError.code || 1,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('[Admin Terminal] Erreur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// GET /api/admin/terminal - Liste des commandes disponibles
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        return NextResponse.json({
            commands: Object.keys(ALLOWED_COMMANDS).map(key => ({
                name: key,
                description: getCommandDescription(key)
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

function getCommandDescription(key: string): string {
    const descriptions: Record<string, string> = {
        'uptime': 'Temps de fonctionnement du système',
        'disk': 'Espace disque disponible',
        'memory': 'Utilisation mémoire',
        'top': 'Processus les plus actifs',
        'ps': 'Liste des processus',
        'node-version': 'Version de Node.js',
        'npm-version': 'Version de npm',
        'npm-list': 'Packages installés',
        'network': 'Connexions réseau',
        'ip': 'Adresse IP',
        'prisma-status': 'État des migrations Prisma',
        'env-check': 'Variables d\'environnement (masquées)',
        'logs-tail': 'Dernières lignes de logs',
        'docker-ps': 'Conteneurs Docker actifs',
        'docker-stats': 'Statistiques Docker',
    };
    return descriptions[key] || 'Commande système';
}
