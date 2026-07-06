'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent } from '@/frontend/components/ui/Card';

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

export default function EditTestimonialPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    const fetchTestimonial = async () => {
      try {
        const response = await fetch(`/api/admin/content/testimonials/${id}`);
        if (!response.ok) throw new Error('Erreur lors du chargement');
        const data = await response.json();
        const testimonial: Testimonial = data.testimonial;
        
        const text = typeof testimonial.text === 'string' 
          ? JSON.parse(testimonial.text) 
          : testimonial.text;
        
        setFormData({
          name: testimonial.name,
          initial: testimonial.initial,
          rating: testimonial.rating.toString(),
          textFr: text?.fr || '',
          textEn: text?.en || '',
          product: testimonial.product,
          date: testimonial.date,
          order: testimonial.order.toString(),
          isActive: testimonial.isActive,
        });
      } catch (error) {
        alert('Erreur lors du chargement du témoignage');
        router.push('/admin/content/testimonials');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchTestimonial();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/content/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          initial: formData.initial,
          rating: parseInt(formData.rating),
          text: {
            fr: formData.textFr,
            en: formData.textEn,
          },
          product: formData.product,
          date: formData.date,
          order: parseInt(formData.order),
          isActive: formData.isActive,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la modification');
      }

      router.push('/admin/content/testimonials');
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
        <Link href="/admin/content/testimonials" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
          ← Retour
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Modifier le témoignage</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du client *
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
                Initiales (2 caractères) *
              </label>
              <input
                type="text"
                required
                maxLength={2}
                value={formData.initial}
                onChange={(e) => setFormData((prev) => ({ ...prev, initial: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                placeholder="ML"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note (1-5) *
              </label>
              <select
                required
                value={formData.rating}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
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
                value={formData.textFr}
                onChange={(e) => setFormData((prev) => ({ ...prev, textFr: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Témoignage (EN) *
              </label>
              <textarea
                required
                value={formData.textEn}
                onChange={(e) => setFormData((prev) => ({ ...prev, textEn: e.target.value }))}
                rows={4}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, product: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric"
                placeholder="Il y a 2 semaines"
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Modification...' : 'Modifier'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/content/testimonials')}
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

