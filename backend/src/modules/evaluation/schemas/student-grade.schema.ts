import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class StudentGrade extends Document {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  evaluationId: string;

  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true, min: 0 })
  score: number;

  @Prop({ required: true, min: 1 })
  maxScore: number;

  @Prop({ trim: true })
  comment?: string;

  @Prop({ default: false })
  isAbsent: boolean;

  @Prop({ required: true })
  gradedBy: string;

  @Prop({ required: true })
  gradedAt: Date;

  @Prop({ default: 'active' })
  status: string;
}

export const StudentGradeSchema = SchemaFactory.createForClass(StudentGrade); 