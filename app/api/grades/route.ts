import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const gradeSchema = z.object({
  value: z.number().min(0).max(20),
  type: z.enum(['HOMEWORK', 'QUIZ', 'EXAM']),
  date: z.string().transform((str) => new Date(str)),
  comment: z.string().optional(),
  studentId: z.string(),
  courseId: z.string(),
})

// GET /api/grades - Récupérer les notes
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const courseId = searchParams.get('courseId')
    const teacherId = searchParams.get('teacherId')

    const where = {
      ...(studentId && { studentId }),
      ...(courseId && { courseId }),
      ...(teacherId && { teacherId }),
    }

    const grades = await prisma.grade.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            },
            class: true,
          }
        },
        course: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    })

    console.log('Notes récupérées:', JSON.stringify(grades, null, 2));
    return NextResponse.json(grades)
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notes' },
      { status: 500 }
    )
  }
}

// POST /api/grades - Créer une note
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    console.log('Session utilisateur:', {
      email: session.user?.email,
      role: session.user?.role
    });

    const json = await request.json()
    console.log('Données reçues:', json);
    const body = gradeSchema.parse(json)

    const teacher = await prisma.teacher.findFirst({
      where: {
        user: {
          email: session.user?.email,
        },
      },
    })

    console.log('Enseignant trouvé:', teacher);

    // TEMPORAIRE: Si vous n'avez pas de compte enseignant, cette condition permettra tout de même l'ajout de notes
    // À SUPPRIMER EN PRODUCTION
    if (!teacher) {
      console.log('Pas d\'enseignant trouvé, création d\'une note avec un enseignant par défaut');
      
      // Trouver un enseignant dans la base de données pour les tests
      const anyTeacher = await prisma.teacher.findFirst();
      
      if (!anyTeacher) {
        return NextResponse.json(
          { error: 'Aucun enseignant trouvé dans la base de données. Impossible d\'ajouter une note.' },
          { status: 403 }
        );
      }
      
      const grade = await prisma.grade.create({
        data: {
          ...body,
          teacherId: anyTeacher.id, // Utiliser l'ID du premier enseignant trouvé
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                }
              },
              class: true,
            }
          },
          course: true,
          teacher: {
            include: {
              user: true,
            },
          },
        },
      });
      
      return NextResponse.json(grade);
    }

    const grade = await prisma.grade.create({
      data: {
        ...body,
        teacherId: teacher.id,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            },
            class: true,
          }
        },
        course: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    })

    return NextResponse.json(grade)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erreur de validation Zod:', error.errors);
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la création de la note:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la note' },
      { status: 500 }
    )
  }
}

// PUT /api/grades - Mettre à jour une note
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const data = await request.json()
    const { id, value, type, date, coefficient, comment } = data

    if (!id) {
      return NextResponse.json(
        { message: 'ID de la note requis' },
        { status: 400 }
      )
    }

    // Vérifier que la note existe
    const existingGrade = await prisma.grade.findUnique({
      where: { id },
    })

    if (!existingGrade) {
      return NextResponse.json(
        { message: 'Note non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour la note
    const grade = await prisma.grade.update({
      where: { id },
      data: {
        value,
        type,
        date: date ? new Date(date) : undefined,
        coefficient,
        comment,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json(grade)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la note' },
      { status: 500 }
    )
  }
}

// DELETE /api/grades - Supprimer une note
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID de la note requis' },
        { status: 400 }
      )
    }

    // Vérifier que la note existe
    const grade = await prisma.grade.findUnique({
      where: { id },
    })

    if (!grade) {
      return NextResponse.json(
        { message: 'Note non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer la note
    await prisma.grade.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Note supprimée avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la note' },
      { status: 500 }
    )
  }
} 