import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TenantService } from '../modules/tenant/tenant.service';
import { 
  SubscriptionPlan,
  TenantStatus 
} from '../common/interfaces/tenant.interface';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tenantService = app.get(TenantService);

  console.log('🌱 Initialisation des données de test...');

  try {
    // Créer quelques tenants de test
    const tenants = [
      {
        name: 'Lycée Saint-Joseph',
        domain: 'lycee-saint-joseph',
        email: 'admin@lycee-saint-joseph.edu',
        phone: '+33 1 23 45 67 89',
        address: {
          street: '123 Rue de l\'École',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
        },
        settings: {
          schoolType: 'secondary' as const,
          academicYearStart: '09-01',
          academicYearEnd: '07-15',
          gradeSystem: 'numeric' as const,
          maxGrade: 20,
          language: 'fr',
          timezone: 'Europe/Paris',
          currency: 'EUR',
        },
        subscription: {
          plan: SubscriptionPlan.STANDARD,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 an
          maxStudents: 300,
          maxTeachers: 25,
          pricePerMonth: 59,
        },
        admin: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@lycee-saint-joseph.edu',
          phone: '+33 1 23 45 67 90',
          title: 'Directeur',
        },
      },
      {
        name: 'École Primaire Les Tilleuls',
        domain: 'ecole-les-tilleuls',
        email: 'direction@ecole-tilleuls.fr',
        phone: '+33 4 56 78 90 12',
        address: {
          street: '45 Avenue des Tilleuls',
          city: 'Lyon',
          postalCode: '69000',
          country: 'France',
        },
        settings: {
          schoolType: 'primary' as const,
          academicYearStart: '09-01',
          academicYearEnd: '07-01',
          gradeSystem: 'letter' as const,
          maxGrade: 5, // A, B, C, D, E
          language: 'fr',
          timezone: 'Europe/Paris',
          currency: 'EUR',
        },
        subscription: {
          plan: SubscriptionPlan.STARTER,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          maxStudents: 100,
          maxTeachers: 10,
          pricePerMonth: 29,
        },
        admin: {
          firstName: 'Marie',
          lastName: 'Martin',
          email: 'marie.martin@ecole-tilleuls.fr',
          phone: '+33 4 56 78 90 13',
          title: 'Directrice',
        },
      },
      {
        name: 'Université Technologique de Grenoble',
        domain: 'utg',
        email: 'admin@utg.edu',
        phone: '+33 4 76 12 34 56',
        address: {
          street: '123 Campus Universitaire',
          city: 'Grenoble',
          postalCode: '38000',
          country: 'France',
        },
        settings: {
          schoolType: 'university' as const,
          academicYearStart: '09-15',
          academicYearEnd: '06-30',
          gradeSystem: 'points' as const,
          maxGrade: 100,
          language: 'fr',
          timezone: 'Europe/Paris',
          currency: 'EUR',
        },
        subscription: {
          plan: SubscriptionPlan.ENTERPRISE,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          maxStudents: 999999,
          maxTeachers: 999999,
          pricePerMonth: 199,
        },
        admin: {
          firstName: 'Pierre',
          lastName: 'Durand',
          email: 'pierre.durand@utg.edu',
          phone: '+33 4 76 12 34 57',
          title: 'Président',
        },
      },
    ];

    for (const tenantData of tenants) {
      try {
        const result = await tenantService.create(tenantData);
        // Activer directement le tenant pour les tests
        await tenantService.activate((result.tenant as any)._id.toString());
        console.log(`✅ Tenant créé : ${result.tenant.name} (${result.tenant.domain})`);
        console.log(`📧 Identifiants admin : ${result.adminCredentials.username} / ${result.adminCredentials.password}`);
      } catch (error) {
        if (error.message.includes('déjà utilisé')) {
          console.log(`⚠️  Tenant existe déjà : ${tenantData.name}`);
        } else {
          console.error(`❌ Erreur création tenant ${tenantData.name}:`, error.message);
        }
      }
    }

    console.log('✨ Initialisation terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
  } finally {
    await app.close();
  }
}

// Exécuter le seeding
seed().catch(console.error); 