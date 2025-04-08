'use client'

import Link from 'next/link'
import { Heart, Activity, Brain, Utensils, Dumbbell, Menu, User } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-3xl font-bold flex items-center space-x-2 hover:text-green-200 transition-colors duration-300"
          >
            <Heart className="w-8 h-8" />
            <span>Health Monitor</span>
          </Link>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <nav
            className={`${menuOpen ? "block" : "hidden"} md:block absolute md:relative top-full left-0 right-0 bg-green-600 md:bg-transparent`}
          >
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 p-4 md:p-0">
              <li>
                <Link
                  href="/"
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors duration-300"
                >
                  <Activity className="w-5 h-5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-suggestions"
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors duration-300"
                >
                  <Brain className="w-5 h-5" />
                  <span>AI Suggestions</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/food-tracker"
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors duration-300"
                >
                  <Utensils className="w-5 h-5" />
                  <span>Food Tracker</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/free-ai-advisor"
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors duration-300"
                >
                  <Brain className="w-5 h-5" />
                  <span>Free AI Advisor</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/exercise-routines"
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors duration-300"
                >
                  <Dumbbell className="w-5 h-5" />
                  <span>Exercise Routines</span>
                </Link>
              </li>
              {session?.user && (
                <li>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-1 hover:text-green-200 transition-colors duration-300"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
} 