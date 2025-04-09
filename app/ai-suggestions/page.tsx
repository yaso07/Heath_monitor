import { Suspense } from "react"
import AISuggestionForm from "../components/AISuggestionForm"
import AISuggestions from "../components/AISuggestions"

export default function AISuggestionsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">AI-Powered Food Intake Suggestions</h2>
        <p className="mb-4 text-gray-600">
          Get personalized food suggestions based on your goals and dietary preferences.
        </p>
        <AISuggestionForm />
      </section>
      <Suspense>
      <AISuggestions />
      </Suspense>
    
    </div>
  )
}

