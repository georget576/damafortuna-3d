"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, GraduationCap } from 'lucide-react'

interface SidebarNavigationProps {
  currentPage?: string
}

const navigationItems = [
  {
    href: '/learn',
    label: 'Learning Overview',
    icon: GraduationCap,
    pageKey: 'overview'
  },
  {
    href: '/learn/card-meanings',
    label: 'Card Meanings',
    icon: BookOpen,
    pageKey: 'cards'
  },
  {
    href: '/learn/spreads',
    label: 'Spread Techniques',
    icon: BookOpen,
    pageKey: 'spreads'
  },
  {
    href: '/learn/practice',
    label: 'Practice Exercises',
    icon: BookOpen,
    pageKey: 'practice'
  }
]

export default function SidebarNavigation({ currentPage = 'overview' }: SidebarNavigationProps) {
  return (
    <div className="w-80 bg-gray-900/80 border-r border-gray-700 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 font-caveat-brush text-purple-300">Tarot Learning</h1>
        
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="block">
                <Button 
                  variant={currentPage === item.pageKey ? 'default' : 'ghost'} 
                  className="w-full justify-start font-caveat-brush"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
        
        <div className="mt-8 p-4 bg-purple-900/30 rounded-lg border border-purple-700">
          <h3 className="font-bold mb-2 font-just-another-hand text-purple-200 tracking-widest">Quick Navigation</h3>
          <div className="space-y-2 text-sm">
            <Link href="/reading" className="block text-purple-300 hover:text-purple-100 font-just-another-hand tracking-widest">
              → Start Reading
            </Link>
            <Link href="/journal" className="block text-purple-300 hover:text-purple-100 font-just-another-hand tracking-widest">
              → Journal Your Insights
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}