import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  studentNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: ['M', 'F'] })
  gender: string;

  @Prop({ 
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    required: true 
  })
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @Prop({ 
    type: {
      fatherName: { type: String },
      fatherPhone: { type: String },
      fatherEmail: { type: String },
      motherName: { type: String },
      motherPhone: { type: String },
      motherEmail: { type: String },
      guardianName: { type: String },
      guardianPhone: { type: String },
      guardianEmail: { type: String }
    },
    required: true 
  })
  parentContact: {
    fatherName?: string;
    fatherPhone?: string;
    fatherEmail?: string;
    motherName?: string;
    motherPhone?: string;
    motherEmail?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
  };

  @Prop({ 
    type: {
      classId: { type: Types.ObjectId, required: true },
      className: { type: String, required: true },
      level: { type: String, required: true },
      section: { type: String },
      enrollmentDate: { type: Date, required: true },
      status: { type: String, enum: ['active', 'inactive', 'transferred', 'graduated'], required: true }
    },
    required: true 
  })
  academicInfo: {
    classId: Types.ObjectId;
    className: string;
    level: string;
    section?: string;
    enrollmentDate: Date;
    status: 'active' | 'inactive' | 'transferred' | 'graduated';
  };

  @Prop({ 
    type: {
      allergies: [{ type: String }],
      medications: [{ type: String }],
      emergencyContact: { type: String },
      bloodType: { type: String },
      specialNeeds: { type: String }
    }
  })
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    emergencyContact?: string;
    bloodType?: string;
    specialNeeds?: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student); 