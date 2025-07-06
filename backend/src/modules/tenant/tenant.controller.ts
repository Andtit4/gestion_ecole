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
  NotFoundException,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantStatus, SubscriptionPlan } from '../../common/interfaces/tenant.interface';
import { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AdminLoginDto, AdminLoginResponse } from './dto/admin-login.dto';

@Controller('tenants')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
    private readonly usersService: UsersService,
  ) {}

  // Validation helper pour MongoDB ObjectId
  private validateObjectId(id: string): void {
    if (!id || id === 'undefined' || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide fourni');
    }
  }

  @Post()
  async create(@Body(ValidationPipe) createTenantDto: CreateTenantDto) {
    return await this.tenantService.create(createTenantDto);
  }

  @Post('auth/login')
  async login(@Body() loginDto: AdminLoginDto): Promise<AdminLoginResponse> {
    try {
      console.log('🔐 Tentative de connexion:', {
        domain: loginDto.domain,
        username: loginDto.username,
      });

      // D'abord, essayer l'authentification traditionnelle (table Tenant)
      const tenant = await this.tenantService.findByDomain(loginDto.domain);

      if (!tenant) {
        console.log('❌ Domaine non trouvé:', loginDto.domain);
        return {
          success: false,
          message: 'Domaine non trouvé',
        };
      }

      console.log('✅ Domaine trouvé:', tenant.name);

      // Vérifier d'abord l'admin traditionnel du tenant
      if (tenant.admin && tenant.admin.username === loginDto.username) {
        console.log('🔍 Vérification admin tenant...');
        const isPasswordValid = await bcrypt.compare(
          loginDto.password,
          tenant.admin.password,
        );

        if (isPasswordValid) {
          console.log('✅ Connexion admin tenant réussie');
          return {
            success: true,
            message: 'Connexion réussie',
            tenant: tenant,
          };
        }
      }

      // Si l'authentification tenant échoue, essayer avec la table User
      console.log('🔍 Recherche dans la table User...');

      // Construire les emails possibles à partir du username et domaine
      const possibleEmails = [
        loginDto.username, // Si c'est déjà un email complet
        `${loginDto.username}@${loginDto.domain}.com`,
        `${loginDto.username}@${loginDto.domain}.fr`,
        `${loginDto.username}@${tenant.domain}.com`,
        `${loginDto.username}@${tenant.domain}.fr`,
      ];

      console.log('📧 Emails à tester:', possibleEmails);

      for (const email of possibleEmails) {
        console.log(`🔍 Test email: ${email}`);
        try {
          const user = await this.usersService.authenticate(
            email,
            loginDto.password,
            (tenant as any)._id.toString(),
          );

          if (user && user.role === 'admin') {
            console.log('✅ Connexion utilisateur admin réussie:', user.email);
            // Mettre à jour la dernière connexion
            await this.usersService.updateLastLogin(
              (user as any)._id.toString(),
              (tenant as any)._id.toString(),
            );

            return {
              success: true,
              message: 'Connexion réussie (utilisateur)',
              tenant: tenant,
              user: user,
            };
          }
        } catch (error) {
          console.log(`❌ Erreur test email ${email}:`, error.message);
        }
      }

      console.log('❌ Aucune authentification réussie');
      return {
        success: false,
        message: 'Identifiants invalides',
      };
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      return {
        success: false,
        message: 'Erreur lors de la connexion',
      };
    }
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: TenantStatus,
    @Query('plan') plan?: SubscriptionPlan,
  ) {
    return await this.tenantService.findAll(page, limit, status, plan);
  }

  @Get('domain/:domain')
  async findByDomain(@Param('domain') domain: string) {
    if (!domain || domain === 'undefined') {
      throw new BadRequestException('Domaine invalide');
    }
    return await this.tenantService.findByDomain(domain);
  }

  @Get('expiring-subscriptions')
  async getExpiringSubscriptions() {
    return await this.tenantService.getExpiringSubscriptions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.validateObjectId(id);
    return await this.tenantService.findOne(id);
  }

  @Get(':id/limits')
  async getSubscriptionLimits(@Param('id') id: string) {
    this.validateObjectId(id);
    return await this.tenantService.getSubscriptionLimits(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTenantDto: UpdateTenantDto,
  ) {
    this.validateObjectId(id);
    return await this.tenantService.update(id, updateTenantDto);
  }

  @Post(':id/reset-admin-password')
  async resetAdminPassword(@Param('id') id: string) {
    this.validateObjectId(id);
    return await this.tenantService.resetAdminPassword(id);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    this.validateObjectId(id);
    return await this.tenantService.activate(id);
  }

  @Patch(':id/suspend')
  async suspend(@Param('id') id: string) {
    this.validateObjectId(id);
    return await this.tenantService.suspend(id);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    this.validateObjectId(id);
    return await this.tenantService.cancel(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.validateObjectId(id);
    return await this.tenantService.remove(id);
  }
} 