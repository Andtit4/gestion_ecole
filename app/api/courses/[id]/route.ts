import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/courses/[id] - Récupérer un cours spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: { id: params.id },
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

    if (!course) {
      return NextResponse.json(
        { message: 'Cours non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du cours' },
      { status: 500 }
    )
  }
}

// PUT /api/courses/[id] - Modifier un cours
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { name, coefficient, level, description, teacherId } = data

    const course = await prisma.course.update({
      where: { id: params.id },
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
    console.error('Erreur lors de la modification du cours:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la modification du cours' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id] - Supprimer un cours
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    await prisma.course.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Cours supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du cours' },
      { status: 500 }
    )
  }
} 