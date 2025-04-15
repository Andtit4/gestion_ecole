import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { studentId } = params

    // Vérifier si l'étudiant existe
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Étudiant non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier les permissions : administrateurs, enseignants, ou parents de l'étudiant
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      // Si c'est un parent, vérifier qu'il est bien parent de cet étudiant
      if (session.user.role === 'PARENT') {
        const isParentOfStudent = await prisma.parentStudent.findFirst({
          where: {
            studentId,
            parentId: session.user.id
          }
        })

        if (!isParentOfStudent) {
          return NextResponse.json(
            { error: 'Vous n\'êtes pas autorisé à accéder à ces informations' },
            { status: 403 }
          )
        }
      } else {
        // Tout autre rôle n'est pas autorisé
        return NextResponse.json(
          { error: 'Vous n\'êtes pas autorisé à accéder à ces informations' },
          { status: 403 }
        )
      }
    }

    // Récupérer les parents de l'étudiant
    const parentStudents = await prisma.parentStudent.findMany({
      where: { studentId },
      include: {
        parent: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    })

    // Formater les données pour n'inclure que les informations nécessaires
    const parents = parentStudents.map(ps => ({
      id: ps.parent.id,
      user: ps.parent.user
    }))

    return NextResponse.json(parents)
  } catch (error) {
    console.error('Erreur GET /api/students/[studentId]/parents :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des parents de l\'étudiant' },
      { status: 500 }
    )
  }
} 