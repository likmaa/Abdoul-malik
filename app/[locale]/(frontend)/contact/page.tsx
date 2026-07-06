'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent } from '@/frontend/components/ui/Card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi (à remplacer par API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      content: 'support@ejsmarket.com',
      link: 'mailto:support@ejsmarket.com',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Téléphone',
      content: '+33 1 23 45 67 89',
      link: 'tel:+33123456789',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Horaires',
      content: 'Lun-Ven: 9h-18h',
      link: null,
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-black-deep mb-4">
              Contactez-nous
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre équipe est là pour vous aider. N&apos;hésitez pas à nous contacter pour toute question.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white border-gray-200 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-black-deep mb-6">Envoyez-nous un message</h2>
                
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3 text-green-800">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-semibold">Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</span>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none transition-all"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none transition-all"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="question">Question générale</option>
                      <option value="order">Question sur ma commande</option>
                      <option value="product">Question sur un produit</option>
                      <option value="return">Retour / Remboursement</option>
                      <option value="technical">Support technique</option>
                      <option value="partnership">Partenariat / Grossiste</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none transition-all resize-none"
                      placeholder="Décrivez votre demande..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full bg-violet-electric hover:bg-violet-700 py-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      'Envoyer le message'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-br from-violet-electric to-purple-600 text-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Autres moyens de nous joindre</h2>
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{method.title}</h3>
                        {method.link ? (
                          <a
                            href={method.link}
                            className="text-white/90 hover:text-white transition-colors"
                          >
                            {method.content}
                          </a>
                        ) : (
                          <p className="text-white/90">{method.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-black-deep mb-4">FAQ</h3>
                <p className="text-gray-600 mb-4">
                  Vous avez une question fréquente ? Consultez notre centre d&apos;aide pour trouver rapidement une réponse.
                </p>
                <Link href="/help">
                  <Button variant="secondary" className="w-full">
                    Accéder au centre d&apos;aide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

