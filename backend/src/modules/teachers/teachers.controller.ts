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
  ValidationPipe,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Types } from 'mongoose';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

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
    @Body(ValidationPipe) createTeacherDto: CreateTeacherDto,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    return this.teachersService.create(createTeacherDto, tenantId);
  }

  @Get()
  async findAll(
    @Headers() headers: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('subject') subject?: string,
    @Query('status') status?: string,
  ) {
    const tenantId = this.extractTenantId(headers);

    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;

    return this.teachersService.findAll(
      tenantId,
      pageNum,
      limitNum,
      search,
      subject,
      status,
    );
  }

  @Get('stats')
  async getStats(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    return this.teachersService.getStats(tenantId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return this.teachersService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTeacherDto: UpdateTeacherDto,
    @Headers() headers: any,
  ) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return this.teachersService.update(id, updateTeacherDto, tenantId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    await this.teachersService.remove(id, tenantId);
    return { message: 'Professeur supprimé avec succès' };
  }
} 