import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/teachers - Récupérer tous les enseignants
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Récupérer tous les enseignants avec les données utilisateur associées
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true, 
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: [
        {
          user: {
            lastName: 'asc',
          },
        },
        {
          user: {
            firstName: 'asc',
          },
        },
      ],
    })
    
    // Transformer les données pour une structure plus simple
    const formattedTeachers = teachers.map(teacher => ({
      id: teacher.id,
      userId: teacher.userId,
      firstName: teacher.user.firstName,
      lastName: teacher.user.lastName,
      email: teacher.user.email
    }))
    
    return NextResponse.json(formattedTeachers)
  } catch (error) {
    console.error('Erreur lors de la récupération des enseignants:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des enseignants', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
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
    console.log('Données reçues dans POST /api/teachers:', body)
    
    // Extraire seulement les champs nécessaires
    const firstName = body.firstName || '';
    const lastName = body.lastName || '';
    const email = body.email || '';
    const password = body.password || '';

    // Validation des données avec des messages d'erreur spécifiques
    const validationErrors = [];
    if (!firstName) validationErrors.push('Le prénom est requis');
    if (!lastName) validationErrors.push('Le nom est requis');
    if (!email) validationErrors.push('L\'email est requis');
    if (!password) validationErrors.push('Le mot de passe est requis');

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validationErrors,
          receivedData: { firstName, lastName, email, hasPassword: !!password }
        },
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

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur et l'enseignant dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur avec le rôle TEACHER
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: 'TEACHER'
        }
      })

      // Créer l'enseignant avec seulement l'userId
      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
        }
      })

      // Renvoyer l'enseignant avec les informations complètes de l'utilisateur
      return {
        id: teacher.id,
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'enseignant:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'enseignant', details: error instanceof Error ? error.message : String(error) },
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
    console.log('Données reçues dans PUT /api/teachers:', body)
    const { id, firstName, lastName, email, password } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'enseignant requis' },
        { status: 400 }
      )
    }

    // Récupérer l'enseignant existant (qui ne contient que userId)
    let teacherRecord = await prisma.teacher.findUnique({
      where: { id }
    })

    // Si nous n'avons pas trouvé un enseignant avec cet ID, 
    // vérifions si c'est un ID d'utilisateur et trouvons l'enseignant associé
    if (!teacherRecord) {
      teacherRecord = await prisma.teacher.findFirst({
        where: { userId: id }
      })
      
      if (!teacherRecord) {
        return NextResponse.json(
          { error: 'Enseignant non trouvé' },
          { status: 404 }
        )
      }
    }

    // Récupérer les données de l'utilisateur associé
    const userData = await prisma.user.findUnique({
      where: { id: teacherRecord.userId }
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'Utilisateur associé à l\'enseignant non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'email existe déjà (sauf pour cet utilisateur)
    if (email && email !== userData.email) {
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

    // Mettre à jour l'utilisateur dans une transaction
    const result = await prisma.$transaction(async (tx) => {
      // Mettre à jour l'utilisateur
      // Définir un type plus spécifique pour userUpdateData
      const userUpdateData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
      } = {};
      
      if (firstName) userUpdateData.firstName = firstName
      if (lastName) userUpdateData.lastName = lastName
      if (email) userUpdateData.email = email
      if (password) userUpdateData.password = await bcrypt.hash(password, 12)

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: teacherRecord.userId },
          data: userUpdateData
        })
      }

      // Récupérer les données mises à jour
      const updatedUser = await tx.user.findUnique({
        where: { id: teacherRecord.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      })

      // Vérification de sécurité pour s'assurer que updatedUser n'est pas null
      if (!updatedUser) {
        throw new Error("Impossible de récupérer les données utilisateur après mise à jour");
      }

      // Renvoyer l'enseignant avec les informations de l'utilisateur
      return {
        id: teacherRecord.id,
        userId: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'enseignant:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'enseignant', details: error instanceof Error ? error.message : String(error) },
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

    // Supprimer l'enseignant et l'utilisateur dans une transaction
    await prisma.$transaction(async (tx) => {
      // Supprimer l'enseignant
      await tx.teacher.delete({
        where: { id }
      })

      // Supprimer l'utilisateur
      await tx.user.delete({
        where: { id: teacher.userId }
      })
    })

    return NextResponse.json(
      { message: 'Enseignant supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'enseignant:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'enseignant' },
      { status: 500 }
    )
  }
} 


