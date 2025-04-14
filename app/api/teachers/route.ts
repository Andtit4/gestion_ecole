import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    const teachers = await prisma.user.findMany({
      where: {
        role: 'TEACHER'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      },
      orderBy: {
        lastName: 'asc'
      }
    })

    // Définition de l'interface pour le type d'enseignant
    interface Teacher {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      email?: string;
    }

    // Assurer que chaque enseignant a un firstName et lastName
    const processedTeachers = teachers.map((teacher: Teacher) => {
      return {
        ...teacher,
        firstName: teacher.firstName || 'Prénom',
        lastName: teacher.lastName || 'Nom'
      };
    });

    return NextResponse.json(processedTeachers)
  } catch (error) {
    console.error('Erreur lors de la récupération des enseignants:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
} 