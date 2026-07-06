'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';

export default function HelpPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const faqCategories = [
    {
      id: 'orders',
      title: 'Commandes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      questions: [
        {
          id: 'order-1',
          question: 'Comment passer une commande ?',
          answer: 'Parcourez notre catalogue, ajoutez les produits au panier, puis procédez au paiement. Vous recevrez un email de confirmation avec votre numéro de commande.',
        },
        {
          id: 'order-2',
          question: 'Puis-je modifier ma commande après validation ?',
          answer: 'Une fois la commande validée, vous pouvez nous contacter dans les 2 heures pour toute modification. Après ce délai, la commande sera en cours de préparation.',
        },
        {
          id: 'order-3',
          question: 'Comment suivre ma commande ?',
          answer: 'Vous pouvez suivre votre commande en utilisant la page "Suivre ma commande" avec votre numéro de commande. Vous recevrez également des emails de mise à jour.',
        },
      ],
    },
    {
      id: 'payment',
      title: 'Paiement',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      questions: [
        {
          id: 'payment-1',
          question: 'Quels moyens de paiement acceptez-vous ?',
          answer: 'Actuellement, nous acceptons uniquement les paiements par virement bancaire pour garantir une sécurité maximale. Les coordonnées bancaires sont fournies à la fin de votre commande.',
        },
        {
          id: 'payment-2',
          question: 'Mes paiements sont-ils sécurisés ?',
          answer: 'Oui, le virement bancaire est l\'une des méthodes les plus sûres. De plus, toutes les données de notre site sont protégées par un cryptage SSL.',
        },
        {
          id: 'payment-3',
          question: 'Quand ma commande sera-t-elle validée ?',
          answer: 'Votre commande sera validée et préparée dès que nous aurons reçu la confirmation de réception des fonds par notre banque (généralement sous 24h à 48h).',
        },
      ],
    },
    {
      id: 'shipping',
      title: 'Livraison',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      questions: [
        {
          id: 'shipping-1',
          question: 'Quels sont les délais de livraison ?',
          answer: 'Les délais varient selon votre localisation et le produit commandé. En général, comptez 3-5 jours ouvrés en Europe. Les produits volumineux peuvent prendre jusqu\'à 10 jours.',
        },
        {
          id: 'shipping-2',
          question: 'Livrez-vous partout en Europe ?',
          answer: 'Oui, nous livrons dans tous les pays de l\'Union Européenne. Les frais de port varient selon la destination et le poids du colis.',
        },
        {
          id: 'shipping-3',
          question: 'Puis-je suivre mon colis en temps réel ?',
          answer: 'Oui, dès l\'expédition, vous recevez un numéro de suivi par email qui vous permet de suivre votre colis en temps réel sur le site du transporteur.',
        },
      ],
    },
    {
      id: 'returns',
      title: 'Retours & Remboursements',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      questions: [
        {
          id: 'returns-1',
          question: 'Puis-je retourner un produit ?',
          answer: 'Oui, vous avez 14 jours pour retourner un produit non utilisé dans son emballage d\'origine. Les frais de retour sont à votre charge sauf en cas de produit défectueux.',
        },
        {
          id: 'returns-2',
          question: 'Comment procéder au retour ?',
          answer: 'Contactez-nous via le formulaire de contact ou votre espace client pour obtenir une autorisation de retour. Nous vous fournirons ensuite une étiquette de retour.',
        },
        {
          id: 'returns-3',
          question: 'Quand serai-je remboursé ?',
          answer: 'Le remboursement est effectué dans les 14 jours suivant la réception et la vérification du produit retourné. Le montant est crédité sur le même moyen de paiement utilisé.',
        },
      ],
    },
    {
      id: 'products',
      title: 'Produits',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      questions: [
        {
          id: 'products-1',
          question: 'Les produits sont-ils garantis ?',
          answer: 'Oui, tous nos produits bénéficient de la garantie constructeur. La durée varie selon le produit et la marque (généralement 1 à 2 ans).',
        },
        {
          id: 'products-2',
          question: 'Proposez-vous du service après-vente ?',
          answer: 'Oui, notre service après-vente est disponible pour tous les produits achetés sur eJS MARKET. Contactez-nous pour toute assistance technique ou problème.',
        },
        {
          id: 'products-3',
          question: 'Les produits sont-ils neufs ?',
          answer: 'Oui, tous nos produits sont neufs et authentiques. Nous travaillons directement avec les fabricants et distributeurs officiels.',
        },
      ],
    },
  ];

  const quickLinks = [
    {
      title: 'Suivre ma commande',
      href: '/orders',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      title: 'Politique de retour',
      href: '/returns',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      title: 'Informations de livraison',
      href: '/shipping',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
    {
      title: 'Nous contacter',
      href: '/contact',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-black-deep mb-4">
              Centre d&apos;aide
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions les plus fréquentes
            </p>
          </motion.div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {quickLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={link.href}>
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3 text-violet-electric">
                      {link.icon}
                    </div>
                    <p className="text-sm font-semibold text-black-deep">{link.title}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <button
                    onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-violet-electric/10 rounded-xl flex items-center justify-center text-violet-electric">
                        {category.icon}
                      </div>
                      <h2 className="text-xl font-bold text-black-deep">{category.title}</h2>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform ${openCategory === category.id ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {openCategory === category.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 space-y-4"
                      >
                        {category.questions.map((faq) => (
                          <div key={faq.id} className="border-t border-gray-200 pt-4">
                            <button
                              onClick={() => setOpenQuestion(openQuestion === faq.id ? null : faq.id)}
                              className="w-full flex items-start justify-between text-left gap-4"
                            >
                              <h3 className="font-semibold text-black-deep flex-1">{faq.question}</h3>
                              <svg
                                className={`w-5 h-5 text-violet-electric flex-shrink-0 transition-transform ${openQuestion === faq.id ? 'rotate-180' : ''
                                  }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <AnimatePresence>
                              {openQuestion === faq.id && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-3 text-gray-600 leading-relaxed"
                                >
                                  {faq.answer}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-violet-electric to-purple-600">
            <CardContent className="p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
              <p className="text-white/90 mb-6">Notre équipe est là pour vous aider</p>
              <Link href="/contact">
                <button className="px-6 py-3 bg-white text-violet-electric rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                  Nous contacter
                </button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

