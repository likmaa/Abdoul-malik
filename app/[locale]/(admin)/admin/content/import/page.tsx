'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

// Données statiques actuelles extraites du code
const currentPartners = [
  { name: 'Apple', local: '/logos/apple.svg', cdn: 'https://cdn.simpleicons.org/apple/000000' },
  { name: 'Samsung', local: '/logos/samsung.svg', cdn: 'https://cdn.simpleicons.org/samsung/1428A0' },
  { name: 'Sony', local: '/logos/sony.svg', cdn: 'https://cdn.simpleicons.org/sony/000000' },
  { name: 'LG', local: '/logos/lg.svg', cdn: 'https://cdn.simpleicons.org/lg/A50034' },
  { name: 'Dell', local: '/logos/dell.svg', cdn: 'https://cdn.simpleicons.org/dell/007DB8' },
  { name: 'HP', local: '/logos/hp.svg', cdn: 'https://cdn.simpleicons.org/hp/0096D6' },
  { name: 'Lenovo', local: '/logos/lenovo.svg', cdn: 'https://cdn.simpleicons.org/lenovo/E2231A' },
  { name: 'ASUS', local: '/logos/asus.svg', cdn: 'https://cdn.simpleicons.org/asus/000000' },
  { name: 'Acer', local: '/logos/acer.svg', cdn: 'https://cdn.simpleicons.org/acer/83B81A' },
  { name: 'MSI', local: '/logos/msi.svg', cdn: 'https://cdn.simpleicons.org/msi/FF0000' },
  { name: 'Nikon', local: '/logos/nikon.svg', cdn: 'https://cdn.simpleicons.org/nikon/000000' },
  { name: 'Panasonic', local: '/logos/panasonic.svg', cdn: 'https://cdn.simpleicons.org/panasonic/EB1923' },
  { name: 'JBL', local: '/logos/jbl.svg', cdn: 'https://cdn.simpleicons.org/jbl/FF3300' },
  { name: 'Google', local: '/logos/google.svg', cdn: 'https://cdn.simpleicons.org/google/4285F4' },
  { name: 'PlayStation', local: '/logos/playstation.svg', cdn: 'https://cdn.simpleicons.org/playstation/003087' },
  { name: 'Intel', local: '/logos/intel.svg', cdn: 'https://cdn.simpleicons.org/intel/0071C5' },
  { name: 'AMD', local: '/logos/amd.svg', cdn: 'https://cdn.simpleicons.org/amd/ED1C24' },
  { name: 'NVIDIA', local: '/logos/nvidia.svg', cdn: 'https://cdn.simpleicons.org/nvidia/76B900' },
  { name: 'Husqvarna', local: '/logos/husqvarna.svg', cdn: 'https://cdn.simpleicons.org/husqvarna/27378C' },
  { name: 'STIHL', local: '/logos/stihl.svg', cdn: 'https://cdn.simpleicons.org/stihl/000000' },
  { name: 'Bosch', local: '/logos/bosch.svg', cdn: 'https://cdn.simpleicons.org/bosch/EA0016' },
  { name: 'Xiaomi', local: '/logos/xiaomi.svg', cdn: 'https://cdn.simpleicons.org/xiaomi/FF6900' },
  { name: 'OnePlus', local: '/logos/oneplus.svg', cdn: 'https://cdn.simpleicons.org/oneplus/EB0028' },
  { name: 'Razer', local: '/logos/razer.svg', cdn: 'https://cdn.simpleicons.org/razer/00FF00' },
  { name: 'Logitech', local: '/logos/logitech.svg', cdn: 'https://cdn.simpleicons.org/logitech/00B8FC' },
];

const currentTestimonials = [
  { name: 'Marie L.', initial: 'ML', rating: 5, text: 'Livraison rapide et produit de qualité. Je recommande vivement !', product: 'iPhone 15 Pro', date: 'Il y a 2 semaines' },
  { name: 'Jean D.', initial: 'JD', rating: 5, text: 'Excellent service client et robot tondeuse parfait. Mon jardin n\'a jamais été aussi beau !', product: 'Robot Tondeuse Automower', date: 'Il y a 1 mois' },
  { name: 'Sophie M.', initial: 'SM', rating: 5, text: 'Très satisfaite de mon iPhone 15 Pro, merci pour ce service impeccable !', product: 'iPhone 15 Pro', date: 'Il y a 3 semaines' },
  { name: 'Thomas B.', initial: 'TB', rating: 5, text: 'MacBook Pro M3 exceptionnel ! Livraison express et emballage soigné.', product: 'MacBook Pro M3', date: 'Il y a 5 jours' },
  { name: 'Laura K.', initial: 'LK', rating: 5, text: 'PlayStation 5 enfin trouvée ici ! Commande facile et suivi parfait.', product: 'PlayStation 5', date: 'Il y a 1 semaine' },
];

const currentTechImages = [
  { url: '/img1.webp', name: 'iPhone 15 Pro Max', price: 1399, available: true },
  { url: '/img2.webp', name: 'MacBook Pro M3', price: 2499, available: true },
  { url: '/img3.webp', name: 'PlayStation 5', price: 499, available: false },
];

const currentJardinImages = [
  { url: '/jard1.webp', name: 'Robot Tondeuse Automower 430X', price: 2499, available: true },
  { url: '/jard2.webp', name: 'Tondeuse Robot Gardena', price: 899, available: true },
  { url: '/jard3.webp', name: 'Tronçonneuse STIHL', price: 349, available: true },
];

const currentImmersiveImages = [
  { url: '/img1.webp', name: 'iPhone 15 Pro Max' },
  { url: '/img2.webp', name: 'MacBook Pro M3' },
  { url: '/img3.webp', name: 'PlayStation 5' },
];

export default function ImportContentPage() {
  const [importing, setImporting] = useState<string | null>(null);
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImport = async (type: 'partners' | 'testimonials' | 'hero-tech' | 'hero-garden' | 'immersive') => {
    setImporting(type);
    setErrors({});

    try {
      if (type === 'partners') {
        for (let i = 0; i < currentPartners.length; i++) {
          const partner = currentPartners[i];
          try {
            const response = await fetch('/api/admin/content/partners', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: partner.name,
                logoPath: partner.local,
                cdnUrl: partner.cdn,
                width: 120,
                height: 40,
                alt: `Logo ${partner.name}`,
                order: i,
                isActive: true,
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Erreur lors de l\'import');
            }
          } catch (error) {
            setErrors(prev => ({
              ...prev,
              [`partner-${i}`]: error instanceof Error ? error.message : 'Erreur inconnue',
            }));
          }
        }
      } else if (type === 'testimonials') {
        for (let i = 0; i < currentTestimonials.length; i++) {
          const testimonial = currentTestimonials[i];
          try {
            const response = await fetch('/api/admin/content/testimonials', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: testimonial.name,
                initial: testimonial.initial,
                rating: testimonial.rating,
                text: {
                  fr: testimonial.text,
                  en: testimonial.text,
                },
                product: testimonial.product,
                date: testimonial.date,
                order: i,
                isActive: true,
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Erreur lors de l\'import');
            }
          } catch (error) {
            setErrors(prev => ({
              ...prev,
              [`testimonial-${i}`]: error instanceof Error ? error.message : 'Erreur inconnue',
            }));
          }
        }
      } else if (type === 'hero-tech') {
        for (let i = 0; i < currentTechImages.length; i++) {
          const image = currentTechImages[i];
          try {
            const response = await fetch('/api/admin/content/hero-images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'tech',
                name: image.name,
                imageUrl: image.url,
                price: image.price ? Math.round(image.price * 100) : null,
                available: image.available,
                order: i,
                isActive: true,
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Erreur lors de l\'import');
            }
          } catch (error) {
            setErrors(prev => ({
              ...prev,
              [`hero-tech-${i}`]: error instanceof Error ? error.message : 'Erreur inconnue',
            }));
          }
        }
      } else if (type === 'hero-garden') {
        for (let i = 0; i < currentJardinImages.length; i++) {
          const image = currentJardinImages[i];
          try {
            const response = await fetch('/api/admin/content/hero-images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'garden',
                name: image.name,
                imageUrl: image.url,
                price: image.price ? Math.round(image.price * 100) : null,
                available: image.available,
                order: i,
                isActive: true,
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Erreur lors de l\'import');
            }
          } catch (error) {
            setErrors(prev => ({
              ...prev,
              [`hero-garden-${i}`]: error instanceof Error ? error.message : 'Erreur inconnue',
            }));
          }
        }
      } else if (type === 'immersive') {
        for (let i = 0; i < currentImmersiveImages.length; i++) {
          const image = currentImmersiveImages[i];
          try {
            const response = await fetch('/api/admin/content/immersive-images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: image.name,
                imageUrl: image.url,
                order: i,
                isActive: true,
              }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Erreur lors de l\'import');
            }
          } catch (error) {
            setErrors(prev => ({
              ...prev,
              [`immersive-${i}`]: error instanceof Error ? error.message : 'Erreur inconnue',
            }));
          }
        }
      }

      setImported(prev => new Set([...prev, type]));
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/content" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
          ← Retour
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Importer les Contenus Actuels</h2>
        <p className="text-gray-600 mt-1">
          Importez les contenus statiques actuels dans la base de données pour les rendre modifiables depuis l'admin.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Attention :</strong> Cette action va créer les contenus dans la base de données. 
          Vous pourrez ensuite les modifier ou les supprimer depuis les pages de gestion respectives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Partenaires */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Partenaires</h3>
            <p className="text-sm text-gray-600 mb-4">
              {currentPartners.length} partenaires à importer
            </p>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {currentPartners.slice(0, 5).map((p, i) => (
                <div key={i} className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  {p.name}
                </div>
              ))}
              {currentPartners.length > 5 && (
                <div className="text-xs text-gray-400">... et {currentPartners.length - 5} autres</div>
              )}
            </div>
            {errors['partner-0'] && (
              <p className="text-xs text-red-600 mb-2">{errors['partner-0']}</p>
            )}
            <Button
              variant="primary"
              onClick={() => handleImport('partners')}
              disabled={importing !== null || imported.has('partners')}
              className="w-full"
            >
              {importing === 'partners' ? 'Import en cours...' : imported.has('partners') ? '✓ Importé' : 'Importer les partenaires'}
            </Button>
          </CardContent>
        </Card>

        {/* Témoignages */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Témoignages</h3>
            <p className="text-sm text-gray-600 mb-4">
              {currentTestimonials.length} témoignages à importer
            </p>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {currentTestimonials.map((t, i) => (
                <div key={i} className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  {t.name} - {t.product}
                </div>
              ))}
            </div>
            {errors['testimonial-0'] && (
              <p className="text-xs text-red-600 mb-2">{errors['testimonial-0']}</p>
            )}
            <Button
              variant="primary"
              onClick={() => handleImport('testimonials')}
              disabled={importing !== null || imported.has('testimonials')}
              className="w-full"
            >
              {importing === 'testimonials' ? 'Import en cours...' : imported.has('testimonials') ? '✓ Importé' : 'Importer les témoignages'}
            </Button>
          </CardContent>
        </Card>

        {/* Images Hero Tech */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Images Hero - Tech</h3>
            <p className="text-sm text-gray-600 mb-4">
              {currentTechImages.length} images à importer
            </p>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {currentTechImages.map((img, i) => (
                <div key={i} className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  {img.name} - {img.price}€
                </div>
              ))}
            </div>
            {errors['hero-tech-0'] && (
              <p className="text-xs text-red-600 mb-2">{errors['hero-tech-0']}</p>
            )}
            <Button
              variant="primary"
              onClick={() => handleImport('hero-tech')}
              disabled={importing !== null || imported.has('hero-tech')}
              className="w-full"
            >
              {importing === 'hero-tech' ? 'Import en cours...' : imported.has('hero-tech') ? '✓ Importé' : 'Importer les images Tech'}
            </Button>
          </CardContent>
        </Card>

        {/* Images Hero Jardin */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Images Hero - Jardin</h3>
            <p className="text-sm text-gray-600 mb-4">
              {currentJardinImages.length} images à importer
            </p>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {currentJardinImages.map((img, i) => (
                <div key={i} className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  {img.name} - {img.price}€
                </div>
              ))}
            </div>
            {errors['hero-garden-0'] && (
              <p className="text-xs text-red-600 mb-2">{errors['hero-garden-0']}</p>
            )}
            <Button
              variant="primary"
              onClick={() => handleImport('hero-garden')}
              disabled={importing !== null || imported.has('hero-garden')}
              className="w-full"
            >
              {importing === 'hero-garden' ? 'Import en cours...' : imported.has('hero-garden') ? '✓ Importé' : 'Importer les images Jardin'}
            </Button>
          </CardContent>
        </Card>

        {/* Images Immersives */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Images Immersives</h3>
            <p className="text-sm text-gray-600 mb-4">
              {currentImmersiveImages.length} images à importer
            </p>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {currentImmersiveImages.map((img, i) => (
                <div key={i} className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                  {img.name}
                </div>
              ))}
            </div>
            {errors['immersive-0'] && (
              <p className="text-xs text-red-600 mb-2">{errors['immersive-0']}</p>
            )}
            <Button
              variant="primary"
              onClick={() => handleImport('immersive')}
              disabled={importing !== null || imported.has('immersive')}
              className="w-full"
            >
              {importing === 'immersive' ? 'Import en cours...' : imported.has('immersive') ? '✓ Importé' : 'Importer les images immersives'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {Object.keys(errors).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-red-900 mb-2">Erreurs lors de l'import :</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(errors).map(([key, error]) => (
                <li key={key}>• {error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {imported.size > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>✓ Import terminé !</strong> Vous pouvez maintenant gérer ces contenus depuis les pages respectives :
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from(imported).map((type) => (
              <Link
                key={type}
                href={
                  type === 'partners' ? '/admin/content/partners' :
                  type === 'testimonials' ? '/admin/content/testimonials' :
                  type.startsWith('hero') ? '/admin/content/hero' :
                  '/admin/content/immersive'
                }
                className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
              >
                Voir {type === 'partners' ? 'les partenaires' :
                  type === 'testimonials' ? 'les témoignages' :
                  type.startsWith('hero') ? 'les images hero' :
                  'les images immersives'}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

