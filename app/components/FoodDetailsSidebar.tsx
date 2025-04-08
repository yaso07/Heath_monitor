"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface FoodDetailsSidebarProps {
  food: string | null
  onClose: () => void
}

const foodData: { [key: string]: any } = {
  Apple: {
    nutrition: {
      calories: 95,
      protein: "0.5g",
      carbs: "25g",
      fat: "0.3g",
    },
    benefits:
      "Apples are rich in antioxidants, fiber, and vitamin C. They may help reduce the risk of heart disease and improve gut health.",
    recipes: ["Apple Pie", "Apple Smoothie", "Caramel Apple"],
    videos: [
      { id: "1", title: "How to Make Apple Pie", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "2", title: "Health Benefits of Apples", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "3", title: "Apple Smoothie Recipe", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "4", title: "Growing Apples at Home", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ],
  },
  // Add more food items here with similar structure
}

export default function FoodDetailsSidebar({ food, onClose }: FoodDetailsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (food) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [food])

  if (!food) return null

  const foodInfo = foodData[food] || {
    nutrition: { calories: "N/A", protein: "N/A", carbs: "N/A", fat: "N/A" },
    benefits: "Information not available.",
    recipes: ["No recipes available"],
    videos: [
      { id: "1", title: "No video available", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "2", title: "No video available", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "3", title: "No video available", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "4", title: "No video available", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ],
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50 overflow-y-auto`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{food}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <h3 className="text-xl font-semibold mb-2">Nutritional Information</h3>
        <ul className="list-disc pl-5 mb-4">
          <li>Calories: {foodInfo.nutrition.calories}</li>
          <li>Protein: {foodInfo.nutrition.protein}</li>
          <li>Carbs: {foodInfo.nutrition.carbs}</li>
          <li>Fat: {foodInfo.nutrition.fat}</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2">Health Benefits</h3>
        <p className="text-gray-600 mb-4">{foodInfo.benefits}</p>
        <h3 className="text-xl font-semibold mb-2">Recipe Ideas</h3>
        <ul className="list-disc pl-5 mb-4">
          {foodInfo.recipes.map((recipe: string, index: number) => (
            <li key={index}>{recipe}</li>
          ))}
        </ul>
        <h3 className="text-xl font-semibold mb-2">Related Videos</h3>
        <div className="space-y-4">
          {foodInfo.videos.map((video: { id: string; title: string; url: string }) => (
            <div key={video.id}>
              <h4 className="font-medium mb-2">{video.title}</h4>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={video.url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-md"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

