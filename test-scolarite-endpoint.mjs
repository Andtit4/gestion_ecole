// Test script to verify scolarité endpoints
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = dirname(__filename)

const testScolariteEndpoints = async() => {
    const tenantDomain = 'la-voix'

    const endpoints = [
        '/api/v1/scolarite/classes',
        '/api/v1/scolarite/frais-types',
        '/api/v1/scolarite/methodes-paiement',
        '/api/v1/scolarite/annees-scolaires',
        '/api/v1/scolarite/statistics',
        '/api/v1/scolarite/dossiers?page=1&limit=20'
    ]

    for (const endpoint of endpoints) {
        try {
            console.log(`🔍 Testing: ${endpoint}`)

            const response = await fetch(`http://localhost:3000${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Domain': tenantDomain
                }
            })

            console.log(`  Status: ${response.status}`)

            if (response.ok) {
                const data = await response.json()
                if (endpoint.includes('classes')) {
                    console.log(`  ✅ Classes:`, data.classes ? data.classes.slice(0, 3) : data)
                } else if (endpoint.includes('frais-types')) {
                    console.log(`  ✅ Frais types:`, data.types ? data.types.slice(0, 3) : data)
                } else if (endpoint.includes('methodes-paiement')) {
                    console.log(`  ✅ Méthodes:`, data.methodes ? data.methodes.slice(0, 3) : data)
                } else if (endpoint.includes('annees-scolaires')) {
                    console.log(`  ✅ Années:`, data.annees ? data.annees.slice(0, 3) : data)
                } else if (endpoint.includes('statistics')) {
                    console.log(`  ✅ Stats:`, Object.keys(data))
                } else if (endpoint.includes('dossiers')) {
                    console.log(`  ✅ Dossiers:`, data.total || 0, 'total')
                }
            } else {
                const errorText = await response.text()
                console.log(`  ❌ Error:`, errorText)
            }

        } catch (error) {
            console.log(`  ❌ Exception:`, error.message)
        }

        console.log('')
    }
}

testScolariteEndpoints()