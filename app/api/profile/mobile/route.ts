import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { mobileNumber } = await req.json()

    // Validate mobile number format
    if (!mobileNumber || !/^\+?[1-9]\d{1,14}$/.test(mobileNumber)) {
      return new NextResponse("Invalid mobile number format", { status: 400 })
    }

    // Update user's mobile number
    await prisma.user.update({
      where: { id: session.user.id },
      data: { mobileNumber },
    })

    return new NextResponse("Mobile number updated successfully", { status: 200 })
  } catch (error) {
    console.error("Error updating mobile number:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 