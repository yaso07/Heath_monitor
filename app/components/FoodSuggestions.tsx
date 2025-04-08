"use client"

import { useState } from "react"

const foodDatabase = [
  { name: "Apple", category: "Fruits", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: "Chicken Breast", category: "Protein", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Brown Rice", category: "Cereals", calories: 112, protein: 2.6, carbs: 24, fat: 0.9 },
  { name: "Broccoli", category: "Vegetables", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: "Salmon", category: "Protein", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Avocado", category: "Fruits", calories: 160, protein: 2, carbs: 9, fat: 15 },
  { name: "Quinoa", category: "Cereals", calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },
  { name: "Spinach", category: "Vegetables", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
]

export default function FoodSuggestions() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredFoods =
    selectedCategory === "All" ? foodDatabase : foodDatabase.filter((food) => food.category === selectedCategory)

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          <option value="All">All</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Cereals">Cereals</option>
          <option value="Protein">Protein</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map((food) => (
          <div
            key={food.name}
            className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md hover:scale-105 transform"
          >
            <h3 className="text-lg font-semibold mb-2">{food.name}</h3>
            <p className="text-sm text-gray-600 mb-1">Category: {food.category}</p>
            <p className="text-sm text-gray-600 mb-1">Calories: {food.calories}</p>
            <p className="text-sm text-gray-600 mb-1">Protein: {food.protein}g</p>
            <p className="text-sm text-gray-600 mb-1">Carbs: {food.carbs}g</p>
            <p className="text-sm text-gray-600">Fat: {food.fat}g</p>
          </div>
        ))}
      </div>
    </div>
  )
}

