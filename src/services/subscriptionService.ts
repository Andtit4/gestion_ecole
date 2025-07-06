import { get, post, patch } from './api'
import { SubscriptionPlan } from '../types/tenant'
import type { 
  PlanDetails, 
  UsageStats 
} from '../types/tenant'

export interface UpgradeRequest {
  plan: SubscriptionPlan
  duration?: number
}

export interface BillingHistoryItem {
  invoiceNumber: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  plan: string
}

export interface Invoice {
  invoiceNumber: string
  date: string
  plan: string
  duration: number
  unitPrice: number
  subtotal: number
  tax: number
  total: number
  currency: string
}

class SubscriptionService {

  // Obtenir les détails de tous les plans
  async getPlanDetails(): Promise<Record<SubscriptionPlan, PlanDetails>> {
    const response = await get<Record<SubscriptionPlan, PlanDetails>>('/subscriptions/plans')
    return response.data
  }

  // Obtenir les statistiques d'utilisation d'un tenant
  async getUsageStats(tenantId: string): Promise<UsageStats> {
    const response = await get<UsageStats>(`/subscriptions/${tenantId}/usage`)
    return response.data
  }

  // Obtenir l'historique de facturation
  async getBillingHistory(tenantId: string): Promise<BillingHistoryItem[]> {
    const response = await get<BillingHistoryItem[]>(`/subscriptions/${tenantId}/billing-history`)
    return response.data
  }

  // Mettre à niveau l'abonnement
  async upgradePlan(tenantId: string, upgradeData: UpgradeRequest): Promise<{
    tenant: any
    invoice: Invoice
  }> {
    const response = await post<{
      tenant: any
      invoice: Invoice
    }>(`/subscriptions/${tenantId}/upgrade`, upgradeData)
    return response.data
  }

  // Rétrograder l'abonnement
  async downgradePlan(tenantId: string, plan: SubscriptionPlan): Promise<{
    message: string
    changeDate: string
    newPlan: PlanDetails
    currentPlan: SubscriptionPlan
  }> {
    const response = await post<{
      message: string
      changeDate: string
      newPlan: PlanDetails
      currentPlan: SubscriptionPlan
    }>(`/subscriptions/${tenantId}/downgrade`, { plan })
    return response.data
  }

  // Renouveler l'abonnement
  async renewSubscription(tenantId: string, duration: number = 12): Promise<{
    tenant: any
    invoice: Invoice
  }> {
    const response = await post<{
      tenant: any
      invoice: Invoice
    }>(`/subscriptions/${tenantId}/renew`, { duration })
    return response.data
  }

  // Annuler l'abonnement
  async cancelSubscription(tenantId: string): Promise<{
    message: string
    endDate: string
    note: string
  }> {
    const response = await patch<{
      message: string
      endDate: string
      note: string
    }>(`/subscriptions/${tenantId}/cancel`)
    return response.data
  }

  // Calculer le prix d'un plan sur une durée
  calculateTotalPrice(plan: PlanDetails, duration: number): {
    subtotal: number
    tax: number
    total: number
  } {
    const subtotal = plan.pricePerMonth * duration
    const tax = subtotal * 0.2 // TVA 20%
    const total = subtotal + tax

    return { subtotal, tax, total }
  }

  // Formater le prix en franc CFA
  formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount)
  }

  // Obtenir la couleur du badge selon le plan
  getPlanBadgeColor(plan: SubscriptionPlan): string {
    switch (plan) {
      case SubscriptionPlan.BASIC:
        return 'bg-gray-100 text-gray-800'
      case SubscriptionPlan.STANDARD:
        return 'bg-blue-100 text-blue-800'
      case SubscriptionPlan.PREMIUM:
        return 'bg-purple-100 text-purple-800'
      case SubscriptionPlan.ENTERPRISE:
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Obtenir la couleur selon le statut d'utilisation
  getUsageColor(percentage: number): string {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  // Formatter les jours restants
  formatDaysUntilExpiry(days: number): string {
    if (days < 0) return 'Expiré'
    if (days === 0) return 'Expire aujourd\'hui'
    if (days === 1) return 'Expire demain'
    if (days < 30) return `Expire dans ${days} jours`
    
    const months = Math.floor(days / 30)
    if (months === 1) return 'Expire dans 1 mois'
    return `Expire dans ${months} mois`
  }

}

export const subscriptionService = new SubscriptionService()
export default subscriptionService 