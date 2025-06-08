import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const teacherId = searchParams.get('teacherId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    // Construire la requête
    const whereClause: any = {}
    
    if (classId) {
      whereClause.classId = classId
    }
    
    // Pour les enseignants, filtrer par leurs propres évaluations
    if (session.user.role === 'TEACHER') {
      // On doit vérifier que l'enseignant est associé à la classe
      if (classId) {
        const isTeacherOfClass = await prisma.class.findFirst({
          where: {
            id: classId,
            teacherId: session.user.id
          }
        })
        
        if (!isTeacherOfClass) {
          return new NextResponse('Non autorisé', { status: 403 })
        }
      } else {
        // Si pas de classe spécifiée, filtrer par les classes où l'enseignant enseigne
        const teacherClasses = await prisma.class.findMany({
          where: {
            teacherId: session.user.id
          },
          select: {
            id: true
          }
        })
        
        whereClause.classId = {
          in: teacherClasses.map(c => c.id)
        }
      }
    }
    
    // Pour les élèves, montrer seulement les évaluations de leur classe
    if (session.user.role === 'STUDENT') {
      const student = await prisma.student.findFirst({
        where: {
          userId: session.user.id
        },
        select: {
          classId: true
        }
      })
      
      if (!student) {
        return new NextResponse('Profil étudiant non trouvé', { status: 404 })
      }
      
      whereClause.classId = student.classId
    }
    
    // Pour les parents, montrer les évaluations des classes de leurs enfants
    if (session.user.role === 'PARENT') {
      const children = await prisma.student.findMany({
        where: {
          parent: {
            userId: session.user.id
          }
        },
        select: {
          classId: true
        }
      })
      
      if (children.length === 0) {
        return new NextResponse('Aucun enfant trouvé', { status: 404 })
      }
      
      whereClause.classId = {
        in: children.map(c => c.classId)
      }
    }

    const evaluations = await prisma.evaluation.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc'
      },
      take: limit,
      include: {
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        class: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(evaluations)
  } catch (error) {
    console.error('Erreur lors de la récupération des évaluations:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    const data = await request.json()
    const { title, description, date, coefficient, subjectId, classId, maxScore } = data

    if (!title || !date || !subjectId || !classId) {
      return new NextResponse('Données d\'évaluation incomplètes', { status: 400 })
    }

    // Vérifier que l'enseignant a le droit d'ajouter une évaluation pour cette classe
    const isTeacherOfClass = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId: session.user.id
      }
    })

    if (!isTeacherOfClass) {
      return new NextResponse('Vous n\'êtes pas l\'enseignant de cette classe', { status: 403 })
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        title,
        description: description || '',
        date: new Date(date),
        coefficient: coefficient || 1,
        maxScore: maxScore || 20,
        subject: {
          connect: {
            id: subjectId
          }
        },
        class: {
          connect: {
            id: classId
          }
        },
        createdBy: {
          connect: {
            id: session.user.id
          }
        }
      }
    })

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Erreur lors de la création de l\'évaluation:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
} 


