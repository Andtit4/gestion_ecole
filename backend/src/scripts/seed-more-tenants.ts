import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant } from '../modules/tenant/schemas/tenant.schema';
import * as bcrypt from 'bcryptjs';

async function seedMoreTenants() {
  const app = await NestFactory.create(AppModule);
  const tenantModel = app.get<Model<Tenant>>(getModelToken(Tenant.name));

  try {
    const tenantsToCreate = [
      {
        name: 'Lycée Victor Hugo',
        domain: 'lycee-victor-hugo',
        email: 'admin@lycee-victor-hugo.fr',
        phone: '+33145678901',
        schoolType: 'secondary' as const,
        adminFirstName: 'Marie',
        adminLastName: 'Dupont'
      },
      {
        name: 'École Primaire Jean de La Fontaine',
        domain: 'ecole-lafontaine',
        email: 'direction@ecole-lafontaine.fr',
        phone: '+33156789012',
        schoolType: 'primary' as const,
        adminFirstName: 'Pierre',
        adminLastName: 'Martin'
      },
      {
        name: 'Université Paris-Saclay Campus',
        domain: 'univ-paris-saclay',
        email: 'admin@univ-paris-saclay.fr',
        phone: '+33167890123',
        schoolType: 'university' as const,
        adminFirstName: 'Sophie',
        adminLastName: 'Leroy'
      }
    ];

    for (const tenantInfo of tenantsToCreate) {
      // Vérifier si le tenant existe déjà
      const existing = await tenantModel.findOne({ domain: tenantInfo.domain });
      if (existing) {
        console.log(`Tenant ${tenantInfo.name} existe déjà`);
        continue;
      }

      const hashedPassword = await bcrypt.hash('password123', 12);
      
      const tenantData = {
        name: tenantInfo.name,
        domain: tenantInfo.domain,
        email: tenantInfo.email,
        phone: tenantInfo.phone,
        address: {
          street: `${Math.floor(Math.random() * 999) + 1} Rue de l'École`,
          city: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'][Math.floor(Math.random() * 5)],
          postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
          country: 'France'
        },
        subscription: {
          plan: ['starter', 'standard', 'enterprise'][Math.floor(Math.random() * 3)],
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
          maxStudents: [100, 500, 1000][Math.floor(Math.random() * 3)],
          maxTeachers: [20, 50, 100][Math.floor(Math.random() * 3)],
          features: ['basic_features'],
          pricePerMonth: [29, 99, 199][Math.floor(Math.random() * 3)],
          isActive: true
        },
        settings: {
          schoolType: tenantInfo.schoolType,
          academicYearStart: '09-01',
          academicYearEnd: '06-30',
          gradeSystem: 'numeric',
          maxGrade: tenantInfo.schoolType === 'university' ? 20 : (tenantInfo.schoolType === 'primary' ? 10 : 20),
          language: 'fr',
          timezone: 'Europe/Paris',
          currency: 'EUR'
        },
        admin: {
          firstName: tenantInfo.adminFirstName,
          lastName: tenantInfo.adminLastName,
          email: tenantInfo.email,
          username: `${tenantInfo.domain}-admin`,
          password: hashedPassword,
          isActive: true
        },
        status: 'active'
      };

      const tenant = new tenantModel(tenantData);
      await tenant.save();
      
      console.log(`Tenant créé avec succès: ${tenant.name} (${tenant.domain})`);
      console.log(`ID du tenant: ${tenant._id}`);
    }

    console.log('\nTous les tenants ont été créés avec succès!');

  } catch (error) {
    console.error('Erreur lors de la création des tenants:', error);
  } finally {
    await app.close();
  }
}

// Exécuter le script
if (require.main === module) {
  seedMoreTenants();
} 