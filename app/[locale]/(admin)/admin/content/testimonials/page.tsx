'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

interface Testimonial {
  id: string;
  name: string;
  initial: string;
  rating: number;
  text: any; // JSON { fr: "...", en: "..." }
  product: string;
  date: string;
  order: number;
  isActive: boolean;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState({
    name: '',
    initial: '',
    rating: '5',
    textFr: '',
    textEn: '',
    product: '',
    date: '',
    order: '0',
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/content/testimonials');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details || errorData.error || `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/content/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          initial: formData.initial.toUpperCase().slice(0, 2),
          rating: parseInt(formData.rating),
          text: {
            fr: formData.textFr,
            en: formData.textEn || formData.textFr,
          },
          product: formData.product,
          date: formData.date,
          order: parseInt(formData.order),
          isActive: formData.isActive,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      setShowCreateModal(false);
      setFormData({
        name: '',
        initial: '',
        rating: '5',
        textFr: '',
        textEn: '',
        product: '',
        date: '',
        order: '0',
        isActive: true,
      });
      fetchTestimonials();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;

    try {
      const response = await fetch(`/api/admin/content/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchTestimonials();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const getText = (text: any): string => {
    if (typeof text === 'string') return text;
    if (typeof text === 'object' && text !== null) {
      return text.fr || text.en || Object.values(text)[0] || '';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/content" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Retour
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Témoignages</h2>
          <p className="text-gray-600 mt-1">Gérer les témoignages clients affichés sur le site</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Ajouter un témoignage
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-electric"></div>
          <p className="text-gray-500 mt-4">Chargement des témoignages...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-violet-50 flex items-center justify-center text-violet-electric">
                <span className="text-2xl font-semibold">T</span>
              </div>
            </div>
            <p className="text-gray-500 mb-2 text-lg font-medium">Aucun témoignage pour le moment</p>
            <p className="text-gray-400 text-sm mb-6">
              Commencez par importer les témoignages existants ou créez-en de nouveaux.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/admin/content/import">
                <Button variant="outline">
                  Importer les témoignages existants
                </Button>
              </Link>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Ajouter un témoignage
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
                placeholder="Rechercher un témoignage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterActive('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterActive === 'all'
                    ? 'bg-violet-electric text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterActive('active')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterActive === 'active'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Actifs
              </button>
              <button
                onClick={() => setFilterActive('inactive')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterActive === 'inactive'
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
            const filteredTestimonials = testimonials.filter((testimonial) => {
              const text = getText(testimonial.text);
              const matchesSearch = testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   testimonial.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   text.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesFilter = filterActive === 'all' ||
                                   (filterActive === 'active' && testimonial.isActive) ||
                                   (filterActive === 'inactive' && !testimonial.isActive);
              return matchesSearch && matchesFilter;
            });

            return filteredTestimonials.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">Aucun témoignage ne correspond à votre recherche.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-violet-electric/10 rounded-full flex items-center justify-center">
                      <span className="text-violet-electric font-bold">
                        {testimonial.initial}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.product}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    testimonial.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {testimonial.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 text-sm mb-3 italic">
                  &quot;{getText(testimonial.text)}&quot;
                </p>

                <p className="text-xs text-gray-500 mb-4">{testimonial.date}</p>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/content/testimonials/${testimonial.id}`}
                    className="flex-1 text-center px-3 py-2 text-sm text-violet-electric hover:bg-violet-50 rounded-lg transition-colors"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Supprimer
                  </button>
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
            <h3 className="text-lg font-semibold mb-4">Ajouter un témoignage</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
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
                    Initiales (2 lettres) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={formData.initial}
                    onChange={(e) => setFormData({ ...formData, initial: e.target.value.toUpperCase().slice(0, 2) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (1-5) *
                </label>
                <select
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                >
                  <option value="5">5 étoiles</option>
                  <option value="4">4 étoiles</option>
                  <option value="3">3 étoiles</option>
                  <option value="2">2 étoiles</option>
                  <option value="1">1 étoile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Témoignage (FR) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.textFr}
                  onChange={(e) => setFormData({ ...formData, textFr: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Témoignage (EN)
                </label>
                <textarea
                  rows={3}
                  value={formData.textEn}
                  onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Produit concerné *
                </label>
                <input
                  type="text"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date (ex: "Il y a 2 semaines") *
                </label>
                <input
                  type="text"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="Il y a 2 semaines"
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
                  disabled={isSubmitting}
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

