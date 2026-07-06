'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { PlusCircleIcon, VideoBadgeIcon } from '@/admin-panel/components/admin/AdminIcons';

interface HeroImage {
  id: string;
  type: 'tech' | 'garden';
  name: string;
  mediaType: 'image' | 'video';
  imageUrl: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  price: number | null;
  productId: string | null;
  available: boolean;
  order: number;
  isActive: boolean;
}

export default function HeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'tech' | 'garden'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [products, setProducts] = useState<{ id: string; name: string; price: number }[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [formData, setFormData] = useState({
    type: 'tech' as 'tech' | 'garden',
    name: '',
    mediaType: 'image' as 'image' | 'video',
    imageUrl: '',
    videoUrl: '',
    thumbnailUrl: '',
    price: '',
    productId: '',
    available: true,
    order: '0',
    isActive: true,
  });

  useEffect(() => {
    fetchImages();
  }, [filterType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Charger la liste des produits pour le sélecteur
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch('/api/products?limit=100');
        const data = await response.json();
        if (data.products) {
          setProducts(data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price
          })));
        }
      } catch (error) {
        console.error('Erreur chargement produits:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const params = filterType !== 'all' ? `?type=${filterType}` : '';
      const response = await fetch(`/api/admin/content/hero-images${params}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details || errorData.error || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Erreur lors du chargement des images hero:', error);
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
      const response = await fetch('/api/admin/content/hero-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: formData.mediaType === 'image' ? formData.imageUrl : null,
          videoUrl: formData.mediaType === 'video' ? formData.videoUrl : null,
          thumbnailUrl: formData.thumbnailUrl || null,
          price: formData.price ? Math.round(parseFloat(formData.price) * 100) : null,
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
        type: 'tech',
        name: '',
        mediaType: 'image',
        imageUrl: '',
        videoUrl: '',
        thumbnailUrl: '',
        price: '',
        productId: '',
        available: true,
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
      const response = await fetch(`/api/admin/content/hero-images/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchImages();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const filteredImages = images.filter((img) => {
    const matchesType = filterType === 'all' || img.type === filterType;
    const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = filterActive === 'all' ||
      (filterActive === 'active' && img.isActive) ||
      (filterActive === 'inactive' && !img.isActive);
    return matchesType && matchesSearch && matchesActive;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/content" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Retour
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Images Hero</h2>
          <p className="text-gray-600 mt-1">Gérer les images de la grille hero (2 cartes)</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <span className="flex items-center gap-2">
            <PlusCircleIcon className="w-4 h-4" />
            <span>Ajouter une image</span>
          </span>
        </Button>
      </div>

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
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${filterType === 'all'
              ? 'bg-violet-electric text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilterType('tech')}
            className={`px-4 py-2 rounded-lg transition-colors ${filterType === 'tech'
              ? 'bg-violet-electric text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Tech
          </button>
          <button
            onClick={() => setFilterType('garden')}
            className={`px-4 py-2 rounded-lg transition-colors ${filterType === 'garden'
              ? 'bg-violet-electric text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Jardin
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

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-electric"></div>
          <p className="text-gray-500 mt-4">Chargement des images hero...</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-violet-50 flex items-center justify-center text-violet-electric">
                <span className="text-2xl font-semibold">H</span>
              </div>
            </div>
            <p className="text-gray-500 mb-2 text-lg font-medium">Aucune image hero pour le moment</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id}>
              <CardContent className="p-0">
                <div className="relative h-48 bg-gray-100">
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
                    <span className={`px-2 py-1 text-xs rounded ${image.type === 'tech'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {image.type === 'tech' ? 'Tech' : 'Jardin'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${image.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {image.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{image.name}</h3>
                  {image.price && (
                    <p className="text-sm text-gray-600 mb-2">
                      {(image.price / 100).toFixed(2)}€
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mb-4">Ordre: {image.order}</p>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/content/hero/${image.id}`}
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
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Ajouter un média hero</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type (Tech/Jardin) *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'tech' | 'garden' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                >
                  <option value="tech">Tech</option>
                  <option value="garden">Jardin</option>
                </select>
              </div>

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
                  Prix (€) - optionnel
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lier à un produit (optionnel)
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => {
                    const selectedProduct = products.find(p => p.id === e.target.value);
                    if (selectedProduct) {
                      setFormData({
                        ...formData,
                        productId: selectedProduct.id,
                        name: formData.name || selectedProduct.name,
                        price: formData.price || selectedProduct.price.toString()
                      });
                    } else {
                      setFormData({ ...formData, productId: '' });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                >
                  <option value="">-- Aucun produit --</option>
                  {loadingProducts ? (
                    <option disabled>Chargement...</option>
                  ) : (
                    products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price.toFixed(2)}€
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">Sélectionnez un produit pour pré-remplir le nom et le prix</p>
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

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 text-violet-electric border-gray-300 rounded focus:ring-violet-electric"
                  />
                  <label htmlFor="available" className="text-sm text-gray-700">
                    Disponible
                  </label>
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

