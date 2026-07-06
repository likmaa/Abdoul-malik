'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { BellIcon } from './AdminIcons';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    status: string;
    createdAt: string;
    link: string;
}

interface NotificationBellProps {
    pollingInterval?: number; // en millisecondes, défaut 30 secondes
}

export function NotificationBell({ pollingInterval = 30000 }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [newCount, setNewCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const lastSeenIdRef = useRef<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initialiser l'audio
    useEffect(() => {
        audioRef.current = new Audio('/sounds/notification.mp3');
        audioRef.current.volume = 0.5;

        // Charger le lastSeenId depuis localStorage
        const savedLastSeenId = localStorage.getItem('admin_lastSeenNotificationId');
        if (savedLastSeenId) {
            lastSeenIdRef.current = savedLastSeenId;
        }

        // Charger la préférence de son
        const savedSoundPref = localStorage.getItem('admin_notificationSound');
        if (savedSoundPref !== null) {
            setSoundEnabled(savedSoundPref === 'true');
        }
    }, []);

    // Jouer le son de notification
    const playNotificationSound = useCallback(() => {
        if (soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => {
                console.log('Impossible de jouer le son:', err);
            });
        }
    }, [soundEnabled]);

    // Récupérer les notifications
    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = lastSeenIdRef.current
                ? `?lastSeenId=${lastSeenIdRef.current}`
                : '';

            const response = await fetch(`/api/admin/notifications${params}`);
            if (!response.ok) return;

            const data = await response.json();

            // Vérifier s'il y a de nouvelles notifications
            if (data.newCount > 0 && data.latestId !== lastSeenIdRef.current) {
                // Jouer le son uniquement pour les VRAIES nouvelles notifs
                if (lastSeenIdRef.current && data.newCount > newCount) {
                    playNotificationSound();
                }
                setNewCount(data.newCount);
            }

            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Erreur chargement notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [newCount, playNotificationSound]);

    // Polling des notifications
    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(fetchNotifications, pollingInterval);
        return () => clearInterval(interval);
    }, [fetchNotifications, pollingInterval]);

    // Fermer le dropdown en cliquant ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Marquer les notifications comme vues
    const handleOpen = () => {
        setIsOpen(!isOpen);

        if (!isOpen && notifications.length > 0) {
            // Sauvegarder le dernier ID vu
            const latestId = notifications[0]?.id;
            if (latestId) {
                lastSeenIdRef.current = latestId;
                localStorage.setItem('admin_lastSeenNotificationId', latestId);
                setNewCount(0);
            }
        }
    };

    // Toggle son
    const toggleSound = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        localStorage.setItem('admin_notificationSound', String(newState));
    };

    // Formater la date relative
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        return date.toLocaleDateString('fr-FR');
    };

    // Couleur du statut
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bouton de la cloche */}
            <button
                onClick={handleOpen}
                className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <BellIcon className="w-5 h-5" />

                {/* Badge compteur */}
                {newCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
                        {newCount > 99 ? '99+' : newCount}
                    </span>
                )}
            </button>

            {/* Dropdown des notifications */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleSound}
                                className={`p-1.5 rounded-lg transition-colors ${soundEnabled
                                        ? 'text-violet-600 hover:bg-violet-50'
                                        : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                title={soundEnabled ? 'Son activé' : 'Son désactivé'}
                            >
                                {soundEnabled ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                    </svg>
                                )}
                            </button>
                            <Link
                                href="/admin/orders"
                                className="text-sm text-violet-600 hover:text-violet-800"
                                onClick={() => setIsOpen(false)}
                            >
                                Voir tout
                            </Link>
                        </div>
                    </div>

                    {/* Liste des notifications */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading && notifications.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                <BellIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>Aucune notification</p>
                            </div>
                        ) : (
                            notifications.map((notif, index) => (
                                <Link
                                    key={notif.id}
                                    href={notif.link}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${index === 0 && newCount > 0 ? 'bg-violet-50/50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {notif.title}
                                                </p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(notif.status)}`}>
                                                    {notif.status === 'pending' ? 'En attente' : notif.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{notif.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notif.createdAt)}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
