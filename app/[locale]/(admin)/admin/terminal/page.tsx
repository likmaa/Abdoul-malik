'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

interface CommandResult {
    command: string;
    output: string;
    exitCode: number;
    timestamp: string;
}

interface AvailableCommand {
    name: string;
    description: string;
}

export default function AdminTerminalPage() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<CommandResult[]>([]);
    const [availableCommands, setAvailableCommands] = useState<AvailableCommand[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Charger les commandes disponibles
        fetch('/api/admin/terminal')
            .then(res => res.json())
            .then(data => setAvailableCommands(data.commands || []))
            .catch(console.error);
    }, []);

    useEffect(() => {
        // Scroll vers le bas lors d'un nouveau résultat
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const executeCommand = async (cmd: string) => {
        if (!cmd.trim()) return;

        setIsExecuting(true);

        try {
            const response = await fetch('/api/admin/terminal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: cmd.trim() })
            });

            const result = await response.json();

            setHistory(prev => [...prev, {
                command: cmd,
                output: result.output || result.error || 'Pas de sortie',
                exitCode: result.exitCode ?? (result.error ? 1 : 0),
                timestamp: new Date().toISOString()
            }]);
        } catch (error) {
            setHistory(prev => [...prev, {
                command: cmd,
                output: 'Erreur de connexion au serveur',
                exitCode: 1,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsExecuting(false);
            setInput('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeCommand(input);
    };

    const clearHistory = () => setHistory([]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Terminal Admin</h2>
                    <p className="text-gray-600 mt-1">
                        Exécutez des commandes de diagnostic sécurisées
                    </p>
                </div>
                <Button variant="outline" onClick={clearHistory}>
                    Effacer l'historique
                </Button>
            </div>

            {/* Commandes disponibles */}
            <Card>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Commandes disponibles</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {availableCommands.map((cmd) => (
                            <button
                                key={cmd.name}
                                onClick={() => executeCommand(cmd.name)}
                                disabled={isExecuting}
                                className="text-left px-3 py-2 bg-gray-100 hover:bg-violet-100 rounded-lg text-sm transition-colors disabled:opacity-50"
                                title={cmd.description}
                            >
                                <span className="font-mono text-violet-electric">{cmd.name}</span>
                                <p className="text-xs text-gray-500 truncate">{cmd.description}</p>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Terminal */}
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    {/* Output */}
                    <div
                        ref={terminalRef}
                        className="bg-gray-900 text-green-400 font-mono text-sm p-4 h-[400px] overflow-y-auto"
                    >
                        {history.length === 0 ? (
                            <div className="text-gray-500">
                                <p>Bienvenue dans le terminal admin.</p>
                                <p>Tapez une commande ou cliquez sur un bouton ci-dessus.</p>
                                <p className="mt-2 text-yellow-500">
                                    ⚠️ Seules les commandes de la whitelist sont autorisées.
                                </p>
                            </div>
                        ) : (
                            history.map((result, index) => (
                                <div key={index} className="mb-4">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <span className="text-gray-500">
                                            [{new Date(result.timestamp).toLocaleTimeString('fr-FR')}]
                                        </span>
                                        <span className="text-green-500">$</span>
                                        <span>{result.command}</span>
                                    </div>
                                    <pre className={`mt-1 whitespace-pre-wrap ${result.exitCode === 0 ? 'text-gray-300' : 'text-red-400'}`}>
                                        {result.output}
                                    </pre>
                                    {result.exitCode !== 0 && (
                                        <span className="text-red-500 text-xs">
                                            Exit code: {result.exitCode}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                        {isExecuting && (
                            <div className="flex items-center gap-2 text-yellow-400">
                                <span className="animate-pulse">●</span>
                                <span>Exécution en cours...</span>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="flex bg-gray-800 border-t border-gray-700">
                        <span className="text-green-500 px-4 py-3 font-mono">$</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Entrez une commande (help pour la liste)"
                            className="flex-1 bg-transparent text-white font-mono py-3 outline-none"
                            disabled={isExecuting}
                            autoFocus
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            className="m-2"
                            disabled={isExecuting || !input.trim()}
                        >
                            Exécuter
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
