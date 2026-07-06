import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[NextAuth] --- DEBUT AUTHORIZE ---');

        const email = (credentials?.email as string)?.toLowerCase().trim();
        const password = credentials?.password as string;

        if (!email || !password) {
          console.error('[NextAuth] Identifiants manquants');
          return null;
        }

        const prisma = new PrismaClient();
        try {
          console.log('[NextAuth] Recherche utilisateur:', email);
          await prisma.$connect();

          const user = await prisma.users.findUnique({
            where: { email },
          });

          if (!user) {
            console.error('[NextAuth] UTILISATEUR NON TROUVE:', email);
            return null;
          }

          console.log('[NextAuth] Utilisateur trouvé, vérification du hash...');

          const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash || ''
          );

          if (!isPasswordValid) {
            console.error('[NextAuth] MOT DE PASSE REJETE pour:', email);
            return null;
          }

          console.log('[NextAuth] AUTHENTIFICATION REUSSIE:', email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error('[NextAuth] ERREUR CRITIQUE DATABASE:', error.message);
          return null;
        } finally {
          await prisma.$disconnect();
          console.log('[NextAuth] --- FIN AUTHORIZE ---');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch (e) { }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
  debug: true,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions as any);
