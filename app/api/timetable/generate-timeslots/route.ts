import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/timetable/generate-timeslots - Générer automatiquement des créneaux horaires
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé. Seuls les administrateurs peuvent générer des créneaux horaires.' },
        { status: 401 }
      )
    }

    // 1. Récupérer toutes les configurations de jours
    const configs = await prisma.schoolDayConfig.findMany({
      orderBy: [{ dayOfWeek: 'asc' }]
    })

    if (configs.length === 0) {
      return NextResponse.json(
        { message: 'Aucune configuration de jour trouvée. Veuillez d\'abord configurer les journées.' },
        { status: 400 }
      )
    }

    // 2. Définir des durées standards pour les créneaux (1 heure)
    const SLOT_DURATION_MINUTES = 60

    let createdCount = 0
    const results = []

    // Pour chaque configuration de jour
    for (const config of configs) {
      const { dayOfWeek, dayStartTime, dayEndTime, breakStartTime, breakEndTime } = config

      // Convertir les dates en heures et minutes
      const getHoursAndMinutes = (date: Date) => {
        return {
          hours: date.getHours(),
          minutes: date.getMinutes()
        }
      }

      const startDay = getHoursAndMinutes(new Date(dayStartTime))
      const endDay = getHoursAndMinutes(new Date(dayEndTime))
      const startBreak = getHoursAndMinutes(new Date(breakStartTime))
      const endBreak = getHoursAndMinutes(new Date(breakEndTime))

      // Calculer le nombre total de minutes dans la journée (hors pause)
      const morningMinutes = 
        (startBreak.hours * 60 + startBreak.minutes) - 
        (startDay.hours * 60 + startDay.minutes)
      
      const afternoonMinutes = 
        (endDay.hours * 60 + endDay.minutes) - 
        (endBreak.hours * 60 + endBreak.minutes)

      // Nombre de créneaux possibles (arrondi vers le bas)
      const morningSlots = Math.floor(morningMinutes / SLOT_DURATION_MINUTES)
      const afternoonSlots = Math.floor(afternoonMinutes / SLOT_DURATION_MINUTES)

      // Fonction pour créer un créneau
      const createTimeSlot = async (startHour: number, startMinute: number) => {
        // Calculer l'heure de fin
        let endHour = startHour
        let endMinute = startMinute + SLOT_DURATION_MINUTES
        
        if (endMinute >= 60) {
          endHour += Math.floor(endMinute / 60)
          endMinute = endMinute % 60
        }

        // Vérifier si le créneau chevauche la pause
        const slotStartMinutes = startHour * 60 + startMinute
        const slotEndMinutes = endHour * 60 + endMinute
        const breakStartMinutes = startBreak.hours * 60 + startBreak.minutes
        const breakEndMinutes = endBreak.hours * 60 + endBreak.minutes

        if (slotStartMinutes < breakStartMinutes && slotEndMinutes > breakStartMinutes) {
          return null // Ignore les créneaux qui chevauchent la pause
        }

        // Créer les dates ISO pour le stockage
        const createISODateTime = (hours: number, minutes: number) => {
          const date = new Date(2000, 0, 1)
          date.setHours(hours, minutes, 0, 0)
          return date.toISOString()
        }

        const startTimeISO = createISODateTime(startHour, startMinute)
        const endTimeISO = createISODateTime(endHour, endMinute)

        // Vérifier si ce créneau existe déjà
        const existingTimeSlot = await prisma.timeslot.findFirst({
          where: {
            dayOfWeek: dayOfWeek,
            startTime: startTimeISO,
            endTime: endTimeISO
          }
        })

        if (existingTimeSlot) {
          return null // Le créneau existe déjà
        }

        // Créer le créneau horaire
        const timeSlot = await prisma.timeslot.create({
          data: {
            dayOfWeek: dayOfWeek,
            startTime: startTimeISO,
            endTime: endTimeISO
          }
        })

        createdCount++
        return timeSlot
      }

      // Créer les créneaux du matin
      let currentHour = startDay.hours
      let currentMinute = startDay.minutes

      for (let i = 0; i < morningSlots; i++) {
        const slot = await createTimeSlot(currentHour, currentMinute)
        if (slot) results.push(slot)
        
        // Avancer d'une durée de créneau
        currentMinute += SLOT_DURATION_MINUTES
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60)
          currentMinute = currentMinute % 60
        }
      }

      // Créer les créneaux de l'après-midi
      currentHour = endBreak.hours
      currentMinute = endBreak.minutes

      for (let i = 0; i < afternoonSlots; i++) {
        const slot = await createTimeSlot(currentHour, currentMinute)
        if (slot) results.push(slot)
        
        // Avancer d'une durée de créneau
        currentMinute += SLOT_DURATION_MINUTES
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60)
          currentMinute = currentMinute % 60
        }
      }
    }

    return NextResponse.json({ 
      message: 'Créneaux horaires générés avec succès',
      count: createdCount,
      results
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la génération des créneaux horaires:', error)
    return NextResponse.json(
      { message: 'Erreur serveur lors de la génération des créneaux horaires' },
      { status: 500 }
    )
  }
} 


