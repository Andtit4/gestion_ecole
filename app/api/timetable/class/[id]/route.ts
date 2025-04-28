import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/timetable/class/[id] - Récupérer l'emploi du temps d'une classe spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // S'assurer que params est bien résolu avant d'utiliser ses propriétés
    const classId = params.id
    
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    // Vérifier si la classe existe
    const classExists = await prisma.renamedclass.findUnique({
      where: { id: classId }
    })
    
    if (!classExists) {
      return NextResponse.json(
        { message: 'Classe non trouvée' },
        { status: 404 }
      )
    }
    
    // Récupérer l'emploi du temps de la classe
    const schedule = await prisma.schedule.findMany({
      where: { classId },
      include: {
        course: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        timeslot: true
      },
      orderBy: [
        { timeslot: { dayOfWeek: 'asc' } },
        { timeslot: { startTime: 'asc' } }
      ]
    })
    
    // Formater les données pour l'affichage
    const formattedSchedule = schedule.map(entry => {
      console.log('Entry de la base de données:', {
        id: entry.id,
        timeSlotId: entry.timeSlotId,
        dayOfWeek: entry.timeslot.dayOfWeek
      });
      
      return {
        id: entry.id,
        classId: entry.classId,
        courseId: entry.courseId,
        teacherId: entry.user.id,
        timeSlotId: entry.timeSlotId,
        dayOfWeek: entry.timeslot.dayOfWeek,
        room: entry.room,
        course: {
          id: entry.course.id,
          name: entry.course.name
        },
        teacher: {
          id: entry.user.id,
          firstName: entry.user.firstName,
          lastName: entry.user.lastName
        }
      };
    })
    
    console.log('Emploi du temps formaté:', formattedSchedule);
    return NextResponse.json(formattedSchedule)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 