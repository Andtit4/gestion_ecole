import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Fonction utilitaire pour générer un numéro de reçu
async function generateReceiptNumber() {
  const config = await prisma.paymentConfig.findFirst()
  const prefix = config?.receiptPrefix || "RECU-"
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  // Compter le nombre de paiements pour aujourd'hui
  const paymentCount = await prisma.payment.count({
    where: {
      paymentDate: {
        gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
      },
    },
  })
  
  // Formatage: PREFIX-YYYYMMDD-XXX (où XXX est le numéro séquentiel avec padding)
  const sequentialNumber = String(paymentCount + 1).padStart(3, '0')
  return `${prefix}${year}${month}${day}-${sequentialNumber}`
}

// Fonction utilitaire pour mettre à jour le statut d'une facture
async function updateInvoiceStatus(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      payments: true,
    },
  })

  if (!invoice) return

  // Calculer le montant total payé
  const paidAmount = invoice.payments.reduce(
    (total, payment) => total + (payment.status === 'PAID' ? payment.amount : 0),
    0
  )

  // Déterminer le nouveau statut de la facture
  let newStatus: 'PENDING' | 'PARTIAL' | 'PAID' = 'PENDING'
  
  if (paidAmount >= invoice.totalAmount) {
    newStatus = 'PAID'
  } else if (paidAmount > 0) {
    newStatus = 'PARTIAL'
  }

  // Mettre à jour la facture
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      paidAmount,
      status: newStatus,
    },
  })

  // Si la facture est entièrement payée, mettre à jour les assignations de frais
  if (newStatus === 'PAID') {
    const invoiceFeeAssignments = await prisma.invoiceFeeAssignment.findMany({
      where: { invoiceId },
      select: { feeAssignmentId: true },
    })

    const feeAssignmentIds = invoiceFeeAssignments.map(ifa => ifa.feeAssignmentId)
    
    await prisma.feeAssignment.updateMany({
      where: { id: { in: feeAssignmentIds } },
      data: { status: 'PAID' },
    })
    
    // Mettre à jour le statut financier des bulletins associés à l'étudiant
    const studentId = invoice.studentId
    
    await prisma.reportcard.updateMany({
      where: { 
        studentId,
        financialStatus: { in: ['PENDING', 'LATE'] }
      },
      data: { financialStatus: 'PAID' },
    })
  }
}

// GET /api/payments - Récupérer tous les paiements
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer les paramètres de filtre depuis l'URL
    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get('invoiceId')
    const parentId = searchParams.get('parentId')
    const status = searchParams.get('status')

    // Construire les filtres
    const where: any = {}
    
    if (invoiceId) {
      where.invoiceId = invoiceId
    }
    
    if (parentId) {
      where.parentId = parentId
    }
    
    if (status) {
      where.status = status
    }

    // Restreindre l'accès selon le rôle
    if (session.user.role === 'PARENT') {
      // Un parent ne peut voir que ses propres paiements
      const parent = await prisma.parent.findUnique({
        where: { userId: session.user.id },
      })

      if (!parent) {
        return NextResponse.json(
          { message: 'Parent non trouvé' },
          { status: 404 }
        )
      }

      where.parentId = parent.id
    } else if (session.user.role === 'STUDENT') {
      // Un étudiant ne peut voir que les paiements de ses factures
      const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      })

      if (!student) {
        return NextResponse.json(
          { message: 'Étudiant non trouvé' },
          { status: 404 }
        )
      }

      // Récupérer les IDs des factures de l'étudiant
      const invoices = await prisma.invoice.findMany({
        where: { studentId: student.id },
        select: { id: true },
      })

      const invoiceIds = invoices.map(invoice => invoice.id)
      where.invoiceId = { in: invoiceIds }
    }

    const payments = await prisma.payment.findMany({
      where,
      orderBy: {
        paymentDate: 'desc',
      },
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            status: true,
            student: {
              select: {
                id: true,
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        parent: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })
    
    return NextResponse.json(payments)
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// Schéma de validation pour la création d'un paiement
const paymentSchema = z.object({
  amount: z.number().positive('Le montant doit être positif'),
  method: z.enum(['CASH', 'CHEQUE', 'BANK_TRANSFER', 'ONLINE', 'MOBILE_MONEY', 'OTHER']),
  reference: z.string().optional(),
  invoiceId: z.string().min(1, 'La facture est requise'),
  parentId: z.string().min(1, 'Le parent est requis'),
  notes: z.string().optional(),
  paymentDate: z.string().transform(val => val ? new Date(val) : new Date()),
})

// POST /api/payments - Créer un nouveau paiement
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un administrateur ou un parent
    if (session.user.role !== 'ADMIN' && session.user.role !== 'PARENT') {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Valider les données
    const validationResult = paymentSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Si l'utilisateur est un parent, vérifier qu'il ne peut payer que ses propres factures
    if (session.user.role === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId: session.user.id },
      })

      if (!parent) {
        return NextResponse.json(
          { message: 'Parent non trouvé' },
          { status: 404 }
        )
      }

      // Vérifier que l'ID du parent dans la demande correspond à l'ID du parent connecté
      if (parent.id !== data.parentId) {
        return NextResponse.json(
          { message: 'Vous ne pouvez effectuer des paiements que pour vous-même' },
          { status: 403 }
        )
      }

      // Vérifier que la facture appartient à un enfant du parent
      const invoice = await prisma.invoice.findUnique({
        where: { id: data.invoiceId },
        select: { studentId: true },
      })

      if (!invoice) {
        return NextResponse.json(
          { message: 'Facture non trouvée' },
          { status: 404 }
        )
      }

      const parentStudent = await prisma.parentstudent.findFirst({
        where: {
          parentId: parent.id,
          studentId: invoice.studentId,
        },
      })

      if (!parentStudent) {
        return NextResponse.json(
          { message: 'Vous ne pouvez pas payer des factures pour cet étudiant' },
          { status: 403 }
        )
      }
    }

    // Vérifier que la facture existe
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
    })

    if (!invoice) {
      return NextResponse.json(
        { message: 'La facture spécifiée n\'existe pas' },
        { status: 404 }
      )
    }

    // Vérifier que le parent existe
    const parent = await prisma.parent.findUnique({
      where: { id: data.parentId },
    })

    if (!parent) {
      return NextResponse.json(
        { message: 'Le parent spécifié n\'existe pas' },
        { status: 404 }
      )
    }

    // Vérifier le montant du paiement par rapport au solde restant dû
    const soldeRestant = invoice.totalAmount - invoice.paidAmount
    if (data.amount > soldeRestant) {
      return NextResponse.json(
        { message: `Le montant du paiement (${data.amount}) dépasse le solde restant dû (${soldeRestant})` },
        { status: 400 }
      )
    }

    // Générer un numéro de reçu unique
    const receiptNumber = await generateReceiptNumber()

    // Créer le paiement
    const payment = await prisma.payment.create({
      data: {
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        status: 'PAID', // Par défaut, considéré comme payé (peut être différent selon la méthode)
        invoiceId: data.invoiceId,
        parentId: data.parentId,
        paymentDate: data.paymentDate,
        notes: data.notes,
        receiptNumber,
      },
    })

    // Mettre à jour le statut de la facture
    await updateInvoiceStatus(data.invoiceId)

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
} 