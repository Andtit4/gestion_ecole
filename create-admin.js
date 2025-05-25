const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
    try {
        // Vérifier si l'administrateur existe déjà
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@ecole.fr' }
        });

        if (existingAdmin) {
            console.log('Un administrateur avec cet email existe déjà');
            return;
        }

        // Créer l'administrateur
        const admin = await prisma.user.create({
            data: {
                email: 'admin@ecole.fr',
                password: 'admin123', // Utilisez un mot de passe sécurisé en production
                firstName: 'Admin',
                lastName: 'Système',
                role: 'ADMIN',
            }
        });

        console.log('Administrateur créé avec succès:');
        console.log(`ID: ${admin.id}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Nom: ${admin.firstName} ${admin.lastName}`);
        console.log(`Rôle: ${admin.role}`);
    } catch (error) {
        console.error('Erreur lors de la création de l\'administrateur:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();