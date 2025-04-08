"use client"

import { useState } from "react"

const categories = [
  {
    name: "Fruits",
    items: ["Apple", "Banana", "Orange", "Strawberry", "Mango"],
  },
  {
    name: "Vegetables",
    items: ["Carrot", "Broccoli", "Spinach", "Tomato", "Cucumber"],
  },
  {
    name: "Proteins",
    items: ["Chicken", "Beef", "Fish", "Eggs", "Tofu"],
  },
  {
    name: "Grains",
    items: ["Rice", "Bread", "Pasta", "Quinoa", "Oats"],
  },
]

interface FoodCategoriesProps {
  onFoodSelect: (food: string) => void
}

export default function FoodCategories({ onFoodSelect }: FoodCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].name)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Food Categories</h2>
      <div className="flex space-x-4 mb-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            className={`px-4 py-2 rounded-md ${
              activeCategory === category.name
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } transition-colors duration-300`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories
          .find((category) => category.name === activeCategory)
          ?.items.map((item) => (
            <button
              key={item}
              onClick={() => onFoodSelect(item)}
              className="bg-gray-100 rounded-md p-4 text-center hover:bg-gray-200 transition-colors duration-300"
            >
              {item}
            </button>
          ))}
      </div>
    </div>
  )
}

