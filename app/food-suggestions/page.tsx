"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import FoodCategories from "../components/FoodCategories"
import FoodInfoForm from "../components/FoodInfoForm"
import RequestSidebar from "../components/RequestSidebar"
import FoodDetailsSidebar from "../components/FoodDetailsSidebar"

export default function FoodSuggestionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFood, setSelectedFood] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm) {
      setSelectedFood(searchTerm)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-3/4 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Food Suggestions</h1>

        <form onSubmit={handleSearch} className="flex space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a food item"
            className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </form>

        <FoodCategories onFoodSelect={setSelectedFood} />

        <FoodInfoForm />
      </div>
      <RequestSidebar />
      <FoodDetailsSidebar food={selectedFood} onClose={() => setSelectedFood(null)} />
    </div>
  )
}

