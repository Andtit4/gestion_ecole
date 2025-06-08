import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/users - récupérer la liste des utilisateurs avec filtrage possible par rôle
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const classId = searchParams.get('classId')

    let whereClause: any = {}
    
    if (role) {
      whereClause.role = role
    }
    
    if (classId) {
      whereClause.classId = classId
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        classId: true,
        class: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
      orderBy: {
        lastName: 'asc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/users - créer un nouvel utilisateur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER')) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { firstName, lastName, email, password, role, classId } = body

    // Vérification des données obligatoires
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Données obligatoires manquantes' },
        { status: 400 }
      )
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        ...(classId ? { classId } : {}),
      },
    })

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 


