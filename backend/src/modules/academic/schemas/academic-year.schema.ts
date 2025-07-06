import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AcademicYearDocument = AcademicYear & Document;

@Schema({ timestamps: true })
export class AcademicYear {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ 
    type: [{
      name: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      isActive: { type: Boolean, default: false },
      order: { type: Number, required: true }
    }]
  })
  periods: {
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    order: number;
  }[];

  @Prop()
  description?: string;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'archived'] })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AcademicYearSchema = SchemaFactory.createForClass(AcademicYear); 