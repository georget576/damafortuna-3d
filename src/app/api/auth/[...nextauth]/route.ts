import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,

    async signIn({ user, account, profile }) {
      try {
        // Allow sign-in if user exists or if not using credentials provider
        if (user || account?.provider !== "credentials") {
          return true;
        }

        console.warn("⚠️ Sign-in blocked: No user and using credentials provider");
        return false;
      } catch (error) {
        console.error("❌ Error during signIn callback:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };