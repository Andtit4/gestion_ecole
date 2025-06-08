import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation pour les périodes
const periodSchema = z.object({
  type: z.enum(['TRIMESTER', 'SEMESTER', 'YEAR'], {
    required_error: "Le type de période est requis",
  }),
  startDate: z.string().datetime({ message: "La date de début doit être une date valide" }),
  endDate: z.string().datetime({ message: "La date de fin doit être une date valide" }),
  schoolYear: z.string().min(1, { message: "L'année scolaire est requise" }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED'], {
    required_error: "Le statut est requis",
  }),
})

// GET /api/periods - Récupérer toutes les périodes
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/periods - Début de la requête');
    
    const session = await getServerSession(authOptions)
    console.log('Session utilisateur:', session?.user?.email, 'Rôle:', session?.user?.role);
    
    // Commenté temporairement pour le débogage
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Non autorisé' },
    //     { status: 401 }
    //   )
    // }

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const schoolYear = searchParams.get('schoolYear')
    
    console.log('Paramètres de recherche:', { status, schoolYear });

    // Construire la requête avec les filtres
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (schoolYear) {
      where.schoolYear = schoolYear
    }
    
    console.log('Requête Prisma - where:', JSON.stringify(where, null, 2));

    const periods = await prisma.period.findMany({
      where,
      orderBy: [
        { schoolYear: 'desc' },
        { startDate: 'desc' }
      ],
    })
    
    console.log(`GET /api/periods - ${periods.length} périodes trouvées`);
    return NextResponse.json(periods)
  } catch (error) {
    console.error('Erreur GET /api/periods :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des périodes' },
      { status: 500 }
    )
  }
}

// POST /api/periods - Créer une nouvelle période
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/periods - Début de la requête');
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent créer des périodes.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    console.log('Données reçues:', body);
    
    // Valider les données
    try {
      periodSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ error: 'Données invalides', details: validationError.errors }, { status: 400 })
      }
    }
    
    const { type, startDate, endDate, schoolYear, status } = body

    // Vérifier que la date de début est avant la date de fin
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) {
      return NextResponse.json(
        { error: 'La date de début doit être antérieure à la date de fin' },
        { status: 400 }
      )
    }

    // Créer la période
    const period = await prisma.period.create({
      data: {
        type,
        startDate: start,
        endDate: end,
        schoolYear,
        status,
      },
    })
    
    console.log('Période créée avec succès:', period.id);
    return NextResponse.json(period, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/periods :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la période' },
      { status: 500 }
    )
  }
}

// PATCH /api/periods - Mettre à jour une période existante
export async function PATCH(req: NextRequest) {
  try {
    console.log('PATCH /api/periods - Début de la requête');
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent modifier des périodes.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    console.log('Données reçues:', body);
    
    const { id, type, startDate, endDate, schoolYear, status } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID de la période requis' }, { status: 400 })
    }
    
    // Vérifier que la période existe
    const period = await prisma.period.findUnique({
      where: { id }
    })
    
    if (!period) {
      return NextResponse.json({ error: 'Période non trouvée' }, { status: 404 })
    }
    
    // Vérifier que la date de début est avant la date de fin si les deux sont fournies
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (start >= end) {
        return NextResponse.json(
          { error: 'La date de début doit être antérieure à la date de fin' },
          { status: 400 }
        )
      }
    }
    
    // Mettre à jour la période
    const updatedPeriod = await prisma.period.update({
      where: { id },
      data: {
        type: type !== undefined ? type : undefined,
        startDate: startDate !== undefined ? new Date(startDate) : undefined,
        endDate: endDate !== undefined ? new Date(endDate) : undefined,
        schoolYear: schoolYear !== undefined ? schoolYear : undefined,
        status: status !== undefined ? status : undefined,
      },
    })
    
    console.log('Période mise à jour avec succès:', updatedPeriod.id);
    return NextResponse.json(updatedPeriod)
  } catch (error) {
    console.error('Erreur PATCH /api/periods :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la période' },
      { status: 500 }
    )
  }
}

// DELETE /api/periods - Supprimer une période
export async function DELETE(req: NextRequest) {
  try {
    console.log('DELETE /api/periods - Début de la requête');
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent supprimer des périodes.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID de la période requis' }, { status: 400 })
    }
    
    // Vérifier que la période existe
    const period = await prisma.period.findUnique({
      where: { id }
    })
    
    if (!period) {
      return NextResponse.json({ error: 'Période non trouvée' }, { status: 404 })
    }
    
    // Vérifier si des bulletins sont associés à cette période
    const reportCardCount = await prisma.reportcard.count({
      where: { periodId: id }
    })
    
    if (reportCardCount > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer la période car des bulletins y sont associés.' },
        { status: 409 }
      )
    }
    
    // Supprimer la période
    await prisma.period.delete({
      where: { id }
    })
    
    console.log('Période supprimée avec succès:', id);
    return NextResponse.json({ message: 'Période supprimée avec succès' })
  } catch (error) {
    console.error('Erreur DELETE /api/periods :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la période' },
      { status: 500 }
    )
  }
} 


