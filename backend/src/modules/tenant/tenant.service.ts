import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant, TenantDocument } from './schemas/tenant.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import {
  TenantStatus,
  SubscriptionPlan,
} from '../../common/interfaces/tenant.interface';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
  ) {}

  // Validation helper pour MongoDB ObjectId
  private validateObjectId(id: string): void {
    if (
      !id ||
      id === 'undefined' ||
      id === 'null' ||
      !Types.ObjectId.isValid(id)
    ) {
      throw new BadRequestException('ID invalide fourni');
    }
  }

  async create(createTenantDto: CreateTenantDto): Promise<{
    tenant: TenantDocument;
    adminCredentials: { username: string; password: string };
  }> {
    // Vérifier l'unicité du domaine et email
    const existingTenant = await this.tenantModel.findOne({
      $or: [
        { domain: createTenantDto.domain.toLowerCase() },
        { email: createTenantDto.email.toLowerCase() },
        { 'admin.email': createTenantDto.admin.email.toLowerCase() },
      ],
    });

    if (existingTenant) {
      if (existingTenant.domain === createTenantDto.domain.toLowerCase()) {
        throw new ConflictException('Ce domaine est déjà utilisé');
      }
      if (existingTenant.email === createTenantDto.email.toLowerCase()) {
        throw new ConflictException('Cette adresse email est déjà utilisée');
      }
      if (
        existingTenant.admin &&
        existingTenant.admin.email === createTenantDto.admin.email.toLowerCase()
      ) {
        throw new ConflictException(
          'Cette adresse email administrateur est déjà utilisée',
        );
      }
    }

    // Générer les identifiants administrateur
    const adminCredentials = await this.generateAdminCredentials(
      createTenantDto.domain,
      createTenantDto.admin.firstName,
      createTenantDto.admin.lastName,
    );

    // Définir les fonctionnalités par plan
    const planFeatures = this.getPlanFeatures(
      createTenantDto.subscription.plan,
    );

    const tenantData = {
      ...createTenantDto,
      domain: createTenantDto.domain.toLowerCase(),
      email: createTenantDto.email.toLowerCase(),
      status: TenantStatus.ACTIVE,
      subscription: {
        ...createTenantDto.subscription,
        features: planFeatures,
        startDate: new Date(createTenantDto.subscription.startDate),
        endDate: new Date(createTenantDto.subscription.endDate),
      },
      admin: {
        ...createTenantDto.admin,
        email: createTenantDto.admin.email.toLowerCase(),
        username: adminCredentials.username,
        password: adminCredentials.hashedPassword,
        isActive: true,
      },
    };

    const createdTenant = new this.tenantModel(tenantData);
    const savedTenant = await createdTenant.save();

    return {
      tenant: savedTenant,
      adminCredentials: {
        username: adminCredentials.username,
        password: adminCredentials.plainPassword,
      },
    };
  }

  private async generateAdminCredentials(
    domain: string,
    firstName: string,
    lastName: string,
  ): Promise<{
    username: string;
    plainPassword: string;
    hashedPassword: string;
  }> {
    // Générer un nom d'utilisateur unique basé sur le domaine et le nom
    const baseUsername = `${domain}-admin`;
    let username = baseUsername;
    let counter = 1;

    // Vérifier l'unicité du nom d'utilisateur
    while (await this.tenantModel.findOne({ 'admin.username': username })) {
      username = `${baseUsername}-${counter}`;
      counter++;
    }

    // Générer un mot de passe sécurisé
    const plainPassword = this.generateSecurePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    return {
      username,
      plainPassword,
      hashedPassword,
    };
  }

  private generateSecurePassword(): string {
    // Générer un mot de passe de 12 caractères avec majuscules, minuscules, chiffres et symboles
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';

    // Assurer au moins un caractère de chaque type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Compléter avec des caractères aléatoires
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Mélanger le mot de passe
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  // Nouvelle méthode pour l'authentification admin
  async authenticateAdmin(
    domain: string,
    username: string,
    password: string,
  ): Promise<TenantDocument | null> {
    const tenant = await this.tenantModel.findOne({
      domain: domain.toLowerCase(),
      'admin.username': username,
      'admin.isActive': true,
      status: TenantStatus.ACTIVE,
    });

    if (!tenant) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      tenant.admin.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    // Mettre à jour la dernière connexion
    tenant.admin.lastLogin = new Date();
    await tenant.save();

    return tenant;
  }

  // Méthode pour réinitialiser le mot de passe admin
  async resetAdminPassword(
    tenantId: string,
  ): Promise<{ username: string; password: string }> {
    const tenant = await this.findOne(tenantId);

    const newPassword = this.generateSecurePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    tenant.admin.password = hashedPassword;
    await tenant.save();

    return {
      username: tenant.admin.username,
      password: newPassword,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: TenantStatus,
    plan?: SubscriptionPlan,
  ): Promise<{ tenants: TenantDocument[]; total: number; pages: number }> {
    const filter: any = {};

    if (status) filter.status = status;
    if (plan) filter['subscription.plan'] = plan;

    const skip = (page - 1) * limit;

    const [tenants, total] = await Promise.all([
      this.tenantModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.tenantModel.countDocuments(filter),
    ]);

    return {
      tenants,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<TenantDocument> {
    this.validateObjectId(id);

    try {
      const tenant = await this.tenantModel.findById(id);
      if (!tenant) {
        throw new NotFoundException('Tenant non trouvé');
      }
      return tenant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la recherche du tenant');
    }
  }

  async findByDomain(domain: string): Promise<TenantDocument> {
    const tenant = await this.tenantModel.findOne({
      domain: domain.toLowerCase(),
    });
    if (!tenant) {
      throw new NotFoundException('Tenant non trouvé');
    }
    return tenant;
  }

  async update(
    id: string,
    updateTenantDto: UpdateTenantDto,
  ): Promise<TenantDocument> {
    this.validateObjectId(id);

    try {
      // Vérifier l'unicité si domaine ou email sont modifiés
      if (updateTenantDto.domain || updateTenantDto.email) {
        const filter: any = { _id: { $ne: id } };

        if (updateTenantDto.domain) {
          filter.domain = updateTenantDto.domain.toLowerCase();
        }
        if (updateTenantDto.email) {
          filter.email = updateTenantDto.email.toLowerCase();
        }

        const existingTenant = await this.tenantModel.findOne(filter);
        if (existingTenant) {
          throw new ConflictException('Domaine ou email déjà utilisé');
        }
      }

      const updateData = { ...updateTenantDto };

      // Normaliser le domaine et l'email si fournis
      if (updateData.domain) {
        updateData.domain = updateData.domain.toLowerCase();
      }
      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase();
      }

      // Mettre à jour les fonctionnalités si le plan change
      if (updateData.subscription?.plan) {
        const planFeatures = this.getPlanFeatures(updateData.subscription.plan);
        updateData.subscription.features = planFeatures;
      }

      const updatedTenant = await this.tenantModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );

      if (!updatedTenant) {
        throw new NotFoundException('Tenant non trouvé');
      }

      return updatedTenant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la mise à jour du tenant');
    }
  }

  async remove(id: string): Promise<void> {
    this.validateObjectId(id);

    try {
      const result = await this.tenantModel.findByIdAndDelete(id);
      if (!result) {
        throw new NotFoundException('Tenant non trouvé');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la suppression du tenant');
    }
  }

  async activate(id: string): Promise<TenantDocument> {
    return await this.updateStatus(id, TenantStatus.ACTIVE);
  }

  async suspend(id: string): Promise<TenantDocument> {
    return await this.updateStatus(id, TenantStatus.SUSPENDED);
  }

  async cancel(id: string): Promise<TenantDocument> {
    return await this.updateStatus(id, TenantStatus.CANCELLED);
  }

  private async updateStatus(
    id: string,
    status: TenantStatus,
  ): Promise<TenantDocument> {
    this.validateObjectId(id);

    try {
      const tenant = await this.tenantModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );

      if (!tenant) {
        throw new NotFoundException('Tenant non trouvé');
      }

      return tenant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la mise à jour du statut');
    }
  }

  private getPlanFeatures(plan: SubscriptionPlan): string[] {
    const baseFeatures = [
      'gestion_eleves',
      'gestion_notes',
      'bulletins_basiques',
      'emploi_temps',
    ];

    switch (plan) {
      case SubscriptionPlan.STARTER:
        return baseFeatures;

      case SubscriptionPlan.STANDARD:
        return [
          ...baseFeatures,
          'gestion_absences',
          'communication_parents',
          'rapports_avances',
          'backup_auto',
        ];

      case SubscriptionPlan.ENTERPRISE:
        return [
          ...baseFeatures,
          'gestion_absences',
          'communication_parents',
          'rapports_avances',
          'backup_auto',
          'api_access',
          'integration_externe',
          'support_prioritaire',
          'personnalisation_avancee',
          'multi_campus',
          'sso_integration',
          'audit_logs',
          'support_24_7',
        ];

      default:
        return baseFeatures;
    }
  }

  async getSubscriptionLimits(tenantId: string) {
    this.validateObjectId(tenantId);

    const tenant = await this.findOne(tenantId);
    return {
      maxStudents: tenant.subscription.maxStudents,
      maxTeachers: tenant.subscription.maxTeachers,
      features: tenant.subscription.features,
    };
  }

  async checkSubscriptionExpiry(): Promise<TenantDocument[]> {
    const now = new Date();
    return await this.tenantModel
      .find({
        'subscription.endDate': { $lte: now },
        status: TenantStatus.ACTIVE,
      })
      .exec();
  }

  async getExpiringSubscriptions(days: number = 30): Promise<TenantDocument[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.tenantModel
      .find({
        'subscription.endDate': { $lte: futureDate },
        status: TenantStatus.ACTIVE,
      })
      .sort({ 'subscription.endDate': 1 })
      .exec();
  }

  async getDashboardStats() {
    const tenants = await this.tenantModel.find().exec();

    const total = tenants.length;
    const active = tenants.filter(
      (t) => t.status === TenantStatus.ACTIVE,
    ).length;
    const pending = tenants.filter(
      (t) => t.status === TenantStatus.PENDING,
    ).length;
    const suspended = tenants.filter(
      (t) => t.status === TenantStatus.SUSPENDED,
    ).length;
    const cancelled = tenants.filter(
      (t) => t.status === TenantStatus.CANCELLED,
    ).length;

    return {
      totalTenants: total,
      activeTenants: active,
      pendingTenants: pending,
      trialTenants: suspended, // Utilise suspended pour trial pour compatibilité frontend
      suspendedTenants: suspended,
      cancelledTenants: cancelled,
    };
  }

  async getTenantStats(tenantId: string) {
    this.validateObjectId(tenantId);

    // Récupérer les informations du tenant
    const tenant = await this.findOne(tenantId);

    // Pour l'instant, retourner des données de base avec les vraies limites du tenant
    // Les compteurs seront implémentés via des appels aux autres services

    // Calculer les jours restants jusqu'à expiration
    const daysUntilExpiry = tenant.subscription?.endDate ? 
      Math.max(0, Math.ceil((new Date(tenant.subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 
      365;

    return {
      tenantId,
      tenantName: tenant.name,
      tenantStatus: tenant.status,
      maxStudents: tenant.subscription?.maxStudents || 500,
      maxTeachers: tenant.subscription?.maxTeachers || 20,
      daysUntilExpiry,
      subscriptionPlan: tenant.subscription?.plan || 'basic',
      subscriptionStatus: 'active'
    };
  }
}
