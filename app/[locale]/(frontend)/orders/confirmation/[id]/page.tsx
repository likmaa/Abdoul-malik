'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { formatPrice } from '@/backend/lib/utils';

import { publicEnv } from '@/frontend/config/publicEnv';

export default function OrderConfirmationPage() {
    const t = useTranslations('OrderConfirmation');
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Pour des raisons de simplicité, on utilise l'API admin si l'utilisateur est admin
                // ou on pourrait créer une API /api/orders/[id] spécifique pour l'utilisateur.
                // Ici, on va simuler ou appeler une API (à créer si besoin)
                const response = await fetch(`/api/admin/orders/${orderId}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data.order);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de la commande:', error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-off-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-electric"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-off-white py-12">
            <div className="container mx-auto px-4 md:px-12 lg:px-24">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-black-deep mb-4">{t('title')}</h1>
                        <p className="text-gray-600 text-lg mb-6">
                            {t('thankYou')}
                        </p>

                        {/* ID de commande mis en évidence avec bouton copier */}
                        <div className="bg-violet-electric/10 rounded-xl p-6 inline-block">
                            <p className="text-sm text-gray-600 mb-2">{t('orderNumberLabel')}</p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-2xl md:text-3xl font-bold text-violet-electric tracking-wide">
                                    {orderId}
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(orderId);
                                        alert(t('copySuccess'));
                                    }}
                                    className="p-2 bg-violet-electric text-white rounded-lg hover:bg-violet-electric/80 transition-colors"
                                    title="Copier"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{t('keepNumber')}</p>
                        </div>
                    </motion.div>

                    {/* Section Comment suivre sa commande */}
                    <Card className="mb-8 border-green-garden/20 border-2 bg-green-50/50">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold text-black-deep mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-green-garden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                {t('trackingTitle')}
                            </h2>
                            <div className="space-y-3 text-sm text-gray-700">
                                <p className="flex items-start gap-2">
                                    <span className="bg-green-garden text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                                    {t('trackingStep1')} <strong className="text-violet-electric">{orderId}</strong>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="bg-green-garden text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                                    {t('trackingStep2')}
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="bg-green-garden text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                                    {t('trackingStep3')}
                                </p>
                            </div>
                            <Link href={`/tracking?order=${orderId}`} className="mt-4 inline-block">
                                <Button variant="outline" className="border-green-garden text-green-garden hover:bg-green-100">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {t('trackButton')}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="mb-8 border-violet-electric/20 border-2">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-black-deep mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {t('bankTransferTitle')}
                            </h2>

                            <div className="bg-violet-soft/30 rounded-xl p-6 space-y-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">{t('beneficiary')} :</span>
                                    <span className="md:col-span-2 font-bold text-black-deep">{publicEnv.BANK_BENEFICIARY}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">{t('bank')} :</span>
                                    <span className="md:col-span-2 font-bold text-black-deep">{publicEnv.BANK_NAME}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">IBAN :</span>
                                    <span className="md:col-span-2 font-mono font-bold text-black-deep text-lg">{publicEnv.BANK_IBAN}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">BIC / SWIFT :</span>
                                    <span className="md:col-span-2 font-mono font-bold text-black-deep">{publicEnv.BANK_BIC}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">{t('amount')} :</span>
                                    <span className="md:col-span-2 font-bold text-violet-electric text-xl">
                                        {order ? formatPrice(order.totalTTC) : '...'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <span className="text-gray-500 font-medium">{t('reference')} :</span>
                                    <span className="md:col-span-2 font-bold bg-violet-electric text-white px-3 py-1 rounded inline-block w-fit">
                                        {orderId}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3 italic">
                                <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-amber-800">
                                    {t('paymentNote')}
                                </p>
                            </div>

                            {/* Section Upload de preuve */}
                            {!order?.paymentProofUrl ? (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-lg font-bold text-black-deep mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-green-garden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        {t('uploadTitle')}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {t('uploadText')}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="file"
                                            id="proof-upload"
                                            className="hidden"
                                            accept="image/*,.pdf"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    formData.append('orderId', orderId);

                                                    try {
                                                        const res = await fetch('/api/orders/upload-proof', {
                                                            method: 'POST',
                                                            body: formData
                                                        });
                                                        if (res.ok) {
                                                            const data = await res.json();
                                                            setOrder({ ...order, paymentProofUrl: data.proofUrl });
                                                            alert(t('copySuccess'));
                                                        }
                                                    } catch (err) {
                                                        alert('Error');
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={() => document.getElementById('proof-upload')?.click()}
                                            variant="outline"
                                            className="w-full sm:w-auto border-green-garden text-green-garden hover:bg-green-50"
                                        >
                                            {t('uploadButton')}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100 flex items-center gap-3">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-green-800 font-medium">{t('uploadSuccess')}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link href="/profile/orders">
                            <Button variant="outline" size="lg" className="w-full md:w-auto">{t('myOrders')}</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="primary" size="lg" className="w-full md:w-auto">{t('backHome')}</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
