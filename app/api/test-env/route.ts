import { NextResponse } from "next/server"

export async function GET() {
  const hasYoutubeKey = !!process.env.YOUTUBE_API_KEY
  const keyLength = process.env.YOUTUBE_API_KEY?.length || 0

  return NextResponse.json({
    hasYoutubeKey,
    keyLength,
    nodeEnv: process.env.NODE_ENV
  })
} 