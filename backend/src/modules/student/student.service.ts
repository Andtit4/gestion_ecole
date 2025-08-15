import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    private usersService: UsersService,
  ) {}

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide');
    }
  }

  async create(
    createStudentDto: CreateStudentDto,
    tenantId: string,
  ): Promise<{
    student: StudentDocument;
    userCredentials?: { email: string; password: string };
  }> {
    this.validateObjectId(tenantId);

    try {
      // Vérifier l'unicité du numéro d'étudiant dans le tenant
      const existingStudent = await this.studentModel.findOne({
        studentNumber: createStudentDto.studentNumber,
        tenantId: new Types.ObjectId(tenantId),
      });

      if (existingStudent) {
        throw new ConflictException('Ce numéro d\'étudiant est déjà utilisé');
      }

      // Vérifier l'unicité de l'email dans le tenant
      const existingEmail = await this.studentModel.findOne({
        email: createStudentDto.email,
        tenantId: new Types.ObjectId(tenantId),
      });

      if (existingEmail) {
        throw new ConflictException('Cette adresse email est déjà utilisée');
      }

      const studentData = {
        ...createStudentDto,
        tenantId: new Types.ObjectId(tenantId),
        dateOfBirth: new Date(createStudentDto.dateOfBirth),
        academicInfo: {
          ...createStudentDto.academicInfo,
          classId: new Types.ObjectId(createStudentDto.academicInfo.classId),
          enrollmentDate: new Date(createStudentDto.academicInfo.enrollmentDate),
        },
      };

      const student = new this.studentModel(studentData);
      const savedStudent = await student.save();

      // Créer automatiquement un compte utilisateur pour l'étudiant
      let userCredentials: { email: string; password: string } | undefined = undefined;
      try {
        const userResult = await this.usersService.quickCreateUser({
          email: createStudentDto.email,
          firstName: createStudentDto.firstName,
          lastName: createStudentDto.lastName,
          role: UserRole.STUDENT,
          tenantId,
          phone: createStudentDto.phone,
          department: createStudentDto.academicInfo.className, // Utiliser la classe comme département
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
        student: savedStudent,
        userCredentials,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la création de l\'élève');
    }
  }

  async findAll(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
    classId?: string,
    status?: string,
  ): Promise<{
    students: StudentDocument[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    this.validateObjectId(tenantId);

    const skip = (page - 1) * limit;
    const filter: any = { tenantId: new Types.ObjectId(tenantId) };

    // Filtre par recherche (nom, email, numéro étudiant)
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Filtre par classe
    if (classId) {
      this.validateObjectId(classId);
      filter['academicInfo.classId'] = new Types.ObjectId(classId);
    }

    // Filtre par statut
    if (status) {
      filter['academicInfo.status'] = status;
    }

    try {
      const [students, total] = await Promise.all([
        this.studentModel
          .find(filter)
          .sort({ lastName: 1, firstName: 1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.studentModel.countDocuments(filter),
      ]);

      return {
        students,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des élèves');
    }
  }

  async findOne(id: string, tenantId: string): Promise<StudentDocument> {
    this.validateObjectId(id);
    this.validateObjectId(tenantId);

    try {
      const student = await this.studentModel.findOne({
        _id: id,
        tenantId: new Types.ObjectId(tenantId),
      });

      if (!student) {
        throw new NotFoundException('Élève non trouvé');
      }

      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la récupération de l\'élève');
    }
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
    tenantId: string,
  ): Promise<StudentDocument> {
    this.validateObjectId(id);
    this.validateObjectId(tenantId);

    try {
      // Vérifier l'unicité si numéro d'étudiant ou email sont modifiés
      if (updateStudentDto.studentNumber || updateStudentDto.email) {
        const filter: any = {
          _id: { $ne: id },
          tenantId: new Types.ObjectId(tenantId),
        };

        if (updateStudentDto.studentNumber) {
          filter.studentNumber = updateStudentDto.studentNumber;
        }

        if (updateStudentDto.email) {
          filter.email = updateStudentDto.email;
        }

        const existingStudent = await this.studentModel.findOne(filter);
        if (existingStudent) {
          throw new ConflictException('Numéro d\'étudiant ou email déjà utilisé');
        }
      }

      const updateData: any = { ...updateStudentDto };

      // Conversion des dates si nécessaire
      if (updateStudentDto.dateOfBirth) {
        updateData.dateOfBirth = new Date(updateStudentDto.dateOfBirth);
      }

      if (updateStudentDto.academicInfo) {
        updateData.academicInfo = {
          ...updateStudentDto.academicInfo,
        };

        if (updateStudentDto.academicInfo.classId) {
          updateData.academicInfo.classId = new Types.ObjectId(
            updateStudentDto.academicInfo.classId,
          );
        }

        if (updateStudentDto.academicInfo.enrollmentDate) {
          updateData.academicInfo.enrollmentDate = new Date(
            updateStudentDto.academicInfo.enrollmentDate,
          );
        }
      }

      const updatedStudent = await this.studentModel.findOneAndUpdate(
        { _id: id, tenantId: new Types.ObjectId(tenantId) },
        updateData,
        { new: true },
      );

      if (!updatedStudent) {
        throw new NotFoundException('Élève non trouvé');
      }

      return updatedStudent;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la mise à jour de l\'élève');
    }
  }

  async remove(id: string, tenantId: string): Promise<void> {
    this.validateObjectId(id);
    this.validateObjectId(tenantId);

    try {
      const result = await this.studentModel.findOneAndDelete({
        _id: id,
        tenantId: new Types.ObjectId(tenantId),
      });

      if (!result) {
        throw new NotFoundException('Élève non trouvé');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la suppression de l\'élève');
    }
  }

  async getStudentsByClass(
    classId: string,
    tenantId: string,
  ): Promise<StudentDocument[]> {
    this.validateObjectId(classId);
    this.validateObjectId(tenantId);

    try {
      return await this.studentModel
        .find({
          'academicInfo.classId': new Types.ObjectId(classId),
          tenantId: new Types.ObjectId(tenantId),
          'academicInfo.status': 'active',
        })
        .sort({ lastName: 1, firstName: 1 })
        .exec();
    } catch (error) {
      throw new BadRequestException('Erreur lors de la récupération des élèves de la classe');
    }
  }

  async getStudentsStats(tenantId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    byLevel: Record<string, number>;
    byGender: Record<string, number>;
  }> {
    this.validateObjectId(tenantId);

    try {
      const students = await this.studentModel.find({
        tenantId: new Types.ObjectId(tenantId),
      });

      const stats = {
        total: students.length,
        active: students.filter(s => s.academicInfo.status === 'active').length,
        inactive: students.filter(s => s.academicInfo.status !== 'active').length,
        byLevel: {} as Record<string, number>,
        byGender: {} as Record<string, number>,
      };

      // Statistiques par niveau
      students.forEach(student => {
        const level = student.academicInfo.level;
        stats.byLevel[level] = (stats.byLevel[level] || 0) + 1;
      });

      // Statistiques par genre
      students.forEach(student => {
        const gender = student.gender === 'M' ? 'Masculin' : 'Féminin';
        stats.byGender[gender] = (stats.byGender[gender] || 0) + 1;
      });

      return stats;
    } catch (error) {
      throw new BadRequestException('Erreur lors du calcul des statistiques');
    }
  }

  async bulkImport(
    studentsData: CreateStudentDto[],
    tenantId: string,
  ): Promise<{
    success: StudentDocument[];
    errors: { index: number; error: string; data: CreateStudentDto }[];
  }> {
    this.validateObjectId(tenantId);

    const success: StudentDocument[] = [];
    const errors: { index: number; error: string; data: CreateStudentDto }[] = [];

    for (let i = 0; i < studentsData.length; i++) {
      try {
        const student = await this.create(studentsData[i], tenantId);
        success.push(student.student);
      } catch (error) {
        errors.push({
          index: i,
          error: error.message,
          data: studentsData[i],
        });
      }
    }

    return { success, errors };
  }
} 