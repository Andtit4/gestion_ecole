import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation pour les bulletins
const reportCardSchema = z.object({
  studentId: z.string().min(1, { message: "L'ID de l'élève est requis" }),
  periodId: z.string().min(1, { message: "L'ID de la période est requis" }),
  average: z.number().min(0).max(20, { message: "La moyenne doit être entre 0 et 20" }),
  appreciation: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED'], {
    required_error: "Le statut est requis",
  }),
})

// GET /api/report-cards - Récupérer tous les bulletins avec filtres optionnels
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/report-cards - Début de la requête');
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    const periodId = searchParams.get('periodId')
    const status = searchParams.get('status')
    
    console.log('Paramètres de recherche:', { studentId, periodId, status });

    // Construire la requête avec les filtres
    const where: any = {}
    
    if (studentId) {
      where.studentId = studentId
    }
    
    if (periodId) {
      where.periodId = periodId
    }
    
    if (status) {
      where.status = status
    }
    
    console.log('Requête Prisma - where:', JSON.stringify(where, null, 2));

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
        { updatedAt: 'desc' }
      ]
    })
    
    console.log(`GET /api/report-cards - ${reportCards.length} bulletins trouvés`);
    return NextResponse.json(reportCards)
  } catch (error) {
    console.error('Erreur GET /api/report-cards :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bulletins' },
      { status: 500 }
    )
  }
}

// POST /api/report-cards - Créer un nouveau bulletin
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/report-cards - Début de la requête');
    
    const body = await req.json()
    console.log('Données reçues:', body);
    
    const { studentId, periodId, average, appreciation, status } = body

    // Validation des données
    if (!studentId || !periodId || average === undefined || !status) {
      return NextResponse.json(
        { error: 'Élève, période, moyenne et statut sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'élève existe
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Élève non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si la période existe
    const period = await prisma.period.findUnique({
      where: { id: periodId }
    })

    if (!period) {
      return NextResponse.json(
        { error: 'Période non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si un bulletin existe déjà pour cet élève et cette période
    const existingReportCard = await prisma.reportcard.findFirst({
      where: {
        studentId,
        periodId
      }
    })

    if (existingReportCard) {
      return NextResponse.json(
        { error: 'Un bulletin existe déjà pour cet élève et cette période' },
        { status: 409 }
      )
    }

    // Créer le bulletin
    const newReportCard = await prisma.reportcard.create({
      data: {
        studentId,
        periodId,
        average: parseFloat(average.toString()),
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
    
    console.log('Bulletin créé avec succès:', newReportCard.id);
    return NextResponse.json(newReportCard, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/report-cards :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du bulletin' },
      { status: 500 }
    )
  }
}

// PATCH /api/report-cards - Mettre à jour un bulletin existant
export async function PATCH(req: NextRequest) {
  try {
    console.log('PATCH /api/report-cards - Début de la requête');
    
    const body = await req.json()
    console.log('Données reçues:', body);
    
    const { id, average, appreciation, status } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du bulletin requis' },
        { status: 400 }
      )
    }

    // Vérifier si le bulletin existe
    const reportCard = await prisma.reportcard.findUnique({
      where: { id }
    })
    
    if (!reportCard) {
      return NextResponse.json(
        { error: 'Bulletin non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour le bulletin
    const updatedReportCard = await prisma.reportcard.update({
      where: { id },
      data: {
        average: average !== undefined ? parseFloat(average.toString()) : undefined,
        appreciation: appreciation !== undefined ? appreciation : undefined,
        status: status !== undefined ? status : undefined,
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
    
    console.log('Bulletin mis à jour avec succès:', updatedReportCard.id);
    return NextResponse.json(updatedReportCard)
  } catch (error) {
    console.error('Erreur PATCH /api/report-cards :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du bulletin' },
      { status: 500 }
    )
  }
}

// DELETE /api/report-cards - Supprimer un bulletin
export async function DELETE(req: NextRequest) {
  try {
    console.log('DELETE /api/report-cards - Début de la requête');
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du bulletin requis' },
        { status: 400 }
      )
    }

    // Vérifier si le bulletin existe
    const reportCard = await prisma.reportcard.findUnique({
      where: { id }
    })
    
    if (!reportCard) {
      return NextResponse.json(
        { error: 'Bulletin non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le bulletin
    await prisma.reportcard.delete({
      where: { id }
    })
    
    console.log('Bulletin supprimé avec succès:', id);
    return NextResponse.json({ message: 'Bulletin supprimé avec succès' })
  } catch (error) {
    console.error('Erreur DELETE /api/report-cards :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du bulletin' },
      { status: 500 }
    )
  }
} 


