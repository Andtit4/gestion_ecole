import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/report-cards/batch - Générer des relevés en masse
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { studentIds, periodId, appreciation } = data

    if (!Array.isArray(studentIds) || studentIds.length === 0 || !periodId) {
      return NextResponse.json(
        { message: 'Données invalides' },
        { status: 400 }
      )
    }

    // Vérifier que tous les élèves existent
    const students = await prisma.student.findMany({
      where: {
        id: {
          in: studentIds,
        },
      },
    })

    if (students.length !== studentIds.length) {
      return NextResponse.json(
        { message: 'Certains élèves n\'existent pas' },
        { status: 400 }
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

    // Générer les relevés pour chaque élève
    const reportCards = await Promise.all(
      studentIds.map(async (studentId) => {
        // Récupérer les notes de l'élève pour la période
        const grades = await prisma.grade.findMany({
          where: {
            studentId,
            date: {
              gte: new Date(periodId).setHours(0, 0, 0, 0),
              lte: new Date(periodId).setHours(23, 59, 59, 999),
            },
          },
          include: {
            course: true,
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
            studentId,
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

// PUT /api/report-cards/batch - Mettre à jour le statut de plusieurs relevés
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { reportCardIds, status } = data

    if (!Array.isArray(reportCardIds) || reportCardIds.length === 0 || !status) {
      return NextResponse.json(
        { message: 'Données invalides' },
        { status: 400 }
      )
    }

    const updatedReportCards = await prisma.reportCard.updateMany({
      where: {
        id: {
          in: reportCardIds,
        },
      },
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

// DELETE /api/report-cards/batch - Supprimer plusieurs relevés
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { reportCardIds } = data

    if (!Array.isArray(reportCardIds) || reportCardIds.length === 0) {
      return NextResponse.json(
        { message: 'Données invalides' },
        { status: 400 }
      )
    }

    const deletedReportCards = await prisma.reportCard.deleteMany({
      where: {
        id: {
          in: reportCardIds,
        },
      },
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