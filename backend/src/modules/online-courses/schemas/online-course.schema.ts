import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum CourseStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  ENDED = 'ended',
  CANCELLED = 'cancelled'
}

export enum ParticipantType {
  TEACHER = 'teacher',
  STUDENT = 'student',
  GUEST = 'guest'
}

@Schema()
export class Participant {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ParticipantType })
  type: ParticipantType;

  @Prop()
  email?: string;

  @Prop({ default: Date.now })
  joinedAt: Date;

  @Prop()
  leftAt?: Date;

  @Prop({ default: 0 })
  duration: number; // durée de participation en minutes
}

@Schema()
export class Teacher {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;
}

export type OnlineCourseDocument = OnlineCourse & Document;

@Schema({ 
  collection: 'online_courses',
  timestamps: true 
})
export class OnlineCourse {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  className: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  duration: number; // en minutes

  @Prop({ required: true, enum: CourseStatus, default: CourseStatus.SCHEDULED })
  status: CourseStatus;

  @Prop({ required: true })
  meetingUrl: string;

  @Prop({ type: Teacher, required: true })
  teacher: Teacher;

  @Prop({ default: 50 })
  maxParticipants: number;

  @Prop({ type: [Participant], default: [] })
  participants: Participant[];

  @Prop()
  endTime?: Date;

  @Prop()
  recordingUrl?: string;

  @Prop({ type: Object })
  settings?: {
    allowRecording: boolean;
    requirePassword: boolean;
    password?: string;
    waitingRoom: boolean;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  notes?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const OnlineCourseSchema = SchemaFactory.createForClass(OnlineCourse);

// Index pour optimiser les requêtes
OnlineCourseSchema.index({ tenantId: 1, status: 1 });
OnlineCourseSchema.index({ tenantId: 1, startTime: 1 });
OnlineCourseSchema.index({ tenantId: 1, subject: 1 });
OnlineCourseSchema.index({ tenantId: 1, className: 1 }); 