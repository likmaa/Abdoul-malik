'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

export default function ShippingPage() {
  const shippingZones = [
    {
      name: 'Zone 1 - France',
      countries: ['France'],
      price: 'Gratuite dès 100€',
      delay: '3-5 jours ouvrés',
      icon: '🇫🇷',
    },
    {
      name: 'Zone 2 - Europe de l\'Ouest',
      countries: ['Belgique', 'Allemagne', 'Luxembourg', 'Pays-Bas', 'Suisse'],
      price: '9.90€',
      delay: '5-7 jours ouvrés',
      icon: '🇪🇺',
    },
    {
      name: 'Zone 3 - Europe du Sud',
      countries: ['Espagne', 'Italie', 'Portugal'],
      price: '14.90€',
      delay: '7-10 jours ouvrés',
      icon: '🇪🇺',
    },
    {
      name: 'Zone 4 - Autres pays UE',
      countries: ['Autres pays de l\'Union Européenne'],
      price: '19.90€',
      delay: '10-14 jours ouvrés',
      icon: '🇪🇺',
    },
  ];

  const shippingMethods = [
    {
      name: 'Livraison Standard',
      description: 'Livraison à domicile ou en point relais',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
    {
      name: 'Livraison Express',
      description: 'Livraison en 24-48h (uniquement Zone 1)',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: 'Livraison Gros Volume',
      description: 'Pour les produits volumineux (tondeuses, robots...)',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  const trackingFeatures = [
    'Numéro de suivi par email dès l\'expédition',
    'Suivi en temps réel sur notre site',
    'Notifications SMS (optionnel)',
    'Alertes de livraison',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-off-white via-white to-gray-50 py-12">
      <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-violet-electric/10 rounded-2xl mb-6">
              <svg className="w-10 h-10 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-black-deep mb-4">
              Informations de livraison
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez nos options de livraison et nos tarifs pour toute l&apos;Europe
            </p>
          </motion.div>
        </div>

        {/* Zones de livraison */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black-deep mb-8 text-center">Nos zones de livraison</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingZones.map((zone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white border-gray-200 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{zone.icon}</div>
                    <h3 className="text-xl font-bold text-black-deep mb-2">{zone.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {zone.countries.join(', ')}
                    </p>
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <div>
                        <span className="text-sm font-semibold text-black-deep">Tarif : </span>
                        <span className="text-sm text-gray-700">{zone.price}</span>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-black-deep">Délai : </span>
                        <span className="text-sm text-gray-700">{zone.delay}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Méthodes de livraison */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black-deep mb-8 text-center">Nos méthodes de livraison</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {shippingMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white border-gray-200 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-violet-electric/10 rounded-xl flex items-center justify-center mx-auto mb-6 text-violet-electric">
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-bold text-black-deep mb-3">{method.name}</h3>
                    <p className="text-gray-600">{method.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Suivi de commande */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-black-deep mb-4">Suivez votre colis en temps réel</h2>
                  <p className="text-gray-700 mb-6">
                    Dès l&apos;expédition de votre commande, vous recevez toutes les informations nécessaires pour suivre votre colis jusqu&apos;à la livraison.
                  </p>
                  <ul className="space-y-3 mb-6">
                    {trackingFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-violet-electric flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/tracking">
                    <Button variant="primary" className="bg-violet-electric hover:bg-violet-700">
                      Suivre ma commande
                    </Button>
                  </Link>
                </div>
                <div className="relative h-64 bg-white rounded-xl p-8 flex items-center justify-center border border-gray-200">
                  <svg className="w-32 h-32 text-violet-electric/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold text-black-deep mb-8 text-center">Questions fréquentes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-black-deep mb-3">Puis-je choisir mon transporteur ?</h3>
                <p className="text-gray-600">
                  Nous sélectionnons automatiquement le transporteur le plus adapté selon votre localisation et le type de produit. Pour les livraisons express, vous pouvez choisir lors de la commande.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-black-deep mb-3">Que faire si mon colis est endommagé ?</h3>
                <p className="text-gray-600">
                  Signalez-le immédiatement au transporteur lors de la livraison et contactez-nous dans les 48h. Nous vous proposerons un échange ou un remboursement.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-black-deep mb-3">Puis-je modifier l&apos;adresse de livraison ?</h3>
                <p className="text-gray-600">
                  Oui, tant que la commande n&apos;est pas expédiée. Contactez-nous au plus vite après votre commande pour toute modification.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-black-deep mb-3">Y a-t-il des frais supplémentaires ?</h3>
                <p className="text-gray-600">
                  Les tarifs affichés sont tous inclus. Aucun frais caché. Les frais de dédouanement pour les livraisons hors UE sont à votre charge.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

