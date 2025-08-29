import PracticeExercise from '../components/PracticeExercise'

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 font-caveat-brush text-purple-200">Practice Exercises</h1>
        <p className="text-lg text-gray-300 font-shadows-into-light">
          Test your tarot knowledge with interactive exercises
        </p>
      </div>

      <PracticeExercise />
    </div>
  )
}