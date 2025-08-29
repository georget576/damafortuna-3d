'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SpreadType } from '@/app/types/tarot'

interface SpreadSelectorProps {
  spreadType: SpreadType
  setSpreadType: (value: SpreadType) => void
}

export function SpreadSelector({ spreadType, setSpreadType }: SpreadSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="spreadType" className="text-sm font-caveat-brush">Spread Type:</label>
      <Select value={spreadType} onValueChange={(value) => setSpreadType(value as SpreadType)}>
        <SelectTrigger className="w-48 bg-gray-400 border-gray-400 font-caveat-brush text-lg">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent className="bg-gray-400 border-gray-400 font-shadows-into-light">
          <SelectItem value="single" className="font-caveat-brush text-lg">Single Card</SelectItem>
          <SelectItem value="three-card" className="font-caveat-brush text-lg">Three Card</SelectItem>
          <SelectItem value="celtic-cross" className="font-caveat-brush text-lg">Celtic Cross</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}