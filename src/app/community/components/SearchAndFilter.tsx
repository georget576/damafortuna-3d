import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface ForumCategory {
  id: string
  name: string
  slug: string
  description: string
  _count?: {
    posts: number
  }
}

interface SearchAndFilterProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: ForumCategory[]
}

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 font-shadows-into-light tracking-wide" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-800/50 border-gray-600 text-white font-shadows-into-light tracking-widest text-xl"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-800/50 border-gray-600 text-white px-4 py-2 rounded-md font-just-another-hand tracking-widest text-base"
        >
          <option value="">All Categories</option>
          
          {/* Core Tarot Categories */}
          <option disabled className="font-bold text-purple-300">── 🔮 Core Tarot Categories ──</option>
          {(() => {
            const coreCategories = categories.filter(cat =>
              cat.name && (
                cat.name.includes('🔮') ||
                cat.name.includes('Daily') ||
                cat.name.includes('Weekly') ||
                cat.name.includes('Moon') ||
                cat.name.includes('Major') ||
                cat.name.includes('Minor') ||
                cat.name.includes('Court') ||
                cat.name.includes('Spread')
              )
            );
            return coreCategories.length > 0 ? (
              coreCategories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <option key={category.id} value={category.id} className="pl-4">
                    {category.name} ({category._count?.posts || 0})
                  </option>
                ))
            ) : (
              <option disabled className="text-gray-500 pl-4">No categories found</option>
            );
          })()}
          
          {/* Personal & Reflective Categories */}
          <option disabled className="font-bold text-blue-300">── 🧠 Personal & Reflective Categories ──</option>
          {(() => {
            const personalCategories = categories.filter(cat =>
              cat.name && (
                cat.name.includes('🧠') ||
                cat.name.includes('Intuitive') ||
                cat.name.includes('Shadow') ||
                cat.name.includes('Spiritual') ||
                cat.name.includes('Emotional') ||
                cat.name.includes('Synchronicities')
              )
            );
            return personalCategories.length > 0 ? (
              personalCategories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <option key={category.id} value={category.id} className="pl-4">
                    {category.name} ({category._count?.posts || 0})
                  </option>
                ))
            ) : (
              <option disabled className="text-gray-500 pl-4">No categories found</option>
            );
          })()}
          
          {/* Journal Style Categories */}
          <option disabled className="font-bold text-green-300">── 📓 Journal Style Categories ──</option>
          {(() => {
            const journalCategories = categories.filter(cat =>
              cat.name && (
                cat.name.includes('📓') ||
                cat.name.includes('Tarot') ||
                cat.name.includes('Card') ||
                cat.name.includes('Reading') ||
                cat.name.includes('Lessons') ||
                cat.name.includes('Symbols')
              )
            );
            return journalCategories.length > 0 ? (
              journalCategories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <option key={category.id} value={category.id} className="pl-4">
                    {category.name} ({category._count?.posts || 0})
                  </option>
                ))
            ) : (
              <option disabled className="text-gray-500 pl-4">No categories found</option>
            );
          })()}
          
          {/* Occult & Esoteric Categories */}
          <option disabled className="font-bold text-yellow-300">── 🌙 Occult & Esoteric Categories ──</option>
          {(() => {
            const occultCategories = categories.filter(cat =>
              cat.name && (
                cat.name.includes('🌙') ||
                cat.name.includes('Astro') ||
                cat.name.includes('Numerology') ||
                cat.name.includes('Elemental') ||
                cat.name.includes('Ritual')
              )
            );
            return occultCategories.length > 0 ? (
              occultCategories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <option key={category.id} value={category.id} className="pl-4">
                    {category.name} ({category._count?.posts || 0})
                  </option>
                ))
            ) : (
              <option disabled className="text-gray-500 pl-4">No categories found</option>
            );
          })()}
          
          {/* Fallback: Show all categories if no grouping matches */}
          {(() => {
            const hasGroupedCategories =
              categories.some(cat => cat.name.includes('🔮') || cat.name.includes('🧠') || cat.name.includes('📓') || cat.name.includes('🌙')) ||
              categories.some(cat => cat.name.includes('Daily') || cat.name.includes('Weekly') || cat.name.includes('Moon') || cat.name.includes('Major') || cat.name.includes('Minor') || cat.name.includes('Court') || cat.name.includes('Spread')) ||
              categories.some(cat => cat.name.includes('Intuitive') || cat.name.includes('Shadow') || cat.name.includes('Spiritual') || cat.name.includes('Emotional') || cat.name.includes('Synchronicities')) ||
              categories.some(cat => cat.name.includes('Tarot') || cat.name.includes('Card') || cat.name.includes('Reading') || cat.name.includes('Lessons') || cat.name.includes('Symbols')) ||
              categories.some(cat => cat.name.includes('Astro') || cat.name.includes('Numerology') || cat.name.includes('Elemental') || cat.name.includes('Ritual'));
            
            if (!hasGroupedCategories) {
              return (
                <>
                  <option disabled className="font-bold text-gray-400">── All Categories ──</option>
                  {categories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                      <option key={category.id} value={category.id} className="pl-4">
                        {category.name} ({category._count?.posts || 0})
                      </option>
                    ))}
                </>
              );
            }
            return null;
          })()}
        </select>
        {selectedCategory && (
          <div className="bg-gray-800/50 border border-gray-600 text-white px-4 py-2 rounded-md flex items-center font-just-another-hand tracking-widest">
            <span className="text-sm">Selected: </span>
            <span className="text-base text-gray-400 italic ml-2">
              ({categories.find(c => c.id === selectedCategory)?.description})
            </span>
          </div>
        )}
      </div>
    </div>
  )
}