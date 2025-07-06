async function testTeacherCreation() {
    try {
        console.log('Testing teacher creation API...');

        const teacherData = {
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@test-school.com',
            phone: '+33123456789',
            gender: 'male', // Correct enum value
            hireDate: '2024-01-15',
            subjects: ['Mathématiques', 'Sciences Physiques'], // Array of subject names
            qualification: 'Master en Mathématiques',
            experience: 5,
            salary: 35000
        };

        console.log('Teacher data:', JSON.stringify(teacherData, null, 2));

        const response = await fetch('http://localhost:3000/api/v1/teachers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': '507f1f77bcf86cd799439011' // Valid tenant ID
            },
            body: JSON.stringify(teacherData)
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        if (response.ok) {
            const result = await response.json();
            console.log('Success! Teacher created:', JSON.stringify(result, null, 2));
        } else {
            const error = await response.text();
            console.log('Error Response:', error);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

console.log('Starting teacher creation test...');
testTeacherCreation().then(() => {
    console.log('Test completed.');
}).catch(err => {
    console.error('Test failed:', err);
});