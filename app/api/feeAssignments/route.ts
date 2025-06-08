import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/feeAssignments - Récupérer toutes les assignations de frais
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer les paramètres de filtre depuis l'URL
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const status = searchParams.get('status')

    // Construire les filtres
    const where: any = {}
    
    if (studentId) {
      where.studentId = studentId
    }
    
    if (status) {
      where.status = status
    }

    const feeAssignments = await prisma.feeAssignment.findMany({
      where,
      orderBy: {
        dueDate: 'asc',
      },
      include: {
        student: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            class: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
          },
        },
        feeItem: {
          include: {
            feeType: true,
            feeGroup: true,
          },
        },
        invoices: {
          include: {
            invoice: {
              select: {
                id: true,
                invoiceNumber: true,
                status: true,
              },
            },
          },
        },
      },
    })
    
    return NextResponse.json(feeAssignments)
  } catch (error) {
    console.error('Erreur lors de la récupération des assignations de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
}

// Schéma de validation pour la création d'assignations de frais
const feeAssignmentSchema = z.object({
  // Pour une seule assignation
  singleAssignment: z.object({
    studentId: z.string().min(1, 'L\'étudiant est requis'),
    feeItemId: z.string().min(1, 'L\'élément de frais est requis'),
    dueDate: z.string().transform(val => new Date(val)),
  }).optional(),
  
  // Pour des assignations en masse (par classe ou niveau)
  bulkAssignment: z.object({
    feeItemId: z.string().min(1, 'L\'élément de frais est requis'),
    dueDate: z.string().transform(val => new Date(val)),
    classId: z.string().optional(),
    level: z.string().optional(),
  }).optional(),
})

// POST /api/feeAssignments - Créer une ou plusieurs assignations de frais
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un administrateur
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Valider les données
    const validationResult = feeAssignmentSchema.safeParse(data)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Données invalides', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      )
    }

    // Vérifier que l'élément de frais existe
    let feeItemId: string;
    if (data.singleAssignment) {
      feeItemId = data.singleAssignment.feeItemId;
    } else if (data.bulkAssignment) {
      feeItemId = data.bulkAssignment.feeItemId;
    } else {
      return NextResponse.json(
        { message: 'Aucune donnée d\'assignation fournie' },
        { status: 400 }
      )
    }

    const feeItem = await prisma.feeItem.findUnique({
      where: { id: feeItemId },
    })

    if (!feeItem) {
      return NextResponse.json(
        { message: 'L\'élément de frais spécifié n\'existe pas' },
        { status: 404 }
      )
    }

    // Assignation pour un seul étudiant
    if (data.singleAssignment) {
      const { studentId, feeItemId, dueDate } = data.singleAssignment;
      
      // Vérifier que l'étudiant existe
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      })

      if (!student) {
        return NextResponse.json(
          { message: 'L\'étudiant spécifié n\'existe pas' },
          { status: 404 }
        )
      }

      // Créer l'assignation
      const feeAssignment = await prisma.feeAssignment.create({
        data: {
          studentId,
          feeItemId,
          dueDate,
          status: 'PENDING',
        },
      })

      return NextResponse.json(feeAssignment, { status: 201 })
    }
    
    // Assignation en masse
    if (data.bulkAssignment) {
      const { feeItemId, dueDate, classId, level } = data.bulkAssignment;
      
      // Construire le filtre pour les étudiants
      const where: any = {};
      
      if (classId) {
        where.classId = classId;
      } else if (level) {
        where.class = {
          level: level,
        };
      } else {
        return NextResponse.json(
          { message: 'Veuillez spécifier soit une classe, soit un niveau pour l\'assignation en masse' },
          { status: 400 }
        )
      }

      // Récupérer les étudiants
      const students = await prisma.student.findMany({
        where,
        select: {
          id: true,
        },
      })

      if (students.length === 0) {
        return NextResponse.json(
          { message: 'Aucun étudiant trouvé avec les critères spécifiés' },
          { status: 404 }
        )
      }

      // Créer les assignations en masse
      const feeAssignments = await prisma.$transaction(
        students.map(student => 
          prisma.feeAssignment.create({
            data: {
              studentId: student.id,
              feeItemId,
              dueDate,
              status: 'PENDING',
            },
          })
        )
      )

      return NextResponse.json({
        message: `${feeAssignments.length} assignations de frais créées avec succès`,
        count: feeAssignments.length,
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Erreur lors de la création des assignations de frais:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error.message },
      { status: 500 }
    )
  }
} 


