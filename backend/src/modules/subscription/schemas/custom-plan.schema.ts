import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomPlanDocument = CustomPlan & Document;

@Schema({ timestamps: true })
export class CustomPlan {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  monthlyPrice: number;

  @Prop({ required: true, min: 1 })
  maxStudents: number;

  @Prop({ required: true, min: 1 })
  maxTeachers: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: false })
  popular: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdBy?: string;
}

export const CustomPlanSchema = SchemaFactory.createForClass(CustomPlan); 