import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Cette API est conçue pour être appelée par un service CRON (comme Vercel Cron Jobs)
// GET /api/cron/updatePaymentStatus - Mettre à jour les statuts des paiements en retard
export async function GET(request: Request) {
  try {
    // Vérifier le secret d'authentification pour la tâche CRON (à configurer dans les variables d'environnement)
    const { searchParams } = new URL(request.url)
    const authSecret = searchParams.get('secret')
    
    if (process.env.CRON_SECRET && authSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // 1. Identifier les factures en retard (dueDate dépassée)
    const lateInvoices = await prisma.invoice.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: { in: ['PENDING', 'PARTIAL'] },
      },
      select: {
        id: true,
        studentId: true,
      },
    })

    // 2. Mettre à jour les assignations de frais associées
    const invoiceIds = lateInvoices.map(inv => inv.id)
    
    if (invoiceIds.length > 0) {
      // Récupérer les assignations de frais liées aux factures en retard
      const invoiceFeeAssignments = await prisma.invoiceFeeAssignment.findMany({
        where: {
          invoiceId: { in: invoiceIds },
        },
        select: {
          feeAssignmentId: true,
        },
      })

      const feeAssignmentIds = invoiceFeeAssignments.map(ifa => ifa.feeAssignmentId)
      
      // Mettre à jour les assignations en statut LATE
      await prisma.feeAssignment.updateMany({
        where: {
          id: { in: feeAssignmentIds },
          status: { in: ['PENDING', 'PARTIAL'] },
        },
        data: {
          status: 'LATE',
        },
      })
    }

    // 3. Mettre à jour les factures en retard
    const updatedInvoices = await prisma.invoice.updateMany({
      where: {
        dueDate: { lt: new Date() },
        status: { in: ['PENDING', 'PARTIAL'] },
      },
      data: {
        status: 'LATE',
      },
    })

    // 4. Mettre à jour le statut financier des bulletins pour les étudiants concernés
    const studentIds = [...new Set(lateInvoices.map(inv => inv.studentId))]
    
    if (studentIds.length > 0) {
      await prisma.reportcard.updateMany({
        where: {
          studentId: { in: studentIds },
          financialStatus: { in: ['PENDING'] },
        },
        data: {
          financialStatus: 'LATE',
        },
      })
    }

    // 5. Vérifier s'il faut appliquer des frais de retard (selon la configuration)
    const config = await prisma.paymentConfig.findFirst()
    
    if (config && config.latePaymentFeePercent > 0) {
      // Calculer la date limite incluant la période de grâce
      const gracePeriodDate = new Date()
      gracePeriodDate.setDate(gracePeriodDate.getDate() - config.latePaymentGracePeriod)
      
      // Trouver les factures éligibles pour les frais de retard
      // (celles qui sont en retard depuis plus longtemps que la période de grâce)
      const invoicesForLateFees = await prisma.invoice.findMany({
        where: {
          dueDate: { lt: gracePeriodDate },
          status: 'LATE',
        },
        select: {
          id: true,
          totalAmount: true,
        },
      })
      
      // TODO: Logique pour appliquer des frais de retard si nécessaire
      // Cette partie pourrait créer de nouvelles assignations de frais pour les frais de retard
      // ou mettre à jour le montant total des factures existantes
    }

    return NextResponse.json({
      success: true,
      updatedInvoices: updatedInvoices.count,
      affectedStudents: studentIds.length,
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statuts de paiement:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
} 


