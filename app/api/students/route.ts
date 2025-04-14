import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/students - Récupérer la liste des étudiants
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
    const parentId = searchParams.get('parentId') || undefined
    
    // Base de la requête pour récupérer les étudiants
    const whereClause: any = {
      role: 'STUDENT',
    }
    
    // Recherche par nom, prénom ou email
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Si parentId est fourni, trouver les étudiants qui ne sont pas déjà associés à ce parent
    let excludedStudentIds: string[] = []
    if (parentId) {
      const parentChildRelations = await prisma.parentChild.findMany({
        where: { parentId },
        select: { childId: true }
      })
      
      excludedStudentIds = parentChildRelations.map(relation => relation.childId)
      
      if (excludedStudentIds.length > 0) {
        whereClause.id = { notIn: excludedStudentIds }
      }
    }

    const students = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error)
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
    const { name, email, classId, parentId } = body

    // Validation
    if (!name || !email || !classId) {
      return NextResponse.json(
        { message: 'Les champs nom, email et classe sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const emailExists = await prisma.student.findFirst({
      where: {
        email,
      },
    })

    if (emailExists) {
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

    // Vérifier si le parent existe (si fourni)
    if (parentId) {
      const existingParent = await prisma.user.findFirst({
        where: { 
          id: parentId,
          role: 'PARENT'
        },
      })

      if (!existingParent) {
        return NextResponse.json(
          { message: 'Parent non trouvé' },
          { status: 404 }
        )
      }
    }

    // Créer l'élève
    const student = await prisma.student.create({
      data: {
        name,
        email,
        classId,
        parentId,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'élève:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 