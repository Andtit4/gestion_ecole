import api from './api';

export interface SubscriptionOverview {
  totalEstablishments: number;
  activeSubscriptions: number;
  expiringSoon: number;
  monthlyRevenue: number;
  lastUpdated: Date;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  domain: string;
  adminEmail: string;
  plan: string;
  status: 'active' | 'expired' | 'cancelled' | 'expiring_soon';
  monthlyPrice: number;
  endDate: Date;
  daysRemaining: number;
  createdAt: Date;
}

export interface SubscriptionListResponse {
  data: SubscriptionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SubscriptionStats {
  planDistribution: Array<{
    _id: string;
    count: number;
    revenue: number;
  }>;
  statusDistribution: Array<{
    _id: string;
    count: number;
  }>;
  totalRevenue: number;
}

export interface RevenueStats {
  period: 'monthly' | 'yearly';
  data: Array<{
    period: string;
    revenue: number;
    subscriptions: number;
  }>;
}

export interface BulkUpdateResult {
  processed: number;
  successful: number;
  failed: number;
  results: Array<{
    tenantId: string;
    success: boolean;
    result?: any;
    error?: string;
  }>;
}

export interface ExpiringNotification {
  count: number;
  tenants: Array<{
    id: string;
    name: string;
    email: string;
    endDate: Date;
    daysRemaining: number;
  }>;
}

export interface ExportData {
  format: 'csv' | 'xlsx';
  data: any[];
  count: number;
  generatedAt: Date;
}

class SubscriptionAdminService {
  // Vue d'ensemble des abonnements
  async getSubscriptionOverview(): Promise<SubscriptionOverview> {
    try {
      const response = await api.get('/subscriptions/admin/overview');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la vue d\'ensemble:', error);
      throw error;
    }
  }

  // Liste paginée des abonnements avec filtres
  async getAllSubscriptions(
    page: number = 1,
    limit: number = 10,
    filters: {
      plan?: string;
      status?: 'active' | 'expired' | 'cancelled' | 'expiring_soon';
      search?: string;
    } = {}
  ): Promise<SubscriptionListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await api.get(`/subscriptions/admin/list?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements:', error);
      throw error;
    }
  }

  // Statistiques des abonnements
  async getSubscriptionStats(): Promise<SubscriptionStats> {
    try {
      const response = await api.get('/subscriptions/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Statistiques de revenus
  async getRevenueStats(period: 'monthly' | 'yearly' = 'monthly'): Promise<RevenueStats> {
    try {
      const response = await api.get(`/subscriptions/admin/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des revenus:', error);
      throw error;
    }
  }

  // Mise à jour en masse des abonnements
  async bulkUpdateSubscriptions(data: {
    tenantIds: string[];
    action: 'change_plan' | 'extend' | 'cancel' | 'reactivate';
    plan?: string;
    duration?: number;
  }): Promise<BulkUpdateResult> {
    try {
      const response = await api.post('/subscriptions/admin/bulk-update', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour en masse:', error);
      throw error;
    }
  }

  // Notification des abonnements expirant
  async notifyExpiringSubscriptions(): Promise<ExpiringNotification> {
    try {
      const response = await api.post('/subscriptions/admin/notify-expiring');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la notification:', error);
      throw error;
    }
  }

  // Export des données d'abonnement
  async exportSubscriptionData(format: 'csv' | 'xlsx' = 'csv'): Promise<ExportData> {
    try {
      const response = await api.get(`/subscriptions/admin/export?format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      throw error;
    }
  }

  // Actions individuelles sur les abonnements
  async changeSubscriptionPlan(tenantId: string, plan: string, duration: number = 12) {
    try {
      const response = await api.post(`/subscriptions/${tenantId}/upgrade`, {
        plan,
        duration,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du changement de plan:', error);
      throw error;
    }
  }

  async extendSubscription(tenantId: string, duration: number = 12) {
    try {
      const response = await api.post(`/subscriptions/${tenantId}/renew`, {
        duration,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du renouvellement:', error);
      throw error;
    }
  }

  async cancelSubscription(tenantId: string) {
    try {
      const response = await api.patch(`/subscriptions/${tenantId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      throw error;
    }
  }

  // Formatage des données pour l'affichage
  formatSubscriptionStatus(status: string): { text: string; color: string } {
    const statusMap = {
      active: { text: 'Actif', color: 'green' },
      expired: { text: 'Expiré', color: 'red' },
      cancelled: { text: 'Annulé', color: 'gray' },
      expiring_soon: { text: 'Expire bientôt', color: 'orange' },
    };
    return statusMap[status as keyof typeof statusMap] || { text: status, color: 'gray' };
  }

  formatPlan(plan: string): string {
    const planMap = {
      starter: 'Starter',
      standard: 'Standard',
      enterprise: 'Enterprise',
      custom: 'Personnalisé',
    };
    return planMap[plan as keyof typeof planMap] || plan;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  }

  calculateDaysRemaining(endDate: Date | string): number {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
}

export default new SubscriptionAdminService(); 