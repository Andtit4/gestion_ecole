// Script pour tester l'API des élèves
const fetch = require('node-fetch');

async function testStudentsAPI() {
    console.log('Test de l\'API des élèves...');

    try {
        // Remplacez l'URL par votre URL de développement
        const response = await fetch('http://localhost:3001/api/students', {
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
        console.log(`Nombre d'élèves trouvés: ${data.length}`);

        if (data.length > 0) {
            console.log('Premier élève:');
            console.log(`- ID: ${data[0].id}`);
            console.log(`- Nom: ${data[0].user.firstName} ${data[0].user.lastName}`);
            console.log(`- Classe: ${data[0].class ? data[0].class.name : 'Non assigné'}`);
        } else {
            console.log('Aucun élève trouvé. Vérifiez que votre base de données contient des élèves.');
        }
    } catch (error) {
        console.error('Erreur lors du test de l\'API:', error);
    }
}

testStudentsAPI();