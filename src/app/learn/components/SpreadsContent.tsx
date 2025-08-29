export default function SpreadsContent() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 font-caveat-brush text-purple-200">Spread Techniques</h2>
        <p className="text-base md:text-lg lg:text-xl text-gray-300 font-shadows-into-light">
          Learn different tarot spreads and their applications
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 md:p-6">
          <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl lg:text-2xl font-caveat-brush text-purple-300">Single Card</h3>
          <p className="text-gray-300 mb-3 md:mb-4 font-shadows-into-light text-sm md:text-base lg:text-lg">
            Perfect for daily guidance, quick insights, or focusing on a specific question.
          </p>
          <ul className="text-xs md:text-sm lg:text-base text-gray-400 space-y-1 font-just-another-hand tracking-widest">
            <li>• Daily guidance</li>
            <li>• Quick yes/no questions</li>
            <li>• Focusing on a specific issue</li>
          </ul>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 md:p-6">
          <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl lg:text-2xl font-caveat-brush text-purple-300">Three Card Spread</h3>
          <p className="text-gray-300 mb-3 md:mb-4 font-shadows-into-light text-sm md:text-base lg:text-lg">
            Explore past, present, and future, or mind, body, and spirit connections.
          </p>
          <ul className="text-xs md:text-sm lg:text-base text-gray-400 space-y-1 font-just-another-hand tracking-widest">
            <li>• Understanding time progression</li>
            <li>• Exploring current situation</li>
            <li>• Decision making</li>
          </ul>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 md:p-6">
          <h3 className="font-bold mb-2 md:mb-3 text-lg md:text-xl lg:text-2xl font-caveat-brush text-purple-300">Celtic Cross</h3>
          <p className="text-gray-300 mb-3 md:mb-4 font-shadows-into-light text-sm md:text-base lg:text-lg">
            A comprehensive 10-card spread for deep insight into complex situations.
          </p>
          <ul className="text-xs md:text-sm lg:text-base text-gray-400 space-y-1 font-just-another-hand tracking-widest">
            <li>• Complex situations</li>
            <li>• Deep self-reflection</li>
            <li>• Life path questions</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 md:p-6">
        <h3 className="font-bold mb-3 md:mb-4 text-lg md:text-xl lg:text-2xl font-caveat-brush text-purple-300">Spread Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 font-just-another-hand tracking-widest">
          <div>
            <h4 className="font-bold mb-2 md:mb-3 text-purple-300 text-sm md:text-base lg:text-lg">Before Reading</h4>
            <ul className="space-y-1 md:space-y-2 text-gray-300 text-sm md:text-base lg:text-lg">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Clear your mind and focus on your question</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Shuffle the cards thoroughly</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Set your intention for the reading</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2 md:mb-3 text-purple-300 text-sm md:text-base lg:text-lg">During Reading</h4>
            <ul className="space-y-1 md:space-y-2 text-gray-300 text-sm md:text-base lg:text-lg">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Trust your first impressions</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Look for patterns and connections</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Consider both upright and reversed meanings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}