"use client"

import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Chrome } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="DamaFortuna Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-cover"
              />
              <span className="text-2xl font-bold text-gray-900 font-shadows-into-light">DamaFortuna</span>
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-caveat-brush">Welcome</h2>
          <p className="text-gray-600 mb-8 font-shadows-into-light">
            Sign in to access your personalized tarot readings and journal
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4 font-caveat-brush">Choose your sign-in method</h3>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                size="lg"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Chrome className="w-5 h-5" />
                    <span className="font-medium font-shadows-into-light">Continue with Google</span>
                  </>
                )}
              </Button>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-caveat-brush">Or continue as guest</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/reading"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 font-shadows-into-light"
                >
                  Continue as Guest
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 font-shadows-into-light">
          <p>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}