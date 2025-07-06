import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';
import { Types } from 'mongoose';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  private validateObjectId(id: string): void {
    if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide fourni');
    }
  }

  private extractTenantId(headers: any): string {
    const tenantId = headers['x-tenant-id'] || headers['x-tenant-domain'];
    if (!tenantId) {
      throw new BadRequestException('Tenant ID requis dans les headers');
    }
    // Si c'est un ObjectId valide, on l'utilise tel quel
    if (Types.ObjectId.isValid(tenantId)) {
      return tenantId;
    }
    // Sinon on assume que c'est un domaine et on peut gérer ça plus tard
    return tenantId;
  }

  // === EVALUATIONS ===

  @Post()
  createEvaluation(
    @Headers() headers: any,
    @Body() createEvaluationDto: CreateEvaluationDto,
  ) {
    const tenantId = this.extractTenantId(headers);
    return this.evaluationService.createEvaluation(tenantId, createEvaluationDto);
  }

  @Get()
  findAllEvaluations(
    @Headers() headers: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('classId') classId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('type') type?: string,
    @Query('academicYearId') academicYearId?: string,
    @Query('periodId') periodId?: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    const filters = {
      classId,
      subjectId,
      teacherId,
      type,
      academicYearId,
      periodId,
    };
    
    // Supprimer les filtres vides
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );

    return this.evaluationService.findAllEvaluations(
      tenantId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      filters,
    );
  }

  @Get('stats')
  getEvaluationStats(
    @Headers() headers: any,
    @Query('classId') classId?: string,
    @Query('academicYearId') academicYearId?: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    const filters = { classId, academicYearId };
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    return this.evaluationService.getEvaluationStats(tenantId, filters);
  }

  @Get('subject-averages')
  getSubjectAverages(
    @Headers() headers: any,
    @Query('studentId') studentId?: string,
    @Query('classId') classId?: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    return this.evaluationService.getSubjectAverages(tenantId, studentId, classId);
  }

  @Get(':id')
  findOneEvaluation(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    this.validateObjectId(id);
    return this.evaluationService.findOneEvaluation(id, tenantId);
  }

  @Patch(':id')
  updateEvaluation(
    @Param('id') id: string,
    @Headers() headers: any,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
  ) {
    const tenantId = this.extractTenantId(headers);
    this.validateObjectId(id);
    return this.evaluationService.updateEvaluation(id, tenantId, updateEvaluationDto);
  }

  @Delete(':id')
  deleteEvaluation(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    this.validateObjectId(id);
    return this.evaluationService.deleteEvaluation(id, tenantId);
  }

  // === NOTES DES ÉLÈVES ===

  @Post('grades')
  createStudentGrade(
    @Headers() headers: any,
    @Body() createStudentGradeDto: CreateStudentGradeDto,
  ) {
    const tenantId = this.extractTenantId(headers);
    return this.evaluationService.createStudentGrade(tenantId, createStudentGradeDto);
  }

  @Get(':evaluationId/grades')
  findGradesByEvaluation(
    @Param('evaluationId') evaluationId: string,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    this.validateObjectId(evaluationId);
    return this.evaluationService.findGradesByEvaluation(evaluationId, tenantId);
  }

  @Get('students/:studentId/grades')
  findGradesByStudent(
    @Param('studentId') studentId: string,
    @Headers() headers: any,
    @Query('evaluationId') evaluationId?: string,
    @Query('subjectId') subjectId?: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    this.validateObjectId(studentId);
    const filters = { evaluationId, subjectId };
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    return this.evaluationService.findGradesByStudent(studentId, tenantId, filters);
  }

  @Patch('grades/:id')
  updateStudentGrade(
    @Param('id') id: string,
    @Headers() headers: any,
    @Body() updateData: Partial<CreateStudentGradeDto>,
  ) {
    const tenantId = this.extractTenantId(headers);
    this.validateObjectId(id);
    return this.evaluationService.updateStudentGrade(id, tenantId, updateData);
  }

  @Delete('grades/:id')
  deleteStudentGrade(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    this.validateObjectId(id);
    return this.evaluationService.deleteStudentGrade(id, tenantId);
  }
} 
