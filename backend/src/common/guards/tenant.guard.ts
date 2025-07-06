import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TenantService } from '../../modules/tenant/tenant.service';
import { TenantStatus } from '../interfaces/tenant.interface';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extraire le tenant depuis différentes sources
    const tenantDomain = this.extractTenantDomain(request);
    
    if (!tenantDomain) {
      throw new BadRequestException('Domaine tenant requis');
    }

    try {
      // Vérifier que le tenant existe et est actif
      let tenant;
      
      // Essayer d'abord de trouver par domaine
      try {
        tenant = await this.tenantService.findByDomain(tenantDomain);
      } catch (domainError) {
        // Si échec par domaine, essayer par ID (cas où on passe l'ID du tenant)
        try {
          tenant = await this.tenantService.findOne(tenantDomain);
        } catch (idError) {
          throw new NotFoundException('Tenant introuvable');
        }
      }
      
      if (tenant.status !== TenantStatus.ACTIVE) {
        throw new BadRequestException('Tenant non actif');
      }

      // Ajouter le tenant à la requête pour utilisation ultérieure
      request.tenant = tenant;
      request.tenantDomain = tenantDomain;
      
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Tenant introuvable');
      }
      throw error;
    }
  }

  private extractTenantDomain(request: any): string | null {
    // 1. Depuis le sous-domaine
    const host = request.headers.host;
    if (host) {
      const subdomain = host.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        return subdomain.toLowerCase();
      }
    }

    // 2. Depuis l'en-tête X-Tenant-Domain
    const headerTenant = request.headers['x-tenant-domain'];
    if (headerTenant) {
      return headerTenant.toLowerCase();
    }

    // 3. Depuis le paramètre de requête
    const queryTenant = request.query.tenant;
    if (queryTenant) {
      return queryTenant.toLowerCase();
    }

    // 4. Depuis le corps de la requête (pour POST/PUT)
    if (request.body && request.body.tenant) {
      return request.body.tenant.toLowerCase();
    }

    return null;
  }
} 