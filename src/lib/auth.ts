import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./database"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { passwordService } from "./password"


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        // Verify password
        const isPasswordValid = await passwordService.verifyPassword(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Return user object without password
        const { password, ...userWithoutPassword } = user
        return {
          id: userWithoutPassword.id,
          email: userWithoutPassword.email,
          name: userWithoutPassword.name,
          image: userWithoutPassword.image,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout"
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // For OAuth providers like Google, the user ID is in the `sub` claim
        // For credentials provider, it's in user.id
        const userId = (user as any).id || (user as any).sub
        if (userId) {
          token.sub = userId
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        // Use the ID from token.sub which contains the user ID
        if (token.sub) {
          ;(session.user as any).id = token.sub
        }
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // Use the configured NEXTAUTH_URL or fallback to baseUrl
      const authUrl = process.env.NEXTAUTH_URL || baseUrl

      // Ensure HTTPS for production environments
      const secureBaseUrl = process.env.NODE_ENV === 'production'
        ? authUrl.replace('http://', 'https://')
        : authUrl

      // Special handling for Google OAuth callback
      if (url.includes('/api/auth/callback/google')) return url
      // Default to the base URL if callback URL is invalid
      return url.startsWith("/") || url.startsWith(secureBaseUrl) ? url : `${secureBaseUrl}${url}`
    }
  }
}