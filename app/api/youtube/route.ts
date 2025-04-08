import { NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      )
    }

    // Check cache first
    const cachedData = cache.get(query)
    const now = Date.now()

    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      console.log("Returning cached data for query:", query)
      return NextResponse.json(cachedData.data)
    }

    if (!YOUTUBE_API_KEY) {
      console.error("YouTube API key is not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=6&key=${YOUTUBE_API_KEY}`
    )

    if (!response.ok) {
      const error = await response.json()
      console.error("YouTube API error:", error)
      return NextResponse.json(
        { error: "Failed to fetch videos from YouTube" },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Cache the response
    cache.set(query, {
      data,
      timestamp: now
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in YouTube API route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

