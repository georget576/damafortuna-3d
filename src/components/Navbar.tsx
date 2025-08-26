"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, BookOpen, GraduationCap, Diamond } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              
                <Image
                  src="/logo.png"
                  alt="DamaFortuna Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
        
              <span className="text-xl font-bold text-gray-900 font-shadows-into-light">DamaFortuna</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/reading" className="font-caveat-brush text-lg">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Diamond className="w-4 h-4" />
                <span className="text-lg">Reading</span>
              </Button>
            </Link>
            <Link href="/journal" className="font-caveat-brush text-lg">
              <Button variant="ghost" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-lg">Journal</span>
              </Button>
            </Link>
            <Link href="/learn" className="font-caveat-brush text-lg">
              <Button variant="ghost" className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span className="text-lg">Learn</span>
              </Button>
            </Link>
          

            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <span className="text-xl text-gray-700 font-just-another-hand">
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-caveat-brush text-lg">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span className="font-caveat-brush text-lg">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}