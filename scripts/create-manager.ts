import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createManager() {
  try {
    const email = process.env.MANAGER_EMAIL;
    const password = process.env.MANAGER_PASSWORD;
    const name = process.env.MANAGER_NAME || 'Gestionnaire';

    if (!email || !password) {
      console.error('❌ Erreur : MANAGER_EMAIL ou MANAGER_PASSWORD non définis dans l\'environnement.');
      console.log('💡 Assurez-vous d\'avoir ces variables dans votre fichier .env.local');
      process.exit(1);
    }

    console.log('🔐 Création d\'un utilisateur MANAGER...\n');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`⚠️  L'utilisateur ${email} existe déjà.`);
      console.log('   Rôle actuel:', existingUser.role);

      if (existingUser.role === 'MANAGER') {
        console.log('✅ L\'utilisateur est déjà un MANAGER.');
        console.log('\n📧 Email:', email);
        console.log('🔑 Mot de passe:', password);
        console.log('\n💡 Pour changer le mot de passe, supprimez d\'abord l\'utilisateur ou modifiez-le manuellement.');
        await prisma.$disconnect();
        return;
      } else {
        // Mettre à jour le rôle
        const updatedUser = await prisma.users.update({
          where: { email },
          data: { role: 'MANAGER' },
        });
        console.log('✅ Rôle mis à jour vers MANAGER.');
        console.log('\n📧 Email:', email);
        console.log('🔑 Mot de passe:', '(inchangé - utilisez le mot de passe existant)');
        await prisma.$disconnect();
        return;
      }
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email,
        passwordHash,
        name,
        role: UserRole.MANAGER,
        isEmailVerified: true, // Marquer comme vérifié pour faciliter les tests
        updatedAt: new Date(),
      },
    });

    console.log('✅ Utilisateur MANAGER créé avec succès !\n');
    console.log('📋 Informations de connexion :');
    console.log('   📧 Email:', email);
    console.log('   🔑 Mot de passe:', password);
    console.log('   👤 Nom:', name);
    console.log('   🎭 Rôle:', user.role);
    console.log('   🆔 ID:', user.id);
    console.log('\n💡 Vous pouvez maintenant vous connecter avec ces identifiants.');
    console.log('   URL: http://localhost:3000/admin');
    console.log('\n⚠️  Note: Changez le mot de passe après la première connexion en production !');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur MANAGER:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createManager()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

