import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 }
      )
    }

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url)
    const periodId = searchParams.get('periodId')
    const classId = searchParams.get('classId')
    
    // Construire la condition where pour filtrer les élèves
    const whereStudent: any = {}
    
    // Filtrer par classe si spécifiée
    if (classId) {
      whereStudent.classId = classId
    }
    
    // Construire la condition where pour filtrer les notes
    const whereGrades: any = {}
    
    // Filtrer par période si spécifiée
    if (periodId) {
      const period = await prisma.period.findUnique({
        where: { id: periodId },
        select: { startDate: true, endDate: true }
      })
      
      if (period) {
        whereGrades.date = {
          gte: period.startDate,
          lte: period.endDate
        }
      }
    }
    
    // Récupérer les élèves qui ont des notes
    const studentsWithGrades = await prisma.student.findMany({
      where: {
        ...whereStudent,
        grades: {
          some: whereGrades
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        _count: {
          select: {
            grades: true
          }
        }
      },
      orderBy: [
        { user: { lastName: 'asc' } },
        { user: { firstName: 'asc' } }
      ]
    })
    
    return NextResponse.json(studentsWithGrades)
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves avec notes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des élèves' },
      { status: 500 }
    )
  }
} 


