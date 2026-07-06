import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Données actuelles extraites du site
const currentPartners = [
  { name: 'Apple', local: '/logos/apple.svg', cdn: 'https://cdn.simpleicons.org/apple/000000' },
  { name: 'Samsung', local: '/logos/samsung.svg', cdn: 'https://cdn.simpleicons.org/samsung/1428A0' },
  { name: 'Sony', local: '/logos/sony.svg', cdn: 'https://cdn.simpleicons.org/sony/000000' },
  { name: 'LG', local: '/logos/lg.svg', cdn: 'https://cdn.simpleicons.org/lg/A50034' },
  { name: 'Dell', local: '/logos/dell.svg', cdn: 'https://cdn.simpleicons.org/dell/007DB8' },
  { name: 'HP', local: '/logos/hp.svg', cdn: 'https://cdn.simpleicons.org/hp/0096D6' },
  { name: 'Lenovo', local: '/logos/lenovo.svg', cdn: 'https://cdn.simpleicons.org/lenovo/E2231A' },
  { name: 'ASUS', local: '/logos/asus.svg', cdn: 'https://cdn.simpleicons.org/asus/000000' },
  { name: 'Acer', local: '/logos/acer.svg', cdn: 'https://cdn.simpleicons.org/acer/83B81A' },
  { name: 'MSI', local: '/logos/msi.svg', cdn: 'https://cdn.simpleicons.org/msi/FF0000' },
  { name: 'Nikon', local: '/logos/nikon.svg', cdn: 'https://cdn.simpleicons.org/nikon/000000' },
  { name: 'Panasonic', local: '/logos/panasonic.svg', cdn: 'https://cdn.simpleicons.org/panasonic/EB1923' },
  { name: 'JBL', local: '/logos/jbl.svg', cdn: 'https://cdn.simpleicons.org/jbl/FF3300' },
  { name: 'Google', local: '/logos/google.svg', cdn: 'https://cdn.simpleicons.org/google/4285F4' },
  { name: 'PlayStation', local: '/logos/playstation.svg', cdn: 'https://cdn.simpleicons.org/playstation/003087' },
  { name: 'Intel', local: '/logos/intel.svg', cdn: 'https://cdn.simpleicons.org/intel/0071C5' },
  { name: 'AMD', local: '/logos/amd.svg', cdn: 'https://cdn.simpleicons.org/amd/ED1C24' },
  { name: 'NVIDIA', local: '/logos/nvidia.svg', cdn: 'https://cdn.simpleicons.org/nvidia/76B900' },
  { name: 'Husqvarna', local: '/logos/husqvarna.svg', cdn: 'https://cdn.simpleicons.org/husqvarna/27378C' },
  { name: 'STIHL', local: '/logos/stihl.svg', cdn: 'https://cdn.simpleicons.org/stihl/000000' },
  { name: 'Bosch', local: '/logos/bosch.svg', cdn: 'https://cdn.simpleicons.org/bosch/EA0016' },
  { name: 'Xiaomi', local: '/logos/xiaomi.svg', cdn: 'https://cdn.simpleicons.org/xiaomi/FF6900' },
  { name: 'OnePlus', local: '/logos/oneplus.svg', cdn: 'https://cdn.simpleicons.org/oneplus/EB0028' },
  { name: 'Razer', local: '/logos/razer.svg', cdn: 'https://cdn.simpleicons.org/razer/00FF00' },
  { name: 'Logitech', local: '/logos/logitech.svg', cdn: 'https://cdn.simpleicons.org/logitech/00B8FC' },
];

const currentTestimonials = [
  { name: 'Marie L.', initial: 'ML', rating: 5, text: 'Livraison rapide et produit de qualité. Je recommande vivement !', product: 'iPhone 15 Pro', date: 'Il y a 2 semaines' },
  { name: 'Jean D.', initial: 'JD', rating: 5, text: 'Excellent service client et robot tondeuse parfait. Mon jardin n\'a jamais été aussi beau !', product: 'Robot Tondeuse Automower', date: 'Il y a 1 mois' },
  { name: 'Sophie M.', initial: 'SM', rating: 5, text: 'Très satisfaite de mon iPhone 15 Pro, merci pour ce service impeccable !', product: 'iPhone 15 Pro', date: 'Il y a 3 semaines' },
  { name: 'Thomas B.', initial: 'TB', rating: 5, text: 'MacBook Pro M3 exceptionnel ! Livraison express et emballage soigné.', product: 'MacBook Pro M3', date: 'Il y a 5 jours' },
  { name: 'Laura K.', initial: 'LK', rating: 5, text: 'PlayStation 5 enfin trouvée ici ! Commande facile et suivi parfait.', product: 'PlayStation 5', date: 'Il y a 1 semaine' },
];

const currentTechImages = [
  { url: '/img1.webp', name: 'iPhone 15 Pro Max', price: 1399, available: true },
  { url: '/img2.webp', name: 'MacBook Pro M3', price: 2499, available: true },
  { url: '/img3.webp', name: 'PlayStation 5', price: 499, available: false },
];

const currentJardinImages = [
  { url: '/jard1.webp', name: 'Robot Tondeuse Automower 430X', price: 2499, available: true },
  { url: '/jard2.webp', name: 'Tondeuse Robot Gardena', price: 899, available: true },
  { url: '/jard3.webp', name: 'Tronçonneuse STIHL', price: 349, available: true },
];

const currentImmersiveImages = [
  { url: '/img1.webp', name: 'iPhone 15 Pro Max' },
  { url: '/img2.webp', name: 'MacBook Pro M3' },
  { url: '/img3.webp', name: 'PlayStation 5' },
];

export async function seedContent() {
  // Use a shared prisma instance or create a new one if not provided
  const prisma = new PrismaClient();
  console.log('🌱 Importation des contenus actuels...\n');

  try {
    // Import des partenaires
    console.log('📋 Importation des partenaires...');
    let partnerCount = 0;
    for (let i = 0; i < currentPartners.length; i++) {
      const partner = currentPartners[i];
      try {
        // Vérifier si le partenaire existe déjà
        const existing = await prisma.partners.findFirst({
          where: { name: partner.name },
        });

        if (existing) {
          // Mettre à jour
          await prisma.partners.update({
            where: { id: existing.id },
            data: {
              logoPath: partner.local,
              cdnUrl: partner.cdn,
              width: 120,
              height: 40,
              alt: `Logo ${partner.name}`,
              order: i,
              isActive: true,
              updatedAt: new Date(),
            },
          });
        } else {
          // Créer
          await prisma.partners.create({
            data: {
              id: crypto.randomUUID(),
              name: partner.name,
              logoPath: partner.local,
              updatedAt: new Date(),
              cdnUrl: partner.cdn,
              width: 120,
              height: 40,
              alt: `Logo ${partner.name}`,
              order: i,
              isActive: true,
            },
          });
        }
        partnerCount++;
      } catch (error) {
        console.error(`  ❌ Erreur pour ${partner.name}:`, error);
      }
    }
    console.log(`  ✅ ${partnerCount} partenaires importés\n`);

    // Import des témoignages
    console.log('💬 Importation des témoignages...');
    let testimonialCount = 0;
    for (let i = 0; i < currentTestimonials.length; i++) {
      const testimonial = currentTestimonials[i];
      try {
        // Vérifier si le témoignage existe déjà
        const existing = await prisma.testimonials.findFirst({
          where: {
            name: testimonial.name,
            product: testimonial.product,
          },
        });

        if (existing) {
          // Mettre à jour
          await prisma.testimonials.update({
            where: { id: existing.id },
            data: {
              initial: testimonial.initial,
              rating: testimonial.rating,
              text: {
                fr: testimonial.text,
                en: testimonial.text,
              },
              date: testimonial.date,
              order: i,
              isActive: true,
            },
          });
        } else {
          // Créer
          await prisma.testimonials.create({
            data: {
              id: crypto.randomUUID(),
              name: testimonial.name,
              initial: testimonial.initial,
              rating: testimonial.rating,
              text: {
                fr: testimonial.text,
                en: testimonial.text,
              },
              product: testimonial.product,
              date: testimonial.date,
              order: i,
              isActive: true,
              updatedAt: new Date(),
            },
          });
        }
        testimonialCount++;
      } catch (error) {
        console.error(`  ❌ Erreur pour ${testimonial.name}:`, error);
      }
    }
    console.log(`  ✅ ${testimonialCount} témoignages importés\n`);

    // Import des images Hero Tech
    console.log('🖼️  Importation des images Hero Tech...');
    let techCount = 0;
    for (let i = 0; i < currentTechImages.length; i++) {
      const image = currentTechImages[i];
      try {
        // Vérifier si l'image existe déjà
        const existing = await prisma.hero_images.findFirst({
          where: {
            type: 'tech',
            name: image.name,
          },
        });

        if (existing) {
          // Mettre à jour
          await prisma.hero_images.update({
            where: { id: existing.id },
            data: {
              imageUrl: image.url,
              price: image.price ? Math.round(image.price * 100) : null,
              available: image.available,
              order: i,
              isActive: true,
            },
          });
        } else {
          // Créer
          await prisma.hero_images.create({
            data: {
              id: crypto.randomUUID(),
              type: 'tech',
              name: image.name,
              imageUrl: image.url,
              price: image.price ? Math.round(image.price * 100) : null,
              available: image.available,
              order: i,
              isActive: true,
              updatedAt: new Date(),
            },
          });
        }
        techCount++;
      } catch (error) {
        console.error(`  ❌ Erreur pour ${image.name}:`, error);
      }
    }
    console.log(`  ✅ ${techCount} images Tech importées\n`);

    // Import des images Hero Jardin
    console.log('🌿 Importation des images Hero Jardin...');
    let jardinCount = 0;
    for (let i = 0; i < currentJardinImages.length; i++) {
      const image = currentJardinImages[i];
      try {
        // Vérifier si l'image existe déjà
        const existing = await prisma.hero_images.findFirst({
          where: {
            type: 'garden',
            name: image.name,
          },
        });

        if (existing) {
          // Mettre à jour
          await prisma.hero_images.update({
            where: { id: existing.id },
            data: {
              imageUrl: image.url,
              price: image.price ? Math.round(image.price * 100) : null,
              available: image.available,
              order: i,
              isActive: true,
            },
          });
        } else {
          // Créer
          await prisma.hero_images.create({
            data: {
              id: crypto.randomUUID(),
              type: 'garden',
              name: image.name,
              imageUrl: image.url,
              price: image.price ? Math.round(image.price * 100) : null,
              available: image.available,
              order: i,
              isActive: true,
              updatedAt: new Date(),
            },
          });
        }
        jardinCount++;
      } catch (error) {
        console.error(`  ❌ Erreur pour ${image.name}:`, error);
      }
    }
    console.log(`  ✅ ${jardinCount} images Jardin importées\n`);

    // Import des images immersives
    console.log('✨ Importation des images immersives...');
    let immersiveCount = 0;
    for (let i = 0; i < currentImmersiveImages.length; i++) {
      const image = currentImmersiveImages[i];
      try {
        // Vérifier si l'image existe déjà
        const existing = await prisma.immersive_images.findFirst({
          where: { name: image.name },
        });

        if (existing) {
          // Mettre à jour
          await prisma.immersive_images.update({
            where: { id: existing.id },
            data: {
              imageUrl: image.url,
              order: i,
              isActive: true,
              updatedAt: new Date(),
            },
          });
        } else {
          // Créer
          await prisma.immersive_images.create({
            data: {
              id: crypto.randomUUID(),
              name: image.name,
              imageUrl: image.url,
              order: i,
              isActive: true,
              updatedAt: new Date(),
            },
          });
        }
        immersiveCount++;
      } catch (error) {
        console.error(`  ❌ Erreur pour ${image.name}:`, error);
      }
    }
    console.log(`  ✅ ${immersiveCount} images immersives importées\n`);

    console.log('✨ Importation terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}



