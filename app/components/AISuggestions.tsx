"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface AISuggestion {
  goal: string
  dietType: string
  suggestions: string
  timestamp: string
}

export default function AISuggestions() {
  const searchParams = useSearchParams()
  const [suggestions, setSuggestions] = useState<AISuggestion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadSuggestions = () => {
      try {
        const stored = localStorage.getItem('aiSuggestions')
        if (stored) {
          const parsed = JSON.parse(stored)
          setSuggestions(parsed)
        }
      } catch (err) {
        setError('Failed to load suggestions')
      } finally {
        setLoading(false)
      }
    }

    loadSuggestions()
  }, [searchParams])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!suggestions) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">No suggestions available. Please submit the form above to get AI-powered suggestions.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Personalized Suggestions</h3>
          <p className="text-sm text-gray-500">
            Based on your goal: <span className="font-medium">{suggestions.goal}</span> and 
            diet type: <span className="font-medium">{suggestions.dietType}</span>
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Generated on {new Date(suggestions.timestamp).toLocaleString()}
        </div>
      </div>
      
      <div className="prose max-w-none">
        {suggestions.suggestions.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <button
          onClick={() => {
            localStorage.removeItem('aiSuggestions')
            setSuggestions(null)
          }}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Clear suggestions
        </button>
      </div>
    </div>
  )
}

