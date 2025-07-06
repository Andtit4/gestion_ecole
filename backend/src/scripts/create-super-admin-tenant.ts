import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TenantService } from '../modules/tenant/tenant.service';

async function createSuperAdminTenant() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tenantService = app.get(TenantService);

  try {
    console.log('🚀 Création du tenant spécial pour super-admin...');

    // Vérifier si le tenant SUPER_ADMIN existe déjà
    try {
      const existingTenant = await tenantService.findByDomain('super-admin');
      if (existingTenant) {
        console.log('✅ Tenant super-admin existe déjà');
        console.log('📧 Email:', existingTenant.email);
        console.log('🆔 ID:', (existingTenant as any)._id);
        return;
      }
    } catch (error) {
      // Le tenant n'existe pas, nous allons le créer
    }

    // Créer le tenant spécial SUPER_ADMIN
    const now = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(now.getFullYear() + 1);

    const superAdminTenantData = {
      name: 'Super Administration',
      domain: 'super-admin',
      email: 'superadmin@school-system.com',
      phone: '+33 1 00 00 00 00',
      address: {
        street: '1 Admin Street',
        city: 'Paris',
        postalCode: '75000',
        country: 'France'
      },
      admin: {
        firstName: 'Super',
        lastName: 'Administrator',
        email: 'superadmin@school-system.com',
        phone: '+33 1 00 00 00 00',
        title: 'Super Administrateur'
      },
      subscription: {
        plan: 'enterprise' as any,
        startDate: now.toISOString(),
        endDate: oneYearLater.toISOString(),
        maxStudents: 999999,
        maxTeachers: 999999,
        features: [
          'unlimited_students',
          'unlimited_teachers',
          'advanced_analytics',
          'custom_reports',
          'api_access',
          'priority_support',
          'custom_branding',
          'advanced_permissions'
        ],
        pricePerMonth: 0, // Gratuit pour le super-admin
        isActive: true
      },
      settings: {
        schoolType: 'secondary' as any,
        academicYearStart: '01-01',
        academicYearEnd: '12-31',
        gradeSystem: 'numeric' as any,
        maxGrade: 20,
        language: 'fr',
        timezone: 'Europe/Paris',
        currency: 'EUR'
      }
    };

    const result = await tenantService.create(superAdminTenantData);
    const tenant = result.tenant;

    console.log('✅ Tenant SUPER_ADMIN créé avec succès!');
    console.log('==========================================');
    console.log('🏢 Nom:', tenant.name);
    console.log('🌐 Domaine:', tenant.domain);
    console.log('📧 Email:', tenant.email);
    console.log('👤 Admin:', `${tenant.admin.firstName} ${tenant.admin.lastName}`);
    console.log('🆔 Tenant ID:', (tenant as any)._id);
    console.log('👤 Username:', result.adminCredentials.username);
    console.log('🔐 Password:', result.adminCredentials.password);
    console.log('==========================================');

    console.log('\n🔐 INFORMATIONS DE CONNEXION SUPER-ADMIN:');
    console.log('URL: http://localhost:3000/school-login');
    console.log('Domaine: super-admin');
    console.log('Username:', result.adminCredentials.username);
    console.log('Mot de passe:', result.adminCredentials.password);

    console.log('\n📝 Ce tenant permet au super-admin de se connecter');
    console.log('   via l\'interface standard avec le domaine super-admin');

  } catch (error) {
    console.error('❌ Erreur lors de la création du tenant super-admin:', error);
    if (error.code === 11000) {
      console.error('💡 Un tenant avec ce domaine existe peut-être déjà');
    }
  } finally {
    await app.close();
  }
}

// Exécuter le script
createSuperAdminTenant()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }); 