import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation
const schoolDayConfigSchema = z.object({
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  dayStartTime: z.string().min(1, "L'heure de début est requise"),
  dayEndTime: z.string().min(1, "L'heure de fin est requise"),
  breakStartTime: z.string().min(1, "L'heure de début de pause est requise"),
  breakEndTime: z.string().min(1, "L'heure de fin de pause est requise"),
})

// Helper pour convertir les heures en format ISO DateTime
const createISODateTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(2000, 0, 1); // 1er janvier 2000
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

// GET /api/timetable/schoolday-config - Récupérer toutes les configurations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }
    
    const configs = await prisma.schoolDayConfig.findMany({
      orderBy: [{ dayOfWeek: 'asc' }]
    })
    
    return NextResponse.json(configs)
  } catch (error) {
    console.error('Erreur lors de la récupération des configurations:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/timetable/schoolday-config - Créer une nouvelle configuration
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé. Seuls les administrateurs peuvent gérer les configurations.' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Valider les données
    const validationResult = schoolDayConfigSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Données invalides', errors: validationResult.error.format() },
        { status: 400 }
      )
    }
    
    const { dayOfWeek, dayStartTime, dayEndTime, breakStartTime, breakEndTime } = validationResult.data
    
    // Vérifier que l'ordre des horaires est logique
    if (dayStartTime >= breakStartTime || breakStartTime >= breakEndTime || breakEndTime >= dayEndTime) {
      return NextResponse.json(
        { message: 'Les horaires doivent être dans un ordre chronologique logique' },
        { status: 400 }
      )
    }
    
    // Vérifier qu'il n'existe pas déjà une configuration pour ce jour
    const existingConfig = await prisma.schoolDayConfig.findFirst({
      where: { dayOfWeek }
    })
    
    if (existingConfig) {
      return NextResponse.json(
        { message: 'Une configuration existe déjà pour ce jour' },
        { status: 409 }
      )
    }
    
    // Créer la configuration
    const config = await prisma.schoolDayConfig.create({
      data: {
        dayOfWeek,
        dayStartTime: createISODateTime(dayStartTime),
        dayEndTime: createISODateTime(dayEndTime),
        breakStartTime: createISODateTime(breakStartTime),
        breakEndTime: createISODateTime(breakEndTime)
      }
    })
    
    return NextResponse.json(config, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la configuration:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 