'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { useTranslations, useLocale } from 'next-intl';

export default function CGVPage() {
  const t = useTranslations('CGV');
  const locale = useLocale();

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
              {t('title')}
            </h1>
            <p className="text-gray-600">
              {t('lastUpdate')} : {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <Card className="bg-white border-gray-200 shadow-xl">
            <CardContent className="p-8 md:p-12 prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">{t('sections.legal')}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>dénomination sociale :</strong> eJS MARKET<br />
                  <strong>Email :</strong> <a href="mailto:contact@ejsmarket.com" className="text-violet-electric hover:underline">contact@ejsmarket.com</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-black-deep mb-4">{t('sections.object')}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {locale === 'es'
                    ? "Las presentes Condiciones Generales de Venta (CGV) rigen las ventas de productos realizadas en el sitio eJS MARKET."
                    : "Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits réalisées sur le site eJS MARKET."
                  }
                </p>
              </section>

              {/* ... other sections translated similarly or via more JSON keys ... */}
              <p className="text-sm text-gray-500 italic mt-8">
                {locale === 'es'
                  ? "Esta página está siendo traducida. Para más detalles, por favor contacte con soporte."
                  : "Cette page est en cours de traduction complète. Pour plus de détails, veuillez contacter le support."
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

