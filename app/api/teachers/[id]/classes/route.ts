import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/teachers/[id]/classes - Récupérer les classes d'un enseignant
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

    const teacherId = params.id

    // Vérifier si l'enseignant existe
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les classes de l'enseignant
    const classes = await prisma.Renamedclass.findMany({
      where: { teacherId },
      select: {
        id: true,
        name: true,
        level: true,
        year: true
      }
    })

    return NextResponse.json(classes)
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des classes', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 