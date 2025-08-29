import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,

    async signIn({ user, account, profile }) {
      try {
        if (user || account?.provider !== "credentials") {
          console.log("✅ Sign-in allowed", {
            provider: account?.provider,
            userEmail: user?.email,
          });
          return true;
        }

        console.warn("⚠️ Sign-in blocked: No user and using credentials provider");
        return false;
      } catch (error) {
        console.error("❌ Error during signIn callback:", error);
        return false;
      }
    },

    async session({ session, token }) {
      try {
        if (!session?.user) {
          console.warn("⚠️ Session callback: session.user is missing");
        }

        if (!token?.sub) {
          console.warn("⚠️ Session callback: token.sub is missing");
        }

        if (token && session.user) {
          (session.user as any).id = token.sub as string;
          console.log("✅ Session enriched with user ID:", {
            sub: token.sub,
            userId: (session.user as any).id,
            email: session.user.email,
            name: session.user.name
          });
        }

        return session;
      } catch (error) {
        console.error("❌ Error during session callback:", error);
        return session;
      }
    },

    async redirect({ url, baseUrl }) {
      try {
        const finalUrl = url.startsWith("/") ? `${baseUrl}${url}` : url;
        console.log("🔀 Redirecting to:", finalUrl);
        return finalUrl;
      } catch (error) {
        console.error("❌ Error during redirect callback:", error);
        return baseUrl;
      }
    },
  },
});

export { handler as GET, handler as POST };