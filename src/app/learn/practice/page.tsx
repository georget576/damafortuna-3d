"use client"
import PracticeExercise from '../components/PracticeExercise'

export default function PracticePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 font-caveat-brush text-purple-200">Practice Exercises</h1>
        <p className="text-lg text-gray-300 font-shadows-into-light">
          Test your tarot knowledge with interactive exercises
        </p>
      </div>

      <PracticeExercise />
    </div>
  )
}