import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true })
export class Schedule {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] })
  dayOfWeek: string;

  @Prop({ required: true })
  startTime: string; // Format: "08:00"

  @Prop({ required: true })
  endTime: string; // Format: "09:00"

  @Prop({ required: true, min: 15, max: 240 })
  duration: number; // En minutes

  @Prop({ type: Types.ObjectId, ref: 'Subject' })
  subjectId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  classId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher' })
  teacherId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AcademicYear', required: true })
  academicYearId: Types.ObjectId;

  @Prop()
  classroom?: string;

  @Prop({ required: true, enum: ['course', 'td', 'tp', 'exam', 'break', 'other'] })
  type: string;

  @Prop()
  description?: string;

  @Prop()
  color?: string; // Couleur pour l'affichage dans le planning

  @Prop({ default: true })
  isRecurring: boolean; // Si le créneau se répète chaque semaine

  @Prop()
  startDate?: Date; // Date de début de validité

  @Prop()
  endDate?: Date; // Date de fin de validité

  @Prop({ 
    type: [{
      date: { type: Date, required: true },
      reason: { type: String, required: true },
      replacementScheduleId: { type: Types.ObjectId, ref: 'Schedule' }
    }]
  })
  exceptions?: {
    date: Date;
    reason: string;
    replacementScheduleId?: Types.ObjectId;
  }[];

  @Prop({ default: 'active', enum: ['active', 'inactive', 'cancelled'] })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule); 