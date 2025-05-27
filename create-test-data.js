// Script pour créer des données de test pour l'application
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestData() {
    console.log('Création de données de test pour l\'application...');

    try {
        // 1. Créer une période de test
        console.log('Création d\'une période de test...');

        const period = await prisma.period.create({
            data: {
                type: 'TRIMESTER',
                startDate: new Date('2023-09-01'),
                endDate: new Date('2023-12-20'),
                schoolYear: '2023-2024',
                status: 'ACTIVE',
            },
        });

        console.log('Période créée:', period);

        // 2. Créer un utilisateur et un élève de test
        console.log('Création d\'un utilisateur et d\'un élève de test...');

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email: 'eleve.test@ecole.com' },
        });

        if (!existingUser) {
            // Créer l'utilisateur
            const user = await prisma.user.create({
                data: {
                    firstName: 'Élève',
                    lastName: 'Test',
                    email: 'eleve.test@ecole.com',
                    password: 'motdepasse', // Dans une application réelle, vous devriez hacher le mot de passe
                    role: 'STUDENT',
                },
            });

            console.log('Utilisateur créé:', user);

            // Créer l'élève
            const student = await prisma.student.create({
                data: {
                    userId: user.id,
                },
            });

            console.log('Élève créé:', student);
        } else {
            console.log('Un utilisateur avec cet email existe déjà:', existingUser);

            // Vérifier si l'élève existe
            const existingStudent = await prisma.student.findUnique({
                where: { userId: existingUser.id },
            });

            if (existingStudent) {
                console.log('Élève existant:', existingStudent);
            } else {
                // Créer l'élève
                const student = await prisma.student.create({
                    data: {
                        userId: existingUser.id,
                    },
                });

                console.log('Élève créé:', student);
            }
        }

        // 3. Créer une classe de test
        console.log('Création d\'une classe de test...');

        const existingClass = await prisma.renamedclass.findFirst({
            where: { name: 'Classe Test' },
        });

        if (!existingClass) {
            const classTest = await prisma.renamedclass.create({
                data: {
                    name: 'Classe Test',
                    level: 'CM2',
                    year: 2023,
                },
            });

            console.log('Classe créée:', classTest);
        } else {
            console.log('La classe existe déjà:', existingClass);
        }

        console.log('Création des données de test terminée avec succès.');

    } catch (error) {
        console.error('Erreur lors de la création des données de test:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestData();