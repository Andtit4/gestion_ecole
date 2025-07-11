const API_BASE = 'http://localhost:3000/api/v1';
const TENANT_ID = '686e9f326dac74822ee7c887';

async function createTestStudent() {
    console.log('🔍 Création d\'un étudiant de test...');

    const studentData = {
        firstName: 'Jean',
        lastName: 'Dupont',
        studentNumber: 'TEST001',
        birthDate: '2010-01-15',
        gender: 'M',
        academicInfo: {
            className: '6ème M2',
            currentYear: '2024-2025',
            status: 'active'
        },
        contactInfo: {
            phone: '123456789',
            email: 'jean.dupont@test.com',
            address: '123 Test Street'
        }
    };

    try {
        const response = await fetch(`${API_BASE}/students`, {
            method: 'POST',
            headers: {
                'x-tenant-id': TENANT_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        console.log('Status:', response.status);

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Étudiant créé avec succès!');
            console.log('   - ID:', result._id);
            console.log('   - Nom:', result.firstName, result.lastName);
            console.log('   - Matricule:', result.studentNumber);

            // Maintenant, essayer de créer un dossier avec cet étudiant
            await createDossierWithStudent(result);

        } else {
            const errorText = await response.text();
            console.error('❌ Erreur lors de la création de l\'étudiant:', errorText);
        }
    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    }
}

async function createDossierWithStudent(student) {
    console.log('\n🔍 Création d\'un dossier pour l\'étudiant...');

    const dossierData = {
        etudiantId: student._id, // Utiliser l'ObjectId réel
        nomEleve: `${student.firstName} ${student.lastName}`,
        numeroMatricule: student.studentNumber,
        classe: student.academicInfo.className,
        anneeScolaire: student.academicInfo.currentYear,
        remarques: 'Dossier de test créé par script'
    };

    console.log('Données du dossier:', JSON.stringify(dossierData, null, 2));

    try {
        const response = await fetch(`${API_BASE}/scolarite/dossiers`, {
            method: 'POST',
            headers: {
                'x-tenant-id': TENANT_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dossierData)
        });

        console.log('Status:', response.status);

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Dossier créé avec succès!');
            console.log('   - ID:', result._id);
            console.log('   - Étudiant:', result.nomEleve);
            console.log('   - Matricule:', result.numeroMatricule);
        } else {
            const errorText = await response.text();
            console.error('❌ Erreur lors de la création du dossier:', errorText);
        }
    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    }
}

createTestStudent();