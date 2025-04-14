import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/courses - Récupérer tous les cours
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const courses = await prisma.course.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des cours' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Créer un nouveau cours
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { name, coefficient, level, description, teacherId } = data

    const course = await prisma.course.create({
      data: {
        name,
        coefficient: parseFloat(coefficient),
        level,
        description,
        teacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création du cours' },
      { status: 500 }
    )
  }
} 