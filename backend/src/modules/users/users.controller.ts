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
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './schemas/user.schema';
import { Types } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private extractTenantId(headers: any): string {
    const tenantId = headers['x-tenant-id'] || headers['X-Tenant-Id'];
    if (!tenantId) {
      throw new BadRequestException('Tenant ID manquant dans les headers');
    }
    return tenantId;
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID invalide');
    }
  }

  @Post()
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Headers() headers: { [key: string]: string },
  ) {
    const tenantId = headers['x-tenant-id'] || headers['X-Tenant-Id'];
    if (!tenantId) {
      throw new BadRequestException('Tenant ID manquant dans les headers');
    }
    return await this.usersService.create(createUserDto, tenantId);
  }

  @Get()
  async findAll(
    @Headers() headers: { [key: string]: string },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('role') role?: UserRole,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const tenantId = this.extractTenantId(headers);
    const filters = { role, status, search };
    return await this.usersService.findAll(tenantId, page, limit, filters);
  }

  @Get('stats')
  async getStats(@Headers() headers: { [key: string]: string }) {
    const tenantId = this.extractTenantId(headers);
    return await this.usersService.getUserStats(tenantId);
  }

  @Get('roles/permissions')
  async getRolePermissions() {
    return await this.usersService.getRolePermissions();
  }

  @Get('by-role/:role')
  async getUsersByRole(
    @Param('role') role: UserRole,
    @Headers() headers: { [key: string]: string },
  ) {
    const tenantId = this.extractTenantId(headers);
    return await this.usersService.findByRole(role, tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Headers() headers: { [key: string]: string }) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return await this.usersService.findOne(id, tenantId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Headers() headers: { [key: string]: string },
  ) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return await this.usersService.update(id, updateUserDto, tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Headers() headers: { [key: string]: string }) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    return await this.usersService.remove(id, tenantId);
  }

  @Patch(':id/last-login')
  async updateLastLogin(@Param('id') id: string, @Headers() headers: { [key: string]: string }) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);
    await this.usersService.updateLastLogin(id, tenantId);
    return { message: 'Dernière connexion mise à jour' };
  }

  @Post('quick-create')
  async quickCreateUser(
    @Body()
    createDto: {
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      tenantId: string;
      password?: string;
      phone?: string;
      department?: string;
    },
  ) {
    return await this.usersService.quickCreateUser(createDto);
  }

  @Post('bulk-create')
  async bulkCreateUsers(
    @Body()
    bulkDto: {
      users: Array<{
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        phone?: string;
        department?: string;
      }>;
      tenantId: string;
      defaultPassword?: string;
    },
  ) {
    return await this.usersService.bulkCreateUsers(
      bulkDto.users,
      bulkDto.tenantId,
      bulkDto.defaultPassword,
    );
  }

  // Endpoints d'authentification et gestion des mots de passe

  @Post('auth/login')
  async authenticate(@Body() loginDto: { email: string; password: string; tenantId: string }) {
    const user = await this.usersService.authenticate(
      loginDto.email,
      loginDto.password,
      loginDto.tenantId,
    );

    if (!user) {
      return {
        success: false,
        message: 'Email ou mot de passe incorrect',
      };
    }

    // Mettre à jour la dernière connexion
    await this.usersService.updateLastLogin((user as any)._id.toString(), loginDto.tenantId);

    return {
      success: true,
      user: user,
      message: 'Connexion réussie',
    };
  }

  @Post('students/login')
  async studentLogin(@Body() loginDto: { email: string; password: string; tenantId: string }) {
    const user = await this.usersService.authenticate(
      loginDto.email,
      loginDto.password,
      loginDto.tenantId,
    );
    if (!user || user.role !== UserRole.STUDENT) {
      throw new BadRequestException('Accès refusé ou rôle non autorisé');
    }
    await this.usersService.updateLastLogin(user.email.toString(), loginDto.tenantId);
    return { success: true, user: user, message: 'Connexion étudiante réussie' };
  }

  @Post(':id/set-password')
  async setPassword(
    @Param('id') id: string,
    @Body() passwordDto: { password: string },
    @Headers() headers: { [key: string]: string },
  ) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);

    await this.usersService.setPassword(id, passwordDto.password, tenantId);

    return {
      success: true,
      message: 'Mot de passe défini avec succès',
    };
  }

  @Post(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body()
    passwordDto: {
      currentPassword: string;
      newPassword: string;
    },
    @Headers() headers: { [key: string]: string },
  ) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);

    await this.usersService.changePassword(
      id,
      passwordDto.currentPassword,
      passwordDto.newPassword,
      tenantId,
    );

    return {
      success: true,
      message: 'Mot de passe modifié avec succès',
    };
  }

  @Get(':id/has-password')
  async hasPassword(@Param('id') id: string, @Headers() headers: { [key: string]: string }) {
    this.validateObjectId(id);
    const tenantId = this.extractTenantId(headers);

    const hasPassword = await this.usersService.hasPassword(id, tenantId);

    return {
      hasPassword: hasPassword,
    };
  }

  @Get('check-exists')
  async checkUserExists(@Query('email') email: string, @Headers() headers: any) {
    const tenantId = this.extractTenantId(headers);
    const user = await this.usersService.findOneByEmail(email, tenantId);

    console.log(user);

    return {
      exists: !!user,
      userId: user?.email,
      role: user?.role,
    };
  }

  // @Post(':id/reset-password')
  /*  async resetUserPassword(
    @Param('id') id: string,
    @Body() body: { newPassword?: string },
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    const result = await this.usersService.resetPassword(id, tenantId, body.newPassword);
    
    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      newPassword: result.newPassword
    };
  } */

  /* @Post(':id/generate-password')
  async generateNewPassword(
    @Param('id') id: string,
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    const result = await this.usersService.generateNewPassword(id, tenantId);
    
    return {
      success: true,
      message: 'Nouveau mot de passe généré avec succès',
      newPassword: result.newPassword
    };
  } */

  @Post('reset-password-by-email')
  async resetPasswordByEmail(
    @Body() body: { email: string; newPassword?: string },
    @Headers() headers: any,
  ) {
    const tenantId = this.extractTenantId(headers);
    const result = await this.usersService.resetPasswordByEmail(
      body.email,
      tenantId,
      body.newPassword,
    );

    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      newPassword: result.password,
    };
  }
}
