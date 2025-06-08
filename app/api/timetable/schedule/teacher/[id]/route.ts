import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/timetable/schedule/teacher/[id] - Récupérer l'emploi du temps d'un enseignant spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    const teacherId = params.id
    
    // Vérifier si l'enseignant existe
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId }
    })
    
    if (!teacher || teacher.role !== 'TEACHER') {
      return NextResponse.json(
        { message: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }
    
    // Récupérer l'emploi du temps de l'enseignant
    const schedules = await prisma.schedule.findMany({
      where: { teacherId },
      include: {
        class: true,
        course: true,
        timeSlot: true
      },
      orderBy: [
        { timeSlot: { dayOfWeek: 'asc' } },
        { timeSlot: { startTime: 'asc' } }
      ]
    })
    
    // Formater les données pour l'affichage
    const formattedSchedules = schedules.map(schedule => ({
      id: schedule.id,
      classId: schedule.classId,
      courseId: schedule.courseId,
      teacherId: schedule.teacherId,
      timeSlotId: schedule.timeSlotId,
      room: schedule.room,
      class: {
        id: schedule.class.id,
        name: schedule.class.name
      },
      course: {
        id: schedule.course.id,
        name: schedule.course.name
      },
      timeSlot: schedule.timeSlot
    }))
    
    return NextResponse.json(formattedSchedules)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps de l\'enseignant:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de l\'emploi du temps de l\'enseignant' },
      { status: 500 }
    )
  }
} 