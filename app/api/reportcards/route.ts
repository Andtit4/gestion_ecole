import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation pour les bulletins
const reportCardSchema = z.object({
  studentId: z.string(),
  periodId: z.string(),
  average: z.number().min(0).max(20),
  appreciation: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
})

// GET: Récupérer tous les bulletins ou un bulletin spécifique
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const studentId = searchParams.get('studentId')
    const periodId = searchParams.get('periodId')

    // Récupérer un bulletin spécifique par ID
    if (id) {
      const reportCard = await prisma.reportcard.findUnique({
        where: { id },
        include: {
          student: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                }
              },
              class: {
                select: {
                  id: true,
                  name: true,
                }
              }
            }
          },
          period: true
        }
      })

      if (!reportCard) {
        return NextResponse.json(
          { error: 'Bulletin non trouvé' },
          { status: 404 }
        )
      }

      return NextResponse.json(reportCard)
    }

    // Construire la requête en fonction du rôle de l'utilisateur
    let query: any = {}
    
    if (session.user.role === 'STUDENT') {
      // Les étudiants ne voient que leurs bulletins
      const student = await prisma.student.findFirst({
        where: { userId: session.user.id }
      })
      
      if (!student) {
        return NextResponse.json(
          { error: 'Profil étudiant non trouvé' },
          { status: 404 }
        )
      }
      
      query.where = { studentId: student.id }
    } 
    else if (session.user.role === 'PARENT') {
      // Les parents ne voient que les bulletins de leurs enfants
      const parent = await prisma.parent.findFirst({
        where: { userId: session.user.id },
        include: { children: true }
      })
      
      if (!parent || parent.children.length === 0) {
        return NextResponse.json(
          { error: 'Aucun enfant associé à ce compte parent' },
          { status: 404 }
        )
      }
      
      const childrenIds = parent.children.map(child => child.id)
      query.where = { studentId: { in: childrenIds } }
    }
    else if (session.user.role === 'TEACHER') {
      // Les enseignants voient les bulletins de leurs classes
      const teacher = await prisma.teacher.findFirst({
        where: { userId: session.user.id },
        include: { classes: true }
      })
      
      if (!teacher) {
        return NextResponse.json(
          { error: 'Profil enseignant non trouvé' },
          { status: 404 }
        )
      }
      
      if (teacher.classes.length === 0) {
        return NextResponse.json([])
      }
      
      const classIds = teacher.classes.map(c => c.id)
      
      query.where = {
        student: {
          classId: { in: classIds }
        }
      }
    }

    // Filtrer par étudiant si spécifié
    if (studentId) {
      query.where = {
        ...query.where,
        studentId
      }
    }

    // Filtrer par période si spécifiée
    if (periodId) {
      query.where = {
        ...query.where,
        periodId
      }
    }

    // Inclure les relations nécessaires
    query.include = {
      student: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            }
          },
          class: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      },
      period: true
    }

    // Récupérer tous les bulletins selon les filtres
    const reportCards = await prisma.reportcard.findMany(query)
    return NextResponse.json(reportCards)

  } catch (error) {
    console.error('Erreur lors de la récupération des bulletins:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST: Créer un nouveau bulletin
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 }
      )
    }

    // Vérifier les permissions (seuls les admins et enseignants peuvent créer des bulletins)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Vous n\'avez pas les permissions nécessaires' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Validation des données
    if (!data.studentId || !data.periodId) {
      return NextResponse.json(
        { error: 'Les champs étudiant et période sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: data.studentId }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Étudiant non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si la période existe
    const period = await prisma.period.findUnique({
      where: { id: data.periodId }
    })

    if (!period) {
      return NextResponse.json(
        { error: 'Période non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si un bulletin existe déjà pour cet étudiant et cette période
    const existingReportCard = await prisma.reportcard.findFirst({
      where: {
        studentId: data.studentId,
        periodId: data.periodId
      }
    })

    if (existingReportCard) {
      return NextResponse.json(
        { error: 'Un bulletin existe déjà pour cet étudiant et cette période' },
        { status: 409 }
      )
    }

    // Créer le bulletin
    const reportCard = await prisma.reportcard.create({
      data: {
        studentId: data.studentId,
        periodId: data.periodId,
        average: data.average || 0,
        appreciation: data.appreciation || null,
        status: data.status || 'DRAFT',
        generatedAt: new Date().toISOString(),
      }
    })

    return NextResponse.json(reportCard, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création du bulletin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PATCH: Mettre à jour un bulletin existant
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 }
      )
    }

    // Vérifier les permissions (seuls les admins et enseignants peuvent modifier des bulletins)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Vous n\'avez pas les permissions nécessaires' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'L\'ID du bulletin est requis' },
        { status: 400 }
      )
    }

    // Vérifier si le bulletin existe
    const existingReportCard = await prisma.reportcard.findUnique({
      where: { id: data.id }
    })

    if (!existingReportCard) {
      return NextResponse.json(
        { error: 'Bulletin non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour le bulletin
    const updatedReportCard = await prisma.reportcard.update({
      where: { id: data.id },
      data: {
        average: data.average !== undefined ? data.average : existingReportCard.average,
        appreciation: data.appreciation !== undefined ? data.appreciation : existingReportCard.appreciation,
        status: data.status || existingReportCard.status,
      }
    })

    return NextResponse.json(updatedReportCard)

  } catch (error) {
    console.error('Erreur lors de la mise à jour du bulletin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE: Supprimer un bulletin
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 }
      )
    }

    // Vérifier les permissions (seuls les admins peuvent supprimer des bulletins)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Vous n\'avez pas les permissions nécessaires' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID du bulletin est requis' },
        { status: 400 }
      )
    }

    // Vérifier si le bulletin existe
    const existingReportCard = await prisma.reportcard.findUnique({
      where: { id }
    })

    if (!existingReportCard) {
      return NextResponse.json(
        { error: 'Bulletin non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le bulletin
    await prisma.reportcard.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur lors de la suppression du bulletin:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 


