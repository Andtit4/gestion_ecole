import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockTenants, mockTenantService } from '@/data/mockData'
import type { Tenant, TenantStatus, SubscriptionPlan } from '@/types/tenant'

export const useSimpleTenantStore = defineStore('simpleTenant', () => {
  // État
  const tenants = ref<Tenant[]>([...mockTenants])
  const currentTenant = ref<Tenant | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeTenants = computed(() => 
    tenants.value.filter(t => t.status === 'ACTIVE')
  )

  const pendingTenants = computed(() => 
    tenants.value.filter(t => t.status === 'PENDING')
  )

  const totalTenants = computed(() => tenants.value.length)

  // Actions simplifiées
  function getTenant(id: string): Tenant | undefined {
    return tenants.value.find(t => t.id === id)
  }

  function setCurrentTenant(tenant: Tenant | null) {
    currentTenant.value = tenant
  }

  async function loadTenants() {
    loading.value = true
    try {
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 500))
      tenants.value = [...mockTenants]
    } catch (err) {
      console.error('Erreur de chargement:', err)
    } finally {
      loading.value = false
    }
  }

  // Statistiques
  const statistics = computed(() => ({
    total: tenants.value.length,
    active: activeTenants.value.length,
    pending: pendingTenants.value.length,
    suspended: tenants.value.filter(t => t.status === 'SUSPENDED').length,
    cancelled: tenants.value.filter(t => t.status === 'CANCELLED').length,
  }))

  const planDistribution = computed(() => {
    const distribution = {
      BASIC: 0,
      STANDARD: 0,
      PREMIUM: 0,
      ENTERPRISE: 0
    }
    
    tenants.value.forEach(tenant => {
      distribution[tenant.subscription.plan]++
    })
    
    return distribution
  })

  return {
    // État
    tenants,
    currentTenant,
    loading,
    error,
    
    // Getters
    activeTenants,
    pendingTenants,
    totalTenants,
    statistics,
    planDistribution,
    
    // Actions
    getTenant,
    setCurrentTenant,
    loadTenants,
  }
}) 