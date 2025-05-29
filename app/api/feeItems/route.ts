import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/feeItems - Récupérer tous les éléments de frais
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const feeItems = await prisma.feeItem.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        feeType: true,
        feeGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    
    return NextResponse.json(feeItems)
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// Schéma de validation pour la création/mise à jour d'un élément de frais
const feeItemSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  amount: z.number().positive('Le montant doit être positif'),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  description: z.string().optional(),
  mandatory: z.boolean().default(true),
  feeTypeId: z.string().min(1, 'Le type de frais est requis'),
  feeGroupId: z.string().min(1, 'Le groupe de frais est requis'),
})

// POST /api/feeItems - Créer un nouveau élément de frais
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
    const validationResult = feeItemSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Vérifier que le type de frais existe
    const feeType = await prisma.feeType.findUnique({
      where: { id: data.feeTypeId },
    })

    if (!feeType) {
      return NextResponse.json(
        { message: 'Le type de frais spécifié n\'existe pas' },
        { status: 404 }
      )
    }

    // Vérifier que le groupe de frais existe
    const feeGroup = await prisma.feeGroup.findUnique({
      where: { id: data.feeGroupId },
    })

    if (!feeGroup) {
      return NextResponse.json(
        { message: 'Le groupe de frais spécifié n\'existe pas' },
        { status: 404 }
      )
    }

    // Créer l'élément de frais
    const feeItem = await prisma.feeItem.create({
      data: {
        name: data.name,
        amount: data.amount,
        dueDate: data.dueDate,
        description: data.description,
        mandatory: data.mandatory,
        feeTypeId: data.feeTypeId,
        feeGroupId: data.feeGroupId,
      },
    })

    return NextResponse.json(feeItem, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'élément de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
} 