"use client"

import { signOut, useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import prisma from "@/lib/prisma"
import userDetails from "../actions/user"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [mobileNumber, setMobileNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [enableNotifications, setEnableNotifications] = useState(false)
console.log(session)

 const hanldeApi=async()=>{
    const response=await fetch('/api/user/'+session?.user.id)
    const data=await response.json()
    console.log(data)
    setMobileNumber(data?.mobileNumber)
 }
  useEffect(() => {
    if (session?.user) {
       hanldeApi()
       
    }
  }, [session])

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Please sign in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleMobileNumberUpdate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mobileNumber,
          enableNotifications 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Update the session to reflect the changes
     const response1= await update({
        ...session,
        user: {
          ...session.user,
          mobileNumber,
          enableNotifications
        }
      })
      console.log(response1)

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email }),
      })

      if (!response.ok) {
        throw new Error('Failed to send password reset email')
      }

      toast({
        title: "Success",
        description: "Password reset email sent. Please check your inbox.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <button onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out
    </button>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={session.user.name || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={session.user.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Mobile Number</Label>
            <Input 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
              type="tel"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={enableNotifications}
              onCheckedChange={setEnableNotifications}
            />
            <Label htmlFor="notifications">Enable Mobile Notifications</Label>
          </div>
          <div className="flex space-x-4">
            <Button 
              onClick={handleMobileNumberUpdate}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
            <Button 
              onClick={handlePasswordReset}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 