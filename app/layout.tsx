import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import Navigation from "./components/Navigation"
import ProgressBarProvider from "./components/ProgressBarProvider"
import Providers from "./providers"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Health Monitor",
  description: "Monitor your health and get personalized food suggestions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-100 text-gray-900`}>
        <Providers>
          <Navigation />
          <Suspense>
          <ProgressBarProvider />
          </Suspense>
         
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-800 text-white py-4 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2023 Health Monitor. All rights reserved.</p>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  )
}