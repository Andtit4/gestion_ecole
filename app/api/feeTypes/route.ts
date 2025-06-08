import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/feeTypes - Récupérer tous les types de frais
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const feeTypes = await prisma.feetype.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    
    return NextResponse.json(feeTypes)
  } catch (error) {
    console.error('Erreur lors de la récupération des types de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// Schéma de validation pour la création/mise à jour d'un type de frais
const feeTypeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  isRecurrent: z.boolean().default(false),
  frequency: z.enum(['ONCE', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL']).optional().nullable(),
})

// POST /api/feeTypes - Créer un nouveau type de frais
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
    const validationResult = feeTypeSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Créer le type de frais
    const feeType = await prisma.feetype.create({
      data: {
        name: data.name,
        description: data.description,
        isRecurrent: data.isRecurrent,
        frequency: data.frequency,
      },
    })

    return NextResponse.json(feeType, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du type de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/feeTypes?id={id} - Mettre à jour un type de frais
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

    // Récupérer l'ID du type de frais à mettre à jour
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID manquant' },
        { status: 400 }
      )
    }

    // Vérifier que le type de frais existe
    const existingFeeType = await prisma.feetype.findUnique({
      where: { id },
    })

    if (!existingFeeType) {
      return NextResponse.json(
        { message: 'Type de frais non trouvé' },
        { status: 404 }
      )
    }

    const data = await request.json()
    
    // Valider les données
    const validationResult = feeTypeSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Mise à jour du type de frais
    const updatedFeeType = await prisma.feetype.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isRecurrent: data.isRecurrent,
        frequency: data.frequency,
      },
    })

    return NextResponse.json(updatedFeeType)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du type de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/feeTypes?id={id} - Supprimer un type de frais
export async function DELETE(request: Request) {
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

    // Récupérer l'ID du type de frais à supprimer
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID manquant' },
        { status: 400 }
      )
    }

    // Vérifier que le type de frais existe
    const existingFeeType = await prisma.feetype.findUnique({
      where: { id },
    })

    if (!existingFeeType) {
      return NextResponse.json(
        { message: 'Type de frais non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si le type de frais est utilisé par des éléments de frais
    const feeItemsCount = await prisma.feeitem.count({
      where: { feeTypeId: id },
    })

    if (feeItemsCount > 0) {
      return NextResponse.json(
        { 
          message: 'Ce type de frais est utilisé par des éléments de frais et ne peut pas être supprimé', 
          itemsCount: feeItemsCount
        },
        { status: 400 }
      )
    }

    // Supprimer le type de frais
    await prisma.feetype.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Type de frais supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du type de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
} 


