import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import nodemailer from "nodemailer"

// Create a transporter using your email credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return new NextResponse("Email is required", { status: 400 })
    }

    // Generate a reset token
    const resetToken = Math.random().toString(36).substring(2, 15)
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Update user with reset token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Send reset password email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
    
    await transporter.sendMail({
      from: `"Health Monitor" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - Health Monitor",
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
        ">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>Health Monitor Team</p>
      `,
    })

    return new NextResponse("Password reset email sent", { status: 200 })
  } catch (error) {
    console.error("Error sending reset password email:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 