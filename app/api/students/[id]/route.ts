import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/students/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const id = params.id
    
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { message: 'Élève non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'élève:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/students/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER')) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const id = params.id
    const body = await request.json()
    
    // Validation des données
    if (!body.name || !body.email) {
      return NextResponse.json(
        { message: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Vérifier si l'élève existe
    const existingStudent = await prisma.student.findUnique({
      where: { id },
    })

    if (!existingStudent) {
      return NextResponse.json(
        { message: 'Élève non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour l'élève
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        classId: body.classId,
        parentId: body.parentId,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'élève:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/students/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const id = params.id

    // Vérifier si l'élève existe
    const existingStudent = await prisma.student.findUnique({
      where: { id },
    })

    if (!existingStudent) {
      return NextResponse.json(
        { message: 'Élève non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer les notes de l'élève
    await prisma.grade.deleteMany({
      where: { studentId: id },
    })

    // Supprimer les présences de l'élève
    await prisma.attendance.deleteMany({
      where: { studentId: id },
    })

    // Supprimer l'élève
    await prisma.student.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Élève supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élève:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 