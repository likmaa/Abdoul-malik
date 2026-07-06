import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const newPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !newPassword) {
      console.error('❌ Erreur : ADMIN_EMAIL ou ADMIN_PASSWORD non définis dans l\'environnement.');
      console.log('💡 Assurez-vous d\'avoir ces variables dans votre fichier .env.local');
      process.exit(1);
    }

    console.log('🔐 Réinitialisation du mot de passe admin...\n');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Nouveau mot de passe: ******** (masqué pour la sécurité)');
    console.log('');

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.users.findUnique({
      where: { email: adminEmail },
    });

    if (!existingUser) {
      console.log('⚠️  L\'utilisateur admin n\'existe pas. Création...\n');

      // Hasher le mot de passe
      const passwordHash = await bcrypt.hash(newPassword, 12);

      // Créer l'utilisateur admin
      const admin = await prisma.users.create({
        data: {
          id: crypto.randomUUID(),
          email: adminEmail,
          passwordHash,
          name: 'Administrateur',
          role: UserRole.ADMIN,
          isEmailVerified: true,
          updatedAt: new Date(),
        },
      });

      console.log('✅ Utilisateur admin créé avec succès !\n');
      console.log('📋 Informations de connexion :');
      console.log('   📧 Email:', adminEmail);
      console.log('   🔑 Mot de passe:', newPassword);
      console.log('   🆔 ID:', admin.id);
      console.log('   🎭 Rôle:', admin.role);
    } else {
      console.log('✅ Utilisateur admin trouvé. Mise à jour du mot de passe...\n');

      // Hasher le nouveau mot de passe
      const passwordHash = await bcrypt.hash(newPassword, 12);

      // Mettre à jour le mot de passe
      const updatedUser = await prisma.users.update({
        where: { email: adminEmail },
        data: {
          passwordHash,
          // S'assurer que le rôle est ADMIN
          role: UserRole.ADMIN,
          isEmailVerified: true,
        },
      });

      console.log('✅ Mot de passe admin réinitialisé avec succès !\n');
      console.log('📋 Informations de connexion :');
      console.log('   📧 Email:', adminEmail);
      console.log('   🔑 Nouveau mot de passe:', newPassword);
      console.log('   🆔 ID:', updatedUser.id);
      console.log('   🎭 Rôle:', updatedUser.role);
    }

    console.log('\n💡 Vous pouvez maintenant vous connecter avec ces identifiants.');
    console.log('   URL: https://ejs.ticmiton.com/login');
    console.log('\n⚠️  Note: Changez le mot de passe après la première connexion !');

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation du mot de passe admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
resetAdminPassword()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

