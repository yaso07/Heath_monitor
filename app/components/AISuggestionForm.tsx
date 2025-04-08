"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AISuggestionForm() {
  const [goal, setGoal] = useState("")
  const [dietType, setDietType] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal, dietType }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to get suggestions')
      }

      const data = await response.json()
      // Store the suggestions in localStorage for the suggestions component
      localStorage.setItem('aiSuggestions', JSON.stringify({
        goal,
        dietType,
        suggestions: data.choices[0].message.content,
        timestamp: new Date().toISOString()
      }))
      
      router.push(`/ai-suggestions?goal=${goal}&dietType=${dietType}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
          Your Goal
        </label>
        <select
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
          disabled={loading}
        >
          <option value="">Select a goal</option>
          <option value="weight-loss">Weight Loss</option>
          <option value="weight-gain">Weight Gain</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      <div>
        <label htmlFor="dietType" className="block text-sm font-medium text-gray-700 mb-1">
          Dietary Preference
        </label>
        <select
          id="dietType"
          value={dietType}
          onChange={(e) => setDietType(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
          disabled={loading}
        >
          <option value="">Select a diet type</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="non-vegetarian">Non-Vegetarian</option>
        </select>
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
      </button>
    </form>
  )
}

