import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum Permission {
  // Gestion des élèves
  VIEW_STUDENTS = 'view_students',
  CREATE_STUDENTS = 'create_students',
  EDIT_STUDENTS = 'edit_students',
  DELETE_STUDENTS = 'delete_students',
  
  // Gestion des notes
  VIEW_GRADES = 'view_grades',
  CREATE_GRADES = 'create_grades',
  EDIT_GRADES = 'edit_grades',
  DELETE_GRADES = 'delete_grades',
  
  // Gestion des professeurs
  VIEW_TEACHERS = 'view_teachers',
  CREATE_TEACHERS = 'create_teachers',
  EDIT_TEACHERS = 'edit_teachers',
  DELETE_TEACHERS = 'delete_teachers',
  
  // Gestion des parents
  VIEW_PARENTS = 'view_parents',
  CREATE_PARENTS = 'create_parents',
  EDIT_PARENTS = 'edit_parents',
  DELETE_PARENTS = 'delete_parents',
  
  // Administration
  MANAGE_SETTINGS = 'manage_settings',
  MANAGE_USERS = 'manage_users',
  MANAGE_BILLING = 'manage_billing',
  VIEW_REPORTS = 'view_reports',
  
  // Communication
  SEND_MESSAGES = 'send_messages',
  VIEW_MESSAGES = 'view_messages',
  
  // Emploi du temps
  VIEW_SCHEDULE = 'view_schedule',
  MANAGE_SCHEDULE = 'manage_schedule'
}

@Schema()
export class Address {
  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  postalCode: string;

  @Prop({ default: 'France' })
  country: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ select: false }) // Ne pas inclure par défaut dans les requêtes
  password?: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ required: true, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop()
  avatar?: string;

  @Prop()
  phone?: string;

  @Prop({ type: Address })
  address?: Address;

  @Prop({ type: [String], enum: Permission, default: [] })
  permissions: Permission[];

  // Champs spécifiques selon le rôle
  @Prop()
  department?: string; // Pour les professeurs et admins

  @Prop({ type: [String] })
  subjects?: string[]; // Pour les professeurs

  @Prop()
  class?: string; // Pour les élèves

  @Prop()
  studentNumber?: string; // Pour les élèves

  @Prop({ type: [String] })
  parentIds?: string[]; // Pour les élèves

  @Prop({ type: [String] })
  childrenIds?: string[]; // Pour les parents

  @Prop()
  lastLogin?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// Index composé pour éviter les doublons email/tenant
UserSchema.index({ email: 1, tenantId: 1 }, { unique: true }); 