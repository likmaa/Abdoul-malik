'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: 1,
      title: 'Demander une autorisation',
      description: 'Contactez-nous via le formulaire de contact ou votre espace client pour obtenir une autorisation de retour.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      step: 2,
      title: 'Préparer le colis',
      description: 'Remettez le produit dans son emballage d\'origine avec tous les accessoires et la documentation.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      step: 3,
      title: 'Envoyer le retour',
      description: 'Nous vous fournirons une étiquette de retour. Collez-la sur le colis et déposez-le dans un point relais.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
    {
      step: 4,
      title: 'Remboursement',
      description: 'Dès réception et vérification, votre remboursement sera effectué dans les 14 jours sur votre moyen de paiement d\'origine.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const returnConditions = [
    {
      title: 'Délai de rétractation',
      content: 'Vous disposez de 14 jours calendaires à compter de la réception de votre commande pour exercer votre droit de rétractation.',
    },
    {
      title: 'État du produit',
      content: 'Le produit doit être retourné dans son emballage d\'origine, non utilisé, non assemblé, avec tous les accessoires et la documentation.',
    },
    {
      title: 'Frais de retour',
      content: 'Les frais de retour sont à votre charge, sauf en cas de produit défectueux ou d\'erreur de notre part. Dans ce cas, nous prenons en charge tous les frais.',
    },
    {
      title: 'Produits exclus',
      content: 'Les produits personnalisés, les produits numériques déverrouillés et certains produits hygiéniques ne peuvent pas être retournés.',
    },
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-black-deep mb-4">
              Politique de retour
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Retournez facilement vos produits dans les 14 jours suivant la réception
            </p>
          </motion.div>
        </div>

        {/* Processus de retour */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black-deep mb-8 text-center">Comment retourner un produit ?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white border-gray-200 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-violet-electric rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-violet-electric/10 rounded-xl flex items-center justify-center mb-4 text-violet-electric">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-bold text-black-deep mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Conditions de retour */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black-deep mb-8 text-center">Conditions de retour</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {returnConditions.map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white border-gray-200 h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-black-deep mb-3">{condition.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{condition.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <Card className="bg-gradient-to-r from-violet-electric to-purple-600">
            <CardContent className="p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Besoin d&apos;aide pour votre retour ?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Notre équipe est disponible pour vous accompagner dans votre démarche de retour et répondre à toutes vos questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="secondary" className="bg-white text-violet-electric hover:bg-gray-100">
                    Nous contacter
                  </Button>
                </Link>
                <Link href="/help">
                  <Button variant="secondary" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20">
                    Centre d&apos;aide
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

