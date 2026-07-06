'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent } from '@/frontend/components/ui/Card';

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

export default function EditPartnerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
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
    const fetchPartner = async () => {
      try {
        const response = await fetch(`/api/admin/content/partners/${id}`);
        if (!response.ok) throw new Error('Erreur lors du chargement');
        const data = await response.json();
        const partner: Partner = data.partner;

        setFormData({
          name: partner.name,
          logoPath: partner.logoPath,
          cdnUrl: partner.cdnUrl || '',
          width: partner.width?.toString() || '',
          height: partner.height?.toString() || '',
          alt: partner.alt,
          order: partner.order.toString(),
          isActive: partner.isActive,
        });
      } catch (error) {
        alert('Erreur lors du chargement du partenaire');
        router.push('/admin/content/partners');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPartner();
  }, [id, router]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      alert('Erreur lors de l\'upload du logo');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/content/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cdnUrl: formData.cdnUrl || null,
          width: formData.width ? parseInt(formData.width) : null,
          height: formData.height ? parseInt(formData.height) : null,
          order: parseInt(formData.order),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la modification');
      }

      router.push('/admin/content/partners');
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
        <Link href="/admin/content/partners" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
          ← Retour
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Modifier le partenaire</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du partenaire *
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
                Logo (upload) *
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-electric transition-colors">
                  {uploading ? (
                    <span className="text-gray-500">Upload en cours...</span>
                  ) : formData.logoPath ? (
                    <span className="text-green-600">✓ Logo uploadé</span>
                  ) : (
                    <span className="text-gray-600">Cliquez pour uploader un logo</span>
                  )}
                </div>
              </label>
              {formData.logoPath && (
                <div className="mt-2 relative h-20 w-32">
                  <img src={formData.logoPath} alt="Logo preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL CDN (optionnel)
              </label>
              <input
                type="url"
                value={formData.cdnUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, cdnUrl: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                placeholder="https://cdn.example.com/logo.svg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Largeur (px) - optionnel
                </label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData((prev) => ({ ...prev, width: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hauteur (px) - optionnel
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, alt: e.target.value }))}
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
                disabled={isSubmitting || !formData.logoPath}
              >
                {isSubmitting ? 'Modification...' : 'Modifier'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/content/partners')}
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

