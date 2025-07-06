import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeacherManagementDocument = TeacherManagement & Document;

@Schema({
  timestamps: true,
  collection: 'teachers_management'
})
export class TeacherManagement {
  @Prop({ required: true, unique: true })
  employeeNumber: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop()
  placeOfBirth?: string;

  @Prop({
    type: {
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String, default: 'France' }
    }
  })
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };

  @Prop({ required: true })
  hireDate: Date;

  @Prop({ 
    required: true, 
    enum: ['active', 'inactive', 'on_leave', 'terminated'],
    default: 'active'
  })
  status: string;

  @Prop({ type: [String], required: true })
  subjects: string[];

  @Prop({ type: [String], default: [] })
  classes: string[];

  @Prop()
  qualification?: string;

  @Prop({ min: 0 })
  experience?: number;

  @Prop({ min: 0 })
  salary?: number;

  @Prop({
    type: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String }
    }
  })
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };

  @Prop({ required: true })
  tenantId: string;
}

export const TeacherManagementSchema = SchemaFactory.createForClass(TeacherManagement); 