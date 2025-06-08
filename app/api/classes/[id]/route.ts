import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/classes/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Attendre les paramètres avant d'accéder à leurs propriétés
    const resolvedParams = await params
    const id = resolvedParams.id

    console.log(`GET /api/classes/${id} - Début de la requête`);

    const classe = await prisma.renamedclass.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            }
          }
        },
        students: true
      },
    })

    if (!classe) {
      return NextResponse.json(
        { message: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    console.log(`GET /api/classes/${id} - Classe trouvée:`, classe.id);
    return NextResponse.json(classe)
  } catch (error) {
    console.error(`Erreur GET /api/classes/[id]:`, error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Fonction de mise à jour commune pour PUT et PATCH
async function updateClass(request: Request, id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    console.log(`Mise à jour classe ${id} - Données reçues:`, body);
    
    const { name, level, year, teacherId } = body

    // Validation des données
    if (!name || !level || !year) {
      return NextResponse.json(
        { message: 'Nom, niveau et année sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si la classe existe
    const existingClass = await prisma.renamedclass.findUnique({
      where: { id },
    })

    if (!existingClass) {
      return NextResponse.json(
        { message: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si teacherId est valide s'il est fourni
    if (teacherId) {
      const teacherExists = await prisma.teacher.findUnique({
        where: { id: teacherId }
      });
      
      if (!teacherExists) {
        console.error(`Enseignant avec ID ${teacherId} non trouvé`);
        return NextResponse.json(
          { message: "L'enseignant spécifié n'existe pas" },
          { status: 400 }
        );
      }
    }

    // Mettre à jour la classe
    const updatedClass = await prisma.renamedclass.update({
      where: { id },
      data: {
        name,
        level,
        year: parseInt(year.toString()),
        teacherId: teacherId || null,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            }
          }
        },
      },
    })

    console.log(`Classe ${id} mise à jour avec succès:`, updatedClass.id);
    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error(`Erreur mise à jour classe ${id}:`, error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/classes/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = resolvedParams.id
  console.log(`PUT /api/classes/${id} - Début de la requête`);
  return updateClass(request, id)
}

// PATCH /api/classes/[id] - Alternative à PUT
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const id = resolvedParams.id
  console.log(`PATCH /api/classes/${id} - Début de la requête`);
  return updateClass(request, id)
}

// DELETE /api/classes/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Attendre les paramètres avant d'accéder à leurs propriétés
    const resolvedParams = await params
    const id = resolvedParams.id

    // Vérifier si la classe existe
    const existingClass = await prisma.renamedclass.findUnique({
      where: { id },
    })

    if (!existingClass) {
      return NextResponse.json(
        { message: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer la classe
    await prisma.renamedclass.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Classe supprimée avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression de la classe:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 