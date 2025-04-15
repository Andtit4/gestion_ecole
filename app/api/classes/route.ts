/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/classes - Récupérer toutes les classes
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const level = searchParams.get('level')

    const where: Record<string, unknown> = {}
    if (level) {
      where.level = level
    }

    const classes = await prisma.class.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        students: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { name: 'asc' },
      ],
    })

    // Transformer le résultat pour ajouter le comptage des élèves
    const transformedClasses = classes.map(c => ({
      id: c.id,
      name: c.name,
      level: c.level,
      year: c.year,
      teacher: c.teacher,
      studentCount: c.students.length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))

    return NextResponse.json(transformedClasses)
  } catch (error) {
    console.error('Erreur GET /api/classes :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des classes' },
      { status: 500 }
    )
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
    const teacher = await prisma.user.findFirst({
      where: { id: teacherId, role: 'TEACHER' },
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }

    // Créer la classe
    const newClass = await prisma.class.create({
      data: {
        name,
        level,
        year,
        teacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json({
      ...newClass,
      studentCount: 0, // Nouvelle classe, donc pas d'élèves
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
    const existingClass = await prisma.class.findUnique({
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
      const teacher = await prisma.user.findFirst({
        where: { id: teacherId, role: 'TEACHER' },
      })

      if (!teacher) {
        return NextResponse.json(
          { error: 'Enseignant non trouvé' },
          { status: 404 }
        )
      }
    }

    // Mettre à jour la classe
    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name: name ?? existingClass.name,
        level: level ?? existingClass.level,
        year: year ?? existingClass.year,
        teacherId: teacherId ?? existingClass.teacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json({
      ...updatedClass,
      studentCount: existingClass.students.length,
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
    const existingClass = await prisma.class.findUnique({
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
    await prisma.class.delete({
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