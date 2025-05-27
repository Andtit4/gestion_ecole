import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// API de secours pour les bulletins - pour tester sans validation
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/debug/test-report-card - Début de la requête');
    
    const body = await req.json()
    console.log('Données reçues:', body);
    
    const { studentId, periodId, average, appreciation, status } = body

    // Validation minimale
    if (!studentId || !periodId) {
      // Créer des données fictives pour les tests
      console.log('Données manquantes, création de données de test...');
      
      // Vérifier s'il existe un élève
      let foundStudent = await prisma.student.findFirst();
      
      // S'il n'y a pas d'élève, en créer un
      if (!foundStudent) {
        console.log('Aucun élève trouvé, création d\'un élève de test...');
        
        // Créer un utilisateur d'abord
        const newUser = await prisma.user.create({
          data: {
            firstName: 'Élève',
            lastName: 'Test',
            email: `eleve.test.${Date.now()}@ecole.com`,
            password: 'motdepasse',
            role: 'STUDENT'
          }
        });
        
        // Créer l'élève
        foundStudent = await prisma.student.create({
          data: {
            userId: newUser.id
          }
        });
        
        console.log('Élève de test créé:', foundStudent.id);
      }
      
      // Vérifier s'il existe une période
      let foundPeriod = await prisma.period.findFirst();
      
      // S'il n'y a pas de période, en créer une
      if (!foundPeriod) {
        console.log('Aucune période trouvée, création d\'une période de test...');
        
        foundPeriod = await prisma.period.create({
          data: {
            type: 'TRIMESTER',
            startDate: new Date('2023-09-01'),
            endDate: new Date('2023-12-20'),
            schoolYear: '2023-2024',
            status: 'ACTIVE'
          }
        });
        
        console.log('Période de test créée:', foundPeriod.id);
      }
      
      // Utiliser les IDs trouvés ou créés
      const finalStudentId = foundStudent.id;
      const finalPeriodId = foundPeriod.id;
      
      // Créer le bulletin de test
      const newReportCard = await prisma.reportcard.create({
        data: {
          studentId: finalStudentId,
          periodId: finalPeriodId,
          average: average || 15,
          appreciation: appreciation || "Bulletin de test créé automatiquement",
          status: status || "DRAFT",
          generatedAt: new Date()
        },
        include: {
          student: {
            include: {
              user: true
            }
          },
          period: true
        }
      });
      
      console.log('Bulletin de test créé avec succès:', newReportCard.id);
      return NextResponse.json({
        success: true,
        message: 'Bulletin de test créé avec succès (données générées automatiquement)',
        data: newReportCard
      }, { status: 201 });
    }

    // Si studentId et periodId sont fournis, on les utilise
    const newReportCard = await prisma.reportcard.create({
      data: {
        studentId,
        periodId,
        average: parseFloat(average?.toString() || "15"),
        appreciation: appreciation || "Test de création de bulletin",
        status: status || "DRAFT",
        generatedAt: new Date()
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        period: true
      }
    });
    
    console.log('Bulletin créé avec succès:', newReportCard.id);
    return NextResponse.json({
      success: true,
      message: 'Bulletin créé avec succès',
      data: newReportCard
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/debug/test-report-card:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la création du bulletin',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 