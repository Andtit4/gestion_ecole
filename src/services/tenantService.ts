import { get, post, patch, del } from './api'
import type { 
  Tenant, 
  CreateTenantDto,
  CreateTenantResponse,
  AdminLoginDto,
  AdminLoginResponse,
  TenantStatus, 
  SubscriptionPlan 
} from '../types/tenant'

export interface TenantListResponse {
  tenants: Tenant[]
  total: number
  pages: number
}

export interface TenantFilters {
  page?: number
  limit?: number
  status?: TenantStatus
  plan?: SubscriptionPlan
}

class TenantService {
  
  // Créer un nouveau tenant avec admin
  async createTenant(tenantData: CreateTenantDto): Promise<CreateTenantResponse> {
    const response = await post<CreateTenantResponse>('/tenants', tenantData)
    return response.data
  }

  // Authentification admin
  async loginAdmin(loginData: AdminLoginDto): Promise<AdminLoginResponse> {
    const response = await post<AdminLoginResponse>('/tenants/auth/login', loginData)
    return response.data
  }

  // Réinitialiser le mot de passe admin
  async resetAdminPassword(tenantId: string): Promise<{ username: string, password: string }> {
    const response = await post<{ username: string, password: string }>(`/tenants/${tenantId}/reset-admin-password`)
    return response.data
  }

  // Obtenir tous les tenants avec filtres
  async getTenants(filters: TenantFilters = {}): Promise<TenantListResponse> {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.status) params.append('status', filters.status)
    if (filters.plan) params.append('plan', filters.plan)

    const response = await get<TenantListResponse>(`/tenants?${params.toString()}`)
    return response.data
  }

  // Obtenir un tenant par ID
  async getTenant(id: string): Promise<Tenant> {
    const response = await get<Tenant>(`/tenants/${id}`)
    return response.data
  }

  // Obtenir un tenant par domaine
  async getTenantByDomain(domain: string): Promise<Tenant> {
    const response = await get<Tenant>(`/tenants/domain/${domain}`)
    return response.data
  }

  // Mettre à jour un tenant
  async updateTenant(id: string, updateData: Partial<{
    name?: string;
    domain?: string;
    email?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    settings?: {
      schoolType?: 'primary' | 'secondary' | 'university' | 'mixed';
      academicYearStart?: string;
      academicYearEnd?: string;
      gradeSystem?: 'numeric' | 'letter' | 'points';
      maxGrade?: number;
      language?: string;
      timezone?: string;
      currency?: string;
      logoUrl?: string;
      theme?: {
        primaryColor: string;
        secondaryColor: string;
      };
    };
    status?: TenantStatus;
    subscription?: any;
  }>): Promise<Tenant> {
    const response = await patch<Tenant>(`/tenants/${id}`, updateData)
    return response.data
  }

  // Activer un tenant
  async activateTenant(id: string): Promise<Tenant> {
    const response = await patch<Tenant>(`/tenants/${id}/activate`)
    return response.data
  }

  // Suspendre un tenant
  async suspendTenant(id: string): Promise<Tenant> {
    const response = await patch<Tenant>(`/tenants/${id}/suspend`)
    return response.data
  }

  // Annuler un tenant
  async cancelTenant(id: string): Promise<Tenant> {
    const response = await patch<Tenant>(`/tenants/${id}/cancel`)
    return response.data
  }

  // Supprimer un tenant
  async deleteTenant(id: string): Promise<void> {
    await del(`/tenants/${id}`)
  }

  // Obtenir les tenants avec abonnement expirant
  async getExpiringSubscriptions(): Promise<Tenant[]> {
    const response = await get<Tenant[]>('/tenants/expiring-subscriptions')
    return response.data
  }

  // Obtenir les limites d'abonnement
  async getSubscriptionLimits(id: string): Promise<any> {
    const response = await get(`/tenants/${id}/limits`)
    return response.data
  }

  // Vérifier la disponibilité d'un domaine
  async checkDomainAvailability(domain: string): Promise<boolean> {
    try {
      await this.getTenantByDomain(domain)
      return false // Domaine déjà pris
    } catch (error) {
      return true // Domaine disponible
    }
  }

  // Vérifier la disponibilité d'un email
  async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const tenants = await this.getTenants({ limit: 1 })
      const existingTenant = tenants.tenants.find(t => 
        t.email.toLowerCase() === email.toLowerCase() || 
        t.admin.email.toLowerCase() === email.toLowerCase()
      )
      return !existingTenant
    } catch (error) {
      return true
    }
  }

}

export const tenantService = new TenantService()
export default tenantService 