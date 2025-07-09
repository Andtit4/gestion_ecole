import { get, post, patch, del } from './api'
import type { Tenant, SubscriptionPlan } from '../types/tenant'

export interface TenantListResponse {
  tenants: Tenant[]
  total: number
  page: number
  limit: number
}

export interface GlobalStats {
  totalTenants: number
  activeSubscriptions: number
  expiringSoon: number
  monthlyRevenue: number
}

export interface PlanChangeRequest {
  plan: SubscriptionPlan
  duration?: number
}

export interface SubscriptionExtensionRequest {
  months: number
}

class TenantAdminService {
  
  // Récupérer tous les établissements avec pagination et filtres
  async getAllTenants(
    page: number = 1,
    limit: number = 10,
    filters?: {
      status?: string
      plan?: string
      search?: string
    }
  ): Promise<TenantListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.plan && { plan: filters.plan }),
      ...(filters?.search && { search: filters.search })
    })
    
    const response = await get<TenantListResponse>(`/tenants?${params}`)
    return response.data
  }

  // Récupérer les statistiques globales pour le super admin
  async getGlobalStats(): Promise<GlobalStats> {
    const response = await get<GlobalStats>('/tenants/stats/global')
    return response.data
  }

  // Récupérer les abonnements qui expirent bientôt
  async getExpiringSubscriptions(): Promise<Tenant[]> {
    const response = await get<Tenant[]>('/tenants/expiring-subscriptions')
    return response.data
  }

  // Changer le plan d'un établissement
  async changeTenantPlan(tenantId: string, planRequest: PlanChangeRequest): Promise<Tenant> {
    const response = await patch<Tenant>(`/subscriptions/${tenantId}/upgrade`, planRequest)
    return response.data
  }

  // Prolonger l'abonnement d'un établissement
  async extendSubscription(tenantId: string, extension: SubscriptionExtensionRequest): Promise<Tenant> {
    const response = await patch<Tenant>(`/subscriptions/${tenantId}/extend`, extension)
    return response.data
  }

  // Suspendre un établissement
  async suspendTenant(tenantId: string): Promise<Tenant> {
    const response = await patch<Tenant>(`/tenants/${tenantId}/suspend`)
    return response.data
  }

  // Activer un établissement
  async activateTenant(tenantId: string): Promise<Tenant> {
    const response = await patch<Tenant>(`/tenants/${tenantId}/activate`)
    return response.data
  }

  // Supprimer un établissement
  async deleteTenant(tenantId: string): Promise<void> {
    await del(`/tenants/${tenantId}`)
  }

  // Récupérer les limites d'abonnement d'un établissement
  async getTenantLimits(tenantId: string): Promise<{
    maxStudents: number
    maxTeachers: number
    currentStudents: number
    currentTeachers: number
    usagePercentage: {
      students: number
      teachers: number
    }
  }> {
    const response = await get(`/tenants/${tenantId}/limits`)
    return response.data
  }

  // Réinitialiser le mot de passe admin d'un établissement
  async resetTenantAdminPassword(tenantId: string): Promise<{
    newPassword: string
    message: string
  }> {
    const response = await post(`/tenants/${tenantId}/reset-admin-password`)
    return response.data
  }

  // Récupérer les statistiques détaillées d'un établissement
  async getTenantStats(tenantId: string): Promise<{
    studentsCount: number
    teachersCount: number
    classesCount: number
    subjectsCount: number
    evaluationsCount: number
    lastActivity: string
  }> {
    const response = await get(`/tenants/${tenantId}/stats`)
    return response.data
  }

  // Créer un rapport global des abonnements
  async generateSubscriptionReport(format: 'pdf' | 'csv' | 'excel' = 'pdf'): Promise<{
    downloadUrl: string
    filename: string
  }> {
    const response = await get(`/tenants/reports/subscriptions?format=${format}`)
    return response.data
  }

  // Créer un rapport d'utilisation
  async generateUsageReport(
    startDate: string,
    endDate: string,
    format: 'pdf' | 'csv' | 'excel' = 'pdf'
  ): Promise<{
    downloadUrl: string
    filename: string
  }> {
    const response = await get(`/tenants/reports/usage?startDate=${startDate}&endDate=${endDate}&format=${format}`)
    return response.data
  }

  // Rechercher des établissements
  async searchTenants(query: string): Promise<Tenant[]> {
    const response = await get<Tenant[]>(`/tenants/search?q=${encodeURIComponent(query)}`)
    return response.data
  }

  // Obtenir l'historique des modifications d'un établissement
  async getTenantHistory(tenantId: string): Promise<{
    id: string
    action: string
    details: any
    timestamp: string
    performedBy: string
  }[]> {
    const response = await get(`/tenants/${tenantId}/history`)
    return response.data
  }

  // Envoyer une notification à un établissement
  async sendTenantNotification(tenantId: string, notification: {
    title: string
    message: string
    type: 'info' | 'warning' | 'success' | 'error'
    urgent?: boolean
  }): Promise<void> {
    await post(`/tenants/${tenantId}/notifications`, notification)
  }

  // Obtenir les métriques de revenus
  async getRevenueMetrics(period: 'month' | 'quarter' | 'year' = 'month'): Promise<{
    totalRevenue: number
    recurringRevenue: number
    newSubscriptions: number
    churnRate: number
    averageRevenuePerUser: number
    growth: number
    breakdown: {
      plan: string
      revenue: number
      subscribers: number
    }[]
  }> {
    const response = await get(`/tenants/metrics/revenue?period=${period}`)
    return response.data
    }
  }

// Export singleton instance
export const tenantAdminService = new TenantAdminService()
export default tenantAdminService 