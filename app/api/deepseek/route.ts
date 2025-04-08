import { NextResponse } from 'next/server'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export async function POST(request: Request) {
  try {
    const { goal, dietType } = await request.json()

    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API key is not configured' },
        { status: 500 }
      )
    }

    if (!goal || !dietType) {
      return NextResponse.json(
        { error: 'Goal and diet type are required' },
        { status: 400 }
      )
    }

    const prompt = `Generate a personalized meal plan and food suggestions for someone with the following:
    Goal: ${goal}
    Diet Type: ${dietType}
    
    Please provide:
    1. A brief explanation of why these suggestions are suitable
    2. A list of recommended foods with portion sizes
    3. Sample meal combinations
    4. Any specific nutrients to focus on
    5. Tips for success`

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and dietitian providing personalized food suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('DeepSeek API error:', error)
      return NextResponse.json(
        { error: 'Failed to get suggestions from DeepSeek' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in DeepSeek API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 