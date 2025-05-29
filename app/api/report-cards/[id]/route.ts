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
            class: true,
            // Ajouter les factures de l'étudiant pour vérifier son statut financier
            invoices: {
              where: {
                status: { in: ['PENDING', 'PARTIAL', 'LATE'] }
              },
              select: {
                id: true,
                status: true,
                dueDate: true,
                totalAmount: true,
                paidAmount: true,
              }
            }
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
    
    // Vérifier l'authentification et les autorisations
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
    // Les parents peuvent voir les bulletins de leurs enfants
    const userHasAccess = await checkUserAccess(session, reportCard);
    
    if (!userHasAccess) {
      return NextResponse.json(
        { message: 'Accès refusé' },
        { status: 403 }
      );
    }
    
    // Pour les rôles autres que ADMIN, masquer certaines informations si le statut financier est en retard
    let maskedReportCard = reportCard;
    
    if (session.user.role !== 'ADMIN' && reportCard.financialStatus === 'LATE') {
      // Masquer les détails du bulletin mais informer que le paiement est requis
      maskedReportCard = {
        ...reportCard,
        // Masquer les informations sensibles
        average: null,
        appreciation: "Paiement des frais de scolarité requis pour accéder au bulletin complet.",
        // Garder les informations d'identification et le statut financier
        id: reportCard.id,
        studentId: reportCard.studentId,
        periodId: reportCard.periodId,
        status: reportCard.status,
        financialStatus: reportCard.financialStatus,
        student: reportCard.student,
        period: reportCard.period,
        // Inclure les factures en attente pour information
        pendingInvoices: reportCard.student.invoices,
      };
    }
    
    // Renvoyer le bulletin (complet ou masqué selon le statut financier)
    return NextResponse.json(maskedReportCard);
  } catch (error) {
    console.error('Erreur lors de la récupération du bulletin:', error);
    
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du bulletin' },
      { status: 500 }
    );
  }
}

// Fonction pour vérifier si l'utilisateur a accès au bulletin
async function checkUserAccess(session: any, reportCard: any): Promise<boolean> {
  const { role, id } = session.user;
  
  // Les administrateurs et enseignants ont accès à tous les bulletins
  if (role === 'ADMIN' || role === 'TEACHER') {
    return true;
  }
  
  // Les étudiants ne peuvent voir que leurs propres bulletins
  if (role === 'STUDENT') {
    const student = await prisma.student.findUnique({
      where: { userId: id },
      select: { id: true }
    });
    
    return student && student.id === reportCard.studentId;
  }
  
  // Les parents peuvent voir les bulletins de leurs enfants
  if (role === 'PARENT') {
    const parent = await prisma.parent.findUnique({
      where: { userId: id },
      include: {
        students: {
          select: { studentId: true }
        }
      }
    });
    
    return parent && parent.students.some(s => s.studentId === reportCard.studentId);
  }
  
  return false;
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

    // Seuls les administrateurs et les enseignants peuvent modifier les bulletins
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { studentId, periodId, appreciation, status, financialStatus } = data

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

    // Déterminer le statut financier si non fourni
    let updatedFinancialStatus = financialStatus;
    
    if (!updatedFinancialStatus) {
      // Vérifier s'il y a des factures en retard pour cet étudiant
      const pendingInvoices = await prisma.invoice.findMany({
        where: {
          studentId,
          status: { in: ['PENDING', 'PARTIAL', 'LATE'] },
        },
      });
      
      if (pendingInvoices.length > 0) {
        // Vérifier si certaines factures sont en retard
        const lateInvoices = pendingInvoices.filter(inv => 
          inv.status === 'LATE' || (inv.dueDate < new Date() && inv.status !== 'PAID')
        );
        
        updatedFinancialStatus = lateInvoices.length > 0 ? 'LATE' : 'PENDING';
      } else {
        updatedFinancialStatus = 'PAID';
      }
    }

    const reportCard = await prisma.reportcard.update({
      where: { id: params.id },
      data: {
        studentId,
        periodId,
        average,
        appreciation,
        status,
        financialStatus: updatedFinancialStatus,
      },
      include: {
        student: {
          select: {
            id: true,
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
                level: true,
              }
            }
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

    // Seuls les administrateurs peuvent supprimer les bulletins
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    await prisma.reportcard.delete({
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