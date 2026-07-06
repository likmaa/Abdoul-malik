'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/frontend/components/ui/Card';

export default function TermsPage() {
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
              Conditions Générales d&apos;Utilisation
            </h1>
            <p className="text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <Card className="bg-white border-gray-200 shadow-xl">
            <CardContent className="p-8 md:p-12 prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">1. Acceptation des conditions</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  En accédant et en utilisant le site eJS MARKET, vous acceptez d&apos;être lié par les présentes 
                  Conditions Générales d&apos;Utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">2. Utilisation du site</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vous vous engagez à utiliser ce site de manière légale et conformément à ces conditions. Vous vous engagez à ne pas :
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Utiliser le site à des fins illégales ou frauduleuses</li>
                  <li>Tenter d&apos;accéder à des zones restreintes du site</li>
                  <li>Transmettre des virus ou codes malveillants</li>
                  <li>Reproduire, copier ou vendre le contenu sans autorisation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">3. Propriété intellectuelle</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tout le contenu de ce site (textes, images, logos, graphismes) est la propriété de eJS MARKET ou de ses partenaires. 
                  Toute reproduction non autorisée est strictement interdite.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">4. Disponibilité du site</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous nous efforçons d&apos;assurer une disponibilité continue du site, mais ne pouvons garantir un accès ininterrompu. 
                  Nous nous réservons le droit d&apos;interrompre l&apos;accès pour maintenance ou mise à jour.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">5. Liens externes</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Notre site peut contenir des liens vers des sites tiers. Nous ne sommes pas responsables du contenu 
                  ou des pratiques de ces sites externes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">6. Limitation de responsabilité</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  eJS MARKET ne saurait être tenu responsable des dommages indirects résultant de l&apos;utilisation ou 
                  de l&apos;impossibilité d&apos;utiliser ce site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">7. Modifications</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prennent effet 
                  dès leur publication sur le site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">8. Droit applicable</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ces conditions sont régies par le droit français. Tout litige relève de la compétence exclusive des tribunaux français.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">9. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  Pour toute question concernant ces conditions, contactez-nous à : 
                  <a href="mailto:legal@ejsmarket.com" className="text-violet-electric hover:underline"> legal@ejsmarket.com</a>
                </p>
              </section>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

