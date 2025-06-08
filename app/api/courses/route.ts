import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/courses - Récupérer tous les cours
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({
        error: 'Vous devez être connecté pour accéder à cette ressource'
      }, {
        status: 401
      })
    }

    const courses = await prisma.course.findMany({
      include: {
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    // Formater les données pour inclure clairement les informations de l'enseignant
    const formattedCourses = courses.map(course => ({
      id: course.id,
      name: course.name,
      coefficient: course.coefficient,
      level: course.level,
      description: course.description,
      teacherId: course.teacherId,
      teacher: course.teacher ? {
        id: course.teacher.id,
        firstName: course.teacher.user.firstName,
        lastName: course.teacher.user.lastName
      } : null
    }))

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error)
    return NextResponse.json({
      error: 'Erreur de connexion à la base de données. Assurez-vous que le serveur MySQL est bien démarré.'
    }, {
      status: 503
    })
  }
}

// POST /api/courses - Créer un nouveau cours
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({
        error: 'Vous devez être connecté pour créer un cours'
      }, {
        status: 401
      })
    }

    const body = await request.json()
    
    // Validation du corps de la requête
    const result = courseSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({
        error: 'Données invalides',
        details: result.error.format()
      }, {
        status: 400
      })
    }

    // Vérifier que l'enseignant existe
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: body.teacherId
      }
    })

    if (!teacher) {
      return NextResponse.json({
        error: 'L\'enseignant spécifié n\'existe pas'
      }, {
        status: 404
      })
    }

    const course = await prisma.course.create({
      data: {
        name: body.name,
        coefficient: body.coefficient,
        level: body.level,
        description: body.description || '',
        teacherId: body.teacherId
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error)
    return NextResponse.json({
      error: 'Erreur de connexion à la base de données. Assurez-vous que le serveur MySQL est bien démarré.'
    }, {
      status: 503
    })
  }
}

// Schéma de validation pour la création ou mise à jour d'un cours
const courseSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  coefficient: z.coerce.number().min(1, 'Le coefficient doit être au moins de 1'),
  level: z.string().min(1, 'Le niveau est requis'),
  description: z.string().optional(),
  teacherId: z.string().min(1, 'L\'enseignant est requis')
}) 


