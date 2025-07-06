<template>
  <div class="tenant-selector">
    <!-- Header avec tenant actuel -->
    <div v-if="currentTenant" class="current-tenant-header">
      <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-semibold text-lg">{{ currentTenant.name.charAt(0).toUpperCase() }}</span>
          </div>
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white">{{ currentTenant.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ currentTenant.domain }}</p>
          </div>
        </div>
        <button
          @click="showSelector = true"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Changer
        </button>
      </div>
    </div>

    <!-- Bouton pour ouvrir le sélecteur si aucun tenant sélectionné -->
    <div v-else class="no-tenant-selected">
      <div class="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucune école sélectionnée</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Veuillez sélectionner une école pour continuer</p>
        <button
          @click="showSelector = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Sélectionner une école
        </button>
      </div>
    </div>

    <!-- Modal de sélection -->
    <div v-if="showSelector" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Sélectionner une école</h2>
          <button
            @click="showSelector = false"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Chargement des écoles...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <div class="text-red-600 dark:text-red-400 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
          <button
            @click="loadTenants"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>

        <div v-else class="space-y-2 max-h-80 overflow-y-auto">
          <div
            v-for="tenant in availableTenants"
            :key="tenant.id"
            @click="selectTenant(tenant)"
            class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700': currentTenant?.id === tenant.id }"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-medium text-sm">{{ tenant.name.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ tenant.name }}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ tenant.domain }}</p>
              </div>
              <div v-if="currentTenant?.id === tenant.id" class="text-blue-600 dark:text-blue-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div v-if="availableTenants.length === 0" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400">Aucune école disponible</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCurrentTenantStore } from '../../stores/currentTenantStore'
import { tenantService } from '../../services/tenantService'
import type { CurrentTenant } from '../../stores/currentTenantStore'

const tenantStore = useCurrentTenantStore()
const showSelector = ref(false)
const loading = ref(false)
const error = ref('')

const currentTenant = computed(() => tenantStore.selectedTenant)
const availableTenants = computed(() => tenantStore.availableTenants)

async function loadTenants() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await tenantService.getTenants({ page: 1, limit: 100 })
    const tenants: CurrentTenant[] = response.tenants.map(tenant => ({
      id: tenant._id,
      name: tenant.name,
      domain: tenant.domain,
      email: tenant.email
    }))
    
    tenantStore.setAvailableTenants(tenants)
    
    // Si notre tenant actuel n'est plus dans la liste, le déselectionner
    if (currentTenant.value && !tenants.find(t => t.id === currentTenant.value?.id)) {
      tenantStore.clearSelectedTenant()
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement des écoles'
    console.error('Erreur lors du chargement des tenants:', err)
  } finally {
    loading.value = false
  }
}

function selectTenant(tenant: CurrentTenant) {
  tenantStore.setSelectedTenant(tenant)
  showSelector.value = false
}

onMounted(() => {
  tenantStore.loadFromStorage()
  loadTenants()
})
</script>

<style scoped>
.tenant-selector {
  /* Styles spécifiques si nécessaire */
}
</style> 