'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Moon, MoonStar } from 'lucide-react';
import Link from 'next/link';

export function WelcomeMessage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md px-4"
      >
        <Card className="bg-black/80 backdrop-blur-md border-white/20 text-white pointer-events-auto">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
              className="mb-6"
            >
              <div className="relative inline-flex items-center justify-center">
                <Moon className="h-16 w-16 text-yellow-300" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -inset-2 bg-yellow-300 rounded-full blur-md"
                />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent font-caveat-brush"
            >
              Welcome to Dama Fortuna 3D
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg text-gray-300 mb-8 font-shadows-into-light tracking-wide"
            >
              Experience the magic of interactive 3D tarot readings
            </motion.p>
            <Link href={"/home"}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Button 
                className="font-just-another-hand tracking-widest bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Begin Your Journey
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            </Link>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 flex justify-center space-x-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.1, type: "spring", stiffness: 400, damping: 10 }}
                >
                  <MoonStar className="h-4 w-4 text-yellow-300" />
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}