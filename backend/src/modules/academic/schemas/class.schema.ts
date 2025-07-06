import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema({ timestamps: true })
export class Class {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  level: string;

  @Prop()
  section?: string;

  @Prop({ required: true, min: 1, max: 100 })
  capacity: number;

  @Prop({ default: 0 })
  currentStudents: number;

  @Prop({ required: true, enum: ['primary', 'middle', 'high', 'university'] })
  schoolType: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Subject' }] })
  subjects: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Teacher' })
  mainTeacher?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AcademicYear', required: true })
  academicYearId: Types.ObjectId;

  @Prop()
  classroom?: string;

  @Prop()
  description?: string;

  @Prop({ 
    type: {
      monday: [{ type: String }],
      tuesday: [{ type: String }],
      wednesday: [{ type: String }],
      thursday: [{ type: String }],
      friday: [{ type: String }],
      saturday: [{ type: String }],
      sunday: [{ type: String }]
    }
  })
  weeklySchedule?: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };

  @Prop({ default: 'active', enum: ['active', 'inactive', 'archived'] })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ClassSchema = SchemaFactory.createForClass(Class); 