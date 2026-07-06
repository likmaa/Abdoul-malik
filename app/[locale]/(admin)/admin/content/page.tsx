'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

type TabType = 'partners' | 'testimonials' | 'hero' | 'immersive';

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('partners');

  const tabs = [
    { id: 'partners' as TabType, label: 'Partenaires', href: '/admin/content/partners' },
    { id: 'testimonials' as TabType, label: 'Témoignages', href: '/admin/content/testimonials' },
    { id: 'hero' as TabType, label: 'Images Hero', href: '/admin/content/hero' },
    { id: 'immersive' as TabType, label: 'Images Immersives', href: '/admin/content/immersive' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion du Contenu</h2>
        <p className="text-gray-600 mt-1">Gérer le contenu dynamique du site</p>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-violet-electric text-violet-electric'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Carte d'import */}
      <Card className="border-2 border-dashed border-violet-electric/30 bg-violet-electric/5">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Importer les contenus actuels
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Importez les contenus statiques actuels (partenaires, témoignages, images) dans la base de données pour les rendre modifiables.
              </p>
            </div>
            <Link href="/admin/content/import">
              <Button variant="primary">
                Importer maintenant
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contenu selon l'onglet actif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tabs.map((tab) => (
          <Link key={tab.id} href={tab.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tab.label}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {tab.id === 'partners' && 'Gérer les logos des partenaires'}
                  {tab.id === 'testimonials' && 'Gérer les témoignages clients'}
                  {tab.id === 'hero' && 'Gérer les images du hero (grid 2 cartes)'}
                  {tab.id === 'immersive' && 'Gérer les images immersives 3D'}
                </p>
                <Button variant="outline" className="w-full">
                  Gérer →
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

