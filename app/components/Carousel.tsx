"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "/placeholder.svg?height=400&width=1200",
    title: "Achieve Your Health Goals",
    description: "Get personalized advice and track your progress with Health Monitor",
  },
  {
    image: "/placeholder.svg?height=400&width=1200",
    title: "Discover Nutritious Recipes",
    description: "Explore a variety of healthy and delicious meal ideas",
  },
  {
    image: "/placeholder.svg?height=400&width=1200",
    title: "Stay Active with Custom Workouts",
    description: "Find exercise routines tailored to your fitness level and goals",
  },
]

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide]) // Added nextSlide to dependencies

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-8">
            <h2 className="text-4xl font-bold mb-4 text-center">{slide.title}</h2>
            <p className="text-xl text-center">{slide.description}</p>
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>
    </div>
  )
}

