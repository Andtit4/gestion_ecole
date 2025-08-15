import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Types } from 'mongoose';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

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

  @Post()
  async create(
    @Body(ValidationPipe) createStudentDto: CreateStudentDto,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    const result = await this.studentService.create(createStudentDto, tenantId);
    
    // Retourner les informations de l'étudiant avec les identifiants si disponibles
    return {
      success: true,
      student: result.student,
      userCredentials: result.userCredentials,
      message: result.userCredentials 
        ? 'Élève créé avec succès. Identifiants de connexion générés.' 
        : 'Élève créé avec succès. Erreur lors de la génération des identifiants.',
    };
  }

  @Get()
  async findAll(
    @Headers() headers: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('classId') classId?: string,
    @Query('status') status?: string,
  ) {
    const tenantId = this.extractTenantId(headers);

    if (classId) {
      this.validateObjectId(classId);
    }

    return await this.studentService.findAll(
      tenantId,
      page,
      limit,
      search,
      classId,
      status,
    );
  }

  @Get('stats')
  async getStats(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    return await this.studentService.getStudentsStats(tenantId);
  }

  @Get('by-class/:classId')
  async getStudentsByClass(
    @Param('classId') classId: string,
    @Headers() headers: any,
  ) {
    this.validateObjectId(classId);
    const tenantId = this.extractTenantId(headers);
    return await this.studentService.getStudentsByClass(classId, tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Headers() headers: any) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return await this.studentService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStudentDto: UpdateStudentDto,
    @Headers() headers: any,
  ) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return await this.studentService.update(id, updateStudentDto, tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Headers() headers: any) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return await this.studentService.remove(id, tenantId);
  }

  @Post('bulk-import')
  async bulkImport(
    @Body(ValidationPipe) studentsData: CreateStudentDto[],
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    return await this.studentService.bulkImport(studentsData, tenantId);
  }
} 