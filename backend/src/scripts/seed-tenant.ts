import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant } from '../modules/tenant/schemas/tenant.schema';
import * as bcrypt from 'bcryptjs';

async function seedTenant() {
  const app = await NestFactory.create(AppModule);
  const tenantModel = app.get<Model<Tenant>>(getModelToken(Tenant.name));

  try {
    // Vérifier si le tenant existe déjà
    const tenantId = '507f1f77bcf86cd799439011';
    const existingTenant = await tenantModel.findById(tenantId);
    
    if (existingTenant) {
      console.log('Tenant existant trouvé:', existingTenant.domain);
      return;
    }

    console.log('Tenant non trouvé, création...');

    // Créer un tenant de test
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const tenantData = {
      _id: new Types.ObjectId(tenantId),
      name: 'École Test',
      domain: 'test-school',
      email: 'admin@test-school.com',
      phone: '+33123456789',
      address: {
        street: '123 Rue de l\'École',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      subscription: {
        plan: 'starter', // STARTER enum value
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
        maxStudents: 100,
        maxTeachers: 20,
        features: ['basic_features'],
        pricePerMonth: 50,
        isActive: true
      },
      settings: {
        schoolType: 'secondary',
        academicYearStart: '09-01', // MM-DD format
        academicYearEnd: '06-30', // MM-DD format
        gradeSystem: 'numeric',
        maxGrade: 20,
        language: 'fr',
        timezone: 'Europe/Paris',
        currency: 'EUR'
      },
      admin: {
        firstName: 'Admin',
        lastName: 'Test',
        email: 'admin@test-school.com',
        username: 'test-school-admin',
        password: hashedPassword,
        isActive: true
      },
      status: 'active'
    };

    // Créer le tenant avec l'ID spécifique
    const tenant = new tenantModel(tenantData);
    await tenant.save();
    
    console.log('Tenant créé avec succès:', tenant.domain);
    console.log('ID du tenant:', tenant._id);

  } catch (error) {
    console.error('Erreur lors de la création du tenant:', error);
  } finally {
    await app.close();
  }
}

// Exécuter le script
if (require.main === module) {
  seedTenant();
} 