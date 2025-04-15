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
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const level = searchParams.get('level')

    const where: Record<string, unknown> = {}
    if (level) {
      where.level = level
    }

    const classes = await prisma.class.findMany({
      where,
      select: {
        id: true,
        name: true,
        level: true,
        year: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        students: {
          select: {
            id: true,
          }
        }
      },
      orderBy: [
        { level: 'asc' },
        { name: 'asc' },
      ],
    })

    // Ajouter le nombre d'élèves pour chaque classe
    const classesWithStudentCount = classes.map(class_ => ({
      id: class_.id,
      name: class_.name,
      level: class_.level,
      year: class_.year,
      teacher: class_.teacher,
      studentCount: class_.students.length,
    }))

    return NextResponse.json(classesWithStudentCount)
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

    // Vérifier si la classe existe déjà
    const existingClass = await prisma.class.findFirst({
      where: {
        name,
        level,
        year,
      },
    })

    if (existingClass) {
      return NextResponse.json(
        { error: 'Une classe avec ce nom, niveau et année existe déjà' },
        { status: 400 }
      )
    }

    // Vérifier si l'enseignant existe
    const teacher = await prisma.user.findFirst({
      where: { 
        id: teacherId,
        role: 'TEACHER'
      },
    })

    if (!teacher) {
      return NextResponse.json(
        { error: 'L\'enseignant spécifié n\'existe pas' },
        { status: 400 }
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
          }
        },
      },
    })

    return NextResponse.json(newClass, { status: 201 })
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
    const classToUpdate = await prisma.class.findUnique({
      where: { id },
    })

    if (!classToUpdate) {
      return NextResponse.json(
        { error: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    // Si teacherId est fourni, vérifier si l'enseignant existe
    if (teacherId) {
      const teacher = await prisma.user.findFirst({
        where: { 
          id: teacherId,
          role: 'TEACHER'
        },
      })

      if (!teacher) {
        return NextResponse.json(
          { error: 'L\'enseignant spécifié n\'existe pas' },
          { status: 400 }
        )
      }
    }

    // Mettre à jour la classe
    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name: name ?? classToUpdate.name,
        level: level ?? classToUpdate.level,
        year: year ?? classToUpdate.year,
        teacherId: teacherId ?? classToUpdate.teacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
      },
    })

    return NextResponse.json(updatedClass)
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
    const classToDelete = await prisma.class.findUnique({
      where: { id },
      include: {
        students: true,
      },
    })

    if (!classToDelete) {
      return NextResponse.json(
        { error: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si la classe a des élèves
    if (classToDelete.students.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une classe qui contient des élèves' },
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