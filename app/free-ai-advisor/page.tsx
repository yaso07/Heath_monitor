import FreeAIForm from "../components/FreeAIForm"
import AIAdvice from "../components/AIAdvice"
import { Suspense } from "react"

export default function FreeAIAdvisorPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Free AI Health Advisor</h2>
        <p className="mb-4 text-gray-600">
          Get personalized health and nutrition advice based on your goals and habits.
        </p>
        <FreeAIForm />
      </section>
      <Suspense>
      <AIAdvice />
      </Suspense>
   
    </div>
  )
}

