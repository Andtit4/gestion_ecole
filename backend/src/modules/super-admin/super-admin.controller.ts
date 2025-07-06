import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminAuthGuard } from './guards/super-admin-auth.guard';

@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('auth/login')
  async login(@Body() loginDto: { domain: string, username: string, password: string }) {
    // Pour les super admins, le domaine doit être "SUPER_ADMIN"
    if (loginDto.domain !== 'SUPER_ADMIN') {
      return { success: false, message: 'Domaine invalide pour super admin' };
    }

    const result = await this.superAdminService.authenticate(
      loginDto.username,
      loginDto.password
    );
    
    if (!result.success) {
      return { success: false, message: 'Identifiants invalides' };
    }

    return {
      success: true,
      superAdmin: result.superAdmin,
      token: result.token
    };
  }

  @Get('profile')
  @UseGuards(SuperAdminAuthGuard)
  async getProfile(@Request() req: any) {
    return req.superAdmin;
  }

  @Get('permissions')
  @UseGuards(SuperAdminAuthGuard)
  async getPermissions(@Request() req: any) {
    return {
      permissions: req.superAdmin.permissions,
      isSuperAdmin: req.superAdmin.isSuperAdmin
    };
  }

  @Post('create')
  async createSuperAdmin(@Body() createDto: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    const result = await this.superAdminService.createSuperAdmin(createDto);
    
    if (!result.success) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      message: 'Super admin créé avec succès',
      superAdmin: result.superAdmin
    };
  }
} 