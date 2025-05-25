import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const gradeSchema = z.object({
  value: z.number().min(0).max(20).optional(),
  type: z.enum(['NORMAL', 'EXAM', 'PROJECT', 'PARTICIPATION']).optional(),
  date: z.string().transform((str) => new Date(str)).optional(),
  comment: z.string().optional(),
})

// GET /api/grades/[id] - Récupérer une note spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const grade = await prisma.grade.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        course: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!grade) {
      return NextResponse.json({ error: 'Note non trouvée' }, { status: 404 })
    }

    return NextResponse.json(grade)
  } catch (error) {
    console.error('Erreur lors de la récupération de la note:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la note' },
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

// PATCH /api/grades/[id] - Modifier une note
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const json = await request.json()
    const body = gradeSchema.parse(json)

    const teacher = await prisma.teacher.findFirst({
      where: {
        user: {
          email: session.user?.email,
        },
      },
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Seuls les professeurs peuvent modifier des notes' },
        { status: 403 }
      )
    }

    const grade = await prisma.grade.findUnique({
      where: { id: params.id },
      include: { teacher: true },
    })

    if (!grade) {
      return NextResponse.json({ error: 'Note non trouvée' }, { status: 404 })
    }

    if (grade.teacherId !== teacher.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez modifier que vos propres notes' },
        { status: 403 }
      )
    }

    const updatedGrade = await prisma.grade.update({
      where: { id: params.id },
      data: body,
      include: {
        student: true,
        course: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    })

    return NextResponse.json(updatedGrade)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la modification de la note:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la note' },
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
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const teacher = await prisma.teacher.findFirst({
      where: {
        user: {
          email: session.user?.email,
        },
      },
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Seuls les professeurs peuvent supprimer des notes' },
        { status: 403 }
      )
    }

    const grade = await prisma.grade.findUnique({
      where: { id: params.id },
      include: { teacher: true },
    })

    if (!grade) {
      return NextResponse.json({ error: 'Note non trouvée' }, { status: 404 })
    }

    if (grade.teacherId !== teacher.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez supprimer que vos propres notes' },
        { status: 403 }
      )
    }

    await prisma.grade.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Note supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la note' },
      { status: 500 }
    )
  }
} 