import { prisma } from "@/lib/db"
import { NextRequest } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return new Response("User not found", { status: 404 })
    }

    return Response.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}