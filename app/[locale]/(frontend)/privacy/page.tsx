'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/frontend/components/ui/Card';

export default function PrivacyPage() {
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
              Politique de Confidentialité
            </h1>
            <p className="text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <Card className="bg-white border-gray-200 shadow-xl">
            <CardContent className="p-8 md:p-12 prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  eJS MARKET (&quot;nous&quot;, &quot;notre&quot;, &quot;nos&quot;) s&apos;engage à protéger votre vie privée.
                  Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">2. Données collectées</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous collectons les informations suivantes lorsque vous utilisez notre site :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Nom, prénom, adresse email</li>
                  <li>Adresse de livraison et de facturation</li>
                  <li>Informations de paiement (gérées par nos prestataires sécurisés)</li>
                  <li>Historique des commandes</li>
                  <li>Données de navigation et préférences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">3. Utilisation des données</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vos données personnelles sont utilisées pour :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Traiter et gérer vos commandes</li>
                  <li>Vous envoyer des confirmations et mises à jour</li>
                  <li>Améliorer nos services et votre expérience</li>
                  <li>Vous contacter en cas de problème avec votre commande</li>
                  <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">4. Partage des données</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Nos prestataires de paiement sécurisés</li>
                  <li>Nos transporteurs pour la livraison</li>
                  <li>Nos prestataires techniques (hébergement, analyse)</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Tous nos partenaires sont contractuellement tenus de protéger vos données conformément au RGPD.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">5. Vos droits</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Conformément au RGPD, vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Droit d&apos;accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l&apos;effacement</li>
                  <li>Droit à la portabilité</li>
                  <li>Droit d&apos;opposition</li>
                  <li>Droit à la limitation du traitement</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@ejsmarket.com" className="text-violet-electric hover:underline">privacy@ejsmarket.com</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">6. Sécurité</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre
                  tout accès non autorisé, perte ou destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">7. Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Notre site utilise des cookies pour améliorer votre expérience. Pour plus d&apos;informations,
                  consultez notre <Link href="/cookies" className="text-violet-electric hover:underline">Politique des cookies</Link>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">8. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  Pour toute question concernant cette politique de confidentialité, contactez-nous à :
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

