"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import FoodChart from "./FoodChart"

interface Advice {
  diet: string[]
  exercise: string[]
  lifestyle: string[]
  foodChart: {
    proteins: number
    carbs: number
    fats: number
    fruits: number
    vegetables: number
  }
}

export default function AIAdvice() {
  const searchParams = useSearchParams()
  const goal = searchParams.get("goal")
  const habits = searchParams.get("habits")
  const [advice, setAdvice] = useState<Advice | null>(null)

  useEffect(() => {
    if (goal && habits) {
      const generatedAdvice = generateAdvice(goal, habits)
      setAdvice(generatedAdvice)
    }
  }, [goal, habits])

  if (!goal || !habits) return null

  return (
    <section className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4">Your Personalized AI Advice</h2>
      {advice ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Diet Recommendations:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {advice.diet.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Exercise Recommendations:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {advice.exercise.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Lifestyle Recommendations:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {advice.lifestyle.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Recommended Food Intake:</h3>
            <FoodChart data={advice.foodChart} />
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No advice available. Please try again.</p>
      )}
    </section>
  )
}

function generateAdvice(goal: string, habits: string): Advice {
  const advice: Advice = {
    diet: [],
    exercise: [],
    lifestyle: [],
    foodChart: {
      proteins: 0,
      carbs: 0,
      fats: 0,
      fruits: 0,
      vegetables: 0,
    },
  }

  // Diet advice
  if (goal === "weight-loss") {
    advice.diet = [
      "Create a calorie deficit by reducing intake by 500 calories per day",
      "Increase protein intake to 25-30% of total calories to preserve muscle mass",
      "Focus on low-calorie, nutrient-dense foods like vegetables and lean proteins",
      "Limit processed foods, sugary drinks, and high-fat snacks",
      "Use smaller plates to control portion sizes",
      "Drink water before meals to help feel fuller",
    ]
    advice.foodChart = { proteins: 30, carbs: 40, fats: 30, fruits: 15, vegetables: 35 }
  } else if (goal === "weight-gain") {
    advice.diet = [
      "Increase calorie intake by 300-500 calories per day",
      "Consume protein-rich foods with every meal to support muscle growth",
      "Include healthy fats like nuts, avocados, and olive oil in your diet",
      "Eat more frequent meals and snacks throughout the day",
      "Choose nutrient-dense, calorie-rich foods like whole grains and lean meats",
      "Consider protein shakes or smoothies for easy additional calories",
    ]
    advice.foodChart = { proteins: 25, carbs: 50, fats: 25, fruits: 10, vegetables: 25 }
  } else if (goal === "muscle-gain") {
    advice.diet = [
      "Increase protein intake to 1.6-2.2 grams per kg of body weight",
      "Consume complex carbohydrates for energy and to support muscle growth",
      "Eat frequent meals (5-6) throughout the day to maintain positive nitrogen balance",
      "Include a mix of animal and plant-based proteins for a complete amino acid profile",
      "Consume a protein and carb-rich meal within 30 minutes after workouts",
      "Stay hydrated to support muscle function and recovery",
    ]
    advice.foodChart = { proteins: 30, carbs: 50, fats: 20, fruits: 10, vegetables: 30 }
  } else if (goal === "improve-energy") {
    advice.diet = [
      "Focus on complex carbohydrates for sustained energy release",
      "Include lean proteins in each meal to stabilize blood sugar",
      "Eat small, frequent meals to maintain steady energy levels",
      "Incorporate foods rich in B vitamins, iron, and magnesium",
      "Stay hydrated throughout the day",
      "Limit caffeine and sugar intake to avoid energy crashes",
    ]
    advice.foodChart = { proteins: 25, carbs: 55, fats: 20, fruits: 15, vegetables: 35 }
  } else if (goal === "better-sleep") {
    advice.diet = [
      "Avoid large meals close to bedtime",
      "Limit caffeine intake, especially in the afternoon and evening",
      "Consider foods rich in melatonin like cherries, nuts, and oats",
      "Include foods high in magnesium and calcium for better sleep quality",
      "Stay hydrated but reduce fluid intake close to bedtime",
      "Avoid alcohol before bed as it can disrupt sleep patterns",
    ]
    advice.foodChart = { proteins: 20, carbs: 55, fats: 25, fruits: 15, vegetables: 35 }
  }

  // Exercise advice
  if (goal === "weight-loss" || goal === "improve-energy") {
    advice.exercise.push("Aim for 150 minutes of moderate aerobic activity per week")
    advice.exercise.push("Include strength training exercises 2-3 times per week")
  } else if (goal === "muscle-gain") {
    advice.exercise.push("Focus on compound exercises like squats, deadlifts, and bench presses")
    advice.exercise.push("Aim for 3-4 strength training sessions per week")
    advice.exercise.push("Include progressive overload in your workouts")
  }

  // Lifestyle advice
  advice.lifestyle.push("Aim for 7-9 hours of sleep per night")
  advice.lifestyle.push("Stay hydrated by drinking at least 8 glasses of water per day")
  advice.lifestyle.push("Practice stress-reduction techniques like meditation or deep breathing")

  if (goal === "better-sleep") {
    advice.lifestyle.push("Establish a consistent sleep schedule")
    advice.lifestyle.push("Create a relaxing bedtime routine")
    advice.lifestyle.push("Avoid screens for at least an hour before bed")
  }

  return advice
}

