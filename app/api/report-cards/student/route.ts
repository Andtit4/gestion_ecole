import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/report-cards/student - Récupérer les bulletins d'un élève spécifique
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
    const studentId = searchParams.get('studentId')
    const schoolYear = searchParams.get('schoolYear')
    
    if (!studentId) {
      return NextResponse.json(
        { error: "L'ID de l'élève est requis" },
        { status: 400 }
      )
    }
    
    // Vérifier les permissions d'accès
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      // Pour les étudiants, vérifier que c'est leur propre bulletin
      if (session.user.role === 'STUDENT') {
        const student = await prisma.student.findFirst({
          where: { userId: session.user.id }
        })
        
        if (!student || student.id !== studentId) {
          return NextResponse.json(
            { error: "Vous n'avez pas les permissions nécessaires" },
            { status: 403 }
          )
        }
      }
      
      // Pour les parents, vérifier que c'est le bulletin de leur enfant
      else if (session.user.role === 'PARENT') {
        const parent = await prisma.parent.findFirst({
          where: { userId: session.user.id },
          include: { children: true }
        })
        
        if (!parent || !parent.children.some(child => child.id === studentId)) {
          return NextResponse.json(
            { error: "Vous n'avez pas les permissions nécessaires" },
            { status: 403 }
          )
        }
      }
    }
    
    // Construire la requête avec les filtres
    const where: any = { studentId }
    
    // Filtrer par année scolaire si fournie
    if (schoolYear) {
      where.period = {
        schoolYear
      }
    }
    
    // Récupérer les bulletins de l'élève
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
        { period: { schoolYear: 'desc' } },
        { period: { startDate: 'desc' } },
        { updatedAt: 'desc' }
      ]
    })
    
    return NextResponse.json(reportCards)
  } catch (error) {
    console.error('Erreur lors de la récupération des bulletins de l\'élève:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bulletins' },
      { status: 500 }
    )
  }
} 