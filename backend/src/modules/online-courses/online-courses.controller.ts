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
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { OnlineCoursesService, CourseFilters } from './online-courses.service';
import { CreateOnlineCourseDto, JoinCourseDto, LeaveCourseDto, UpdateCourseStatusDto } from './dto/create-online-course.dto';
import { Types } from 'mongoose';

@Controller('online-courses')
export class OnlineCoursesController {
  constructor(private readonly onlineCoursesService: OnlineCoursesService) {}

  private extractTenantId(headers: any): string {
    const tenantId = headers['x-tenant-id'];
    if (!tenantId) {
      throw new BadRequestException('Tenant ID manquant dans les headers');
    }
    return tenantId;
  }

  @Post()
  async create(
    @Headers() headers: any,
    @Body(ValidationPipe) createOnlineCourseDto: CreateOnlineCourseDto,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const course = await this.onlineCoursesService.create(tenantId, createOnlineCourseDto);
      return {
        success: true,
        message: 'Cours en ligne créé avec succès',
        data: course,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la création du cours: ${error.message}`);
    }
  }

  @Get()
  async findAll(
    @Headers() headers: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('subject') subject?: string,
    @Query('className') className?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const tenantId = this.extractTenantId(headers);

    const filters: CourseFilters = {
      status,
      subject,
      className,
      search,
      startDate,
      endDate,
    };

    // Nettoyer les filtres vides
    Object.keys(filters).forEach(key => {
      if (!filters[key]) {
        delete filters[key];
      }
    });

    try {
      const result = await this.onlineCoursesService.findAll(tenantId, page, limit, filters);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la récupération des cours: ${error.message}`);
    }
  }

  @Get('statistics')
  async getStatistics(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const statistics = await this.onlineCoursesService.getStatistics(tenantId);
      return {
        success: true,
        data: statistics,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }

  @Get('upcoming')
  async getUpcoming(
    @Headers() headers: any,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const courses = await this.onlineCoursesService.getUpcomingCourses(tenantId, limit);
      return {
        success: true,
        data: courses,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la récupération des cours à venir: ${error.message}`);
    }
  }

  @Get('live')
  async getLive(@Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const courses = await this.onlineCoursesService.getLiveCourses(tenantId);
      return {
        success: true,
        data: courses,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la récupération des cours en direct: ${error.message}`);
    }
  }

  @Get('teacher/:teacherId')
  async getTeacherCourses(
    @Headers() headers: any,
    @Param('teacherId') teacherId: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const courses = await this.onlineCoursesService.getTeacherCourses(tenantId, teacherId);
      return {
        success: true,
        data: { courses },
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la récupération des cours du professeur: ${error.message}`);
    }
  }

  @Get('student/:studentId')
  async getStudentCourses(
    @Headers() headers: any,
    @Param('studentId') studentId: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const courses = await this.onlineCoursesService.getStudentCourses(tenantId, studentId);
      return {
        success: true,
        data: { courses },
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la récupération des cours de l'étudiant: ${error.message}`);
    }
  }

  @Get(':id')
  async findOne(
    @Headers() headers: any,
    @Param('id') id: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const course = await this.onlineCoursesService.findOne(id, tenantId);
      return {
        success: true,
        data: course,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la récupération du cours: ${error.message}`);
    }
  }

  @Patch(':id')
  async update(
    @Headers() headers: any,
    @Param('id') id: string,
    @Body(ValidationPipe) updateOnlineCourseDto: Partial<CreateOnlineCourseDto>,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const course = await this.onlineCoursesService.update(id, tenantId, updateOnlineCourseDto);
      return {
        success: true,
        message: 'Cours en ligne modifié avec succès',
        data: course,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la modification du cours: ${error.message}`);
    }
  }

  @Patch(':id/status')
  async updateStatus(
    @Headers() headers: any,
    @Param('id') id: string,
    @Body(ValidationPipe) updateStatusDto: UpdateCourseStatusDto,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const course = await this.onlineCoursesService.updateStatus(id, tenantId, updateStatusDto);
      return {
        success: true,
        message: 'Statut du cours modifié avec succès',
        data: course,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la modification du statut: ${error.message}`);
    }
  }

  @Post('join')
  async joinCourse(
    @Headers() headers: any,
    @Body(ValidationPipe) joinCourseDto: JoinCourseDto,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const course = await this.onlineCoursesService.joinCourse(tenantId, joinCourseDto);
      return {
        success: true,
        message: 'Vous avez rejoint le cours avec succès',
        data: course,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la participation au cours: ${error.message}`);
    }
  }

  @Post('leave')
  async leaveCourse(
    @Headers() headers: any,
    @Body(ValidationPipe) leaveCourseDto: LeaveCourseDto,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      const course = await this.onlineCoursesService.leaveCourse(tenantId, leaveCourseDto);
      return {
        success: true,
        message: 'Vous avez quitté le cours avec succès',
        data: course,
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la sortie du cours: ${error.message}`);
    }
  }

  @Delete(':id')
  async remove(
    @Headers() headers: any,
    @Param('id') id: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    
    try {
      await this.onlineCoursesService.remove(id, tenantId);
      return {
        success: true,
        message: 'Cours en ligne supprimé avec succès',
      };
    } catch (error) {
      throw new BadRequestException(`Erreur lors de la suppression du cours: ${error.message}`);
    }
  }
} 