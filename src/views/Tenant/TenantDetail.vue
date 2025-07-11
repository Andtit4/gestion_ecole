<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Header moderne -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Navigation breadcrumb -->
          <div class="flex items-center space-x-4">
                        <button
              @click="router.push('/admin/accounts')"
              class="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
              title="Retour au dashboard"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {{ tenant?.name || 'Détails Établissement' }}
              </h1>
              <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ tenant?.domain }}.schools.com</p>
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
              @click="editTenant"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Banner d'état -->
      <div v-if="tenant" :class="[
        'relative overflow-hidden rounded-3xl p-8 shadow-2xl',
        getStatusBannerClass(tenant.status)
      ]">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-3 mb-2">
                <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                  <span class="text-white font-bold text-xl">{{ getInitials(tenant.name) }}</span>
                </div>
                <div>
                  <h2 class="text-3xl font-bold text-white">{{ tenant.name }}</h2>
                  <p class="text-white/80 text-lg">{{ tenant.type }} • {{ tenant.city }}</p>
                </div>
              </div>
              <span :class="getStatusBadgeClass(tenant.status)" class="inline-block">
                {{ getStatusLabel(tenant.status) }}
              </span>
            </div>
            <div class="hidden md:block">
              <svg class="w-20 h-20 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Métriques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          v-for="(metric, index) in tenantMetrics" 
          :key="index"
          class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="flex items-center justify-between">
            <div>
              <div :class="[
                'w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg',
                metric.iconBg
              ]">
                <svg class="w-6 h-6" :class="metric.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="metric.icon" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ metric.value }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ metric.label }}</p>
            </div>
            <div class="text-right">
              <span :class="['text-xs font-medium px-2 py-1 rounded-full', metric.badgeColor]">
                {{ metric.change }}
              </span>
              <p v-if="metric.subtitle" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ metric.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu principal en colonnes -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Colonne principale -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Informations générales -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Informations Générales</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nom de l'établissement</label>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ tenant?.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Type d'établissement</label>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ tenant?.type }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Domaine</label>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ tenant?.domain }}.schools.com</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email administrateur</label>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ tenant?.adminEmail }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Ville</label>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ tenant?.city }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Date de création</label>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ tenant?.createdAt }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Utilisation et limites -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Utilisation et Limites</h3>
            </div>
            <div class="p-6 space-y-6">
              <!-- Élèves -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Élèves</span>
                  <span class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ realStats?.currentStudents ?? tenant?.currentStudents ?? 0 }}/{{ realStats?.maxStudents ?? tenant?.maxStudents ?? 500 }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    class="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300" 
                    :style="{ width: `${getUsagePercentage(realStats?.currentStudents ?? tenant?.currentStudents, realStats?.maxStudents ?? tenant?.maxStudents)}%` }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ getUsagePercentage(realStats?.currentStudents ?? tenant?.currentStudents, realStats?.maxStudents ?? tenant?.maxStudents) }}% utilisé
                  <span v-if="loadingStats" class="ml-2">⟳</span>
                </p>
              </div>

              <!-- Professeurs -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Professeurs</span>
                  <span class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ realStats?.currentTeachers ?? tenant?.currentTeachers ?? 0 }}/{{ realStats?.maxTeachers ?? tenant?.maxTeachers ?? 20 }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    class="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300" 
                    :style="{ width: `${getUsagePercentage(realStats?.currentTeachers ?? tenant?.currentTeachers, realStats?.maxTeachers ?? tenant?.maxTeachers)}%` }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ getUsagePercentage(realStats?.currentTeachers ?? tenant?.currentTeachers, realStats?.maxTeachers ?? tenant?.maxTeachers) }}% utilisé
                  <span v-if="loadingStats" class="ml-2">⟳</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Actions Rapides</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  v-for="(action, index) in quickActions" 
                  :key="index"
                  @click="action.action"
                  class="group p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                >
                  <div :class="[
                    'w-10 h-10 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110',
                    action.bgColor
                  ]">
                    <svg class="w-5 h-5" :class="action.textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
                    </svg>
                  </div>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white block text-center">{{ action.name }}</span>
                </button>
              </div>
            </div>
          </div>


        </div>

        <!-- Colonne latérale -->
        <div class="space-y-6">
          
          <!-- Informations abonnement -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <div class="p-6 bg-gradient-to-r from-purple-600 to-indigo-600">
              <h3 class="text-lg font-bold text-white">Plan d'Abonnement</h3>
              <p class="text-purple-100 text-sm capitalize">{{ tenant?.plan }}</p>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Expire le</span>
                <span class="text-sm font-bold text-gray-900 dark:text-white">{{ tenant?.endDate }}</span>
              </div>
              
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Limites du plan</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Élèves max</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ tenant?.maxStudents }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Professeurs max</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ tenant?.maxTeachers }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions d'administration -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Administration</h3>
            </div>
            <div class="p-6 space-y-3">
              <button
                v-for="adminAction in adminActions"
                :key="adminAction.name"
                @click="adminAction.action"
                :class="[
                  'w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200',
                  adminAction.style
                ]"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="adminAction.icon" />
                </svg>
                {{ adminAction.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Loading state -->
    <div v-if="loading" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
        <div class="flex items-center space-x-4">
          <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-lg font-medium text-gray-900 dark:text-white">Chargement...</span>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation générique -->
    <ConfirmModal
      :show="confirmModal.show"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      :confirm-text="confirmModal.confirmText"
      @confirm="handleConfirmAction"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { TenantListItem } from '@/services/api'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const router = useRouter()
const route = useRoute()

// État local
const loading = ref(false)
const tenant = ref<TenantListItem | null>(null)
const realStats = ref<any>(null)
const loadingStats = ref(false)

// Modal de confirmation
const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  type: 'danger' as 'danger' | 'warning' | 'success' | 'info',
  confirmText: 'Confirmer',
  action: '' as 'activate' | 'suspend' | 'delete' | ''
})

// Computed
const tenantMetrics = computed(() => {
  if (!tenant.value) return []
  
  // Utiliser les vraies données si disponibles, sinon fallback sur les données du tenant
  const currentStudents = realStats.value?.currentStudents ?? tenant.value.currentStudents ?? 0
  const currentTeachers = realStats.value?.currentTeachers ?? tenant.value.currentTeachers ?? 0
  const maxStudents = realStats.value?.maxStudents ?? tenant.value.maxStudents ?? 500
  const maxTeachers = realStats.value?.maxTeachers ?? tenant.value.maxTeachers ?? 20
  const usagePercent = maxStudents > 0 ? Math.round((currentStudents / maxStudents) * 100) : 0
  const daysLeft = realStats.value?.daysUntilExpiry ?? getDaysUntilExpiry(tenant.value.endDate) ?? 365
  
  return [
    {
      label: 'Élèves Inscrits',
      value: currentStudents,
      subtitle: `/ ${maxStudents} max`,
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      iconColor: 'text-white',
      change: currentStudents > 0 ? `+${currentStudents}` : '0',
      badgeColor: usagePercent > 80 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      label: 'Professeurs',
      value: currentTeachers,
      subtitle: `/ ${maxTeachers} max`,
      icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z',
      iconBg: 'bg-gradient-to-r from-green-500 to-green-600',
      iconColor: 'text-white',
      change: currentTeachers > 0 ? `+${currentTeachers}` : '0',
      badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      label: 'Utilisation',
      value: `${usagePercent}%`,
      subtitle: 'des limites',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      iconColor: 'text-white',
      change: `${usagePercent}%`,
      badgeColor: usagePercent > 80 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                  usagePercent > 60 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    {
      label: 'Jours Restants',
      value: daysLeft,
      subtitle: "d'abonnement",
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      iconColor: 'text-white',
      change: daysLeft < 30 ? `${daysLeft}j` : `${Math.floor(daysLeft/30)}m`,
      badgeColor: daysLeft < 30 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    }
  ]
})

const quickActions = ref([
  {
    name: 'Gérer Élèves',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    textColor: 'text-white',
    action: () => {
      const tenantId = route.params.id as string
      if (tenantId) {
        router.push(`/school/${tenantId}/students`)
      } else {
        router.push('/students')
      }
    }
  },
  {
    name: 'Professeurs',
    icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z',
    bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
    textColor: 'text-white',
    action: () => {
      const tenantId = route.params.id as string
      if (tenantId) {
        router.push(`/school/${tenantId}/teachers`)
      } else {
        router.push('/teachers')
      }
    }
  },
  {
    name: 'Matières',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    textColor: 'text-white',
    action: () => {
      const tenantId = route.params.id as string
      if (tenantId) {
        router.push(`/school/${tenantId}/subjects`)
      } else {
        router.push('/subjects')
      }
    }
  },
  {
    name: 'Structure',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
    textColor: 'text-white',
    action: () => {
      const tenantId = route.params.id as string
      if (tenantId) {
        router.push(`/school/${tenantId}/structure`)
      } else {
        router.push('/academic-structure')
      }
    }
  },
  {
    name: 'Évaluations',
    icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    bgColor: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    textColor: 'text-white',
    action: () => {
      const tenantId = route.params.id as string
      if (tenantId) {
        router.push(`/school/${tenantId}/evaluations`)
      } else {
        router.push('/evaluations')
      }
    }
  },
  {
    name: 'Bulletins',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    bgColor: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    textColor: 'text-white',
    action: () => {
      const tenantId = route.params.id as string
      if (tenantId) {
        router.push(`/school/${tenantId}/bulletins`)
      } else {
        router.push('/bulletins')
      }
    }
  },
  {
    name: 'Scolarité',
    icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
    bgColor: 'bg-gradient-to-r from-rose-500 to-pink-600',
    textColor: 'text-white',
    action: () => {
      const tenantId = route.params.id as string
      if (tenantId) {
        router.push(`/school/${tenantId}/scolarite`)
      } else {
        router.push('/scolarite')
      }
    }
  }
])

const adminActions = ref([
  {
    name: 'Activer l\'établissement',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    style: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50',
    action: () => activateTenant()
  },
  {
    name: 'Suspendre l\'établissement',
    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    style: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50',
    action: () => suspendTenant()
  },
  {
    name: 'Supprimer l\'établissement',
    icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    style: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50',
    action: () => deleteTenant()
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

function getStatusBannerClass(status: string): string {
  const classes = {
    'ACTIVE': 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600',
    'PENDING': 'bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600',
    'TRIAL': 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600',
    'SUSPENDED': 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600'
  }
  return classes[status as keyof typeof classes] || classes.PENDING
}

function getStatusBadgeClass(status: string): string {
  const classes = {
    'ACTIVE': 'bg-green-100/80 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium',
    'PENDING': 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium',
    'TRIAL': 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium',
    'SUSPENDED': 'bg-red-100/80 text-red-800 dark:bg-red-900/50 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium'
  }
  return classes[status as keyof typeof classes] || classes.PENDING
}

function getStatusLabel(status: string): string {
  const labels = {
    'ACTIVE': 'Établissement Actif',
    'PENDING': 'En attente d\'activation',
    'TRIAL': 'Période d\'essai',
    'SUSPENDED': 'Établissement suspendu'
  }
  return labels[status as keyof typeof labels] || 'Statut inconnu'
}

function getUsagePercentage(current?: number, max?: number): number {
  if (!current || !max) return 0
  return Math.round((current / max) * 100)
}

function getDaysUntilExpiry(endDate?: string): number {
  if (!endDate) return 0
  
  const parts = endDate.split('/')
  if (parts.length !== 3) return 0
  
  const expiry = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
  const now = new Date()
  const diffTime = expiry.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Actions
async function refreshData() {
  const tenantId = route.params.id as string
  if (!tenantId) return

  loading.value = true
  try {
    console.log('Loading tenant details for ID:', tenantId)
    
    // Utiliser la vraie API pour récupérer les données du tenant
    const { fetchTenant } = await import('@/services/api')
    const tenantData = await fetchTenant(tenantId)
    
    console.log('Loaded tenant data:', tenantData)
    tenant.value = tenantData

    // Charger les vraies statistiques en parallèle
    await loadRealStats(tenantId)
  } catch (error) {
    console.error('Erreur lors du chargement des détails du tenant:', error)
    
    // En cas d'erreur, essayer de récupérer depuis la liste des tenants
    try {
      const { fetchTenants } = await import('@/services/api')
      const allTenants = await fetchTenants()
      const foundTenant = allTenants.find(t => t.id === tenantId)
      
      if (foundTenant) {
        console.log('Found tenant in list:', foundTenant)
        tenant.value = foundTenant
        // Essayer de charger les stats même en mode fallback
        await loadRealStats(tenantId)
      } else {
        console.error('Tenant not found with ID:', tenantId)
        alert('Établissement non trouvé')
        router.push('/admin/accounts')
      }
    } catch (listError) {
      console.error('Erreur lors du chargement de la liste des tenants:', listError)
      alert('Erreur lors du chargement des données')
    }
  } finally {
    loading.value = false
  }
}

async function loadRealStats(tenantId: string) {
  if (!tenantId) return

  loadingStats.value = true
  try {
    console.log('🔍 Chargement des statistiques réelles pour tenant:', tenantId)
    
    // Importer le service tenant pour les vraies données
    const { tenantAdminService } = await import('@/services/tenantService')
    
    // Charger les statistiques et les limites en parallèle
    const [stats, limits] = await Promise.all([
      tenantAdminService.getTenantStats(tenantId),
      tenantAdminService.getTenantLimits(tenantId)
    ])
    
    console.log('✅ Statistiques réelles chargées:', { stats, limits })
    
    // Combiner les données pour former les statistiques complètes
    realStats.value = {
      studentsCount: stats.studentsCount,
      teachersCount: stats.teachersCount,
      classesCount: stats.classesCount,
      subjectsCount: stats.subjectsCount,
      evaluationsCount: stats.evaluationsCount,
      lastActivity: stats.lastActivity,
      maxStudents: limits.maxStudents,
      maxTeachers: limits.maxTeachers,
      currentStudents: limits.currentStudents,
      currentTeachers: limits.currentTeachers,
      usagePercentage: limits.usagePercentage,
      daysUntilExpiry: tenant.value?.subscription?.endDate 
        ? Math.max(0, Math.ceil((new Date(tenant.value.subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : 365
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des statistiques réelles:', error)
    
    // En cas d'erreur, essayer de charger au moins les statistiques de base
    try {
      const { tenantAdminService } = await import('@/services/tenantService')
      const partialStats = await tenantAdminService.getTenantStats(tenantId)
      
      console.log('⚡ Statistiques partielles chargées:', partialStats)
      realStats.value = {
        ...partialStats,
        maxStudents: 500, // valeurs par défaut
        maxTeachers: 20,
        currentStudents: partialStats.studentsCount || 0,
        currentTeachers: partialStats.teachersCount || 0,
        usagePercentage: {
          students: Math.round((partialStats.studentsCount || 0) / 500 * 100),
          teachers: Math.round((partialStats.teachersCount || 0) / 20 * 100)
        },
        daysUntilExpiry: 365
      }
    } catch (partialError) {
      console.warn('⚠️ Impossible de charger les statistiques:', partialError)
      // Garder les valeurs par défaut du tenant
    }
  } finally {
    loadingStats.value = false
  }
}

function editTenant() {
  router.push(`/admin/accounts?edit=${tenant.value?.id}`)
}

// Gestion du modal de confirmation
function closeConfirmModal() {
  confirmModal.value.show = false
  confirmModal.value.action = ''
}

async function handleConfirmAction() {
  if (!tenant.value) return

  try {
    switch (confirmModal.value.action) {
      case 'activate':
        await performActivation()
        break
      case 'suspend':
        await performSuspension()
        break
      case 'delete':
        await performDeletion()
        break
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Une erreur est survenue lors de l\'opération')
  } finally {
    closeConfirmModal()
  }
}

async function performActivation() {
  if (!tenant.value) return
  
  try {
    console.log('Activating tenant:', tenant.value.id)
    const { updateTenantStatus } = await import('@/services/api')
    await updateTenantStatus(tenant.value.id, 'ACTIVE')
    
    tenant.value.status = 'ACTIVE'
    alert('Établissement activé avec succès')
    
    // Recharger les données pour s'assurer de la cohérence
    await refreshData()
  } catch (error) {
    console.error('Erreur lors de l\'activation:', error)
    alert('Erreur lors de l\'activation de l\'établissement')
  }
}

async function performSuspension() {
  if (!tenant.value) return
  
  try {
    console.log('Suspending tenant:', tenant.value.id)
    const { updateTenantStatus } = await import('@/services/api')
    await updateTenantStatus(tenant.value.id, 'SUSPENDED')
    
    tenant.value.status = 'SUSPENDED'
    alert('Établissement suspendu avec succès')
    
    // Recharger les données pour s'assurer de la cohérence
    await refreshData()
  } catch (error) {
    console.error('Erreur lors de la suspension:', error)
    alert('Erreur lors de la suspension de l\'établissement')
  }
}

async function performDeletion() {
  if (!tenant.value) return
  
  try {
    console.log('Deleting tenant:', tenant.value.id)
    const { deleteTenant } = await import('@/services/api')
    await deleteTenant(tenant.value.id)
    
    alert('Établissement supprimé avec succès')
    router.push('/admin/accounts')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    alert('Erreur lors de la suppression de l\'établissement')
  }
}

function activateTenant() {
  if (!tenant.value) return

  confirmModal.value = {
    show: true,
    title: 'Activer l\'établissement',
    message: `Êtes-vous sûr de vouloir activer l'établissement "${tenant.value.name}" ? Les utilisateurs pourront se connecter.`,
    type: 'success',
    confirmText: 'Activer',
    action: 'activate'
  }
}

function suspendTenant() {
  if (!tenant.value) return

  confirmModal.value = {
    show: true,
    title: 'Suspendre l\'établissement',
    message: `Êtes-vous sûr de vouloir suspendre l'établissement "${tenant.value.name}" ? Les utilisateurs ne pourront plus se connecter.`,
    type: 'warning',
    confirmText: 'Suspendre',
    action: 'suspend'
  }
}

function deleteTenant() {
  if (!tenant.value) return

  confirmModal.value = {
    show: true,
    title: 'Supprimer l\'établissement',
    message: `ATTENTION: Êtes-vous sûr de vouloir supprimer définitivement l'établissement "${tenant.value.name}" ? Cette action est irréversible et supprimera toutes les données associées.`,
    type: 'danger',
    confirmText: 'Supprimer définitivement',
    action: 'delete'
  }
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script> 