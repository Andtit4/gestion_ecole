import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { CourseSessionStatus } from '@prisma/client';
import { z } from 'zod';

// Schéma de validation pour la création/mise à jour de session de cours
const courseSessionSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  content: z.string().optional(),
  status: z.enum([
    CourseSessionStatus.PLANNED,
    CourseSessionStatus.ONGOING,
    CourseSessionStatus.COMPLETED,
    CourseSessionStatus.CANCELED,
  ]),
  classId: z.string().min(1, "Class ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
  teacherId: z.string().min(1, "Teacher ID is required"),
});

// GET /api/course-sessions - Récupérer les sessions de cours avec possibilité de filtres
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupération des paramètres de filtrage
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const courseId = searchParams.get("courseId");
    const teacherId = searchParams.get("teacherId");
    const status = searchParams.get("status") as CourseSessionStatus | null;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Construction du filtre selon les paramètres fournis
    const filter: any = {};

    if (classId) {
      filter.classId = classId;
    }

    if (courseId) {
      filter.courseId = courseId;
    }

    if (teacherId) {
      filter.teacherId = teacherId;
    }

    if (status) {
      filter.status = status;
    }

    // Si une plage de dates est spécifiée
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.lte = new Date(endDate);
      }
    }

    // Si l'utilisateur est un enseignant, limiter aux cours qu'il enseigne
    if (session.user.role === "TEACHER" && session.user.teacherId) {
      filter.teacherId = session.user.teacherId;
    }

    // Récupérer les sessions de cours avec inclusion des relations
    const courseSessions = await prisma.courseSession.findMany({
      where: filter,
      include: {
        class: true,
        course: true,
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: [
        { date: "asc" },
        { startTime: "asc" },
      ],
    });

    return NextResponse.json(courseSessions);
  } catch (error) {
    console.error("Error retrieving course sessions:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des sessions de cours" },
      { status: 500 }
    );
  }
}

// POST /api/course-sessions - Créer une nouvelle session de cours
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    // Vérifier les permissions (administrateur ou enseignant)
    if (!["ADMIN", "TEACHER"].includes(session.user.role)) {
      return NextResponse.json(
        { message: "Autorisation insuffisante" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Valider les données
    const validationResult = courseSessionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { date, startTime, endTime, content, status, classId, courseId, teacherId } = validationResult.data;

    // Si l'utilisateur est un enseignant, vérifier qu'il crée une session pour lui-même
    if (session.user.role === "TEACHER" && session.user.teacherId !== teacherId) {
      return NextResponse.json(
        { message: "Vous ne pouvez créer que des sessions pour vous-même" },
        { status: 403 }
      );
    }

    // Vérifier l'existence de la classe
    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    });
    if (!classExists) {
      return NextResponse.json(
        { message: "Classe introuvable" },
        { status: 404 }
      );
    }

    // Vérifier l'existence du cours
    const courseExists = await prisma.course.findUnique({
      where: { id: courseId }
    });
    if (!courseExists) {
      return NextResponse.json(
        { message: "Matière introuvable" },
        { status: 404 }
      );
    }

    // Vérifier l'existence de l'enseignant
    const teacherExists = await prisma.teacher.findUnique({
      where: { id: teacherId }
    });
    if (!teacherExists) {
      return NextResponse.json(
        { message: "Enseignant introuvable" },
        { status: 404 }
      );
    }

    // Vérifier s'il n'y a pas déjà une session au même moment pour cette classe ou cet enseignant
    const overlappingSession = await prisma.courseSession.findFirst({
      where: {
        date: new Date(date),
        OR: [
          {
            classId,
            startTime: {
              lte: endTime
            },
            endTime: {
              gte: startTime
            }
          },
          {
            teacherId,
            startTime: {
              lte: endTime
            },
            endTime: {
              gte: startTime
            }
          }
        ]
      }
    });

    if (overlappingSession) {
      return NextResponse.json(
        { message: "Un conflit d'horaire existe pour cette classe ou cet enseignant" },
        { status: 409 }
      );
    }

    // Créer la session de cours
    const courseSession = await prisma.courseSession.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        content,
        status,
        class: { connect: { id: classId } },
        course: { connect: { id: courseId } },
        teacher: { connect: { id: teacherId } },
      },
      include: {
        class: true,
        course: true,
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(courseSession, { status: 201 });
  } catch (error) {
    console.error("Error creating course session:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création de la session de cours" },
      { status: 500 }
    );
  }
}

// PUT /api/course-sessions - Mettre à jour une session de cours
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID de la session de cours manquant" },
        { status: 400 }
      );
    }

    // Valider les données
    const validationResult = courseSessionSchema.partial().safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Données invalides", errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Vérifier l'existence de la session de cours
    const existingSession = await prisma.courseSession.findUnique({
      where: { id },
      include: {
        teacher: true,
      },
    });

    if (!existingSession) {
      return NextResponse.json(
        { message: "Session de cours introuvable" },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    if (session.user.role === "TEACHER") {
      // Enseignant ne peut modifier que ses propres sessions
      if (session.user.teacherId !== existingSession.teacherId) {
        return NextResponse.json(
          { message: "Vous ne pouvez modifier que vos propres sessions de cours" },
          { status: 403 }
        );
      }
    } else if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Autorisation insuffisante" },
        { status: 403 }
      );
    }

    // Si on change l'enseignant et que c'est un enseignant qui fait la demande
    if (updateData.teacherId && session.user.role === "TEACHER") {
      if (updateData.teacherId !== session.user.teacherId) {
        return NextResponse.json(
          { message: "Vous ne pouvez pas assigner une session à un autre enseignant" },
          { status: 403 }
        );
      }
    }

    // Vérifier s'il n'y a pas de conflit d'horaire en cas de modification de date/heure
    if ((updateData.date || updateData.startTime || updateData.endTime || updateData.classId || updateData.teacherId) && 
        (updateData.date !== existingSession.date.toISOString().split('T')[0] || 
         updateData.startTime !== existingSession.startTime || 
         updateData.endTime !== existingSession.endTime || 
         updateData.classId !== existingSession.classId || 
         updateData.teacherId !== existingSession.teacherId)) {
      
      const date = updateData.date ? new Date(updateData.date) : existingSession.date;
      const startTime = updateData.startTime || existingSession.startTime;
      const endTime = updateData.endTime || existingSession.endTime;
      const classId = updateData.classId || existingSession.classId;
      const teacherId = updateData.teacherId || existingSession.teacherId;

      const overlappingSession = await prisma.courseSession.findFirst({
        where: {
          id: { not: id },
          date,
          OR: [
            {
              classId,
              startTime: {
                lte: endTime
              },
              endTime: {
                gte: startTime
              }
            },
            {
              teacherId,
              startTime: {
                lte: endTime
              },
              endTime: {
                gte: startTime
              }
            }
          ]
        }
      });

      if (overlappingSession) {
        return NextResponse.json(
          { message: "Un conflit d'horaire existe pour cette classe ou cet enseignant" },
          { status: 409 }
        );
      }
    }

    // Préparer les données à mettre à jour
    const dataToUpdate: any = {};

    if (updateData.date) dataToUpdate.date = new Date(updateData.date);
    if (updateData.startTime) dataToUpdate.startTime = updateData.startTime;
    if (updateData.endTime) dataToUpdate.endTime = updateData.endTime;
    if (updateData.content !== undefined) dataToUpdate.content = updateData.content;
    if (updateData.status) dataToUpdate.status = updateData.status;
    
    if (updateData.classId) {
      dataToUpdate.class = { connect: { id: updateData.classId } };
    }
    
    if (updateData.courseId) {
      dataToUpdate.course = { connect: { id: updateData.courseId } };
    }
    
    if (updateData.teacherId) {
      dataToUpdate.teacher = { connect: { id: updateData.teacherId } };
    }

    // Mettre à jour la session de cours
    const updatedSession = await prisma.courseSession.update({
      where: { id },
      data: dataToUpdate,
      include: {
        class: true,
        course: true,
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating course session:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour de la session de cours" },
      { status: 500 }
    );
  }
}

// DELETE /api/course-sessions - Supprimer une session de cours
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    // Vérifier les permissions (seul l'administrateur peut supprimer)
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Seul un administrateur peut supprimer des sessions de cours" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID de la session de cours manquant" },
        { status: 400 }
      );
    }

    // Vérifier l'existence de la session de cours
    const courseSession = await prisma.courseSession.findUnique({
      where: { id }
    });

    if (!courseSession) {
      return NextResponse.json(
        { message: "Session de cours introuvable" },
        { status: 404 }
      );
    }

    // Supprimer la session de cours
    await prisma.courseSession.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Session de cours supprimée avec succès" }
    );
  } catch (error) {
    console.error("Error deleting course session:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression de la session de cours" },
      { status: 500 }
    );
  }
} 