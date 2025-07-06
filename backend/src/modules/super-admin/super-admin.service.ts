import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Interface complète pour le SuperAdmin (avec password)
export interface SuperAdminDocument {
  _id: string;
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

// Interface publique pour le SuperAdmin (sans password)
export interface SuperAdmin {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN';
  isActive: boolean;
  isSuperAdmin: boolean;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Document type pour Mongoose
export interface SuperAdminMongooseDocument extends SuperAdminDocument, Document {}

@Injectable()
export class SuperAdminService {
  constructor() {
    // Initialisation directe de mongoose car nous avons créé le schéma dans le script
    const mongoose = require('mongoose');
    
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
      updatedAt: { type: Date, default: Date.now }
    });

    this.superAdminModel = mongoose.models.SuperAdmin || mongoose.model('SuperAdmin', SuperAdminSchema);
  }

  private superAdminModel: Model<SuperAdminMongooseDocument>;

  /**
   * Authentifier un super admin
   */
  async authenticate(username: string, password: string): Promise<{
    success: boolean;
    superAdmin?: any;
    token?: string;
    message?: string;
  }> {
    try {
      // Chercher le super admin par username
      const superAdmin = await this.superAdminModel.findOne({
        username: username.trim(),
        isActive: true
      });

      if (!superAdmin) {
        return { success: false, message: 'Super admin non trouvé' };
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
      if (!isPasswordValid) {
        return { success: false, message: 'Mot de passe incorrect' };
      }

      // Générer un token JWT simple
      const token = jwt.sign(
        { 
          id: superAdmin._id,
          username: superAdmin.username,
          role: 'SUPER_ADMIN',
          isSuperAdmin: true
        },
        process.env.JWT_SECRET || 'super-secret-key',
        { expiresIn: '24h' }
      );

      // Retourner les données sans le mot de passe
      const { password: _, ...adminData } = superAdmin.toObject();

      return {
        success: true,
        superAdmin: adminData,
        token
      };

    } catch (error) {
      console.error('Erreur authentification super admin:', error);
      return { success: false, message: 'Erreur interne' };
    }
  }

  /**
   * Vérifier un token JWT
   */
  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key');
      
      // Vérifier que l'utilisateur existe toujours
      const superAdmin = await this.superAdminModel.findById((decoded as any).id);
      if (!superAdmin || !superAdmin.isActive) {
        return null;
      }

      const { password, ...adminData } = superAdmin.toObject();
      return adminData;

    } catch (error) {
      console.error('Token invalide:', error);
      return null;
    }
  }

  /**
   * Obtenir un super admin par ID
   */
  async findById(id: string): Promise<SuperAdmin | null> {
    try {
      const superAdmin = await this.superAdminModel.findById(id);
      if (!superAdmin) return null;

      const { password, ...adminData } = superAdmin.toObject();
      return adminData;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return null;
    }
  }

  /**
   * Mettre à jour le profil
   */
  async updateProfile(id: string, updateData: Partial<SuperAdmin>): Promise<SuperAdmin | null> {
    try {
      const updatedAdmin = await this.superAdminModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );

      if (!updatedAdmin) return null;

      const { password, ...adminData } = updatedAdmin.toObject();
      return adminData;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return null;
    }
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const superAdmin = await this.superAdminModel.findById(id);
      if (!superAdmin) return false;

      // Vérifier l'ancien mot de passe
      const isValid = await bcrypt.compare(currentPassword, superAdmin.password);
      if (!isValid) return false;

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.superAdminModel.findByIdAndUpdate(id, {
        password: hashedPassword,
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      return false;
    }
  }

  /**
   * Créer un nouveau super admin
   */
  async createSuperAdmin(createDto: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<{
    success: boolean;
    superAdmin?: any;
    message?: string;
  }> {
    try {
      // Vérifier si le super admin existe déjà
      const existingAdmin = await this.superAdminModel.findOne({
        $or: [
          { username: createDto.username },
          { email: createDto.email }
        ]
      });

      if (existingAdmin) {
        return { 
          success: false, 
          message: 'Un super admin avec ce nom d\'utilisateur ou email existe déjà' 
        };
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(createDto.password, 12);

      // Créer le super admin
      const newSuperAdmin = new this.superAdminModel({
        username: createDto.username,
        email: createDto.email,
        firstName: createDto.firstName,
        lastName: createDto.lastName,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
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
          'DELETE_ANY_DATA'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const savedAdmin = await newSuperAdmin.save();
      const { password, ...adminData } = savedAdmin.toObject();

      return {
        success: true,
        superAdmin: adminData
      };

    } catch (error) {
      console.error('Erreur création super admin:', error);
      return { 
        success: false, 
        message: 'Erreur lors de la création du super admin' 
      };
    }
  }
} 