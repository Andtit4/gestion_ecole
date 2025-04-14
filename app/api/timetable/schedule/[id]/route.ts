import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/timetable/schedule/[id] - Récupérer un emploi du temps spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    const id = params.id
    
    const schedule = await prisma.schedule.findUnique({
      where: { id },
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
    
    if (!schedule) {
      return NextResponse.json(
        { message: 'Emploi du temps non trouvé' },
        { status: 404 }
      )
    }
    
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
    
    return NextResponse.json(formattedSchedule)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de l\'emploi du temps' },
      { status: 500 }
    )
  }
}

// PUT /api/timetable/schedule/[id] - Mettre à jour un emploi du temps
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    const id = params.id
    const { classId, courseId, teacherId, timeSlotId, room } = await request.json()
    
    // Validation des données
    if (!classId || !courseId || !teacherId || !timeSlotId || !room) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }
    
    // Vérifier si l'emploi du temps existe
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id }
    })
    
    if (!existingSchedule) {
      return NextResponse.json(
        { message: 'Emploi du temps non trouvé' },
        { status: 404 }
      )
    }
    
    // Si le créneau horaire a changé, vérifier les conflits
    if (timeSlotId !== existingSchedule.timeSlotId) {
      // Vérifier si ce créneau est déjà occupé pour cette classe
      const existingScheduleForClass = await prisma.schedule.findFirst({
        where: {
          classId,
          timeSlotId,
          id: { not: id }
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
          timeSlotId,
          id: { not: id }
        }
      })
      
      if (existingScheduleForTeacher) {
        return NextResponse.json(
          { message: 'Cet enseignant est déjà occupé pendant ce créneau horaire' },
          { status: 400 }
        )
      }
    }
    
    // Mettre à jour l'emploi du temps
    const updatedSchedule = await prisma.schedule.update({
      where: { id },
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
      id: updatedSchedule.id,
      classId: updatedSchedule.classId,
      courseId: updatedSchedule.courseId,
      teacherId: updatedSchedule.teacherId,
      timeSlotId: updatedSchedule.timeSlotId,
      room: updatedSchedule.room,
      class: {
        id: updatedSchedule.class.id,
        name: updatedSchedule.class.name
      },
      course: {
        id: updatedSchedule.course.id,
        name: updatedSchedule.course.name
      },
      teacher: {
        id: updatedSchedule.teacher.id,
        name: `${updatedSchedule.teacher.firstName} ${updatedSchedule.teacher.lastName}`
      },
      timeSlot: updatedSchedule.timeSlot
    }
    
    return NextResponse.json(formattedSchedule)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'emploi du temps:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de l\'emploi du temps' },
      { status: 500 }
    )
  }
}

// DELETE /api/timetable/schedule/[id] - Supprimer un emploi du temps
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    const id = params.id
    
    // Vérifier si l'emploi du temps existe
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id }
    })
    
    if (!existingSchedule) {
      return NextResponse.json(
        { message: 'Emploi du temps non trouvé' },
        { status: 404 }
      )
    }
    
    // Supprimer l'emploi du temps
    await prisma.schedule.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Emploi du temps supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'emploi du temps:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de l\'emploi du temps' },
      { status: 500 }
    )
  }
} 