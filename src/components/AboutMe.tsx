"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { User, Heart, Sparkles, Moon } from "lucide-react"
import Image from "next/image"

export default function AboutMe() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-900/20 to-indigo-900/20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-300/30 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <User className="w-4 h-4 text-purple-300" />
            <span className="text-xl font-medium text-purple-100 font-just-another-hand tracking-widest">About the Creator</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-caveat-brush">
            Meet Your <span className="mystical-text-gold">Mystical Guide</span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto font-just-another-hand tracking-widest">
            A passionate spiritual seeker and technology enthusiast on a mission to make ancient wisdom accessible in the modern world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative">
              <div className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-pink-600 p-1">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                  <motion.div
                    className="w-60 h-60 rounded-full bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center"
                    whileHover={{
                      boxShadow: [
                        "0 0 0px rgba(192, 132, 252, 0)",
                        "0 0 20px rgba(192, 132, 252, 0.8)",
                        "0 0 40px rgba(192, 132, 252, 0.6)",
                        "0 0 60px rgba(192, 132, 252, 0.4)",
                        "0 0 0px rgba(192, 132, 252, 0)"
                      ],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    <Image
                      src="/founder-image.png"
                      alt="Spiritual Guide"
                      width={240}
                      height={240}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </motion.div>
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-2xl font-bold text-white mb-1 font-shadows-into-light">George Tan</h3>
                  <p className="text-purple-200 font-just-another-hand tracking-widest">Spiritual Seeker</p>
                </div>
              </div>
              
              {/* Floating elements around the profile */}
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <Moon className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-purple-300/30 p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-purple-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-white font-caveat-brush">Passion for Spirituality</h3>
                    </div>
                    <p className="text-purple-100 font-shadows-into-light tracking-wide">
                      With over a decade of experience in tarot reading and spiritual practices, I bring ancient wisdom to the digital age.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-purple-300/30 p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-pink-600/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-pink-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-white font-caveat-brush">Tech Innovation</h3>
                    </div>
                    <p className="text-purple-100 font-shadows-into-light tracking-wide">
                      Combining cutting-edge technology with spiritual practices to create immersive and transformative experiences.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border-purple-300/30 p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center">
                        <Moon className="w-6 h-6 text-yellow-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-white font-caveat-brush">Mission</h3>
                    </div>
                    <p className="text-purple-100 font-shadows-into-light tracking-wide">
                      To help individuals discover their inner wisdom and navigate life's journey through the mystical arts.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-full px-8 py-4 border border-purple-300/30">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Heart className="w-6 h-6 text-purple-300" />
            </motion.div>
            <span className="text-purple-100 font-medium font-just-another-hand tracking-widest text-xl">Dedicated to unlocking wisdom</span>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-pink-300" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}