"use client"

import { Button } from '@/components/ui/button'
import { ArrowUp, FerrisWheel, Folder, FolderOpen } from 'lucide-react'

interface ArcanaDirectoryProps {
  selectedArcana: 'major' | 'minor' | null
  onArcanaSelect: (arcana: 'major' | 'minor') => void
  isMinorExpanded: boolean
  onMinorToggle: () => void
}

export default function ArcanaDirectory({
  selectedArcana,
  onArcanaSelect,
  isMinorExpanded,
  onMinorToggle
}: ArcanaDirectoryProps) {
  return (
    <div className="space-y-2">
      {/* Major Arcana */}
      <button
        onClick={() => onArcanaSelect('major')}
        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-2 ${
          selectedArcana === 'major'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-700/50 hover:bg-gray-600'
        }`}
      >
        <FerrisWheel className="w-4 h-4 text-purple-300" />
        <span className="font-bold font-caveat-brush text-purple-300">Major Arcana</span>
        <span className="text-base opacity-75 ml-auto font-just-another-hand tracking-widest text-purple-300">22 cards</span>
      </button>

      {/* Minor Arcana with expandable directory */}
      <div className="ml-4 font-caveat-brush text-purple-300">
        <button
          onClick={() => onArcanaSelect('minor')}
          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-2 ${
            selectedArcana === 'minor'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700/50 hover:bg-gray-600'
          }`}
        >
          {isMinorExpanded ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <Folder className="w-4 h-4" />
          )}
          <span className="font-bold">Minor Arcana</span>
          <span className="text-base opacity-75 ml-auto font-just-another-hand tracking-widest">56 cards</span>
        </button>
        
      </div>
    </div>
  )
}