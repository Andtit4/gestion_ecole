/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/classes - Récupérer toutes les classes
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

    const classes = await prisma.renamedclass.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        teacher: {
          include: {
            user: true
          }
        },
        _count: {
          select: {
            students: true
          }
        }
      }
    })
    
    // Formater les données pour l'affichage
    const formattedClasses = classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      level: cls.level,
      year: cls.year,
      teacher: {
        id: cls.teacher?.id,
        firstName: cls.teacher?.user.firstName,
        lastName: cls.teacher?.user.lastName
      },
      studentCount: cls._count.students
    }))
    
    return NextResponse.json(formattedClasses)
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error)
    return NextResponse.json({
      error: 'Erreur de connexion à la base de données. Assurez-vous que le serveur MySQL est bien démarré.'
    }, {
      status: 503
    })
  }
}

// POST /api/classes - Créer une nouvelle classe
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent créer des classes.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, level, year, teacherId } = body

    // Validation des données
    if (!name || !level || !year || !teacherId) {
      return NextResponse.json(
        { error: 'Nom, niveau, année et enseignant sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'enseignant existe et est bien un enseignant
    const teacher = await prisma.teacher.findUnique({
      where: { 
        id: teacherId
      },
      include: {
        user: true
      }
    })

    // Si non trouvé avec l'ID direct, essayer de trouver via userId
    if (!teacher) {
      const teacherByUserId = await prisma.teacher.findFirst({
        where: { 
          userId: teacherId
        },
        include: {
          user: true
        }
      })
      
      if (!teacherByUserId) {
        return NextResponse.json(
          { error: 'Enseignant non trouvé' },
          { status: 404 }
        )
      }
      
      // Utiliser l'enseignant trouvé via userId
      const newClass = await prisma.renamedclass.create({
        data: {
          name,
          level,
          year,
          teacherId: teacherByUserId.id,
        },
        include: {
          teacher: {
            include: {
              user: true
            }
          }
        }
      })

      return NextResponse.json({
        id: newClass.id,
        name: newClass.name,
        level: newClass.level,
        year: newClass.year,
        teacher: {
          id: newClass.teacher?.id,
          firstName: newClass.teacher?.user.firstName,
          lastName: newClass.teacher?.user.lastName
        },
        studentCount: 0
      }, { status: 201 })
    }

    // Si l'enseignant est trouvé directement, créer la classe
    const newClass = await prisma.renamedclass.create({
      data: {
        name,
        level,
        year,
        teacherId: teacher.id,
      },
      include: {
        teacher: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json({
      id: newClass.id,
      name: newClass.name,
      level: newClass.level,
      year: newClass.year,
      teacher: {
        id: newClass.teacher?.id,
        firstName: newClass.teacher?.user.firstName,
        lastName: newClass.teacher?.user.lastName
      },
      studentCount: 0
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/classes :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la classe' },
      { status: 500 }
    )
  }
}

// PUT /api/classes - Mettre à jour une classe existante
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent modifier des classes.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id, name, level, year, teacherId } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la classe requis' },
        { status: 400 }
      )
    }

    // Vérifier si la classe existe
    const existingClass = await prisma.renamedclass.findUnique({
      where: { id },
      include: {
        students: true,
      },
    })

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que l'enseignant existe s'il est spécifié
    if (teacherId) {
      // D'abord essayer de trouver l'enseignant par son ID direct
      let teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        include: {
          user: true
        }
      })

      // Si non trouvé, essayer par userId
      if (!teacher) {
        teacher = await prisma.teacher.findFirst({
          where: { userId: teacherId },
          include: {
            user: true
          }
        })
      }

      if (!teacher) {
        return NextResponse.json(
          { error: 'Enseignant non trouvé' },
          { status: 404 }
        )
      }

      // Utiliser l'ID correct de l'enseignant pour la mise à jour
      const updatedTeacherId = teacher.id
      
      // Mettre à jour la classe
      const updatedClass = await prisma.renamedclass.update({
        where: { id },
        data: {
          name,
          level,
          year,
          teacherId: updatedTeacherId,
        },
        include: {
          teacher: {
            include: {
              user: true
            }
          }
        }
      })

      return NextResponse.json({
        id: updatedClass.id,
        name: updatedClass.name,
        level: updatedClass.level,
        year: updatedClass.year,
        teacher: {
          id: updatedClass.teacher?.id,
          firstName: updatedClass.teacher?.user.firstName,
          lastName: updatedClass.teacher?.user.lastName
        },
        studentCount: existingClass.students.length
      })
    }

    // Mettre à jour la classe sans modifier l'enseignant
    const updatedClass = await prisma.renamedclass.update({
      where: { id },
      data: {
        name,
        level,
        year
      },
      include: {
        teacher: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json({
      id: updatedClass.id,
      name: updatedClass.name,
      level: updatedClass.level,
      year: updatedClass.year,
      teacher: {
        id: updatedClass.teacher?.id,
        firstName: updatedClass.teacher?.user.firstName,
        lastName: updatedClass.teacher?.user.lastName
      },
      studentCount: existingClass.students.length
    })
  } catch (error) {
    console.error('Erreur PUT /api/classes :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la classe' },
      { status: 500 }
    )
  }
}

// DELETE /api/classes - Supprimer une classe
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent supprimer des classes.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la classe requis' },
        { status: 400 }
      )
    }

    // Vérifier si la classe existe
    const existingClass = await prisma.renamedclass.findUnique({
      where: { id },
      include: {
        students: true,
      },
    })

    if (!existingClass) {
      return NextResponse.json(
        { error: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si la classe a des élèves
    if (existingClass.students.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une classe qui a des élèves. Veuillez d\'abord réassigner ou supprimer les élèves de cette classe.' },
        { status: 400 }
      )
    }

    // Supprimer la classe
    await prisma.renamedclass.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Classe supprimée avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur DELETE /api/classes :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la classe' },
      { status: 500 }
    )
  }
} 