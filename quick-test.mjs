async function quickTest() {
    try {
        console.log('Testing current API state...');

        // Test avec des noms de matières (comme actuellement)
        const teacherData = {
            firstName: 'Test',
            lastName: 'Teacher',
            email: 'test.teacher@example.com',
            gender: 'male',
            hireDate: '2024-01-15',
            subjects: ['Math', 'Physics'] // Noms de matières au lieu d'IDs
        };

        console.log('Sending data:', JSON.stringify(teacherData, null, 2));

        const response = await fetch('http://localhost:3000/api/v1/teachers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': '507f1f77bcf86cd799439011'
            },
            body: JSON.stringify(teacherData)
        });

        console.log('Status:', response.status);

        if (response.ok) {
            const result = await response.json();
            console.log('SUCCESS!');
        } else {
            const error = await response.text();
            console.log('Error:', error);

            if (error.includes('employeeId')) {
                console.log('\n❌ PROBLEM: Still using academic schema with employeeId');
            }
            if (error.includes('ObjectId')) {
                console.log('\n❌ PROBLEM: Schema expects ObjectIds for subjects');
            }
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

quickTest();