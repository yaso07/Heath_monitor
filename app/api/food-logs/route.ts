import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import {
  getUserFoodLogs,
  createFoodLog,
  deleteFoodLog,
  updateFoodLog,
  getFoodLogById,
  getTotalCaloriesForUser
} from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mealId = searchParams.get('mealId')
    const date = searchParams.get('date')
    
    const foodLogs = await getUserFoodLogs(
      session.user.id,
      mealId || undefined,
      date ? new Date(date) : undefined
    )
    
    return NextResponse.json(foodLogs)
  } catch (error) {
    console.error('Error fetching food logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch food logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const foodLog = await createFoodLog({
      ...data,
      userId: session.user.id
    })
    
    return NextResponse.json(foodLog)
  } catch (error) {
    console.error('Error creating food log:', error)
    return NextResponse.json(
      { error: 'Failed to create food log' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Food log ID is required' },
        { status: 400 }
      )
    }

    await deleteFoodLog(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting food log:', error)
    return NextResponse.json(
      { error: 'Failed to delete food log' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Food log ID is required' },
        { status: 400 }
      )
    }

    const data = await request.json()
    const foodLog = await updateFoodLog(id, data)
    
    return NextResponse.json(foodLog)
  } catch (error) {
    console.error('Error updating food log:', error)
    return NextResponse.json(
      { error: 'Failed to update food log' },
      { status: 500 }
    )
  }
}

export async function GET_TOTAL_CALORIES(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    const totalCalories = await getTotalCaloriesForUser(
      session.user.id,
      date ? new Date(date) : undefined
    )
    
    return NextResponse.json({ totalCalories })
  } catch (error) {
    console.error('Error fetching total calories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch total calories' },
      { status: 500 }
    )
  }
} 