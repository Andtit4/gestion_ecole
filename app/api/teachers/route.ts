import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/teachers - Récupérer tous les enseignants
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')
    const courseId = searchParams.get('courseId')

    const where: Record<string, unknown> = {
      role: 'TEACHER',
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ]
    }

    // Si on cherche par cours, il faut une jointure avec la table des cours
    let teachers
    if (courseId) {
      teachers = await prisma.user.findMany({
        where: {
          role: 'TEACHER',
          courses: {
            some: {
              id: courseId
            }
          }
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' },
        ],
      })
    } else {
      teachers = await prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          { lastName: 'asc' },
          { firstName: 'asc' },
        ],
      })
    }

    return NextResponse.json(teachers)
  } catch (error) {
    console.error('Erreur GET /api/teachers :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des enseignants' },
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
    const teacher = await prisma.user.create({
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
    const teacher = await prisma.user.findFirst({
      where: { id, role: 'TEACHER' },
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

    // Supprimer l'enseignant
    await prisma.user.delete({
      where: { id },
    })

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