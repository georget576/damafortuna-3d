"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Zap,
  Eye,
  Heart,
  Star,
  Moon,
  Gem,
  Palette,
  Infinity
} from "lucide-react"

export default function Feature() {
  const features = [
    {
      title: "3D Tarot Cards",
      description: "Experience tarot like never before with our immersive 3D card animations.",
      icon: <Gem className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-600/20 to-pink-600/20"
    },
    {
      title: "Interactive Readings",
      description: "Engage with your cards through intuitive gestures and responsive interactions.",
      icon: <Zap className="w-8 h-8" />,
      color: "from-pink-500 to-purple-500",
      gradient: "bg-gradient-to-br from-pink-600/20 to-purple-600/20"
    },
    {
      title: "Personalized Insights",
      description: "Receive tailored interpretations based on your unique energy and questions.",
      icon: <Heart className="w-8 h-8" />,
      color: "from-purple-500 to-yellow-500",
      gradient: "bg-gradient-to-br from-purple-600/20 to-yellow-600/20"
    },
    {
      title: "Journal Integration",
      description: "Track your spiritual journey with our integrated journaling system.",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-yellow-500 to-purple-500",
      gradient: "bg-gradient-to-br from-yellow-600/20 to-purple-600/20"
    },
    {
      title: "Learning Resources",
      description: "Expand your knowledge with comprehensive guides and tutorials.",
      icon: <Palette className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-600/20 to-pink-600/20"
    },
    {
      title: "Community Support",
      description: "Connect with fellow seekers and share your mystical experiences.",
      icon: <Infinity className="w-8 h-8" />,
      color: "from-pink-500 to-purple-500",
      gradient: "bg-gradient-to-br from-pink-600/20 to-purple-600/20"
    }
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-900/20 to-indigo-900/20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity as any,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity as any,
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
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-medium text-purple-100">Features</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="mystical-text-gold">Magical</span> Experiences
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Discover the powerful features that make DamaFortuna your ultimate spiritual companion.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -10 }}
            >
              <Card className={`${feature.gradient} backdrop-blur-sm border-purple-300/30 p-6 h-full`}>
                <CardContent className="p-0">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-purple-200 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-purple-300/30 p-8">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Immersive Experience</h3>
                </div>
                <p className="text-purple-200 mb-6">
                  Our 3D tarot cards bring ancient wisdom to life with stunning visuals and smooth animations. 
                  Each card is meticulously crafted to provide a truly mystical experience.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-200">High-quality 3D models</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-200">Smooth card animations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-200">Interactive gestures</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-purple-300/30 p-8">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-yellow-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Personalized Guidance</h3>
                </div>
                <p className="text-purple-200 mb-6">
                  Our AI-powered interpretations provide insights tailored to your unique energy and questions, 
                  helping you navigate life's journey with confidence and clarity.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-200">Context-aware readings</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-200">Energy-based insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-200">Actionable guidance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-full px-8 py-4 border border-purple-300/30 mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity as any, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-purple-300" />
            </motion.div>
            <span className="text-purple-100 font-medium">Ready to begin your mystical journey?</span>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 20, repeat: Infinity as any, ease: "linear" }}
            >
              <Moon className="w-6 h-6 text-pink-300" />
            </motion.div>
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg px-8 py-4 rounded-full border border-purple-300/30 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your Journey
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Helper component for the BookOpen icon
function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 0 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  )
}