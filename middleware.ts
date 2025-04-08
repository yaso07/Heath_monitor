import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req: Request) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: "/auth/login"
    }
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/food-tracker/:path*",
    "/profile/:path*"
  ]
} 