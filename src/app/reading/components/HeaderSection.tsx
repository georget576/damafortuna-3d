
import { SpreadType } from '@/app/types/tarot'

interface HeaderSectionProps {
  spreadType: SpreadType
  setSpreadType: (type: SpreadType) => void
  onGenerateReading: () => void
  isLoading: boolean
  error: string | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

export default function HeaderSection({
  spreadType,
  setSpreadType,
  onGenerateReading,
  isLoading,
  error,
  status
}: HeaderSectionProps) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold mb-4 font-caveat-brush tarot-gold">Tarot Reading</h1>
      <p className="text-lg text-gray-300 mb-6 font-shadows-into-light">
        The arcana invites you to draw a card and learn your fate
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-300 font-shadows-into-light">{error}</p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="spreadType" className="text-sm font-caveat-brush">Spread Type:</label>
          <select
            id="spreadType"
            value={spreadType}
            onChange={(e) => setSpreadType(e.target.value as SpreadType)}
            disabled={isLoading}
            className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 font-caveat-brush text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="single">Single Card</option>
            <option value="three-card">Three Card</option>
            <option value="celtic-cross">Celtic Cross</option>
          </select>
        </div>
        
        <button
          onClick={onGenerateReading}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-2 px-6 rounded-full font-caveat-brush transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isLoading ? 'Generating...' : 'Get My Reading'}
        </button>
      </div>
      
    </div>
  )
}
