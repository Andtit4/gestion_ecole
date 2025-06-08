import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/programmes - Récupérer tous les programmes
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que le modèle Programme existe bien dans Prisma
    console.log('Modèles disponibles dans Prisma:', Object.keys(prisma));
    
    try {
      const programmes = await prisma.programme.findMany({
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      
      return NextResponse.json(programmes)
    } catch (innerError) {
      console.error('Erreur spécifique lors de la requête Programme:', innerError)
      
      // Si le modèle n'existe pas encore, renvoyer un tableau vide plutôt qu'une erreur
      if (innerError.message && innerError.message.includes("Unknown model 'Programme'")) {
        console.log('Le modèle Programme n\'existe pas encore, retour d\'un tableau vide');
        return NextResponse.json([])
      }
      
      throw innerError;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes:', error)
    console.error('Type d\'erreur:', typeof error)
    console.error('Message d\'erreur:', error.message)
    console.error('Stack trace:', error.stack)
    
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// Schéma de validation pour la création/mise à jour d'un programme
const programmeSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  level: z.string().min(1, 'Le niveau est requis'),
  year: z.number().int().min(2000, 'L\'année doit être valide'),
  courseId: z.string().min(1, 'La matière est requise'),
  content: z.string().optional(),
  objectives: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  userId: z.string().min(1, 'L\'utilisateur est requis'),
})

// POST /api/programmes - Créer un nouveau programme
export async function POST(request: Request) {
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

    const data = await request.json()
    
    // Valider les données
    const validationResult = programmeSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Vérifier que le cours existe
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    })

    if (!course) {
      return NextResponse.json(
        { message: 'La matière spécifiée n\'existe pas' },
        { status: 404 }
      )
    }

    // Créer le programme
    const programme = await prisma.programme.create({
      data: {
        title: data.title,
        description: data.description,
        level: data.level,
        year: data.year,
        courseId: data.courseId,
        content: data.content,
        objectives: data.objectives,
        status: data.status,
        userId: data.userId || session.user.id,
      },
    })

    return NextResponse.json(programme, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du programme:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 


