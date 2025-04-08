"use client"

import { useEffect, useState } from "react"

interface Video {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    thumbnails: {
      default: {
        url: string
      }
    }
  }
}

interface ExerciseVideosProps {
  searchQuery: string
}

export default function ExerciseVideos({ searchQuery }: ExerciseVideosProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/youtube?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch videos')
        }

        if (!data.items || data.items.length === 0) {
          setError('No videos found for this category')
          setVideos([])
          return
        }

        setVideos(data.items)
      } catch (err) {
        console.error('Error fetching videos:', err)
        setError(err instanceof Error ? err.message : 'Failed to load videos')
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    if (searchQuery) {
      fetchVideos()
    }
  }, [searchQuery])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>{error}</p>
        <p className="text-sm mt-2">Try refreshing the page or selecting a different category.</p>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700">
        <p>No videos found for this category.</p>
        <p className="text-sm mt-2">Try selecting a different category or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div
          key={video.id.videoId}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              title={video.snippet.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {video.snippet.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  )
} 