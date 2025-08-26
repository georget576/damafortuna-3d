import { ReactNode } from 'react'
import { JournalNav } from '../components/JournalNav'

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
      <div className="flex h-screen">
        {/* Navigation Sidebar */}
        <div className="w-80 bg-gray-900/80 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 font-caveat-brush text-purple-300">Tarot Journal</h1>
            <JournalNav currentId={params.id} />
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