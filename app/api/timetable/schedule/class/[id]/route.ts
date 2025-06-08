import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/timetable/schedule/class/[id] - Récupérer l'emploi du temps d'une classe spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    const classId = params.id
    
    // Vérifier si la classe existe
    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    })
    
    if (!classExists) {
      return NextResponse.json(
        { message: 'Classe non trouvée' },
        { status: 404 }
      )
    }
    
    // Récupérer l'emploi du temps de la classe
    const schedules = await prisma.schedule.findMany({
      where: { classId },
      include: {
        course: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
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
      course: {
        id: schedule.course.id,
        name: schedule.course.name
      },
      teacher: {
        id: schedule.teacher.id,
        name: `${schedule.teacher.firstName} ${schedule.teacher.lastName}`
      },
      timeSlot: schedule.timeSlot
    }))
    
    return NextResponse.json(formattedSchedules)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps de la classe:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de l\'emploi du temps de la classe' },
      { status: 500 }
    )
  }
} 