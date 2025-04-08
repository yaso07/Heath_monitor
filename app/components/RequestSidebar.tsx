"use client"

import { useState, useEffect } from "react"

interface Request {
  id: number
  foodName: string
  status: "pending" | "completed" | "rejected"
  feedback?: string
}

export default function RequestSidebar() {
  const [requests, setRequests] = useState<Request[]>([])

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const mockRequests: Request[] = [
      { id: 1, foodName: "Sushi", status: "completed" },
      { id: 2, foodName: "Quinoa", status: "pending" },
      { id: 3, foodName: "Durian", status: "rejected", feedback: "Not available in our database" },
      { id: 4, foodName: "Acai Bowl", status: "pending" },
    ]
    setRequests(mockRequests)
  }, [])

  return (
    <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="border-b pb-2">
            <h3 className="font-medium">{request.foodName}</h3>
            <p
              className={`text-sm ${
                request.status === "completed"
                  ? "text-green-600"
                  : request.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
              }`}
            >
              Status: {request.status}
            </p>
            {request.feedback && <p className="text-sm text-gray-600 mt-1">{request.feedback}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

