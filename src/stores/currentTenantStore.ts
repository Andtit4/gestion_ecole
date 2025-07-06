import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CurrentTenant {
  id: string
  name: string
  domain: string
  email: string
}

export const useCurrentTenantStore = defineStore('currentTenant', () => {
  const selectedTenant = ref<CurrentTenant | null>(null)
  const availableTenants = ref<CurrentTenant[]>([])

  // Computed
  const isOnboarded = computed(() => selectedTenant.value !== null)
  const currentTenantId = computed(() => selectedTenant.value?.id || null)
  const currentTenantName = computed(() => selectedTenant.value?.name || '')

  // Actions
  function setSelectedTenant(tenant: CurrentTenant) {
    selectedTenant.value = tenant
    // Sauvegarder dans le localStorage
    localStorage.setItem('selectedTenant', JSON.stringify(tenant))
  }

  function clearSelectedTenant() {
    selectedTenant.value = null
    localStorage.removeItem('selectedTenant')
  }

  function setAvailableTenants(tenants: CurrentTenant[]) {
    availableTenants.value = tenants
  }

  function loadFromStorage() {
    const stored = localStorage.getItem('selectedTenant')
    if (stored) {
      try {
        selectedTenant.value = JSON.parse(stored)
      } catch (error) {
        console.error('Erreur lors du chargement du tenant depuis le storage:', error)
        localStorage.removeItem('selectedTenant')
      }
    }
  }

  function addTenant(tenant: CurrentTenant) {
    if (!availableTenants.value.find(t => t.id === tenant.id)) {
      availableTenants.value.push(tenant)
    }
  }

  return {
    selectedTenant,
    availableTenants,
    isOnboarded,
    currentTenantId,
    currentTenantName,
    setSelectedTenant,
    clearSelectedTenant,
    setAvailableTenants,
    loadFromStorage,
    addTenant
  }
}) 