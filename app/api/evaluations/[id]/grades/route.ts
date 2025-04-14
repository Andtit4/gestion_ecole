import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
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

    // Vérifier que l'évaluation existe
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id
      },
      include: {
        class: true
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
      // Les étudiants peuvent voir uniquement leurs propres notes
      const student = await prisma.student.findFirst({
        where: {
          userId: session.user.id,
          classId: evaluation.classId
        }
      })

      if (!student) {
        return new NextResponse('Non autorisé', { status: 403 })
      }

      const grades = await prisma.grade.findMany({
        where: {
          evaluationId: id,
          studentId: student.id
        }
      })

      return NextResponse.json(grades)
    } else if (session.user.role === 'PARENT') {
      // Les parents peuvent voir uniquement les notes de leurs enfants
      const children = await prisma.student.findMany({
        where: {
          parent: {
            userId: session.user.id
          },
          classId: evaluation.classId
        },
        select: {
          id: true
        }
      })

      if (children.length === 0) {
        return new NextResponse('Non autorisé', { status: 403 })
      }

      const grades = await prisma.grade.findMany({
        where: {
          evaluationId: id,
          studentId: {
            in: children.map(c => c.id)
          }
        },
        include: {
          student: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      return NextResponse.json(grades)
    }

    // Pour les administrateurs et les enseignants, récupérer toutes les notes
    const grades = await prisma.grade.findMany({
      where: {
        evaluationId: id
      },
      include: {
        student: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(grades)
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
}

export async function POST(
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
    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id
      }
    })

    if (!evaluation) {
      return new NextResponse('Évaluation non trouvée', { status: 404 })
    }

    // Vérifier que l'enseignant est associé à la classe
    const isTeacherOfClass = await prisma.class.findFirst({
      where: {
        id: evaluation.classId,
        teacherId: session.user.id
      }
    })

    if (!isTeacherOfClass) {
      return new NextResponse('Vous n\'êtes pas l\'enseignant de cette classe', { status: 403 })
    }

    const { grades } = await request.json()

    if (!Array.isArray(grades)) {
      return new NextResponse('Format de données invalide', { status: 400 })
    }

    // Traiter chaque note
    const results = await Promise.all(
      grades.map(async (grade: any) => {
        // Vérifier que la note est comprise entre 0 et la note maximale
        if (grade.value < 0 || grade.value > evaluation.maxScore) {
          throw new Error(`La note doit être comprise entre 0 et ${evaluation.maxScore}`)
        }

        // Vérifier que l'étudiant existe et est dans la classe
        const student = await prisma.student.findFirst({
          where: {
            id: grade.studentId,
            classId: evaluation.classId
          }
        })

        if (!student) {
          throw new Error(`Étudiant non trouvé ou n'appartient pas à la classe`)
        }

        // Créer ou mettre à jour la note
        if (grade.id) {
          // Mettre à jour une note existante
          return prisma.grade.update({
            where: {
              id: grade.id
            },
            data: {
              value: grade.value,
              comment: grade.comment || ''
            }
          })
        } else {
          // Créer une nouvelle note
          return prisma.grade.create({
            data: {
              value: grade.value,
              comment: grade.comment || '',
              student: {
                connect: {
                  id: grade.studentId
                }
              },
              evaluation: {
                connect: {
                  id
                }
              }
            }
          })
        }
      })
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des notes:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Erreur serveur',
      { status: 500 }
    )
  }
} 