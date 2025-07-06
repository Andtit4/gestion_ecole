import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { 
  fetchPlanDetails, 
  fetchUsageStats, 
  fetchBillingHistory,
  upgradePlan as apiUpgradePlan,
  downgradePlan as apiDowngradePlan,
  renewSubscription as apiRenewSubscription,
  cancelSubscription as apiCancelSubscription,
  createSubscription as apiCreateSubscription,
  type PlanDetails, 
  type UsageStats, 
  type BillingHistoryItem,
  type Invoice,
  type CreateSubscriptionRequest
} from '@/services/api'
import { SubscriptionPlan } from '@/types/tenant'

export const useSubscriptionStore = defineStore('subscription', () => {
  const toast = useToast()

  // État
  const plans = ref<Record<SubscriptionPlan, PlanDetails>>({} as Record<SubscriptionPlan, PlanDetails>)
  const usageStats = ref<UsageStats | null>(null)
  const billingHistory = ref<BillingHistoryItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const sortedPlans = computed(() => {
    const planOrder = [SubscriptionPlan.STARTER, SubscriptionPlan.STANDARD, SubscriptionPlan.ENTERPRISE]
    return planOrder.map(plan => ({
      plan,
      details: plans.value[plan]
    })).filter(item => item.details)
  })

  const currentPlan = computed(() => {
    if (!usageStats.value) return null
    return plans.value[usageStats.value.subscription.plan as SubscriptionPlan]
  })

  const isNearLimit = computed(() => {
    if (!usageStats.value) return false
    const { students, teachers } = usageStats.value.usagePercentage
    return students > 80 || teachers > 80
  })

  const isExpiringSoon = computed(() => {
    if (!usageStats.value) return false
    return usageStats.value.daysUntilExpiry <= 30
  })

  // Actions pour récupérer les données
  async function fetchPlanDetailsAction(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const planData = await fetchPlanDetails()
      plans.value = planData as Record<SubscriptionPlan, PlanDetails>
      console.log('Plans chargés:', plans.value)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des plans'
      console.error('Erreur fetchPlanDetails:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchUsageStatsAction(tenantId: string): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const stats = await fetchUsageStats(tenantId)
      usageStats.value = stats
      console.log('Stats d\'utilisation chargées:', stats)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des statistiques'
      console.error('Erreur fetchUsageStats:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchBillingHistoryAction(tenantId: string): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const history = await fetchBillingHistory(tenantId)
      billingHistory.value = history
      console.log('Historique de facturation chargé:', history)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de l\'historique'
      console.error('Erreur fetchBillingHistory:', err)
    } finally {
      loading.value = false
    }
  }

  // Actions pour modifier les abonnements
  async function upgradePlan(tenantId: string, plan: SubscriptionPlan, duration: number = 12): Promise<Invoice | null> {
    loading.value = true
    error.value = null
    
    try {
      const result = await apiUpgradePlan(tenantId, plan, duration)
      
      // Rafraîchir les stats après la mise à niveau
      await fetchUsageStatsAction(tenantId)
      
      toast.success(`Plan mis à niveau vers ${plan} avec succès`)
      return result.invoice
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à niveau'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function downgradePlan(tenantId: string, plan: SubscriptionPlan): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const result = await apiDowngradePlan(tenantId, plan)
      
      toast.warning(result.message)
      toast.info(`Le changement prendra effet le ${new Date(result.changeDate).toLocaleDateString('fr-FR')}`)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la rétrogradation'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function renewSubscription(tenantId: string, duration: number = 12): Promise<Invoice | null> {
    loading.value = true
    error.value = null
    
    try {
      const result = await apiRenewSubscription(tenantId, duration)
      
      // Rafraîchir les stats après renouvellement
      await fetchUsageStatsAction(tenantId)
      
      toast.success('Abonnement renouvelé avec succès')
      return result.invoice
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du renouvellement'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelSubscription(tenantId: string): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      const result = await apiCancelSubscription(tenantId)
      
      // Rafraîchir les stats après annulation
      await fetchUsageStatsAction(tenantId)
      
      toast.warning(result.message)
      toast.info(result.note)
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'annulation'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createSubscription(data: CreateSubscriptionRequest): Promise<Invoice | null> {
    console.log('=== STORE: Début createSubscription ===')
    console.log('Data reçue:', data)
    
    loading.value = true
    error.value = null
    
    try {
      console.log('Appel de apiCreateSubscription...')
      const result = await apiCreateSubscription(data)
      
      console.log('Résultat API:', result)
      
      // Rafraîchir les stats après création
      console.log('Rafraîchissement des stats...')
      await fetchUsageStatsAction(data.tenantId)
      
      toast.success('Abonnement créé avec succès')
      console.log('=== STORE: createSubscription terminée ===')
      return result.invoice
    } catch (err: any) {
      console.error('=== STORE: Erreur createSubscription ===')
      console.error('Erreur:', err)
      error.value = err.message || 'Erreur lors de la création de l\'abonnement'
      toast.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fonctions utilitaires
  function calculatePrice(plan: PlanDetails, duration: number) {
    const subtotal = plan.pricePerMonth * duration
    const tax = subtotal * 0.2 // TVA 20%
    const total = subtotal + tax

    return { subtotal, tax, total }
  }

  function formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  function getPlanBadgeColor(plan: SubscriptionPlan): string {
    const colors = {
      [SubscriptionPlan.BASIC]: 'bg-gray-100 text-gray-800',
      [SubscriptionPlan.STANDARD]: 'bg-blue-100 text-blue-800',
      [SubscriptionPlan.PREMIUM]: 'bg-purple-100 text-purple-800',
      [SubscriptionPlan.ENTERPRISE]: 'bg-orange-100 text-orange-800'
    }
    return colors[plan] || 'bg-gray-100 text-gray-800'
  }

  function getUsageColor(percentage: number): string {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-orange-600'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  function formatDaysUntilExpiry(days: number): string {
    if (days < 0) return 'Expiré'
    if (days === 0) return 'Expire aujourd\'hui'
    if (days === 1) return 'Expire demain'
    if (days <= 7) return `Expire dans ${days} jours`
    if (days <= 30) return `Expire dans ${days} jours`
    return `Expire dans ${Math.ceil(days / 30)} mois`
  }

  // Charger toutes les données pour un tenant
  async function loadTenantSubscriptionData(tenantId: string) {
    await Promise.all([
      fetchPlanDetailsAction(),
      fetchUsageStatsAction(tenantId),
      fetchBillingHistoryAction(tenantId)
    ])
  }

  // Réinitialiser l'état
  function resetState() {
    plans.value = {} as Record<SubscriptionPlan, PlanDetails>
    usageStats.value = null
    billingHistory.value = []
    loading.value = false
    error.value = null
  }

  return {
    // État
    plans,
    usageStats,
    billingHistory,
    loading,
    error,
    
    // Getters
    sortedPlans,
    currentPlan,
    isNearLimit,
    isExpiringSoon,
    
    // Actions
    fetchPlanDetails: fetchPlanDetailsAction,
    fetchUsageStats: fetchUsageStatsAction,
    fetchBillingHistory: fetchBillingHistoryAction,
    upgradePlan,
    downgradePlan,
    renewSubscription,
    cancelSubscription,
    createSubscription,
    loadTenantSubscriptionData,
    
    // Helpers
    calculatePrice,
    formatPrice,
    getPlanBadgeColor,
    getUsageColor,
    formatDaysUntilExpiry,
    resetState
  }
}) 