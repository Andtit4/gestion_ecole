import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from '../modules/tenant/schemas/tenant.schema';
import * as bcrypt from 'bcryptjs';

async function createAdmin() {
  const app = await NestFactory.create(AppModule);
  const tenantModel = app.get<Model<Tenant>>(getModelToken(Tenant.name));

  try {
    console.log('🔄 Création d\'un établissement de test avec admin...\n');

    // Paramètres de l'établissement
    const schoolData = {
      domain: 'mon-ecole-test', // Domaine unique
      schoolName: 'Mon École de Test',
      adminUsername: 'admin',
      adminPassword: 'password123',
      adminEmail: 'admin@mon-ecole-test.fr'
    };

    // Vérifier si l'établissement existe déjà
    const existingTenant = await tenantModel.findOne({ domain: schoolData.domain });
    
    if (existingTenant) {
      console.log('❌ Un établissement avec ce domaine existe déjà !');
      console.log('ℹ️  Informations de connexion existantes :');
      console.log('┌─────────────────────────────────────────────┐');
      console.log('│               CONNEXION ADMIN               │');
      console.log('├─────────────────────────────────────────────┤');
      console.log(`│ 🌐 Domaine     : ${existingTenant.domain.padEnd(23)} │`);
      console.log(`│ 👤 Utilisateur : ${existingTenant.admin.username.padEnd(23)} │`);
      console.log(`│ 🔑 Mot de passe: password123               │`);
      console.log(`│ 📧 Email       : ${existingTenant.admin.email.padEnd(23)} │`);
      console.log('└─────────────────────────────────────────────┘');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(schoolData.adminPassword, 12);
    
    // Créer les données de l'établissement
    const tenantData = {
      name: schoolData.schoolName,
      domain: schoolData.domain,
      email: schoolData.adminEmail,
      phone: '+33123456789',
      address: {
        street: '123 Rue de l\'École',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
             subscription: {
         plan: 'enterprise', // Plan enterprise pour avoir toutes les fonctionnalités
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
        maxStudents: 500,
        maxTeachers: 50,
        features: [
          'unlimited_classes',
          'advanced_reports', 
          'parent_portal',
          'mobile_app',
          'api_access'
        ],
        pricePerMonth: 150,
        isActive: true
      },
      settings: {
        schoolType: 'secondary',
        academicYearStart: '09-01',
        academicYearEnd: '06-30',
        gradeSystem: 'numeric',
        maxGrade: 20,
        language: 'fr',
        timezone: 'Europe/Paris',
        currency: 'EUR'
      },
      admin: {
        firstName: 'Administrateur',
        lastName: 'Principal',
        email: schoolData.adminEmail,
        phone: '+33123456789',
        title: 'Directeur',
        username: schoolData.adminUsername,
        password: hashedPassword,
        isActive: true,
        lastLogin: new Date()
      },
      status: 'active'
    };

    // Créer l'établissement
    const tenant = new tenantModel(tenantData);
    await tenant.save();
    
    console.log('✅ Établissement créé avec succès !\n');
    
    // Afficher les informations de connexion
    console.log('🎉 FÉLICITATIONS ! Votre établissement est prêt.');
    console.log('');
    console.log('┌─────────────────────────────────────────────┐');
    console.log('│               CONNEXION ADMIN               │');
    console.log('├─────────────────────────────────────────────┤');
    console.log(`│ 🌐 Domaine     : ${schoolData.domain.padEnd(23)} │`);
    console.log(`│ 👤 Utilisateur : ${schoolData.adminUsername.padEnd(23)} │`);
    console.log(`│ 🔑 Mot de passe: ${schoolData.adminPassword.padEnd(23)} │`);
    console.log(`│ 📧 Email       : ${schoolData.adminEmail.padEnd(23)} │`);
    console.log('└─────────────────────────────────────────────┘');
    console.log('');
    console.log('📝 ÉTAPES POUR SE CONNECTER :');
    console.log('1. Allez sur http://localhost:5173/school-login');
    console.log(`2. Entrez le domaine : ${schoolData.domain}`);
    console.log(`3. Entrez le nom d\'utilisateur : ${schoolData.adminUsername}`);
    console.log(`4. Entrez le mot de passe : ${schoolData.adminPassword}`);
    console.log('5. Cliquez sur "Se connecter"');
    console.log('');
    console.log('🚀 Vous serez automatiquement redirigé vers le dashboard !');
    console.log('');
    console.log(`📊 Établissement : ${schoolData.schoolName}`);
         console.log(`🎯 Plan : Enterprise (500 élèves max, 50 professeurs max)`);
    console.log(`⏰ Abonnement valide jusqu'au : ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'établissement:', error.message);
    if (error.code === 11000) {
      console.log('ℹ️  Un établissement avec ce domaine ou cet email existe déjà.');
    }
  } finally {
    await app.close();
  }
}

// Exporter la fonction pour pouvoir l'utiliser dans d'autres scripts
export { createAdmin };

// Exécuter le script si appelé directement
if (require.main === module) {
  createAdmin();
} 