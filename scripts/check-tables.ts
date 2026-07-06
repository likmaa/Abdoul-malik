import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log('Vérification des tables...\n');
    
    // Vérifier Partner
    try {
      const partnerCount = await prisma.partners.count();
      console.log(`✅ Table 'partners' existe (${partnerCount} enregistrements)`);
    } catch (error: any) {
      console.log(`❌ Table 'partners' n'existe pas: ${error.message}`);
    }

    // Vérifier Testimonial
    try {
      const testimonialCount = await prisma.testimonials.count();
      console.log(`✅ Table 'testimonials' existe (${testimonialCount} enregistrements)`);
    } catch (error: any) {
      console.log(`❌ Table 'testimonials' n'existe pas: ${error.message}`);
    }

    // Vérifier HeroImage
    try {
      const heroCount = await prisma.hero_images.count();
      console.log(`✅ Table 'hero_images' existe (${heroCount} enregistrements)`);
    } catch (error: any) {
      console.log(`❌ Table 'hero_images' n'existe pas: ${error.message}`);
    }

    // Vérifier ImmersiveImage
    try {
      const immersiveCount = await prisma.immersive_images.count();
      console.log(`✅ Table 'immersive_images' existe (${immersiveCount} enregistrements)`);
    } catch (error: any) {
      console.log(`❌ Table 'immersive_images' n'existe pas: ${error.message}`);
    }

    console.log('\n✅ Vérification terminée');
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();

