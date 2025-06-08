import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation
const scheduleSchema = z.object({
  classId: z.string(),
  courseId: z.string(),
  teacherId: z.string(),
  timeSlotId: z.string(),
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']),
  room: z.string().min(1),
})

// GET /api/timetable/schedule - Récupérer tous les cours de l'emploi du temps
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    // Si un utilisateur enseignant est connecté, on limite aux cours qu'il enseigne
    let where = {}
    if (session.user.role === 'TEACHER') {
      where = { userId: session.user.id }
    }
    
    const schedule = await prisma.schedule.findMany({
      where,
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
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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
    console.error('Erreur lors de la récupération de l\'emploi du temps:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/timetable/schedule - Créer un nouveau cours dans l'emploi du temps
export async function POST(request: NextRequest) {
  try {
    console.log('--- POST /api/timetable/schedule - début de la requête ---')
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      console.log('Erreur d\'autorisation')
      return NextResponse.json(
        { message: 'Non autorisé. Seuls les administrateurs peuvent modifier l\'emploi du temps.' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    console.log('Données reçues:', body)
    
    // Valider les données
    const validationResult = scheduleSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('Erreur de validation:', validationResult.error.format())
      return NextResponse.json(
        { message: 'Données invalides', errors: validationResult.error.format() },
        { status: 400 }
      )
    }
    
    const { classId, courseId, teacherId, timeSlotId, dayOfWeek, room } = validationResult.data
    console.log('Données validées:', { classId, courseId, teacherId, timeSlotId, dayOfWeek, room })
    
    // Vérifier si la classe existe
    const classExists = await prisma.renamedclass.findUnique({
      where: { id: classId }
    })
    
    if (!classExists) {
      console.log('Classe non trouvée:', classId)
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
      console.log('Cours non trouvé:', courseId)
      return NextResponse.json(
        { message: 'Cours non trouvé' },
        { status: 404 }
      )
    }
    
    // Vérifier si l'enseignant existe - chercher d'abord dans la table teacher
    let teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { user: true }
    })
    
    // Si non trouvé, essayer de trouver l'enseignant par userId
    if (!teacher) {
      teacher = await prisma.teacher.findFirst({
        where: { userId: teacherId },
        include: { user: true }
      })
    }
    
    if (!teacher) {
      console.log('Enseignant non trouvé (ID ou userID):', teacherId)
      return NextResponse.json(
        { message: 'Enseignant non trouvé' },
        { status: 404 }
      )
    }
    
    // Vérifier si le créneau horaire existe
    const timeSlot = await prisma.timeslot.findUnique({
      where: { id: timeSlotId }
    })
    
    if (!timeSlot) {
      console.log('Créneau horaire non trouvé:', timeSlotId);
      console.log('Liste des créneaux horaires disponibles:');
      const allTimeSlots = await prisma.timeslot.findMany();
      console.log(allTimeSlots.map(ts => ({ id: ts.id, day: ts.dayOfWeek, start: ts.startTime })));
      
      return NextResponse.json(
        { message: 'Créneau horaire non trouvé' },
        { status: 404 }
      )
    }
    
    // Vérifier s'il n'y a pas déjà un cours pour cette classe à ce créneau et ce jour
    const existingForClass = await prisma.schedule.findFirst({
      where: {
        classId,
        timeSlotId,
        timeslot: {
          dayOfWeek
        }
      },
      include: {
        timeslot: true
      }
    })
    
    if (existingForClass) {
      console.log('Cours déjà existant pour cette classe à ce créneau et ce jour')
      return NextResponse.json(
        { message: 'Cette classe a déjà un cours à ce créneau horaire pour ce jour' },
        { status: 409 }
      )
    }
    
    // Vérifier si l'enseignant n'est pas déjà occupé à ce créneau ce jour-là
    const existingForTeacher = await prisma.schedule.findFirst({
      where: {
        userId: teacher.user.id,
        timeSlotId,
        timeslot: { 
          dayOfWeek 
        }
      },
      include: {
        timeslot: true
      }
    })
    
    if (existingForTeacher) {
      console.log('Enseignant déjà occupé à ce créneau ce jour-là')
      return NextResponse.json(
        { message: 'Cet enseignant a déjà un cours à ce créneau horaire pour ce jour' },
        { status: 409 }
      )
    }
    
    // Créer le cours dans l'emploi du temps
    console.log('Création du cours avec:', {
      classId,
      courseId,
      userId: teacher.user.id,
      timeSlotId,
      room
    })
    
    try {
      const schedule = await prisma.schedule.create({
        data: {
          classId,
          courseId,
          userId: teacher.user.id,
          timeSlotId,
          room
        },
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
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          timeslot: true
        }
      })
      
      console.log('Cours créé avec succès:', schedule.id)
      return NextResponse.json(schedule, { status: 201 })
    } catch (error: any) {
      // Gérer spécifiquement l'erreur de contrainte unique
      if (error.code === 'P2002') {
        console.log('Erreur de contrainte unique:', error.meta?.target)
        
        // Détecter la contrainte violée
        if (error.meta?.target?.includes('classId') && error.meta?.target?.includes('timeSlotId')) {
          return NextResponse.json(
            { message: 'Cette classe a déjà un cours à ce créneau horaire pour ce jour' },
            { status: 409 }
          )
        } else if (error.meta?.target?.includes('userId') && error.meta?.target?.includes('timeSlotId')) {
          return NextResponse.json(
            { message: 'Cet enseignant a déjà un cours à ce créneau horaire pour ce jour' },
            { status: 409 }
          )
        }
        
        return NextResponse.json(
          { message: 'Conflit détecté pour ce créneau horaire' },
          { status: 409 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Erreur lors de la création du cours dans l\'emploi du temps:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 


