import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/parents - Récupérer tous les parents
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Vérifier les permissions (seul l'administrateur a accès à tous les parents)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Accès non autorisé à cette ressource' },
        { status: 403 }
      )
    }

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')

    // Construire la requête avec les filtres
    const where: any = {}

    // Filtre par recherche (nom, prénom, email)
    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }
    }

    // Récupérer les parents
    const parents = await prisma.parent.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        students: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                },
                class: {
                  select: {
                    name: true,
                    level: true
                  }
                }
              }
            }
          },
          take: 10 // Limiter le nombre d'étudiants retournés
        }
      },
      orderBy: [
        { user: { lastName: 'asc' } },
        { user: { firstName: 'asc' } }
      ]
    })

    // Transformer les données pour simplifier la structure
    const formattedParents = parents.map(parent => ({
      id: parent.id,
      user: parent.user,
      students: parent.students.map(ps => ({
        id: ps.student.id,
        firstName: ps.student.user.firstName,
        lastName: ps.student.user.lastName,
        className: ps.student.class?.name || null,
        level: ps.student.class?.level || null
      })),
      createdAt: parent.createdAt
    }))

    return NextResponse.json(formattedParents)
  } catch (error) {
    console.error('Erreur GET /api/parents :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des parents' },
      { status: 500 }
    )
  }
}

// POST /api/parents - Créer un nouveau parent
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent créer des parents.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { firstName, lastName, email, password, studentIds } = body

    // Validation des données
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Prénom, nom, email et mot de passe sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Créer le parent dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password, // Dans une application réelle, vous devriez hacher le mot de passe
          role: 'PARENT'
        }
      })

      // Créer le parent
      const parent = await tx.parent.create({
        data: {
          userId: user.id
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })

      // Si des IDs d'étudiants sont fournis, créer les relations
      if (studentIds && studentIds.length > 0) {
        for (const studentId of studentIds) {
          // Vérifier si l'étudiant existe
          const student = await tx.student.findUnique({
            where: { id: studentId }
          })

          if (!student) {
            throw new Error(`L'étudiant avec l'ID ${studentId} n'existe pas`)
          }

          await tx.parentStudent.create({
            data: {
              parentId: parent.id,
              studentId
            }
          })
        }
      }

      return parent
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Erreur POST /api/parents :', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du parent' },
      { status: 500 }
    )
  }
}

// PUT /api/parents - Mettre à jour un parent existant
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent modifier des parents.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id, firstName, lastName, email, password, studentIds } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID du parent requis' },
        { status: 400 }
      )
    }

    // Vérifier si le parent existe
    const parent = await prisma.parent.findUnique({
      where: { id },
      include: {
        user: true
      }
    })

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'email existe déjà (sauf pour cet utilisateur)
    if (email && email !== parent.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Un utilisateur avec cet email existe déjà' },
          { status: 400 }
        )
      }
    }

    // Mettre à jour le parent dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Mettre à jour l'utilisateur
      const userUpdateData: any = {}
      if (firstName) userUpdateData.firstName = firstName
      if (lastName) userUpdateData.lastName = lastName
      if (email) userUpdateData.email = email
      if (password) userUpdateData.password = password // Dans une application réelle, vous devriez hacher le mot de passe

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: parent.userId },
          data: userUpdateData
        })
      }

      // Mettre à jour le parent (pas de données à mettre à jour actuellement)
      const updatedParent = await tx.parent.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })

      // Si des IDs d'étudiants sont fournis, mettre à jour les relations
      if (studentIds) {
        // Supprimer toutes les relations existantes
        await tx.parentStudent.deleteMany({
          where: { parentId: id }
        })

        // Créer les nouvelles relations
        for (const studentId of studentIds) {
          // Vérifier si l'étudiant existe
          const student = await tx.student.findUnique({
            where: { id: studentId }
          })

          if (!student) {
            throw new Error(`L'étudiant avec l'ID ${studentId} n'existe pas`)
          }

          await tx.parentStudent.create({
            data: {
              parentId: id,
              studentId
            }
          })
        }
      }

      return updatedParent
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Erreur PUT /api/parents :', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour du parent' },
      { status: 500 }
    )
  }
}

// DELETE /api/parents - Supprimer un parent
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent supprimer des parents.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID du parent requis' },
        { status: 400 }
      )
    }

    // Vérifier si le parent existe
    const parent = await prisma.parent.findUnique({
      where: { id },
      include: {
        user: true
      }
    })

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le parent dans une transaction
    await prisma.$transaction(async (tx) => {
      // Supprimer toutes les relations parent-étudiant
      await tx.parentStudent.deleteMany({
        where: { parentId: id }
      })

      // Supprimer le parent
      await tx.parent.delete({
        where: { id }
      })

      // Supprimer l'utilisateur
      await tx.user.delete({
        where: { id: parent.userId }
      })
    })

    return NextResponse.json(
      { message: 'Parent supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur DELETE /api/parents :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du parent' },
      { status: 500 }
    )
  }
} 