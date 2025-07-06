import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ValidationPipe,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { AcademicService } from './academic.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Types } from 'mongoose';

@Controller('academic')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  private validateObjectId(id: string): void {
    if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide fourni');
    }
  }

  private extractTenantId(headers: any): string {
    const tenantId = headers['x-tenant-id'];
    if (!tenantId) {
      throw new BadRequestException('Tenant ID requis dans les headers');
    }
    this.validateObjectId(tenantId);
    return tenantId;
  }

  // ==================== ACADEMIC YEARS ====================

  @Post('years')
  async createAcademicYear(
    @Body(ValidationPipe) createAcademicYearDto: CreateAcademicYearDto,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.createAcademicYear(createAcademicYearDto, tenantId);
  }

  @Get('years')
  async findAllAcademicYears(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.findAllAcademicYears(tenantId);
  }

  @Get('years/active')
  async getActiveAcademicYear(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.getActiveAcademicYear(tenantId);
  }

  @Get('years/:id')
  async findAcademicYearById(
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.findAcademicYearById(id, tenantId);
  }

  // ==================== CLASSES ====================

  @Post('classes')
  async createClass(
    @Body(ValidationPipe) createClassDto: CreateClassDto,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.createClass(createClassDto, tenantId);
  }

  @Get('classes')
  async findAllClasses(
    @Headers() headers: any,
    @Query('academicYearId') academicYearId?: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    if (academicYearId) {
      this.validateObjectId(academicYearId);
    }
    
    return await this.academicService.findAllClasses(tenantId, academicYearId);
  }

  @Get('classes/:id')
  async findClassById(
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.findClassById(id, tenantId);
  }

  // ==================== SCHEDULES ====================

  @Post('schedules')
  async createSchedule(
    @Body(ValidationPipe) createScheduleDto: CreateScheduleDto,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.createSchedule(createScheduleDto, tenantId);
  }

  @Get('schedules')
  async findAllSchedules(
    @Headers() headers: any,
    @Query('classId') classId?: string,
    @Query('academicYearId') academicYearId?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    if (classId) {
      this.validateObjectId(classId);
    }
    
    if (academicYearId) {
      this.validateObjectId(academicYearId);
    }
    
    return await this.academicService.findAllSchedules(tenantId, classId, academicYearId, dayOfWeek);
  }

  @Get('schedules/:id')
  async findScheduleById(
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.findScheduleById(id, tenantId);
  }

  // ==================== SUBJECTS ====================

  @Post('subjects')
  async createSubject(
    @Body() createSubjectDto: CreateSubjectDto,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.createSubject(createSubjectDto, tenantId);
  }

  @Get('subjects')
  async getAllSubjects(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.findAllSubjects(tenantId);
  }

  @Get('subjects/:id')
  async getSubjectById(
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.findSubjectById(id, tenantId);
  }

  // ==================== TEACHERS ====================

  @Post('teachers')
  async createTeacher(
    @Body() createTeacherDto: CreateTeacherDto,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.createTeacher(createTeacherDto, tenantId);
  }

  @Get('teachers')
  async getAllTeachers(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.findAllTeachers(tenantId);
  }

  @Get('teachers/:id')
  async getTeacherById(
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.findTeacherById(id, tenantId);
  }

  // ==================== SUPER ADMIN ROUTES ====================

  @Post('super-admin/assign-subjects/:tenantId')
  async assignSubjectsToTenant(
    @Param('tenantId') tenantId: string,
    @Body() body: { subjectIds: string[] },
  ) {
    return await this.academicService.assignSubjectsToTenant(tenantId, body.subjectIds);
  }

  @Post('super-admin/assign-teachers/:tenantId')
  async assignTeachersToTenant(
    @Param('tenantId') tenantId: string,
    @Body() body: { teacherIds: string[] },
  ) {
    return await this.academicService.assignTeachersToTenant(tenantId, body.teacherIds);
  }

  @Get('super-admin/subjects')
  async getAllSubjectsForSuperAdmin() {
    return await this.academicService.findAllSubjectsForSuperAdmin();
  }

  @Get('super-admin/teachers')
  async getAllTeachersForSuperAdmin() {
    return await this.academicService.findAllTeachersForSuperAdmin();
  }

  // ==================== STATS ====================

  @Get('stats')
  async getAcademicStats(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    return await this.academicService.getAcademicStats(tenantId);
  }
} 