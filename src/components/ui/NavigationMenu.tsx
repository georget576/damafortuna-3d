'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Html } from '@react-three/drei'

interface NavigationMenuProps {
  onClose?: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: string
  description: string
  color: string
}

const NavigationMenu = ({ onClose }: NavigationMenuProps) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  
  const menuItems: MenuItem[] = [
    {
      id: 'tarot-reading',
      label: 'Tarot Reading',
      icon: '🔮',
      description: 'Begin your mystical journey',
      color: '#8B5CF6'
    },
    {
      id: 'learn',
      label: 'Learn',
      icon: '📚',
      description: 'Explore the world of tarot',
      color: '#3B82F6'
    },
    {
      id: 'community',
      label: 'Community',
      icon: '👥',
      description: 'Connect with fellow seekers',
      color: '#10B981'
    },
    {
      id: 'daily-guidance',
      label: 'Daily Guidance',
      icon: '✨',
      description: 'Get your daily message',
      color: '#F59E0B'
    },
    {
      id: 'meditation',
      label: 'Meditation',
      icon: '🧘',
      description: 'Find inner peace',
      color: '#EC4899'
    },
    {
      id: 'dream-journal',
      label: 'Dream Journal',
      icon: '🌙',
      description: 'Record your dreams',
      color: '#6366F1'
    }
  ]
  
  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId)
    // In a real app, this would navigate to the appropriate page
    console.log(`Navigating to: ${itemId}`)
    
    // Simulate navigation delay
    setTimeout(() => {
      if (onClose) onClose()
    }, 500)
  }
  
  return (
    <Html center>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4"
            >
              DamaFortuna
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 text-lg"
            >
              Choose your path through the mystical arts
            </motion.p>
          </motion.div>
          
          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleItemClick(item.id)}
                className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer border-2 transition-all duration-300 ${
                  selectedItem === item.id 
                    ? 'border-purple-500 scale-105' 
                    : 'border-gray-800 hover:border-purple-400'
                }`}
                style={{ 
                  background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`
                }}
              >
                {/* Icon */}
                <motion.div
                  animate={selectedItem === item.id ? { scale: 1.2, rotate: 10 } : {}}
                  className="text-4xl mb-4"
                >
                  {item.icon}
                </motion.div>
                
                {/* Label */}
                <h3 className="text-xl font-semibold text-white mb-2">{item.label}</h3>
                
                {/* Description */}
                <p className="text-gray-400 text-sm">{item.description}</p>
                
                {/* Hover effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                />
                
                {/* Selection indicator */}
                {selectedItem === item.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12 text-gray-500 text-sm"
          >
            <p>© 2023 DamaFortuna. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.div>
    </Html>
  )
}

export default NavigationMenu