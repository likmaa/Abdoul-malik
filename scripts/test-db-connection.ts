import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à la base de données...\n');

    // Test 1: Connexion de base
    console.log('1️⃣ Test de connexion...');
    await prisma.$connect();
    console.log('✅ Connexion réussie\n');

    // Test 2: Vérifier que l'utilisateur admin existe
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ejsmarket.com';
    console.log('2️⃣ Vérification de l\'utilisateur admin...');
    const admin = await prisma.users.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      console.log('❌ Utilisateur admin introuvable');
      console.log('💡 Création de l\'utilisateur admin...');

      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      const newAdmin = await prisma.users.create({
        data: {
          id: crypto.randomUUID(),
          email: adminEmail,
          passwordHash,
          name: 'Administrateur',
          role: 'ADMIN',
          isEmailVerified: true,
          updatedAt: new Date(),
        },
      });
      console.log('✅ Utilisateur admin créé');
      console.log('   Email:', newAdmin.email);
      console.log('   Rôle:', newAdmin.role);
    } else {
      console.log('✅ Utilisateur admin trouvé');
      console.log('   Email:', admin.email);
      console.log('   Rôle:', admin.role);
      console.log('   ID:', admin.id);

      // Test 3: Vérifier le mot de passe
      console.log('\n3️⃣ Test du mot de passe...');
      const testPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
      const isPasswordValid = await bcrypt.compare(testPassword, admin.passwordHash || "");

      if (isPasswordValid) {
        console.log('✅ Mot de passe valide');
        console.log('   Mot de passe testé:', testPassword);
      } else {
        console.log('❌ Mot de passe invalide');
        console.log('💡 Réinitialisation du mot de passe...');

        const newPasswordHash = await bcrypt.hash(testPassword, 12);
        await prisma.users.update({
          where: { email: adminEmail },
          data: { passwordHash: newPasswordHash },
        });
        console.log('✅ Mot de passe réinitialisé');
        console.log('   Nouveau mot de passe:', testPassword);
      }
    }

    // Test 4: Compter les utilisateurs
    console.log('\n4️⃣ Statistiques de la base de données...');
    const userCount = await prisma.users.count();
    console.log(`   Nombre d'utilisateurs: ${userCount}`);

    console.log('\n✅ Tous les tests sont passés !');
    console.log('\n📋 Identifiants de connexion :');
    console.log(`   Email: ${adminEmail}`);
    console.log('   Mot de passe: ******** (masqué)');

  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

