"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LearningOverview() {
  return (
    <div className="space-y-6">
      <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-700">
        <h2 className="text-2xl font-bold mb-4 font-caveat-brush text-purple-200">Welcome to Tarot Learning</h2>
        <p className="text-lg text-gray-300 mb-4 font-shadows-into-light">
          Embark on a journey to understand the mystical world of tarot. This interactive learning experience will guide you through the fundamentals, card meanings, and practical applications.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 font-just-another-hand text-purple-300">78 Cards</h3>
            <p className="text-sm text-gray-400 font-caveat-brush">Learn the Major and Minor Arcana</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 font-just-another-hand text-purple-300">Multiple Spreads</h3>
            <p className="text-sm text-gray-400 font-caveat-brush">Master different reading techniques</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-bold mb-2 font-just-another-hand text-purple-300">Interactive Practice</h3>
            <p className="text-sm text-gray-400 font-caveat-brush">Test your knowledge with exercises</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold mb-4 font-caveat-brush text-purple-200">Learning Path</h3>
        <ol className="space-y-3 font-just-another-hand tracking-widest">
          <li className="flex items-start">
            <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
            <div>
              <h4 className="font-bold text-purple-300">Understand the Basics</h4>
              <p className="text-gray-400 text-sm">Learn about tarot history, structure, and symbolism</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
            <div>
              <h4 className="font-bold text-purple-300">Master Card Meanings</h4>
              <p className="text-gray-400 text-sm">Study each card's symbolism, keywords, and interpretations</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
            <div>
              <h4 className="font-bold text-purple-300">Learn Spread Techniques</h4>
              <p className="text-gray-400 text-sm">Practice different layouts and reading approaches</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
            <div>
              <h4 className="font-bold text-purple-300">Develop Your Intuition</h4>
              <p className="text-gray-400 text-sm">Trust your instincts and personal connection to the cards</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  )
}