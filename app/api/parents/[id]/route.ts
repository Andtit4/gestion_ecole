import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

// GET /api/parents/[id] - Récupérer un parent spécifique
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

    const parent = await prisma.user.findUnique({
      where: {
        id: parentId,
        role: 'PARENT'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        _count: {
          select: {
            children: true
          }
        }
      }
    })

    if (!parent) {
      return NextResponse.json(
        { message: 'Parent non trouvé' },
        { status: 404 }
      )
    }

    // Reformater pour inclure le nombre d'enfants
    const formattedParent = {
      id: parent.id,
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      childrenCount: parent._count.children
    }

    return NextResponse.json(formattedParent)
  } catch (error) {
    console.error('Erreur lors de la récupération du parent:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/parents/[id] - Modifier un parent
export async function PUT(
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
    const existingParent = await prisma.user.findUnique({
      where: {
        id: parentId,
        role: 'PARENT'
      }
    })

    if (!existingParent) {
      return NextResponse.json(
        { message: 'Parent non trouvé' },
        { status: 404 }
      )
    }

    const { firstName, lastName, email, password, childrenIds } = await request.json()

    // Préparer les données à mettre à jour
    const updateData: any = {}
    
    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    
    if (email && email !== existingParent.email) {
      // Vérifier si le nouvel email est déjà utilisé
      const emailExists = await prisma.user.findUnique({
        where: { email }
      })
      
      if (emailExists) {
        return NextResponse.json(
          { message: 'Cet email est déjà utilisé' },
          { status: 400 }
        )
      }
      
      updateData.email = email
    }
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Mettre à jour le parent
    const updatedParent = await prisma.user.update({
      where: {
        id: parentId
      },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    })

    // Si des enfants sont spécifiés, mettre à jour les associations
    if (Array.isArray(childrenIds)) {
      // Supprimer les associations existantes
      await prisma.parentChild.deleteMany({
        where: { parentId }
      })

      // Créer les nouvelles associations
      if (childrenIds.length > 0) {
        await Promise.all(
          childrenIds.map(childId =>
            prisma.parentChild.create({
              data: {
                parentId,
                childId
              }
            })
          )
        )
      }
    }

    return NextResponse.json({
      message: 'Parent mis à jour avec succès',
      parent: updatedParent
    })
  } catch (error) {
    console.error('Erreur lors de la modification du parent:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/parents/[id] - Supprimer un parent
export async function DELETE(
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

    // Supprimer les associations avec les enfants
    await prisma.parentChild.deleteMany({
      where: { parentId }
    })

    // Supprimer le parent
    await prisma.user.delete({
      where: { id: parentId }
    })

    return NextResponse.json({
      message: 'Parent supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du parent:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 