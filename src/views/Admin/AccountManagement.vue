<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Header moderne -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Navigation breadcrumb -->
          <div class="flex items-center space-x-4">
            <!-- Bouton retour -->
            <button
              @click="goBackToDashboard"
              class="flex items-center p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
              title="Retour au dashboard"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Gestion des Établissements
              </h1>
              <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">Administration système</p>
            </div>
          </div>

          <!-- Actions header -->
          <div class="flex items-center space-x-4">
            <button
              @click="refreshData"
              :disabled="loading"
              class="p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            >
              <svg 
                class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                :class="{ 'animate-spin': loading }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvel Établissement
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          v-for="(stat, index) in statsCards" 
          :key="index"
          class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="flex items-center justify-between">
            <div>
              <div :class="[
                'w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg',
                stat.iconBg
              ]">
                <svg class="w-6 h-6" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
            </div>
            <span :class="['text-xs font-medium px-2 py-1 rounded-full', stat.badgeColor]">
              {{ stat.change }}
            </span>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rechercher</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Nom, domaine, email..."
                class="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statut</label>
            <select
              v-model="selectedStatus"
              class="w-full py-3 px-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="trial">Essai</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan</label>
            <select
              v-model="selectedPlan"
              class="w-full py-3 px-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
            >
              <option value="">Tous les plans</option>
              <option value="starter">Starter</option>
              <option value="standard">Standard</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full py-3 px-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des établissements -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        
        <!-- En-tête de tableau -->
        <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Établissements ({{ filteredTenants.length }})
            </h2>
            <div class="flex items-center space-x-2">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                @click="viewMode = 'table'"
                :class="[
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'table' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mode grille -->
        <div v-if="viewMode === 'grid'" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="tenant in filteredTenants"
              :key="tenant.id"
              class="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <!-- Header de la carte -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span class="text-white font-bold text-sm">{{ getInitials(tenant.name) }}</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ tenant.name }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ tenant.domain }}.schools.com</p>
                  </div>
                </div>
                <span :class="getStatusBadgeClass(tenant.status)">
                  {{ getStatusLabel(tenant.status) }}
                </span>
              </div>

              <!-- Informations -->
              <div class="space-y-3 mb-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Plan</span>
                  <span class="font-medium text-gray-900 dark:text-white capitalize">{{ tenant.plan }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Élèves</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ tenant.currentStudents }}/{{ tenant.maxStudents }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Admin</span>
                  <span class="font-medium text-gray-900 dark:text-white text-xs">{{ tenant.adminEmail }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Expire</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ tenant.endDate }}</span>
                </div>
              </div>

              <!-- Barre de progression -->
              <div class="mb-4">
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-600 dark:text-gray-400">Utilisation</span>
                  <span class="text-gray-900 dark:text-white">{{ Math.round((tenant.currentStudents / tenant.maxStudents) * 100) }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300" 
                    :style="{ width: `${Math.min((tenant.currentStudents / tenant.maxStudents) * 100, 100)}%` }"
                  ></div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <button
                  @click="viewTenant(tenant)"
                  class="flex-1 py-2 px-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                >
                  Voir
                </button>
                <button
                  @click="editTenant(tenant)"
                  class="flex-1 py-2 px-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  Modifier
                </button>
                <button
                  @click="showDeleteModal(tenant)"
                  class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mode tableau -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Établissement</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Utilisation</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expire</th>
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <tr
                v-for="tenant in filteredTenants"
                :key="tenant.id"
                class="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <span class="text-white font-bold text-sm">{{ getInitials(tenant.name) }}</span>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">{{ tenant.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ tenant.domain }}.schools.com</div>
                      <div class="text-xs text-gray-400 dark:text-gray-500">{{ tenant.adminEmail }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusBadgeClass(tenant.status)">
                    {{ getStatusLabel(tenant.status) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 capitalize">
                    {{ tenant.plan }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ tenant.currentStudents }}/{{ tenant.maxStudents }} élèves
                    </div>
                    <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        class="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full" 
                        :style="{ width: `${Math.min((tenant.currentStudents / tenant.maxStudents) * 100, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ tenant.endDate }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewTenant(tenant)"
                      class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="editTenant(tenant)"
                      class="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="showDeleteModal(tenant)"
                      class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Message si aucun résultat -->
        <div v-if="!filteredTenants.length && !loading" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun établissement trouvé</h3>
          <p class="text-gray-500 dark:text-gray-400">Essayez de modifier vos critères de recherche</p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-flex items-center space-x-2">
            <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600 dark:text-gray-400">Chargement...</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de création/modification -->
    <TenantModal
      :show="showCreateModal || showEditModal"
      :tenant="selectedTenant"
      :mode="showCreateModal ? 'create' : 'edit'"
      @close="closeModals"
      @saved="onTenantSaved"
    />

    <!-- Modal de confirmation de suppression -->
    <ConfirmModal
      :show="confirmModal.show"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      :confirmText="confirmModal.confirmText"
      @confirm="confirmDelete"
      @cancel="confirmModal.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTenantStore } from '@/stores/tenantStore'
import type { TenantListItem } from '@/services/api'
import TenantModal from '@/components/tenant/TenantModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const router = useRouter()
const tenantStore = useTenantStore()

// État local
const loading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPlan = ref('')
const viewMode = ref<'grid' | 'table'>('grid')

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedTenant = ref<TenantListItem | null>(null)

// Modal de confirmation
const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  type: 'danger' as 'danger' | 'warning' | 'success' | 'info',
  confirmText: 'Supprimer',
  tenantToDelete: null as TenantListItem | null
})

// Données
const tenants = ref<TenantListItem[]>([])

// Computed
const filteredTenants = computed(() => {
  let filtered = tenants.value
  
  console.log('filteredTenants computed - tenants.value:', tenants.value.map(t => ({ name: t.name, id: t.id })))

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tenant =>
      tenant.name.toLowerCase().includes(search) ||
      tenant.domain.toLowerCase().includes(search) ||
      tenant.adminEmail.toLowerCase().includes(search) ||
      tenant.city.toLowerCase().includes(search)
    )
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(tenant => tenant.status.toLowerCase() === selectedStatus.value)
  }

  if (selectedPlan.value) {
    filtered = filtered.filter(tenant => tenant.plan === selectedPlan.value)
  }

  console.log('filteredTenants computed - result:', filtered.map(t => ({ name: t.name, id: t.id })))
  return filtered
})

const statsCards = computed(() => [
  {
    label: 'Total Établissements',
    value: tenants.value.length,
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6',
    iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
    iconColor: 'text-white',
    change: '+12%',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  {
    label: 'Actifs',
    value: tenants.value.filter(t => t.status === 'ACTIVE').length,
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-gradient-to-r from-green-500 to-green-600',
    iconColor: 'text-white',
    change: '+8%',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  {
    label: 'En Attente',
    value: tenants.value.filter(t => t.status === 'PENDING').length,
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    iconColor: 'text-white',
    change: '+5%',
    badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  },
  {
    label: 'Total Élèves',
    value: tenants.value.reduce((sum, t) => sum + t.currentStudents, 0),
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
    iconColor: 'text-white',
    change: '+15%',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  }
])

// Méthodes utilitaires
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusBadgeClass(status: string): string {
  const classes = {
    'ACTIVE': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'PENDING': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    'TRIAL': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    'SUSPENDED': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  }
  return classes[status as keyof typeof classes] || classes.PENDING
}

function getStatusLabel(status: string): string {
  const labels = {
    'ACTIVE': 'Actif',
    'PENDING': 'En attente',
    'TRIAL': 'Essai',
    'SUSPENDED': 'Suspendu'
  }
  return labels[status as keyof typeof labels] || 'Inconnu'
}

// Actions
async function refreshData() {
  loading.value = true
  try {
    // Utiliser l'API appropriée pour récupérer les tenants
    const { fetchTenants } = await import('@/services/api')
    const tenantsData = await fetchTenants()
    console.log('Tenants loaded:', tenantsData)
    console.log('Tenant IDs:', tenantsData.map(t => ({ name: t.name, id: t.id })))
    tenants.value = tenantsData
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedPlan.value = ''
}

function goBackToDashboard() {
  router.push('/school/dashboard')
}

function viewTenant(tenant: TenantListItem) {
  console.log('viewTenant called with:', tenant)
  console.log('Navigating to:', `/tenant/${tenant.id}`)
  router.push(`/tenant/${tenant.id}`)
}

function editTenant(tenant: TenantListItem) {
  console.log('editTenant called with:', tenant)
  selectedTenant.value = tenant
  showEditModal.value = true
}

function showDeleteModal(tenant: TenantListItem) {
  confirmModal.value = {
    show: true,
    title: 'Supprimer l\'établissement',
    message: `Êtes-vous sûr de vouloir supprimer l'établissement "${tenant.name}" ? Cette action est irréversible et supprimera toutes les données associées.`,
    type: 'danger',
    confirmText: 'Supprimer définitivement',
    tenantToDelete: tenant
  }
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  // Délai pour éviter de vider selectedTenant avant la fermeture de la modal
  setTimeout(() => {
    selectedTenant.value = null
  }, 200)
}

async function onTenantSaved() {
  console.log('onTenantSaved appelé')
  // Fermer d'abord les modals
  showCreateModal.value = false
  showEditModal.value = false
  
  // Petit délai pour s'assurer que la création est terminée côté serveur
  setTimeout(async () => {
    console.log('Rafraîchissement des données...')
    await refreshData()
    console.log('Données rafraîchies, nouvelle liste:', tenants.value.map(t => t.name))
  }, 500)
  
  // Et enfin vider selectedTenant après un délai
  setTimeout(() => {
    selectedTenant.value = null
  }, 800)
}

async function confirmDelete() {
  if (!confirmModal.value.tenantToDelete) return
  
  try {
    await tenantStore.deleteTenant(confirmModal.value.tenantToDelete.id)
    await refreshData()
    confirmModal.value.show = false
    confirmModal.value.tenantToDelete = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script> 