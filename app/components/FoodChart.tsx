"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface FoodChartProps {
  data: {
    proteins: number
    carbs: number
    fats: number
    fruits: number
    vegetables: number
  }
}

export default function FoodChart({ data }: FoodChartProps) {
  const chartData = [
    { name: "Proteins", value: data.proteins, color: "#FF6384" },
    { name: "Carbs", value: data.carbs, color: "#36A2EB" },
    { name: "Fats", value: data.fats, color: "#FFCE56" },
    { name: "Fruits", value: data.fruits, color: "#4BC0C0" },
    { name: "Vegetables", value: data.vegetables, color: "#9966FF" },
  ]

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

