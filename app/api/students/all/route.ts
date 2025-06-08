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
    const classId = searchParams.get('classId')
    
    console.log('API students/all - classId:', classId || 'tous')
    
    // Construire la condition where pour filtrer les élèves
    const whereStudent: any = {}
    
    // Filtrer par classe si spécifiée
    if (classId) {
      whereStudent.classId = classId
    }
    
    // D'abord, comptons le nombre total d'élèves pour vérifier
    const totalStudents = await prisma.student.count()
    console.log('Nombre total d\'élèves dans la base de données:', totalStudents)
    
    // Récupérer tous les élèves
    const students = await prisma.student.findMany({
      where: whereStudent,
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
            grades: true,
            reportCards: true
          }
        }
      },
      orderBy: [
        { user: { lastName: 'asc' } },
        { user: { firstName: 'asc' } }
      ]
    })
    
    console.log('Nombre d\'élèves récupérés:', students.length)
    
    return NextResponse.json(students)
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des élèves' },
      { status: 500 }
    )
  }
} 


