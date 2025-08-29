"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from 'lucide-react'

export default function SpreadsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 font-caveat-brush text-purple-200">Spread Techniques</h1>
        <p className="text-lg text-gray-300 font-shadows-into-light">
          Learn different tarot spreads and their applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="font-caveat-brush text-xl text-purple-300 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Single Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4 font-shadows-into-light">
              Perfect for daily guidance, quick insights, or focusing on a specific question.
            </p>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-purple-300 font-caveat-brush">Best for:</h4>
              <ul className="text-sm text-gray-400 space-y-1 font-just-another-hand tracking-widest">
                <li>• Daily guidance</li>
                <li>• Quick yes/no questions</li>
                <li>• Focusing on a specific issue</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="font-caveat-brush text-xl text-purple-300 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Three Card Spread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4 font-shadows-into-light">
              Explore past, present, and future, or mind, body, and spirit connections.
            </p>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-purple-300 font-caveat-brush">Best for:</h4>
              <ul className="text-sm text-gray-400 space-y-1 font-just-another-hand tracking-widest">
                <li>• Understanding time progression</li>
                <li>• Exploring current situation</li>
                <li>• Decision making</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="font-caveat-brush text-xl text-purple-300 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Celtic Cross
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4 font-shadows-into-light">
              A comprehensive 10-card spread for deep insight into complex situations.
            </p>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-purple-300 font-caveat-brush">Best for:</h4>
              <ul className="text-sm text-gray-400 space-y-1 font-just-another-hand tracking-widest">
                <li>• Complex situations</li>
                <li>• Deep self-reflection</li>
                <li>• Life path questions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700 mt-8">
        <CardHeader>
          <CardTitle className="font-caveat-brush text-xl text-purple-300 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Spread Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-just-another-hand tracking-widest">
            <div>
              <h3 className="font-bold mb-3 text-purple-300">Before Reading</h3>
              <ul className="space-y-2 text-gray-300">
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
              <h3 className="font-bold mb-3 text-purple-300">During Reading</h3>
              <ul className="space-y-2 text-gray-300">
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
        </CardContent>
      </Card>
    </div>
  )
}