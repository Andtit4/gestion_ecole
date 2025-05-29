import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
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
  classId: z.string().optional(),
  level: z.string().optional(),
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