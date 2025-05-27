// Script pour tester l'API des périodes
const fetch = require('node-fetch');

async function testPeriodsAPI() {
    console.log('Test de l\'API des périodes...');

    try {
        // Remplacez l'URL par votre URL de développement
        const response = await fetch('http://localhost:3001/api/periods', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log(`Statut de la réponse: ${response.status} ${response.statusText}`);
        console.log(`Nombre de périodes trouvées: ${data.length}`);

        if (data.length > 0) {
            console.log('Première période:');
            console.log(`- ID: ${data[0].id}`);
            console.log(`- Type: ${data[0].type}`);
            console.log(`- Année scolaire: ${data[0].schoolYear}`);
            console.log(`- Dates: ${new Date(data[0].startDate).toLocaleDateString('fr-FR')} au ${new Date(data[0].endDate).toLocaleDateString('fr-FR')}`);
            console.log(`- Statut: ${data[0].status}`);
        } else {
            console.log('Aucune période trouvée. Vérifiez que votre base de données contient des périodes.');

            // Proposition pour créer une période de test
            console.log('\nVous pouvez créer une période de test avec Prisma comme suit:');
            console.log(`
npx prisma studio
// Ou exécuter le code suivant:
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestPeriod() {
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
}

createTestPeriod()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
`);
        }
    } catch (error) {
        console.error('Erreur lors du test de l\'API:', error);
    }
}

testPeriodsAPI();