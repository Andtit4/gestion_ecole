import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TenantController } from '../modules/tenant/tenant.controller';

async function testTenantAuthentication() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tenantController = app.get(TenantController);

  try {
    console.log('🧪 Test d\'authentification tenant avec domaine...\n');

    // Test 1: Admin traditionnel (table Tenant)
    console.log('1️⃣ Test Admin traditionnel (table Tenant):');
    const adminTraditionalResult = await tenantController.login({
      domain: 'mon-ecole-test',
      username: 'admin',
      password: 'password123',
    });

    console.log('Résultat:', adminTraditionalResult);

    // Test 2: Admin utilisateur (table User) avec email complet
    console.log('\n2️⃣ Test Admin utilisateur avec email complet:');
    const adminUserEmailResult = await tenantController.login({
      domain: 'mon-ecole-test',
      username: 'admin@mon-ecole.com',
      password: 'AdminPass123!',
    });

    console.log('Résultat:', adminUserEmailResult);

    // Test 3: Admin utilisateur (table User) avec username simple
    console.log('\n3️⃣ Test Admin utilisateur avec username simple:');
    const adminUserUsernameResult = await tenantController.login({
      domain: 'mon-ecole-test',
      username: 'admin',
      password: 'AdminPass123!',
    });

    console.log('Résultat:', adminUserUsernameResult);

    // Test 4: Super-admin (tenant spécial)
    console.log('\n4️⃣ Test Super-admin:');
    const superAdminResult = await tenantController.login({
      domain: 'super-admin',
      username: 'super-admin-admin',
      password: 'jn$7F5AflzrD',
    });

    console.log('Résultat:', superAdminResult);

    // Test 4.5: Super-admin utilisateur (table User)
    console.log('\n4️⃣.5 Test Super-admin utilisateur (table User):');
    const superAdminUserResult = await tenantController.login({
      domain: 'super-admin',
      username: 'superadmin@school-system.com',
      password: 'SuperAdmin2024!',
    });

    console.log('Résultat:', superAdminUserResult);

    // Test 5: Domaine inexistant
    console.log('\n5️⃣ Test Domaine inexistant:');
    const invalidDomainResult = await tenantController.login({
      domain: 'domaine-inexistant',
      username: 'admin',
      password: 'password123',
    });

    console.log('Résultat:', invalidDomainResult);

    // Test 6: Mauvais mot de passe
    console.log('\n6️⃣ Test Mauvais mot de passe:');
    const badPasswordResult = await tenantController.login({
      domain: 'mon-ecole-test',
      username: 'admin',
      password: 'mauvais-password',
    });

    console.log('Résultat:', badPasswordResult);

    console.log('\n🎉 Tests d\'authentification tenant terminés!');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await app.close();
  }
}

// Exécuter le script
testTenantAuthentication()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }); 