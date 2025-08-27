"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

// Define types for better type safety
interface Chapter {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  color: string
}

// Constants for configuration
const CHAPTER_HEIGHT = {
  DEFAULT: "h-[500px] sm:h-[600px]",
  MD: "md:h-[700px]"
}

const ANIMATION_DURATION = {
  BACKGROUND: 30,
  BACKGROUND_2: 35,
  FLIP: 0.6,
  FADE: 0.8,
  OVERLAY: 0.8,
  OVERLAY_DELAY: 0.3,
  TITLE: 0.5,
  TITLE_DELAY: 0.5,
  SUBTITLE: 0.8,
  SUBTITLE_DELAY: 0.7,
  DESCRIPTION: 0.8,
  DESCRIPTION_DELAY: 0.9,
  INDICATOR: 0.5,
  CTA: 0.8,
  CTA_DELAY: 0.8
}

// Chapter data with proper typing
const chapters: Chapter[] = [
  {
    id: 1,
    title: "Chapter 1: The Awakening",
    subtitle: "The Divine Illumination",
    description: "As the mystical clouds part, a brilliant divine light descends upon you, awakening ancient powers within your soul. This moment marks the beginning of your extraordinary journey into the unknown realms of spiritual enlightenment.",
    image: "/story/chapter-1.gif",
    color: "from-purple-600 to-pink-600"
  },
  {
    id: 2,
    title: "Chapter 2: The Seeker's Path",
    subtitle: "Wisdom of the High Priestess",
    description: "You stand before the enigmatic High Priestess, keeper of ancient secrets and mystical knowledge. Her gaze pierces through the veil of reality, offering you profound insights that will guide your quest for higher understanding and spiritual mastery.",
    image: "/story/chapter-2.gif",
    color: "from-pink-600 to-purple-600"
  },
  {
    id: 3,
    title: "Chapter 3: The Destiny Unfolds",
    subtitle: "Fate's Mysterious Call",
    description: "The threads of destiny weave around you as cosmic forces align to reveal your true purpose. The universe beckons you forward, promising revelations that will transform your understanding of existence and your place within the grand tapestry of fate.",
    image: "/story/chapter-3.gif",
    color: "from-purple-600 to-yellow-600"
  }
]

// Memoized navigation controls for better performance
const NavigationControls = ({ 
  currentChapter, 
  totalChapters, 
  onPrev, 
  onNext 
}: { 
  currentChapter: number
  totalChapters: number
  onPrev: () => void
  onNext: () => void
}) => {
  const handleDotClick = useCallback((index: number) => {
    // Prevent unnecessary re-renders
    if (index !== currentChapter) {
      // This would be handled by the parent component
    }
  }, [currentChapter])

  return (
    <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 sm:space-x-4 z-20">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrev}
        className="bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full p-2 sm:p-3 text-purple-200 hover:bg-white/20 transition-all duration-300"
        aria-label="Previous chapter"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>

      <div className="flex space-x-1 sm:space-x-2">
        {chapters.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentChapter
                ? 'bg-purple-400 scale-125'
                : 'bg-purple-600/50'
            }`}
            aria-label={`Go to chapter ${index + 1}`}
          />
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className="bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full p-2 sm:p-3 text-purple-200 hover:bg-white/20 transition-all duration-300"
        aria-label="Next chapter"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>
    </div>
  )
}

// Memoized chapter content for better performance
const ChapterContent = ({ chapter }: { chapter: Chapter }) => {
  const chapterContent = useMemo(() => (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-3xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION.OVERLAY }}
      />
      
      <motion.img
        src={chapter.image}
        alt={chapter.title}
        className="w-full h-full object-cover rounded-3xl shadow-2xl"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION.OVERLAY }}
        onError={(e) => {
          // Handle image loading errors
          const target = e.target as HTMLImageElement
          target.src = "/fallback-image.jpg" // Add a fallback image
          target.alt = "Chapter image not available"
        }}
      />

      {/* Chapter Overlay Content - Moved to Top */}
      <div className="absolute inset-0 flex flex-col items-center justify-start p-8 bg-gradient-to-b from-black/70 via-black/30 to-transparent rounded-3xl">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: ANIMATION_DURATION.OVERLAY,
            delay: ANIMATION_DURATION.OVERLAY_DELAY
          }}
          className="text-center w-full"
        >
          <motion.h3
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: ANIMATION_DURATION.TITLE,
              delay: ANIMATION_DURATION.TITLE_DELAY
            }}
          >
            {chapter.title}
          </motion.h3>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-200 mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: ANIMATION_DURATION.SUBTITLE,
              delay: ANIMATION_DURATION.SUBTITLE_DELAY
            }}
          >
            {chapter.subtitle}
          </motion.p>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: ANIMATION_DURATION.DESCRIPTION,
              delay: ANIMATION_DURATION.DESCRIPTION_DELAY
            }}
          >
            {chapter.description}
          </motion.p>
        </motion.div>
      </div>
    </div>
  ), [chapter])

  return chapterContent
}

// Memoized chapter indicators for better performance
const ChapterIndicators = ({ chapters }: { chapters: Chapter[] }) => {
  return (
    <div className="flex justify-center space-x-4 sm:space-x-8 mb-12 sm:mb-16">
      {chapters.map((chapter, index) => (
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: ANIMATION_DURATION.INDICATOR,
            delay: index * 0.1
          }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gradient-to-r ${chapter.color} flex items-center justify-center mb-2`}>
            <span className="text-white font-bold text-base sm:text-lg">{index + 1}</span>
          </div>
          <p className="text-purple-200 text-xs sm:text-sm hidden sm:block">{chapter.title.split(':')[0]}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default function Story() {
  const [currentChapter, setCurrentChapter] = useState(0)

  // Memoized navigation functions to prevent unnecessary re-renders
  const nextChapter = useCallback(() => {
    setCurrentChapter((prev) => (prev + 1) % chapters.length)
  }, [])

  const prevChapter = useCallback(() => {
    setCurrentChapter((prev) => (prev - 1 + chapters.length) % chapters.length)
  }, [])

  // Memoized background elements for better performance
  const backgroundElements = useMemo(() => (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: ANIMATION_DURATION.BACKGROUND,
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
          duration: ANIMATION_DURATION.BACKGROUND_2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  ), [])

  // Memoized header content for better performance
  const headerContent = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION.FADE }}
      viewport={{ once: true, margin: "-100px" }}
      className="text-center mb-16"
    >
      <motion.div
        className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-300/30 mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Sparkles className="w-4 h-4 text-purple-300" />
        <span className="text-xl font-medium text-purple-100 font-just-another-hand tracking-widest">The Mystical Story</span>
      </motion.div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 font-caveat-brush">
        Your <span className="mystical-text-gold">Journey</span>
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-purple-200 max-w-3xl mx-auto px-4 font-just-another-hand tracking-widest">
        Experience the mystical tale that unfolds before you, chapter by chapter.
      </p>
    </motion.div>
  ), [])

  return (
    <section className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-900/20 to-purple-900/20 overflow-hidden">
      {backgroundElements}

      <div className="relative max-w-7xl mx-auto">
        {headerContent}

        {/* Flip Animation Container */}
        <div className={`relative ${CHAPTER_HEIGHT.DEFAULT} ${CHAPTER_HEIGHT.MD} flex items-center justify-center mb-16 font-shadows-into-light`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter}
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: ANIMATION_DURATION.FLIP }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ChapterContent chapter={chapters[currentChapter]} />
            </motion.div>
          </AnimatePresence>

          <NavigationControls
            currentChapter={currentChapter}
            totalChapters={chapters.length}
            onPrev={prevChapter}
            onNext={nextChapter}
          />
        </div>
      </div>
    </section>
  )
}