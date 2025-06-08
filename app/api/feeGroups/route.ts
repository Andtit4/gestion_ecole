import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/feeGroups - Récupérer tous les groupes de frais
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const feeGroups = await prisma.feeGroup.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        feeItems: {
          include: {
            feeType: true,
          },
        },
      },
    })
    
    return NextResponse.json(feeGroups)
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// Schéma de validation pour la création/mise à jour d'un groupe de frais
const feeGroupSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  classId: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  year: z.number().int().min(2000, 'L\'année doit être valide'),
})

// POST /api/feeGroups - Créer un nouveau groupe de frais
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
    const validationResult = feeGroupSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Si un classId est fourni, vérifier que la classe existe
    if (data.classId) {
      const classExists = await prisma.renamedclass.findUnique({
        where: { id: data.classId },
      })

      if (!classExists) {
        return NextResponse.json(
          { message: 'La classe spécifiée n\'existe pas' },
          { status: 404 }
        )
      }
    }

    // Créer le groupe de frais
    const feeGroup = await prisma.feeGroup.create({
      data: {
        name: data.name,
        description: data.description,
        classId: data.classId,
        level: data.level,
        year: data.year,
      },
    })

    return NextResponse.json(feeGroup, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du groupe de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/feeGroups?id={id} - Mettre à jour un groupe de frais
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

    // Récupérer l'ID du groupe de frais à mettre à jour
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID manquant' },
        { status: 400 }
      )
    }

    // Vérifier que le groupe de frais existe
    const existingFeeGroup = await prisma.feeGroup.findUnique({
      where: { id },
    })

    if (!existingFeeGroup) {
      return NextResponse.json(
        { message: 'Groupe de frais non trouvé' },
        { status: 404 }
      )
    }

    const data = await request.json()
    
    // Valider les données
    const validationResult = feeGroupSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Si un classId est fourni, vérifier que la classe existe
    if (data.classId) {
      const classExists = await prisma.renamedclass.findUnique({
        where: { id: data.classId },
      })

      if (!classExists) {
        return NextResponse.json(
          { message: 'La classe spécifiée n\'existe pas' },
          { status: 404 }
        )
      }
    }

    // Mise à jour du groupe de frais
    const updatedFeeGroup = await prisma.feeGroup.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        classId: data.classId,
        level: data.level,
        year: data.year,
      },
    })

    return NextResponse.json(updatedFeeGroup)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du groupe de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/feeGroups?id={id} - Supprimer un groupe de frais
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

    // Récupérer l'ID du groupe de frais à supprimer
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID manquant' },
        { status: 400 }
      )
    }

    // Vérifier que le groupe de frais existe
    const existingFeeGroup = await prisma.feeGroup.findUnique({
      where: { id },
    })

    if (!existingFeeGroup) {
      return NextResponse.json(
        { message: 'Groupe de frais non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si le groupe de frais est utilisé par des éléments de frais
    const feeItemsCount = await prisma.feeItem.count({
      where: { feeGroupId: id },
    })

    if (feeItemsCount > 0) {
      return NextResponse.json(
        { 
          message: 'Ce groupe de frais est utilisé par des éléments de frais et ne peut pas être supprimé', 
          itemsCount: feeItemsCount
        },
        { status: 400 }
      )
    }

    // Supprimer le groupe de frais
    await prisma.feeGroup.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Groupe de frais supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du groupe de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
} 


