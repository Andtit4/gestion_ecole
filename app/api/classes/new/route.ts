import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/classes/new - Pour initialiser le formulaire de création de classe
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    // Récupérer la liste des enseignants disponibles pour le formulaire
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

    // Renvoyer un objet avec les données dont a besoin le formulaire
    return NextResponse.json({
      teachers: processedTeachers,
      // Année académique actuelle
      currentYear: new Date().getFullYear(),
      // Structure pour une nouvelle classe (valeurs par défaut)
      newClass: {
        name: '',
        level: '',
        year: new Date().getFullYear(),
        teacherId: processedTeachers.length > 0 ? processedTeachers[0].id : ''
      }
    })
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du formulaire de classe:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
} 