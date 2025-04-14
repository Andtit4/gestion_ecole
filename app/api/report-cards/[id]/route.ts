import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/report-cards/[id] - Récupérer un relevé spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const reportCard = await prisma.reportCard.findUnique({
      where: { id: params.id },
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

    if (!reportCard) {
      return NextResponse.json(
        { message: 'Relevé non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(reportCard)
  } catch (error) {
    console.error('Erreur lors de la récupération du relevé:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du relevé' },
      { status: 500 }
    )
  }
}

// PUT /api/report-cards/[id] - Modifier un relevé
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
    const { studentId, periodId, appreciation, status } = data

    // Récupérer toutes les notes de l'élève pour la période
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

    const reportCard = await prisma.reportCard.update({
      where: { id: params.id },
      data: {
        studentId,
        periodId,
        average,
        appreciation,
        status,
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

    return NextResponse.json(reportCard)
  } catch (error) {
    console.error('Erreur lors de la modification du relevé:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la modification du relevé' },
      { status: 500 }
    )
  }
}

// DELETE /api/report-cards/[id] - Supprimer un relevé
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    await prisma.reportCard.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Relevé supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du relevé:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du relevé' },
      { status: 500 }
    )
  }
} 