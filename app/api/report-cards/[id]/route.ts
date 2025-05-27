import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/report-cards/[id] - Récupérer un relevé spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer l'ID du bulletin depuis les paramètres de route
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID du bulletin manquant' },
        { status: 400 }
      );
    }
    
    // Essayer de récupérer le bulletin avec ses relations
    const reportCard = await prisma.reportcard.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: true,
            class: true
          }
        },
        period: true
      }
    });
    
    // Si le bulletin n'existe pas, renvoyer une 404
    if (!reportCard) {
      return NextResponse.json(
        { message: 'Bulletin non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier l'authentification et les autorisations si nécessaire
    // Désactivé pour le débogage, mais à activer en production
    /*
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    // Vérifier si l'utilisateur a accès à ce bulletin
    // Les admins et les enseignants peuvent voir tous les bulletins
    // Les élèves ne peuvent voir que leurs propres bulletins
    if (session.user.role === 'STUDENT' && 
        session.user.studentId !== reportCard.studentId) {
      return NextResponse.json(
        { message: 'Accès refusé' },
        { status: 403 }
      );
    }
    */
    
    // Renvoyer le bulletin
    return NextResponse.json(reportCard);
  } catch (error) {
    console.error('Erreur lors de la récupération du bulletin:', error);
    
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du bulletin' },
      { status: 500 }
    );
  }
}

// PUT /api/report-cards/[id] - Modifier un relevé
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { studentId, periodId, appreciation, status } = data

    // Récupérer toutes les notes de l'élève pour la période
    const grades = await prisma.grade.findMany({
      where: {
        studentId,
        date: {
          gte: new Date(periodId).setHours(0, 0, 0, 0),
          lte: new Date(periodId).setHours(23, 59, 59, 999),
        },
      },
      include: {
        course: true,
      },
    })

    // Calculer la moyenne pondérée
    let totalWeightedSum = 0
    let totalWeight = 0

    grades.forEach((grade) => {
      totalWeightedSum += grade.value * grade.coefficient
      totalWeight += grade.coefficient
    })

    const average = totalWeight > 0 ? totalWeightedSum / totalWeight : 0

    const reportCard = await prisma.reportCard.update({
      where: { id: params.id },
      data: {
        studentId,
        periodId,
        average,
        appreciation,
        status,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        period: {
          select: {
            id: true,
            type: true,
            startDate: true,
            endDate: true,
            schoolYear: true,
          },
        },
      },
    })

    return NextResponse.json(reportCard)
  } catch (error) {
    console.error('Erreur lors de la modification du relevé:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la modification du relevé' },
      { status: 500 }
    )
  }
}

// DELETE /api/report-cards/[id] - Supprimer un relevé
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    await prisma.reportCard.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Relevé supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du relevé:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du relevé' },
      { status: 500 }
    )
  }
} 