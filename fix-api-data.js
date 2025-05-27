// Script pour vérifier et créer des données de test pour l'application
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixApiData() {
    console.log('Vérification et création des données de test pour l\'application...');

    try {
        console.log('1. Vérification des périodes...');
        const existingPeriods = await prisma.period.findMany();
        console.log(`Périodes existantes: ${existingPeriods.length}`);

        if (existingPeriods.length === 0) {
            console.log('Aucune période trouvée. Création d\'une période de test...');

            const newPeriod = await prisma.period.create({
                data: {
                    type: 'TRIMESTER',
                    startDate: new Date('2023-09-01'),
                    endDate: new Date('2023-12-20'),
                    schoolYear: '2023-2024',
                    status: 'ACTIVE',
                },
            });

            console.log('Période créée:', newPeriod);
            existingPeriods.push(newPeriod);
        } else {
            console.log('Périodes existantes:');
            existingPeriods.forEach((period, index) => {
                console.log(`- Période ${index + 1}: ${period.type} (${period.schoolYear}) - ${period.status}`);
                console.log(`  Du ${period.startDate.toISOString().split('T')[0]} au ${period.endDate.toISOString().split('T')[0]}`);
                console.log(`  ID: ${period.id}`);
            });
        }

        console.log('\n2. Vérification des classes...');
        const existingClasses = await prisma.renamedclass.findMany();
        console.log(`Classes existantes: ${existingClasses.length}`);

        let testClass = null;
        if (existingClasses.length === 0) {
            console.log('Aucune classe trouvée. Création d\'une classe de test...');

            testClass = await prisma.renamedclass.create({
                data: {
                    name: 'Classe Test',
                    level: 'CM2',
                    year: 2023,
                },
            });

            console.log('Classe créée:', testClass);
        } else {
            console.log('Classes existantes:');
            existingClasses.forEach((cls, index) => {
                console.log(`- Classe ${index + 1}: ${cls.name} (Niveau: ${cls.level}, Année: ${cls.year})`);
                console.log(`  ID: ${cls.id}`);
            });
            testClass = existingClasses[0]; // Utiliser la première classe existante
        }

        console.log('\n3. Vérification des utilisateurs et élèves...');
        const users = await prisma.user.findMany({
            where: {
                role: 'STUDENT'
            },
            include: {
                student: true
            }
        });
        console.log(`Utilisateurs élèves existants: ${users.length}`);

        if (users.length === 0) {
            console.log('Aucun utilisateur élève trouvé. Création d\'un utilisateur et élève de test...');

            const newUser = await prisma.user.create({
                data: {
                    firstName: 'Élève',
                    lastName: 'Test',
                    email: 'eleve.test@ecole.com',
                    password: 'motdepasse',
                    role: 'STUDENT',
                },
            });

            console.log('Utilisateur créé:', newUser);

            const newStudent = await prisma.student.create({
                data: {
                    userId: newUser.id,
                    classId: testClass ? testClass.id : null,
                },
            });

            console.log('Élève créé:', newStudent);
        } else {
            console.log('Utilisateurs élèves existants:');
            for (const user of users) {
                console.log(`- ${user.firstName} ${user.lastName} (${user.email})`);
                console.log(`  ID utilisateur: ${user.id}`);

                if (user.student) {
                    console.log(`  ID élève: ${user.student.id}`);
                    console.log(`  Classe: ${user.student.classId || 'Non assigné'}`);
                } else {
                    console.log('  Pas de profil élève associé. Création...');

                    const newStudent = await prisma.student.create({
                        data: {
                            userId: user.id,
                            classId: testClass ? testClass.id : null,
                        },
                    });

                    console.log('  Élève créé:', newStudent);
                }
            }
        }

        console.log('\n4. Vérification des bulletins...');
        const reportCards = await prisma.reportcard.findMany({
            include: {
                student: {
                    include: {
                        user: true
                    }
                },
                period: true
            }
        });

        console.log(`Bulletins existants: ${reportCards.length}`);

        if (reportCards.length > 0) {
            console.log('Bulletins existants:');
            reportCards.forEach((reportCard, index) => {
                console.log(`- Bulletin ${index + 1}:`);
                console.log(`  ID: ${reportCard.id}`);
                console.log(`  Élève: ${reportCard.student.user.firstName} ${reportCard.student.user.lastName}`);
                console.log(`  Période: ${reportCard.period.type} - ${reportCard.period.schoolYear}`);
                console.log(`  Moyenne: ${reportCard.average}`);
                console.log(`  Statut: ${reportCard.status}`);
            });
        } else {
            console.log('Aucun bulletin trouvé. Vous pouvez en créer via l\'interface utilisateur.');

            // Vérifier si nous avons tout ce qu'il faut pour créer un bulletin de test
            const students = await prisma.student.findMany();

            if (students.length > 0 && existingPeriods.length > 0) {
                console.log('Création d\'un bulletin de test...');

                const testReportCard = await prisma.reportcard.create({
                    data: {
                        studentId: students[0].id,
                        periodId: existingPeriods[0].id,
                        average: 14.5,
                        appreciation: "Bon travail dans l'ensemble. Continuez ainsi !",
                        status: "DRAFT"
                    }
                });

                console.log('Bulletin créé:', testReportCard);
            }
        }

        console.log('\nVérification terminée. Des données de test ont été créées si nécessaire.');

    } catch (error) {
        console.error('Erreur lors de la vérification/création des données de test:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixApiData();