'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice, getProductImageUrl } from '@/backend/lib/utils';
import Link from 'next/link';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface TrackingStep {
  id: string;
  label: string;
  date?: string;
  completed: boolean;
  isActive?: boolean;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  totalTTC: number;
  trackingNumber?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    priceTTC: number;
    image: string;
  }>;
  createdAt: string;
  estimatedDelivery?: string;
}

interface OrderTrackingModalProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

const getTrackingSteps = (status: OrderDetails['status']): TrackingStep[] => {
  const steps: TrackingStep[] = [
    { id: 'confirmed', label: 'Commande confirmée', completed: true },
    { id: 'processing', label: 'En préparation', completed: status !== 'PENDING' },
    { id: 'shipped', label: 'Expédiée', completed: ['SHIPPED', 'DELIVERED'].includes(status) },
    { id: 'delivery', label: 'En livraison', completed: status === 'DELIVERED', isActive: status === 'SHIPPED' },
    { id: 'delivered', label: 'Livrée', completed: status === 'DELIVERED' },
  ];

  return steps;
};

const getStatusColor = (status: OrderDetails['status']) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PAID: 'bg-blue-100 text-blue-800 border-blue-200',
    PROCESSING: 'bg-purple-100 text-purple-800 border-purple-200',
    SHIPPED: 'bg-violet-100 text-violet-800 border-violet-200',
    DELIVERED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    REFUNDED: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[status];
};

const getStatusLabel = (status: OrderDetails['status']) => {
  const labels = {
    PENDING: 'En attente de paiement',
    PAID: 'Payée',
    PROCESSING: 'En préparation',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
    REFUNDED: 'Remboursée',
  };
  return labels[status];
};

export function OrderTrackingModal({ order, isOpen, onClose }: OrderTrackingModalProps) {
  if (!order) return null;

  const trackingSteps = getTrackingSteps(order.status);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all">
          {/* Header avec gradient */}
          <div className="bg-gradient-to-r from-violet-electric to-purple-600 px-8 py-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle className="text-3xl font-extrabold text-white mb-2">
                  Commande {order.orderNumber}
                </DialogTitle>
                <p className="text-white/90 text-sm">
                  Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-5 py-2.5 rounded-xl border-2 text-sm font-semibold bg-white/20 backdrop-blur-sm border-white/30 text-white`}>
                  {getStatusLabel(order.status)}
                </span>
                <p className="text-3xl font-bold text-white">
                  {formatPrice(order.totalTTC)}
                </p>
              </div>
            </div>

            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2 backdrop-blur-sm"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-8">
              {/* Tracking Timeline */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-violet-electric/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-black-deep">
                    Évolution de votre commande
                  </h3>
                </div>

                <div className="relative pl-8">
                  {/* Timeline Line avec gradient */}
                  <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-violet-electric to-gray-300 rounded-full"></div>

                  {/* Steps */}
                  <div className="space-y-10">
                    {trackingSteps.map((step, index) => {
                      const stepIndex = index + 1;

                      return (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="relative flex items-start gap-6"
                        >
                          {/* Step Icon */}
                          <div className="relative z-10 flex-shrink-0">
                            {step.completed ? (
                              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-green-100">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : step.isActive ? (
                              <div className="w-14 h-14 bg-gradient-to-br from-violet-electric to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-violet-100 animate-pulse">
                                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                                  <span className="text-violet-electric font-bold text-sm">{stepIndex}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center ring-4 ring-gray-100">
                                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                                  <span className="text-gray-400 font-bold text-sm">{stepIndex}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 pt-3">
                            <h4 className={`text-xl font-bold mb-2 ${step.completed || step.isActive ? 'text-black-deep' : 'text-gray-400'
                              }`}>
                              {step.label}
                            </h4>
                            {step.date && (
                              <p className="text-sm text-gray-500 mb-3">
                                {new Date(step.date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            )}
                            {step.isActive && order.trackingNumber && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-4 p-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border-2 border-violet-200 shadow-sm"
                              >
                                <div className="flex items-start gap-3">
                                  <svg className="w-6 h-6 text-violet-electric flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800 mb-2">
                                      Numéro de suivi
                                    </p>
                                    <p className="text-lg font-mono text-violet-electric font-bold mb-2">
                                      {order.trackingNumber}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      Vous pouvez suivre votre colis en temps réel avec ce numéro sur le site de votre transporteur
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-black-deep">Adresse de livraison</h3>
                </div>
                <div className="text-gray-700 space-y-1">
                  <p className="font-semibold text-black-deep text-lg">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  <p>
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="text-lg font-bold text-black-deep">Articles commandés</h3>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img
                          src={getProductImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-black-deep text-lg mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Quantité : <span className="font-semibold text-black-deep">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-black-deep">
                          {formatPrice(item.priceTTC * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="p-8 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border-2 border-violet-200">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-violet-electric/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black-deep mb-3">Besoin d&apos;aide ?</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Si vous avez des questions sur votre commande ou votre livraison, notre équipe support est disponible pour vous accompagner.
                    </p>
                    <Link href="/contact" onClick={onClose}>
                      <Button variant="secondary" className="bg-white hover:bg-gray-50 text-violet-electric border-2 border-violet-electric hover:border-violet-700">
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Contacter le support
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

