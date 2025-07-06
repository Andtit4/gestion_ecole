import { Document } from 'mongoose';

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
}

export enum SubscriptionPlan {
  STARTER = 'starter',
  STANDARD = 'standard',
  ENTERPRISE = 'enterprise',
}

export interface ITenantSettings {
  schoolType: 'primary' | 'secondary' | 'university' | 'mixed';
  academicYearStart: string; // format MM-DD
  academicYearEnd: string; // format MM-DD
  gradeSystem: 'numeric' | 'letter' | 'points';
  maxGrade: number;
  language: string;
  timezone: string;
  currency: string;
  logoUrl?: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface ISubscription {
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  maxStudents: number;
  maxTeachers: number;
  features: string[];
  pricePerMonth: number;
  isActive: boolean;
}

export interface ITenant {
  name: string;
  domain: string; // sous-domaine unique
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: TenantStatus;
  settings: ITenantSettings;
  subscription: ISubscription;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITenantDocument extends ITenant, Document {} 