'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/frontend/components/ui/Button';
import { Badge } from '@/frontend/components/ui/Badge';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { MobileProductCard } from '@/frontend/components/mobile';
import { formatPrice, calculateTTC, getProductImageUrl } from '@/backend/lib/utils';
import { useCart } from '@/frontend/contexts/CartContext';
import { Toast } from '@/frontend/components/Toast';

// Données mockées étendues (à remplacer par API)
const mockProducts = {
  '1': {
    id: '1',
    sku: 'APP-IPH-0001',
    name: 'iPhone 15 Pro',
    creator: 'Apple',
    description: {
      fr: 'Le dernier iPhone avec puce A17 Pro révolutionnaire, écran Super Retina XDR de 6,1 pouces avec ProMotion, et système de caméra Pro avancé avec zoom optique 3x. Conçu en titane pour une résistance exceptionnelle.',
      en: 'The latest iPhone with revolutionary A17 Pro chip, 6.1-inch Super Retina XDR display with ProMotion, and advanced Pro camera system with 3x optical zoom. Crafted in titanium for exceptional durability.',
    },
    priceHT: 119900,
    vatRate: 0.20,
    brand: 'Apple',
    category: 'electronics',
    categoryLabel: 'Univers Tech',
    stock: 10,
    isActive: true,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
    ],
    attributes: {
      processor: 'A17 Pro',
      ram: '8Go',
      storage: '256Go',
      screenSize: '6.1 pouces',
      os: 'iOS 17',
      battery: 'Jusqu\'à 23h de vidéo',
      camera: '48MP + 12MP + 12MP',
      colors: 'Titane Naturel, Titane Bleu, Titane Blanc, Titane Noir',
    },
    weight: 0.187,
    dimensions: {
      length: 15.9,
      width: 7.6,
      height: 0.83,
    },
    features: [
      'Puce A17 Pro avec GPU 6 cœurs',
      'Écran Super Retina XDR avec ProMotion',
      'Système de caméra Pro avec zoom optique 3x',
      'Design en titane premium',
      'Résistance à l\'eau IP68',
      'Charge sans fil MagSafe',
    ],
  },
  '2': {
    id: '2',
    sku: 'SON-PS5-0001',
    name: 'PlayStation 5',
    creator: 'Sony',
    description: {
      fr: 'Console de jeu nouvelle génération avec processeur AMD Ryzen Zen 2, GPU RDNA 2 personnalisé, et SSD ultra-rapide. Expérience de jeu immersive avec ray tracing et 4K 120fps.',
      en: 'Next-generation gaming console with AMD Ryzen Zen 2 processor, custom RDNA 2 GPU, and ultra-fast SSD. Immersive gaming experience with ray tracing and 4K 120fps.',
    },
    priceHT: 49900,
    vatRate: 0.20,
    brand: 'Sony',
    category: 'electronics',
    categoryLabel: 'Univers Tech',
    stock: 5,
    isActive: true,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
    ],
    attributes: {
      processor: 'AMD Ryzen Zen 2',
      gpu: 'AMD RDNA 2',
      storage: '825Go SSD',
      resolution: '4K UHD',
      framerate: 'Jusqu\'à 120fps',
      rayTracing: 'Oui',
    },
    weight: 4.5,
    dimensions: {
      length: 39,
      width: 26,
      height: 10.4,
    },
    features: [
      'SSD ultra-rapide pour chargements instantanés',
      'Ray tracing pour des graphismes réalistes',
      'Support 4K 120fps',
      'DualSense avec retour haptique',
      'Rétrocompatibilité PS4',
    ],
  },
  '3': {
    id: '3',
    sku: 'HUS-ROB-0001',
    name: 'Robot Tondeuse Automower 430X',
    creator: 'Husqvarna',
    description: {
      fr: 'Robot tondeuse intelligent avec navigation GPS, système de coupe automatique, et application mobile. Parfait pour les jardins jusqu\'à 4000m². Fonctionne en silence et de manière autonome.',
      en: 'Smart robotic lawn mower with GPS navigation, automatic cutting system, and mobile app. Perfect for gardens up to 4000m². Works silently and autonomously.',
    },
    priceHT: 249900,
    vatRate: 0.20,
    brand: 'Husqvarna',
    category: 'garden',
    categoryLabel: 'Univers Jardin',
    stock: 3,
    isActive: true,
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
      '/jard1.webp',
    ],
    attributes: {
      surface: 'Jusqu\'à 4000m²',
      navigation: 'GPS + Capteurs',
      batterie: 'Lithium-ion',
      autonomie: 'Jusqu\'à 2h',
      connectivite: 'Bluetooth + Wi-Fi',
      securite: 'PIN + Alarme',
    },
    weight: 15.2,
    dimensions: {
      length: 70,
      width: 57,
      height: 25,
    },
    features: [
      'Navigation GPS précise',
      'Application mobile intuitive',
      'Fonctionne par tous les temps',
      'Sécurité maximale avec alarme',
      'Installation facile',
      'Entretien minimal',
    ],
  },
};

// Fonction pour générer les détails d'un produit à partir de l'ID (fallback pour produits non définis)
const generateProductDetails = (productId: string): typeof mockProducts['1'] => {
  // Produits de base depuis la page produits
  const baseProducts: Record<string, any> = {
    '1': { name: 'iPhone 15 Pro', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', price: 1199, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800' },
    '2': { name: 'PlayStation 5', creator: 'Sony', category: 'electronics', categoryLabel: 'Univers Tech', price: 499, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800' },
    '3': { name: 'Robot Tondeuse Automower 430X', creator: 'Husqvarna', category: 'garden', categoryLabel: 'Univers Jardin', price: 2499, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800' },
    '4': { name: 'iPhone 15 Pro Max', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', price: 1399, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800' },
    '5': { name: 'MacBook Pro M3', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', price: 1999, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' },
    '6': { name: 'MacBook Air M3', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', price: 1299, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800' },
    '7': { name: 'iPad Pro 12.9"', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', price: 1099, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' },
    '8': { name: 'Apple Watch Ultra 2', creator: 'Apple', category: 'electronics', categoryLabel: 'Univers Tech', price: 899, image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800' },
    '9': { name: 'PlayStation 5', creator: 'Sony', category: 'electronics', categoryLabel: 'Univers Tech', price: 499, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800' },
    '10': { name: 'Xbox Series X', creator: 'Microsoft', category: 'electronics', categoryLabel: 'Univers Tech', price: 499, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800' },
    '11': { name: 'Nintendo Switch OLED', creator: 'Nintendo', category: 'electronics', categoryLabel: 'Univers Tech', price: 349, image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800' },
    '12': { name: 'Steam Deck', creator: 'Valve', category: 'electronics', categoryLabel: 'Univers Tech', price: 549, image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800' },
    '13': { name: 'Sony Alpha 7 IV', creator: 'Sony', category: 'photo', categoryLabel: 'Univers Tech', price: 2799, image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800' },
    '14': { name: 'Canon EOS R5', creator: 'Canon', category: 'photo', categoryLabel: 'Univers Tech', price: 3899, image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800' },
    '15': { name: 'DJI Mavic 3 Pro', creator: 'DJI', category: 'photo', categoryLabel: 'Univers Tech', price: 2199, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800' },
    '16': { name: 'GoPro Hero 12', creator: 'GoPro', category: 'photo', categoryLabel: 'Univers Tech', price: 449, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=800' },
    '17': { name: 'Sony FX3 Cinema Camera', creator: 'Sony', category: 'photo', categoryLabel: 'Univers Tech', price: 3999, image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800' },
    '18': { name: 'Robot Tondeuse Automower 430X', creator: 'Husqvarna', category: 'garden', categoryLabel: 'Univers Jardin', price: 2499, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800' },
    '19': { name: 'Tondeuse Robot Gardena', creator: 'Gardena', category: 'garden', categoryLabel: 'Univers Jardin', price: 899, image: '/jard2.webp' },
    '20': { name: 'Tronçonneuse STIHL MS 271', creator: 'STIHL', category: 'garden', categoryLabel: 'Univers Jardin', price: 349, image: '/jard3.webp' },
    '21': { name: 'Tondeuse Robot Worx Landroid', creator: 'Worx', category: 'garden', categoryLabel: 'Univers Jardin', price: 1299, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800' },
    '22': { name: 'Aspirateur Souffleur STIHL', creator: 'STIHL', category: 'garden', categoryLabel: 'Univers Jardin', price: 199, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800' },
    '23': { name: 'Taille-haie Électrique Bosch', creator: 'Bosch', category: 'garden', categoryLabel: 'Univers Jardin', price: 149, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800' },
    '24': { name: 'Système d\'Arrosage Connecté Gardena', creator: 'Gardena', category: 'garden', categoryLabel: 'Univers Jardin', price: 299, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800' },
    '25': { name: 'Robot Tondeuse Automower 315X', creator: 'Husqvarna', category: 'garden', categoryLabel: 'Univers Jardin', price: 1799, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800' },
    '26': { name: 'Trottinette Électrique Xiaomi Pro 2', creator: 'Xiaomi', category: 'mobility', categoryLabel: 'E-Mobilité', price: 399, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800' },
    '27': { name: 'Trottinette Électrique Segway Ninebot', creator: 'Segway', category: 'mobility', categoryLabel: 'E-Mobilité', price: 599, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800' },
    '28': { name: 'Hoverboard Smart Balance', creator: 'Smart Balance', category: 'mobility', categoryLabel: 'E-Mobilité', price: 249, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800' },
    '29': { name: 'Vélo Électrique Trek', creator: 'Trek', category: 'mobility', categoryLabel: 'E-Mobilité', price: 2499, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800' },
    '30': { name: 'Skateboard Électrique Boosted', creator: 'Boosted', category: 'mobility', categoryLabel: 'E-Mobilité', price: 1299, image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800' },
    '31': { name: 'Perceuse Visseuse Sans Fil Bosch', creator: 'Bosch', category: 'tools', categoryLabel: 'Outils', price: 129, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800' },
    '32': { name: 'Scie Circulaire Makita', creator: 'Makita', category: 'tools', categoryLabel: 'Outils', price: 199, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800' },
    '33': { name: 'Ponceuse Excentrique Festool', creator: 'Festool', category: 'tools', categoryLabel: 'Outils', price: 449, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800' },
    '34': { name: 'Meuleuse d\'Angle DeWalt', creator: 'DeWalt', category: 'tools', categoryLabel: 'Outils', price: 179, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800' },
    '35': { name: 'Aspirateur Robot Roomba i7+', creator: 'iRobot', category: 'electronics', categoryLabel: 'Univers Tech', price: 599, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
    '36': { name: 'Enceinte Sonos Era 300', creator: 'Sonos', category: 'electronics', categoryLabel: 'Univers Tech', price: 449, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800' },
    '37': { name: 'Écran Gaming Samsung Odyssey', creator: 'Samsung', category: 'electronics', categoryLabel: 'Univers Tech', price: 799, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800' },
    '38': { name: 'Casque Sony WH-1000XM5', creator: 'Sony', category: 'electronics', categoryLabel: 'Univers Tech', price: 399, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
  };

  const baseProduct = baseProducts[productId];
  if (!baseProduct) {
    // Fallback ultime
    return mockProducts['1'];
  }

  return {
    id: productId,
    sku: `${baseProduct.creator.substring(0, 3).toUpperCase()}-${productId.padStart(4, '0')}`,
    name: baseProduct.name,
    creator: baseProduct.creator,
    description: {
      fr: `${baseProduct.name} de ${baseProduct.creator}. Produit premium de qualité avec toutes les fonctionnalités modernes. Conçu pour offrir une expérience exceptionnelle.`,
      en: `${baseProduct.name} by ${baseProduct.creator}. Premium quality product with all modern features. Designed to deliver an exceptional experience.`,
    },
    priceHT: baseProduct.price * 100,
    vatRate: 0.20,
    brand: baseProduct.creator,
    category: baseProduct.category,
    categoryLabel: baseProduct.categoryLabel,
    stock: 10,
    isActive: true,
    images: [baseProduct.image, baseProduct.image, baseProduct.image],
    attributes: {
      marque: baseProduct.creator,
      categorie: baseProduct.categoryLabel,
    } as any,
    weight: 0.5,
    dimensions: {
      length: 20,
      width: 15,
      height: 5,
    },
    features: [
      `Produit ${baseProduct.name} de qualité premium`,
      'Livraison rapide et sécurisée',
      'Garantie constructeur 2 ans',
      'Support client disponible',
    ],
  };
};

// Produits similaires (pour la section recommandations)
const getSimilarProducts = (currentProduct: typeof mockProducts['1']) => {
  return Object.values(mockProducts)
    .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 4);
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart, itemsCount } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // État pour le produit chargé depuis l'API
  const [apiProduct, setApiProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiSimilarProducts, setApiSimilarProducts] = useState<any[]>([]);

  // Charger le produit depuis l'API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setIsLoading(true);

      try {
        const response = await fetch(`/api/products/${productId}`);

        if (response.ok) {
          const data = await response.json();
          const fetchedProduct = data.product;

          // Transformer les données pour le composant
          setApiProduct({
            id: fetchedProduct.id,
            sku: fetchedProduct.sku,
            name: typeof fetchedProduct.name === 'string'
              ? fetchedProduct.name
              : fetchedProduct.name?.fr || fetchedProduct.sku,
            description: fetchedProduct.description || { fr: '' },
            priceHT: fetchedProduct.priceHT,
            vatRate: fetchedProduct.vatRate || fetchedProduct.defaultVATRate || 0.21,
            brand: fetchedProduct.brand,
            creator: fetchedProduct.brand,
            category: fetchedProduct.category,
            categoryLabel: fetchedProduct.categoryLabel || fetchedProduct.category,
            stock: fetchedProduct.stock,
            isActive: fetchedProduct.isActive,
            images: fetchedProduct.images?.length > 0
              ? fetchedProduct.images
              : ['/images/placeholder-product.png'],
            attributes: fetchedProduct.attributes || {},
            brandLink: fetchedProduct.brandLink || '',
            features: fetchedProduct.features || [],
            specifications: fetchedProduct.specifications || {},
            deliveryInfo: fetchedProduct.deliveryInfo || {},
            weight: fetchedProduct.weight,
            dimensions: fetchedProduct.dimensions
          });

          // Récupérer les produits similaires
          if (fetchedProduct.category) {
            try {
              const simRes = await fetch(`/api/products?category=${fetchedProduct.category}&limit=5`);
              if (simRes.ok) {
                const simData = await simRes.json();
                setApiSimilarProducts(
                  (simData.products || [])
                    .filter((p: any) => p.id !== productId)
                    .slice(0, 4)
                );
              }
            } catch (e) {
              console.error('Erreur chargement produits similaires:', e);
            }
          }
        }
      } catch (err: any) {
        console.error('Erreur chargement produit:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Utiliser le produit de l'API - fallback mocké uniquement pour IDs numériques (tests)
  const isMockId = /^\d+$/.test(productId);
  const mockFallback = isMockId ? (mockProducts[productId as keyof typeof mockProducts] || generateProductDetails(productId)) as typeof mockProducts['1'] : null;
  const product = apiProduct || mockFallback;

  // Si pas de produit et chargement terminé, afficher erreur
  if (!product && !isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24 py-8">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-6">Ce produit n'existe pas ou n'est plus disponible.</p>
          <Link href="/products" className="text-violet-electric hover:underline">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  // Si pas de produit mais encore en chargement
  if (!product) {
    return (
      <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24 py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-electric"></div>
        </div>
      </div>
    );
  }

  const similarProducts = apiSimilarProducts.length > 0 ? apiSimilarProducts : (isMockId ? getSimilarProducts(product) : []);

  // Calculer le prix TTC avec valeurs par défaut pour éviter NaN
  const safepriceHT = typeof product.priceHT === 'number' ? product.priceHT : 0;
  const safeVatRate = typeof product.vatRate === 'number' ? product.vatRate : 0.21;
  const priceTTC = calculateTTC(safepriceHT, safeVatRate);

  // Obtenir le nom du produit (peut être string ou objet)
  const productName = typeof product.name === 'string'
    ? product.name
    : (product.name as any)?.fr || product.sku || 'Produit';

  const handleAddToCart = async () => {
    if (product.stock === 0 || !product.isActive) return;

    setIsAdding(true);

    // Ajouter au panier avec la quantité
    addToCart(
      {
        productId: product.id,
        sku: product.sku,
        name: productName,
        priceHT: safepriceHT,
        vatRate: safeVatRate,
        image: product.images[0],
      },
      quantity
    );

    // Animation de feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsAdding(false);
    setShowToast(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-12 lg:px-16 xl:px-20 2xl:px-24 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-violet-electric transition-colors">Accueil</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-violet-electric transition-colors">Boutique</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{productName}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          {/* Image principale */}
          <div className="relative w-full h-[500px] md:h-[600px] bg-gray-soft rounded-xl mb-4 overflow-hidden group" style={{ aspectRatio: '4 / 3' }}>
            {product.images[selectedImage] ? (
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <img
                  src={getProductImageUrl(product.images[selectedImage])}
                  alt={`${productName} - Image principale`}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                  loading={selectedImage === 0 ? 'eager' : 'lazy'}
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Miniatures */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === index
                    ? 'border-violet-electric shadow-md scale-105'
                    : 'border-transparent hover:border-gray-300'
                    }`}
                  aria-label={`Afficher l'image ${index + 1} de ${productName}`}
                  aria-current={selectedImage === index ? 'true' : 'false'}
                >
                  <img
                    src={getProductImageUrl(image)}
                    alt={`${productName} - Miniature ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="flex flex-col">
          {/* En-tête */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-gray-500 font-medium">{product.creator || product.brand}</p>
              {product.brandLink && (
                <a
                  href={product.brandLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-violet-electric hover:underline flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Site officiel
                </a>
              )}
            </div>
            <h1 className="text-5xl font-extrabold text-black-deep mb-4 leading-tight">{productName}</h1>

            {/* Prix */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-sm text-gray-500 font-normal">from </span>
                <span className="text-5xl font-bold text-black-deep">{Math.floor(priceTTC / 100)}</span>
                <span className="text-xl text-gray-500 font-normal"> €</span>
              </div>
              <p className="text-sm text-gray-500">
                HT: {formatPrice(product.priceHT)} (TVA incl.)
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {product.stock > 0 ? (
                <Badge variant="success" className="text-sm px-3 py-1 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  En stock ({product.stock} disponibles)
                </Badge>
              ) : (
                <Badge variant="error" className="text-sm px-3 py-1">Rupture de stock</Badge>
              )}
              <Badge variant="info" className="text-sm px-3 py-1">SKU: {product.sku}</Badge>
              <span className="text-xs text-gray-500 bg-gray-soft px-3 py-1 rounded-full">
                {product.categoryLabel}
              </span>
            </div>
          </div>

          {/* Description courte */}
          <div className="mb-8">
            <div
              className="text-gray-700 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{
                __html: (product.description?.fr || '')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\n/g, '<br />')
              }}
            />
          </div>

          {/* Caractéristiques principales */}
          {product.features && product.features.length > 0 && (
            <Card className="mb-8 bg-off-white border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-black-deep">Points forts</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-violet-electric mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Ajout au panier */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4">
              <label className="font-semibold text-black-deep">Quantité:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:border-violet-electric transition-all font-bold text-lg"
                  aria-label="Diminuer la quantité"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:border-violet-electric focus:ring-2 focus:ring-violet-electric/20 outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:border-violet-electric transition-all font-bold text-lg"
                  aria-label="Augmenter la quantité"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.stock} disponible{product.stock > 1 ? 's' : ''}
              </span>
            </div>

            <motion.div
              whileHover={{ scale: product.stock > 0 && product.isActive ? 1.02 : 1 }}
              whileTap={{ scale: product.stock > 0 && product.isActive ? 0.98 : 1 }}
            >
              <Button
                variant="primary"
                size="lg"
                className={`w-full bg-violet-electric hover:bg-violet-700 text-white py-4 text-lg font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl ${isAdding ? 'opacity-75 cursor-wait' : ''
                  }`}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || !product.isActive || isAdding}
                aria-label={product.stock > 0 ? `Ajouter ${quantity} ${productName} au panier` : `${productName} - Rupture de stock`}
              >
                {isAdding ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ajout en cours...
                  </span>
                ) : product.stock > 0 ? (
                  `Ajouter ${quantity > 1 ? `${quantity} × ` : ''}au panier`
                ) : (
                  'Rupture de stock'
                )}
              </Button>
            </motion.div>
          </div>

          {/* Informations supplémentaires */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <svg className="w-5 h-5 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Livraison gratuite à partir de 100€</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <svg className="w-5 h-5 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-gray-700">Garantie constructeur 2 ans</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <svg className="w-5 h-5 text-violet-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-gray-700">Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs pour Description, Spécifications, Livraison */}
      <div className="mb-12">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specs', label: 'Spécifications' },
              { id: 'shipping', label: 'Livraison & Retours' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-2 font-semibold transition-colors border-b-2 ${activeTab === tab.id
                  ? 'border-violet-electric text-violet-electric'
                  : 'border-transparent text-gray-600 hover:text-violet-electric'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <div
                className="text-gray-700 leading-relaxed text-lg mb-6"
                dangerouslySetInnerHTML={{
                  __html: product.description.fr
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br />')
                }}
              />
              {product.features && (
                <div>
                  <h3 className="font-bold text-xl mb-4 text-black-deep">Caractéristiques principales</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-violet-electric mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              {(product.specifications && Object.keys(product.specifications).length > 0) ? (
                <Card className="bg-off-white border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-6 text-black-deep">Spécifications détaillées</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="border-b border-gray-200 pb-3">
                          <dt className="text-sm text-gray-500 mb-1 font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </dt>
                          <dd className="font-semibold text-black-deep">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              ) : product.attributes && Object.keys(product.attributes).length > 0 && (
                <Card className="bg-off-white border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-6 text-black-deep">Caractéristiques techniques</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.attributes).map(([key, value]) => (
                        <div key={key} className="border-b border-gray-200 pb-3">
                          <dt className="text-sm text-gray-500 mb-1 font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </dt>
                          <dd className="font-semibold text-black-deep">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              )}
              {(product.weight || product.dimensions) && (
                <Card className="mt-6 bg-off-white border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 text-black-deep">Dimensions & Poids</h3>
                    <dl className="space-y-2">
                      {product.weight && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Poids</dt>
                          <dd className="font-semibold">{product.weight} kg</dd>
                        </div>
                      )}
                      {product.dimensions && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Dimensions (L × l × H)</dt>
                          <dd className="font-semibold">
                            {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                          </dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              {product.deliveryInfo && Object.keys(product.deliveryInfo).length > 0 ? (
                <Card className="bg-off-white border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-4 text-black-deep">Informations de livraison</h3>
                    <div className="prose max-w-none text-gray-700">
                      {Object.entries(product.deliveryInfo).map(([key, value]) => (
                        <div key={key} className="mb-4">
                          <h4 className="font-bold text-black-deep capitalize">{key.replace(/_/g, ' ')}</h4>
                          <p>{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="bg-off-white border-gray-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-4 text-black-deep">Livraison</h3>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-violet-electric mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Livraison gratuite à partir de 100€ d&apos;achat</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-violet-electric mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Délai de livraison : 2-3 jours ouvrables pour la France</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-violet-electric mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Suivi de commande en temps réel</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-off-white border-gray-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-4 text-black-deep">Retours</h3>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-violet-electric mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Délai de retour : 30 jours à compter de la réception</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-violet-electric mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Produit doit être dans son emballage d&apos;origine</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-violet-electric mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Remboursement sous 14 jours après réception</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Produits similaires */}
      {similarProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-black-deep mb-8">Produits similaires</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 items-stretch">
            {similarProducts.map((similarProduct) => {
              const priceTTC = calculateTTC(similarProduct.priceHT, similarProduct.vatRate) / 100;
              return (
                <div key={similarProduct.id}>
                  {/* Version Mobile */}
                  <div className="lg:hidden">
                    <MobileProductCard
                      id={similarProduct.id}
                      name={similarProduct.name}
                      price={priceTTC}
                      image={similarProduct.images[0]}
                      creator={similarProduct.creator || similarProduct.brand}
                      category={similarProduct.categoryLabel}
                      onViewProduct={() => {
                        window.location.href = `/products/${similarProduct.id}`;
                      }}
                    />
                  </div>

                  {/* Version Desktop */}
                  <Link href={`/products/${similarProduct.id}`} className="hidden lg:block" aria-label={`Voir les détails de ${similarProduct.name}`}>
                    <Card hover className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-sm group">
                      <div className="h-80 bg-gray-soft rounded-t-lg overflow-hidden flex-shrink-0 relative" style={{ aspectRatio: '1 / 1' }}>
                        <img
                          src={getProductImageUrl(similarProduct.images[0])}
                          alt={`${similarProduct.name} - Produit similaire`}
                          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-125"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-7 flex-1 flex flex-col justify-between min-h-[300px] bg-off-white">
                        <div className="border-b border-gray-200 pb-3 mb-3">
                          <p className="text-xs text-gray-400 mb-2 font-normal">{similarProduct.categoryLabel}</p>
                          <h3 className="font-bold text-black-deep text-xl leading-snug">{similarProduct.name}</h3>
                        </div>
                        <div className="border-b border-gray-200 pb-3 mb-3 flex items-baseline justify-between">
                          <div>
                            <span className="text-sm text-gray-500 font-normal">By </span>
                            <span className="text-sm text-black-deep font-medium">{similarProduct.creator || similarProduct.brand}</span>
                          </div>
                          <div className="text-right flex items-baseline">
                            <span className="text-sm text-black-deep font-normal">from </span>
                            <span className="text-4xl font-bold text-black-deep ml-1">{Math.floor(priceTTC)}</span>
                            <span className="text-sm text-black-deep font-normal ml-1"> €</span>
                          </div>
                        </div>
                        <div className="pt-1">
                          <span className="text-sm text-violet-electric hover:underline font-normal">
                            Voir le produit
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Toast de confirmation */}
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message="Produit ajouté au panier"
        productName={productName}
        productImage={getProductImageUrl(product.images[0])}
        quantity={quantity}
        totalItems={itemsCount}
      />
    </div>
  );
}
