import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubjectDocument = Subject & Document;

@Schema({ 
  timestamps: true,
  collection: 'subjects' 
})
export class Subject {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  code: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ default: 1, min: 1 })
  credits: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Tenant' })
  tenantId: Types.ObjectId;

  @Prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Prop({ type: String, trim: true })
  color?: string;

  @Prop({ type: Number, default: 0 })
  hoursPerWeek?: number;

  @Prop({ type: String, enum: ['theory', 'practical', 'mixed'], default: 'theory' })
  type?: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

// Index composé pour éviter les doublons de codes par tenant
SubjectSchema.index({ code: 1, tenantId: 1 }, { unique: true });
SubjectSchema.index({ tenantId: 1 }); 