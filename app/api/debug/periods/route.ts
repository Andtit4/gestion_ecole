import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// API de secours pour obtenir la liste des périodes
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/debug/periods - Début de la requête');
    
    // Essayer d'obtenir les périodes de la base de données
    let periods = await prisma.period.findMany();
    
    // S'il n'y a pas de périodes, créer des données de test
    if (periods.length === 0) {
      console.log('Aucune période trouvée, création de données de test...');
      
      // Créer des périodes de test pour l'année scolaire en cours
      const currentYear = new Date().getFullYear();
      const schoolYear = `${currentYear}-${currentYear + 1}`;
      
      const testPeriods = [
        { 
          type: 'TRIMESTER', 
          startDate: new Date(`${currentYear}-09-01`), 
          endDate: new Date(`${currentYear}-11-30`), 
          schoolYear,
          status: 'ACTIVE'
        },
        { 
          type: 'TRIMESTER', 
          startDate: new Date(`${currentYear}-12-01`), 
          endDate: new Date(`${currentYear + 1}-02-28`), 
          schoolYear,
          status: 'ACTIVE'
        },
        { 
          type: 'TRIMESTER', 
          startDate: new Date(`${currentYear + 1}-03-01`), 
          endDate: new Date(`${currentYear + 1}-06-30`), 
          schoolYear,
          status: 'ACTIVE'
        }
      ];
      
      for (const periodData of testPeriods) {
        try {
          // Vérifier si la période existe déjà (même type, dates et année scolaire)
          const existingPeriod = await prisma.period.findFirst({
            where: {
              type: periodData.type,
              startDate: periodData.startDate,
              endDate: periodData.endDate,
              schoolYear: periodData.schoolYear
            }
          });
          
          if (!existingPeriod) {
            // Créer la période
            await prisma.period.create({
              data: periodData
            });
            
            console.log(`Période de test créée: ${periodData.type} (${periodData.startDate.toISOString()} - ${periodData.endDate.toISOString()})`);
          }
        } catch (error) {
          console.error(`Erreur lors de la création de la période de test:`, error);
        }
      }
      
      // Récupérer les périodes créées
      periods = await prisma.period.findMany();
    }
    
    console.log(`${periods.length} périodes retournées`);
    
    return NextResponse.json(periods);
  } catch (error) {
    console.error('Erreur GET /api/debug/periods:', error);
    
    // En cas d'erreur, retourner des données statiques
    const currentYear = new Date().getFullYear();
    const schoolYear = `${currentYear}-${currentYear + 1}`;
    
    const staticPeriods = [
      { 
        id: "period1", 
        type: "TRIMESTER", 
        startDate: `${currentYear}-09-01T00:00:00.000Z`, 
        endDate: `${currentYear}-11-30T23:59:59.000Z`, 
        schoolYear,
        status: "ACTIVE"
      },
      { 
        id: "period2", 
        type: "TRIMESTER", 
        startDate: `${currentYear}-12-01T00:00:00.000Z`, 
        endDate: `${currentYear + 1}-02-28T23:59:59.000Z`, 
        schoolYear,
        status: "ACTIVE"
      },
      { 
        id: "period3", 
        type: "TRIMESTER", 
        startDate: `${currentYear + 1}-03-01T00:00:00.000Z`, 
        endDate: `${currentYear + 1}-06-30T23:59:59.000Z`, 
        schoolYear,
        status: "ACTIVE"
      }
    ];
    
    console.log('Retour de données statiques (fallback)');
    return NextResponse.json(staticPeriods);
  }
} 