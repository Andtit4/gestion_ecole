/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/classes - Récupérer toutes les classes
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/classes - Début de la requête');
    
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
    const year = searchParams.get('year')
    const level = searchParams.get('level')
    const teacherId = searchParams.get('teacherId')
    
    console.log('Paramètres de recherche:', { year, level, teacherId });

    // Construire la requête avec les filtres
    const where: any = {}
    
    if (year) {
      where.year = parseInt(year)
    }
    
    if (level) {
      where.level = level
    }
    
    if (teacherId) {
      where.teacherId = teacherId
    }
    
    console.log('Requête Prisma - where:', JSON.stringify(where, null, 2));

    const classes = await prisma.renamedclass.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        students: {
          select: {
            id: true
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { name: 'asc' }
      ]
    })
    
    // Ajouter le nombre d'élèves pour chaque classe
    const classesWithStudentCount = classes.map(cls => {
      // Formater les données pour les rendre compatibles avec l'interface Class du composant
      const formattedClass = {
        ...cls,
        studentCount: cls.students.length,
        students: undefined, // Ne pas renvoyer la liste des élèves
        _count: {
          students: cls.students.length
        }
      };
      
      // Si la classe a un professeur, extraire firstName et lastName de teacher.user
      if (cls.teacher) {
        formattedClass.teacher = {
          ...cls.teacher,
          firstName: cls.teacher.user.firstName,
          lastName: cls.teacher.user.lastName
        };
      }
      
      return formattedClass;
    });
    
    console.log(`GET /api/classes - ${classes.length} classes trouvées`);
    console.log('Données formatées envoyées au client:', JSON.stringify(classesWithStudentCount.slice(0, 1), null, 2));
    return NextResponse.json(classesWithStudentCount)
  } catch (error) {
    console.error('Erreur GET /api/classes :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des classes' },
      { status: 500 }
    )
  }
}

// POST /api/classes - Créer une nouvelle classe
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/classes - Début de la requête');
    
    const session = await getServerSession(authOptions)
    
    // Commenté temporairement pour le débogage
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Non autorisé. Seuls les administrateurs peuvent créer des classes.' },
    //     { status: 401 }
    //   )
    // }

    const body = await req.json()
    console.log('Données reçues:', body);
    
    const { name, level, year, teacherId } = body

    // Validation des données
    if (!name || !level || !year) {
      return NextResponse.json(
        { error: 'Nom, niveau et année sont requis' },
        { status: 400 }
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
          { error: "L'enseignant spécifié n'existe pas" },
          { status: 400 }
        );
      }
    }

    // Vérifier si une classe avec le même nom et année existe déjà
    const existingClass = await prisma.renamedclass.findFirst({
      where: {
        name,
        year: parseInt(year.toString())
      }
    })

    if (existingClass) {
      return NextResponse.json(
        { error: 'Une classe avec ce nom existe déjà pour cette année scolaire' },
        { status: 400 }
      )
    }

    // Créer la classe
    const newClass = await prisma.renamedclass.create({
      data: {
        name,
        level,
        year: parseInt(year.toString()),
        teacherId: teacherId || null
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
    
    console.log('Classe créée avec succès:', newClass.id);
    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/classes :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la classe' },
      { status: 500 }
    )
  }
}

// PUT ou PATCH /api/classes - Mettre à jour une classe existante
export async function PATCH(req: NextRequest) {
  try {
    console.log('PATCH /api/classes - Début de la requête');
    
    const session = await getServerSession(authOptions)
    
    // Commenté temporairement pour le débogage
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Non autorisé. Seuls les administrateurs peuvent modifier des classes.' },
    //     { status: 401 }
    //   )
    // }

    const body = await req.json()
    console.log('Données reçues:', body);
    
    const { id, name, level, year, teacherId } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la classe requis' },
        { status: 400 }
      )
    }

    // Vérifier si la classe existe
    const classExists = await prisma.renamedclass.findUnique({
      where: { id }
    })
    
    if (!classExists) {
      return NextResponse.json(
        { error: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    // Construire les données de mise à jour
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (level !== undefined) updateData.level = level
    if (year !== undefined) updateData.year = parseInt(year.toString())
    if (teacherId !== undefined) updateData.teacherId = teacherId || null
    
    // Mettre à jour la classe
    const updatedClass = await prisma.renamedclass.update({
      where: { id },
      data: updateData,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })
    
    console.log('Classe mise à jour avec succès:', updatedClass.id);
    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error('Erreur PATCH /api/classes :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la classe' },
      { status: 500 }
    )
  }
}

// DELETE /api/classes - Supprimer une classe
export async function DELETE(req: NextRequest) {
  try {
    console.log('DELETE /api/classes - Début de la requête');
    
    const session = await getServerSession(authOptions)
    
    // Commenté temporairement pour le débogage
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Non autorisé. Seuls les administrateurs peuvent supprimer des classes.' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la classe requis' },
        { status: 400 }
      )
    }

    // Vérifier si la classe existe
    const classExists = await prisma.renamedclass.findUnique({
      where: { id }
    })
    
    if (!classExists) {
      return NextResponse.json(
        { error: 'Classe non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si des élèves sont associés à cette classe
    const studentCount = await prisma.student.count({
      where: { classId: id }
    })
    
    if (studentCount > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer la classe car des élèves y sont assignés.' },
        { status: 409 }
      )
    }

    // Supprimer la classe
    await prisma.renamedclass.delete({
      where: { id }
    })
    
    console.log('Classe supprimée avec succès:', id);
    return NextResponse.json({ message: 'Classe supprimée avec succès' })
  } catch (error) {
    console.error('Erreur DELETE /api/classes :', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la classe' },
      { status: 500 }
    )
  }
} 