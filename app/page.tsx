import Link from "next/link"
import { ArrowRight, Utensils, Brain, Dumbbell } from "lucide-react"
import UserInputForm from "./components/UserInputForm"
import Carousel from "./components/Carousel"
import BlogPosts from "./components/BlogPosts"
import APITest from "./components/APITest"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Health Monitor',
  description: 'A health monitoring application with YouTube integration',
}

export default function Home() {
  return (
    <div className="space-y-12">
      <Carousel />

      <section className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome to Health Monitor</h2>
        <p className="text-xl text-gray-600 mb-8 text-center">
          Your personal guide to a healthier lifestyle. Track your diet, get AI-powered suggestions, and stay motivated
          on your wellness journey.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href="/food-tracker"
            className="bg-green-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
          >
            <Utensils className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Food Tracker</h3>
            <p className="text-gray-600 mb-4">Log your meals and monitor your nutrition intake</p>
            <ArrowRight className="w-6 h-6 text-green-600" />
          </Link>
          <Link
            href="/ai-suggestions"
            className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
          >
            <Brain className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Suggestions</h3>
            <p className="text-gray-600 mb-4">Get personalized diet and exercise recommendations</p>
            <ArrowRight className="w-6 h-6 text-blue-600" />
          </Link>
          <Link
            href="/exercise-routines"
            className="bg-purple-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
          >
            <Dumbbell className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Exercise Routines</h3>
            <p className="text-gray-600 mb-4">Discover effective workout plans for your fitness goals</p>
            <ArrowRight className="w-6 h-6 text-purple-600" />
          </Link>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Your Health Profile</h2>
        <UserInputForm />
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Food Suggestions</h2>
        <p className="text-xl text-gray-600 mb-8">
          Get personalized food suggestions based on your preferences and dietary requirements.
        </p>
        <Link
          href="/food-suggestions"
          className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-300"
        >
          <span>Get Food Suggestions</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Daily Health & Nutrition Blog</h2>
        <BlogPosts />
      </section>

      <APITest />
    </div>
  )
}

