import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize appelé avec:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Erreur: email ou mot de passe manquant");
          throw new Error("Email et mot de passe requis")
        }

        try {
          console.log("Recherche de l'utilisateur avec email:", credentials.email);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            console.log("Utilisateur non trouvé");
            throw new Error("Utilisateur non trouvé")
          }

          console.log("Utilisateur trouvé:", { id: user.id, email: user.email, role: user.role });

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          console.log("Mot de passe valide:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("Mot de passe incorrect");
            throw new Error("Mot de passe incorrect")
          }

          console.log("Authentification réussie pour:", user.email);
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            classId: user.classId
          }
        } catch (error) {
          console.error("Erreur dans authorize:", error);
          throw error
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.classId = user.classId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.classId = token.classId as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login"
  }
} 

