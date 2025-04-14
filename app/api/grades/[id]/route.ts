import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/grades/[id] - Récupérer une note spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const grade = await prisma.grade.findUnique({
      where: { id: params.id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!grade) {
      return NextResponse.json(
        { message: 'Note non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(grade)
  } catch (error) {
    console.error('Erreur lors de la récupération de la note:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de la note' },
      { status: 500 }
    )
  }
}

// PUT /api/grades/[id] - Modifier une note
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
    const {
      value,
      type,
      date,
      coefficient,
      comment,
      studentId,
      courseId,
    } = data

    // Récupérer le professeur associé au cours
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { teacherId: true },
    })

    if (!course) {
      return NextResponse.json(
        { message: 'Cours non trouvé' },
        { status: 404 }
      )
    }

    const grade = await prisma.grade.update({
      where: { id: params.id },
      data: {
        value: parseFloat(value),
        type,
        date: new Date(date),
        coefficient: parseFloat(coefficient),
        comment,
        studentId,
        courseId,
        teacherId: course.teacherId,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json(grade)
  } catch (error) {
    console.error('Erreur lors de la modification de la note:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la modification de la note' },
      { status: 500 }
    )
  }
}

// DELETE /api/grades/[id] - Supprimer une note
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    await prisma.grade.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Note supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la note' },
      { status: 500 }
    )
  }
} 