"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Bell, X, Clock } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

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
  reminder?: {
    time: string
    enabled: boolean
  }
}

export default function DailyFoodTrackerList() {
  const { toast } = useToast()
  const [meals, setMeals] = useState<Meal[]>([])
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newMeal, setNewMeal] = useState<Omit<Meal, 'id' | 'foodLogs'>>({
    name: '',
    type: 'breakfast',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    reminder: {
      time: '08:00',
      enabled: false,
    },
  })

  // Load meals from API on component mount
  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    try {
      const response = await fetch('/api/meals')
      if (!response.ok) {
        throw new Error('Failed to fetch meals')
      }
      const data = await response.json()
      setMeals(data)
    } catch (error) {
      console.error('Error fetching meals:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch meals',
        variant: 'destructive',
      })
    }
  }

  // Check for reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`
      const currentDate = format(now, 'yyyy-MM-dd')

      meals.forEach((meal) => {
        if (meal.reminder?.enabled && meal.reminder.time === currentTime && meal.date === currentDate) {
          if (Notification.permission === 'granted') {
            new Notification(`Time for ${meal.type}!`, {
              body: meal.description,
              icon: '/favicon.ico',
            })
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification(`Time for ${meal.type}!`, {
                  body: meal.description,
                  icon: '/favicon.ico',
                })
              }
            })
          }
        }
      })
    }

    const intervalId = setInterval(checkReminders, 60000)
    return () => clearInterval(intervalId)
  }, [meals])

  const getDefaultReminderTime = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '08:00'
      case 'lunch':
        return '12:00'
      case 'dinner':
        return '18:00'
      case 'snack':
        return '15:00'
      default:
        return '08:00'
    }
  }

  const handleAddMeal = async () => {
    setLoading(true)
    try {
      // Validate required fields
      if (!newMeal.type || !newMeal.date) {
        throw new Error('Please select meal type and date')
      }

      // Set default reminder time based on meal type
      const defaultReminder = {
        time: getDefaultReminderTime(newMeal.type),
        enabled: newMeal.reminder?.enabled
      }

      // First create the meal
      const mealResponse = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newMeal.type,
          date: newMeal.date,
          description: newMeal.description || '',
          reminder: defaultReminder
        }),
      })

      let addedMeal
      try {
        addedMeal = await mealResponse.json()
      } catch (e) {
        throw new Error('Invalid response from server')
      }

      if (!mealResponse.ok) {
        throw new Error(addedMeal.error || 'Failed to add meal')
      }

      // Then create the food log for the meal
      const foodLogResponse = await fetch('/api/food-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newMeal.description || newMeal.type.charAt(0).toUpperCase() + newMeal.type.slice(1),
          calories: 0,
          mealId: addedMeal.id,
          userId: addedMeal.userId
        }),
      })

      let foodLog
      try {
        foodLog = await foodLogResponse.json()
      } catch (e) {
        throw new Error('Invalid response from server')
      }

      if (!foodLogResponse.ok) {
        throw new Error(foodLog.error || 'Failed to add food log')
      }
      
      // Update the meal with the food log
      const updatedMeal = {
        ...addedMeal,
        foodLogs: [foodLog]
      }
       console.log(JSON.parse(updatedMeal.reminder))
      // Update the meals list
      const meals={...updatedMeal,reminder:JSON.parse(updatedMeal.reminder)}
      setMeals(prevMeals => [...prevMeals,meals])
      
      // Reset the form
      setNewMeal({
        name: '',
        type: 'breakfast',
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        reminder: {
          time: '08:00',
          enabled: true,
        },
      })

      toast({
        title: 'Success',
        description: 'Meal and food log added successfully',
      })
    } catch (error) {
      console.error('Error adding meal:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add meal',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal)
    setIsEditing(true)
  }

  const handleUpdateMeal = async () => {
    if (!editingMeal) return

    setLoading(true)
    console.log(editingMeal)
    try {
      // Update the meal
      const mealResponse = await fetch(`/api/meals?id=${editingMeal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            "type": editingMeal.type,
            "date": editingMeal.date,
            "description": editingMeal.description,
            "reminder": editingMeal.reminder
        }
        ),
      })

      if (!mealResponse.ok) {
        throw new Error('Failed to update meal')
      }

      const updatedMeal = await mealResponse.json()

      // Update the food log if description changed
      if (editingMeal.foodLogs.length > 0) {
        const foodLogResponse = await fetch(`/api/food-logs?id=${editingMeal.foodLogs[0].id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editingMeal.description || 'Meal',
          }),
        })

        if (!foodLogResponse.ok) {
          throw new Error('Failed to update food log')
        }

        const updatedFoodLog = await foodLogResponse.json()
        updatedMeal.foodLogs = [updatedFoodLog]
      }
      console.log(updatedMeal)
      setMeals(meals.map((meal) => (meal.id === updatedMeal.id ?{...updatedMeal,reminder:JSON.parse(updatedMeal.reminder)} : meal)))
      setIsEditing(false)
      setEditingMeal(null)

      toast({
        title: 'Success',
        description: 'Meal and food log updated successfully',
      })
    } catch (error) {
      console.error('Error updating meal:', error)
      toast({
        title: 'Error',
        description: 'Failed to update meal',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMeal = async (id: string) => {
    setLoading(true)
    try {
      // First delete the food logs associated with the meal
      const meal = meals.find(m => m.id === id)
      if (meal?.foodLogs.length) {
        for (const foodLog of meal.foodLogs) {
          const foodLogResponse = await fetch(`/api/food-logs?id=${foodLog.id}`, {
            method: 'DELETE',
          })

          if (!foodLogResponse.ok) {
            throw new Error('Failed to delete food log')
          }
        }
      }

      // Then delete the meal
      const response = await fetch(`/api/meals?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete meal')
      }

      setMeals(meals.filter((meal) => meal.id !== id))
      toast({
        title: 'Success',
        description: 'Meal and food logs deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting meal:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete meal',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingMeal(null)
  }

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return "bg-yellow-100 text-yellow-800"
      case "lunch":
        return "bg-green-100 text-green-800"
      case "dinner":
        return "bg-blue-100 text-blue-800"
      case "snack":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Fix the type issue in the sort function
  const mealOrder: Record<string, number> = {
    breakfast: 0,
    lunch: 1,
    dinner: 2,
    snack: 3
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Meal</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={isEditing ? editingMeal?.date : newMeal.date}
                onChange={(e) =>
                  isEditing
                    ? setEditingMeal({ ...editingMeal!, date: e.target.value })
                    : setNewMeal({ ...newMeal, date: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <select
                id="mealType"
                value={isEditing ? editingMeal?.type : newMeal.type}
                onChange={(e) =>
                  isEditing
                    ? setEditingMeal({
                        ...editingMeal!,
                        type: e.target.value as "breakfast" | "lunch" | "dinner" | "snack",
                      })
                    : setNewMeal({
                        ...newMeal,
                        type: e.target.value as "breakfast" | "lunch" | "dinner" | "snack",
                      })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={isEditing ? editingMeal?.description : newMeal.description}
              onChange={(e) =>
                isEditing
                  ? setEditingMeal({ ...editingMeal!, description: e.target.value })
                  : setNewMeal({ ...newMeal, description: e.target.value })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              rows={2}
              required
            />
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Set Reminder</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="reminderToggle"
                  checked={isEditing ? editingMeal?.reminder?.enabled || false : newMeal.reminder?.enabled || false}
                  onChange={(e) =>
                    isEditing
                      ? setEditingMeal({
                          ...editingMeal!,
                          reminder: {
                            ...editingMeal!.reminder!,
                            enabled: e.target.checked,
                          },
                        })
                      : setNewMeal({
                          ...newMeal,
                          reminder: {
                            ...newMeal.reminder!,
                            enabled: e.target.checked,
                          },
                        })
                  }
                  className="sr-only"
                />
                <label
                  htmlFor="reminderToggle"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    (isEditing ? editingMeal?.reminder?.enabled : newMeal.reminder?.enabled)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      (isEditing ? editingMeal?.reminder?.enabled : newMeal.reminder?.enabled)
                        ? "translate-x-4"
                        : "translate-x-0"
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            {(isEditing ? editingMeal?.reminder?.enabled : newMeal.reminder?.enabled) && (
              <div>
                <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Time
                </label>
                <input
                  type="time"
                  id="reminderTime"
                  value={isEditing ? editingMeal?.reminder?.time || "08:00" : newMeal.reminder?.time || "08:00"}
                  onChange={(e) =>
                    isEditing
                      ? setEditingMeal({
                          ...editingMeal!,
                          reminder: {
                            ...editingMeal!.reminder!,
                            time: e.target.value,
                          },
                        })
                      : setNewMeal({
                          ...newMeal,
                          reminder: {
                            ...newMeal.reminder!,
                            time: e.target.value,
                          },
                        })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateMeal}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Update Meal
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleAddMeal}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Meal
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Tracked Meals</h2>
        {meals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No meals tracked yet. Add your first meal above!</p>
        ) : (
          <div className="space-y-4">
            {meals
              .sort((a, b) => {
                // Sort by date (newest first) and then by meal type
                const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime()
                if (dateComparison !== 0) return dateComparison

                return (mealOrder[a.type] || 0) - (mealOrder[b.type] || 0)
              })
              .map((meal) => (
                <div key={meal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(meal.type)}`}
                        >
                          {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">{meal.date}</span>
                        {meal.reminder?.enabled && (
                          <span className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {meal.reminder.time}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800">{meal.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditMeal(meal)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Active Reminders</h2>
        {meals.filter((meal) => meal.reminder?.enabled).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active reminders. Enable reminders when adding meals.</p>
        ) : (
          <div className="space-y-2">
            {meals
              .filter((meal) => meal.reminder?.enabled)
              .sort((a, b) => {
                // Sort by date and then by reminder time
                const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime()
                if (dateComparison !== 0) return dateComparison
                return a.reminder!.time.localeCompare(b.reminder!.time)
              })
              .map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium">
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} at {meal.reminder?.time}
                      </p>
                      <p className="text-sm text-gray-500">{meal.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMeals(
                        meals.map((m) =>
                          m.id === meal.id ? { ...m, reminder: { ...m.reminder!, enabled: false } } : m,
                        ),
                      )
                    }}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

