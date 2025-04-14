import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

// GET /api/parents - Récupérer la liste des parents
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
    const search = searchParams.get('search') || ''

    const parents = await prisma.user.findMany({
      where: {
        role: 'PARENT',
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        _count: {
          select: {
            children: true
          }
        }
      },
      orderBy: {
        lastName: 'asc'
      }
    })

    // Transformer les résultats pour inclure childrenCount
    const formattedParents = parents.map(parent => ({
      id: parent.id,
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      childrenCount: parent._count.children
    }))

    return NextResponse.json(formattedParents)
  } catch (error) {
    console.error('Erreur lors de la récupération des parents:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/parents - Créer un nouveau parent
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { firstName, lastName, email, password, childrenIds } = await request.json()

    // Vérifier que les champs obligatoires sont fournis
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Les champs firstName, lastName, email et password sont obligatoires' },
        { status: 400 }
      )
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer le parent
    const parent = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'PARENT'
      }
    })

    // Si des enfants sont spécifiés, créer les associations
    if (Array.isArray(childrenIds) && childrenIds.length > 0) {
      await Promise.all(
        childrenIds.map(childId =>
          prisma.parentChild.create({
            data: {
              parentId: parent.id,
              childId
            }
          })
        )
      )
    }

    return NextResponse.json(
      { message: 'Parent créé avec succès', parent: { id: parent.id, firstName, lastName, email } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création du parent:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 