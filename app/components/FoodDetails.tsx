"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface FoodDetailsProps {
  food: string
  onClose: () => void
}

interface Video {
  id: string
  title: string
}

export default function FoodDetails({ food, onClose }: FoodDetailsProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`/api/youtube?q=${encodeURIComponent(food)} recipe`)
        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }
        const data = await response.json()
        setVideos(data.items.slice(0, 4))
      } catch (err) {
        setError("Failed to load videos. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [food])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{food}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Here's some information about {food}. In a real application, you would fetch this data from an API or
          database.
        </p>
        <h3 className="text-xl font-semibold mb-2">Related Videos</h3>
        {loading && <p>Loading videos...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {videos.map((video) => (
                <div key={video.id} className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-md"
                  ></iframe>
                </div>
              ))}
            </div>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(food)} recipe`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              View more videos on YouTube
            </a>
          </>
        )}
      </div>
    </div>
  )
}

