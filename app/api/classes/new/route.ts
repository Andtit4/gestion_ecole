import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/classes/new - Pour initialiser le formulaire de création de classe
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 })
    }

    // Récupérer la liste des enseignants disponibles pour le formulaire
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        user: {
          lastName: 'asc'
        }
      }
    })

    // Convertir les données pour avoir un format cohérent
    const processedTeachers = teachers.map(teacher => {
      return {
        id: teacher.id, // ID de l'enseignant (pas l'ID de l'utilisateur)
        firstName: teacher.user.firstName || 'Prénom',
        lastName: teacher.user.lastName || 'Nom',
        email: teacher.user.email
      };
    });

    console.log('Teachers for class form:', processedTeachers);

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


