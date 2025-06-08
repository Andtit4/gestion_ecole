import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/timetable/timeslots/[id] - Récupérer un créneau horaire spécifique
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
    
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id }
    })
    
    if (!timeSlot) {
      return NextResponse.json(
        { message: 'Créneau horaire non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(timeSlot)
  } catch (error) {
    console.error('Erreur lors de la récupération du créneau horaire:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du créneau horaire' },
      { status: 500 }
    )
  }
}

// PUT /api/timetable/timeslots/[id] - Mettre à jour un créneau horaire
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
    
    // Vérifier si le créneau horaire existe
    const existingTimeSlot = await prisma.timeSlot.findUnique({
      where: { id }
    })
    
    if (!existingTimeSlot) {
      return NextResponse.json(
        { message: 'Créneau horaire non trouvé' },
        { status: 404 }
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
    
    // Mettre à jour le créneau horaire
    const updatedTimeSlot = await prisma.timeSlot.update({
      where: { id },
      data: {
        dayOfWeek,
        startTime: isoStartTime,
        endTime: isoEndTime
      }
    })
    
    return NextResponse.json(updatedTimeSlot)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du créneau horaire:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du créneau horaire' },
      { status: 500 }
    )
  }
}

// DELETE /api/timetable/timeslots/[id] - Supprimer un créneau horaire
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
    
    // Vérifier si le créneau est utilisé dans un emploi du temps
    const scheduleCount = await prisma.schedule.count({
      where: { timeSlotId: id }
    })
    
    if (scheduleCount > 0) {
      return NextResponse.json(
        { message: 'Ce créneau horaire est utilisé dans des emplois du temps et ne peut pas être supprimé' },
        { status: 400 }
      )
    }
    
    // Supprimer le créneau horaire
    await prisma.timeSlot.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Créneau horaire supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du créneau horaire:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du créneau horaire' },
      { status: 500 }
    )
  }
} 