import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SuperAdminService } from '../super-admin.service';

@Injectable()
export class SuperAdminAuthGuard implements CanActivate {
  constructor(private readonly superAdminService: SuperAdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const token = authorization.replace('Bearer ', '');
      const superAdmin = await this.superAdminService.verifyToken(token);
      
      if (!superAdmin || !superAdmin.isSuperAdmin) {
        throw new UnauthorizedException('Accès refusé - Super admin requis');
      }

      request.superAdmin = superAdmin;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
} 