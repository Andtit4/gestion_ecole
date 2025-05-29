import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/students - Récupérer tous les étudiants avec filtres optionnels
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/students - Début de la requête');
    
    const session = await getServerSession(authOptions)
    console.log('Session utilisateur:', session?.user?.email, 'Rôle:', session?.user?.role);
    
    // Commenté temporairement pour le débogage
    // if (!session) {
    //   console.log('GET /api/students - Non autorisé: aucune session');
    //   return NextResponse.json(
    //     { error: 'Non autorisé' },
    //     { status: 401 }
    //   )
    // }

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const classId = searchParams.get('classId')
    
    console.log('Paramètres de recherche:', { search, classId });

    // Construire la requête avec les filtres
    const where: any = {}

    // Si un parent est connecté, on limite l'accès à ses enfants
    if (session?.user?.role === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId: session.user.id }
      });
      
      if (!parent) {
        console.log('GET /api/students - Parent non trouvé dans la base de données');
        return NextResponse.json(
          { error: 'Parent non trouvé' },
          { status: 404 }
        )
      }
      
      where.id = {
        in: await prisma.parentstudent.findMany({
          where: { parentId: parent.id },
          select: { studentId: true }
        }).then(relations => relations.map(r => r.studentId))
      }
      
      console.log(`Filtrage pour le parent ${parent.id} - Enfants:`, where.id);
    }

    // Filtre par classe
    if (classId) {
      where.classId = classId
    }

    // Filtre par recherche (nom, prénom, email)
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search } } },
        { user: { lastName: { contains: search } } },
        { user: { email: { contains: search } } }
      ]
    }

    console.log('Requête Prisma - where:', JSON.stringify(where, null, 2));

    // Récupérer les étudiants
    const students = await prisma.student.findMany({
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
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      },
      orderBy: [
        { user: { lastName: 'asc' } },
        { user: { firstName: 'asc' } }
      ]
    })

    console.log(`GET /api/students - ${students.length} étudiants trouvés`);
    return NextResponse.json(students)
  } catch (error) {
    console.error('Erreur GET /api/students :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des étudiants' },
      { status: 500 }
    )
  }
}

// POST /api/students - Créer un nouvel étudiant
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent créer des étudiants.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { firstName, lastName, email, password, classId, parentIds } = body

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

    // Vérifier si la classe existe (si fournie)
    if (classId) {
      const classExists = await prisma.renamedclass.findUnique({
        where: { id: classId }
      })

      if (!classExists) {
        return NextResponse.json(
          { error: 'La classe spécifiée n\'existe pas' },
          { status: 404 }
        )
      }
    }

    // Créer l'utilisateur et l'étudiant dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password, // Dans une application réelle, vous devriez hacher le mot de passe
          role: 'STUDENT'
        }
      })

      // Créer l'étudiant
      const student = await tx.student.create({
        data: {
          userId: user.id,
          classId: classId || null
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          class: {
            select: {
              id: true,
              name: true,
              level: true
            }
          }
        }
      })

      // Si des IDs de parents sont fournis, créer les relations
      if (parentIds && parentIds.length > 0) {
        for (const parentId of parentIds) {
          await tx.parentstudent.create({
            data: {
              parentId,
              studentId: student.id
            }
          })
        }
      }

      return student
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/students :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'étudiant' },
      { status: 500 }
    )
  }
}

// PUT /api/students - Mettre à jour un étudiant existant
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent modifier des étudiants.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id, firstName, lastName, email, password, classId, parentIds } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'étudiant requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Étudiant non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'email existe déjà (sauf pour cet utilisateur)
    if (email && email !== student.user.email) {
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

    // Vérifier si la classe existe (si fournie)
    if (classId) {
      const classExists = await prisma.renamedclass.findUnique({
        where: { id: classId }
      })

      if (!classExists) {
        return NextResponse.json(
          { error: 'La classe spécifiée n\'existe pas' },
          { status: 404 }
        )
      }
    }

    // Mettre à jour l'utilisateur et l'étudiant dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Mettre à jour l'utilisateur
      const userUpdateData: any = {}
      if (firstName) userUpdateData.firstName = firstName
      if (lastName) userUpdateData.lastName = lastName
      if (email) userUpdateData.email = email
      if (password) userUpdateData.password = password // Dans une application réelle, vous devriez hacher le mot de passe

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: student.userId },
          data: userUpdateData
        })
      }

      // Mettre à jour l'étudiant
      const studentUpdateData: any = {}
      if (classId !== undefined) studentUpdateData.classId = classId || null

      const updatedStudent = await tx.student.update({
        where: { id },
        data: studentUpdateData,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          class: {
            select: {
              id: true,
              name: true,
              level: true
            }
          }
        }
      })

      // Si des IDs de parents sont fournis, mettre à jour les relations
      if (parentIds) {
        // Supprimer toutes les relations existantes
        await tx.parentstudent.deleteMany({
          where: { studentId: id }
        })

        // Créer les nouvelles relations
        for (const parentId of parentIds) {
          await tx.parentstudent.create({
            data: {
              parentId,
              studentId: id
            }
          })
        }
      }

      return updatedStudent
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur PUT /api/students :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'étudiant' },
      { status: 500 }
    )
  }
}

// DELETE /api/students - Supprimer un étudiant
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent supprimer des étudiants.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'étudiant requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Étudiant non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer l'étudiant et l'utilisateur dans une transaction
    await prisma.$transaction(async (tx) => {
      // Supprimer toutes les relations parent-étudiant
      await tx.parentstudent.deleteMany({
        where: { studentId: id }
      })

      // Supprimer l'étudiant
      await tx.student.delete({
        where: { id }
      })

      // Supprimer l'utilisateur
      await tx.user.delete({
        where: { id: student.userId }
      })
    })

    return NextResponse.json(
      { message: 'Étudiant supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur DELETE /api/students :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'étudiant' },
      { status: 500 }
    )
  }
} 