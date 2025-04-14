import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/parents/[id]/children - Récupérer les enfants d'un parent
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Attendre les paramètres avant d'accéder à leurs propriétés
    const resolvedParams = await params
    const parentId = resolvedParams.id

    // Vérifier que le parent existe
    const parent = await prisma.user.findUnique({
      where: { 
        id: parentId,
        role: 'PARENT'
      }
    })

    if (!parent) {
      return NextResponse.json(
        { message: 'Parent non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les relations parent-enfant
    const parentChildRelations = await prisma.parentChild.findMany({
      where: { parentId },
      include: {
        child: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                level: true
              }
            }
          }
        }
      }
    })

    // Extraire les enfants
    const children = parentChildRelations.map(relation => relation.child)

    return NextResponse.json(children)
  } catch (error) {
    console.error('Erreur lors de la récupération des enfants:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/parents/[id]/children - Associer des enfants à un parent
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Attendre les paramètres avant d'accéder à leurs propriétés
    const resolvedParams = await params
    const parentId = resolvedParams.id

    // Vérifier que le parent existe
    const parent = await prisma.user.findUnique({
      where: { 
        id: parentId,
        role: 'PARENT'
      }
    })

    if (!parent) {
      return NextResponse.json(
        { message: 'Parent non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les IDs des enfants à associer
    const { childrenIds } = await request.json()
    
    if (!Array.isArray(childrenIds)) {
      return NextResponse.json(
        { message: 'Format de données incorrect' },
        { status: 400 }
      )
    }

    // Vérifier que les enfants existent
    const children = await prisma.user.findMany({
      where: {
        id: { in: childrenIds },
        role: 'STUDENT'
      }
    })

    if (children.length !== childrenIds.length) {
      return NextResponse.json(
        { message: 'Certains enfants n\'existent pas' },
        { status: 400 }
      )
    }

    // Supprimer les associations existantes
    await prisma.parentChild.deleteMany({
      where: { parentId }
    })

    // Créer les nouvelles associations
    const createdRelations = await Promise.all(
      childrenIds.map(childId => 
        prisma.parentChild.create({
          data: {
            parentId,
            childId
          }
        })
      )
    )

    return NextResponse.json(
      { message: 'Associations créées avec succès', count: createdRelations.length },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de l\'association des enfants:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 