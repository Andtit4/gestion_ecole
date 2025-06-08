import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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
  dueDate: z.date().optional().nullable(),
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

// PUT /api/feeItems?id={id} - Mettre à jour un élément de frais
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

    // Récupérer l'ID de l'élément de frais à mettre à jour
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID manquant' },
        { status: 400 }
      )
    }

    // Vérifier que l'élément de frais existe
    const existingFeeItem = await prisma.feeItem.findUnique({
      where: { id },
    })

    if (!existingFeeItem) {
      return NextResponse.json(
        { message: 'Élément de frais non trouvé' },
        { status: 404 }
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

    // Mise à jour de l'élément de frais
    const updatedFeeItem = await prisma.feeItem.update({
      where: { id },
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

    return NextResponse.json(updatedFeeItem)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'élément de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/feeItems?id={id} - Supprimer un élément de frais
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

    // Récupérer l'ID de l'élément de frais à supprimer
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID manquant' },
        { status: 400 }
      )
    }

    // Vérifier que l'élément de frais existe
    const existingFeeItem = await prisma.feeItem.findUnique({
      where: { id },
    })

    if (!existingFeeItem) {
      return NextResponse.json(
        { message: 'Élément de frais non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'élément de frais est utilisé par des assignations de frais
    const feeAssignmentsCount = await prisma.feeAssignment.count({
      where: { feeItemId: id },
    })

    if (feeAssignmentsCount > 0) {
      return NextResponse.json(
        { 
          message: 'Cet élément de frais est utilisé par des assignations de frais et ne peut pas être supprimé', 
          assignmentsCount: feeAssignmentsCount
        },
        { status: 400 }
      )
    }

    // Supprimer l'élément de frais
    await prisma.feeItem.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Élément de frais supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élément de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
} 


