interface Exercise {
  name: string
  description: string
  imageUrl: string
  videoUrl: string
}

interface ExerciseCategoryProps {
  title: string
  exercises: Exercise[]
}

export default function ExerciseCategory({ title, exercises }: ExerciseCategoryProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-xl font-semibold">{exercise.name}</h3>
            <p className="text-gray-600">{exercise.description}</p>
            <img
              src={exercise.imageUrl || "/placeholder.svg"}
              alt={exercise.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={"https://www.roc.je"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-md"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

