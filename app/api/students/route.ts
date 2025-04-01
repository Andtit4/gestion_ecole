import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// GET /api/students
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const students = await prisma.student.findMany({
      include: {
        class: {
          select: {
            name: true,
            level: true,
          },
        },
      },
      orderBy: {
        lastName: 'asc',
      },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/students
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, email, dateOfBirth, classId, password } = body

    // Validation des données
    if (!firstName || !lastName || !email || !dateOfBirth || !classId || !password) {
      return NextResponse.json(
        { message: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    })

    if (existingStudent) {
      return NextResponse.json(
        { message: 'Un élève avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Vérifier si la classe existe
    const existingClass = await prisma.class.findUnique({
      where: { id: classId },
    })

    if (!existingClass) {
      return NextResponse.json(
        { message: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'élève
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        dateOfBirth: new Date(dateOfBirth),
        classId,
        password: hashedPassword,
        role: 'STUDENT',
      },
      include: {
        class: {
          select: {
            name: true,
            level: true,
          },
        },
      },
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error('Erreur lors de la création de l\'élève:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 