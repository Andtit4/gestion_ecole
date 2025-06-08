import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/teachers/[id] - Récupérer un enseignant spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const id = params.id

    // Rechercher l'enseignant par ID
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }

    // Formater la réponse
    const formattedTeacher = {
      id: teacher.id,
      userId: teacher.userId,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email
    }

    return NextResponse.json(formattedTeacher)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'enseignant:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'enseignant', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 