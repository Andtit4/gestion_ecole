import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { Evaluation, EvaluationSchema } from './schemas/evaluation.schema';
import { StudentGrade, StudentGradeSchema } from './schemas/student-grade.schema';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    TenantModule,
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
      { name: StudentGrade.name, schema: StudentGradeSchema },
    ]),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {} 
