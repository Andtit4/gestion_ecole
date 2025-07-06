import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AcademicYear, AcademicYearDocument } from './schemas/academic-year.schema';
import { Class, ClassDocument } from './schemas/class.schema';
import { Schedule, ScheduleDocument } from './schemas/schedule.schema';
import { Subject, SubjectDocument } from './schemas/subject.schema';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class AcademicService {
  constructor(
    @InjectModel(AcademicYear.name) private academicYearModel: Model<AcademicYearDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  private validateObjectId(id: string): void {
    if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide fourni');
    }
  }

  // ==================== ACADEMIC YEARS ====================

  async createAcademicYear(
    createAcademicYearDto: CreateAcademicYearDto,
    tenantId: string,
  ): Promise<AcademicYearDocument> {
    this.validateObjectId(tenantId);

    try {
      // Vérifier l'unicité du nom
      const existingYear = await this.academicYearModel.findOne({
        name: createAcademicYearDto.name,
        tenantId: new Types.ObjectId(tenantId),
      });

      if (existingYear) {
        throw new ConflictException('Cette année scolaire existe déjà');
      }

      // Si cette année est marquée comme active, désactiver les autres
      if (createAcademicYearDto.isActive) {
        await this.academicYearModel.updateMany(
          { tenantId: new Types.ObjectId(tenantId) },
          { isActive: false }
        );
      }

      const academicYearData = {
        ...createAcademicYearDto,
        tenantId: new Types.ObjectId(tenantId),
        startDate: new Date(createAcademicYearDto.startDate),
        endDate: new Date(createAcademicYearDto.endDate),
        periods: createAcademicYearDto.periods?.map(period => ({
          ...period,
          startDate: new Date(period.startDate),
          endDate: new Date(period.endDate),
        })) || [],
      };

      const academicYear = new this.academicYearModel(academicYearData);
      return await academicYear.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la création de l\'année scolaire');
    }
  }

  async findAllAcademicYears(tenantId: string): Promise<AcademicYearDocument[]> {
    this.validateObjectId(tenantId);
    
    return await this.academicYearModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .sort({ startDate: -1 })
      .exec();
  }

  async findAcademicYearById(id: string, tenantId: string): Promise<AcademicYearDocument> {
    this.validateObjectId(id);
    this.validateObjectId(tenantId);

    const academicYear = await this.academicYearModel.findOne({
      _id: id,
      tenantId: new Types.ObjectId(tenantId),
    });

    if (!academicYear) {
      throw new NotFoundException('Année scolaire non trouvée');
    }

    return academicYear;
  }

  async getActiveAcademicYear(tenantId: string): Promise<AcademicYearDocument | null> {
    this.validateObjectId(tenantId);
    
    return await this.academicYearModel.findOne({
      tenantId: new Types.ObjectId(tenantId),
      isActive: true,
    });
  }

  // ==================== CLASSES ====================

  async createClass(
    createClassDto: CreateClassDto,
    tenantId: string,
  ): Promise<ClassDocument> {
    this.validateObjectId(tenantId);
    this.validateObjectId(createClassDto.academicYearId);

    try {
      // Vérifier que l'année scolaire existe
      const academicYear = await this.findAcademicYearById(createClassDto.academicYearId, tenantId);
      
      // Vérifier l'unicité du nom de classe pour cette année
      const existingClass = await this.classModel.findOne({
        name: createClassDto.name,
        academicYearId: new Types.ObjectId(createClassDto.academicYearId),
        tenantId: new Types.ObjectId(tenantId),
      });

      if (existingClass) {
        throw new ConflictException('Cette classe existe déjà pour cette année scolaire');
      }

      const classData = {
        ...createClassDto,
        tenantId: new Types.ObjectId(tenantId),
        academicYearId: new Types.ObjectId(createClassDto.academicYearId),
        subjects: createClassDto.subjects?.map(id => new Types.ObjectId(id)) || [],
        mainTeacher: createClassDto.mainTeacher ? new Types.ObjectId(createClassDto.mainTeacher) : undefined,
      };

      const newClass = new this.classModel(classData);
      return await newClass.save();
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la création de la classe');
    }
  }

  async findAllClasses(tenantId: string, academicYearId?: string): Promise<ClassDocument[]> {
    this.validateObjectId(tenantId);
    
    const filter: any = { tenantId: new Types.ObjectId(tenantId) };
    
    if (academicYearId) {
      this.validateObjectId(academicYearId);
      filter.academicYearId = new Types.ObjectId(academicYearId);
    }

    return await this.classModel
      .find(filter)
      .populate('subjects')
      .populate('mainTeacher')
      .populate('academicYearId')
      .sort({ level: 1, name: 1 })
      .exec();
  }

  async findClassById(id: string, tenantId: string): Promise<ClassDocument> {
    this.validateObjectId(id);
    this.validateObjectId(tenantId);

    const classDoc = await this.classModel
      .findOne({
        _id: id,
        tenantId: new Types.ObjectId(tenantId),
      })
      .populate('subjects')
      .populate('mainTeacher')
      .populate('academicYearId');

    if (!classDoc) {
      throw new NotFoundException('Classe non trouvée');
    }

    return classDoc;
  }

  // ==================== SCHEDULES ====================

  async createSchedule(
    createScheduleDto: CreateScheduleDto,
    tenantId: string,
  ): Promise<ScheduleDocument> {
    this.validateObjectId(tenantId);
    this.validateObjectId(createScheduleDto.classId);
    this.validateObjectId(createScheduleDto.academicYearId);

    // Valider les IDs optionnels s'ils sont fournis
    if (createScheduleDto.subjectId) {
      this.validateObjectId(createScheduleDto.subjectId);
    }
    if (createScheduleDto.teacherId) {
      this.validateObjectId(createScheduleDto.teacherId);
    }

    try {
      // Vérifier que la classe et l'année existent
      await this.findClassById(createScheduleDto.classId, tenantId);
      await this.findAcademicYearById(createScheduleDto.academicYearId, tenantId);

      // Vérifier les conflits d'horaires
      const conflictingSchedule = await this.checkScheduleConflict(createScheduleDto, tenantId);
      if (conflictingSchedule) {
        throw new ConflictException('Conflit d\'horaire détecté avec un créneau existant');
      }

      // Calculer la durée si non fournie
      const calculatedDuration = this.calculateDuration(
        createScheduleDto.startTime,
        createScheduleDto.endTime
      );
      
      if (calculatedDuration <= 0) {
        throw new BadRequestException('L\'heure de fin doit être postérieure à l\'heure de début');
      }
      
      const duration = createScheduleDto.duration || calculatedDuration;

      const scheduleData = {
        ...createScheduleDto,
        duration,
        tenantId: new Types.ObjectId(tenantId),
        classId: new Types.ObjectId(createScheduleDto.classId),
        academicYearId: new Types.ObjectId(createScheduleDto.academicYearId),
        subjectId: createScheduleDto.subjectId ? new Types.ObjectId(createScheduleDto.subjectId) : undefined,
        teacherId: createScheduleDto.teacherId ? new Types.ObjectId(createScheduleDto.teacherId) : undefined,
        startDate: createScheduleDto.startDate ? new Date(createScheduleDto.startDate) : undefined,
        endDate: createScheduleDto.endDate ? new Date(createScheduleDto.endDate) : undefined,
      };

      const schedule = new this.scheduleModel(scheduleData);
      return await schedule.save();
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la création du créneau');
    }
  }

  async findAllSchedules(
    tenantId: string,
    classId?: string,
    academicYearId?: string,
    dayOfWeek?: string,
  ): Promise<ScheduleDocument[]> {
    this.validateObjectId(tenantId);
    
    const filter: any = { tenantId: new Types.ObjectId(tenantId) };
    
    if (classId) {
      this.validateObjectId(classId);
      filter.classId = new Types.ObjectId(classId);
    }
    
    if (academicYearId) {
      this.validateObjectId(academicYearId);
      filter.academicYearId = new Types.ObjectId(academicYearId);
    }
    
    if (dayOfWeek) {
      filter.dayOfWeek = dayOfWeek;
    }

    return await this.scheduleModel
      .find(filter)
      .populate('subjectId')
      .populate('classId')
      .populate('teacherId')
      .populate('academicYearId')
      .sort({ dayOfWeek: 1, startTime: 1 })
      .exec();
  }

  async findScheduleById(id: string, tenantId: string): Promise<ScheduleDocument> {
    this.validateObjectId(id);
    this.validateObjectId(tenantId);

    const schedule = await this.scheduleModel
      .findOne({
        _id: id,
        tenantId: new Types.ObjectId(tenantId),
      })
      .populate('subjectId')
      .populate('classId')
      .populate('teacherId')
      .populate('academicYearId');

    if (!schedule) {
      throw new NotFoundException('Créneau non trouvé');
    }

    return schedule;
  }

  // ==================== UTILITY METHODS ====================

  private async checkScheduleConflict(
    scheduleDto: CreateScheduleDto,
    tenantId: string,
  ): Promise<boolean> {
    const conflictingSchedules = await this.scheduleModel.find({
      tenantId: new Types.ObjectId(tenantId),
      classId: new Types.ObjectId(scheduleDto.classId),
      dayOfWeek: scheduleDto.dayOfWeek,
      status: 'active',
      $or: [
        {
          startTime: { $lt: scheduleDto.endTime },
          endTime: { $gt: scheduleDto.startTime },
        },
      ],
    });

    return conflictingSchedules.length > 0;
  }

  private calculateDuration(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    return endTotalMinutes - startTotalMinutes;
  }

  // ==================== SUBJECTS ====================

  async createSubject(
    createSubjectDto: CreateSubjectDto,
    tenantId: string,
  ): Promise<SubjectDocument> {
    this.validateObjectId(tenantId);

    try {
      const subjectData = {
        ...createSubjectDto,
        tenantId: new Types.ObjectId(tenantId),
      };

      const subject = new this.subjectModel(subjectData);
      return await subject.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Un sujet avec ce code existe déjà pour cet établissement');
      }
      throw new BadRequestException('Erreur lors de la création du sujet');
    }
  }

  async findAllSubjects(tenantId: string): Promise<SubjectDocument[]> {
    this.validateObjectId(tenantId);
    return await this.subjectModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .sort({ name: 1 })
      .exec();
  }

  async findSubjectById(id: string, tenantId: string): Promise<SubjectDocument> {
    this.validateObjectId(id);
    this.validateObjectId(tenantId);

    const subject = await this.subjectModel
      .findOne({ _id: new Types.ObjectId(id), tenantId: new Types.ObjectId(tenantId) })
      .exec();

    if (!subject) {
      throw new NotFoundException('Sujet non trouvé');
    }
    return subject;
  }

  // ==================== TEACHERS ====================

  async createTeacher(
    createTeacherDto: CreateTeacherDto,
    tenantId: string,
  ): Promise<TeacherDocument> {
    this.validateObjectId(tenantId);

    // Valider les subjects s'ils sont fournis
    if (createTeacherDto.subjects && createTeacherDto.subjects.length > 0) {
      for (const subjectId of createTeacherDto.subjects) {
        await this.findSubjectById(subjectId, tenantId);
      }
    }

    try {
      const teacherData = {
        ...createTeacherDto,
        tenantId: new Types.ObjectId(tenantId),
        subjects: createTeacherDto.subjects?.map(id => new Types.ObjectId(id)) || [],
        hireDate: createTeacherDto.hireDate ? new Date(createTeacherDto.hireDate) : new Date(),
        dateOfBirth: createTeacherDto.dateOfBirth ? new Date(createTeacherDto.dateOfBirth) : undefined,
      };

      const teacher = new this.teacherModel(teacherData);
      return await teacher.save();
    } catch (error) {
      if (error.code === 11000) {
        if (error.keyPattern?.email) {
          throw new BadRequestException('Un professeur avec cet email existe déjà');
        }
        if (error.keyPattern?.employeeId) {
          throw new BadRequestException('Un professeur avec cet ID employé existe déjà pour cet établissement');
        }
      }
      throw new BadRequestException('Erreur lors de la création du professeur');
    }
  }

  async findAllTeachers(tenantId: string): Promise<TeacherDocument[]> {
    this.validateObjectId(tenantId);
    return await this.teacherModel
      .find({ tenantId: new Types.ObjectId(tenantId) })
      .populate('subjects', 'name code')
      .sort({ lastName: 1, firstName: 1 })
      .exec();
  }

  async findTeacherById(id: string, tenantId: string): Promise<TeacherDocument> {
    this.validateObjectId(id);
    this.validateObjectId(tenantId);

    const teacher = await this.teacherModel
      .findOne({ _id: new Types.ObjectId(id), tenantId: new Types.ObjectId(tenantId) })
      .populate('subjects', 'name code color')
      .exec();

    if (!teacher) {
      throw new NotFoundException('Professeur non trouvé');
    }
    return teacher;
  }

  // ==================== SUPER ADMIN METHODS ====================

  async assignSubjectsToTenant(
    targetTenantId: string,
    subjectIds: string[]
  ): Promise<SubjectDocument[]> {
    this.validateObjectId(targetTenantId);
    
    const assignedSubjects: SubjectDocument[] = [];
    
    for (const subjectId of subjectIds) {
      this.validateObjectId(subjectId);
      
      const sourceSubject = await this.subjectModel.findById(subjectId).exec();
      if (!sourceSubject) {
        throw new NotFoundException(`Sujet avec ID ${subjectId} non trouvé`);
      }
      
      const subjectData = {
        name: sourceSubject.name,
        code: sourceSubject.code,
        description: sourceSubject.description,
        credits: sourceSubject.credits,
        status: sourceSubject.status,
        color: sourceSubject.color,
        hoursPerWeek: sourceSubject.hoursPerWeek,
        type: sourceSubject.type,
        tenantId: new Types.ObjectId(targetTenantId),
      };
      
      try {
        const newSubject = new this.subjectModel(subjectData);
        const savedSubject = await newSubject.save();
        assignedSubjects.push(savedSubject);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Sujet ${sourceSubject.code} déjà existant pour le tenant ${targetTenantId}`);
        } else {
          throw error;
        }
      }
    }
    
    return assignedSubjects;
  }

  async assignTeachersToTenant(
    targetTenantId: string,
    teacherIds: string[]
  ): Promise<TeacherDocument[]> {
    this.validateObjectId(targetTenantId);
    
    const assignedTeachers: TeacherDocument[] = [];
    
    for (const teacherId of teacherIds) {
      this.validateObjectId(teacherId);
      
      const sourceTeacher = await this.teacherModel.findById(teacherId).populate('subjects').exec();
      if (!sourceTeacher) {
        throw new NotFoundException(`Professeur avec ID ${teacherId} non trouvé`);
      }
      
      const targetSubjects: Types.ObjectId[] = [];
      if (sourceTeacher.subjects && sourceTeacher.subjects.length > 0) {
        for (const subject of sourceTeacher.subjects as any[]) {
          const targetSubject = await this.subjectModel.findOne({
            code: subject.code,
            tenantId: new Types.ObjectId(targetTenantId)
          }).exec();
          
          if (targetSubject) {
            targetSubjects.push(targetSubject._id as Types.ObjectId);
          }
        }
      }
      
      const teacherData = {
        firstName: sourceTeacher.firstName,
        lastName: sourceTeacher.lastName,
        email: `${sourceTeacher.email.split('@')[0]}_${targetTenantId.slice(-4)}@${sourceTeacher.email.split('@')[1]}`,
        phone: sourceTeacher.phone,
        dateOfBirth: sourceTeacher.dateOfBirth,
        gender: sourceTeacher.gender,
        address: sourceTeacher.address,
        employeeId: sourceTeacher.employeeId + '_' + targetTenantId.slice(-4),
        hireDate: new Date(),
        status: 'active',
        subjects: targetSubjects,
        education: sourceTeacher.education,
        experience: sourceTeacher.experience,
        salary: sourceTeacher.salary,
        employmentType: sourceTeacher.employmentType,
        department: sourceTeacher.department,
        specialization: sourceTeacher.specialization,
        languages: sourceTeacher.languages,
        emergencyContact: sourceTeacher.emergencyContact,
        emergencyPhone: sourceTeacher.emergencyPhone,
        tenantId: new Types.ObjectId(targetTenantId),
      };
      
      try {
        const newTeacher = new this.teacherModel(teacherData);
        const savedTeacher = await newTeacher.save();
        assignedTeachers.push(savedTeacher);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Professeur ${sourceTeacher.employeeId} déjà existant pour le tenant ${targetTenantId}`);
        } else {
          throw error;
        }
      }
    }
    
    return assignedTeachers;
  }

  async findAllSubjectsForSuperAdmin(): Promise<SubjectDocument[]> {
    return await this.subjectModel
      .find()
      .populate('tenantId', 'name')
      .sort({ name: 1 })
      .exec();
  }

  async findAllTeachersForSuperAdmin(): Promise<TeacherDocument[]> {
    return await this.teacherModel
      .find()
      .populate('subjects', 'name code')
      .populate('tenantId', 'name')
      .sort({ lastName: 1, firstName: 1 })
      .exec();
  }

  // ==================== STATS ====================

  async getAcademicStats(tenantId: string): Promise<any> {
    this.validateObjectId(tenantId);

    const [academicYears, classes, schedules, subjects, teachers] = await Promise.all([
      this.academicYearModel.countDocuments({ tenantId: new Types.ObjectId(tenantId) }),
      this.classModel.countDocuments({ tenantId: new Types.ObjectId(tenantId) }),
      this.scheduleModel.countDocuments({ tenantId: new Types.ObjectId(tenantId) }),
      this.subjectModel.countDocuments({ tenantId: new Types.ObjectId(tenantId) }),
      this.teacherModel.countDocuments({ tenantId: new Types.ObjectId(tenantId) }),
    ]);

    return {
      academicYears,
      classes,
      schedules,
      subjects,
      teachers,
    };
  }
}