"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function getSuggestions(goal: string, dietType: string) {
  const prompt = `As a nutritionist, provide personalized food intake suggestions for a person with the following goals and dietary preferences:

Goal: ${goal}
Dietary Preference: ${dietType}

Please provide a detailed meal plan for one day, including breakfast, lunch, dinner, and two snacks. For each meal, suggest specific foods and explain their nutritional benefits in relation to the person's goal. Also, provide some general tips for maintaining this diet.

Format the response in HTML, using appropriate tags like <h3> for meal titles, <ul> for food lists, and <p> for explanations.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    return text
  } catch (error) {
    console.error("Error generating AI suggestions:", error)
    return "Sorry, there was an error generating your personalized suggestions. Please try again later."
  }
}

