import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BlogPostProps {
  title: string
  excerpt: string
  imageUrl: string
  date: string
}

export default function BlogPost({ title, excerpt, imageUrl, date }: BlogPostProps) {
  return (
    <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{date}</span>
          <Link
            href="#"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            <span>Read more</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

