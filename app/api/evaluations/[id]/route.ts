import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    // Attendre les paramètres avant d'accéder à leurs propriétés
    const resolvedParams = await params
    const id = resolvedParams.id

    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id
      },
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

    if (!evaluation) {
      return new NextResponse('Évaluation non trouvée', { status: 404 })
    }

    // Vérifier l'accès selon le rôle
    if (session.user.role === 'TEACHER') {
      // Vérifier que l'enseignant est associé à la classe
      const isTeacherOfClass = await prisma.class.findFirst({
        where: {
          id: evaluation.classId,
          teacherId: session.user.id
        }
      })

      if (!isTeacherOfClass) {
        return new NextResponse('Non autorisé', { status: 403 })
      }
    } else if (session.user.role === 'STUDENT') {
      // Vérifier que l'étudiant est dans la classe
      const student = await prisma.student.findFirst({
        where: {
          userId: session.user.id,
          classId: evaluation.classId
        }
      })

      if (!student) {
        return new NextResponse('Non autorisé', { status: 403 })
      }
    } else if (session.user.role === 'PARENT') {
      // Vérifier que l'enfant du parent est dans la classe
      const hasChildInClass = await prisma.student.findFirst({
        where: {
          parent: {
            userId: session.user.id
          },
          classId: evaluation.classId
        }
      })

      if (!hasChildInClass) {
        return new NextResponse('Non autorisé', { status: 403 })
      }
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'évaluation:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    // Attendre les paramètres avant d'accéder à leurs propriétés
    const resolvedParams = await params
    const id = resolvedParams.id

    const data = await request.json()
    const { title, description, date, coefficient, subjectId, classId, maxScore } = data

    if (!title || !date || !subjectId || !classId) {
      return new NextResponse('Données d\'évaluation incomplètes', { status: 400 })
    }

    // Vérifier que l'évaluation existe
    const existingEvaluation = await prisma.evaluation.findUnique({
      where: {
        id
      },
      include: {
        class: true
      }
    })

    if (!existingEvaluation) {
      return new NextResponse('Évaluation non trouvée', { status: 404 })
    }

    // Vérifier que l'enseignant a le droit de modifier cette évaluation
    const isTeacherOfClass = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId: session.user.id
      }
    })

    if (!isTeacherOfClass) {
      return new NextResponse('Vous n\'êtes pas l\'enseignant de cette classe', { status: 403 })
    }

    const updatedEvaluation = await prisma.evaluation.update({
      where: {
        id
      },
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
        }
      }
    })

    return NextResponse.json(updatedEvaluation)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'évaluation:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'TEACHER') {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    // Attendre les paramètres avant d'accéder à leurs propriétés
    const resolvedParams = await params
    const id = resolvedParams.id

    // Vérifier que l'évaluation existe
    const existingEvaluation = await prisma.evaluation.findUnique({
      where: {
        id
      },
      include: {
        class: true
      }
    })

    if (!existingEvaluation) {
      return new NextResponse('Évaluation non trouvée', { status: 404 })
    }

    // Vérifier que l'enseignant a le droit de supprimer cette évaluation
    const isTeacherOfClass = await prisma.class.findFirst({
      where: {
        id: existingEvaluation.classId,
        teacherId: session.user.id
      }
    })

    if (!isTeacherOfClass) {
      return new NextResponse('Vous n\'êtes pas l\'enseignant de cette classe', { status: 403 })
    }

    // Supprimer d'abord les notes associées
    await prisma.grade.deleteMany({
      where: {
        evaluationId: id
      }
    })

    // Puis supprimer l'évaluation
    await prisma.evaluation.delete({
      where: {
        id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'évaluation:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
} 