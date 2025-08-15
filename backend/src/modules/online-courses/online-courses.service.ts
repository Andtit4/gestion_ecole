import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OnlineCourse, OnlineCourseDocument, CourseStatus, ParticipantType } from './schemas/online-course.schema';
import { CreateOnlineCourseDto, JoinCourseDto, LeaveCourseDto, UpdateCourseStatusDto } from './dto/create-online-course.dto';

export interface CourseFilters {
  status?: string;
  subject?: string;
  className?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface CourseStatistics {
  totalCourses: number;
  liveCourses: number;
  scheduledCourses: number;
  completedCourses: number;
  totalStudents: number;
  averageAttendance: number;
  totalDuration: number;
  popularSubjects: Array<{ subject: string; count: number }>;
}

@Injectable()
export class OnlineCoursesService {
  constructor(
    @InjectModel(OnlineCourse.name)
    private onlineCourseModel: Model<OnlineCourseDocument>,
  ) {}

  async create(tenantId: string, createOnlineCourseDto: CreateOnlineCourseDto): Promise<OnlineCourse> {
    // Générer l'URL Jitsi Meet si non fournie
    if (!createOnlineCourseDto.meetingUrl) {
      const timestamp = Date.now();
      
      // Nettoyer le titre pour l'URL - éliminer TOUS les caractères spéciaux
      const courseSlug = createOnlineCourseDto.title
        .toLowerCase()
        .normalize('NFD') // Décomposer les caractères accentués
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les diacritiques
        .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
        .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
        .replace(/-+/g, '-') // Remplacer plusieurs tirets consécutifs par un seul
        .replace(/^-|-$/g, '') // Supprimer les tirets en début et fin
        .substring(0, 30); // Limiter la longueur
      
      // Assurer qu'on a au moins quelque chose
      const finalSlug = courseSlug || 'cours';
      
      createOnlineCourseDto.meetingUrl = `https://meet.jit.si/${finalSlug}-${timestamp}`;
    }

    const onlineCourse = new this.onlineCourseModel({
      ...createOnlineCourseDto,
      tenantId,
      startTime: new Date(createOnlineCourseDto.startTime),
    });

    return await onlineCourse.save();
  }

  async findAll(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    filters: CourseFilters = {}
  ): Promise<{
    courses: OnlineCourse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = { tenantId, isActive: true };

    // Appliquer les filtres
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.subject) {
      query.subject = filters.subject;
    }
    if (filters.className) {
      query.className = filters.className;
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { subject: { $regex: filters.search, $options: 'i' } },
      ];
    }
    if (filters.startDate && filters.endDate) {
      query.startTime = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    const [courses, total] = await Promise.all([
      this.onlineCourseModel
        .find(query)
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.onlineCourseModel.countDocuments(query),
    ]);

    return {
      courses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, tenantId: string): Promise<OnlineCourse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de cours invalide');
    }

    const course = await this.onlineCourseModel
      .findOne({ _id: id, tenantId, isActive: true })
      .exec();

    if (!course) {
      throw new NotFoundException('Cours en ligne non trouvé');
    }

    return course;
  }

  async update(id: string, tenantId: string, updateData: Partial<CreateOnlineCourseDto>): Promise<OnlineCourse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de cours invalide');
    }

    const course = await this.onlineCourseModel
      .findOneAndUpdate(
        { _id: id, tenantId, isActive: true },
        { ...updateData, updatedAt: new Date() },
        { new: true }
      )
      .exec();

    if (!course) {
      throw new NotFoundException('Cours en ligne non trouvé');
    }

    return course;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de cours invalide');
    }

    const result = await this.onlineCourseModel
      .updateOne(
        { _id: id, tenantId },
        { isActive: false, updatedAt: new Date() }
      )
      .exec();

    if (result.matchedCount === 0) {
      throw new NotFoundException('Cours en ligne non trouvé');
    }
  }

  async joinCourse(tenantId: string, joinCourseDto: JoinCourseDto): Promise<OnlineCourse> {
    const { courseId, userId, userName, userType, email } = joinCourseDto;

    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('ID de cours invalide');
    }

    const course = await this.onlineCourseModel
      .findOne({ _id: courseId, tenantId, isActive: true })
      .exec();

    if (!course) {
      throw new NotFoundException('Cours en ligne non trouvé');
    }

    // Vérifier si l'utilisateur a déjà rejoint
    const existingParticipant = course.participants.find(p => p.userId === userId);
    if (existingParticipant && !existingParticipant.leftAt) {
      throw new ConflictException('Vous avez déjà rejoint ce cours');
    }

    // Vérifier la capacité maximum
    const activeParticipants = course.participants.filter(p => !p.leftAt);
    if (activeParticipants.length >= course.maxParticipants) {
      throw new BadRequestException('Le cours a atteint sa capacité maximum');
    }

    // Ajouter le participant
    const participant = {
      userId,
      name: userName,
      type: userType,
      email,
      joinedAt: new Date(),
      duration: 0,
    };

    course.participants.push(participant);
    await course.save();

    return course;
  }

  async leaveCourse(tenantId: string, leaveCourseDto: LeaveCourseDto): Promise<OnlineCourse> {
    const { courseId, userId } = leaveCourseDto;

    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('ID de cours invalide');
    }

    const course = await this.onlineCourseModel
      .findOne({ _id: courseId, tenantId, isActive: true })
      .exec();

    if (!course) {
      throw new NotFoundException('Cours en ligne non trouvé');
    }

    // Trouver le participant actif
    const participant = course.participants.find(
      p => p.userId === userId && !p.leftAt
    );

    if (!participant) {
      throw new NotFoundException('Participant non trouvé ou déjà quitté');
    }

    // Marquer comme quitté et calculer la durée
    participant.leftAt = new Date();
    participant.duration = Math.round(
      (participant.leftAt.getTime() - participant.joinedAt.getTime()) / (1000 * 60)
    );

    await course.save();
    return course;
  }

  async updateStatus(id: string, tenantId: string, updateStatusDto: UpdateCourseStatusDto): Promise<OnlineCourse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de cours invalide');
    }

    const updateData: any = {
      status: updateStatusDto.status,
      updatedAt: new Date(),
    };

    if (updateStatusDto.endTime) {
      updateData.endTime = new Date(updateStatusDto.endTime);
    }

    const course = await this.onlineCourseModel
      .findOneAndUpdate(
        { _id: id, tenantId, isActive: true },
        updateData,
        { new: true }
      )
      .exec();

    if (!course) {
      throw new NotFoundException('Cours en ligne non trouvé');
    }

    return course;
  }

  async getStatistics(tenantId: string): Promise<CourseStatistics> {
    const [totalCourses, statusCounts, subjectCounts, participantStats] = await Promise.all([
      this.onlineCourseModel.countDocuments({ tenantId, isActive: true }),
      
      this.onlineCourseModel.aggregate([
        { $match: { tenantId, isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      this.onlineCourseModel.aggregate([
        { $match: { tenantId, isActive: true } },
        { $group: { _id: '$subject', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      this.onlineCourseModel.aggregate([
        { $match: { tenantId, isActive: true } },
        {
          $project: {
            participantCount: { $size: '$participants' },
            duration: 1,
            maxParticipants: 1
          }
        },
        {
          $group: {
            _id: null,
            totalStudents: { $sum: '$participantCount' },
            totalDuration: { $sum: '$duration' },
            avgAttendance: { $avg: { $divide: ['$participantCount', '$maxParticipants'] } }
          }
        }
      ])
    ]);

    const statusMap = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const stats = participantStats[0] || {
      totalStudents: 0,
      totalDuration: 0,
      avgAttendance: 0
    };

    return {
      totalCourses,
      liveCourses: statusMap[CourseStatus.LIVE] || 0,
      scheduledCourses: statusMap[CourseStatus.SCHEDULED] || 0,
      completedCourses: statusMap[CourseStatus.ENDED] || 0,
      totalStudents: stats.totalStudents,
      averageAttendance: Math.round((stats.avgAttendance || 0) * 100),
      totalDuration: stats.totalDuration,
      popularSubjects: subjectCounts.map(item => ({
        subject: item._id,
        count: item.count
      }))
    };
  }

  async getUpcomingCourses(tenantId: string, limit: number = 10): Promise<OnlineCourse[]> {
    return await this.onlineCourseModel
      .find({
        tenantId,
        isActive: true,
        status: CourseStatus.SCHEDULED,
        startTime: { $gte: new Date() }
      })
      .sort({ startTime: 1 })
      .limit(limit)
      .exec();
  }

  async getLiveCourses(tenantId: string): Promise<OnlineCourse[]> {
    return await this.onlineCourseModel
      .find({
        tenantId,
        isActive: true,
        status: CourseStatus.LIVE
      })
      .sort({ startTime: 1 })
      .exec();
  }

  async getTeacherCourses(tenantId: string, teacherId: string): Promise<OnlineCourse[]> {
    return await this.onlineCourseModel
      .find({
        tenantId,
        isActive: true,
        'teacher.id': teacherId
      })
      .sort({ startTime: -1 })
      .exec();
  }

  async getStudentCourses(tenantId: string, studentId: string): Promise<OnlineCourse[]> {
    return await this.onlineCourseModel
      .find({
        tenantId,
        isActive: true,
        'participants.userId': studentId
      })
      .sort({ startTime: -1 })
      .exec();
  }
} 