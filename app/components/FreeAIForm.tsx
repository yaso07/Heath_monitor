"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function FreeAIForm() {
  const [goal, setGoal] = useState("")
  const [currentHabits, setCurrentHabits] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/free-ai-advisor?goal=${encodeURIComponent(goal)}&habits=${encodeURIComponent(currentHabits)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
          Your Health Goal
        </label>
        <select
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        >
          <option value="">Select a goal</option>
          <option value="weight-loss">Weight Loss</option>
          <option value="weight-gain">Weight Gain</option>
          <option value="muscle-gain">Muscle Gain</option>
          <option value="improve-energy">Improve Energy</option>
          <option value="better-sleep">Better Sleep</option>
        </select>
      </div>
      <div>
        <label htmlFor="currentHabits" className="block text-sm font-medium text-gray-700 mb-1">
          Current Habits (Diet and Exercise)
        </label>
        <textarea
          id="currentHabits"
          value={currentHabits}
          onChange={(e) => setCurrentHabits(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          rows={4}
          required
          placeholder="Describe your current diet and exercise habits..."
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
      >
        Get Free AI Advice
      </button>
    </form>
  )
}

