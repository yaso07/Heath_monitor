"use client"

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

export default function MealReminder() {
  const { toast } = useToast()
  const [reminderTime, setReminderTime] = useState("")
  const [reminderMessage, setReminderMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: reminderMessage,
          type: 'reminder',
          date: new Date(),
          description: `Reminder set for ${reminderTime}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to set reminder')
      }

      toast({
        title: 'Success',
        description: `Reminder set for ${reminderTime}: ${reminderMessage}`,
      })

      // Reset form
      setReminderTime("")
      setReminderMessage("")
    } catch (error) {
      console.error('Error setting reminder:', error)
      toast({
        title: 'Error',
        description: 'Failed to set reminder',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
          Reminder Time
        </label>
        <input
          type="time"
          id="reminderTime"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>
      <div>
        <label htmlFor="reminderMessage" className="block text-sm font-medium text-gray-700 mb-1">
          Reminder Message
        </label>
        <input
          type="text"
          id="reminderMessage"
          value={reminderMessage}
          onChange={(e) => setReminderMessage(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
      >
        Set Reminder
      </Button>
    </form>
  )
}

