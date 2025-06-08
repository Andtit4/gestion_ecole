import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Fonction utilitaire pour générer un numéro de facture
async function generateInvoiceNumber() {
  const config = await prisma.paymentConfig.findFirst()
  const prefix = config?.invoicePrefix || "FACT-"
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  
  // Compter le nombre de factures pour ce mois-ci
  const invoiceCount = await prisma.invoice.count({
    where: {
      issuedDate: {
        gte: new Date(date.getFullYear(), date.getMonth(), 1),
        lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
      },
    },
  })
  
  // Formatage: PREFIX-YYYYMM-XXXX (où XXXX est le numéro séquentiel avec padding)
  const sequentialNumber = String(invoiceCount + 1).padStart(4, '0')
  return `${prefix}${year}${month}-${sequentialNumber}`
}

// GET /api/invoices - Récupérer toutes les factures
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer les paramètres de filtre depuis l'URL
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const status = searchParams.get('status')

    // Construire les filtres
    const where: any = {}
    
    if (studentId) {
      where.studentId = studentId
    }
    
    if (status) {
      where.status = status
    }

    // Restreindre l'accès selon le rôle
    if (session.user.role === 'PARENT') {
      // Un parent ne peut voir que les factures de ses enfants
      const parent = await prisma.parent.findUnique({
        where: { userId: session.user.id },
        include: {
          students: {
            select: {
              studentId: true,
            },
          },
        },
      })

      if (!parent) {
        return NextResponse.json(
          { message: 'Parent non trouvé' },
          { status: 404 }
        )
      }

      const studentIds = parent.students.map(s => s.studentId)
      where.studentId = { in: studentIds }
    } else if (session.user.role === 'STUDENT') {
      // Un étudiant ne peut voir que ses propres factures
      const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
      })

      if (!student) {
        return NextResponse.json(
          { message: 'Étudiant non trouvé' },
          { status: 404 }
        )
      }

      where.studentId = student.id
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: {
        issuedDate: 'desc',
      },
      include: {
        student: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            class: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
          },
        },
        feeAssignments: {
          include: {
            feeAssignment: {
              include: {
                feeItem: {
                  include: {
                    feeType: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          orderBy: {
            paymentDate: 'desc',
          },
        },
      },
    })
    
    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// Schéma de validation pour la création d'une facture
const invoiceSchema = z.object({
  studentId: z.string().min(1, 'L\'étudiant est requis'),
  dueDate: z.string().transform(val => new Date(val)),
  notes: z.string().optional(),
  feeAssignmentIds: z.array(z.string()).min(1, 'Au moins une assignation de frais est requise'),
})

// POST /api/invoices - Créer une nouvelle facture
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un administrateur
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Valider les données
    const validationResult = invoiceSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Vérifier que l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
    })

    if (!student) {
      return NextResponse.json(
        { message: 'L\'étudiant spécifié n\'existe pas' },
        { status: 404 }
      )
    }

    // Vérifier que toutes les assignations de frais existent et appartiennent à l'étudiant
    const feeAssignments = await prisma.feeAssignment.findMany({
      where: {
        id: { in: data.feeAssignmentIds },
        studentId: data.studentId,
      },
      include: {
        feeItem: true,
      },
    })

    if (feeAssignments.length !== data.feeAssignmentIds.length) {
      return NextResponse.json(
        { message: 'Certaines assignations de frais spécifiées n\'existent pas ou n\'appartiennent pas à l\'étudiant' },
        { status: 404 }
      )
    }

    // Générer un numéro de facture unique
    const invoiceNumber = await generateInvoiceNumber()

    // Calculer le montant total de la facture
    const totalAmount = feeAssignments.reduce(
      (total, assignment) => total + assignment.feeItem.amount,
      0
    )

    // Créer la facture et les liens avec les assignations de frais en une seule transaction
    const invoice = await prisma.$transaction(async (prisma) => {
      // Créer la facture
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          totalAmount,
          dueDate: data.dueDate,
          studentId: data.studentId,
          notes: data.notes,
          status: 'PENDING',
        },
      })

      // Créer les liens avec les assignations de frais
      await Promise.all(
        feeAssignments.map(assignment =>
          prisma.invoiceFeeAssignment.create({
            data: {
              invoiceId: invoice.id,
              feeAssignmentId: assignment.id,
              amount: assignment.feeItem.amount,
            },
          })
        )
      )

      // Mettre à jour le statut des assignations de frais
      await prisma.feeAssignment.updateMany({
        where: {
          id: { in: data.feeAssignmentIds },
        },
        data: {
          status: 'PENDING',
        },
      })

      return invoice
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la facture:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
} 


