import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/students - Récupérer tous les élèves avec filtres optionnels
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {
      role: 'STUDENT',
    }

    if (classId) {
      where.classId = classId
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const students = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        classId: true,
        class: {
          select: {
            id: true,
            name: true,
            level: true,
          }
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { class: { name: 'asc' } },
        { lastName: 'asc' },
        { firstName: 'asc' },
      ],
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Erreur GET /api/students :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des élèves' },
      { status: 500 }
    )
  }
}

// POST /api/students - Créer un nouvel élève
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent créer des élèves.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { firstName, lastName, email, password, classId } = body

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

    // Vérifier si la classe existe
    if (classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: classId },
      })

      if (!classExists) {
        return NextResponse.json(
          { error: 'La classe spécifiée n\'existe pas' },
          { status: 400 }
        )
      }
    }

    // Créer l'élève
    const student = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password, // Dans une application réelle, vous devriez hacher le mot de passe
        role: 'STUDENT',
        classId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        classId: true,
        class: {
          select: {
            id: true,
            name: true,
          }
        },
        createdAt: true,
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/students :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'élève' },
      { status: 500 }
    )
  }
}

// PUT /api/students - Mettre à jour un élève existant
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent modifier des élèves.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id, firstName, lastName, email, classId } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'élève requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'élève existe
    const student = await prisma.user.findFirst({
      where: { id, role: 'STUDENT' },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Élève non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si la classe existe
    if (classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: classId },
      })

      if (!classExists) {
        return NextResponse.json(
          { error: 'La classe spécifiée n\'existe pas' },
          { status: 400 }
        )
      }
    }

    // Vérifier si l'email existe déjà (sauf pour cet utilisateur)
    if (email && email !== student.email) {
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

    // Mettre à jour l'élève
    const updatedStudent = await prisma.user.update({
      where: { id },
      data: {
        firstName: firstName ?? student.firstName,
        lastName: lastName ?? student.lastName,
        email: email ?? student.email,
        classId: classId !== undefined ? classId : student.classId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        classId: true,
        class: {
          select: {
            id: true,
            name: true,
          }
        },
        updatedAt: true,
      },
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error('Erreur PUT /api/students :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'élève' },
      { status: 500 }
    )
  }
}

// DELETE /api/students - Supprimer un élève
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent supprimer des élèves.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'élève requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'élève existe
    const student = await prisma.user.findFirst({
      where: { id, role: 'STUDENT' },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Élève non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer l'élève
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Élève supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur DELETE /api/students :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'élève' },
      { status: 500 }
    )
  }
} 