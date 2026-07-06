import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { resolve } from 'path';
import { seedContent } from './seed-content';

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer un utilisateur admin par défaut
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ejsmarket.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.users.upsert({
    where: { email: adminEmail },
    update: { updatedAt: new Date() },
    create: {
      id: crypto.randomUUID(),
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: 'Administrateur',
      role: UserRole.ADMIN,
      isEmailVerified: true,
      updatedAt: new Date(),
    },
  });

  console.log(`✅ Admin user created: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   ⚠️  Change this password after first login!`);

  // Créer les taux TVA par pays
  const taxRates = [
    { countryCode: 'FR', rate: 0.20, reducedRate: 0.055 },
    { countryCode: 'ES', rate: 0.21, reducedRate: 0.10 },
    { countryCode: 'DE', rate: 0.19, reducedRate: 0.07 },
    { countryCode: 'IT', rate: 0.22, reducedRate: 0.10 },
    { countryCode: 'BE', rate: 0.21, reducedRate: 0.12 },
    { countryCode: 'NL', rate: 0.21, reducedRate: 0.09 },
    { countryCode: 'PT', rate: 0.23, reducedRate: 0.13 },
  ];

  for (const taxRate of taxRates) {
    await prisma.tax_rates.upsert({
      where: { countryCode: taxRate.countryCode },
      update: { updatedAt: new Date() },
      create: {
        ...taxRate,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
      },
    });
    console.log(`✅ Tax rate for ${taxRate.countryCode}: ${taxRate.rate * 100}%`);
  }

  // Créer les zones de livraison
  const shippingZones = [
    {
      name: 'Zone 1 - Europe de l\'Ouest',
      countries: ['FR', 'BE', 'NL', 'DE'],
      basePrice: 500, // 5.00€ en centimes
      pricePerKg: 50, // 0.50€ par kg supplémentaire
    },
    {
      name: 'Zone 2 - Europe du Sud',
      countries: ['ES', 'IT', 'PT'],
      basePrice: 1000, // 10.00€
      pricePerKg: 100, // 1.00€ par kg
    },
  ];

  for (const zone of shippingZones) {
    const existing = await prisma.shipping_zones.findFirst({
      where: { name: zone.name },
    });

    if (!existing) {
      await prisma.shipping_zones.create({
        data: {
          ...zone,
          id: crypto.randomUUID(),
          updatedAt: new Date(),
        },
      });
      console.log(`✅ Shipping zone: ${zone.name}`);
    }
  }

  // Créer les méthodes de livraison
  const shippingMethods = [
    {
      name: 'Standard',
      carrier: 'DHL',
      maxWeight: 30,
      maxDimension: 100,
    },
    {
      name: 'Express',
      carrier: 'UPS',
      maxWeight: 30,
      maxDimension: 100,
    },
    {
      name: 'Spécial',
      carrier: 'Transporteur Spécial',
      maxWeight: null,
      maxDimension: null,
    },
  ];

  for (const method of shippingMethods) {
    await prisma.shipping_methods.create({
      data: {
        ...method,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
      },
    });
    console.log(`✅ Shipping method: ${method.name}`);
  }

  // Créer les produits
  const products = [
    // ========== ÉLECTRONIQUE - APPLE ==========
    {
      sku: 'IPHONE-15-PRO-256',
      name: { fr: 'iPhone 15 Pro 256GB', en: 'iPhone 15 Pro 256GB', es: 'iPhone 15 Pro 256GB' },
      description: {
        fr: 'iPhone 15 Pro avec puce A17 Pro, écran Super Retina XDR 6.1", triple appareil photo 48MP, résistant à l\'eau IP68.',
        en: 'iPhone 15 Pro with A17 Pro chip, 6.1" Super Retina XDR display, 48MP triple camera, IP68 water resistant.',
        es: 'iPhone 15 Pro con chip A17 Pro, pantalla Super Retina XDR de 6.1", triple cámara de 48MP, resistente al agua IP68.'
      },
      priceHT: 99900, // 999€
      defaultVATRate: 0.20,
      weight: 0.187,
      dimensions: { length: 15.9, width: 7.6, height: 0.83 },
      stock: 50,
      brand: 'Apple',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
      attributes: { storage: '256GB', color: 'Titanium Naturel', screen: '6.1"', processor: 'A17 Pro' }
    },
    {
      sku: 'IPHONE-15-PRO-MAX-512',
      name: { fr: 'iPhone 15 Pro Max 512GB', en: 'iPhone 15 Pro Max 512GB', es: 'iPhone 15 Pro Max 512GB' },
      description: {
        fr: 'iPhone 15 Pro Max avec puce A17 Pro, écran Super Retina XDR 6.7", triple appareil photo 48MP, résistant à l\'eau IP68.',
        en: 'iPhone 15 Pro Max with A17 Pro chip, 6.7" Super Retina XDR display, 48MP triple camera, IP68 water resistant.',
        es: 'iPhone 15 Pro Max con chip A17 Pro, pantalla Super Retina XDR de 6.7", triple cámara de 48MP, resistente al agua IP68.'
      },
      priceHT: 116600, // 1166€
      defaultVATRate: 0.20,
      weight: 0.221,
      dimensions: { length: 16.0, width: 7.8, height: 0.88 },
      stock: 30,
      brand: 'Apple',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
      attributes: { storage: '512GB', color: 'Titanium Naturel', screen: '6.7"', processor: 'A17 Pro' }
    },
    {
      sku: 'MACBOOK-PRO-M3-14',
      name: { fr: 'MacBook Pro 14" M3', en: 'MacBook Pro 14" M3', es: 'MacBook Pro 14" M3' },
      description: {
        fr: 'MacBook Pro 14" avec puce M3, 18h d\'autonomie, écran Liquid Retina XDR, 16GB RAM, 512GB SSD.',
        en: 'MacBook Pro 14" with M3 chip, 18-hour battery, Liquid Retina XDR display, 16GB RAM, 512GB SSD.',
        es: 'MacBook Pro 14" con chip M3, batería de 18 horas, pantalla Liquid Retina XDR, 16GB RAM, 512GB SSD.'
      },
      priceHT: 166600, // 1666€
      defaultVATRate: 0.20,
      weight: 1.6,
      dimensions: { length: 31.3, width: 22.1, height: 1.55 },
      stock: 25,
      brand: 'Apple',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'],
      attributes: { screen: '14"', processor: 'M3', ram: '16GB', storage: '512GB SSD' }
    },
    {
      sku: 'MACBOOK-AIR-M3-13',
      name: { fr: 'MacBook Air 13" M3', en: 'MacBook Air 13" M3', es: 'MacBook Air 13" M3' },
      description: {
        fr: 'MacBook Air 13" avec puce M3, 18h d\'autonomie, écran Liquid Retina, 8GB RAM, 256GB SSD.',
        en: 'MacBook Air 13" with M3 chip, 18-hour battery, Liquid Retina display, 8GB RAM, 256GB SSD.',
        es: 'MacBook Air 13" con chip M3, batería de 18 horas, pantalla Liquid Retina, 8GB RAM, 256GB SSD.'
      },
      priceHT: 108300, // 1083€
      defaultVATRate: 0.20,
      weight: 1.24,
      dimensions: { length: 30.4, width: 21.5, height: 1.13 },
      stock: 40,
      brand: 'Apple',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'],
      attributes: { screen: '13"', processor: 'M3', ram: '8GB', storage: '256GB SSD' }
    },
    {
      sku: 'IPAD-PRO-12.9-M2',
      name: { fr: 'iPad Pro 12.9" M2', en: 'iPad Pro 12.9" M2', es: 'iPad Pro 12.9" M2' },
      description: {
        fr: 'iPad Pro 12.9" avec puce M2, écran Liquid Retina XDR, 256GB, Wi-Fi + Cellular.',
        en: 'iPad Pro 12.9" with M2 chip, Liquid Retina XDR display, 256GB, Wi-Fi + Cellular.',
        es: 'iPad Pro 12.9" con chip M2, pantalla Liquid Retina XDR, 256GB, Wi-Fi + Cellular.'
      },
      priceHT: 91600, // 916€
      defaultVATRate: 0.20,
      weight: 0.682,
      dimensions: { length: 28.0, width: 21.5, height: 0.64 },
      stock: 35,
      brand: 'Apple',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'],
      attributes: { screen: '12.9"', processor: 'M2', storage: '256GB', connectivity: 'Wi-Fi + Cellular' }
    },
    {
      sku: 'APPLE-WATCH-ULTRA-2',
      name: { fr: 'Apple Watch Ultra 2', en: 'Apple Watch Ultra 2', es: 'Apple Watch Ultra 2' },
      description: {
        fr: 'Apple Watch Ultra 2 avec écran Retina toujours allumé, GPS, résistant à l\'eau jusqu\'à 100m, autonomie jusqu\'à 36h.',
        en: 'Apple Watch Ultra 2 with always-on Retina display, GPS, water resistant up to 100m, up to 36-hour battery.',
        es: 'Apple Watch Ultra 2 con pantalla Retina siempre encendida, GPS, resistente al agua hasta 100m, batería hasta 36 horas.'
      },
      priceHT: 74900, // 749€
      defaultVATRate: 0.20,
      weight: 0.061,
      dimensions: { length: 4.9, width: 4.4, height: 1.4 },
      stock: 60,
      brand: 'Apple',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500'],
      attributes: { size: '49mm', material: 'Titane', battery: '36h', waterResistance: '100m' }
    },
    {
      sku: 'AIRPODS-PRO-2',
      name: { fr: 'AirPods Pro 2', en: 'AirPods Pro 2', es: 'AirPods Pro 2' },
      description: {
        fr: 'AirPods Pro 2 avec réduction de bruit active, audio spatial, boîtier MagSafe, autonomie jusqu\'à 30h.',
        en: 'AirPods Pro 2 with active noise cancellation, spatial audio, MagSafe case, up to 30-hour battery.',
        es: 'AirPods Pro 2 con cancelación activa de ruido, audio espacial, estuche MagSafe, batería hasta 30 horas.'
      },
      priceHT: 23200, // 232€
      defaultVATRate: 0.20,
      weight: 0.056,
      dimensions: { length: 6.0, width: 2.4, height: 2.1 },
      stock: 100,
      brand: 'Apple',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500'],
      attributes: { noiseCancellation: true, battery: '30h', charging: 'MagSafe' }
    },
    {
      sku: 'IMAC-24-M3',
      name: { fr: 'iMac 24" M3', en: 'iMac 24" M3', es: 'iMac 24" M3' },
      description: {
        fr: 'iMac 24" avec puce M3, écran Retina 4.5K, 8GB RAM, 256GB SSD, 7 couleurs disponibles.',
        en: 'iMac 24" with M3 chip, 4.5K Retina display, 8GB RAM, 256GB SSD, 7 color options.',
        es: 'iMac 24" con chip M3, pantalla Retina 4.5K, 8GB RAM, 256GB SSD, 7 opciones de color.'
      },
      priceHT: 124900, // 1249€
      defaultVATRate: 0.20,
      weight: 4.5,
      dimensions: { length: 54.7, width: 46.1, height: 14.7 },
      stock: 20,
      brand: 'Apple',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'],
      attributes: { screen: '24" 4.5K', processor: 'M3', ram: '8GB', storage: '256GB SSD' }
    },

    // ========== ÉLECTRONIQUE - GAMING ==========
    {
      sku: 'PS5-CONSOLE',
      name: { fr: 'PlayStation 5', en: 'PlayStation 5', es: 'PlayStation 5' },
      description: {
        fr: 'Console PlayStation 5 avec lecteur Blu-ray Ultra HD, SSD ultra-rapide, ray tracing, 4K 120fps.',
        en: 'PlayStation 5 console with Ultra HD Blu-ray drive, ultra-fast SSD, ray tracing, 4K 120fps.',
        es: 'Consola PlayStation 5 con lector Blu-ray Ultra HD, SSD ultrarrápido, ray tracing, 4K 120fps.'
      },
      priceHT: 41600, // 416€
      defaultVATRate: 0.20,
      weight: 4.5,
      dimensions: { length: 39.0, width: 26.0, height: 10.4 },
      stock: 45,
      brand: 'Sony',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500'],
      attributes: { storage: '825GB SSD', resolution: '4K 120fps', rayTracing: true }
    },
    {
      sku: 'XBOX-SERIES-X',
      name: { fr: 'Xbox Series X', en: 'Xbox Series X', es: 'Xbox Series X' },
      description: {
        fr: 'Console Xbox Series X avec SSD 1TB, 4K 120fps, ray tracing, rétrocompatibilité avec Xbox One.',
        en: 'Xbox Series X console with 1TB SSD, 4K 120fps, ray tracing, backward compatible with Xbox One.',
        es: 'Consola Xbox Series X con SSD 1TB, 4K 120fps, ray tracing, retrocompatible con Xbox One.'
      },
      priceHT: 41600, // 416€
      defaultVATRate: 0.20,
      weight: 4.45,
      dimensions: { length: 30.1, width: 15.1, height: 15.1 },
      stock: 40,
      brand: 'Microsoft',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500'],
      attributes: { storage: '1TB SSD', resolution: '4K 120fps', rayTracing: true }
    },
    {
      sku: 'NINTENDO-SWITCH-OLED',
      name: { fr: 'Nintendo Switch OLED', en: 'Nintendo Switch OLED', es: 'Nintendo Switch OLED' },
      description: {
        fr: 'Nintendo Switch OLED avec écran OLED 7", 64GB de stockage interne, dock amélioré, autonomie jusqu\'à 9h.',
        en: 'Nintendo Switch OLED with 7" OLED screen, 64GB internal storage, improved dock, up to 9-hour battery.',
        es: 'Nintendo Switch OLED con pantalla OLED de 7", 64GB de almacenamiento interno, dock mejorado, batería hasta 9 horas.'
      },
      priceHT: 29100, // 291€
      defaultVATRate: 0.20,
      weight: 0.42,
      dimensions: { length: 24.2, width: 10.2, height: 1.4 },
      stock: 70,
      brand: 'Nintendo',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500'],
      attributes: { screen: '7" OLED', storage: '64GB', battery: '9h' }
    },
    {
      sku: 'STEAM-DECK-512GB',
      name: { fr: 'Steam Deck 512GB', en: 'Steam Deck 512GB', es: 'Steam Deck 512GB' },
      description: {
        fr: 'Steam Deck 512GB avec écran tactile 7", processeur AMD Zen 2, GPU RDNA 2, stockage NVMe SSD.',
        en: 'Steam Deck 512GB with 7" touchscreen, AMD Zen 2 processor, RDNA 2 GPU, NVMe SSD storage.',
        es: 'Steam Deck 512GB con pantalla táctil de 7", procesador AMD Zen 2, GPU RDNA 2, almacenamiento NVMe SSD.'
      },
      priceHT: 45800, // 458€
      defaultVATRate: 0.20,
      weight: 0.669,
      dimensions: { length: 29.8, width: 11.7, height: 4.9 },
      stock: 35,
      brand: 'Valve',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1633265486064-086b219458ec?w=500'],
      attributes: { screen: '7"', storage: '512GB NVMe SSD', processor: 'AMD Zen 2' }
    },

    // ========== PHOTO & VIDÉO ==========
    {
      sku: 'SONY-ALPHA-7-IV',
      name: { fr: 'Sony Alpha 7 IV', en: 'Sony Alpha 7 IV', es: 'Sony Alpha 7 IV' },
      description: {
        fr: 'Appareil photo hybride plein format 33MP, vidéo 4K 60p, stabilisation d\'image 5 axes, autofocus temps réel.',
        en: 'Full-frame hybrid camera 33MP, 4K 60p video, 5-axis image stabilization, real-time autofocus.',
        es: 'Cámara híbrida de fotograma completo 33MP, video 4K 60p, estabilización de imagen de 5 ejes, enfoque automático en tiempo real.'
      },
      priceHT: 233200, // 2332€
      defaultVATRate: 0.20,
      weight: 0.658,
      dimensions: { length: 13.1, width: 9.6, height: 9.6 },
      stock: 15,
      brand: 'Sony',
      category: 'photo',
      images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500'],
      attributes: { sensor: '33MP Full Frame', video: '4K 60p', stabilization: '5-axis' }
    },
    {
      sku: 'CANON-EOS-R5',
      name: { fr: 'Canon EOS R5', en: 'Canon EOS R5', es: 'Canon EOS R5' },
      description: {
        fr: 'Appareil photo hybride plein format 45MP, vidéo 8K RAW, stabilisation d\'image 5 axes, autofocus Dual Pixel CMOS AF II.',
        en: 'Full-frame hybrid camera 45MP, 8K RAW video, 5-axis image stabilization, Dual Pixel CMOS AF II autofocus.',
        es: 'Cámara híbrida de fotograma completo 45MP, video 8K RAW, estabilización de imagen de 5 ejes, enfoque automático Dual Pixel CMOS AF II.'
      },
      priceHT: 324900, // 3249€
      defaultVATRate: 0.20,
      weight: 0.650,
      dimensions: { length: 13.8, width: 9.8, height: 8.8 },
      stock: 10,
      brand: 'Canon',
      category: 'photo',
      images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500'],
      attributes: { sensor: '45MP Full Frame', video: '8K RAW', stabilization: '5-axis' }
    },
    {
      sku: 'DJI-MAVIC-3-PRO',
      name: { fr: 'DJI Mavic 3 Pro', en: 'DJI Mavic 3 Pro', es: 'DJI Mavic 3 Pro' },
      description: {
        fr: 'Drone DJI Mavic 3 Pro avec triple caméra, vidéo 5.1K, autonomie 43 minutes, transmission O3+ jusqu\'à 15km.',
        en: 'DJI Mavic 3 Pro drone with triple camera, 5.1K video, 43-minute battery, O3+ transmission up to 15km.',
        es: 'Dron DJI Mavic 3 Pro con triple cámara, video 5.1K, batería de 43 minutos, transmisión O3+ hasta 15km.'
      },
      priceHT: 183200, // 1832€
      defaultVATRate: 0.20,
      weight: 0.958,
      dimensions: { length: 34.7, width: 28.2, height: 9.5 },
      stock: 20,
      brand: 'DJI',
      category: 'photo',
      images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500'],
      attributes: { cameras: 'Triple', video: '5.1K', battery: '43min', range: '15km' }
    },
    {
      sku: 'GOPRO-HERO-12',
      name: { fr: 'GoPro Hero 12', en: 'GoPro Hero 12', es: 'GoPro Hero 12' },
      description: {
        fr: 'Caméra d\'action GoPro Hero 12, vidéo 5.3K 60fps, stabilisation HyperSmooth 6.0, résistante à l\'eau 10m.',
        en: 'GoPro Hero 12 action camera, 5.3K 60fps video, HyperSmooth 6.0 stabilization, 10m water resistant.',
        es: 'Cámara de acción GoPro Hero 12, video 5.3K 60fps, estabilización HyperSmooth 6.0, resistente al agua 10m.'
      },
      priceHT: 37400, // 374€
      defaultVATRate: 0.20,
      weight: 0.154,
      dimensions: { length: 7.1, width: 5.5, height: 3.3 },
      stock: 80,
      brand: 'GoPro',
      category: 'photo',
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=500'],
      attributes: { video: '5.3K 60fps', stabilization: 'HyperSmooth 6.0', waterResistance: '10m' }
    },
    {
      sku: 'SONY-FX3-CINEMA',
      name: { fr: 'Sony FX3 Cinema Camera', en: 'Sony FX3 Cinema Camera', es: 'Sony FX3 Cinema Camera' },
      description: {
        fr: 'Caméra cinéma Sony FX3 plein format, vidéo 4K 120fps, enregistrement interne 4:2:2 10-bit, stabilisation active.',
        en: 'Sony FX3 full-frame cinema camera, 4K 120fps video, internal 4:2:2 10-bit recording, active stabilization.',
        es: 'Cámara de cine Sony FX3 de fotograma completo, video 4K 120fps, grabación interna 4:2:2 10-bit, estabilización activa.'
      },
      priceHT: 333200, // 3332€
      defaultVATRate: 0.20,
      weight: 0.715,
      dimensions: { length: 13.0, width: 7.7, height: 8.4 },
      stock: 8,
      brand: 'Sony',
      category: 'photo',
      images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500'],
      attributes: { sensor: 'Full Frame', video: '4K 120fps', recording: '4:2:2 10-bit' }
    },

    // ========== JARDINAGE ==========
    {
      sku: 'HUSQVARNA-AUTOMOWER-430X',
      name: { fr: 'Robot Tondeuse Automower 430X', en: 'Automower 430X Robot Mower', es: 'Robot Cortacésped Automower 430X' },
      description: {
        fr: 'Robot tondeuse Husqvarna Automower 430X, surface jusqu\'à 3200m², navigation GPS, application connectée, silencieux.',
        en: 'Husqvarna Automower 430X robot mower, up to 3200m² area, GPS navigation, connected app, quiet operation.',
        es: 'Robot cortacésped Husqvarna Automower 430X, superficie hasta 3200m², navegación GPS, aplicación conectada, funcionamiento silencioso.'
      },
      priceHT: 208200, // 2082€
      defaultVATRate: 0.20,
      weight: 12.5,
      dimensions: { length: 70.0, width: 57.0, height: 28.0 },
      stock: 12,
      brand: 'Husqvarna',
      category: 'garden',
      images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
      attributes: { area: '3200m²', navigation: 'GPS', connectivity: 'App connectée' }
    },
    {
      sku: 'GARDENA-ROBOT-TONDEUSE',
      name: { fr: 'Tondeuse Robot Gardena', en: 'Gardena Robot Mower', es: 'Robot Cortacésped Gardena' },
      description: {
        fr: 'Robot tondeuse Gardena, surface jusqu\'à 1000m², installation facile, fonctionnement silencieux, sécurité maximale.',
        en: 'Gardena robot mower, up to 1000m² area, easy installation, quiet operation, maximum safety.',
        es: 'Robot cortacésped Gardena, superficie hasta 1000m², instalación fácil, funcionamiento silencioso, máxima seguridad.'
      },
      priceHT: 74900, // 749€
      defaultVATRate: 0.20,
      weight: 8.5,
      dimensions: { length: 60.0, width: 50.0, height: 25.0 },
      stock: 25,
      brand: 'Gardena',
      category: 'garden',
      images: ['/jard2.webp'],
      attributes: { area: '1000m²', installation: 'Facile', safety: 'Maximale' }
    },
    {
      sku: 'STIHL-MS-271',
      name: { fr: 'Tronçonneuse STIHL MS 271', en: 'STIHL MS 271 Chainsaw', es: 'Motorsierra STIHL MS 271' },
      description: {
        fr: 'Tronçonneuse STIHL MS 271, moteur 50.2cm³, guide-chaîne 40cm, système Easy2Start, antivibration.',
        en: 'STIHL MS 271 chainsaw, 50.2cm³ engine, 40cm guide bar, Easy2Start system, anti-vibration.',
        es: 'Motorsierra STIHL MS 271, motor 50.2cm³, barra guía 40cm, sistema Easy2Start, antivibración.'
      },
      priceHT: 29100, // 291€
      defaultVATRate: 0.20,
      weight: 5.2,
      dimensions: { length: 45.0, width: 25.0, height: 30.0 },
      stock: 40,
      brand: 'STIHL',
      category: 'garden',
      images: ['/jard3.webp'],
      attributes: { engine: '50.2cm³', barLength: '40cm', start: 'Easy2Start' }
    },
    {
      sku: 'WORX-LANDROID-L1500',
      name: { fr: 'Tondeuse Robot Worx Landroid', en: 'Worx Landroid Robot Mower', es: 'Robot Cortacésped Worx Landroid' },
      description: {
        fr: 'Robot tondeuse Worx Landroid L1500, surface jusqu\'à 1500m², application WORX, navigation AIA, résistant à la pluie.',
        en: 'Worx Landroid L1500 robot mower, up to 1500m² area, WORX app, AIA navigation, rain resistant.',
        es: 'Robot cortacésped Worx Landroid L1500, superficie hasta 1500m², aplicación WORX, navegación AIA, resistente a la lluvia.'
      },
      priceHT: 108300, // 1083€
      defaultVATRate: 0.20,
      weight: 9.0,
      dimensions: { length: 65.0, width: 52.0, height: 26.0 },
      stock: 18,
      brand: 'Worx',
      category: 'garden',
      images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
      attributes: { area: '1500m²', navigation: 'AIA', connectivity: 'App WORX' }
    },
    {
      sku: 'STIHL-ASPI-SOUFFLEUR',
      name: { fr: 'Aspirateur Souffleur STIHL', en: 'STIHL Blower Vacuum', es: 'Soplador Aspirador STIHL' },
      description: {
        fr: 'Aspirateur souffleur STIHL, 3 en 1 (souffler, aspirer, broyer), sac de collecte 45L, puissance 800W.',
        en: 'STIHL blower vacuum, 3-in-1 (blow, vacuum, shred), 45L collection bag, 800W power.',
        es: 'Soplador aspirador STIHL, 3 en 1 (soplar, aspirar, triturar), bolsa de recogida 45L, potencia 800W.'
      },
      priceHT: 16600, // 166€
      defaultVATRate: 0.20,
      weight: 4.8,
      dimensions: { length: 50.0, width: 30.0, height: 40.0 },
      stock: 50,
      brand: 'STIHL',
      category: 'garden',
      images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
      attributes: { functions: '3 en 1', bag: '45L', power: '800W' }
    },
    {
      sku: 'BOSCH-TAILLE-HAIE',
      name: { fr: 'Taille-haie Électrique Bosch', en: 'Bosch Electric Hedge Trimmer', es: 'Cortasetos Eléctrico Bosch' },
      description: {
        fr: 'Taille-haie électrique Bosch, lame 60cm, puissance 420W, poignée rotative, coupe précise jusqu\'à 19mm.',
        en: 'Bosch electric hedge trimmer, 60cm blade, 420W power, rotating handle, precise cut up to 19mm.',
        es: 'Cortasetos eléctrico Bosch, hoja 60cm, potencia 420W, mango giratorio, corte preciso hasta 19mm.'
      },
      priceHT: 12400, // 124€
      defaultVATRate: 0.20,
      weight: 2.8,
      dimensions: { length: 70.0, width: 20.0, height: 15.0 },
      stock: 60,
      brand: 'Bosch',
      category: 'garden',
      images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
      attributes: { blade: '60cm', power: '420W', cut: '19mm' }
    },
    {
      sku: 'GARDENA-ARROSAGE-CONNECTE',
      name: { fr: 'Système d\'Arrosage Connecté Gardena', en: 'Gardena Connected Irrigation System', es: 'Sistema de Riego Conectado Gardena' },
      description: {
        fr: 'Système d\'arrosage connecté Gardena, contrôle via app, jusqu\'à 6 zones, programmation intelligente, économie d\'eau.',
        en: 'Gardena connected irrigation system, app control, up to 6 zones, smart scheduling, water saving.',
        es: 'Sistema de riego conectado Gardena, control por app, hasta 6 zonas, programación inteligente, ahorro de agua.'
      },
      priceHT: 24900, // 249€
      defaultVATRate: 0.20,
      weight: 1.2,
      dimensions: { length: 25.0, width: 20.0, height: 15.0 },
      stock: 45,
      brand: 'Gardena',
      category: 'garden',
      images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
      attributes: { zones: '6', connectivity: 'App', scheduling: 'Intelligent' }
    },
    {
      sku: 'HUSQVARNA-AUTOMOWER-315X',
      name: { fr: 'Robot Tondeuse Automower 315X', en: 'Automower 315X Robot Mower', es: 'Robot Cortacésped Automower 315X' },
      description: {
        fr: 'Robot tondeuse Husqvarna Automower 315X, surface jusqu\'à 1500m², navigation GPS, application connectée.',
        en: 'Husqvarna Automower 315X robot mower, up to 1500m² area, GPS navigation, connected app.',
        es: 'Robot cortacésped Husqvarna Automower 315X, superficie hasta 1500m², navegación GPS, aplicación conectada.'
      },
      priceHT: 149900, // 1499€
      defaultVATRate: 0.20,
      weight: 10.5,
      dimensions: { length: 68.0, width: 55.0, height: 26.0 },
      stock: 15,
      brand: 'Husqvarna',
      category: 'garden',
      images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'],
      attributes: { area: '1500m²', navigation: 'GPS', connectivity: 'App connectée' }
    },

    // ========== E-MOBILITÉ ==========
    {
      sku: 'XIAOMI-PRO-2',
      name: { fr: 'Trottinette Électrique Xiaomi Pro 2', en: 'Xiaomi Pro 2 Electric Scooter', es: 'Patinete Eléctrico Xiaomi Pro 2' },
      description: {
        fr: 'Trottinette électrique Xiaomi Pro 2, autonomie 45km, vitesse max 25km/h, moteur 300W, pliable.',
        en: 'Xiaomi Pro 2 electric scooter, 45km range, max speed 25km/h, 300W motor, foldable.',
        es: 'Patinete eléctrico Xiaomi Pro 2, autonomía 45km, velocidad máxima 25km/h, motor 300W, plegable.'
      },
      priceHT: 33200, // 332€
      defaultVATRate: 0.20,
      weight: 14.2,
      dimensions: { length: 108.0, width: 43.0, height: 118.0 },
      stock: 80,
      brand: 'Xiaomi',
      category: 'mobility',
      images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500'],
      attributes: { range: '45km', speed: '25km/h', motor: '300W', foldable: true }
    },
    {
      sku: 'SEGWAY-NINEBOT-MAX',
      name: { fr: 'Trottinette Électrique Segway Ninebot', en: 'Segway Ninebot Electric Scooter', es: 'Patinete Eléctrico Segway Ninebot' },
      description: {
        fr: 'Trottinette électrique Segway Ninebot, autonomie 65km, vitesse max 30km/h, moteur 350W, pneus 10 pouces.',
        en: 'Segway Ninebot electric scooter, 65km range, max speed 30km/h, 350W motor, 10-inch tires.',
        es: 'Patinete eléctrico Segway Ninebot, autonomía 65km, velocidad máxima 30km/h, motor 350W, neumáticos 10 pulgadas.'
      },
      priceHT: 49900, // 499€
      defaultVATRate: 0.20,
      weight: 19.0,
      dimensions: { length: 115.0, width: 48.0, height: 120.0 },
      stock: 55,
      brand: 'Segway',
      category: 'mobility',
      images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500'],
      attributes: { range: '65km', speed: '30km/h', motor: '350W', tires: '10"' }
    },
    {
      sku: 'SMART-BALANCE-HOVERBOARD',
      name: { fr: 'Hoverboard Smart Balance', en: 'Smart Balance Hoverboard', es: 'Hoverboard Smart Balance' },
      description: {
        fr: 'Hoverboard Smart Balance, autonomie 20km, vitesse max 15km/h, charge rapide 2h, LED multicolores.',
        en: 'Smart Balance hoverboard, 20km range, max speed 15km/h, fast charge 2h, multicolor LED.',
        es: 'Hoverboard Smart Balance, autonomía 20km, velocidad máxima 15km/h, carga rápida 2h, LED multicolor.'
      },
      priceHT: 20800, // 208€
      defaultVATRate: 0.20,
      weight: 10.5,
      dimensions: { length: 58.0, width: 20.0, height: 20.0 },
      stock: 90,
      brand: 'Smart Balance',
      category: 'mobility',
      images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500'],
      attributes: { range: '20km', speed: '15km/h', charge: '2h', leds: true }
    },
    {
      sku: 'TREK-VELO-ELECTRIQUE',
      name: { fr: 'Vélo Électrique Trek', en: 'Trek Electric Bike', es: 'Bicicleta Eléctrica Trek' },
      description: {
        fr: 'Vélo électrique Trek, assistance jusqu\'à 25km/h, autonomie 100km, moteur Bosch, batterie 500Wh.',
        en: 'Trek electric bike, assistance up to 25km/h, 100km range, Bosch motor, 500Wh battery.',
        es: 'Bicicleta eléctrica Trek, asistencia hasta 25km/h, autonomía 100km, motor Bosch, batería 500Wh.'
      },
      priceHT: 208200, // 2082€
      defaultVATRate: 0.20,
      weight: 22.0,
      dimensions: { length: 180.0, width: 60.0, height: 120.0 },
      stock: 20,
      brand: 'Trek',
      category: 'mobility',
      images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500'],
      attributes: { speed: '25km/h', range: '100km', motor: 'Bosch', battery: '500Wh' }
    },
    {
      sku: 'BOOSTED-SKATEBOARD',
      name: { fr: 'Skateboard Électrique Boosted', en: 'Boosted Electric Skateboard', es: 'Monopatín Eléctrico Boosted' },
      description: {
        fr: 'Skateboard électrique Boosted, autonomie 20km, vitesse max 38km/h, moteur 2000W, télécommande sans fil.',
        en: 'Boosted electric skateboard, 20km range, max speed 38km/h, 2000W motor, wireless remote.',
        es: 'Monopatín eléctrico Boosted, autonomía 20km, velocidad máxima 38km/h, motor 2000W, mando a distancia inalámbrico.'
      },
      priceHT: 108300, // 1083€
      defaultVATRate: 0.20,
      weight: 7.5,
      dimensions: { length: 96.0, width: 25.0, height: 15.0 },
      stock: 30,
      brand: 'Boosted',
      category: 'mobility',
      images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500'],
      attributes: { range: '20km', speed: '38km/h', motor: '2000W', remote: 'Wireless' }
    },

    // ========== OUTILS ==========
    {
      sku: 'BOSCH-PERCEUSE-GSR',
      name: { fr: 'Perceuse Visseuse Sans Fil Bosch', en: 'Bosch Cordless Drill Driver', es: 'Taladro Atornillador Inalámbrico Bosch' },
      description: {
        fr: 'Perceuse visseuse sans fil Bosch GSR 18V, couple 65Nm, batterie 18V 4Ah incluse, charge rapide.',
        en: 'Bosch GSR 18V cordless drill driver, 65Nm torque, 18V 4Ah battery included, fast charging.',
        es: 'Taladro atornillador inalámbrico Bosch GSR 18V, par 65Nm, batería 18V 4Ah incluida, carga rápida.'
      },
      priceHT: 10800, // 108€
      defaultVATRate: 0.20,
      weight: 1.5,
      dimensions: { length: 25.0, width: 8.0, height: 20.0 },
      stock: 100,
      brand: 'Bosch',
      category: 'tools',
      images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500'],
      attributes: { voltage: '18V', torque: '65Nm', battery: '4Ah' }
    },
    {
      sku: 'MAKITA-SCIE-CIRCULAIRE',
      name: { fr: 'Scie Circulaire Makita', en: 'Makita Circular Saw', es: 'Sierra Circular Makita' },
      description: {
        fr: 'Scie circulaire Makita 18V, lame 165mm, profondeur de coupe 57mm, moteur brushless, batterie incluse.',
        en: 'Makita 18V circular saw, 165mm blade, 57mm cutting depth, brushless motor, battery included.',
        es: 'Sierra circular Makita 18V, hoja 165mm, profundidad de corte 57mm, motor sin escobillas, batería incluida.'
      },
      priceHT: 16600, // 166€
      defaultVATRate: 0.20,
      weight: 3.2,
      dimensions: { length: 30.0, width: 20.0, height: 15.0 },
      stock: 70,
      brand: 'Makita',
      category: 'tools',
      images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500'],
      attributes: { voltage: '18V', blade: '165mm', depth: '57mm', motor: 'Brushless' }
    },
    {
      sku: 'FESTOOL-PONCEUSE-EXCENTRIQUE',
      name: { fr: 'Ponceuse Excentrique Festool', en: 'Festool Eccentric Sander', es: 'Lijadora Excéntrica Festool' },
      description: {
        fr: 'Ponceuse excentrique Festool ETS 150, diamètre 150mm, vitesse variable, système d\'aspiration intégré.',
        en: 'Festool ETS 150 eccentric sander, 150mm diameter, variable speed, integrated dust extraction.',
        es: 'Lijadora excéntrica Festool ETS 150, diámetro 150mm, velocidad variable, extracción de polvo integrada.'
      },
      priceHT: 37400, // 374€
      defaultVATRate: 0.20,
      weight: 2.8,
      dimensions: { length: 30.0, width: 15.0, height: 12.0 },
      stock: 40,
      brand: 'Festool',
      category: 'tools',
      images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500'],
      attributes: { diameter: '150mm', speed: 'Variable', extraction: 'Intégré' }
    },
    {
      sku: 'DEWALT-MEULEUSE-ANGLE',
      name: { fr: 'Meuleuse d\'Angle DeWalt', en: 'DeWalt Angle Grinder', es: 'Amoladora Angular DeWalt' },
      description: {
        fr: 'Meuleuse d\'angle DeWalt 18V, disque 125mm, moteur brushless, protection anti-redémarrage, batterie incluse.',
        en: 'DeWalt 18V angle grinder, 125mm disc, brushless motor, restart protection, battery included.',
        es: 'Amoladora angular DeWalt 18V, disco 125mm, motor sin escobillas, protección contra reinicio, batería incluida.'
      },
      priceHT: 14900, // 149€
      defaultVATRate: 0.20,
      weight: 2.5,
      dimensions: { length: 28.0, width: 12.0, height: 12.0 },
      stock: 85,
      brand: 'DeWalt',
      category: 'tools',
      images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500'],
      attributes: { voltage: '18V', disc: '125mm', motor: 'Brushless', protection: true }
    },

    // ========== ÉLECTRONIQUE - AUTRES ==========
    {
      sku: 'ROOMBA-I7-PLUS',
      name: { fr: 'Aspirateur Robot Roomba i7+', en: 'Roomba i7+ Robot Vacuum', es: 'Aspirador Robot Roomba i7+' },
      description: {
        fr: 'Aspirateur robot Roomba i7+ avec station de vidage automatique, navigation iAdapt 3.0, application iRobot HOME.',
        en: 'Roomba i7+ robot vacuum with automatic emptying station, iAdapt 3.0 navigation, iRobot HOME app.',
        es: 'Aspirador robot Roomba i7+ con estación de vaciado automático, navegación iAdapt 3.0, aplicación iRobot HOME.'
      },
      priceHT: 49900, // 499€
      defaultVATRate: 0.20,
      weight: 3.6,
      dimensions: { length: 34.0, width: 34.0, height: 9.3 },
      stock: 65,
      brand: 'iRobot',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
      attributes: { emptying: 'Automatique', navigation: 'iAdapt 3.0', connectivity: 'App' }
    },
    {
      sku: 'SONOS-ERA-300',
      name: { fr: 'Enceinte Sonos Era 300', en: 'Sonos Era 300 Speaker', es: 'Altavoz Sonos Era 300' },
      description: {
        fr: 'Enceinte Sonos Era 300, audio spatial Dolby Atmos, WiFi et Bluetooth, commande vocale, design moderne.',
        en: 'Sonos Era 300 speaker, Dolby Atmos spatial audio, WiFi and Bluetooth, voice control, modern design.',
        es: 'Altavoz Sonos Era 300, audio espacial Dolby Atmos, WiFi y Bluetooth, control por voz, diseño moderno.'
      },
      priceHT: 37400, // 374€
      defaultVATRate: 0.20,
      weight: 4.5,
      dimensions: { length: 16.0, width: 10.0, height: 20.0 },
      stock: 75,
      brand: 'Sonos',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
      attributes: { audio: 'Dolby Atmos', connectivity: 'WiFi + Bluetooth', voice: true }
    },
    {
      sku: 'SAMSUNG-ODYSSEY-G9',
      name: { fr: 'Écran Gaming Samsung Odyssey', en: 'Samsung Odyssey Gaming Monitor', es: 'Monitor Gaming Samsung Odyssey' },
      description: {
        fr: 'Écran gaming Samsung Odyssey 49" courbé, QLED 5120x1440, 240Hz, HDR1000, G-Sync et FreeSync.',
        en: 'Samsung Odyssey 49" curved gaming monitor, QLED 5120x1440, 240Hz, HDR1000, G-Sync and FreeSync.',
        es: 'Monitor gaming curvo Samsung Odyssey 49", QLED 5120x1440, 240Hz, HDR1000, G-Sync y FreeSync.'
      },
      priceHT: 66600, // 666€
      defaultVATRate: 0.20,
      weight: 14.5,
      dimensions: { length: 114.0, width: 35.0, height: 52.0 },
      stock: 30,
      brand: 'Samsung',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'],
      attributes: { size: '49"', resolution: '5120x1440', refresh: '240Hz', hdr: 'HDR1000' }
    },
    {
      sku: 'SONY-WH-1000XM5',
      name: { fr: 'Casque Sony WH-1000XM5', en: 'Sony WH-1000XM5 Headphones', es: 'Auriculares Sony WH-1000XM5' },
      description: {
        fr: 'Casque sans fil Sony WH-1000XM5, réduction de bruit active, audio haute résolution, autonomie 30h.',
        en: 'Sony WH-1000XM5 wireless headphones, active noise cancellation, high-resolution audio, 30-hour battery.',
        es: 'Auriculares inalámbricos Sony WH-1000XM5, cancelación activa de ruido, audio de alta resolución, batería 30 horas.'
      },
      priceHT: 33200, // 332€
      defaultVATRate: 0.20,
      weight: 0.25,
      dimensions: { length: 20.0, width: 18.0, height: 8.0 },
      stock: 120,
      brand: 'Sony',
      category: 'electronics',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
      attributes: { noiseCancellation: true, audio: 'Hi-Res', battery: '30h' }
    },
  ];

  // Créer les produits
  for (const product of products) {
    await prisma.products.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        ...product,
        id: crypto.randomUUID(),
        updatedAt: new Date(),
      },
    });
    console.log(`✅ Product created: ${product.name.fr}`);
  }

  // Créer les paramètres du site par défaut
  console.log('⚙️ Seeding site settings...');
  await prisma.site_settings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      newsBarText: 'Bienvenue sur EJS Market - Votre expert High-Tech & Jardin en Europe !',
      updatedAt: new Date(),
    },
  });
  console.log('✅ Site settings created');

  // Appeler le seed de contenu additionnel
  await seedContent();

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

