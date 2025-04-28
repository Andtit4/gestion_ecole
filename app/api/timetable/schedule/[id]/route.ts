import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation pour la mise à jour
const updateScheduleSchema = z.object({
  courseId: z.string().uuid().optional(),
  teacherId: z.string().uuid().optional(),
  room: z.string().min(1).optional(),
})

// GET /api/timetable/schedule/[id] - Récupérer un cours spécifique de l'emploi du temps
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
        class: {
          select: {
            id: true,
            name: true
          }
        },
        course: {
          select: {
            id: true,
            name: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        timeslot: true
      }
    })
    
    if (!schedule) {
      return NextResponse.json(
        { message: 'Cours non trouvé dans l\'emploi du temps' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/timetable/schedule/[id] - Mettre à jour un cours dans l'emploi du temps
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé. Seuls les administrateurs peuvent modifier l\'emploi du temps.' },
        { status: 401 }
      )
    }
    
    const id = params.id
    const body = await request.json()
    
    // Valider les données
    const validationResult = updateScheduleSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Données invalides', errors: validationResult.error.format() },
        { status: 400 }
      )
    }
    
    // Vérifier si le cours existe
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        timeslot: true
      }
    })
    
    if (!existingSchedule) {
      return NextResponse.json(
        { message: 'Cours non trouvé dans l\'emploi du temps' },
        { status: 404 }
      )
    }
    
    const { courseId, teacherId, room } = validationResult.data
    
    const updateData: any = {}
    
    if (room) updateData.room = room
    
    if (courseId) {
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
      
      updateData.courseId = courseId
    }
    
    if (teacherId) {
      // Vérifier si l'enseignant existe
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        include: { user: true }
      })
      
      if (!teacher) {
        return NextResponse.json(
          { message: 'Enseignant non trouvé' },
          { status: 404 }
        )
      }
      
      // Vérifier si l'enseignant est déjà occupé à ce créneau
      if (teacherId !== existingSchedule.teacher.id) {
        const existingForTeacher = await prisma.schedule.findFirst({
          where: {
            userId: teacher.user.id,
            timeSlotId: existingSchedule.timeSlotId,
            timeslot: {
              dayOfWeek: existingSchedule.timeslot.dayOfWeek
            },
            id: { not: id }
          }
        })
        
        if (existingForTeacher) {
          return NextResponse.json(
            { message: 'Cet enseignant a déjà un cours à ce créneau horaire' },
            { status: 409 }
          )
        }
      }
      
      updateData.userId = teacher.user.id
    }
    
    // Mettre à jour le cours
    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: updateData,
      include: {
        class: {
          select: {
            id: true,
            name: true
          }
        },
        course: {
          select: {
            id: true,
            name: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        timeslot: true
      }
    })
    
    return NextResponse.json(updatedSchedule)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/timetable/schedule/[id] - Supprimer un cours de l'emploi du temps
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé. Seuls les administrateurs peuvent modifier l\'emploi du temps.' },
        { status: 401 }
      )
    }
    
    const id = params.id
    
    // Vérifier si le cours existe
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id }
    })
    
    if (!existingSchedule) {
      return NextResponse.json(
        { message: 'Cours non trouvé dans l\'emploi du temps' },
        { status: 404 }
      )
    }
    
    // Supprimer le cours
    await prisma.schedule.delete({
      where: { id }
    })
    
    return NextResponse.json(
      { message: 'Cours supprimé avec succès de l\'emploi du temps' }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 