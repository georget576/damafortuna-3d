import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, GraduationCap } from 'lucide-react'

interface LearnLayoutProps {
  children: ReactNode
  params: {
    page?: string
  }
}

export default function LearnLayout({ children, params }: LearnLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="flex h-screen">
        {/* Navigation Sidebar */}
        <div className="w-80 bg-gray-900/80 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 font-caveat-brush text-purple-300">Tarot Learning</h1>
            
            <div className="space-y-2">
              <Link href="/learn" className="block">
                <Button 
                  variant={params.page === 'overview' ? 'default' : 'ghost'} 
                  className="w-full justify-start font-caveat-brush"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Learning Overview
                </Button>
              </Link>
              
              <Link href="/learn/cards" className="block">
                <Button 
                  variant={params.page === 'cards' ? 'default' : 'ghost'} 
                  className="w-full justify-start font-caveat-brush"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Card Meanings
                </Button>
              </Link>
              
              <Link href="/learn/spreads" className="block">
                <Button 
                  variant={params.page === 'spreads' ? 'default' : 'ghost'} 
                  className="w-full justify-start font-caveat-brush"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Spread Techniques
                </Button>
              </Link>
              
              <Link href="/learn/exercises" className="block">
                <Button 
                  variant={params.page === 'exercises' ? 'default' : 'ghost'} 
                  className="w-full justify-start font-caveat-brush"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Practice Exercises
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 p-4 bg-purple-900/30 rounded-lg border border-purple-700">
              <h3 className="font-bold mb-2 font-just-another-hand text-purple-200">Quick Navigation</h3>
              <div className="space-y-2 text-sm">
                <Link href="/reading" className="block text-purple-300 hover:text-purple-100">
                  → Start Reading
                </Link>
                <Link href="/journal" className="block text-purple-300 hover:text-purple-100">
                  → Journal Your Insights
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}