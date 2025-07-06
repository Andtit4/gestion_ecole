import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { TenantService } from '../modules/tenant/tenant.service';

async function updateSuperAdminUserTenant() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const tenantService = app.get(TenantService);

  try {
    console.log('🔄 Mise à jour du tenant du super-admin utilisateur...');

    // Trouver le nouveau tenant super-admin
    const superAdminTenant = await tenantService.findByDomain('super-admin');
    if (!superAdminTenant) {
      console.log('❌ Tenant super-admin non trouvé');
      console.log('   Exécutez d\'abord: npm run create-super-admin-tenant');
      return;
    }

    const newTenantId = (superAdminTenant as any)._id.toString();
    console.log('✅ Tenant super-admin trouvé, ID:', newTenantId);

    // Chercher l'utilisateur super-admin dans l'ancien tenant
    const oldTenantId = 'SUPER_ADMIN_TENANT';
    const superAdminUsers = await usersService.findAll(oldTenantId, 1, 10, { 
      search: 'superadmin@school-system.com' 
    });

    if (superAdminUsers.users.length === 0) {
      console.log('❌ Utilisateur super-admin non trouvé dans l\'ancien tenant');
      console.log('   L\'utilisateur existe peut-être déjà avec le bon tenant');
      return;
    }

    const superAdminUser = superAdminUsers.users[0];
    console.log('✅ Utilisateur super-admin trouvé:', superAdminUser.email);

    // Mettre à jour le tenantId via une requête directe MongoDB
    const { Model } = require('mongoose');
    const { InjectModel } = require('@nestjs/mongoose');
    const { User, UserDocument } = require('../modules/users/schemas/user.schema');
    
    // Accéder directement au modèle via le service
    const userModel = (usersService as any).userModel;
    
    const updateResult = await userModel.updateOne(
      { 
        email: 'superadmin@school-system.com',
        tenantId: oldTenantId 
      },
      { 
        tenantId: newTenantId 
      }
    );

    if (updateResult.modifiedCount > 0) {
      console.log('✅ Tenant mis à jour avec succès!');
      console.log('📧 Email:', superAdminUser.email);
      console.log('🏢 Ancien tenant:', oldTenantId);
      console.log('🏢 Nouveau tenant:', newTenantId);
      
      console.log('\n🧪 Test d\'authentification...');
      const authTest = await usersService.authenticate(
        'superadmin@school-system.com',
        'SuperAdmin2024!',
        newTenantId
      );
      
      if (authTest) {
        console.log('✅ Authentification réussie avec le nouveau tenant!');
      } else {
        console.log('❌ Échec de l\'authentification avec le nouveau tenant');
      }
      
    } else {
      console.log('⚠️  Aucune modification effectuée (l\'utilisateur est peut-être déjà dans le bon tenant)');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await app.close();
  }
}

// Exécuter le script
updateSuperAdminUserTenant()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }); 