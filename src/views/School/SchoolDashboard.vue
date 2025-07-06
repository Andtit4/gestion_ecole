<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Header moderne avec glass effect -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo et nom - plus stylé -->
          <div class="flex items-center group">
            <div class="relative">
              <div class="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
                </svg>
                <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {{ school?.name || 'Super Administration' }}
              </h1>
              <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ school?.domain || 'super-admin' }}.schools.com</p>
            </div>
          </div>

          <!-- Actions utilisateur - redesignées -->
          <div class="flex items-center space-x-6">
            <!-- Notifications avec badge animé -->
            <button class="relative p-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
              <svg class="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5M9 17H4l3.5-3.5M12 3v18M3 12h18" />
              </svg>
              <span class="absolute top-2 right-2 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              <span class="absolute top-2 right-2 h-3 w-3 bg-red-400 rounded-full animate-ping"></span>
            </button>

            <!-- Menu utilisateur élégant -->
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center p-2 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
              >
                <div class="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <span class="text-white font-bold text-sm">{{ adminInitials }}</span>
                </div>
                <div class="ml-3 text-left hidden sm:block">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ school?.admin?.firstName || 'Super' }} {{ school?.admin?.lastName || 'Admin' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ school?.admin?.title || 'Administrateur' }}</p>
                </div>
                <svg class="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Menu déroulant avec animation -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div 
                  v-if="showUserMenu"
                  class="absolute right-0 mt-3 w-64 rounded-2xl shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl ring-1 ring-black/10 dark:ring-white/10 z-50 border border-white/20 dark:border-gray-700/30"
                >
                  <div class="p-2">
                    <a href="#" class="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                      <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mon Profil
                    </a>
                    <a href="#" class="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                      <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Paramètres
                    </a>
                    <hr class="my-2 border-gray-200 dark:border-gray-600">
                    <button 
                      @click="logout"
                      class="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal avec animations -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Welcome Banner pour Super Admin -->
      <div v-if="isSuperAdmin" class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-3xl font-bold text-white mb-2">Bienvenue, Super Administrateur</h2>
              <p class="text-indigo-100 text-lg">Gérez tous les établissements depuis cette interface centralisée</p>
            </div>
            <div class="hidden md:block">
              <svg class="w-20 h-20 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 8.399 9.939L12 19.5l1.601-2.561C18.16 16.739 22 12.55 22 7V7l-10-5z"/>
              </svg>
            </div>
          </div>
        </div>
        <!-- Particules animées -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
          <div class="absolute top-1/3 right-1/4 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
          <div class="absolute bottom-1/4 left-1/3 w-6 h-6 bg-white/20 rounded-full animate-ping"></div>
        </div>
      </div>

      <!-- Statistiques avec design moderne -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(stat, index) in statsCards" :key="index" 
             class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <!-- Gradient background -->
          <div :class="[
            'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300',
            stat.gradient
          ]"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div :class="[
                'p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200',
                stat.iconBg
              ]">
                <svg class="h-6 w-6" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon" />
                </svg>
              </div>
              <span :class="['text-xs font-medium px-2 py-1 rounded-full', stat.badgeColor]">
                {{ stat.change }}
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
              <p v-if="stat.subtitle" class="text-xs text-gray-500 dark:text-gray-400">{{ stat.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides redesignées -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Actions Rapides</h3>
            <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
              Voir tout →
            </button>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button 
              v-for="(action, index) in quickActions" 
              :key="index"
              @click="action.action"
              class="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <div :class="[
                'w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110',
                action.bgColor
              ]">
                <svg class="w-6 h-6" :class="action.textColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="action.icon" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white block text-center">{{ action.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Grille principale -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Activités récentes modernisées -->
        <div class="lg:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
          <div class="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Activités Récentes</h3>
          </div>
          <div class="p-8">
            <div class="space-y-6">
              <div v-for="(activity, index) in recentActivities" :key="activity.id" 
                   class="flex items-start space-x-4 p-4 rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors group">
                <div :class="[
                  'flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg',
                  activity.type === 'student' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 
                  activity.type === 'grade' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                  'bg-gradient-to-r from-purple-500 to-purple-600'
                ]">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="activity.type === 'student'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    <path v-else-if="activity.type === 'grade'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {{ activity.description }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(activity.timestamp) }}</p>
                </div>
                <div class="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne latérale modernisée -->
        <div class="space-y-6">
          <!-- Informations de l'abonnement -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <div class="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h3 class="text-lg font-bold text-white">Plan d'Abonnement</h3>
              <p class="text-blue-100 text-sm">{{ school?.subscription?.plan || 'Enterprise' }}</p>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Prix mensuel</span>
                <span class="text-lg font-bold text-gray-900 dark:text-white">{{ school?.subscription?.pricePerMonth || 0 }}€</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Fin d'abonnement</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatDate(school?.subscription?.endDate) }}</span>
              </div>
              
              <!-- Barres de progression élégantes -->
              <div class="space-y-4 pt-4">
                <div>
                  <div class="flex justify-between text-xs mb-2">
                    <span class="text-gray-600 dark:text-gray-400 font-medium">Élèves</span>
                    <span class="text-gray-900 dark:text-white font-bold">{{ stats.currentStudents }}/{{ stats.maxStudents }}</span>
                  </div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm transition-all duration-300" 
                      :style="{ width: `${Math.min((stats.currentStudents / stats.maxStudents) * 100, 100)}%` }"
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div class="flex justify-between text-xs mb-2">
                    <span class="text-gray-600 dark:text-gray-400 font-medium">Professeurs</span>
                    <span class="text-gray-900 dark:text-white font-bold">{{ stats.currentTeachers }}/{{ stats.maxTeachers }}</span>
                  </div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm transition-all duration-300" 
                      :style="{ width: `${Math.min((stats.currentTeachers / stats.maxTeachers) * 100, 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Événements à venir -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Événements à Venir</h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div v-for="event in upcomingEvents" :key="event.id" 
                     class="flex items-start space-x-3 p-3 rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors group">
                  <div class="flex-shrink-0 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mt-2 shadow-sm"></div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ event.title }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(event.date) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Tenant } from '@/types/tenant'

const router = useRouter()

// État
const showUserMenu = ref(false)
const school = ref<Tenant | null>(null)

// Computed pour détecter le super-admin
const isSuperAdmin = computed(() => {
  return school.value?.domain === 'super-admin' || 
         school.value?.name?.includes('Super') ||
         !school.value
})

// Statistiques améliorées
const stats = ref({
  currentStudents: 324,
  maxStudents: 500,
  currentTeachers: 28,
  maxTeachers: 50,
  totalClasses: 18,
  bulletinsGenerated: 156
})

// Cartes de statistiques avec design moderne
const statsCards = computed(() => [
  {
    label: 'Élèves',
    value: stats.value.currentStudents,
    subtitle: `/ ${stats.value.maxStudents} max`,
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
    iconColor: 'text-white',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    change: '+5.2%',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  {
    label: 'Professeurs',
    value: stats.value.currentTeachers,
    subtitle: `/ ${stats.value.maxTeachers} max`,
    icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z',
    iconBg: 'bg-gradient-to-r from-green-500 to-green-600',
    iconColor: 'text-white',
    gradient: 'bg-gradient-to-r from-green-500 to-green-600',
    change: '+3.1%',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  {
    label: 'Classes',
    value: stats.value.totalClasses,
    subtitle: 'actives',
    icon: 'M19 14l-7 7m0 0l-7-7m7 7V3',
    iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    iconColor: 'text-white',
    gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    change: '+2.5%',
    badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  },
  {
    label: 'Bulletins',
    value: stats.value.bulletinsGenerated,
    subtitle: 'ce mois',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
    iconColor: 'text-white',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    change: '+12.3%',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  }
])

// Activités récentes
const recentActivities = ref([
  {
    id: 1,
    type: 'student',
    description: 'Nouvel élève inscrit: Marie Dupont (4ème A)',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    type: 'grade',
    description: 'Notes ajoutées pour le contrôle de mathématiques (3ème B)',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: 3,
    type: 'system',
    description: 'Bulletin généré pour Jean Martin (2nde C)',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: 4,
    type: 'student',
    description: 'Absence signalée: Pierre Lefebvre (1ère S)',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
  }
])

// Événements à venir
const upcomingEvents = ref([
  {
    id: 1,
    title: 'Conseil de classe 3ème A',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    title: 'Réunion parents-professeurs',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    title: 'Contrôle de français (4ème)',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
])

// Actions rapides
const quickActions = ref([
  {
    name: 'Établissements',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6',
    bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    textColor: 'text-white',
    action: () => router.push('/admin/accounts')
  },
  {
    name: 'Utilisateurs',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
    textColor: 'text-white',
    action: () => router.push('/users')
  },
  {
    name: 'Gérer Élèves',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
    textColor: 'text-white',
    action: () => {
      // Utiliser l'ID de l'école connectée ou un ID temporaire pour tester
      const tenantId = school.value?._id || '507f1f77bcf86cd799439011'
      const targetUrl = `/school/${tenantId}/students`
      console.log('Redirection vers les élèves:', targetUrl)
      router.push(targetUrl)
    }
  },
  {
    name: 'Professeurs',
    icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    bgColor: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    textColor: 'text-white',
    action: () => {
      // Utiliser l'ID de l'école connectée ou un ID temporaire pour tester
      const tenantId = school.value?._id || '507f1f77bcf86cd799439011'
      const targetUrl = `/school/${tenantId}/teachers`
      console.log('Redirection vers les professeurs:', targetUrl)
      router.push(targetUrl)
    }
  },
  {
    name: 'Matières',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    textColor: 'text-white',
    action: () => {
      // Utiliser l'ID de l'école connectée ou un ID temporaire pour tester
      const tenantId = school.value?._id || '507f1f77bcf86cd799439011'
      const targetUrl = `/school/${tenantId}/subjects`
      console.log('Redirection vers les matières:', targetUrl)
      router.push(targetUrl)
    }
  },
  {
    name: 'Structure',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    bgColor: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    textColor: 'text-white',
    action: () => {
      // Utiliser l'ID de l'école connectée ou un ID temporaire pour tester
      const tenantId = school.value?._id || '507f1f77bcf86cd799439011'
      const targetUrl = `/school/${tenantId}/structure`
      console.log('Redirection vers la structure académique:', targetUrl)
      router.push(targetUrl)
    }
  },
  {
    name: 'Rapports',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    bgColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
    textColor: 'text-white',
    action: () => console.log('Rapports')
  }
])

// Computed
const adminInitials = computed(() => {
  if (!school.value?.admin) return 'SA'
  const firstName = school.value.admin.firstName || ''
  const lastName = school.value.admin.lastName || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
})

// Méthodes
function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return ''
  
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Aujourd\'hui'
  } else if (diffDays === 1) {
    return date < now ? 'Hier' : 'Demain'
  } else if (diffDays < 7) {
    return date < now ? `Il y a ${diffDays} jours` : `Dans ${diffDays} jours`
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

function logout() {
  localStorage.removeItem('currentSchool')
  router.push('/school-login')
}

// Charger les données de l'école
function loadSchoolData() {
  // D'abord essayer de récupérer depuis auth_state (format moderne)
  const authState = localStorage.getItem('auth_state')
  console.log('Auth state from localStorage:', authState)
  
  if (authState) {
    try {
      const authData = JSON.parse(authState)
      console.log('Parsed auth data:', authData)
      
      if (authData.currentSchool) {
        school.value = authData.currentSchool
        console.log('Loaded school from auth_state:', school.value)
        console.log('School _id:', school.value?._id)
        
        // Sauvegarder aussi dans l'ancien format pour compatibilité
        localStorage.setItem('currentSchool', JSON.stringify(school.value))
        
        // Mettre à jour les stats avec les données réelles
        if (school.value?.subscription) {
          stats.value.maxStudents = school.value.subscription.maxStudents
          stats.value.maxTeachers = school.value.subscription.maxTeachers
        }
        return
      }
    } catch (error) {
      console.error('Erreur lors du parsing auth_state:', error)
    }
  }
  
  // Fallback vers l'ancien format currentSchool
  const schoolData = localStorage.getItem('currentSchool')
  console.log('Raw school data from localStorage (fallback):', schoolData)
  
  if (schoolData) {
    try {
      school.value = JSON.parse(schoolData)
      console.log('Parsed school object (fallback):', school.value)
      console.log('School _id:', school.value?._id)
      console.log('All school keys:', school.value ? Object.keys(school.value) : 'null')
      
      // Mettre à jour les stats avec les données réelles
      if (school.value?.subscription) {
        stats.value.maxStudents = school.value.subscription.maxStudents
        stats.value.maxTeachers = school.value.subscription.maxTeachers
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de l\'école:', error)
      router.push('/school-login')
    }
  } else {
    console.log('No school data found in localStorage')
    router.push('/school-login')
  }
}

// Fermer le menu utilisateur quand on clique ailleurs
function handleClickOutside(event: Event) {
  if (showUserMenu.value && !(event.target as Element)?.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadSchoolData()
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Animations */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 