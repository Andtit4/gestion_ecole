import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { fetchTenants, fetchTenant, updateTenantStatus, deleteTenant as deleteTenantAPI, updateTenant as updateTenantAPI } from '@/services/api'
import type { Tenant, CreateTenantDto, TenantStatus } from '../types/tenant'
import type { TenantListItem } from '@/services/api'

interface TenantFilters {
  page?: number
  limit?: number
  status?: TenantStatus
  plan?: string
  search?: string
}

export const useTenantStore = defineStore('tenant', () => {
  const toast = useToast()

  // État
  const tenants = ref<TenantListItem[]>([])
  const currentTenant = ref<Tenant | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    current: 1,
    total: 0,
    pages: 0,
    limit: 10
  })

  // Getters
  const activeTenants = computed(() => 
    tenants.value.filter(t => t.status === 'ACTIVE')
  )

  const pendingTenants = computed(() => 
    tenants.value.filter(t => t.status === 'PENDING')
  )

  const isCurrentTenantActive = computed(() => 
    currentTenant.value?.status === 'active'
  )

  // Actions

  // Charger la liste des tenants
  async function fetchTenantsData(filters: TenantFilters = {}) {
    loading.value = true
    error.value = null
    
    try {
      const tenantsData = await fetchTenants()
      tenants.value = tenantsData
      pagination.value.total = tenantsData.length
      pagination.value.pages = Math.ceil(tenantsData.length / pagination.value.limit)
      
    } catch (err: any) {
      error.value = err.message
      toast.error('Erreur lors du chargement des établissements')
    } finally {
      loading.value = false
    }
  }

  // Créer un nouveau tenant
  async function createTenant(tenantData: CreateTenantDto): Promise<Tenant | null> {
    loading.value = true
    error.value = null
    
    try {
      // Appeler l'API de création
      const response = await fetch('http://localhost:3000/api/v1/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tenantData),
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('Tenant créé avec succès:', result)
      
      toast.success('Établissement créé avec succès')
      await fetchTenantsData() // Recharger la liste
      return result.tenant
    } catch (err: any) {
      console.error('Erreur lors de la création du tenant:', err)
      error.value = err.message
      toast.error(`Erreur lors de la création: ${err.message}`)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour un tenant
  async function updateTenant(id: string, updateData: Partial<{
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
  }>): Promise<Tenant | null> {
    loading.value = true
    error.value = null
    
    try {
      const updatedTenant = await updateTenantAPI(id, updateData)
      
      const index = tenants.value.findIndex(t => t.id === id)
      if (index !== -1) {
        // Mettre à jour les champs modifiables uniquement
        tenants.value[index] = { ...tenants.value[index], ...updatedTenant }
      }
      
      toast.success('Établissement mis à jour')
      await fetchTenantsData() // Recharger la liste complète
      return null
    } catch (err: any) {
      error.value = err.message
      toast.error('Erreur lors de la mise à jour')
      throw err
    } finally {
      loading.value = false
    }
  }

  // Activer un tenant
  async function activateTenant(id: string): Promise<void> {
    try {
      await updateTenantStatus(id, 'ACTIVE')
      
      const index = tenants.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tenants.value[index].status = 'ACTIVE'
      }
      
      toast.success('Établissement activé')
    } catch (err: any) {
      toast.error('Erreur lors de l\'activation')
      throw err
    }
  }

  // Suspendre un tenant
  async function suspendTenant(id: string): Promise<void> {
    try {
      await updateTenantStatus(id, 'SUSPENDED')
      
      const index = tenants.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tenants.value[index].status = 'SUSPENDED'
      }
      
      toast.warning('Établissement suspendu')
    } catch (err: any) {
      toast.error('Erreur lors de la suspension')
      throw err
    }
  }

  // Supprimer un tenant
  async function deleteTenant(id: string): Promise<void> {
    try {
      await deleteTenantAPI(id)
      tenants.value = tenants.value.filter(t => t.id !== id)
      toast.success('Établissement supprimé')
    } catch (err: any) {
      toast.error('Erreur lors de la suppression')
      throw err
    }
  }

  // Définir le tenant courant
  function setCurrentTenant(tenant: Tenant | null) {
    currentTenant.value = tenant
    if (tenant) {
      localStorage.setItem('currentTenant', tenant.domain)
      localStorage.setItem('currentTenantData', JSON.stringify(tenant))
    } else {
      localStorage.removeItem('currentTenant')
      localStorage.removeItem('currentTenantData')
    }
  }

  // Charger le tenant courant depuis le localStorage
  function loadCurrentTenant() {
    const tenantData = localStorage.getItem('currentTenantData')
    if (tenantData) {
      try {
        currentTenant.value = JSON.parse(tenantData)
      } catch (err) {
        localStorage.removeItem('currentTenantData')
        localStorage.removeItem('currentTenant')
      }
    }
  }

  // Vérifier la disponibilité d'un domaine
  async function checkDomainAvailability(domain: string): Promise<boolean> {
    try {
      // TODO: Implémenter l'API de vérification de domaine
      return true
    } catch (err) {
      return false
    }
  }

  // Rafraîchir les données du tenant courant
  async function refreshCurrentTenant(): Promise<void> {
    if (!currentTenant.value) return
    
    try {
      const updated = await fetchTenant(currentTenant.value._id)
      // TODO: Adapter selon la structure retournée par l'API
      toast.success('Données mises à jour')
    } catch (err: any) {
      toast.error('Erreur lors du rafraîchissement')
    }
  }

  // Réinitialiser l'état
  function resetState() {
    tenants.value = []
    currentTenant.value = null
    loading.value = false
    error.value = null
    pagination.value = {
      current: 1,
      total: 0,
      pages: 0,
      limit: 10
    }
  }

  return {
    // État
    tenants,
    currentTenant,
    loading,
    error,
    pagination,
    
    // Getters
    activeTenants,
    pendingTenants,
    isCurrentTenantActive,
    
    // Actions
    fetchTenants: fetchTenantsData,
    createTenant,
    updateTenant,
    activateTenant,
    suspendTenant,
    deleteTenant,
    setCurrentTenant,
    loadCurrentTenant,
    checkDomainAvailability,
    refreshCurrentTenant,
    resetState
  }
}) 