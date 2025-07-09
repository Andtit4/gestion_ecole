import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { 
  ITenantDocument, 
  TenantStatus, 
  SubscriptionPlan,
  ITenantSettings,
  ISubscription 
} from '../../../common/interfaces/tenant.interface';

@Schema({ _id: false })
export class TenantSettings implements ITenantSettings {
  @Prop({ required: true, enum: ['primary', 'secondary', 'university', 'mixed'] })
  schoolType: 'primary' | 'secondary' | 'university' | 'mixed';

  @Prop({ required: true, match: /^\d{2}-\d{2}$/ })
  academicYearStart: string;

  @Prop({ required: true, match: /^\d{2}-\d{2}$/ })
  academicYearEnd: string;

  @Prop({ required: true, enum: ['numeric', 'letter', 'points'] })
  gradeSystem: 'numeric' | 'letter' | 'points';

  @Prop({ required: true, min: 1, max: 100 })
  maxGrade: number;

  @Prop({ required: true, default: 'fr' })
  language: string;

  @Prop({ required: true, default: 'Europe/Paris' })
  timezone: string;

  @Prop({ required: true, default: 'EUR' })
  currency: string;

  @Prop()
  logoUrl?: string;

  @Prop({
    type: {
      primaryColor: { type: String, default: '#1f2937' },
      secondaryColor: { type: String, default: '#3b82f6' }
    }
  })
  theme?: {
    primaryColor: string;
    secondaryColor: string;
  };
}

@Schema({ _id: false })
export class Subscription implements ISubscription {
  @Prop({ required: true, enum: Object.values(SubscriptionPlan) })
  plan: SubscriptionPlan;

  @Prop({ enum: ['monthly', 'yearly'], default: 'monthly' })
  validity: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, min: 1 })
  maxStudents: number;

  @Prop({ required: true, min: 1 })
  maxTeachers: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ required: true, min: 0 })
  pricePerMonth: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  customPlanId?: string;
}

@Schema()
export class AdminUser {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  title?: string;

  @Prop({ required: true, trim: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: new Date() })
  lastLogin?: Date;
}

@Schema({ timestamps: true })
export class Tenant {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: /^[a-z0-9-]+$/,
    minlength: 3,
    maxlength: 50
  })
  domain: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({
    type: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    }
  })
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @Prop({ 
    required: true, 
    enum: Object.values(TenantStatus),
    default: TenantStatus.ACTIVE 
  })
  status: TenantStatus;

  @Prop({ type: TenantSettings, required: true })
  settings: TenantSettings;

  @Prop({ type: Subscription, required: true })
  subscription: Subscription;

  @Prop({ type: AdminUser, required: true })
  admin: AdminUser;

  createdAt: Date;
  updatedAt: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

// Type pour TypeScript
export type TenantDocument = Tenant & Document;

// Index pour les recherches fréquentes
TenantSchema.index({ domain: 1 });
TenantSchema.index({ email: 1 });
TenantSchema.index({ status: 1 });
TenantSchema.index({ 'subscription.plan': 1 });
TenantSchema.index({ 'subscription.endDate': 1 });
TenantSchema.index({ 'admin.email': 1 });
TenantSchema.index({ 'admin.username': 1 }); 