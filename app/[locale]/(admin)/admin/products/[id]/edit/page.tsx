'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n-navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { getProductImageUrl } from '@/backend/lib/utils';
import RichTextEditor from '@/frontend/components/admin/RichTextEditor';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    priceHT: '',
    defaultVATRate: '0.21',
    weight: '0',
    dimensions: {
      length: '0',
      width: '0',
      height: '0',
    },
    stock: '',
    category: '',
    categoryId: '',
    description: '',
    isActive: true,
    brandLink: '',
    features: [''],
    specifications: '',
    deliveryInfo: '',
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');

  // Charger les données du produit et les catégories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories first
        const catRes = await fetch('/api/admin/categories');
        const catData = await catRes.json();
        const cats = catData.categories || [];
        setCategories(cats);

        // Then fetch product
        const prodRes = await fetch(`/api/admin/products/${id}`);
        if (!prodRes.ok) throw new Error('Produit non trouvé');
        const prodData = await prodRes.json();
        const product = prodData.product;

        setFormData({
          name: typeof product.name === 'string' ? product.name : product.name?.fr || '',
          sku: product.sku,
          brand: product.brand,
          priceHT: (product.priceHT / 100).toFixed(2),
          defaultVATRate: (product.defaultVATRate || 0.21).toString(),
          weight: (product.weight || 0).toString(),
          dimensions: {
            length: (product.dimensions?.length || 0).toString(),
            width: (product.dimensions?.width || 0).toString(),
            height: (product.dimensions?.height || 0).toString(),
          },
          stock: product.stock.toString(),
          category: product.category,
          categoryId: product.categoryId || '',
          description: typeof product.description === 'string' ? product.description : product.description?.fr || '',
          isActive: product.isActive,
          brandLink: product.brandLink || '',
          features: product.features && product.features.length > 0 ? product.features : [''],
          specifications: product.specifications ? Object.entries(product.specifications).map(([k, v]) => `${k}: ${v}`).join('\n') : '',
          deliveryInfo: product.deliveryInfo?.info || '',
        });

        // Determine parent/sub for classification
        if (product.categoryId) {
          let foundParentId = '';
          let foundSubId = '';

          const parent = cats.find((c: any) => c.id === product.categoryId);
          if (parent) {
            foundParentId = parent.id;
          } else {
            for (const c of cats) {
              const sub = c.children?.find((s: any) => s.id === product.categoryId);
              if (sub) {
                foundParentId = c.id;
                foundSubId = sub.id;
                break;
              }
            }
          }
          setSelectedParentId(foundParentId);
          setSelectedSubId(foundSubId);
        }

        setImages(product.images || []);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    try {
      // Uploader chaque fichier
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/admin/products/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            errors.push(`${file.name}: ${error.error || 'Erreur lors de l\'upload'}`);
            continue;
          }

          const data = await response.json();
          uploadedUrls.push(data.url);
        } catch (error) {
          errors.push(`${file.name}: Erreur lors de l'upload`);
        }
      }

      // Ajouter toutes les images uploadées avec succès
      if (uploadedUrls.length > 0) {
        setImages([...images, ...uploadedUrls]);
      }

      // Afficher les erreurs s'il y en a
      if (errors.length > 0) {
        alert(`Erreurs lors de l'upload:\n${errors.join('\n')}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
      // Réinitialiser l'input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: { fr: formData.name, en: formData.name, es: formData.name },
          description: formData.description ? { fr: formData.description, en: formData.description, es: formData.description } : undefined,
          priceHT: Math.round(parseFloat(formData.priceHT) * 100),
          defaultVATRate: parseFloat(formData.defaultVATRate),
          weight: parseFloat(formData.weight),
          dimensions: {
            length: parseFloat(formData.dimensions.length),
            width: parseFloat(formData.dimensions.width),
            height: parseFloat(formData.dimensions.height),
          },
          stock: parseInt(formData.stock) || 0,
          brand: formData.brand,
          brandLink: formData.brandLink || undefined,
          category: formData.category,
          categoryId: formData.categoryId || undefined,
          images: images,
          features: formData.features.filter(f => f.trim() !== ''),
          specifications: (() => {
            const specLines = formData.specifications.split('\n').filter(l => l.trim() !== '');
            const specs: Record<string, string> = {};
            specLines.forEach(line => {
              if (line.includes(':')) {
                const [key, ...val] = line.split(':');
                specs[key.trim()] = val.join(':').trim();
              } else {
                specs[`info_${Math.random().toString(36).substr(2, 5)}`] = line.trim();
              }
            });
            return Object.keys(specs).length > 0 ? specs : undefined;
          })(),
          deliveryInfo: formData.deliveryInfo ? { info: formData.deliveryInfo } : undefined,
          isActive: formData.isActive,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du produit');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="text-gray-500 hover:text-gray-700"
            >
              ← Retour
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Modifier le Produit</h2>
          </div>
          <p className="text-gray-600 mt-1">SKU: {formData.sku}</p>
        </div>
        <Link href="/admin/products">
          <Button variant="outline">Annuler</Button>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations Générales
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marque *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) =>
                        setFormData({ ...formData, description: value })
                      }
                      placeholder="Décrivez votre produit... Utilisez les boutons pour mettre en forme."
                      rows={6}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Prix, TVA & Stock
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix HT (€) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.priceHT}
                      onChange={(e) =>
                        setFormData({ ...formData, priceHT: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taux TVA (ex: 0.21) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="1"
                      step="0.01"
                      value={formData.defaultVATRate}
                      onChange={(e) =>
                        setFormData({ ...formData, defaultVATRate: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Marque & Liens
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lien du site officiel
                    </label>
                    <input
                      type="url"
                      value={formData.brandLink}
                      onChange={(e) =>
                        setFormData({ ...formData, brandLink: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                      placeholder="https://www.apple.com/iphone"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Points forts (Highlights)
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                  >
                    + Ajouter
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Ex: Puce A17 Pro révolutionnaire"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            features: formData.features.filter((_, i) => i !== index)
                          })}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Spécifications & Livraison
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spécifications Techniques
                    </label>
                    <RichTextEditor
                      value={formData.specifications}
                      onChange={(value) => setFormData({ ...formData, specifications: value })}
                      placeholder="Ex: Poids: 187g, Écran: 6.1 pouces... (Un par ligne)"
                      rows={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informations de livraison
                    </label>
                    <RichTextEditor
                      value={formData.deliveryInfo}
                      onChange={(value) => setFormData({ ...formData, deliveryInfo: value })}
                      placeholder="Détails sur les délais, les zones desservies..."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Logistique (Poids & Dimensions)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longueur (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.dimensions.length}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, length: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Largeur (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.dimensions.width}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, width: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hauteur (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.dimensions.height}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: { ...formData.dimensions, height: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Images du Produit
                </h3>

                {/* Images existantes */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                          <img
                            src={getProductImageUrl(imageUrl)}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          aria-label="Supprimer l'image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload de nouvelles images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter des images
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        multiple
                        className="hidden"
                      />
                      <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-electric transition-colors">
                        {uploading ? (
                          <span className="text-gray-500">Upload en cours...</span>
                        ) : (
                          <span className="text-gray-600">Cliquez pour sélectionner une ou plusieurs images</span>
                        )}
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Formats acceptés: JPEG, PNG, WebP. Taille max: 5MB par image. Vous pouvez sélectionner plusieurs images à la fois.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Paramètres
                </h3>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie *
                      </label>
                      <select
                        required
                        value={selectedParentId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedParentId(val);
                          setSelectedSubId('');
                          const cat = categories.find(c => c.id === val);
                          setFormData({
                            ...formData,
                            categoryId: val,
                            category: cat ? (cat.name.fr || cat.name.en || cat.slug) : ''
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric bg-white"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name.fr || cat.name.en || cat.slug}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedParentId && categories.find(c => c.id === selectedParentId)?.children?.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sous-catégorie
                        </label>
                        <select
                          value={selectedSubId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedSubId(val);
                            const sub = categories.find(c => c.id === selectedParentId)?.children?.find((c: any) => c.id === val);
                            setFormData({
                              ...formData,
                              categoryId: val || selectedParentId,
                              category: sub ? (sub.name.fr || sub.name.en || sub.slug) : (categories.find(c => c.id === selectedParentId)?.name.fr || '')
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric bg-white"
                        >
                          <option value="">Sélectionner une sous-catégorie (Optionnel)</option>
                          {categories.find(c => c.id === selectedParentId)?.children?.map((child: any) => (
                            <option key={child.id} value={child.id}>
                              {child.name.fr || child.name.en || child.slug}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-4 h-4 text-violet-electric border-gray-300 rounded focus:ring-violet-electric"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">
                      Produit actif
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
              <Link href="/admin/products">
                <Button variant="outline" className="w-full">
                  Annuler
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

