"use client"

import { useState, useEffect } from "react"

interface DailyFood {
  date: string
  breakfast: string
  lunch: string
  dinner: string
  snacks: string
}

export default function WeeklyFoodTable() {
  const [weeklyData, setWeeklyData] = useState<DailyFood[]>([])

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    // For now, we'll use mock data
    const mockData: DailyFood[] = [
      { date: "2023-06-01", breakfast: "Oatmeal", lunch: "Salad", dinner: "Grilled chicken", snacks: "Apple" },
      { date: "2023-06-02", breakfast: "Eggs", lunch: "Sandwich", dinner: "Fish", snacks: "Yogurt" },
      // ... add more mock data for the week
    ]
    setWeeklyData(mockData)
  }, [])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Breakfast
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lunch</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dinner</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Snacks</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {weeklyData.map((day) => (
            <tr key={day.date}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.breakfast}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.lunch}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.dinner}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.snacks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

