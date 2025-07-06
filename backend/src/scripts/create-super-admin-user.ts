import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { UserRole, UserStatus, Permission } from '../modules/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

async function createSuperAdminUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    console.log('🚀 Création d\'un utilisateur super-admin...');

    const tenantId = 'SUPER_ADMIN_TENANT';
    const email = 'superadmin@school-system.com';
    const password = 'SuperAdmin2024!';

    // Données du super-admin
    const superAdminData = {
      email: email,
      firstName: 'Super',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      department: 'Administration Système',
      phone: '+33 1 23 45 67 89',
      
      // Toutes les permissions possibles
      permissions: Object.values(Permission),
      
      address: {
        street: '123 Admin Street',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      }
    };

    console.log('📊 Permissions assignées:', superAdminData.permissions);

    // Vérifier si l'utilisateur existe déjà en utilisant findAll avec filtres
    const existingUsers = await usersService.findAll(tenantId, 1, 1, { 
      search: email 
    });

    if (existingUsers.users.length > 0) {
      const existingUser = existingUsers.users[0];
      console.log('⚠️  Utilisateur super-admin existe déjà');
      console.log('📧 Email:', existingUser.email);
      console.log('🔑 Rôle:', existingUser.role);
      console.log('📋 Permissions:', existingUser.permissions.length);
      
      // Vérifier s'il a un mot de passe et le définir si nécessaire
      const hasPassword = await usersService.hasPassword((existingUser as any)._id.toString(), tenantId);
      if (!hasPassword) {
        console.log('🔐 Définition du mot de passe pour l\'utilisateur existant...');
        await usersService.setPassword((existingUser as any)._id.toString(), password, tenantId);
        console.log('✅ Mot de passe défini avec succès!');
      } else {
        console.log('🔐 Utilisateur a déjà un mot de passe défini');
      }
      
      console.log('\n🔐 INFORMATIONS DE CONNEXION:');
      console.log('Email:', email);
      console.log('Mot de passe:', password);
      console.log('Tenant ID:', tenantId);
      
      return;
    }

    // Créer l'utilisateur super-admin
    const superAdmin = await usersService.create(superAdminData, tenantId);

    // Définir le mot de passe
    await usersService.setPassword((superAdmin as any)._id.toString(), password, tenantId);

    console.log('✅ Utilisateur super-admin créé avec succès!');
    console.log('==========================================');
    console.log('📧 Email:', superAdmin.email);
    console.log('👤 Nom:', `${superAdmin.firstName} ${superAdmin.lastName}`);
    console.log('🔑 Rôle:', superAdmin.role);
    console.log('🏢 Tenant ID:', tenantId);
    console.log('📋 Permissions:', superAdmin.permissions.length);
    console.log('📞 Téléphone:', superAdmin.phone);
    console.log('🆔 ID Utilisateur:', (superAdmin as any)._id);
    console.log('==========================================');
    
    console.log('\n🔐 INFORMATIONS DE CONNEXION:');
    console.log('Email:', email);
    console.log('Mot de passe:', password);
    console.log('Tenant ID:', tenantId);
    console.log('✅ Mot de passe défini - L\'utilisateur peut maintenant se connecter!');
    
    console.log('\n📝 Note: Cet utilisateur a TOUTES les permissions disponibles:');
    superAdmin.permissions.forEach((permission, index) => {
      console.log(`   ${index + 1}. ${permission}`);
    });

    console.log('\n🌐 Test de connexion API:');
    console.log('POST /users/auth/login');
    console.log('Body:', JSON.stringify({
      email: email,
      password: password,
      tenantId: tenantId
    }, null, 2));

  } catch (error) {
    console.error('❌ Erreur lors de la création du super-admin:', error);
    if (error.code === 11000) {
      console.error('💡 L\'utilisateur existe peut-être déjà avec cet email');
    }
  } finally {
    await app.close();
  }
}

// Exécuter le script
createSuperAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }); 