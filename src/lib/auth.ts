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
  
  // Handle OAuth profile image extraction
  events: {
    async createUser({ user }) {
      // For OAuth users, fetch the profile image from the provider
      if (user.image && user.email) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
        
        // If user exists, update their image
        if (existingUser) {
          await prisma.user.update({
            where: { email: user.email },
            data: { image: user.image }
          })
        }
      }
    }
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/home"
  },
  callbacks: {
    // Note: The profile callback is not available in newer NextAuth versions
    // The image extraction is now handled in the jwt callback
    async jwt({ token, user, account }) {
      if (user) {
        // For OAuth providers like Google, the user ID is in the `sub` claim
        // For credentials provider, it's in user.id
        const userId = (user as any).id || (user as any).sub
        if (userId) {
          token.sub = userId
          
          // For OAuth providers, fetch the user's image from the database
          if (account?.provider && account.provider !== 'credentials') {
            const dbUser = await prisma.user.findUnique({
              where: { id: userId },
              select: { image: true }
            })
            if (dbUser?.image) {
              token.image = dbUser.image
            }
          } else {
            // For credentials provider, use the image from the user object
            token.image = (user as any).image
          }
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
        
        // Include the user's image in the session
        if (token.image) {
          ;(session.user as any).image = token.image
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
      if (url.includes('/api/auth/callback/google')) return '/home'
      
      // If no callback URL is specified, default to /home
      if (url === '/') return '/home'
      
      // Default to the base URL if callback URL is invalid
      return url.startsWith("/") || url.startsWith(secureBaseUrl) ? url : `${secureBaseUrl}/home`
    }
  }
}