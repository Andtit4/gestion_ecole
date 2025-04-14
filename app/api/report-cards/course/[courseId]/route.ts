import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/report-cards/course/[courseId] - Récupérer les relevés d'un cours
export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const periodId = searchParams.get('periodId')
    const classId = searchParams.get('classId')
    const studentId = searchParams.get('studentId')
    const status = searchParams.get('status')

    // Vérifier que le cours existe
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return NextResponse.json(
        { message: 'Cours non trouvé' },
        { status: 404 }
      )
    }

    // Construire la requête
    const where = {
      student: {
        grades: {
          some: {
            courseId: params.courseId,
          },
        },
      },
    }

    if (periodId) {
      where['periodId'] = periodId
    }

    if (classId) {
      where['student']['classId'] = classId
    }

    if (studentId) {
      where['studentId'] = studentId
    }

    if (status) {
      where['status'] = status
    }

    // Récupérer les relevés
    const reportCards = await prisma.reportCard.findMany({
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
        period: {
          select: {
            id: true,
            type: true,
            startDate: true,
            endDate: true,
            schoolYear: true,
          },
        },
      },
      orderBy: [
        { student: { class: { name: 'asc' } } },
        { student: { firstName: 'asc' } },
        { student: { lastName: 'asc' } },
        { period: { startDate: 'desc' } },
      ],
    })

    return NextResponse.json(reportCards)
  } catch (error) {
    console.error('Erreur lors de la récupération des relevés:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des relevés' },
      { status: 500 }
    )
  }
}

// POST /api/report-cards/course/[courseId] - Générer des relevés pour un cours
export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { classId, periodId, appreciation } = data

    if (!classId || !periodId) {
      return NextResponse.json(
        { message: 'Classe et période requises' },
        { status: 400 }
      )
    }

    // Vérifier que le cours existe
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return NextResponse.json(
        { message: 'Cours non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que la classe existe
    const classExists = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!classExists) {
      return NextResponse.json(
        { message: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que la période existe
    const period = await prisma.period.findUnique({
      where: { id: periodId },
    })

    if (!period) {
      return NextResponse.json(
        { message: 'Période non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si des relevés existent déjà
    const existingReportCards = await prisma.reportCard.findMany({
      where: {
        periodId,
        student: {
          classId,
          grades: {
            some: {
              courseId: params.courseId,
            },
          },
        },
      },
    })

    if (existingReportCards.length > 0) {
      return NextResponse.json(
        { message: 'Des relevés existent déjà pour cette période' },
        { status: 400 }
      )
    }

    // Générer les relevés pour chaque élève de la classe
    const reportCards = await Promise.all(
      classExists.students.map(async (student) => {
        // Récupérer les notes de l'élève pour la période et le cours
        const grades = await prisma.grade.findMany({
          where: {
            studentId: student.id,
            courseId: params.courseId,
            date: {
              gte: new Date(periodId).setHours(0, 0, 0, 0),
              lte: new Date(periodId).setHours(23, 59, 59, 999),
            },
          },
        })

        // Calculer la moyenne pondérée
        let totalWeightedSum = 0
        let totalWeight = 0

        grades.forEach((grade) => {
          totalWeightedSum += grade.value * grade.coefficient
          totalWeight += grade.coefficient
        })

        const average = totalWeight > 0 ? totalWeightedSum / totalWeight : 0

        // Créer le relevé
        return prisma.reportCard.create({
          data: {
            studentId: student.id,
            periodId,
            average,
            appreciation,
            status: 'DRAFT',
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
            period: {
              select: {
                id: true,
                type: true,
                startDate: true,
                endDate: true,
                schoolYear: true,
              },
            },
          },
        })
      })
    )

    return NextResponse.json(reportCards)
  } catch (error) {
    console.error('Erreur lors de la génération des relevés:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la génération des relevés' },
      { status: 500 }
    )
  }
}

// PUT /api/report-cards/course/[courseId] - Mettre à jour le statut des relevés d'un cours
export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { classId, periodId, status } = data

    if (!status) {
      return NextResponse.json(
        { message: 'Statut requis' },
        { status: 400 }
      )
    }

    // Vérifier que le cours existe
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return NextResponse.json(
        { message: 'Cours non trouvé' },
        { status: 404 }
      )
    }

    // Construire la requête
    const where = {
      student: {
        grades: {
          some: {
            courseId: params.courseId,
          },
        },
      },
    }

    if (classId) {
      where['student']['classId'] = classId
    }

    if (periodId) {
      where['periodId'] = periodId
    }

    // Mettre à jour les relevés
    const updatedReportCards = await prisma.reportCard.updateMany({
      where,
      data: {
        status,
      },
    })

    return NextResponse.json(updatedReportCards)
  } catch (error) {
    console.error('Erreur lors de la mise à jour des relevés:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour des relevés' },
      { status: 500 }
    )
  }
}

// DELETE /api/report-cards/course/[courseId] - Supprimer les relevés d'un cours
export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const periodId = searchParams.get('periodId')

    // Vérifier que le cours existe
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return NextResponse.json(
        { message: 'Cours non trouvé' },
        { status: 404 }
      )
    }

    // Construire la requête
    const where = {
      student: {
        grades: {
          some: {
            courseId: params.courseId,
          },
        },
      },
    }

    if (classId) {
      where['student']['classId'] = classId
    }

    if (periodId) {
      where['periodId'] = periodId
    }

    // Supprimer les relevés
    const deletedReportCards = await prisma.reportCard.deleteMany({
      where,
    })

    return NextResponse.json(deletedReportCards)
  } catch (error) {
    console.error('Erreur lors de la suppression des relevés:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression des relevés' },
      { status: 500 }
    )
  }
} 