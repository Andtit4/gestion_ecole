import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/teachers - Récupérer tous les enseignants
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

    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    
    let where = {}
    if (search) {
      where = {
        OR: [
          {
            user: {
              firstName: {
                contains: search,
                mode: 'insensitive'
              }
            }
          },
          {
            user: {
              lastName: {
                contains: search,
                mode: 'insensitive'
              }
            }
          }
        ]
      }
    }
    
    let teachers
    
    // Récupérer les enseignants avec leurs utilisateurs associés
    if (session.user.role === 'ADMIN') {
      teachers = await prisma.teacher.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true, 
              lastName: true,
              email: true,
              createdAt: true
            }
          }
        }
      })

      // Transformer la réponse pour avoir un format plus simple
      teachers = teachers.map(teacher => ({
        id: teacher.id,
        firstName: teacher.user.firstName,
        lastName: teacher.user.lastName,
        email: teacher.user.email,
        createdAt: teacher.user.createdAt
      }))
    } else {
      teachers = await prisma.user.findMany({
        where: {
          ...where,
          role: 'TEACHER'
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          teacher: {
            select: {
              id: true
            }
          }
        }
      })
      
      // Transformer la réponse pour avoir le même format
      teachers = teachers
        .filter(user => user.teacher)
        .map(user => ({
          id: user.teacher.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt
        }))
    }
    
    return NextResponse.json(teachers)

  } catch (error) {
    console.error('Erreur GET /api/teachers :', error)
    return NextResponse.json({
      error: 'Erreur de connexion à la base de données. Assurez-vous que le serveur MySQL est bien démarré.'
    }, {
      status: 503
    })
  }
}

// POST /api/teachers - Créer un nouvel enseignant
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent créer des enseignants.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { firstName, lastName, email, password, subjects } = body

    // Validation des données
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Prénom, nom, email et mot de passe sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Créer l'enseignant
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password, // Dans une application réelle, vous devriez hacher le mot de passe
        role: 'TEACHER',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // Créer l'entrée dans la table teacher
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
      },
      select: {
        id: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/teachers :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'enseignant' },
      { status: 500 }
    )
  }
}

// PUT /api/teachers - Mettre à jour un enseignant existant
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent modifier des enseignants.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id, firstName, lastName, email, password } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'enseignant requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'enseignant existe
    const teacher = await prisma.user.findFirst({
      where: { id, role: 'TEACHER' },
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'email existe déjà (sauf pour cet utilisateur)
    if (email && email !== teacher.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Un utilisateur avec cet email existe déjà' },
          { status: 400 }
        )
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {
      firstName: firstName ?? teacher.firstName,
      lastName: lastName ?? teacher.lastName,
      email: email ?? teacher.email,
    }

    // Ajouter le mot de passe uniquement s'il est fourni
    if (password) {
      updateData.password = password // Dans une application réelle, vous devriez hacher le mot de passe
    }

    // Mettre à jour l'enseignant
    const updatedTeacher = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(updatedTeacher)
  } catch (error) {
    console.error('Erreur PUT /api/teachers :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'enseignant' },
      { status: 500 }
    )
  }
}

// DELETE /api/teachers - Supprimer un enseignant
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent supprimer des enseignants.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'enseignant requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'enseignant existe
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true
      }
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'enseignant est associé à des classes
    const classes = await prisma.class.findMany({
      where: { teacherId: id },
    })

    if (classes.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un enseignant assigné à des classes. Veuillez d\'abord réassigner ces classes.' },
        { status: 400 }
      )
    }

    // Vérifier si l'enseignant est associé à des cours
    const courses = await prisma.course.findMany({
      where: { teacherId: id },
    })

    if (courses.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un enseignant assigné à des cours. Veuillez d\'abord réassigner ces cours.' },
        { status: 400 }
      )
    }

    // Supprimer l'enseignant et son utilisateur associé
    await prisma.$transaction([
      prisma.teacher.delete({
        where: { id }
      }),
      prisma.user.delete({
        where: { id: teacher.userId }
      })
    ])

    return NextResponse.json(
      { message: 'Enseignant supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur DELETE /api/teachers :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'enseignant' },
      { status: 500 }
    )
  }
} 