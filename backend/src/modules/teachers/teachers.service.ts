import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeacherManagement, TeacherManagementDocument } from './schemas/teacher-management.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(TeacherManagement.name) private teacherModel: Model<TeacherManagementDocument>,
    private usersService: UsersService,
  ) {}

  // Générer un numéro d'employé unique
  private generateEmployeeNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `EMP${year}${random}`;
  }

  // Créer un nouveau professeur
  async create(
    createTeacherDto: CreateTeacherDto,
    tenantId: string,
  ): Promise<{
    teacher: TeacherManagement;
    userCredentials?: { email: string; password: string };
  }> {
    try {
      // Générer un numéro d'employé unique
      let employeeNumber: string = this.generateEmployeeNumber();
      let isUnique = false;

      while (!isUnique) {
        const existing = await this.teacherModel.findOne({
          employeeNumber,
          tenantId,
        });
        if (!existing) {
          isUnique = true;
        } else {
          employeeNumber = this.generateEmployeeNumber();
        }
      }

      // Vérifier l'unicité de l'email
      const existingEmail = await this.teacherModel.findOne({
        email: createTeacherDto.email,
        tenantId,
      });

      if (existingEmail) {
        throw new ConflictException('Un professeur avec cet email existe déjà');
      }

      const teacherData = {
        ...createTeacherDto,
        employeeNumber,
        tenantId,
        hireDate: new Date(createTeacherDto.hireDate),
        dateOfBirth: createTeacherDto.dateOfBirth
          ? new Date(createTeacherDto.dateOfBirth)
          : undefined,
      };

      const createdTeacher = new this.teacherModel(teacherData);
      const savedTeacher = await createdTeacher.save();

      // Créer automatiquement un compte utilisateur pour le professeur
      let userCredentials: { email: string; password: string } | undefined = undefined;
      try {
        const userResult = await this.usersService.quickCreateUser({
          email: createTeacherDto.email,
          firstName: createTeacherDto.firstName,
          lastName: createTeacherDto.lastName,
          role: UserRole.TEACHER,
          tenantId,
          phone: createTeacherDto.phone,
          department: createTeacherDto.department,
        });

        if (userResult.success && userResult.credentials) {
          userCredentials = userResult.credentials;
        }
      } catch (userError) {
        console.error(
          'Erreur lors de la création du compte utilisateur:',
          userError,
        );
        // On continue même si la création du compte utilisateur échoue
      }

      return {
        teacher: savedTeacher,
        userCredentials,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Un professeur avec ces informations existe déjà',
        );
      }
      throw error;
    }
  }

  // Récupérer tous les professeurs avec pagination et filtres
  async findAll(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
    subject?: string,
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const filter: any = { tenantId };

    // Filtre par recherche
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Filtre par matière
    if (subject) {
      filter.subjects = { $in: [subject] };
    }

    // Filtre par statut
    if (status) {
      filter.status = status;
    }

    const [teachers, total] = await Promise.all([
      this.teacherModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.teacherModel.countDocuments(filter),
    ]);

    return {
      teachers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Récupérer un professeur par ID
  async findOne(id: string, tenantId: string): Promise<TeacherManagement> {
    const teacher = await this.teacherModel.findOne({ _id: id, tenantId });
    if (!teacher) {
      throw new NotFoundException('Professeur non trouvé');
    }
    return teacher;
  }

  // Mettre à jour un professeur
  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
    tenantId: string,
  ): Promise<TeacherManagement> {
    // Vérifier l'existence du professeur
    const existingTeacher = await this.findOne(id, tenantId);

    // Si l'email est modifié, vérifier l'unicité
    if (
      updateTeacherDto.email &&
      updateTeacherDto.email !== existingTeacher.email
    ) {
      const emailExists = await this.teacherModel.findOne({
        email: updateTeacherDto.email,
        tenantId,
        _id: { $ne: id },
      });

      if (emailExists) {
        throw new ConflictException('Un professeur avec cet email existe déjà');
      }
    }

    const updateData = {
      ...updateTeacherDto,
      hireDate: updateTeacherDto.hireDate
        ? new Date(updateTeacherDto.hireDate)
        : undefined,
      dateOfBirth: updateTeacherDto.dateOfBirth
        ? new Date(updateTeacherDto.dateOfBirth)
        : undefined,
    };

    const updatedTeacher = await this.teacherModel.findOneAndUpdate(
      { _id: id, tenantId },
      updateData,
      { new: true },
    );

    if (!updatedTeacher) {
      throw new NotFoundException('Professeur non trouvé');
    }

    return updatedTeacher;
  }

  // Supprimer un professeur
  async remove(id: string, tenantId: string): Promise<void> {
    const result = await this.teacherModel.deleteOne({ _id: id, tenantId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Professeur non trouvé');
    }
  }

  // Récupérer les statistiques des professeurs
  async getStats(tenantId: string) {
    const teachers = await this.teacherModel.find({ tenantId });

    const total = teachers.length;
    const active = teachers.filter((t) => t.status === 'active').length;
    const inactive = teachers.filter((t) => t.status === 'inactive').length;
    const onLeave = teachers.filter((t) => t.status === 'on_leave').length;

    // Nouvelles recrues (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentHires = teachers.filter(
      (t) => new Date(t.hireDate) >= thirtyDaysAgo,
    ).length;

    // Répartition par matière
    const bySubject: Record<string, number> = {};
    teachers.forEach((teacher) => {
      teacher.subjects.forEach((subject) => {
        bySubject[subject] = (bySubject[subject] || 0) + 1;
      });
    });

    // Expérience moyenne
    const totalExperience = teachers.reduce(
      (sum, t) => sum + (t.experience || 0),
      0,
    );
    const averageExperience =
      total > 0 ? Math.round(totalExperience / total) : 0;

    return {
      total,
      active,
      inactive,
      onLeave,
      bySubject,
      averageExperience,
      recentHires,
    };
  }

  // Récupérer les professeurs par matière
  async findBySubject(subject: string, tenantId: string): Promise<TeacherManagement[]> {
    return this.teacherModel.find({
      tenantId,
      subjects: { $in: [subject] },
      status: 'active',
    });
  }
}
