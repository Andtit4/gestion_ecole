import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation pour la création/mise à jour d'une salle
const classroomSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  capacity: z.number().int().positive().optional(),
  floor: z.number().int().optional(),
  building: z.string().optional(),
  description: z.string().optional(),
})

// GET /api/classrooms - Récupérer toutes les salles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    const classrooms = await prisma.classroom.findMany({
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(classrooms)
  } catch (error) {
    console.error('Erreur lors de la récupération des salles:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/classrooms - Créer une nouvelle salle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    // Vérifier les permissions (seul l'administrateur peut créer une salle)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Permission refusée' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Valider les données
    const validationResult = classroomSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Données invalides', errors: validationResult.error.format() },
        { status: 400 }
      )
    }
    
    const { name, capacity, floor, building, description } = validationResult.data
    
    // Vérifier si une salle avec le même nom existe déjà
    const existingClassroom = await prisma.classroom.findFirst({
      where: { name }
    })
    
    if (existingClassroom) {
      return NextResponse.json(
        { message: 'Une salle avec ce nom existe déjà' },
        { status: 409 }
      )
    }
    
    // Créer la nouvelle salle
    const classroom = await prisma.classroom.create({
      data: {
        name,
        capacity,
        floor,
        building,
        description,
      }
    })
    
    return NextResponse.json(classroom, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la salle:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/classrooms - Mettre à jour une salle existante
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    // Vérifier les permissions (seul l'administrateur peut modifier une salle)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Permission refusée' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID de la salle manquant' },
        { status: 400 }
      )
    }
    
    // Valider les données
    const validationResult = classroomSchema.partial().safeParse(updateData)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Données invalides', errors: validationResult.error.format() },
        { status: 400 }
      )
    }
    
    // Vérifier si la salle existe
    const classroom = await prisma.classroom.findUnique({
      where: { id }
    })
    
    if (!classroom) {
      return NextResponse.json(
        { message: 'Salle introuvable' },
        { status: 404 }
      )
    }
    
    // Vérifier si le nom est déjà utilisé par une autre salle
    if (updateData.name && updateData.name !== classroom.name) {
      const existingClassroom = await prisma.classroom.findFirst({
        where: {
          name: updateData.name,
          id: { not: id }
        }
      })
      
      if (existingClassroom) {
        return NextResponse.json(
          { message: 'Une salle avec ce nom existe déjà' },
          { status: 409 }
        )
      }
    }
    
    // Mettre à jour la salle
    const updatedClassroom = await prisma.classroom.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json(updatedClassroom)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la salle:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/classrooms - Supprimer une salle
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    // Vérifier les permissions (seul l'administrateur peut supprimer une salle)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Permission refusée' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID de la salle manquant' },
        { status: 400 }
      )
    }
    
    // Vérifier si la salle existe
    const classroom = await prisma.classroom.findUnique({
      where: { id }
    })
    
    if (!classroom) {
      return NextResponse.json(
        { message: 'Salle introuvable' },
        { status: 404 }
      )
    }
    
    // Supprimer la salle
    await prisma.classroom.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Salle supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de la salle:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 


