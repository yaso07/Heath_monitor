import { PrismaClient, Meal as PrismaMeal, FoodLog, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

interface ReminderType {
  time: string
  enabled: boolean
}

type MealWithFoodLogs = Omit<PrismaMeal, 'reminder'> & {
  foodLogs: FoodLog[]
  reminder: ReminderType | null
}

function parseReminder(reminderStr: unknown): ReminderType | null {
  if (typeof reminderStr !== 'string') return null
  try {
    const parsed = JSON.parse(reminderStr)
    if (typeof parsed === 'object' && parsed !== null && 'time' in parsed && 'enabled' in parsed) {
      return parsed as ReminderType
    }
    return null
  } catch {
    return null
  }
}

// Server-side database operations
export async function getUserMeals(userId: string, date?: Date): Promise<MealWithFoodLogs[]> {
  const where = {
    userId,
    ...(date ? {
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999))
      }
    } : {})
  }

  const meals = await prisma.meal.findMany({
    where,
    include: { 
      foodLogs: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return meals.map(meal => ({
    ...meal,
    reminder: parseReminder(meal.reminder)
  })) as MealWithFoodLogs[]
}

export async function createMeal(data: {
  name: string
  description?: string
  type: string
  date: Date
  userId: string
  reminder?: ReminderType
}): Promise<PrismaMeal> {

  console.log(data)
  return prisma.meal.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      date: data.date,
      userId: data.userId,
      reminder: data.reminder ? JSON.stringify(data.reminder) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
}

export async function getUserFoodLogs(userId: string, mealId?: string, date?: Date) {
  const where = {
    userId,
    ...(mealId ? { mealId } : {}),
    ...(date ? {
      meal: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999))
        }
      }
    } : {})
  }

  return prisma.foodLog.findMany({
    where,
    include: { 
      meal: true 
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createFoodLog(data: {
  name: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
  portion?: string
  mealId: string
  userId: string
}) {
  return prisma.foodLog.create({
    data: {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    include: { meal: true }
  })
}

export async function deleteFoodLog(id: string) {
  return prisma.foodLog.delete({
    where: { id }
  })
}

export async function getMealWithFoodLogs(mealId: string): Promise<MealWithFoodLogs | null> {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    include: { 
      foodLogs: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!meal) return null

  return {
    ...meal,
    reminder: parseReminder(meal.reminder)
  } as MealWithFoodLogs
}

export async function updateFoodLog(
  id: string,
  data: {
    name?: string
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    portion?: string
  }
) {
  return prisma.foodLog.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date()
    }
  })
}

export async function deleteMeal(id: string) {
  return prisma.meal.delete({
    where: { id }
  })
}

export async function updateMeal(
  id: string,
  data: {
    name?: string
    description?: string
    type?: string
    date?: Date
    reminder?: ReminderType
  }
): Promise<PrismaMeal> {
  return prisma.meal.update({
    where: { id },
    data: {
      ...data,
      reminder: data.reminder ? JSON.stringify(data.reminder) : undefined,
      updatedAt: new Date()
    }
  })
}

export async function getFoodLogById(id: string) {
  return prisma.foodLog.findUnique({
    where: { id },
    include: { meal: true }
  })
}

export async function getMealById(id: string): Promise<MealWithFoodLogs | null> {
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: { foodLogs: true }
  })

  if (!meal) return null

  return {
    ...meal,
    reminder: parseReminder(meal.reminder)
  } as MealWithFoodLogs
}

export async function getTotalCaloriesForMeal(mealId: string) {
  const result = await prisma.foodLog.aggregate({
    where: { mealId },
    _sum: { calories: true }
  })
  return result._sum?.calories || 0
}

export async function getTotalCaloriesForUser(userId: string, date?: Date) {
  const where = {
    userId,
    ...(date ? {
      meal: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999))
        }
      }
    } : {})
  }

  const result = await prisma.foodLog.aggregate({
    where,
    _sum: { calories: true }
  })
  return result._sum?.calories || 0
}

export async function getMealsByType(userId: string, type: string, date?: Date): Promise<MealWithFoodLogs[]> {
  const where = {
    userId,
    type,
    ...(date ? {
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999))
      }
    } : {})
  }

  const meals = await prisma.meal.findMany({
    where,
    include: { 
      foodLogs: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return meals.map(meal => ({
    ...meal,
    reminder: parseReminder(meal.reminder)
  })) as MealWithFoodLogs[]
} 