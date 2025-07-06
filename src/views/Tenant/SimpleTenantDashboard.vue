<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <!-- Métriques Principales -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 mb-6">
      <!-- Total Établissements -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl dark:bg-blue-900/30">
          <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Total Établissements</span>
            <h4 class="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{{ stats.totalTenants }}</h4>
          </div>
          <span class="flex items-center gap-1 rounded-full bg-blue-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
            <svg class="fill-current w-3 h-3" viewBox="0 0 12 12">
              <path d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432L9.65514 4.5918L6.87329 3.93247V10.125L5.56462 1.62393Z"/>
            </svg>
            +12%
          </span>
        </div>
      </div>

      <!-- Établissements Actifs -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl dark:bg-green-900/30">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">Actifs</span>
            <h4 class="mt-2 font-bold text-green-600 text-title-sm dark:text-green-400">{{ stats.activeTenants }}</h4>
          </div>
          <span class="flex items-center gap-1 rounded-full bg-green-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
            <svg class="fill-current w-3 h-3" viewBox="0 0 12 12">
              <path d="M5.56462 1.62393L9.65514 4.5918L6.87329 3.93247V10.125L5.56462 1.62393Z"/>
            </svg>
            +8.2%
          </span>
        </div>
      </div>

      <!-- En Attente -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-xl dark:bg-orange-900/30">
          <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">En Attente</span>
            <h4 class="mt-2 font-bold text-orange-600 text-title-sm dark:text-orange-400">{{ stats.pendingTenants }}</h4>
          </div>
          <span class="flex items-center gap-1 rounded-full bg-orange-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
            <svg class="fill-current w-3 h-3" viewBox="0 0 12 12">
              <path d="M5.31462 10.3761L8.34486 6.34717L6.62329 8.06753V1.875L5.31462 10.3761Z"/>
            </svg>
            -2.1%
          </span>
        </div>
      </div>

      <!-- En Essai -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-xl dark:bg-purple-900/30">
          <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div class="flex items-end justify-between mt-5">
          <div>
            <span class="text-sm text-gray-500 dark:text-gray-400">En Essai</span>
            <h4 class="mt-2 font-bold text-purple-600 text-title-sm dark:text-purple-400">{{ stats.trialTenants }}</h4>
          </div>
          <span class="flex items-center gap-1 rounded-full bg-purple-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-purple-600 dark:bg-purple-500/15 dark:text-purple-500">
            <svg class="fill-current w-3 h-3" viewBox="0 0 12 12">
              <path d="M5.56462 1.62393L9.65514 4.5918L6.87329 3.93247V10.125L5.56462 1.62393Z"/>
            </svg>
            +5.4%
          </span>
        </div>
      </div>
    </div>

    <!-- Actions et Recherche -->
    <div class="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mb-6">
      <div class="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Gestion des Établissements</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ filteredTenants.length }} établissement(s) trouvé(s)</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="navigateToRegistration"
            class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nouvel Établissement
          </button>
          
          <button
            @click="refreshData"
            :disabled="loading"
            class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      <!-- Filtres et Recherche -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <!-- Barre de recherche -->
        <div class="relative flex-1">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un établissement..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Filtre par statut -->
        <select
          v-model="statusFilter"
          class="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tous les statuts</option>
          <option value="ACTIVE">Actif</option>
          <option value="PENDING">En attente</option>
          <option value="TRIAL">Essai</option>
          <option value="SUSPENDED">Suspendu</option>
        </select>

        <!-- Filtre par plan -->
        <select
          v-model="planFilter"
          class="px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Tous les plans</option>
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>
    </div>

    <!-- Tableau des Établissements -->
    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Chargement des données...</p>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12 px-6">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <p class="mt-2 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        <button
          @click="refreshData"
          class="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Réessayer
        </button>
      </div>

      <div v-else-if="filteredTenants.length === 0" class="text-center py-12 px-6">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {{ searchTerm || statusFilter || planFilter ? 'Aucun établissement trouvé avec ces critères' : 'Aucun établissement enregistré' }}
        </p>
        <button
          v-if="!searchTerm && !statusFilter && !planFilter"
          @click="navigateToRegistration"
          class="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Créer le premier établissement
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Établissement
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Statut
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Plan
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Utilisation
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Expiration
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-white/[0.03] dark:divide-gray-800">
            <tr
              v-for="tenant in filteredTenants"
              :key="tenant.id"
              class="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                    </div>
                  </div>
                                     <div class="ml-4">
                     <div class="text-sm font-medium text-gray-900 dark:text-white">{{ tenant.name || 'Nom non défini' }}</div>
                     <div class="text-sm text-gray-500 dark:text-gray-400">{{ tenant.domain || 'domaine' }}.schools.com</div>
                     <div class="text-xs text-gray-400 dark:text-gray-500">{{ tenant.city || 'Ville' }} • {{ tenant.type || 'Type' }}</div>
                   </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(tenant.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <span :class="getStatusDotClass(tenant.status)" class="w-2 h-2 rounded-full mr-1.5"></span>
                  {{ getStatusLabel(tenant.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPlanBadgeClass(tenant.plan)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ getPlanLabel(tenant.plan) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                 <div class="space-y-1">
                   <div class="flex items-center">
                     <span class="text-xs text-gray-500 dark:text-gray-400 w-12">Élèves:</span>
                     <span class="font-medium">{{ tenant.currentStudents || 0 }}</span>
                     <span class="text-gray-400 mx-1">/</span>
                     <span class="text-gray-500">{{ tenant.maxStudents === 999999 ? '∞' : (tenant.maxStudents || 0) }}</span>
                   </div>
                   <div class="flex items-center">
                     <span class="text-xs text-gray-500 dark:text-gray-400 w-12">Prof:</span>
                     <span class="font-medium">{{ tenant.currentTeachers || 0 }}</span>
                     <span class="text-gray-400 mx-1">/</span>
                     <span class="text-gray-500">{{ tenant.maxTeachers === 999999 ? '∞' : (tenant.maxTeachers || 0) }}</span>
                   </div>
                 </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm">
                  <div :class="getExpirationColor(tenant.endDate)" class="font-medium">
                    {{ formatDate(tenant.endDate) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getDaysUntilExpiry(tenant.endDate) }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-3">
                  <button
                    @click="viewTenant(tenant)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button
                    @click="editTenant(tenant)"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    v-if="tenant.status === 'ACTIVE'"
                    @click="suspendTenant(tenant)"
                    class="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"/>
                    </svg>
                  </button>
                  <button
                    v-else-if="tenant.status === 'SUSPENDED'"
                    @click="activateTenant(tenant)"
                    class="text-green-400 hover:text-green-600 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { fetchDashboardStats, fetchTenants, updateTenantStatus, type DashboardStats, type TenantListItem } from '@/services/api'

const router = useRouter()
const currentPageTitle = ref('Gestion des Établissements')

// État local
const loading = ref(false)
const error = ref('')
const searchTerm = ref('')
const statusFilter = ref('')
const planFilter = ref('')

// Données
const stats = ref<DashboardStats>({
  totalTenants: 0,
  activeTenants: 0,
  pendingTenants: 0,
  trialTenants: 0
})
const tenants = ref<TenantListItem[]>([])

// Computed
const filteredTenants = computed(() => {
  let filtered = tenants.value

  // Filtre par terme de recherche
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(tenant =>
      tenant.name.toLowerCase().includes(term) ||
      tenant.domain.toLowerCase().includes(term) ||
      tenant.city.toLowerCase().includes(term) ||
      tenant.type.toLowerCase().includes(term)
    )
  }

  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter(tenant => tenant.status === statusFilter.value)
  }

  // Filtre par plan
  if (planFilter.value) {
    filtered = filtered.filter(tenant => tenant.plan === planFilter.value)
  }

  return filtered
})

// Méthodes de formatage
function getStatusBadgeClass(status: string): string {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  
  const classes: Record<string, string> = {
    'ACTIVE': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'PENDING': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    'TRIAL': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'SUSPENDED': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }
  return classes[status] || classes['PENDING']
}

function getStatusDotClass(status: string): string {
  if (!status) return 'bg-gray-400'
  
  const classes: Record<string, string> = {
    'ACTIVE': 'bg-green-400',
    'PENDING': 'bg-orange-400',
    'TRIAL': 'bg-purple-400',
    'SUSPENDED': 'bg-red-400'
  }
  return classes[status] || classes['PENDING']
}

function getStatusLabel(status: string): string {
  if (!status) return 'Non défini'
  
  const labels: Record<string, string> = {
    'ACTIVE': 'Actif',
    'PENDING': 'En attente',
    'TRIAL': 'Essai',
    'SUSPENDED': 'Suspendu'
  }
  return labels[status] || 'Inconnu'
}

function getPlanBadgeClass(plan: string): string {
  if (!plan) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  
  const classes: Record<string, string> = {
    'basic': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'standard': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'premium': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    'enterprise': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  }
  return classes[plan] || classes['basic']
}

function getPlanLabel(plan: string): string {
  if (!plan) return 'Non défini'
  
  const labels: Record<string, string> = {
    'basic': 'Basic',
    'standard': 'Standard',
    'premium': 'Premium',
    'enterprise': 'Enterprise'
  }
  return labels[plan] || 'Inconnu'
}

function getExpirationColor(endDate: string): string {
  if (!endDate) return 'text-gray-500 dark:text-gray-400'
  
  const today = new Date()
  const expiry = new Date(endDate.split('/').reverse().join('-'))
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24))
  
  if (daysUntilExpiry < 0) return 'text-red-600 dark:text-red-400'
  if (daysUntilExpiry < 7) return 'text-red-600 dark:text-red-400'
  if (daysUntilExpiry < 30) return 'text-orange-600 dark:text-orange-400'
  return 'text-gray-900 dark:text-white'
}

function getDaysUntilExpiry(endDate: string): string {
  if (!endDate) return 'Non défini'
  
  const today = new Date()
  const expiry = new Date(endDate.split('/').reverse().join('-'))
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24))
  
  if (daysUntilExpiry < 0) return 'Expiré'
  if (daysUntilExpiry === 0) return 'Expire aujourd\'hui'
  if (daysUntilExpiry === 1) return 'Expire demain'
  if (daysUntilExpiry < 30) return `Dans ${daysUntilExpiry} jours`
  return `Dans ${Math.ceil(daysUntilExpiry / 30)} mois`
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Non défini'
  return dateString
}

// Actions
function navigateToRegistration() {
  router.push('/tenant/register')
}

async function refreshData() {
  loading.value = true
  error.value = ''
  try {
    const [statsData, tenantsData] = await Promise.all([
      fetchDashboardStats(),
      fetchTenants()
    ])
    stats.value = statsData
    tenants.value = tenantsData
  } catch (err) {
    error.value = 'Erreur lors du chargement des données'
    console.error('Error fetching data:', err)
  } finally {
    loading.value = false
  }
}

function viewTenant(tenant: TenantListItem) {
  router.push(`/tenant/${tenant.id}`)
}

function editTenant(tenant: TenantListItem) {
  console.log('Modifier établissement:', tenant.name)
  // TODO: Naviguer vers la page d'édition du tenant
}

async function suspendTenant(tenant: TenantListItem) {
  if (confirm(`Êtes-vous sûr de vouloir suspendre "${tenant.name}"?`)) {
    try {
      await updateTenantStatus(tenant.id, 'SUSPENDED')
      tenant.status = 'SUSPENDED'
      // Mise à jour des stats
      stats.value.activeTenants--
    } catch (err) {
      alert('Erreur lors de la suspension')
      console.error('Error suspending tenant:', err)
    }
  }
}

async function activateTenant(tenant: TenantListItem) {
  if (confirm(`Êtes-vous sûr de vouloir activer "${tenant.name}"?`)) {
    try {
      await updateTenantStatus(tenant.id, 'ACTIVE')
      tenant.status = 'ACTIVE'
      // Mise à jour des stats
      stats.value.activeTenants++
    } catch (err) {
      alert('Erreur lors de l\'activation')
      console.error('Error activating tenant:', err)
    }
  }
}

// Initialisation
onMounted(() => {
  refreshData()
})
</script> 