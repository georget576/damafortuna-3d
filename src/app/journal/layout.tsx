import { ReactNode } from 'react'
import { JournalNav } from './components/JournalNav'

interface JournalLayoutProps {
  children: ReactNode
  params: {
    page?: string
    id?: string
  }
}

export default function JournalLayout({ children, params }: JournalLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Navigation Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden md:block w-64 lg:w-80 bg-gray-900/80 border-r border-gray-700 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 font-caveat-brush text-purple-300">Tarot Journal</h1>
            <JournalNav currentId={params.id} />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile Header */}
          <div className="md:hidden p-4 border-b border-gray-700 bg-gray-900/50">
            <h1 className="text-2xl font-bold font-caveat-brush text-purple-300">Tarot Journal</h1>
          </div>
          
          <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}