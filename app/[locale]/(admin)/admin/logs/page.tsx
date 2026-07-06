'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    source: string;
}

interface SystemInfo {
    os?: string;
    memory?: string;
    hostname?: string;
    diskUsage?: string;
    uptime?: string;
    nodeVersion?: string;
}

const levelColors = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    debug: 'bg-gray-100 text-gray-800',
};

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(false);

    const fetchLogs = async () => {
        try {
            setError(null);
            const params = new URLSearchParams();
            if (filter !== 'all') params.append('type', filter);
            if (search) params.append('search', search);
            params.append('lines', '100');

            const response = await fetch(`/api/admin/logs?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs || []);
                setSystemInfo(data.systemInfo || null);
            } else {
                const errData = await response.json();
                setError(errData.error || 'Erreur lors du chargement');
            }
        } catch (err) {
            console.error('Erreur lors du chargement des logs:', err);
            setError('Erreur de connexion au serveur');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filter, search]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(fetchLogs, 5000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh, filter, search]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Logs Système</h2>
                    <p className="text-gray-600 mt-1">
                        Monitoring en temps réel des logs de l'application
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={autoRefresh ? 'primary' : 'outline'}
                        onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                        {autoRefresh ? (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Auto-refresh ON
                            </span>
                        ) : (
                            'Auto-refresh OFF'
                        )}
                    </Button>
                    <Button variant="outline" onClick={fetchLogs}>
                        Rafraîchir
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recherche
                            </label>
                            <input
                                type="text"
                                placeholder="Rechercher dans les logs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Niveau
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {['all', 'info', 'warning', 'error', 'debug'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setFilter(level)}
                                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${filter === level
                                            ? 'bg-violet-electric text-white border-violet-electric'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {level === 'all' ? 'Tous' : level.charAt(0).toUpperCase() + level.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logs */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-electric mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement des logs...</p>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            Aucun log trouvé
                        </div>
                    ) : (
                        <div className="max-h-[600px] overflow-y-auto font-mono text-sm">
                            {logs.map((log, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${levelColors[log.level as keyof typeof levelColors] || levelColors.info
                                            }`}
                                    >
                                        {log.level}
                                    </span>
                                    <span className="text-xs text-gray-500">[{log.source}]</span>
                                    <span className="flex-1 text-gray-800 break-all">{log.message}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
