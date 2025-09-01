'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Html } from '@react-three/drei'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <Html center>
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Animated mystic symbol */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="mb-8"
          >
            <div className="w-24 h-24 border-4 border-purple-500 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-pink-500 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 rounded-full"></div>
              </div>
            </div>
          </motion.div>
          
          {/* Loading text */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Awakening the Mystical Realm
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-400 mb-6"
          >
            Preparing your journey through the ancient arts
          </motion.p>
          
          {/* Progress bar */}
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Loading dots */}
          <div className="flex justify-center mt-4 space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
                className="w-2 h-2 bg-purple-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </Html>
  )
}