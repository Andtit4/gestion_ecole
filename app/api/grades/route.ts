import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/grades - Récupérer les notes
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const courseId = searchParams.get('courseId')
    const teacherId = searchParams.get('teacherId')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Construire la requête
    const where: any = {}

    if (studentId) {
      where.studentId = studentId
    }

    if (courseId) {
      where.courseId = courseId
    }

    if (teacherId) {
      where.teacherId = teacherId
    }

    if (type) {
      where.type = type
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    // Récupérer les notes
    const grades = await prisma.grade.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
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
      orderBy: [
        { date: 'desc' },
        { student: { class: { name: 'asc' } } },
        { student: { firstName: 'asc' } },
        { student: { lastName: 'asc' } },
      ],
    })

    return NextResponse.json(grades)
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des notes' },
      { status: 500 }
    )
  }
}

// POST /api/grades - Créer une note
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { value, type, date, coefficient, comment, studentId, courseId, teacherId } = data

    // Validation des données
    if (!value || !type || !date || !studentId || !courseId || !teacherId) {
      return NextResponse.json(
        { message: 'Données incomplètes' },
        { status: 400 }
      )
    }

    // Vérifier que l'élève existe
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json(
        { message: 'Élève non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que le cours existe
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json(
        { message: 'Cours non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que le professeur existe
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    })

    if (!teacher) {
      return NextResponse.json(
        { message: 'Professeur non trouvé' },
        { status: 404 }
      )
    }

    // Créer la note
    const grade = await prisma.grade.create({
      data: {
        value,
        type,
        date: new Date(date),
        coefficient: coefficient || 1,
        comment,
        studentId,
        courseId,
        teacherId,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
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
    console.error('Erreur lors de la création de la note:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création de la note' },
      { status: 500 }
    )
  }
}

// PUT /api/grades - Mettre à jour une note
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { id, value, type, date, coefficient, comment } = data

    if (!id) {
      return NextResponse.json(
        { message: 'ID de la note requis' },
        { status: 400 }
      )
    }

    // Vérifier que la note existe
    const existingGrade = await prisma.grade.findUnique({
      where: { id },
    })

    if (!existingGrade) {
      return NextResponse.json(
        { message: 'Note non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour la note
    const grade = await prisma.grade.update({
      where: { id },
      data: {
        value,
        type,
        date: date ? new Date(date) : undefined,
        coefficient,
        comment,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
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
    console.error('Erreur lors de la mise à jour de la note:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la note' },
      { status: 500 }
    )
  }
}

// DELETE /api/grades - Supprimer une note
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID de la note requis' },
        { status: 400 }
      )
    }

    // Vérifier que la note existe
    const grade = await prisma.grade.findUnique({
      where: { id },
    })

    if (!grade) {
      return NextResponse.json(
        { message: 'Note non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer la note
    await prisma.grade.delete({
      where: { id },
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