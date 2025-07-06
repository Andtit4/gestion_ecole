import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evaluation } from './schemas/evaluation.schema';
import { StudentGrade } from './schemas/student-grade.schema';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name) private evaluationModel: Model<Evaluation>,
    @InjectModel(StudentGrade.name) private studentGradeModel: Model<StudentGrade>,
  ) {}

  // === EVALUATIONS ===

  async createEvaluation(tenantId: string, createEvaluationDto: CreateEvaluationDto): Promise<Evaluation> {
    const evaluation = new this.evaluationModel({
      ...createEvaluationDto,
      tenantId,
      date: new Date(createEvaluationDto.date),
    });
    return evaluation.save();
  }

  async findAllEvaluations(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ) {
    const skip = (page - 1) * limit;
    const filter: any = { tenantId };

    // Appliquer les filtres
    if (filters.classId) filter.classId = filters.classId;
    if (filters.subjectId) filter.subjectId = filters.subjectId;
    if (filters.teacherId) filter.teacherId = filters.teacherId;
    if (filters.type) filter.type = filters.type;
    if (filters.academicYearId) filter.academicYearId = filters.academicYearId;
    if (filters.periodId) filter.periodId = filters.periodId;

    const [evaluations, total] = await Promise.all([
      this.evaluationModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 })
        .exec(),
      this.evaluationModel.countDocuments(filter),
    ]);

    return {
      evaluations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneEvaluation(id: string, tenantId: string): Promise<Evaluation> {
    const evaluation = await this.evaluationModel.findOne({ _id: id, tenantId });
    if (!evaluation) {
      throw new NotFoundException('Évaluation non trouvée');
    }
    return evaluation;
  }

  async updateEvaluation(id: string, tenantId: string, updateEvaluationDto: UpdateEvaluationDto): Promise<Evaluation> {
    const evaluation = await this.evaluationModel.findOneAndUpdate(
      { _id: id, tenantId },
      { 
        ...updateEvaluationDto,
        ...(updateEvaluationDto.date ? { date: new Date(updateEvaluationDto.date) } : {})
      },
      { new: true }
    );
    if (!evaluation) {
      throw new NotFoundException('Évaluation non trouvée');
    }
    return evaluation;
  }

  async deleteEvaluation(id: string, tenantId: string): Promise<void> {
    // Supprimer d'abord toutes les notes associées
    await this.studentGradeModel.deleteMany({ evaluationId: id, tenantId });
    
    // Supprimer l'évaluation
    const result = await this.evaluationModel.deleteOne({ _id: id, tenantId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Évaluation non trouvée');
    }
  }

  // === NOTES DES ÉLÈVES ===

  async createStudentGrade(tenantId: string, createStudentGradeDto: CreateStudentGradeDto): Promise<StudentGrade> {
    // Vérifier que l'évaluation existe
    const evaluation = await this.findOneEvaluation(createStudentGradeDto.evaluationId, tenantId);
    
    const grade = new this.studentGradeModel({
      ...createStudentGradeDto,
      tenantId,
      gradedAt: new Date(),
    });
    return grade.save();
  }

  async findGradesByEvaluation(evaluationId: string, tenantId: string): Promise<StudentGrade[]> {
    return this.studentGradeModel.find({ evaluationId, tenantId }).sort({ studentId: 1 });
  }

  async findGradesByStudent(studentId: string, tenantId: string, filters: any = {}): Promise<StudentGrade[]> {
    const filter: any = { studentId, tenantId };
    
    if (filters.evaluationId) filter.evaluationId = filters.evaluationId;
    if (filters.subjectId) {
      // Récupérer les évaluations de cette matière puis filtrer les notes
      const evaluations = await this.evaluationModel.find({ subjectId: filters.subjectId, tenantId }).select('_id');
      filter.evaluationId = { $in: evaluations.map(e => e._id) };
    }

    return this.studentGradeModel.find(filter).sort({ gradedAt: -1 });
  }

  async updateStudentGrade(id: string, tenantId: string, updateData: Partial<CreateStudentGradeDto>): Promise<StudentGrade> {
    const grade = await this.studentGradeModel.findOneAndUpdate(
      { _id: id, tenantId },
      updateData,
      { new: true }
    );
    if (!grade) {
      throw new NotFoundException('Note non trouvée');
    }
    return grade;
  }

  async deleteStudentGrade(id: string, tenantId: string): Promise<void> {
    const result = await this.studentGradeModel.deleteOne({ _id: id, tenantId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Note non trouvée');
    }
  }

  // === STATISTIQUES ===

  async getEvaluationStats(tenantId: string, filters: any = {}) {
    const filter: any = { tenantId };
    if (filters.classId) filter.classId = filters.classId;
    if (filters.academicYearId) filter.academicYearId = filters.academicYearId;

    const totalEvaluations = await this.evaluationModel.countDocuments(filter);
    const publishedEvaluations = await this.evaluationModel.countDocuments({ ...filter, isPublished: true });
    const totalGrades = await this.studentGradeModel.countDocuments({ tenantId });

    // Calculer la moyenne générale
    const grades = await this.studentGradeModel.find({ tenantId });
    const averageGrade = grades.length > 0 
      ? grades.reduce((sum, g) => sum + (g.score / g.maxScore * 20), 0) / grades.length 
      : 0;

    return {
      totalEvaluations,
      publishedEvaluations,
      totalGrades,
      averageGrade,
      pendingEvaluations: totalEvaluations - publishedEvaluations,
    };
  }

  async getSubjectAverages(tenantId: string, studentId?: string, classId?: string) {
    const pipeline: any[] = [
      { $match: { tenantId } }
    ];

    if (studentId) {
      pipeline.push({ $match: { studentId } });
    }

    // Agrégation pour calculer les moyennes par matière
    pipeline.push(
      {
        $lookup: {
          from: 'evaluations',
          localField: 'evaluationId',
          foreignField: '_id',
          as: 'evaluation'
        }
      },
      { $unwind: '$evaluation' },
      {
        $group: {
          _id: '$evaluation.subjectId',
          averageScore: { $avg: { $divide: ['$score', '$maxScore'] } },
          totalGrades: { $sum: 1 },
          grades: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          subjectId: '$_id',
          average: { $multiply: ['$averageScore', 20] },
          totalGrades: 1,
          grades: 1
        }
      }
    );

    return this.studentGradeModel.aggregate(pipeline);
  }
} 
