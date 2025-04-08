'use server'

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { getSession } from "next-auth/react"

export default async function userDetails()
{
    const session=await getServerSession()
    const response =await prisma.user.findUnique({where:{email:session?.user.email}})
     console.log(response)
     return Response.json(response)
}