import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/timetable/schedule - Récupérer tous les emplois du temps
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    const schedules = await prisma.schedule.findMany({
      include: {
        class: true,
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
      }
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
      teacher: {
        id: schedule.teacher.id,
        name: `${schedule.teacher.firstName} ${schedule.teacher.lastName}`
      },
      timeSlot: schedule.timeSlot
    }))
    
    return NextResponse.json(formattedSchedules)
  } catch (error) {
    console.error('Erreur lors de la récupération des emplois du temps:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des emplois du temps' },
      { status: 500 }
    )
  }
}

// POST /api/timetable/schedule - Créer un nouvel emploi du temps
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    const { classId, courseId, teacherId, timeSlotId, room } = await request.json()
    
    // Validation des données
    if (!classId || !courseId || !teacherId || !timeSlotId || !room) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }
    
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
    
    // Vérifier si le cours existe
    const courseExists = await prisma.course.findUnique({
      where: { id: courseId }
    })
    
    if (!courseExists) {
      return NextResponse.json(
        { message: 'Cours non trouvé' },
        { status: 404 }
      )
    }
    
    // Vérifier si l'enseignant existe
    const teacherExists = await prisma.user.findUnique({
      where: { id: teacherId }
    })
    
    if (!teacherExists || teacherExists.role !== 'TEACHER') {
      return NextResponse.json(
        { message: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }
    
    // Vérifier si le créneau horaire existe
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId }
    })
    
    if (!timeSlot) {
      return NextResponse.json(
        { message: 'Créneau horaire non trouvé' },
        { status: 404 }
      )
    }
    
    // Vérifier si ce créneau est déjà occupé pour cette classe
    const existingScheduleForClass = await prisma.schedule.findFirst({
      where: {
        classId,
        timeSlotId
      }
    })
    
    if (existingScheduleForClass) {
      return NextResponse.json(
        { message: 'Ce créneau horaire est déjà utilisé pour cette classe' },
        { status: 400 }
      )
    }
    
    // Vérifier si ce créneau est déjà occupé pour cet enseignant
    const existingScheduleForTeacher = await prisma.schedule.findFirst({
      where: {
        teacherId,
        timeSlotId
      }
    })
    
    if (existingScheduleForTeacher) {
      return NextResponse.json(
        { message: 'Cet enseignant est déjà occupé pendant ce créneau horaire' },
        { status: 400 }
      )
    }
    
    // Créer l'emploi du temps
    const schedule = await prisma.schedule.create({
      data: {
        classId,
        courseId,
        teacherId,
        timeSlotId,
        room
      },
      include: {
        class: true,
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
      }
    })
    
    // Formater les données pour l'affichage
    const formattedSchedule = {
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
      teacher: {
        id: schedule.teacher.id,
        name: `${schedule.teacher.firstName} ${schedule.teacher.lastName}`
      },
      timeSlot: schedule.timeSlot
    }
    
    return NextResponse.json(formattedSchedule, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de l\'emploi du temps:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création de l\'emploi du temps' },
      { status: 500 }
    )
  }
} 