'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/frontend/components/ui/Card';

export default function CookiesPage() {
  const cookieTypes = [
    {
      name: 'Cookies essentiels',
      description: 'Nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.',
      examples: ['Session utilisateur', 'Panier d\'achat', 'Préférences de langue'],
    },
    {
      name: 'Cookies analytiques',
      description: 'Nous aident à comprendre comment les visiteurs utilisent notre site.',
      examples: ['Google Analytics', 'Statistiques de visite'],
    },
    {
      name: 'Cookies de préférences',
      description: 'Mémorisent vos choix pour améliorer votre expérience.',
      examples: ['Préférences d\'affichage', 'Région sélectionnée'],
    },
    {
      name: 'Cookies marketing',
      description: 'Utilisés pour vous proposer des publicités personnalisées (avec votre consentement).',
      examples: ['Publicités ciblées', 'Suivi des conversions'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-off-white via-white to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-black-deep mb-4">
              Politique des Cookies
            </h1>
            <p className="text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <Card className="bg-white border-gray-200 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. 
                  Il permet au site de mémoriser vos actions et préférences pendant une certaine période.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">2. Comment utilisons-nous les cookies ?</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Nous utilisons des cookies pour :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Assurer le bon fonctionnement du site</li>
                  <li>Mémoriser vos préférences (langue, région)</li>
                  <li>Conserver les articles dans votre panier</li>
                  <li>Analyser l&apos;utilisation du site pour l&apos;améliorer</li>
                  <li>Personnaliser votre expérience (avec votre consentement)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">3. Types de cookies utilisés</h2>
                <div className="space-y-4">
                  {cookieTypes.map((type, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-black-deep mb-2">{type.name}</h3>
                      <p className="text-gray-700 mb-3">{type.description}</p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Exemples :</span> {type.examples.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">4. Gestion des cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vous pouvez gérer vos préférences de cookies à tout moment :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Via les paramètres de votre navigateur</li>
                  <li>Via notre bannière de consentement (si disponible)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Notez que la désactivation de certains cookies peut affecter le fonctionnement du site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">5. Cookies tiers</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Certains cookies sont placés par des services tiers (ex: Google Analytics, réseaux sociaux). 
                  Nous n&apos;avons pas de contrôle direct sur ces cookies. Consultez les politiques de confidentialité 
                  de ces tiers pour plus d&apos;informations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">6. Durée de conservation</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les cookies de session sont supprimés à la fermeture de votre navigateur. Les cookies persistants 
                  restent sur votre appareil jusqu&apos;à leur expiration ou jusqu&apos;à ce que vous les supprimiez.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">7. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  Pour toute question concernant notre utilisation des cookies, contactez-nous à : 
                  <a href="mailto:privacy@ejsmarket.com" className="text-violet-electric hover:underline"> privacy@ejsmarket.com</a>
                </p>
              </section>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

