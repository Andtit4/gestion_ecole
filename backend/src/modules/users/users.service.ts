import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  UserRole,
  UserStatus,
  Permission,
} from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Permissions par défaut selon le rôle
  private getDefaultPermissions(role: UserRole): Permission[] {
    switch (role) {
      case UserRole.ADMIN:
        return [
          Permission.VIEW_STUDENTS,
          Permission.CREATE_STUDENTS,
          Permission.EDIT_STUDENTS,
          Permission.DELETE_STUDENTS,
          Permission.VIEW_GRADES,
          Permission.CREATE_GRADES,
          Permission.EDIT_GRADES,
          Permission.DELETE_GRADES,
          Permission.VIEW_TEACHERS,
          Permission.CREATE_TEACHERS,
          Permission.EDIT_TEACHERS,
          Permission.DELETE_TEACHERS,
          Permission.VIEW_PARENTS,
          Permission.CREATE_PARENTS,
          Permission.EDIT_PARENTS,
          Permission.DELETE_PARENTS,
          Permission.MANAGE_SETTINGS,
          Permission.MANAGE_USERS,
          Permission.MANAGE_BILLING,
          Permission.VIEW_REPORTS,
          Permission.SEND_MESSAGES,
          Permission.VIEW_MESSAGES,
          Permission.VIEW_SCHEDULE,
          Permission.MANAGE_SCHEDULE,
        ];
      case UserRole.TEACHER:
        return [
          Permission.VIEW_STUDENTS,
          Permission.EDIT_STUDENTS,
          Permission.VIEW_GRADES,
          Permission.CREATE_GRADES,
          Permission.EDIT_GRADES,
          Permission.VIEW_PARENTS,
          Permission.SEND_MESSAGES,
          Permission.VIEW_MESSAGES,
          Permission.VIEW_SCHEDULE,
        ];
      case UserRole.STUDENT:
        return [
          Permission.VIEW_GRADES,
          Permission.VIEW_MESSAGES,
          Permission.VIEW_SCHEDULE,
        ];
      case UserRole.PARENT:
        return [
          Permission.VIEW_STUDENTS, // Uniquement ses enfants
          Permission.VIEW_GRADES, // Uniquement ses enfants
          Permission.SEND_MESSAGES,
          Permission.VIEW_MESSAGES,
          Permission.VIEW_SCHEDULE, // Uniquement ses enfants
        ];
      default:
        return [];
    }
  }

  async create(createUserDto: CreateUserDto, tenantId: string): Promise<User> {
    // Vérifier si l'email existe déjà pour ce tenant
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
      tenantId,
    });

    if (existingUser) {
      throw new BadRequestException(
        'Un utilisateur avec cet email existe déjà pour ce tenant',
      );
    }

    // Assigner les permissions par défaut si non spécifiées
    if (!createUserDto.permissions || createUserDto.permissions.length === 0) {
      createUserDto.permissions = this.getDefaultPermissions(
        createUserDto.role,
      );
    }

    const userData = {
      ...createUserDto,
      tenantId,
      status: createUserDto.status || UserStatus.ACTIVE,
    };

    const createdUser = new this.userModel(userData);
    return await createdUser.save();
  }

  async findAll(
    tenantId: string,
    page: number = 1,
    limit: number = 10,
    filters: any = {},
  ): Promise<{
    users: User[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    const query: any = { tenantId };

    // Appliquer les filtres
    if (filters.role) {
      query.role = filters.role;
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    const total = await this.userModel.countDocuments(query);
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const users = await this.userModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return {
      users,
      total,
      pages,
      currentPage: page,
    };
  }

  async findOne(id: string, tenantId: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id, tenantId }).exec();
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    tenantId: string,
  ): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ _id: id, tenantId })
      .exec();
    if (!existingUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Si l'email change, vérifier qu'il n'existe pas déjà
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.userModel.findOne({
        email: updateUserDto.email,
        tenantId,
        _id: { $ne: id },
      });

      if (emailExists) {
        throw new BadRequestException(
          'Un utilisateur avec cet email existe déjà pour ce tenant',
        );
      }
    }

    // Si le rôle change, mettre à jour les permissions par défaut
    if (updateUserDto.role && updateUserDto.role !== existingUser.role) {
      updateUserDto.permissions = this.getDefaultPermissions(
        updateUserDto.role,
      );
    }

    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id: id, tenantId }, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(
        'Utilisateur non trouvé lors de la mise à jour',
      );
    }

    return updatedUser;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id, tenantId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  }

  async findByRole(role: UserRole, tenantId: string): Promise<User[]> {
    return await this.userModel
      .find({ role, tenantId, status: UserStatus.ACTIVE })
      .exec();
  }

  async updateLastLogin(id: string, tenantId: string): Promise<void> {
    await this.userModel
      .updateOne({ _id: id, tenantId }, { lastLogin: new Date() })
      .exec();
  }

  async getUserStats(tenantId: string): Promise<any> {
    const totalUsers = await this.userModel.countDocuments({ tenantId });

    const usersByRole = await this.userModel.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const usersByStatus = await this.userModel.aggregate([
      { $match: { tenantId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return {
      total: totalUsers,
      byRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byStatus: usersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }

  async getRolePermissions(): Promise<any[]> {
    return [
      {
        role: UserRole.ADMIN,
        description: 'Accès complet à toutes les fonctionnalités',
        permissions: this.getDefaultPermissions(UserRole.ADMIN),
      },
      {
        role: UserRole.TEACHER,
        description: 'Gestion des élèves et des notes de ses classes',
        permissions: this.getDefaultPermissions(UserRole.TEACHER),
      },
      {
        role: UserRole.STUDENT,
        description: 'Consultation de ses notes et emploi du temps',
        permissions: this.getDefaultPermissions(UserRole.STUDENT),
      },
      {
        role: UserRole.PARENT,
        description: 'Suivi de ses enfants',
        permissions: this.getDefaultPermissions(UserRole.PARENT),
      },
    ];
  }

  /**
   * Création rapide d'utilisateur avec paramètres par défaut
   */
  async quickCreateUser(createDto: {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    tenantId: string;
    password?: string;
    phone?: string;
    department?: string;
  }): Promise<{
    success: boolean;
    user?: any;
    credentials?: { email: string; password: string };
    message?: string;
  }> {
    try {
      // Vérifier si l'email existe déjà pour ce tenant
      const existingUser = await this.userModel.findOne({
        email: createDto.email,
        tenantId: createDto.tenantId,
      });

      if (existingUser) {
        return {
          success: false,
          message: 'Un utilisateur avec cet email existe déjà pour ce tenant',
        };
      }

      // Générer un mot de passe par défaut si non fourni
      const password = createDto.password || this.generatePassword();

      const userData = {
        email: createDto.email,
        firstName: createDto.firstName,
        lastName: createDto.lastName,
        role: createDto.role,
        status: UserStatus.ACTIVE,
        tenantId: createDto.tenantId,
        phone: createDto.phone,
        department: createDto.department,
        permissions: this.getDefaultPermissions(createDto.role),
      };

      const createdUser = new this.userModel(userData);
      const savedUser = await createdUser.save();

      return {
        success: true,
        user: savedUser,
        credentials: {
          email: createDto.email,
          password: password,
        },
        message: 'Utilisateur créé avec succès',
      };
    } catch (error) {
      console.error('Erreur création rapide utilisateur:', error);
      return {
        success: false,
        message: "Erreur lors de la création de l'utilisateur",
      };
    }
  }

  /**
   * Création en lot d'utilisateurs
   */
  async bulkCreateUsers(
    users: Array<{
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      phone?: string;
      department?: string;
    }>,
    tenantId: string,
    defaultPassword?: string,
  ): Promise<{
    success: boolean;
    created: Array<{
      user: any;
      credentials: { email: string; password: string };
    }>;
    errors: Array<{ email: string; error: string }>;
    message: string;
  }> {
    const created: Array<{
      user: any;
      credentials: { email: string; password: string };
    }> = [];
    const errors: Array<{ email: string; error: string }> = [];

    for (const userData of users) {
      try {
        const result = await this.quickCreateUser({
          ...userData,
          tenantId,
          password: defaultPassword,
        });

        if (result.success) {
          created.push({
            user: result.user,
            credentials: result.credentials!,
          });
        } else {
          errors.push({
            email: userData.email,
            error: result.message || 'Erreur inconnue',
          });
        }
      } catch (error) {
        errors.push({
          email: userData.email,
          error: error.message || 'Erreur lors de la création',
        });
      }
    }

    return {
      success: created.length > 0,
      created,
      errors,
      message: `${created.length} utilisateurs créés, ${errors.length} erreurs`,
    };
  }

  /**
   * Générer un mot de passe par défaut
   */
  private generatePassword(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Authentifier un utilisateur par email et mot de passe
   */
  async authenticate(email: string, password: string, tenantId: string): Promise<User | null> {
    try {
      // Chercher l'utilisateur avec le mot de passe
      const user = await this.userModel
        .findOne({ email: email.toLowerCase(), tenantId })
        .select('+password') // Inclure le mot de passe pour cette requête
        .exec();

      if (!user || !user.password) {
        return null;
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      // Retourner l'utilisateur sans le mot de passe
      const { password: _, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error);
      return null;
    }
  }

  /**
   * Définir ou changer le mot de passe d'un utilisateur
   */
  async setPassword(userId: string, password: string, tenantId: string): Promise<void> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await this.userModel
      .updateOne(
        { _id: userId, tenantId },
        { password: hashedPassword }
      )
      .exec();

    if (result.matchedCount === 0) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
  }

  /**
   * Vérifier si un utilisateur a un mot de passe défini
   */
  async hasPassword(userId: string, tenantId: string): Promise<boolean> {
    const user = await this.userModel
      .findOne({ _id: userId, tenantId })
      .select('+password')
      .exec();
    
    return !!(user && user.password);
  }

  /**
   * Changer le mot de passe avec vérification de l'ancien
   */
  async changePassword(
    userId: string, 
    currentPassword: string, 
    newPassword: string, 
    tenantId: string
  ): Promise<void> {
    const user = await this.userModel
      .findOne({ _id: userId, tenantId })
      .select('+password')
      .exec();

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (!user.password) {
      throw new BadRequestException('Aucun mot de passe défini pour cet utilisateur');
    }

    // Vérifier l'ancien mot de passe
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    // Définir le nouveau mot de passe
    await this.setPassword(userId, newPassword, tenantId);
  }
}
