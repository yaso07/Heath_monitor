import { Metadata } from 'next'
import ExerciseVideos from './components/ExerciseVideos'

export const metadata: Metadata = {
  title: 'Exercise Routines - Health Monitor',
  description: 'Browse and follow along with our curated exercise routines for different fitness levels',
}

const categories = [
  {
    title: "Beginner Workouts",
    query: "beginner full body workout",
    description: "Perfect for those just starting their fitness journey"
  },
  {
    title: "HIIT Training",
    query: "hiit workout at home",
    description: "High-intensity interval training for maximum calorie burn"
  },
  {
    title: "Yoga & Flexibility",
    query: "yoga for beginners",
    description: "Improve flexibility and reduce stress with yoga routines"
  },
  {
    title: "Strength Training",
    query: "strength training no equipment",
    description: "Build muscle and strength with or without equipment"
  }
]

export default function ExerciseRoutines() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Exercise Routines</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover a variety of workout videos tailored to your fitness level. 
            From beginner-friendly routines to advanced training, find the perfect 
            workout to help you reach your goals.
          </p>
        </div>

        <div className="space-y-16">
          {categories.map((category) => (
            <section 
              key={category.title} 
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="max-w-3xl mx-auto mb-8">
                <h2 className="text-3xl font-semibold mb-4 text-gray-900">{category.title}</h2>
                <p className="text-lg text-gray-600">{category.description}</p>
              </div>
              <div className="w-full overflow-hidden">
                <ExerciseVideos searchQuery={category.query} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

