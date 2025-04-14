/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/classes
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const classes = await prisma.class.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/classes
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, level, year, teacherId } = body

    // Validation
    if (!name || !level || !year || !teacherId) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si le nom de classe est déjà pris
    const existingClass = await prisma.class.findFirst({
      where: {
        name,
        year, // Même nom de classe la même année
      },
    })

    if (existingClass) {
      return NextResponse.json(
        { message: 'Une classe avec ce nom existe déjà pour cette année scolaire' },
        { status: 400 }
      )
    }

    // Vérifier si l'enseignant existe
    const teacher = await prisma.user.findFirst({
      where: {
        id: teacherId,
        role: 'TEACHER',
      },
    })

    if (!teacher) {
      return NextResponse.json(
        { message: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }

    // Créer la classe
    const newClass = await prisma.class.create({
      data: {
        name,
        level,
        year,
        teacherId,
      },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de classe:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 