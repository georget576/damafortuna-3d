"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, BookOpen, GraduationCap, Diamond, Menu, X, User, Earth } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="DamaFortuna Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
              <span className="text-xl font-bold text-gray-900 font-shadows-into-light hidden sm:block">DamaFortuna</span>
              <span className="text-lg font-bold text-gray-900 font-shadows-into-light sm:hidden">DamaFortuna</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
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
             <Link href="/community" className="font-caveat-brush text-lg">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Earth className="w-4 h-4" />
                <span className="text-lg">Community</span>
              </Button>
            </Link>
            <Link href="/learn" className="font-caveat-brush text-lg">
              <Button variant="ghost" className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span className="text-lg">Learn</span>
              </Button>
            </Link>
            <Link href="/profile" className="font-caveat-brush text-lg">
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-lg">Profile</span>
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
              <span className="font-caveat-brush text-lg">{isMenuOpen ? 'Close' : 'Menu'}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link href="/reading" className="block">
                <Button variant="ghost" className="w-full justify-start font-caveat-brush text-lg">
                  <Diamond className="w-4 h-4 mr-2" />
                  Reading
                </Button>
              </Link>
              <Link href="/journal" className="block">
                <Button variant="ghost" className="w-full justify-start font-caveat-brush text-lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Journal
                </Button>
              </Link>
              <Link href="/community" className="block">
                <Button variant="ghost" className="w-full justify-start font-caveat-brush text-lg">
                  <Earth className="w-4 h-4 mr-2" />
                  Community
                </Button>
              </Link>
              <Link href="/learn" className="block">
                <Button variant="ghost" className="w-full justify-start font-caveat-brush text-lg">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Learn
                </Button>
              </Link>
              <Link href="/profile" className="block">
                <Button variant="ghost" className="w-full justify-start font-caveat-brush text-lg">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              
              {status === "loading" ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse mx-auto mt-4"></div>
              ) : session ? (
                <div className="pt-4 border-t">
                  <div className="text-center mb-4">
                    <span className="text-lg text-gray-700 font-just-another-hand">
                      Welcome, {session.user?.name || session.user?.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-caveat-brush text-lg">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t">
                  <Link href="/auth/signin" className="block">
                    <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span className="font-caveat-brush text-lg">Sign In</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}