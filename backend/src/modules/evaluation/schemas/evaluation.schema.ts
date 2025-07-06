import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum EvaluationType {
  CONTROLE = 'controle',
  EXAMEN = 'examen',
  DEVOIR = 'devoir',
  ORAL = 'oral',
  PROJET = 'projet',
  TP = 'tp',
  PARTICIPATION = 'participation'
}

export enum GradeScale {
  TWENTY = 'twenty',
  TEN = 'ten',
  FIVE = 'five',
  LETTER = 'letter'
}

@Schema({ timestamps: true })
export class Evaluation extends Document {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, enum: EvaluationType })
  type: EvaluationType;

  @Prop({ required: true })
  subjectId: string;

  @Prop({ required: true })
  classId: string;

  @Prop({ required: true })
  teacherId: string;

  @Prop({ required: true })
  academicYearId: string;

  @Prop()
  periodId?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, min: 1 })
  maxScore: number;

  @Prop({ required: true, min: 0.1 })
  coefficient: number;

  @Prop({ required: true, enum: GradeScale, default: GradeScale.TWENTY })
  scale: GradeScale;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: 'active' })
  status: string;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation); 