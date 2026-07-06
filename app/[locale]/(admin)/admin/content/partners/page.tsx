'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { SortableList } from '@/admin-panel/components/admin/SortableList';
import { ContentPreview } from '@/admin-panel/components/admin/ContentPreview';
import { ContentHistory } from '@/admin-panel/components/admin/ContentHistory';
import { PlusCircleIcon } from '@/admin-panel/components/admin/AdminIcons';

interface Partner {
  id: string;
  name: string;
  logoPath: string;
  cdnUrl: string | null;
  width: number | null;
  height: number | null;
  alt: string;
  order: number;
  isActive: boolean;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [previewData, setPreviewData] = useState<Partner | null>(null);
  const [historyData, setHistoryData] = useState<{ contentType: 'partner'; contentId: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logoPath: '',
    cdnUrl: '',
    width: '',
    height: '',
    alt: '',
    order: '0',
    isActive: true,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/content/partners');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details || errorData.error || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setPartners(data.partners || []);
    } catch (error) {
      console.error('Erreur lors du chargement des partenaires:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/products/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erreur lors de l\'upload');

      const data = await response.json();
      setFormData((prev) => ({ ...prev, logoPath: data.url }));
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/content/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          width: formData.width ? parseInt(formData.width) : null,
          height: formData.height ? parseInt(formData.height) : null,
          order: parseInt(formData.order),
          cdnUrl: formData.cdnUrl || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      setShowCreateModal(false);
      setFormData({
        name: '',
        logoPath: '',
        cdnUrl: '',
        width: '',
        height: '',
        alt: '',
        order: '0',
        isActive: true,
      });
      fetchPartners();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return;

    try {
      const response = await fetch(`/api/admin/content/partners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchPartners();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (partner: Partner) => {
    try {
      const response = await fetch(`/api/admin/content/partners/${partner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !partner.isActive }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      fetchPartners();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleReorder = async (newOrder: Partner[]) => {
    try {
      const response = await fetch('/api/admin/content/partners/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: newOrder.map((item, index) => ({
            id: item.id,
            order: index,
          })),
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la réorganisation');

      // Mettre à jour l'ordre localement
      setPartners(newOrder);
    } catch (error) {
      console.error('Erreur lors de la réorganisation:', error);
      alert('Erreur lors de la réorganisation');
      fetchPartners(); // Recharger en cas d'erreur
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/content" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Retour
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Partenaires</h2>
          <p className="text-gray-600 mt-1">Gérer les logos des partenaires affichés sur le site</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <span className="flex items-center gap-2">
            <PlusCircleIcon className="w-4 h-4" />
            <span>Ajouter un partenaire</span>
          </span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-electric"></div>
          <p className="text-gray-500 mt-4">Chargement des partenaires...</p>
        </div>
      ) : partners.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-violet-50 flex items-center justify-center text-violet-electric">
                <span className="text-2xl font-semibold">P</span>
              </div>
            </div>
            <p className="text-gray-500 mb-2 text-lg font-medium">Aucun partenaire pour le moment</p>
            <p className="text-gray-400 text-sm mb-6">
              Commencez par importer les partenaires existants ou créez-en de nouveaux.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/admin/content/import">
                <Button variant="outline">
                  Importer les partenaires existants
                </Button>
              </Link>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <span className="flex items-center gap-2">
                  <PlusCircleIcon className="w-4 h-4" />
                  <span>Ajouter un partenaire</span>
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher un partenaire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterActive('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${filterActive === 'all'
                    ? 'bg-violet-electric text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterActive('active')}
                className={`px-4 py-2 rounded-lg transition-colors ${filterActive === 'active'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Actifs
              </button>
              <button
                onClick={() => setFilterActive('inactive')}
                className={`px-4 py-2 rounded-lg transition-colors ${filterActive === 'inactive'
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Inactifs
              </button>
            </div>
          </div>

          {/* Liste filtrée */}
          {(() => {
            const filteredPartners = partners.filter((partner) => {
              const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                partner.alt.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesFilter = filterActive === 'all' ||
                (filterActive === 'active' && partner.isActive) ||
                (filterActive === 'inactive' && !partner.isActive);
              return matchesSearch && matchesFilter;
            });

            return filteredPartners.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">Aucun partenaire ne correspond à votre recherche.</p>
                </CardContent>
              </Card>
            ) : (
              <SortableList
                items={filteredPartners}
                onReorder={handleReorder}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {(partner) => (
                  <Card key={partner.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                        <button
                          onClick={() => handleToggleActive(partner)}
                          className={`px-2 py-1 text-xs rounded ${partner.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {partner.isActive ? 'Actif' : 'Inactif'}
                        </button>
                      </div>

                      {partner.logoPath && (
                        <div className="mb-4 flex items-center justify-center h-20 bg-gray-50 rounded-lg">
                          <img
                            src={partner.logoPath}
                            alt={partner.alt}
                            className="max-h-16 w-auto object-contain"
                          />
                        </div>
                      )}

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p><strong>Ordre:</strong> {partner.order}</p>
                        <p><strong>Alt:</strong> {partner.alt}</p>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/admin/content/partners/${partner.id}`}
                          className="flex-1 text-center px-3 py-2 text-sm text-violet-electric hover:bg-violet-50 rounded-lg transition-colors"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(partner.id)}
                          className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </SortableList>
            );
          })()}
        </>
      )}

      {/* Prévisualisation */}
      {previewData && (
        <ContentPreview
          type="partner"
          data={previewData}
          onClose={() => setPreviewData(null)}
        />
      )}

      {/* Historique */}
      {historyData && (
        <ContentHistory
          contentType={historyData.contentType}
          contentId={historyData.contentId}
          onClose={() => setHistoryData(null)}
        />
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Ajouter un partenaire</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la marque *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo (upload)
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-electric transition-colors">
                    {uploading ? (
                      <span className="text-gray-500">Upload en cours...</span>
                    ) : formData.logoPath ? (
                      <span className="text-green-600">✓ Image uploadée</span>
                    ) : (
                      <span className="text-gray-600">Cliquez pour uploader</span>
                    )}
                  </div>
                </label>
                {formData.logoPath && (
                  <p className="text-xs text-gray-500 mt-1">{formData.logoPath}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL CDN (optionnel)
                </label>
                <input
                  type="url"
                  value={formData.cdnUrl}
                  onChange={(e) => setFormData({ ...formData, cdnUrl: e.target.value })}
                  placeholder="https://cdn.example.com/logo.svg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Largeur (px)
                  </label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hauteur (px)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texte alternatif *
                </label>
                <input
                  type="text"
                  required
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-violet-electric border-gray-300 rounded focus:ring-violet-electric"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Actif
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isSubmitting || !formData.logoPath}
                >
                  {isSubmitting ? 'Création...' : 'Créer'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

