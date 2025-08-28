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
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
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

        try {
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
            ...userWithoutPassword,
            id: user.id,
            email: user.email,
            name: user.name || user.email
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout"
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback:', { url, baseUrl })
      
      // Use the configured NEXTAUTH_URL or fallback to baseUrl
      const authUrl = process.env.NEXTAUTH_URL || baseUrl
      
      // Ensure HTTPS for production environments
      const secureBaseUrl = process.env.NODE_ENV === 'production'
        ? authUrl.replace('http://', 'https://')
        : authUrl
        
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${secureBaseUrl}${url}`
      // Allows callback URLs on the same origin
      try {
        if (new URL(url).origin === secureBaseUrl) return url
      } catch {
        // URL parsing failed, continue to next checks
      }
      // Special handling for Google OAuth callback
      if (url.includes('/api/auth/callback/google')) return url
      // Default to the base URL if callback URL is invalid
      return secureBaseUrl
    }
  }
}