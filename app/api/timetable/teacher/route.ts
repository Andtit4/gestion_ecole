import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/timetable/teacher - Récupérer l'emploi du temps de l'enseignant connecté
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { message: 'Cette API est réservée aux enseignants' }, 
        { status: 403 }
      )
    }
    
    // Trouver l'enseignant correspondant à l'utilisateur connecté
    const teacher = await prisma.teacher.findFirst({
      where: { 
        userId: session.user.id
      }
    })
    
    if (!teacher) {
      return NextResponse.json(
        { message: 'Aucun profil d\'enseignant trouvé pour cet utilisateur' },
        { status: 404 }
      )
    }
    
    // Récupérer tous les cours de l'emploi du temps de l'enseignant
    const schedule = await prisma.schedule.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true,
          }
        },
        course: {
          select: {
            id: true,
            name: true,
          }
        },
        timeslot: true,
      },
      orderBy: [
        { timeslot: { dayOfWeek: 'asc' } },
        { timeslot: { startTime: 'asc' } },
      ]
    })
    
    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps de l\'enseignant:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 


