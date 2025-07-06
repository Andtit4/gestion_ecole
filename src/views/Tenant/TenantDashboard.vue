<template>
  <div class="p-6 space-y-6">
    <!-- En-tête avec sélecteur de tenant -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          Gestion des Établissements
        </h1>
        <p class="text-gray-600 mt-1">
          Gérez vos établissements scolaires et leurs abonnements
        </p>
      </div>
      
      <div class="flex space-x-4">
        <button
          @click="showCreateForm = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nouvel Établissement
        </button>
        
        <button
          @click="refreshData"
          :disabled="loading"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <span v-if="loading">⟳</span>
          <span v-else>↻</span>
          Actualiser
        </button>
      </div>
    </div>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Total Établissements</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalTenants }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-xl">🏫</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Établissements Actifs</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.activeTenants }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span class="text-green-600 text-xl">✅</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">En Attente</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.pendingTenants }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <span class="text-yellow-600 text-xl">⏳</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Abonnements Expirants</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.expiringTenants }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span class="text-red-600 text-xl">⚠️</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendu</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Plan</label>
          <select
            v-model="filters.plan"
            @change="applyFilters"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            <option value="basic">Basique</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Entreprise</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
          <input
            v-model="searchTerm"
            @input="debouncedSearch"
            type="text"
            placeholder="Nom ou domaine..."
            class="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
          />
        </div>

        <div class="ml-auto">
          <button
            @click="clearFilters"
            class="text-gray-500 hover:text-gray-700 text-sm"
          >
            Effacer les filtres
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des établissements -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">
          Établissements ({{ tenantStore.pagination.total }})
        </h2>
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-500">Chargement...</p>
      </div>

      <!-- Liste -->
      <div v-else-if="tenants.length" class="divide-y divide-gray-200">
        <div
          v-for="tenant in tenants"
          :key="tenant._id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-4">
                <!-- Logo/Avatar -->
                <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <img
                    v-if="tenant.settings.logoUrl"
                    :src="tenant.settings.logoUrl"
                    :alt="tenant.name"
                    class="w-full h-full rounded-full object-cover"
                  />
                  <span v-else class="text-gray-500 text-lg">🏫</span>
                </div>

                <!-- Informations -->
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <h3 class="text-lg font-medium text-gray-900">
                      {{ tenant.name }}
                    </h3>
                    
                    <!-- Badge statut -->
                    <span
                      :class="getStatusBadgeClass(tenant.status)"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ getStatusLabel(tenant.status) }}
                    </span>

                    <!-- Badge plan -->
                    <span
                      :class="subscriptionStore.getPlanBadgeColor(tenant.subscription.plan)"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ getPlanLabel(tenant.subscription.plan) }}
                    </span>
                  </div>

                  <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{{ tenant.domain }}.monecole.fr</span>
                    <span>{{ tenant.email }}</span>
                    <span>{{ getSchoolTypeLabel(tenant.settings.schoolType) }}</span>
                  </div>

                  <!-- Utilisation -->
                  <div class="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">Élèves:</span>
                      <span class="ml-1 font-medium">{{ getRandomUsage(tenant.subscription.maxStudents) }}</span>
                      <span class="text-gray-400">/ {{ tenant.subscription.maxStudents === 999999 ? '∞' : tenant.subscription.maxStudents }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">Professeurs:</span>
                      <span class="ml-1 font-medium">{{ getRandomUsage(tenant.subscription.maxTeachers) }}</span>
                      <span class="text-gray-400">/ {{ tenant.subscription.maxTeachers === 999999 ? '∞' : tenant.subscription.maxTeachers }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-3">
              <!-- Informations d'expiration -->
              <div class="text-right text-sm">
                <p class="text-gray-500">Expire le</p>
                <p class="font-medium" :class="getExpirationColor(tenant.subscription.endDate)">
                  {{ formatDate(tenant.subscription.endDate) }}
                </p>
              </div>

              <!-- Menu d'actions -->
              <div class="relative">
                <button
                  @click="selectedTenant = selectedTenant === tenant ? null : tenant"
                  class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ⋮
                </button>
                
                <!-- Menu déroulant -->
                <div
                  v-if="selectedTenant === tenant"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                >
                  <div class="py-1">
                    <button
                      @click="viewTenant(tenant)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Voir les détails
                    </button>
                    <button
                      @click="editTenant(tenant)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Modifier
                    </button>
                    <button
                      @click="manageSubscription(tenant)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Gérer l'abonnement
                    </button>
                    
                    <hr class="my-1">
                    
                    <button
                      v-if="tenant.status !== 'active'"
                      @click="activateTenant(tenant)"
                      class="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                    >
                      Activer
                    </button>
                    <button
                      v-if="tenant.status === 'active'"
                      @click="suspendTenant(tenant)"
                      class="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                    >
                      Suspendre
                    </button>
                    <button
                      @click="deleteTenant(tenant)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="p-8 text-center">
        <div class="text-6xl mb-4">🏫</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Aucun établissement trouvé
        </h3>
        <p class="text-gray-500 mb-4">
          Commencez par créer votre premier établissement scolaire.
        </p>
        <button
          @click="showCreateForm = true"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Créer un établissement
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="tenants.length && tenantStore.pagination.pages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700">
            Affichage de {{ (tenantStore.pagination.current - 1) * tenantStore.pagination.limit + 1 }} à 
            {{ Math.min(tenantStore.pagination.current * tenantStore.pagination.limit, tenantStore.pagination.total) }} 
            sur {{ tenantStore.pagination.total }} résultats
          </p>
          
          <div class="flex space-x-2">
            <button
              @click="goToPage(tenantStore.pagination.current - 1)"
              :disabled="tenantStore.pagination.current === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            
            <span class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
              {{ tenantStore.pagination.current }}
            </span>
            
            <button
              @click="goToPage(tenantStore.pagination.current + 1)"
              :disabled="tenantStore.pagination.current === tenantStore.pagination.pages"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création (optionnel - peut rediriger vers la page d'inscription) -->
    <div v-if="showCreateForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Nouvel Établissement
        </h3>
        <p class="text-gray-600 mb-6">
          Vous allez être redirigé vers le formulaire d'inscription d'un nouvel établissement.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showCreateForm = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="goToRegistration"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSimpleTenantStore } from '@/stores/simpleTenantStore'
import type { Tenant, TenantStatus, SubscriptionPlan } from '../../types/tenant'

const router = useRouter()
const tenantStore = useSimpleTenantStore()

// État local
const loading = ref(false)
const showCreateForm = ref(false)
const selectedTenant = ref<Tenant | null>(null)
const searchTerm = ref('')
const filters = ref({
  status: '',
  plan: ''
})

// Données computées
const tenants = computed(() => tenantStore.tenants)

const stats = computed(() => ({
  totalTenants: tenants.value.length,
  activeTenants: tenants.value.filter(t => t.status === 'active').length,
  pendingTenants: tenants.value.filter(t => t.status === 'pending').length,
  expiringTenants: tenants.value.filter(t => {
    const daysUntilExpiry = Math.ceil((new Date(t.subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0
  }).length
}))

// Méthodes utilitaires
function getStatusBadgeClass(status: TenantStatus): string {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'suspended': return 'bg-red-100 text-red-800'
    case 'cancelled': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusLabel(status: TenantStatus): string {
  switch (status) {
    case 'active': return 'Actif'
    case 'pending': return 'En attente'
    case 'suspended': return 'Suspendu'
    case 'cancelled': return 'Annulé'
    default: return status
  }
}

function getPlanLabel(plan: SubscriptionPlan): string {
  switch (plan) {
    case 'basic': return 'Basique'
    case 'standard': return 'Standard'
    case 'premium': return 'Premium'
    case 'enterprise': return 'Entreprise'
    default: return plan
  }
}

function getSchoolTypeLabel(type: string): string {
  switch (type) {
    case 'primary': return 'Primaire'
    case 'secondary': return 'Secondaire'
    case 'university': return 'Université'
    case 'mixed': return 'Mixte'
    default: return type
  }
}

function getExpirationColor(endDate: string): string {
  const daysUntilExpiry = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  if (daysUntilExpiry < 0) return 'text-red-600'
  if (daysUntilExpiry <= 7) return 'text-red-600'
  if (daysUntilExpiry <= 30) return 'text-yellow-600'
  return 'text-gray-900'
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function getRandomUsage(max: number): number {
  if (max === 999999) return Math.floor(Math.random() * 500) + 50
  return Math.floor(Math.random() * max * 0.8)
}

// Actions
async function refreshData() {
  loading.value = true
  try {
    await tenantStore.fetchTenants({
      ...filters.value,
      page: tenantStore.pagination.current
    })
  } finally {
    loading.value = false
  }
}

async function applyFilters() {
  await tenantStore.fetchTenants({
    ...filters.value,
    page: 1
  })
}

function clearFilters() {
  filters.value = { status: '', plan: '' }
  searchTerm.value = ''
  applyFilters()
}

// Debounced search
let searchTimeout: number
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    await tenantStore.fetchTenants({
      ...filters.value,
      search: searchTerm.value,
      page: 1
    })
  }, 500)
}

async function goToPage(page: number) {
  await tenantStore.fetchTenants({
    ...filters.value,
    page
  })
}

// Actions sur les tenants
function viewTenant(tenant: Tenant) {
  router.push(`/tenant/${tenant._id}`)
  selectedTenant.value = null
}

function editTenant(tenant: Tenant) {
  router.push(`/tenant/${tenant._id}/edit`)
  selectedTenant.value = null
}

function manageSubscription(tenant: Tenant) {
  router.push(`/tenant/${tenant._id}/subscription`)
  selectedTenant.value = null
}

async function activateTenant(tenant: Tenant) {
  try {
    await tenantStore.activateTenant(tenant._id)
    selectedTenant.value = null
  } catch (err) {
    console.error('Erreur activation:', err)
  }
}

async function suspendTenant(tenant: Tenant) {
  if (confirm(`Êtes-vous sûr de vouloir suspendre ${tenant.name} ?`)) {
    try {
      await tenantStore.suspendTenant(tenant._id)
      selectedTenant.value = null
    } catch (err) {
      console.error('Erreur suspension:', err)
    }
  }
}

async function deleteTenant(tenant: Tenant) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${tenant.name} ? Cette action est irréversible.`)) {
    try {
      await tenantStore.deleteTenant(tenant._id)
      selectedTenant.value = null
    } catch (err) {
      console.error('Erreur suppression:', err)
    }
  }
}

function goToRegistration() {
  router.push('/tenant/register')
}

// Fermer le menu quand on clique ailleurs
function handleClickOutside(event: Event) {
  if (selectedTenant.value && !(event.target as Element)?.closest('.relative')) {
    selectedTenant.value = null
  }
}

// Lifecycle
onMounted(async () => {
  await refreshData()
  document.addEventListener('click', handleClickOutside)
})

// Cleanup
watch(() => {}, () => {
  document.removeEventListener('click', handleClickOutside)
})
</script> 