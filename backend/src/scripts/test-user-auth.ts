import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';

async function testUserAuthentication() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    console.log('🧪 Test d\'authentification des utilisateurs...\n');

    // Test 1: Super-admin
    console.log('1️⃣ Test Super-Admin:');
    const superAdminResult = await usersService.authenticate(
      'superadmin@school-system.com',
      'SuperAdmin2024!',
      'SUPER_ADMIN_TENANT'
    );

    if (superAdminResult) {
      console.log('✅ Super-admin authentifié avec succès');
      console.log(`   - Nom: ${superAdminResult.firstName} ${superAdminResult.lastName}`);
      console.log(`   - Email: ${superAdminResult.email}`);
      console.log(`   - Permissions: ${superAdminResult.permissions.length}`);
    } else {
      console.log('❌ Échec authentification super-admin');
    }

    // Test 2: Admin d'établissement
    console.log('\n2️⃣ Test Admin d\'établissement:');
    const adminResult = await usersService.authenticate(
      'admin@mon-ecole.com',
      'AdminPass123!',
      '68540ab873220ffd7c30046f' // Remplacez par votre tenant ID
    );

    if (adminResult) {
      console.log('✅ Admin d\'établissement authentifié avec succès');
      console.log(`   - Nom: ${adminResult.firstName} ${adminResult.lastName}`);
      console.log(`   - Email: ${adminResult.email}`);
      console.log(`   - Permissions: ${adminResult.permissions.length}`);
    } else {
      console.log('❌ Échec authentification admin d\'établissement');
    }

    // Test 3: Mauvais mot de passe
    console.log('\n3️⃣ Test mauvais mot de passe:');
    const badPasswordResult = await usersService.authenticate(
      'superadmin@school-system.com',
      'MauvaisMotDePasse',
      'SUPER_ADMIN_TENANT'
    );

    if (badPasswordResult) {
      console.log('❌ PROBLÈME: Authentification réussie avec mauvais mot de passe!');
    } else {
      console.log('✅ Mauvais mot de passe correctement rejeté');
    }

    // Test 4: Utilisateur inexistant
    console.log('\n4️⃣ Test utilisateur inexistant:');
    const nonExistentResult = await usersService.authenticate(
      'inexistant@example.com',
      'password',
      'SUPER_ADMIN_TENANT'
    );

    if (nonExistentResult) {
      console.log('❌ PROBLÈME: Utilisateur inexistant authentifié!');
    } else {
      console.log('✅ Utilisateur inexistant correctement rejeté');
    }

    console.log('\n🎉 Tests d\'authentification terminés!');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await app.close();
  }
}

// Exécuter le script
testUserAuthentication()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }); 