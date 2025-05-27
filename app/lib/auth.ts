import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials, req) {
        console.log("Authorize appelé avec:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Erreur: email ou mot de passe manquant");
          throw new Error('Email et mot de passe requis')
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          console.log("Utilisateur trouvé:", user ? "Oui" : "Non");
          
          if (!user) {
            throw new Error('Aucun utilisateur trouvé avec cet email')
          }

          // Dans une application réelle, vous devriez vérifier le mot de passe de manière sécurisée
          // en utilisant bcrypt ou une autre bibliothèque de hachage
          const isValidPassword = user.password === credentials.password

          console.log("Mot de passe valide:", isValidPassword);
          
          if (!isValidPassword) {
            throw new Error('Mot de passe incorrect')
          }

          // Retourner les données utilisateur
          const userData = {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          };
          
          console.log("Authentification réussie pour:", userData.email);
          return userData;
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback:", { hasUser: !!user, tokenBefore: { ...token } });
      
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        console.log("JWT mis à jour avec les données utilisateur");
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback:", { hasToken: !!token, sessionBefore: { ...session } });
      
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        console.log("Session mise à jour avec les données du token");
      }
      
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error(`[Auth] Error: ${code}`, metadata);
    },
    warn(code) {
      console.warn(`[Auth] Warning: ${code}`);
    },
    debug(code, metadata) {
      console.log(`[Auth] Debug: ${code}`, metadata);
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'default_secret_key_replace_in_production',
} 