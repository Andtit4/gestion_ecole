import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    const subjects = await prisma.subject.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Erreur lors de la récupération des matières:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    const data = await request.json()
    const { name } = data

    if (!name) {
      return new NextResponse('Le nom de la matière est requis', { status: 400 })
    }

    // Vérifier si la matière existe déjà
    const existingSubject = await prisma.subject.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })

    if (existingSubject) {
      return new NextResponse('Cette matière existe déjà', { status: 400 })
    }

    const subject = await prisma.subject.create({
      data: {
        name
      }
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error('Erreur lors de la création de la matière:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
} 