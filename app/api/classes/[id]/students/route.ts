import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    // Attendre les paramètres avant d'accéder à leurs propriétés
    const resolvedParams = await params
    const classId = resolvedParams.id

    // Vérifier que la classe existe
    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    })

    if (!classExists) {
      return new NextResponse('Classe non trouvée', { status: 404 })
    }

    // Récupérer les élèves de la classe
    const students = await prisma.student.findMany({
      where: {
        classId
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
} 