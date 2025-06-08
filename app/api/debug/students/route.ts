import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// API de secours pour obtenir la liste des élèves
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/debug/students - Début de la requête');
    
    // Essayer d'obtenir les élèves de la base de données
    let students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        class: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // S'il n'y a pas d'élèves, créer des données de test
    if (students.length === 0) {
      console.log('Aucun élève trouvé, création de données de test...');
      
      // Créer des utilisateurs de test
      const testUsers = [
        { firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@test.com', role: 'STUDENT' },
        { firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@test.com', role: 'STUDENT' },
        { firstName: 'Lucas', lastName: 'Bernard', email: 'lucas.bernard@test.com', role: 'STUDENT' }
      ];
      
      for (const userData of testUsers) {
        try {
          // Vérifier si l'utilisateur existe déjà
          const existingUser = await prisma.user.findFirst({
            where: { email: userData.email }
          });
          
          if (!existingUser) {
            // Créer l'utilisateur
            const newUser = await prisma.user.create({
              data: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: 'motdepasse',
                role: userData.role as any
              }
            });
            
            // Créer l'élève associé
            await prisma.student.create({
              data: {
                userId: newUser.id
              }
            });
            
            console.log(`Élève de test créé: ${userData.firstName} ${userData.lastName}`);
          }
        } catch (error) {
          console.error(`Erreur lors de la création de l'élève de test ${userData.firstName} ${userData.lastName}:`, error);
        }
      }
      
      // Récupérer les élèves créés
      students = await prisma.student.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          class: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    }
    
    console.log(`${students.length} élèves retournés`);
    
    return NextResponse.json(students);
  } catch (error) {
    console.error('Erreur GET /api/debug/students:', error);
    
    // En cas d'erreur, retourner des données statiques
    const staticStudents = [
      { 
        id: "student1", 
        userId: "user1",
        user: { 
          id: "user1", 
          firstName: "Jean", 
          lastName: "Dupont",
          email: "jean.dupont@test.com"
        },
        class: null
      },
      { 
        id: "student2", 
        userId: "user2",
        user: { 
          id: "user2", 
          firstName: "Marie", 
          lastName: "Martin",
          email: "marie.martin@test.com"
        },
        class: null
      },
      { 
        id: "student3", 
        userId: "user3",
        user: { 
          id: "user3", 
          firstName: "Lucas", 
          lastName: "Bernard",
          email: "lucas.bernard@test.com"
        },
        class: null
      }
    ];
    
    console.log('Retour de données statiques (fallback)');
    return NextResponse.json(staticStudents);
  }
} 


