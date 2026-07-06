'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent } from '@/frontend/components/ui/Card';

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

export default function EditImmersiveImagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/admin/content/immersive-images/${id}`);
        if (!response.ok) throw new Error('Erreur lors du chargement');
        const data = await response.json();
        const image: ImmersiveImage = data.image;

        setFormData({
          name: image.name,
          mediaType: image.mediaType || 'image',
          imageUrl: image.imageUrl || '',
          videoUrl: image.videoUrl || '',
          thumbnailUrl: image.thumbnailUrl || '',
          productId: image.productId || '',
          order: image.order.toString(),
          isActive: image.isActive,
        });
      } catch (error) {
        alert('Erreur lors du chargement de l\'image');
        router.push('/admin/content/immersive');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchImage();
  }, [id, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/content/immersive-images/${id}`, {
        method: 'PUT',
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
        throw new Error(error.error || 'Erreur lors de la modification');
      }

      router.push('/admin/content/immersive');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la modification');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-electric"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content/immersive" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
          ← Retour
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Modifier l'image immersive</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
                  setFormData((prev) => ({
                    ...prev,
                    mediaType: newMediaType,
                    imageUrl: newMediaType === 'image' ? prev.imageUrl : '',
                    videoUrl: newMediaType === 'video' ? prev.videoUrl : '',
                  }));
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
                  <div className="mt-2 relative h-32 w-32">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover rounded" />
                  </div>
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
                    <div className="mt-2 relative h-32 w-32">
                      <img src={formData.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover rounded" />
                    </div>
                  )}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, productId: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, order: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-violet-electric focus:ring-violet-electric"
                />
                <span className="text-sm text-gray-700">Actif</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={isSubmitting || (formData.mediaType === 'image' && !formData.imageUrl) || (formData.mediaType === 'video' && !formData.videoUrl)}
              >
                {isSubmitting ? 'Modification...' : 'Modifier'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/content/immersive')}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

