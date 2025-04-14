import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/report-cards - Récupérer les relevés de notes avec filtres optionnels
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const periodId = searchParams.get('periodId')

    const where = {
      ...(studentId && { studentId }),
      ...(periodId && { periodId }),
    }

    const reportCards = await prisma.reportCard.findMany({
      where,
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
      orderBy: {
        generatedAt: 'desc',
      },
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

// POST /api/report-cards - Créer un nouveau relevé de notes
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { studentId, periodId, appreciation } = data

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

    const reportCard = await prisma.reportCard.create({
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

    return NextResponse.json(reportCard)
  } catch (error) {
    console.error('Erreur lors de la création du relevé:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création du relevé' },
      { status: 500 }
    )
  }
} 