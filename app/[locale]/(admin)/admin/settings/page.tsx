'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Button } from '@/frontend/components/ui/Button';

const DEFAULT_NEWSBAR_TEXT =
  'Livraison Gratuite en Europe dès 100€ ⚡️ Nouveaux Robots Husqvarna en stock ⚡️ -10% sur Apple avec le code EJS10 ⚡️';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingNewsBar, setIsLoadingNewsBar] = useState(true);
  const [settings, setSettings] = useState({
    siteName: 'eJS MARKET',
    siteDescription: 'Plateforme e-commerce multi-produits',
    contactEmail: 'contact@ejsmarket.com',
    supportEmail: 'support@ejsmarket.com',
    defaultCurrency: 'EUR',
    defaultLanguage: 'fr',
    maintenanceMode: false,
    newsBarText: DEFAULT_NEWSBAR_TEXT,
  });

  useEffect(() => {
    async function loadNewsBar() {
      try {
        const res = await fetch('/api/settings/newsbar');
        if (!res.ok) return;
        const data = await res.json();
        if (data.newsBarText && typeof data.newsBarText === 'string') {
          setSettings((prev) => ({
            ...prev,
            newsBarText: data.newsBarText,
          }));
        }
      } catch {
        // On garde la valeur par défaut
      } finally {
        setIsLoadingNewsBar(false);
      }
    }

    loadNewsBar();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Sauvegarde du texte de la NewsBar
      const res = await fetch('/api/settings/newsbar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newsBarText: settings.newsBarText }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de la sauvegarde de la NewsBar');
      }

      // TODO: Sauvegarder les autres paramètres quand l’API globale existera
      alert('Paramètres sauvegardés avec succès');
    } catch (error) {
      console.error('[Settings] Erreur lors de la sauvegarde:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la sauvegarde des paramètres',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuration du Site</h2>
        <p className="text-gray-600 mt-1">Gérer les paramètres généraux de la plateforme</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contact
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de support
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Barre d&apos;actualités (NewsBar)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Texte affiché tout en haut du site, défilant horizontalement. Utilisez ce bandeau pour les promotions,
            informations de livraison, codes promo, etc.
          </p>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texte de la NewsBar
            </label>
            <textarea
              rows={3}
              value={settings.newsBarText}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  newsBarText: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
              placeholder={DEFAULT_NEWSBAR_TEXT}
              disabled={isLoadingNewsBar}
            />
            <p className="text-xs text-gray-500">
              Maximum 500 caractères. Le texte sera répété dans le bandeau défilant.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres Régionaux</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devise par défaut
              </label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue par défaut
              </label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-electric focus:border-transparent"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mode Maintenance</h3>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-4 h-4 text-violet-electric border-gray-300 rounded focus:ring-violet-electric"
            />
            <label htmlFor="maintenanceMode" className="text-sm text-gray-700">
              Activer le mode maintenance (le site sera inaccessible aux visiteurs)
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Sauvegarde...' : 'Enregistrer les paramètres'}
        </Button>
      </div>
    </div>
  );
}

