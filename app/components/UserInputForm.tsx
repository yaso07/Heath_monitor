"use client"

import type React from "react"

import { useState } from "react"

export default function UserInputForm() {
  const [weight, setWeight] = useState("")
  const [diet, setDiet] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend or state management
    console.log({ weight, diet })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label htmlFor="diet" className="block text-sm font-medium text-gray-700">
          Current Diet
        </label>
        <textarea
          id="diet"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
      >
        Analyze My Health
      </button>
    </form>
  )
}

