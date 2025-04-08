import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return new NextResponse("Token and password are required", { status: 400 })
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return new NextResponse("Invalid or expired token", { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10)

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      }
    })

    return new NextResponse("Password reset successfully", { status: 200 })
  } catch (error) {
    console.error("Password reset error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 