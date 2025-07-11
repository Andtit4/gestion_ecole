import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/v1'

// Test de l'authentification et récupération du tenant actuel
async function testTenantIdDebug() {
    try {
        console.log('🔍 Test de débogage du tenantId...\n')

        // 1. Vérifier l'état des tenants dans le système
        console.log('1. Récupération des tenants disponibles...')
        const tenantsResponse = await axios.get(`${API_BASE_URL}/tenant`)
        console.log('Tenants trouvés:', tenantsResponse.data.length)

        if (tenantsResponse.data.length === 0) {
            console.log('❌ Aucun tenant trouvé dans le système')
            return
        }

        const tenant = tenantsResponse.data[0]
        console.log('Premier tenant:', {
            id: tenant._id,
            name: tenant.name,
            domain: tenant.domain
        })

        // 2. Test avec ce tenantId
        const tenantId = tenant._id
        console.log(`\n2. Test avec tenantId: ${tenantId}`)
        console.log('Type:', typeof tenantId)
        console.log('Longueur:', tenantId.length)
        console.log('Est valide ObjectId:', /^[0-9a-fA-F]{24}$/.test(tenantId))

        // 3. Test de création d'un dossier avec ce tenantId
        console.log('\n3. Test de création de dossier...')

        const dossierData = {
            etudiantId: '507f1f77bcf86cd799439011', // ObjectId fictif mais valide
            nomEleve: 'Test Élève',
            numeroMatricule: 'TEST001',
            classe: 'Test Classe',
            anneeScolaire: '2024-2025',
            remarques: 'Test de debug tenantId'
        }

        const headers = {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantId
        }

        console.log('Headers envoyés:', headers)
        console.log('Données envoyées:', dossierData)

        try {
            const response = await axios.post(
                `${API_BASE_URL}/scolarite/dossiers`,
                dossierData, { headers }
            )
            console.log('✅ Succès:', response.data)
        } catch (error) {
            console.log('❌ Erreur API:', error.response ? .status, error.response ? .data ? .message || error.message)

            if (error.response ? .data ? .message) {
                console.log('Message d\'erreur détaillé:', error.response.data.message)
            }
        }

    } catch (error) {
        console.error('❌ Erreur générale:', error.message)
    }
}

testTenantIdDebug()