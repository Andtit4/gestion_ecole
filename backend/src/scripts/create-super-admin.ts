import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

// Schema pour le super admin (simple user global)
interface SuperAdmin {
  _id?: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN';
  isActive: boolean;
  isSuperAdmin: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

async function createSuperAdmin() {
  try {
    console.log('🚀 Démarrage de la création du Super Administrateur...\n');

    // Initialisation de l'application NestJS
    const app = await NestFactory.createApplicationContext(AppModule);

    // Connexion directe à MongoDB via Mongoose
    const mongoose = require('mongoose');

    // Définir le schéma du super admin directement
    const SuperAdminSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      role: { type: String, enum: ['SUPER_ADMIN'], default: 'SUPER_ADMIN' },
      isActive: { type: Boolean, default: true },
      isSuperAdmin: { type: Boolean, default: true },
      permissions: [{ type: String }],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });

    const SuperAdminModel =
      mongoose.models.SuperAdmin ||
      mongoose.model('SuperAdmin', SuperAdminSchema);

    // Paramètres du super admin
    const superAdminData = {
      username: 'superadmin',
      email: 'superadmin@ecole-manager.fr',
      firstName: 'Super',
      lastName: 'Administrateur',
      role: 'SUPER_ADMIN' as const,
      isActive: true,
      isSuperAdmin: true,
      permissions: [
        'MANAGE_ALL_TENANTS',
        'MANAGE_ALL_USERS',
        'MANAGE_SUBSCRIPTIONS',
        'MANAGE_PLANS',
        'SYSTEM_ADMIN',
        'VIEW_ALL_DATA',
        'MODIFY_ALL_DATA',
        'DELETE_ANY_DATA',
      ],
    };

    // Vérifier si le super admin existe déjà
    const existingAdmin = await SuperAdminModel.findOne({
      $or: [
        { username: superAdminData.username },
        { email: superAdminData.email },
      ],
    });

    if (existingAdmin) {
      console.log(
        '⚠️  Un Super Administrateur existe déjà avec ces identifiants.',
      );
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Username:', existingAdmin.username);
      console.log('\n🔑 Identifiants de connexion:');
      console.log('   • URL: http://localhost:5173/school-login');
      console.log('   • Domaine: SUPER_ADMIN');
      console.log('   • Username:', existingAdmin.username);
      console.log('   • Mot de passe: [utiliser le mot de passe existant]');
      await app.close();
      return;
    }

    // Générer le mot de passe sécurisé
    const plainPassword = 'SuperAdmin2024!';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    // Créer le super admin
    const newSuperAdmin = new SuperAdminModel({
      ...superAdminData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedAdmin = await newSuperAdmin.save();

    // Affichage des informations de connexion
    console.log('✅ Super Administrateur créé avec succès !');
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║                SUPER ADMINISTRATEUR                ║');
    console.log('╠════════════════════════════════════════════════════╣');
    console.log(
      `║ Nom:           ${savedAdmin.firstName} ${savedAdmin.lastName}`.padEnd(
        53,
      ) + '║',
    );
    console.log(`║ Email:         ${savedAdmin.email}`.padEnd(53) + '║');
    console.log(`║ Username:      ${savedAdmin.username}`.padEnd(53) + '║');
    console.log(
      `║ Statut:        ${savedAdmin.isActive ? 'Actif' : 'Inactif'}`.padEnd(
        53,
      ) + '║',
    );
    console.log('╠════════════════════════════════════════════════════╣');
    console.log('║                   CONNEXION                        ║');
    console.log('╠════════════════════════════════════════════════════╣');
    console.log('║ URL:           http://localhost:5173/school-login  ║');
    console.log('║ Domaine:       SUPER_ADMIN                         ║');
    console.log(`║ Username:      ${savedAdmin.username}`.padEnd(53) + '║');
    console.log(`║ Mot de passe:  ${plainPassword}`.padEnd(53) + '║');
    console.log('╠════════════════════════════════════════════════════╣');
    console.log('║                  PERMISSIONS                       ║');
    console.log('╠════════════════════════════════════════════════════╣');
    savedAdmin.permissions.forEach((perm: string) => {
      console.log(`║ • ${perm}`.padEnd(53) + '║');
    });
    console.log('╚════════════════════════════════════════════════════╝');

    console.log('\n📋 Fonctionnalités disponibles:');
    console.log('   • Gestion de tous les établissements');
    console.log('   • Création/modification/suppression de tenants');
    console.log('   • Gestion des abonnements et plans');
    console.log('   • Vue globale de toutes les données');
    console.log('   • Administration système complète');

    console.log('\n🎯 Pages accessibles après connexion:');
    console.log('   • /tenant-dashboard - Dashboard multi-établissements');
    console.log('   • /plan-management - Gestion des plans');
    console.log('   • /subscriptions - Gestion des abonnements');
    console.log('   • Toutes les routes avec adminOnly: true');

    await app.close();
    console.log('\n🎉 Création terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la création du super admin:', error);
    if (error.code === 11000) {
      console.error(
        "💡 Conseil: Un super admin existe déjà. Supprimez-le d'abord si vous voulez le recréer.",
      );
    }
    process.exit(1);
  }
}

// Exécution du script
if (require.main === module) {
  createSuperAdmin()
    .then(() => {
      console.log('\n✨ Script terminé avec succès !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

export { createSuperAdmin };
