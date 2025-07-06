import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TenantService } from '../modules/tenant/tenant.service';

async function testTenantUpdate() {
  console.log('=== TEST DE MISE À JOUR DES TENANTS ===');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const tenantService = app.get(TenantService);

  try {
    // 1. Récupérer tous les tenants
    console.log('\n1. Récupération de tous les tenants...');
    const { tenants } = await tenantService.findAll();
    console.log(`Trouvé ${tenants.length} tenant(s)`);

    if (tenants.length === 0) {
      console.log('Aucun tenant trouvé. Veuillez d\'abord créer un tenant.');
      return;
    }

    // 2. Prendre le premier tenant pour le test
    const tenant = tenants[0];
    console.log(`\n2. Test avec le tenant: ${tenant.name} (ID: ${tenant._id})`);
    console.log('Données actuelles:', {
      name: tenant.name,
      domain: tenant.domain,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      settings: tenant.settings
    });

    // 3. Tester une mise à jour simple
    console.log('\n3. Test de mise à jour simple...');
    const updateData = {
      phone: '+33123456789',
      settings: {
        ...tenant.settings,
        language: 'en',
        theme: {
          primaryColor: '#ff0000',
          secondaryColor: '#00ff00'
        }
      }
    };

    const updatedTenant = await tenantService.update((tenant._id as any).toString(), updateData);
    console.log('Mise à jour réussie!');
    console.log('Nouvelles données:', {
      name: updatedTenant.name,
      domain: updatedTenant.domain,
      email: updatedTenant.email,
      phone: updatedTenant.phone,
      settings: updatedTenant.settings
    });

    // 4. Vérifier que les changements ont été persistés
    console.log('\n4. Vérification de la persistance...');
    const reloadedTenant = await tenantService.findOne((tenant._id as any).toString());
    console.log('Données rechargées:', {
      phone: reloadedTenant.phone,
      language: reloadedTenant.settings.language,
      theme: reloadedTenant.settings.theme
    });

    // 5. Remettre les données originales
    console.log('\n5. Remise des données originales...');
    await tenantService.update((tenant._id as any).toString(), {
      phone: tenant.phone,
      settings: tenant.settings
    });
    console.log('Données restaurées');

    console.log('\n✅ Test terminé avec succès!');

  } catch (error) {
    console.error('\n❌ Erreur pendant le test:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await app.close();
  }
}

testTenantUpdate(); 