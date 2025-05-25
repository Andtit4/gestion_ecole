import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation pour la mise à jour
const updateSchoolDayConfigSchema = z.object({
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

// GET /api/timetable/schoolday-config/[id] - Récupérer une configuration spécifique
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
    
    const config = await prisma.schoolDayConfig.findUnique({
      where: { id }
    })
    
    if (!config) {
      return NextResponse.json(
        { message: 'Configuration non trouvée' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/timetable/schoolday-config/[id] - Mettre à jour une configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé. Seuls les administrateurs peuvent gérer les configurations.' },
        { status: 401 }
      )
    }
    
    const id = params.id
    const body = await request.json()
    
    // Valider les données
    const validationResult = updateSchoolDayConfigSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Données invalides', errors: validationResult.error.format() },
        { status: 400 }
      )
    }
    
    // Vérifier que la configuration existe
    const existingConfig = await prisma.schoolDayConfig.findUnique({
      where: { id }
    })
    
    if (!existingConfig) {
      return NextResponse.json(
        { message: 'Configuration non trouvée' },
        { status: 404 }
      )
    }
    
    const { dayStartTime, dayEndTime, breakStartTime, breakEndTime } = validationResult.data
    
    // Vérifier que l'ordre des horaires est logique
    if (dayStartTime >= breakStartTime || breakStartTime >= breakEndTime || breakEndTime >= dayEndTime) {
      return NextResponse.json(
        { message: 'Les horaires doivent être dans un ordre chronologique logique' },
        { status: 400 }
      )
    }
    
    // Mettre à jour la configuration
    const updatedConfig = await prisma.schoolDayConfig.update({
      where: { id },
      data: {
        dayStartTime: createISODateTime(dayStartTime),
        dayEndTime: createISODateTime(dayEndTime),
        breakStartTime: createISODateTime(breakStartTime),
        breakEndTime: createISODateTime(breakEndTime)
      }
    })
    
    return NextResponse.json(updatedConfig)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/timetable/schoolday-config/[id] - Supprimer une configuration
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé. Seuls les administrateurs peuvent gérer les configurations.' },
        { status: 401 }
      )
    }
    
    const id = params.id
    
    // Vérifier que la configuration existe
    const existingConfig = await prisma.schoolDayConfig.findUnique({
      where: { id }
    })
    
    if (!existingConfig) {
      return NextResponse.json(
        { message: 'Configuration non trouvée' },
        { status: 404 }
      )
    }
    
    // Supprimer la configuration
    await prisma.schoolDayConfig.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Configuration supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de la configuration:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 