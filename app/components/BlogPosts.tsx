"use client"

import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: number
  title: string
  body: string
}

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=4")
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.body.slice(0, 100)}...</p>
            <Link
              href="#"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              <span>Read more</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

