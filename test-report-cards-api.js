// Script pour tester l'API des bulletins
const fetch = require('node-fetch');

async function testReportCardsAPI() {
    console.log('Test de l\'API des bulletins...');

    try {
        // Remplacez l'URL par votre URL de développement
        const response = await fetch('http://localhost:3001/api/report-cards', {
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
        console.log(`Nombre de bulletins trouvés: ${data.length}`);

        if (data.length > 0) {
            console.log('Premier bulletin:');
            console.log(`- ID: ${data[0].id}`);
            console.log(`- Élève: ${data[0].student.user.firstName} ${data[0].student.user.lastName}`);
            console.log(`- Classe: ${data[0].student.class ? data[0].student.class.name : 'Non assigné'}`);
            console.log(`- Période: ${data[0].period.type} - ${data[0].period.schoolYear}`);
            console.log(`- Moyenne: ${data[0].average}/20`);
            console.log(`- Statut: ${data[0].status}`);
        } else {
            console.log('Aucun bulletin trouvé. Vérifiez que votre base de données contient des bulletins.');
        }
    } catch (error) {
        console.error('Erreur lors du test de l\'API:', error);
    }
}

testReportCardsAPI();