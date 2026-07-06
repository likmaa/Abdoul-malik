'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { useCart } from '@/frontend/contexts/CartContext';
import { formatPrice, calculateTTC } from '@/backend/lib/utils';
import { useSession } from 'next-auth/react';
import { Toast } from '@/frontend/components/Toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { cart, totalTTC, totalHT, totalVAT, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: session?.user?.email || '',
    firstName: session?.user?.name?.split(' ')[0] || '',
    lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Espagne',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('virement');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          items: cart,
          totalHT,
          totalTTC,
          vatAmount: totalVAT,
          shippingCost: 0, // À adapter si besoin
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de la commande');
      }

      // Vider le panier et rediriger vers la page de confirmation
      clearCart();
      router.push(`/orders/confirmation/${data.orderId}`);
    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-electric"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black-deep mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8">Ajoutez des produits avant de passer commande</p>
          <Link href="/products">
            <Button variant="primary">Continuer les achats</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-black-deep mb-8">
            Finaliser votre commande
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulaire */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations de livraison */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-black-deep mb-6">Informations de livraison</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          Ville *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric"
                        />
                      </div>
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                          Code postal *
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                          Pays *
                        </label>
                        <select
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric"
                        >
                          <option value="Espagne">Espagne</option>
                          <option value="France">France</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                          <option value="Luxembourg">Luxembourg</option>
                          <option value="Italie">Italie</option>
                          <option value="Portugal">Portugal</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-soft rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-electric"
                        />
                      </div>
                    </div>

                    {/* Méthode de paiement */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-bold text-black-deep mb-4">Méthode de paiement</h3>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border-2 border-violet-electric bg-violet-electric/5 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="payment"
                            value="virement"
                            checked={paymentMethod === 'virement'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mr-3 text-violet-electric focus:ring-violet-electric"
                          />
                          <div className="flex-1">
                            <span className="font-medium">Virement bancaire</span>
                            <p className="text-sm text-gray-500">Traitement manuel après réception des fonds (IBAN fourni après validation)</p>
                          </div>
                        </label>

                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-sm text-amber-800 flex gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Le virement bancaire est actuellement le seul moyen de paiement accepté.
                          </p>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 italic">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Traitement en cours...' : `Payer ${formatPrice(totalTTC)}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Récapitulatif */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-black-deep mb-6">Récapitulatif</h2>

                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex gap-4">
                        <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-black-deep line-clamp-2">{item.name}</p>
                          <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                          <p className="text-sm font-bold text-violet-electric mt-1">
                            {formatPrice(calculateTTC(item.priceHT, item.vatRate) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{formatPrice(totalTTC)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Livraison</span>
                      <span className="font-medium text-green-garden">Gratuite</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-violet-electric">{formatPrice(totalTTC)}</span>
                    </div>
                  </div>

                  <Link href="/cart" className="block mt-6 text-center text-violet-electric hover:underline text-sm">
                    Modifier le panier
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

