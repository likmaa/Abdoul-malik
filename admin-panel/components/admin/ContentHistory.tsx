'use client';

import { useState, useEffect } from 'react';

interface HistoryEntry {
  id: string;
  action: string;
  changes?: { changes: Array<{ field: string; before: any; after: any }> };
  userName?: string;
  createdAt: string;
}

interface ContentHistoryProps {
  contentType: 'partner' | 'testimonial' | 'heroImage' | 'immersiveImage';
  contentId: string;
  onClose: () => void;
}

export function ContentHistory({ contentType, contentId, onClose }: ContentHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `/api/admin/content/history?contentType=${contentType}&contentId=${contentId}`
        );
        if (response.ok) {
          const data = await response.json();
          setHistory(data.history || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [contentType, contentId]);

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      create: 'Créé',
      update: 'Modifié',
      delete: 'Supprimé',
      toggle_active: 'Statut changé',
    };
    return labels[action] || action;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Historique des modifications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-electric"></div>
              <p className="text-gray-500 mt-4">Chargement de l'historique...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun historique disponible.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="border-l-4 border-violet-electric pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      {getActionLabel(entry.action)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                  {entry.userName && (
                    <p className="text-sm text-gray-600 mb-2">
                      Par {entry.userName}
                    </p>
                  )}
                  {entry.changes?.changes && entry.changes.changes.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {entry.changes.changes.map((change, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                          <span className="font-medium">{change.field}:</span>{' '}
                          <span className="text-red-600 line-through">{String(change.before || 'vide')}</span>
                          {' → '}
                          <span className="text-green-600">{String(change.after || 'vide')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

