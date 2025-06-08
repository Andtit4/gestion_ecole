import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/programmes/search - Rechercher des programmes
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer les paramètres de recherche depuis l'URL
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const level = searchParams.get('level')
    const courseId = searchParams.get('courseId')
    const status = searchParams.get('status') || 'PUBLISHED' // Par défaut, on cherche les programmes publiés

    // Construire les filtres de recherche
    const filters = {
      AND: [
        // Filtre sur le statut (par défaut, on cherche les programmes publiés)
        status ? { status: status } : { status: 'PUBLISHED' },
        
        // Filtre sur le niveau si spécifié
        level ? { level } : {},
        
        // Filtre sur la matière si spécifiée
        courseId ? { courseId } : {},
        
        // Filtre sur le texte de recherche
        query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
                { objectives: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    }

    try {
      // Effectuer la recherche
      const programmes = await prisma.programme.findMany({
        where: filters,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          course: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      })

      return NextResponse.json(programmes)
    } catch (innerError) {
      console.error('Erreur spécifique lors de la recherche de programmes:', innerError)
      
      // Si le modèle n'existe pas encore, renvoyer un tableau vide plutôt qu'une erreur
      if (innerError.message && innerError.message.includes("Unknown model 'Programme'")) {
        console.log('Le modèle Programme n\'existe pas encore, retour d\'un tableau vide');
        return NextResponse.json([])
      }
      
      throw innerError;
    }
  } catch (error) {
    console.error('Erreur lors de la recherche des programmes:', error)
    console.error('Type d\'erreur:', typeof error)
    console.error('Message d\'erreur:', error.message)
    console.error('Stack trace:', error.stack)
    
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
} 


