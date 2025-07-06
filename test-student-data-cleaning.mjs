// Test du nettoyage des données d'étudiant
function cleanField(obj, field) {
    if (!obj[field] || obj[field] === '' || obj[field] === null || obj[field] === undefined || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
        delete obj[field]
    }
}

// Données de test similaires à ce qui pourrait venir du formulaire
const testData = {
    firstName: 'Jean',
    lastName: 'Dupont',
    studentNumber: 'STU20241234',
    email: 'jean.dupont@example.com',
    phone: '', // Champ vide
    dateOfBirth: '2000-01-01',
    gender: 'M',
    address: {
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
    },
    parentContact: {
        fatherName: 'Pierre Dupont',
        fatherPhone: '+33123456789',
        fatherEmail: '', // Email vide
        motherName: '', // Nom vide
        motherPhone: '',
        motherEmail: '   ', // Email avec espaces
        guardianName: '',
        guardianPhone: '',
        guardianEmail: ''
    },
    academicInfo: {
        classId: 'class123',
        className: '6ème A',
        level: '6ème',
        section: '', // Section vide
        enrollmentDate: '2024-09-01',
        status: 'active'
    },
    medicalInfo: {
        allergies: [],
        medications: [],
        emergencyContact: '', // Contact vide
        bloodType: '',
        specialNeeds: ''
    }
}

console.log('Données avant nettoyage:', JSON.stringify(testData, null, 2))

// Nettoyer selon notre logique
const cleanedParentContact = {...testData.parentContact }

cleanField(cleanedParentContact, 'fatherName')
cleanField(cleanedParentContact, 'fatherPhone')
cleanField(cleanedParentContact, 'fatherEmail')
cleanField(cleanedParentContact, 'motherName')
cleanField(cleanedParentContact, 'motherPhone')
cleanField(cleanedParentContact, 'motherEmail')
cleanField(cleanedParentContact, 'guardianName')
cleanField(cleanedParentContact, 'guardianPhone')
cleanField(cleanedParentContact, 'guardianEmail')

testData.parentContact = cleanedParentContact

cleanField(testData, 'phone')
cleanField(testData.academicInfo, 'section')

if (testData.medicalInfo) {
    cleanField(testData.medicalInfo, 'emergencyContact')
    cleanField(testData.medicalInfo, 'bloodType')
    cleanField(testData.medicalInfo, 'specialNeeds')

    if (!testData.medicalInfo.allergies || testData.medicalInfo.allergies.length === 0 &&
        (!testData.medicalInfo.medications || testData.medicalInfo.medications.length === 0) &&
        !testData.medicalInfo.emergencyContact &&
        !testData.medicalInfo.bloodType &&
        !testData.medicalInfo.specialNeeds) {
        delete testData.medicalInfo
    }
}

console.log('\nDonnées après nettoyage:', JSON.stringify(testData, null, 2))

// Vérifier qu'il n'y a plus de champs d'email vides
function checkNoEmptyEmails(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
        if (key.toLowerCase().includes('email') && (value === '' || value === null || value === undefined)) {
            console.error(`❌ Email vide trouvé à ${path}.${key}:`, value)
            return false
        }
        if (typeof value === 'object' && value !== null) {
            if (!checkNoEmptyEmails(value, path ? `${path}.${key}` : key)) {
                return false
            }
        }
    }
    return true
}

if (checkNoEmptyEmails(testData)) {
    console.log('✅ Aucun email vide trouvé!')
} else {
    console.log('❌ Des emails vides ont été trouvés!')
}