import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/report-cards/class - Récupérer les bulletins d'une classe spécifique
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
    
    // Seuls les admins et les enseignants peuvent accéder aux bulletins par classe
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: "Vous n'avez pas les permissions nécessaires" },
        { status: 403 }
      )
    }
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')
    const periodId = searchParams.get('periodId')
    const status = searchParams.get('status')
    
    if (!classId) {
      return NextResponse.json(
        { error: "L'ID de la classe est requis" },
        { status: 400 }
      )
    }
    
    // Construire la requête avec les filtres
    const where: any = {
      student: {
        classId
      }
    }
    
    // Filtrer par période si fournie
    if (periodId) {
      where.periodId = periodId
    }
    
    // Filtrer par statut si fourni
    if (status) {
      where.status = status
    }
    
    // Récupérer les bulletins de la classe
    const reportCards = await prisma.reportcard.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            class: {
              select: {
                name: true
              }
            }
          }
        },
        period: true
      },
      orderBy: [
        { student: { user: { lastName: 'asc' } } },
        { student: { user: { firstName: 'asc' } } }
      ]
    })
    
    // Récupérer les informations de la classe
    const classInfo = await prisma.Renamedclass.findUnique({
      where: { id: classId },
      select: {
        name: true,
        level: true,
        _count: {
          select: {
            students: true
          }
        }
      }
    })
    
    if (!classInfo) {
      return NextResponse.json(
        { error: "Classe non trouvée" },
        { status: 404 }
      )
    }
    
    // Calculer des statistiques sur les bulletins
    const stats = {
      totalStudents: classInfo._count.students,
      totalReportCards: reportCards.length,
      averageClassAverage: reportCards.length > 0 
        ? reportCards.reduce((sum, card) => sum + card.average, 0) / reportCards.length 
        : 0,
      highestAverage: reportCards.length > 0
        ? Math.max(...reportCards.map(card => card.average))
        : 0,
      lowestAverage: reportCards.length > 0
        ? Math.min(...reportCards.map(card => card.average))
        : 0
    }
    
    return NextResponse.json({
      className: classInfo.name,
      classLevel: classInfo.level,
      stats,
      reportCards
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des bulletins de la classe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bulletins' },
      { status: 500 }
    )
  }
} 