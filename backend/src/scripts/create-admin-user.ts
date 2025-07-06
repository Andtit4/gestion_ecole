import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { TenantService } from '../modules/tenant/tenant.service';
import { UserRole, UserStatus, Permission } from '../modules/users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';

async function createAdminUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const tenantService = app.get(TenantService);

  try {
    console.log('🚀 Création d\'un utilisateur admin d\'établissement...');

    // Chercher un tenant existant ou utiliser un ID spécifique
    const tenants = await tenantService.findAll(1, 1);
    
    let tenantId: string;
    if (tenants.tenants.length > 0) {
      const tenant = tenants.tenants[0] as any;
      tenantId = tenant._id.toString();
      console.log(`📍 Utilisation du tenant existant: ${tenant.name} (${tenantId})`);
    } else {
      // Si aucun tenant n'existe, en créer un pour la démonstration
      console.log('⚠️  Aucun tenant trouvé. Utilisez d\'abord le script create-admin pour créer un établissement.');
      console.log('   Ou modifiez ce script pour spécifier un tenantId existant.');
      process.exit(1);
    }

    const email = 'admin@mon-ecole.com';
    const password = 'AdminPass123!';

    // Données de l'admin
    const adminData = {
      email: email,
      firstName: 'Admin',
      lastName: 'Établissement',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      department: 'Administration',
      phone: '+33 1 23 45 67 88',
      
      // Permissions d'admin d'établissement (toutes sauf super-admin)
      permissions: [
        Permission.VIEW_STUDENTS,
        Permission.CREATE_STUDENTS,
        Permission.EDIT_STUDENTS,
        Permission.DELETE_STUDENTS,
        Permission.VIEW_GRADES,
        Permission.CREATE_GRADES,
        Permission.EDIT_GRADES,
        Permission.DELETE_GRADES,
        Permission.VIEW_TEACHERS,
        Permission.CREATE_TEACHERS,
        Permission.EDIT_TEACHERS,
        Permission.DELETE_TEACHERS,
        Permission.VIEW_PARENTS,
        Permission.CREATE_PARENTS,
        Permission.EDIT_PARENTS,
        Permission.DELETE_PARENTS,
        Permission.MANAGE_SETTINGS,
        Permission.MANAGE_USERS,
        Permission.MANAGE_BILLING,
        Permission.VIEW_REPORTS,
        Permission.SEND_MESSAGES,
        Permission.VIEW_MESSAGES,
        Permission.VIEW_SCHEDULE,
        Permission.MANAGE_SCHEDULE,
      ],
      
      address: {
        street: '456 School Avenue',
        city: 'Lyon',
        postalCode: '69000',
        country: 'France'
      }
    };

    console.log('📊 Permissions assignées:', adminData.permissions);

    // Vérifier si l'utilisateur existe déjà
    const existingUsers = await usersService.findAll(tenantId, 1, 1, { 
      search: adminData.email 
    });

    if (existingUsers.users.length > 0) {
      const existingUser = existingUsers.users[0];
      console.log('⚠️  Utilisateur admin existe déjà');
      console.log('📧 Email:', existingUser.email);
      console.log('🔑 Rôle:', existingUser.role);
      console.log('🏢 Tenant:', tenantId);
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

    // Créer l'utilisateur admin
    const admin = await usersService.create(adminData, tenantId);

    // Définir le mot de passe
    await usersService.setPassword((admin as any)._id.toString(), password, tenantId);

    console.log('✅ Utilisateur admin créé avec succès!');
    console.log('==========================================');
    console.log('📧 Email:', admin.email);
    console.log('👤 Nom:', `${admin.firstName} ${admin.lastName}`);
    console.log('🔑 Rôle:', admin.role);
    console.log('🏢 Tenant ID:', tenantId);
    console.log('📋 Permissions:', admin.permissions.length);
    console.log('📞 Téléphone:', admin.phone);
    console.log('🆔 ID Utilisateur:', (admin as any)._id);
    console.log('==========================================');
    
    console.log('\n🔐 INFORMATIONS DE CONNEXION:');
    console.log('Email:', email);
    console.log('Mot de passe:', password);
    console.log('Tenant ID:', tenantId);
    console.log('✅ Mot de passe défini - L\'utilisateur peut maintenant se connecter!');
    
    console.log('\n📝 Permissions accordées:');
    admin.permissions.forEach((permission, index) => {
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
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    if (error.code === 11000) {
      console.error('💡 L\'utilisateur existe peut-être déjà avec cet email');
    }
  } finally {
    await app.close();
  }
}

// Exécuter le script
createAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }); 