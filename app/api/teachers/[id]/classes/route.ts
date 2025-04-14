import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/teachers/[id]/classes - Récupérer les classes d'un enseignant
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Attendre les paramètres avant d'accéder à leurs propriétés
    const resolvedParams = await params
    const teacherId = resolvedParams.id

    // Vérifier que l'enseignant existe
    const teacher = await prisma.user.findUnique({
      where: { 
        id: teacherId,
        role: 'TEACHER'
      }
    })

    if (!teacher) {
      return NextResponse.json(
        { message: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les classes dont cet enseignant est responsable
    const classes = await prisma.class.findMany({
      where: { teacherId },
      select: {
        id: true,
        name: true,
        level: true,
        year: true,
        _count: {
          select: {
            students: true
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { name: 'asc' }
      ]
    })

    // Formater les résultats pour inclure le nombre d'élèves
    const formattedClasses = classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      level: cls.level,
      year: cls.year,
      studentsCount: cls._count.students
    }))

    return NextResponse.json(formattedClasses)
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 