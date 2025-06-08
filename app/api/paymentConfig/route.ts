import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/paymentConfig - Récupérer la configuration des paiements
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Seuls les administrateurs peuvent accéder à la configuration complète
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Récupérer la configuration existante ou créer une configuration par défaut
    let config = await prisma.paymentConfig.findFirst()
    
    if (!config) {
      config = await prisma.paymentConfig.create({
        data: {
          latePaymentFeePercent: 0,
          latePaymentGracePeriod: 0,
          receiptPrefix: "RECU-",
          invoicePrefix: "FACT-",
          allowPartialPayments: true,
          allowOnlinePayments: true,
          paymentMethods: "CASH,CHEQUE,BANK_TRANSFER,ONLINE",
        },
      })
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration des paiements:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// Schéma de validation pour la mise à jour de la configuration des paiements
const paymentConfigSchema = z.object({
  latePaymentFeePercent: z.number().min(0, 'Le pourcentage de frais de retard doit être positif ou nul'),
  latePaymentGracePeriod: z.number().int().min(0, 'La période de grâce doit être positive ou nulle'),
  receiptPrefix: z.string().min(1, 'Le préfixe des reçus est requis'),
  invoicePrefix: z.string().min(1, 'Le préfixe des factures est requis'),
  allowPartialPayments: z.boolean(),
  allowOnlinePayments: z.boolean(),
  paymentMethods: z.string().min(1, 'Au moins une méthode de paiement est requise'),
})

// PUT /api/paymentConfig - Mettre à jour la configuration des paiements
export async function PUT(request: Request) {
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
    const validationResult = paymentConfigSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Vérifier si une configuration existe déjà
    const existingConfig = await prisma.paymentConfig.findFirst()
    
    let config
    
    if (existingConfig) {
      // Mettre à jour la configuration existante
      config = await prisma.paymentConfig.update({
        where: { id: existingConfig.id },
        data: {
          latePaymentFeePercent: data.latePaymentFeePercent,
          latePaymentGracePeriod: data.latePaymentGracePeriod,
          receiptPrefix: data.receiptPrefix,
          invoicePrefix: data.invoicePrefix,
          allowPartialPayments: data.allowPartialPayments,
          allowOnlinePayments: data.allowOnlinePayments,
          paymentMethods: data.paymentMethods,
        },
      })
    } else {
      // Créer une nouvelle configuration
      config = await prisma.paymentConfig.create({
        data: {
          latePaymentFeePercent: data.latePaymentFeePercent,
          latePaymentGracePeriod: data.latePaymentGracePeriod,
          receiptPrefix: data.receiptPrefix,
          invoicePrefix: data.invoicePrefix,
          allowPartialPayments: data.allowPartialPayments,
          allowOnlinePayments: data.allowOnlinePayments,
          paymentMethods: data.paymentMethods,
        },
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration des paiements:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
} 


