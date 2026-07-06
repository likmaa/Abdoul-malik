'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import Link from 'next/link';

const advantages = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Prix de gros jusqu\'à -20%',
    description: 'Remises progressives selon vos volumes. Plus vous commandez en gros, plus vos prix d\'achat diminuent pour maximiser vos marges de revente.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Dashboard revendeur',
    description: 'Suivez vos commandes en gros, consultez vos historiques d\'achat, téléchargez vos factures professionnelles et gérez vos commandes groupées.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Paiements différés B2B',
    description: 'Conditions de paiement flexibles (30, 60 ou 90 jours) pour optimiser votre trésorerie et gérer vos stocks avant paiement.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Livraisons en gros',
    description: 'Livraisons prioritaires pour commandes volumineuses, regroupement de palettes, gestion logistique simplifiée et suivi en temps réel.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Conseiller commercial dédié',
    description: 'Un interlocuteur unique qui connaît vos besoins, négocie vos meilleurs tarifs et vous conseille sur les produits à fort potentiel de revente.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Données pour optimiser vos ventes',
    description: 'Accès aux fiches techniques complètes, argumentaires commerciaux, visuels produits HD et analyses de marché pour mieux vendre.',
  },
];

const benefits = [
  'Catalogue complet de produits électroniques et jardinage à prix de gros',
  'Remises importantes selon les volumes : de 5% à 20% sur vos commandes',
  'Commandes en gros optimisées pour réduire vos coûts logistiques',
  'Multi-adresses de livraison pour approvisionner plusieurs points de vente',
  'Support technique prioritaire pour vos équipes commerciales',
  'Documentation commerciale et visuels marketing pour faciliter vos ventes',
  'Stock garanti sur les produits phares pour éviter les ruptures',
  'Politique de retour adaptée aux professionnels',
];

export default function BeProPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    vatNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'FR',
    sector: '',
    annualVolume: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/b2b/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Erreur lors de l’envoi de la demande. Veuillez réessayer.');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-electric via-violet-700 to-purple-900 text-white py-20">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Devenez Grossiste Professionnel
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                Rejoignez notre programme B2B pour grossistes et revendeurs.
                Achetez nos produits électroniques et de jardinage en gros à prix préférentiels
                et développez votre activité de revente avec des marges compétitives.
              </p>
              {/* CTA principaux */}
              <div className="flex flex-wrap gap-4 mb-8">
                {/* Fait défiler vers la section formulaire plus bas */}
                <Link href="#bepro-open-account">
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-white text-violet-electric hover:bg-violet-100 border-none"
                  >
                    Ouvrir un compte B2B
                  </Button>
                </Link>
                <Link href="/login?callbackUrl=%2Fb2b">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Se connecter en tant que B2B
                  </Button>
                </Link>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
                <p className="text-white/90 leading-relaxed">
                  <strong className="font-bold">Comment ça fonctionne ?</strong> En tant que grossiste,
                  vous achetez nos produits en grandes quantités à des prix réduits. Vous recevez vos commandes
                  en gros, puis vous les revendez à votre propre clientèle avec votre marge commerciale.
                  Notre rôle : vous approvisionner à moindre coût. Votre rôle : distribuer nos produits sur votre marché.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20 flex items-center gap-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-3xl font-bold block">20%</span>
                    <p className="text-sm text-white/80">de remise max</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20 flex items-center gap-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="text-3xl font-bold block">30j</span>
                    <p className="text-sm text-white/80">paiement différé</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 border border-white/20 flex items-center gap-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <div>
                    <span className="text-3xl font-bold block">24/7</span>
                    <p className="text-sm text-white/80">support dédié</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advantages Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-black-deep mb-4">
              Avantages du Programme Grossiste
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des conditions commerciales avantageuses et des outils dédiés pour optimiser vos achats en gros et maximiser vos marges de revente
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="h-full bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-violet-electric/10 rounded-lg flex items-center justify-center mb-4 text-violet-electric">
                      {advantage.icon}
                    </div>
                    <h3 className="text-xl font-bold text-black-deep mb-3">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {advantage.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-extrabold text-black-deep mb-6">
                Pourquoi devenir Grossiste sur eJS MARKET ?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                En tant que grossiste ou revendeur, vous achetez nos produits en grandes quantités
                à des tarifs préférentiels pour les revendre sur votre marché. Notre programme vous
                offre les meilleures conditions commerciales pour développer votre activité de revente
                en toute sérénité.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-violet-electric rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-lg leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800"
                alt="Équipe professionnelle"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="bepro-open-account" className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-black-deep mb-4">
                Ouvrez votre Compte Grossiste
              </h2>
              <p className="text-lg text-gray-600">
                Remplissez ce formulaire pour devenir partenaire grossiste. Notre équipe commerciale
                examinera votre demande et vous proposera des conditions tarifaires adaptées à votre
                volume d'achat. Réponse sous 24h.
              </p>
            </div>

            {isSubmitted ? (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Demande reçue avec succès !
                  </h3>
                  <p className="text-green-700 mb-6">
                    Notre équipe va examiner votre demande et vous contactera sous 24 heures.
                  </p>
                  <Link href="/">
                    <Button variant="primary">
                      Retour à l'accueil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nom de l'entreprise *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none"
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email professionnel *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none"
                          placeholder="contact@entreprise.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Numéro TVA *
                        </label>
                        <input
                          type="text"
                          name="vatNumber"
                          value={formData.vatNumber}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none"
                          placeholder="FR12345678901"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Adresse *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none"
                        placeholder="123 Rue de la République"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ville *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none"
                          placeholder="Paris"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Code postal *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none"
                          placeholder="75001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pays *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none"
                        >
                          <option value="FR">France</option>
                          <option value="BE">Belgique</option>
                          <option value="ES">Espagne</option>
                          <option value="DE">Allemagne</option>
                          <option value="IT">Italie</option>
                          <option value="NL">Pays-Bas</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Secteur d'activité *
                        </label>
                        <select
                          name="sector"
                          value={formData.sector}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none"
                        >
                          <option value="">Sélectionnez un secteur</option>
                          <option value="retail">Commerce de détail (revendeur physique)</option>
                          <option value="wholesale">Grossiste / Distributeur</option>
                          <option value="ecommerce">E-commerce / Marketplace</option>
                          <option value="chain">Chaîne de magasins</option>
                          <option value="services">Services professionnels</option>
                          <option value="other">Autre type de revendeur</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Volume annuel estimé *
                        </label>
                        <select
                          name="annualVolume"
                          value={formData.annualVolume}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none"
                        >
                          <option value="">Sélectionnez un volume</option>
                          <option value="<50k">Moins de 50 000€</option>
                          <option value="50k-100k">50 000€ - 100 000€</option>
                          <option value="100k-250k">100 000€ - 250 000€</option>
                          <option value="250k-500k">250 000€ - 500 000€</option>
                          <option value=">500k">Plus de 500 000€</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message (optionnel)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-electric focus:border-violet-electric outline-none resize-none"
                        placeholder="Dites-nous en plus sur vos besoins..."
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full bg-violet-electric hover:bg-violet-700 text-white py-4 text-lg font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Envoi en cours...
                          </span>
                        ) : (
                          'Envoyer ma demande'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
