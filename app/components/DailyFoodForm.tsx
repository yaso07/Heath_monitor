"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

interface FoodLog {
  id: string
  name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  portion?: string
  mealId: string
}

interface Meal {
  id: string
  name: string
  type: string
  date: string
  description?: string
  foodLogs: FoodLog[]
}

export default function DailyFoodForm() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(false)
  const [breakfast, setBreakfast] = useState("")
  const [lunch, setLunch] = useState("")
  const [dinner, setDinner] = useState("")
  const [snacks, setSnacks] = useState("")

  useEffect(() => {
    if (date) {
      fetchMeals()
    }
  }, [date])

  const fetchMeals = async () => {
    try {
      const response = await fetch(`/api/meals?date=${date?.toISOString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch meals')
      }
      const data = await response.json()
      setMeals(data)
      
      // Update form fields with existing meals
      data.forEach((meal: Meal) => {
        switch (meal.type) {
          case 'breakfast':
            setBreakfast(meal.description || '')
            break
          case 'lunch':
            setLunch(meal.description || '')
            break
          case 'dinner':
            setDinner(meal.description || '')
            break
          case 'snacks':
            setSnacks(meal.description || '')
            break
        }
      })
    } catch (error) {
      console.error('Error fetching meals:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch meals',
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) return

    setLoading(true)
    try {
      // Delete existing meals for the selected date
      for (const meal of meals) {
        await fetch(`/api/meals?id=${meal.id}`, {
          method: 'DELETE',
        })
      }

      // Create new meals
      const mealTypes = [
        { type: 'breakfast', content: breakfast },
        { type: 'lunch', content: lunch },
        { type: 'dinner', content: dinner },
        { type: 'snacks', content: snacks }
      ]

      for (const meal of mealTypes) {
        if (meal.content.trim()) {
          const response = await fetch('/api/meals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: meal.type.charAt(0).toUpperCase() + meal.type.slice(1),
              type: meal.type,
              date: date,
              description: meal.content,
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to save ${meal.type}`)
          }

          const newMeal = await response.json()

          // Create food log for the meal
          await fetch('/api/food-logs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: meal.content,
              calories: 0, // You can add calorie calculation logic here
              mealId: newMeal.id,
            }),
          })
        }
      }

      toast({
        title: 'Success',
        description: 'Daily food log saved successfully',
      })

      // Refresh the meals list
      fetchMeals()
    } catch (error) {
      console.error('Error saving food log:', error)
      toast({
        title: 'Error',
        description: 'Failed to save food log',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="breakfast">Breakfast</Label>
        <Textarea
          id="breakfast"
          value={breakfast}
          onChange={(e) => setBreakfast(e.target.value)}
          placeholder="What did you have for breakfast?"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lunch">Lunch</Label>
        <Textarea
          id="lunch"
          value={lunch}
          onChange={(e) => setLunch(e.target.value)}
          placeholder="What did you have for lunch?"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dinner">Dinner</Label>
        <Textarea
          id="dinner"
          value={dinner}
          onChange={(e) => setDinner(e.target.value)}
          placeholder="What did you have for dinner?"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="snacks">Snacks</Label>
        <Textarea
          id="snacks"
          value={snacks}
          onChange={(e) => setSnacks(e.target.value)}
          placeholder="Any snacks throughout the day?"
          className="min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Food Log'}
      </Button>
    </form>
  )
}

