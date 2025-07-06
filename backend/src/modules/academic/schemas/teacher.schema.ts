import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema({ 
  timestamps: true,
  collection: 'teachers' 
})
export class Teacher {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop({ type: String, enum: ['male', 'female', 'other'] })
  gender?: string;

  @Prop({ 
    type: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true }
    }
  })
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  @Prop({ required: false, trim: true })
  employeeId?: string;

  @Prop({ required: false, trim: true })
  employeeNumber?: string;

  @Prop({ type: Date, default: Date.now })
  hireDate: Date;

  @Prop({ type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' })
  status: string;

  @Prop({ type: [String] })
  subjects: string[];

  @Prop({ 
    type: {
      degree: { type: String, trim: true },
      field: { type: String, trim: true },
      institution: { type: String, trim: true },
      year: { type: Number }
    }
  })
  education?: {
    degree?: string;
    field?: string;
    institution?: string;
    year?: number;
  };

  @Prop({ type: Number, default: 0 })
  experience: number; // en années

  @Prop({ type: Number })
  salary?: number;

  @Prop({ type: String, enum: ['full-time', 'part-time', 'contract'], default: 'full-time' })
  employmentType: string;

  @Prop({ trim: true })
  department?: string;

  @Prop({ trim: true })
  specialization?: string;

  @Prop({ trim: true })
  profilePicture?: string;

  @Prop({ type: [String] })
  languages?: string[];

  @Prop({ type: String, trim: true })
  emergencyContact?: string;

  @Prop({ type: String, trim: true })
  emergencyPhone?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Tenant' })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId; // Si le professeur a un compte utilisateur
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

// Index composé pour éviter les doublons d'employeeId par tenant
TeacherSchema.index({ employeeId: 1, tenantId: 1 }, { unique: true });
TeacherSchema.index({ email: 1 }, { unique: true });
TeacherSchema.index({ tenantId: 1 });
TeacherSchema.index({ status: 1 });
TeacherSchema.index({ subjects: 1 }); 