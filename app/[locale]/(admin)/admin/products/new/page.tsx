'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';
import { getProductImageUrl } from '@/backend/lib/utils';
import RichTextEditor from '@/frontend/components/admin/RichTextEditor';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    brandLink: '',
    priceHT: '',
    stock: '1',
    category: '',
    categoryId: '',
    description: '',
    weight: '1.0',
    length: '10',
    width: '10',
    height: '10',
    defaultVATRate: '0.21',
    isActive: true,
    features: [''], // Liste des points forts
    specifications: '', // Format texte pour simplifier ou JSON
    deliveryInfo: '',
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/admin/categories');
        const data = await response.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Erreur chargement catégories:', error);
      }
    }
    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await fetch('/api/admin/products/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!response.ok) {
          const error = await response.json();
          errors.push(`${file.name}: ${error.error || 'Erreur lors de l\'upload'}`);
          continue;
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      if (uploadedUrls.length > 0) {
        setImages([...images, ...uploadedUrls]);
      }

      if (errors.length > 0) {
        alert(`Erreurs lors de l'upload:\n${errors.join('\n')}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
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
      // Parser les spécifications sous forme d'objet JSON simple
      const specLines = formData.specifications.split('\n').filter(l => l.trim() !== '');
      const specifications: Record<string, string> = {};
      specLines.forEach(line => {
        if (line.includes(':')) {
          const [key, ...val] = line.split(':');
          specifications[key.trim()] = val.join(':').trim();
        } else {
          specifications[`info_${Math.random().toString(36).substr(2, 5)}`] = line.trim();
        }
      });

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sku: formData.sku,
          name: { fr: formData.name, en: formData.name, es: formData.name },
          description: formData.description ? { fr: formData.description, en: formData.description, es: formData.description } : undefined,
          priceHT: Math.round(parseFloat(formData.priceHT) * 100),
          stock: parseInt(formData.stock) || 0,
          brand: formData.brand,
          brandLink: formData.brandLink || undefined,
          category: formData.category,
          categoryId: formData.categoryId || undefined,
          weight: parseFloat(formData.weight),
          dimensions: {
            length: parseFloat(formData.length),
            width: parseFloat(formData.width),
            height: parseFloat(formData.height),
          },
          defaultVATRate: parseFloat(formData.defaultVATRate),
          images: images,
          features: formData.features.filter(f => f.trim() !== ''),
          specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
          deliveryInfo: formData.deliveryInfo ? { info: formData.deliveryInfo } : undefined,
          isActive: formData.isActive,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      router.push('/admin/products');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la création du produit');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nouveau Produit</h2>
          <p className="text-gray-600 mt-1">Ajouter un nouveau produit au catalogue</p>
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
                      placeholder="iPhone 15 Pro"
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
                        placeholder="APP-IPH-0001"
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
                        placeholder="Apple"
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
                  Prix & Stock
                </h3>
                <div className="grid grid-cols-2 gap-4">
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
                      placeholder="999.00"
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
                      placeholder="10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Logistique & TVA
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poids (kg) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
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
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Long. (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.length}
                      onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Larg. (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.width}
                      onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Haut. (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                  Images du Produit
                </h3>

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
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter des images
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      multiple
                      className="hidden"
                    />
                    <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-violet-electric transition-colors">
                      {uploading ? (
                        <span className="text-gray-500">Upload en cours...</span>
                      ) : (
                        <span className="text-gray-600">Cliquez pour sélectionner des images</span>
                      )}
                    </div>
                  </label>
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
                {isSubmitting ? 'Création...' : 'Créer le produit'}
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

