"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LearningOverview() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-purple-900/30 p-4 md:p-6 rounded-lg border border-purple-700">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 font-caveat-brush text-purple-200">Welcome to Tarot Learning</h2>
        <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-4 font-shadows-into-light">
          Embark on a journey to understand the mystical world of tarot. This interactive learning experience will guide you through the fundamentals, card meanings, and practical applications.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
          <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg">
            <h3 className="font-bold mb-1 md:mb-2 font-just-another-hand text-purple-300 text-base md:text-base lg:text-lg">78 Cards</h3>
            <p className="text-base md:text-sm lg:text-base text-gray-400 font-caveat-brush">Learn the Major and Minor Arcana</p>
          </div>
          <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg">
            <h3 className="font-bold mb-1 md:mb-2 font-just-another-hand text-purple-300 text-base md:text-base lg:text-lg">Multiple Spreads</h3>
            <p className="text-base md:text-sm lg:text-base text-gray-400 font-caveat-brush">Master different reading techniques</p>
          </div>
          <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg">
            <h3 className="font-bold mb-1 md:mb-2 font-just-another-hand text-purple-300 text-base md:text-base lg:text-lg">Interactive Practice</h3>
            <p className="text-base md:text-sm lg:text-base text-gray-400 font-caveat-brush">Test your knowledge with exercises</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 p-4 md:p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl md:text-lg lg:text-2xl font-bold mb-3 md:mb-4 font-caveat-brush text-purple-200">Learning Path</h3>
        <ol className="space-y-2 md:space-y-3 font-just-another-hand tracking-widest">
          <li className="flex items-start">
            <span className="bg-purple-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex items-center justify-center text-xs md:text-sm lg:text-base mr-2 md:mr-3 mt-0.5">1</span>
            <div>
              <h4 className="font-bold text-purple-300 text-xl md:text-xl lg:text-2xl">Understand the Basics</h4>
              <p className="text-gray-400 text-xl md:text-xl lg:text-2xl">Learn about tarot history, structure, and symbolism</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex items-center justify-center text-xs md:text-sm lg:text-base mr-2 md:mr-3 mt-0.5">2</span>
            <div>
              <h4 className="font-bold text-purple-300 text-xl md:text-xl lg:text-2xl">Master Card Meanings</h4>
              <p className="text-gray-400 text-xl md:text-xl lg:text-2xl">Study each card's symbolism, keywords, and interpretations</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex items-center justify-center text-xs md:text-sm lg:text-base mr-2 md:mr-3 mt-0.5">3</span>
            <div>
              <h4 className="font-bold text-purple-300 text-xl md:text-xl lg:text-2xl">Learn Spread Techniques</h4>
              <p className="text-gray-400 text-xl md:text-xl lg:text-2xl">Practice different layouts and reading approaches</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex items-center justify-center text-xs md:text-sm lg:text-base mr-2 md:mr-3 mt-0.5">4</span>
            <div>
              <h4 className="font-bold text-purple-300 text-xl md:text-xl lg:text-2xl">Develop Your Intuition</h4>
              <p className="text-gray-400 text-xl md:text-xl lg:text-2xl">Trust your instincts and personal connection to the cards</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  )
}