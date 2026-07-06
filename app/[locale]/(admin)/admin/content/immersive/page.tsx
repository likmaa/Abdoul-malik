'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { PlusCircleIcon, FileDownloadIcon, VideoBadgeIcon } from '@/admin-panel/components/admin/AdminIcons';

interface ImmersiveImage {
  id: string;
  name: string;
  mediaType: 'image' | 'video';
  imageUrl: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  productId: string | null;
  order: number;
  isActive: boolean;
}

export default function ImmersiveImagesPage() {
  const [images, setImages] = useState<ImmersiveImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mediaType: 'image' as 'image' | 'video',
    imageUrl: '',
    videoUrl: '',
    thumbnailUrl: '',
    productId: '',
    order: '0',
    isActive: true,
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/content/immersive-images');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details || errorData.error || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Erreur lors du chargement des images immersives:', error);
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
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (error) {
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/content/upload-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, videoUrl: data.url, mediaType: 'video' }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'upload de la vidéo');
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFormData((prev) => ({ ...prev, thumbnailUrl: data.url }));
    } catch (error) {
      alert('Erreur lors de l\'upload de la miniature');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/content/immersive-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: formData.mediaType === 'image' ? formData.imageUrl : null,
          videoUrl: formData.mediaType === 'video' ? formData.videoUrl : null,
          thumbnailUrl: formData.thumbnailUrl || null,
          productId: formData.productId || null,
          order: parseInt(formData.order),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      setShowCreateModal(false);
      setFormData({
        name: '',
        mediaType: 'image',
        imageUrl: '',
        videoUrl: '',
        thumbnailUrl: '',
        productId: '',
        order: '0',
        isActive: true,
      });
      fetchImages();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      const response = await fetch(`/api/admin/content/immersive-images/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchImages();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/content" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Retour
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Images Immersives</h2>
          <p className="text-gray-600 mt-1">Gérer les images de la section immersive 3D</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <span className="flex items-center gap-2">
            <PlusCircleIcon className="w-4 h-4" />
            <span>Ajouter une image</span>
          </span>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-electric"></div>
          <p className="text-gray-500 mt-4">Chargement des images immersives...</p>
        </div>
      ) : images.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-violet-50 flex items-center justify-center text-violet-electric">
                <span className="text-2xl font-semibold">3D</span>
              </div>
            </div>
            <p className="text-gray-500 mb-2 text-lg font-medium">Aucune image immersive pour le moment</p>
            <p className="text-gray-400 text-sm mb-6">
              Commencez par importer les images existantes ou créez-en de nouvelles.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/admin/content/import">
                <Button variant="outline">
                  Importer les images existantes
                </Button>
              </Link>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <span className="flex items-center gap-2">
                  <PlusCircleIcon className="w-4 h-4" />
                  <span>Ajouter une image</span>
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
                placeholder="Rechercher une image..."
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
            const filteredImages = images.filter((image) => {
              const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesFilter = filterActive === 'all' ||
                (filterActive === 'active' && image.isActive) ||
                (filterActive === 'inactive' && !image.isActive);
              return matchesSearch && matchesFilter;
            });

            return filteredImages.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">Aucune image ne correspond à votre recherche.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image) => (
                  <Card key={image.id}>
                    <CardContent className="p-0">
                      <div className="relative h-64 bg-gray-100">
                        {image.mediaType === 'video' && image.videoUrl ? (
                          <video
                            src={image.videoUrl}
                            className="w-full h-full object-cover rounded-t-lg"
                            muted
                            loop
                            playsInline
                          />
                        ) : image.imageUrl ? (
                          <img
                            src={image.imageUrl}
                            alt={image.name}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Aucun média
                          </div>
                        )}
                        {image.mediaType === 'video' && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <VideoBadgeIcon className="w-3 h-3" />
                            <span>Vidéo</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{image.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${image.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {image.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Ordre: {image.order}</p>
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/content/immersive/${image.id}`}
                            className="flex-1 text-center px-3 py-2 text-sm text-violet-electric hover:bg-violet-50 rounded-lg transition-colors"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })()}
        </>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Ajouter un média immersive</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit *
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
                  Type de média *
                </label>
                <select
                  required
                  value={formData.mediaType}
                  onChange={(e) => {
                    const newMediaType = e.target.value as 'image' | 'video';
                    setFormData({
                      ...formData,
                      mediaType: newMediaType,
                      imageUrl: newMediaType === 'image' ? formData.imageUrl : '',
                      videoUrl: newMediaType === 'video' ? formData.videoUrl : '',
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                >
                  <option value="image">Image</option>
                  <option value="video">Vidéo</option>
                </select>
              </div>

              {formData.mediaType === 'image' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image (upload) *
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
                      ) : formData.imageUrl ? (
                        <span className="text-green-600">✓ Image uploadée</span>
                      ) : (
                        <span className="text-gray-600">Cliquez pour uploader une image</span>
                      )}
                    </div>
                  </label>
                  {formData.imageUrl && (
                    <p className="text-xs text-gray-500 mt-1">{formData.imageUrl}</p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vidéo (upload) *
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={handleVideoUpload}
                        disabled={uploadingVideo}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-electric transition-colors">
                        {uploadingVideo ? (
                          <span className="text-gray-500">Upload en cours...</span>
                        ) : formData.videoUrl ? (
                          <span className="text-green-600">✓ Vidéo uploadée</span>
                        ) : (
                          <span className="text-gray-600">Cliquez pour uploader une vidéo (MP4, WebM, MOV)</span>
                        )}
                      </div>
                    </label>
                    {formData.videoUrl && (
                      <p className="text-xs text-gray-500 mt-1">{formData.videoUrl}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Taille max: 100MB</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Miniature (optionnel)
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-electric transition-colors">
                        {uploading ? (
                          <span className="text-gray-500">Upload en cours...</span>
                        ) : formData.thumbnailUrl ? (
                          <span className="text-green-600">✓ Miniature uploadée</span>
                        ) : (
                          <span className="text-gray-600">Cliquez pour uploader une miniature</span>
                        )}
                      </div>
                    </label>
                    {formData.thumbnailUrl && (
                      <p className="text-xs text-gray-500 mt-1">{formData.thumbnailUrl}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Image de prévisualisation pour la vidéo</p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Produit (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
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
                  disabled={isSubmitting || (formData.mediaType === 'image' && !formData.imageUrl) || (formData.mediaType === 'video' && !formData.videoUrl)}
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

