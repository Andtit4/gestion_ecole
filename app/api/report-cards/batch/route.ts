import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/report-cards/batch - Générer des relevés en masse
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est admin ou enseignant
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: "Vous n'avez pas les permissions nécessaires" },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { classId, periodId, appreciation = '', status = 'DRAFT' } = data

    if (!classId || !periodId) {
      return NextResponse.json(
        { error: 'Classe et période sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que la classe existe
    const classInfo = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        students: true
      }
    })

    if (!classInfo) {
      return NextResponse.json(
        { error: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    if (classInfo.students.length === 0) {
      return NextResponse.json(
        { error: 'La classe ne contient aucun élève' },
        { status: 400 }
      )
    }

    // Vérifier que la période existe
    const period = await prisma.period.findUnique({
      where: { id: periodId }
    })

    if (!period) {
      return NextResponse.json(
        { error: 'Période non trouvée' },
        { status: 404 }
      )
    }

    // Récupérer les IDs des élèves de la classe
    const studentIds = classInfo.students.map(student => student.id)

    // Vérifier si des bulletins existent déjà pour certains élèves dans cette période
    const existingReportCards = await prisma.reportcard.findMany({
      where: {
        studentId: { in: studentIds },
        periodId
      },
      select: {
        studentId: true
      }
    })

    const existingStudentIds = existingReportCards.map(rc => rc.studentId)
    const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id))

    if (newStudentIds.length === 0) {
      return NextResponse.json(
        { error: 'Tous les élèves ont déjà un bulletin pour cette période' },
        { status: 409 }
      )
    }

    // Générer les relevés pour chaque élève
    const createdReportCards = await Promise.all(
      newStudentIds.map(async (studentId) => {
        // Récupérer les notes de l'élève pour la période
        const grades = await prisma.grade.findMany({
          where: {
            studentId,
            date: {
              gte: period.startDate,
              lte: period.endDate
            }
          },
          include: {
            course: true
          }
        })

        // Calculer la moyenne pondérée
        let totalWeightedSum = 0
        let totalWeight = 0

        grades.forEach((grade) => {
          const coef = grade.coefficient || 1
          totalWeightedSum += grade.value * coef
          totalWeight += coef
        })

        const average = totalWeight > 0 ? totalWeightedSum / totalWeight : 0

        // Créer le relevé
        return prisma.reportcard.create({
          data: {
            studentId,
            periodId,
            average,
            appreciation,
            status,
            generatedAt: new Date()
          },
          include: {
            student: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            },
            period: true
          }
        })
      })
    )

    return NextResponse.json({
      message: `${createdReportCards.length} bulletins générés avec succès`,
      reportCards: createdReportCards,
      skippedCount: existingStudentIds.length
    })
  } catch (error) {
    console.error('Erreur lors de la génération des relevés:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération des relevés' },
      { status: 500 }
    )
  }
}

// PUT /api/report-cards/batch - Mettre à jour le statut de plusieurs relevés
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est admin ou enseignant
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: "Vous n'avez pas les permissions nécessaires" },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { reportCardIds, status } = data

    if (!Array.isArray(reportCardIds) || reportCardIds.length === 0 || !status) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }

    if (status !== 'DRAFT' && status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Statut invalide. Valeurs acceptées: DRAFT, PUBLISHED' },
        { status: 400 }
      )
    }

    const updatedReportCards = await prisma.reportcard.updateMany({
      where: {
        id: {
          in: reportCardIds
        }
      },
      data: {
        status
      }
    })

    return NextResponse.json({
      message: `${updatedReportCards.count} bulletins mis à jour avec succès`,
      count: updatedReportCards.count
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des relevés:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des relevés' },
      { status: 500 }
    )
  }
}

// DELETE /api/report-cards/batch - Supprimer plusieurs relevés
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est admin ou enseignant
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: "Vous n'avez pas les permissions nécessaires" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reportCardIds = searchParams.get('ids')?.split(',')

    if (!Array.isArray(reportCardIds) || reportCardIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs de bulletins requis (format: ids=id1,id2,id3)' },
        { status: 400 }
      )
    }

    const deletedReportCards = await prisma.reportcard.deleteMany({
      where: {
        id: {
          in: reportCardIds
        }
      }
    })

    return NextResponse.json({
      message: `${deletedReportCards.count} bulletins supprimés avec succès`,
      count: deletedReportCards.count
    })
  } catch (error) {
    console.error('Erreur lors de la suppression des relevés:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression des relevés' },
      { status: 500 }
    )
  }
} 


