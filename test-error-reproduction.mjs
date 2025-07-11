const API_BASE = 'http://localhost:3000/api/v1';
const TENANT_ID = '686e9f326dac74822ee7c887';

async function testWithDifferentStudentIds() {
    console.log('🔍 Test de reproduction de l\'erreur avec différents types d\'ID étudiant...');

    // Différents types d'ID à tester
    const testCases = [{
            name: 'ID non-ObjectId (string)',
            etudiantId: 'student123',
            description: 'ID simple qui n\'est pas un ObjectId'
        },
        {
            name: 'ID court',
            etudiantId: '123',
            description: 'ID trop court'
        },
        {
            name: 'ID undefined',
            etudiantId: undefined,
            description: 'ID non défini'
        },
        {
            name: 'ID null',
            etudiantId: null,
            description: 'ID null'
        },
        {
            name: 'ObjectId valide',
            etudiantId: '675dcb8989d735cac82bcae7',
            description: 'ObjectId MongoDB valide (24 caractères hex)'
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n--- Test: ${testCase.name} ---`);
        console.log(`Description: ${testCase.description}`);
        console.log(`Valeur: "${testCase.etudiantId}"`);

        const dossierData = {
            etudiantId: testCase.etudiantId,
            nomEleve: 'Test Élève',
            numeroMatricule: 'TEST001',
            classe: '6ème M2',
            anneeScolaire: '2024-2025',
            remarques: `Test avec ${testCase.name}`
        };

        console.log('Données envoyées:', JSON.stringify(dossierData, null, 2));

        try {
            const response = await fetch(`${API_BASE}/scolarite/dossiers`, {
                method: 'POST',
                headers: {
                    'x-tenant-id': TENANT_ID,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dossierData)
            });

            console.log(`Status: ${response.status}`);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Succès:', result.id);
            } else {
                const errorText = await response.text();
                console.log('❌ Erreur:', errorText);

                // Analyser l'erreur spécifique
                if (errorText.includes('etudiantId must be a mongodb id')) {
                    console.log('🔍 Erreur confirmée: etudiantId doit être un ObjectId MongoDB');
                }
                if (errorText.includes('tenantId must be a string')) {
                    console.log('🔍 Erreur confirmée: tenantId doit être une string');
                }
            }
        } catch (error) {
            console.log('❌ Erreur réseau:', error.message);
        }
    }
}

// Test des validations ObjectId locales
function testObjectIdValidation() {
    console.log('\n🔍 Validation ObjectId locale...');

    const testIds = [
        'student123',
        '123',
        undefined,
        null,
        '',
        '675dcb8989d735cac82bcae7', // 24 caractères hex valides
        '675dcb8989d735cac82bcae7X', // 25 caractères
        '675dcb8989d735cac82bcae' // 23 caractères
    ];

    testIds.forEach(id => {
        const isValid = id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
        console.log(`   - "${id}": ${isValid ? '✅ Valide' : '❌ Invalide'}`);
    });
}

testObjectIdValidation();
testWithDifferentStudentIds();