import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/timetable/timeslots - Récupérer tous les créneaux horaires
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    // Récupérer tous les créneaux horaires, triés par jour et heure de début
    const timeSlots = await prisma.timeslot.findMany({
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    })
    
    return NextResponse.json(timeSlots)
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux horaires:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des créneaux horaires' },
      { status: 500 }
    )
  }
}

// POST /api/timetable/timeslots - Créer un nouveau créneau horaire
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    const { dayOfWeek, startTime, endTime } = await request.json()
    
    // Validation des données
    if (!dayOfWeek || !startTime || !endTime) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }
    
    // Vérifier que l'heure de fin est après l'heure de début
    if (startTime >= endTime) {
      return NextResponse.json(
        { message: 'L\'heure de fin doit être après l\'heure de début' },
        { status: 400 }
      )
    }
    
    // Conversion des chaînes de temps HH:MM en format DateTime ISO
    // On utilise une date de base (2000-01-01) et on ajoute les heures et minutes
    const createISODateTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date(2000, 0, 1); // 1er janvier 2000
      date.setHours(hours, minutes, 0, 0);
      return date.toISOString();
    };

    const isoStartTime = createISODateTime(startTime);
    const isoEndTime = createISODateTime(endTime);
    
    // Créer le créneau horaire
    const timeSlot = await prisma.timeslot.create({
      data: {
        dayOfWeek,
        startTime: isoStartTime,
        endTime: isoEndTime
      }
    })
    
    return NextResponse.json(timeSlot, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du créneau horaire:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création du créneau horaire' },
      { status: 500 }
    )
  }
} 