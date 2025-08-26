"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Star, Heart, Sparkles } from "lucide-react"

export default function Story() {
  const timeline = [
    {
      year: "2018",
      title: "The Beginning",
      description: "My journey into tarot reading started with a simple deck and an open heart.",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      year: "2020", 
      title: "Deepening Practice",
      description: "Years of dedicated study and personal readings shaped my understanding of the cards.",
      icon: <Heart className="w-6 h-6" />,
      color: "from-pink-500 to-purple-500"
    },
    {
      year: "2022",
      title: "Digital Transformation",
      description: "Bringing ancient wisdom to the digital age through innovative technology.",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-purple-500 to-yellow-500"
    },
    {
      year: "2024",
      title: "DamaFortuna Born",
      description: "Creating an immersive 3D tarot experience for spiritual seekers worldwide.",
      icon: <Star className="w-6 h-6" />,
      color: "from-yellow-500 to-pink-500"
    }
  ]

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-900/20 to-purple-900/20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 35,
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
            <BookOpen className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-medium text-purple-100">Our Story</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The <span className="mystical-text-gold">Mystical Journey</span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            From ancient wisdom to digital innovation, discover the story behind DamaFortuna and our mission to make spirituality accessible to all.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 opacity-30"></div>

          <div className="space-y-16">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r rounded-full flex items-center justify-center z-10"
                  style={{ background: `linear-gradient(135deg, ${item.color})` }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </motion.div>

                {/* Content card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-sm border-purple-300/30 p-6 h-full">
                      <CardContent className="p-0">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                            {item.icon}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-purple-300" />
                              <span className="text-purple-300 font-medium">{item.year}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                          </div>
                        </div>
                        <p className="text-purple-200 leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Story Quote */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 text-center"
        >
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-300/30 p-8 max-w-4xl mx-auto">
            <CardContent className="p-0">
              <blockquote className="text-2xl md:text-3xl font-medium text-white mb-6 italic">
                "Every card tells a story, every reading reveals a path, and every seeker finds wisdom in their own mystical journey."
              </blockquote>
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-5 h-5 text-yellow-300" />
                </motion.div>
                <span className="text-purple-200">- The Founder of DamaFortuna</span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-5 h-5 text-yellow-300" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg px-8 py-4 rounded-full border border-purple-300/30 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Continue Your Journey
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}