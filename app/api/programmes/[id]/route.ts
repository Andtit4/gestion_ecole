import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/programmes/[id] - Récupérer un programme par son ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const programme = await prisma.programme.findUnique({
      where: { id: params.id },
      include: {
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!programme) {
      return NextResponse.json(
        { message: 'Programme non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(programme)
  } catch (error) {
    console.error('Erreur lors de la récupération du programme:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Schéma de validation pour la mise à jour d'un programme
const updateProgrammeSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').optional(),
  description: z.string().optional(),
  level: z.string().min(1, 'Le niveau est requis').optional(),
  year: z.number().int().min(2000, 'L\'année doit être valide').optional(),
  courseId: z.string().min(1, 'La matière est requise').optional(),
  content: z.string().optional(),
  objectives: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

// PUT /api/programmes/[id] - Mettre à jour un programme
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un administrateur ou un enseignant
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Vérifier que le programme existe
    const existingProgramme = await prisma.programme.findUnique({
      where: { id: params.id },
    })

    if (!existingProgramme) {
      return NextResponse.json(
        { message: 'Programme non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur a le droit de modifier ce programme
    if (
      session.user.role !== 'ADMIN' && 
      existingProgramme.userId !== session.user.id
    ) {
      return NextResponse.json(
        { message: 'Vous n\'êtes pas autorisé à modifier ce programme' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Valider les données
    const validationResult = updateProgrammeSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Si on change de matière, vérifier que la nouvelle matière existe
    if (data.courseId && data.courseId !== existingProgramme.courseId) {
      const course = await prisma.course.findUnique({
        where: { id: data.courseId },
      })

      if (!course) {
        return NextResponse.json(
          { message: 'La matière spécifiée n\'existe pas' },
          { status: 404 }
        )
      }
    }

    // Mettre à jour le programme
    const programme = await prisma.programme.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        level: data.level,
        year: data.year,
        courseId: data.courseId,
        content: data.content,
        objectives: data.objectives,
        status: data.status,
      },
    })

    return NextResponse.json(programme)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du programme:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/programmes/[id] - Supprimer un programme
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un administrateur ou un enseignant
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Vérifier que le programme existe
    const existingProgramme = await prisma.programme.findUnique({
      where: { id: params.id },
    })

    if (!existingProgramme) {
      return NextResponse.json(
        { message: 'Programme non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur a le droit de supprimer ce programme
    if (
      session.user.role !== 'ADMIN' && 
      existingProgramme.userId !== session.user.id
    ) {
      return NextResponse.json(
        { message: 'Vous n\'êtes pas autorisé à supprimer ce programme' },
        { status: 403 }
      )
    }

    // Supprimer le programme
    await prisma.programme.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: 'Programme supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression du programme:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 