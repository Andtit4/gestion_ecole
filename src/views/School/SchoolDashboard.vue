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
        <div v-for="stat in statsCards" :key="stat.label" 
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

      <!-- Section Administration des Licences pour Super Admin -->
      <div v-if="isSuperAdmin" class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <svg class="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Administration des Licences
            </h3>
            <button 
              @click="showLicenseModal = true"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouveau Plan
            </button>
          </div>
          
          <!-- Statistiques globales -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm font-medium">Total Établissements</p>
                  <p class="text-3xl font-bold">{{ globalStats.totalTenants }}</p>
                </div>
                <svg class="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
                </svg>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm font-medium">Abonnements Actifs</p>
                  <p class="text-3xl font-bold">{{ globalStats.activeSubscriptions }}</p>
                </div>
                <svg class="w-12 h-12 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-yellow-100 text-sm font-medium">Expirent Bientôt</p>
                  <p class="text-3xl font-bold">{{ globalStats.expiringSoon }}</p>
                </div>
                <svg class="w-12 h-12 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.182 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-100 text-sm font-medium">Revenus Mensuel</p>
                  <p class="text-3xl font-bold">{{ formatPrice(globalStats.monthlyRevenue) }}</p>
                </div>
                <svg class="w-12 h-12 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Actions rapides pour l'administration -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              @click="router.push('/plan-management')"
              class="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <div class="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110 bg-gradient-to-r from-indigo-500 to-purple-600">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white block text-center">Gérer Plans</span>
            </button>

            <button 
              @click="router.push('/school/subscriptions')"
              class="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <div class="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110 bg-gradient-to-r from-blue-500 to-cyan-600">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white block text-center">Gérer Abonnements</span>
            </button>

<!-- Bouton Établissements supprimé - remplacé par Rapports dans les actions rapides -->

            <button 
              @click="showReportsModal = true"
              class="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <div class="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110 bg-gradient-to-r from-green-500 to-teal-600">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white block text-center">Rapports</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Actions rapides redesignées (pour tous les utilisateurs) -->
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
              v-for="action in quickActions" 
              :key="action.name"
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
              <div v-for="activity in recentActivities" :key="activity.id" 
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

    <!-- Modal Gestion des Licences -->
    <div v-if="showLicenseModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Plans d'Abonnement</h3>
            <button @click="showLicenseModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Tableau des plans existants -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Plans Existants</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th class="px-6 py-3">Plan</th>
                    <th class="px-6 py-3">Prix/Mois</th>
                    <th class="px-6 py-3">Élèves Max</th>
                    <th class="px-6 py-3">Professeurs Max</th>
                    <th class="px-6 py-3">Établissements</th>
                    <th class="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="plan in availablePlans" :key="plan.key" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ plan.name }}</td>
                    <td class="px-6 py-4">{{ formatPrice(plan.pricePerMonth) }}</td>
                    <td class="px-6 py-4">{{ plan.maxStudents === 999999 ? 'Illimité' : plan.maxStudents }}</td>
                    <td class="px-6 py-4">{{ plan.maxTeachers === 999999 ? 'Illimité' : plan.maxTeachers }}</td>
                    <td class="px-6 py-4">{{ plan.tenantsCount || 0 }}</td>
                    <td class="px-6 py-4">
                      <button class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                        Modifier
                      </button>
                      <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de gestion des établissements -->
    <div v-if="showTenantListModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden border border-white/20 dark:border-gray-700/30">
        <!-- Header du modal -->
        <div class="p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
              </svg>
              <div>
                <h3 class="text-2xl font-bold text-white">Gestion des Établissements</h3>
                <p class="text-indigo-100 text-sm">Administrer tous les établissements inscrits sur la plateforme</p>
              </div>
            </div>
            <button 
              @click="closeTenantModal"
              class="p-2 hover:bg-white/20 rounded-2xl transition-colors"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Statistiques rapides -->
        <div class="p-6 bg-gray-50/50 dark:bg-gray-700/30">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{{ tenants.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
              <div class="flex items-center">
                <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Actifs</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{{ activeTenants }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
              <div class="flex items-center">
                <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.182 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Suspendus</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{{ suspendedTenants }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
              <div class="flex items-center">
                <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Revenus</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{{ totalRevenue }} FCFA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu principal du modal -->
        <div class="flex-1 overflow-y-auto">
          <!-- Barre de recherche et filtres -->
          <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div class="flex-1 max-w-md">
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Rechercher un établissement..."
                    class="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:text-white backdrop-blur"
                  >
                </div>
              </div>
              
              <div class="flex gap-3">
                <select 
                  v-model="statusFilter"
                  class="px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:text-white backdrop-blur"
                >
                  <option value="">Tous les statuts</option>
                  <option value="ACTIVE">Actifs</option>
                  <option value="SUSPENDED">Suspendus</option>
                  <option value="PENDING">En attente</option>
                  <option value="TRIAL">Essai</option>
                </select>
                
                <select 
                  v-model="planFilter"
                  class="px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:text-white backdrop-blur"
                >
                  <option value="">Tous les plans</option>
                  <option value="basic">Basique</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                
                <button
                  @click="refreshTenants"
                  class="px-4 py-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-2xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Liste des établissements -->
          <div class="p-6">
            <!-- État de chargement -->
            <div v-if="loadingTenants" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
              <p class="text-gray-600 dark:text-gray-400">Chargement des établissements...</p>
            </div>

            <!-- Aucun résultat -->
            <div v-else-if="filteredTenants.length === 0" class="text-center py-12">
              <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun établissement trouvé</h3>
              <p class="text-gray-600 dark:text-gray-400">Modifiez vos critères de recherche ou de filtrage.</p>
            </div>

            <!-- Tableau des établissements -->
            <div v-else class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50/50 dark:bg-gray-700/50">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Établissement
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statut
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Plan
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Utilisation
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Expire le
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    <tr 
                      v-for="tenant in filteredTenants" 
                      :key="tenant.id"
                      class="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <!-- Informations de l'établissement -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                              <span class="text-sm font-bold text-white">{{ tenant.name.charAt(0).toUpperCase() }}</span>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                              {{ tenant.name }}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                              {{ tenant.domain }}.schools.com
                            </div>
                            <div class="text-xs text-gray-400 dark:text-gray-500">
                              {{ tenant.city }} • {{ tenant.type }}
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- Statut -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getStatusBadgeClass(tenant.status.toLowerCase())">
                          {{ getStatusDisplayName(tenant.status.toLowerCase()) }}
                        </span>
                      </td>

                      <!-- Plan -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getPlanBadgeClass(tenant.plan)">
                          {{ getPlanDisplayName(tenant.plan) }}
                        </span>
                      </td>

                      <!-- Utilisation -->
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div class="space-y-1">
                          <div class="flex items-center text-xs">
                            <span class="w-16">Élèves:</span>
                            <div class="flex-1 ml-2">
                              <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  class="bg-blue-500 h-2 rounded-full" 
                                  :style="{ width: `${Math.min((tenant.currentStudents / tenant.maxStudents) * 100, 100)}%` }"
                                ></div>
                              </div>
                            </div>
                            <span class="ml-2 text-xs">{{ tenant.currentStudents }}/{{ tenant.maxStudents }}</span>
                          </div>
                          <div class="flex items-center text-xs">
                            <span class="w-16">Profs:</span>
                            <div class="flex-1 ml-2">
                              <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  class="bg-green-500 h-2 rounded-full" 
                                  :style="{ width: `${Math.min((tenant.currentTeachers / tenant.maxTeachers) * 100, 100)}%` }"
                                ></div>
                              </div>
                            </div>
                            <span class="ml-2 text-xs">{{ tenant.currentTeachers }}/{{ tenant.maxTeachers }}</span>
                          </div>
                        </div>
                      </td>

                      <!-- Date d'expiration -->
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {{ tenant.endDate }}
                      </td>

                      <!-- Actions -->
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex items-center space-x-2">
                          <button
                            @click="viewTenantDetails(tenant)"
                            class="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                            title="Voir les détails"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          
                          <button
                            @click="changeTenantPlan(tenant)"
                            class="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                            title="Changer le plan"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </button>

                          <button
                            v-if="tenant.status === 'ACTIVE'"
                            @click="suspendTenant(tenant)"
                            class="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                            title="Suspendre"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>

                          <button
                            v-else-if="tenant.status === 'SUSPENDED'"
                            @click="activateTenant(tenant)"
                            class="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all"
                            title="Réactiver"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="filteredTenants.length > 0" class="px-6 py-4 bg-gray-50/50 dark:bg-gray-700/50 border-t border-gray-200/50 dark:border-gray-700/50">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-700 dark:text-gray-300">
                    Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, filteredTenants.length) }} sur {{ filteredTenants.length }} établissements
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="currentPage = Math.max(1, currentPage - 1)"
                      :disabled="currentPage === 1"
                      class="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Précédent
                    </button>
                    <span class="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      Page {{ currentPage }} sur {{ totalPages }}
                    </span>
                    <button
                      @click="currentPage = Math.min(totalPages, currentPage + 1)"
                      :disabled="currentPage === totalPages"
                      class="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Gestion des Abonnements -->
    <SubscriptionManagementModal 
      v-if="showSubscriptionManagementModal" 
      @close="showSubscriptionManagementModal = false" 
    />

    <!-- Modal de gestion des rapports -->
    <div v-if="showReportsModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden border border-white/20 dark:border-gray-700/30">
        <!-- Header du modal -->
        <div class="p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-green-600 to-teal-600">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <h3 class="text-2xl font-bold text-white">Rapports et Analyses</h3>
                <p class="text-green-100 text-sm">Générez et consultez les rapports détaillés de votre plateforme</p>
              </div>
            </div>
            <button 
              @click="closeReportsModal"
              class="p-2 hover:bg-white/20 rounded-2xl transition-colors"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Statistiques globales -->
        <div class="p-6 bg-gray-50/50 dark:bg-gray-700/30">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Établissements</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{{ reportStats.totalTenants }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
              <div class="flex items-center">
                <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Élèves</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{{ reportStats.totalStudents }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
              <div class="flex items-center">
                <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Professeurs</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{{ reportStats.totalTeachers }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-600/30">
              <div class="flex items-center">
                <div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Revenus Mensuel</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatPriceFCFA(reportStats.monthlyRevenue) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu principal du modal -->
        <div class="flex-1 overflow-y-auto">
          <!-- Types de rapports -->
          <div class="p-6">
            <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Types de Rapports Disponibles</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Rapport des Abonnements -->
              <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all">
                <div class="flex items-center mb-4">
                  <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h5 class="font-bold text-gray-900 dark:text-white">Abonnements</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Plans et revenus</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Analyse des abonnements, revenus par plan et prédictions financières.</p>
                <button 
                  @click="generateSubscriptionReport"
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Générer
                </button>
              </div>

              <!-- Rapport des Utilisateurs -->
              <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all">
                <div class="flex items-center mb-4">
                  <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h5 class="font-bold text-gray-900 dark:text-white">Utilisateurs</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Élèves et Professeurs</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Statistiques d'utilisation, inscriptions et activité des utilisateurs.</p>
                <button 
                  @click="generateUsersReport"
                  class="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Générer
                </button>
              </div>

              <!-- Rapport Financier -->
              <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all">
                <div class="flex items-center mb-4">
                  <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h5 class="font-bold text-gray-900 dark:text-white">Financier</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Revenus et tendances</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Analyse financière complète avec graphiques de tendances et prévisions.</p>
                <button 
                  @click="generateFinancialReport"
                  class="w-full px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Générer
                </button>
              </div>

              <!-- Rapport d'Activité -->
              <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all">
                <div class="flex items-center mb-4">
                  <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h5 class="font-bold text-gray-900 dark:text-white">Activité</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Usage plateforme</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Rapport d'activité avec connexions, utilisation des fonctionnalités et performance.</p>
                <button 
                  @click="generateActivityReport"
                  class="w-full px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                >
                  Générer
                </button>
              </div>

              <!-- Rapport Personnalisé -->
              <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all">
                <div class="flex items-center mb-4">
                  <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h5 class="font-bold text-gray-900 dark:text-white">Personnalisé</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Votre choix</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Créez un rapport sur mesure en sélectionnant les données qui vous intéressent.</p>
                <button 
                  @click="generateCustomReport"
                  class="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Configurer
                </button>
              </div>

              <!-- Rapport d'Exportation -->
              <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/30 hover:shadow-lg transition-all">
                <div class="flex items-center mb-4">
                  <div class="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl">
                    <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h5 class="font-bold text-gray-900 dark:text-white">Exportation</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">CSV, PDF, Excel</p>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Exportez toutes vos données dans différents formats pour utilisation externe.</p>
                <button 
                  @click="generateExportReport"
                  class="w-full px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                >
                  Exporter
                </button>
              </div>
            </div>
          </div>

          <!-- Historique des rapports -->
          <div class="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Rapports Récents</h4>
            
            <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50/50 dark:bg-gray-700/50">
                    <tr>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Rapport
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Généré le
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statut
                      </th>
                      <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    <tr 
                      v-for="report in recentReports" 
                      :key="report.id"
                      class="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ report.name }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">{{ report.description }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getReportTypeBadgeClass(report.type)">
                          {{ getReportTypeDisplayName(report.type) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {{ formatDate(report.createdAt) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getReportStatusBadgeClass(report.status)">
                          {{ getReportStatusDisplayName(report.status) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex items-center space-x-2">
                          <button
                            v-if="report.status === 'completed'"
                            @click="downloadReport(report)"
                            class="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                            title="Télécharger"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          
                          <button
                            @click="viewReport(report)"
                            class="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all"
                            title="Visualiser"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          <button
                            @click="deleteReport(report)"
                            class="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Tenant } from '@/types/tenant'
import { fetchTenants, updateTenantStatus, type TenantListItem } from '@/services/api'
import SubscriptionManagementModal from '@/components/subscription/SubscriptionManagementModal.vue'

const router = useRouter()

// État
const showUserMenu = ref(false)
const school = ref<Tenant | null>(null)

// État pour les modales d'administration
const showLicenseModal = ref(false)
const showTenantListModal = ref(false)
const showSubscriptionManagementModal = ref(false)
const showReportsModal = ref(false)

// État pour la gestion des établissements
const tenants = ref<any[]>([])
const loadingTenants = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const planFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// État pour la gestion des tenants - SUPPRIMER LES DOUBLONS
// const tenants = ref([])
// const tenantSearch = ref('')
// const tenantPlanFilter = ref('')
// const tenantStatusFilter = ref('')
// const currentPage = ref(1)
// const pageSize = ref(10)
// const totalTenants = ref(0)

// Computed properties pour les établissements
const activeTenants = computed(() => 
  tenants.value.filter(t => t.status === 'ACTIVE').length
)

const suspendedTenants = computed(() => 
  tenants.value.filter(t => t.status === 'SUSPENDED').length
)

const totalRevenue = computed(() => {
  const total = tenants.value.reduce((sum, tenant) => {
    const plan = tenant.plan || 'basic'
    const prices: Record<string, number> = { basic: 50000, standard: 100000, premium: 200000, enterprise: 500000 }
    return sum + (prices[plan] || 50000)
  }, 0)
  return new Intl.NumberFormat('fr-FR').format(total)
})

const filteredTenants = computed(() => {
  let filtered = tenants.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tenant => 
      tenant.name?.toLowerCase().includes(query) ||
      tenant.domain?.toLowerCase().includes(query) ||
      tenant.city?.toLowerCase().includes(query) ||
      tenant.adminEmail?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(tenant => 
      tenant.status === statusFilter.value
    )
  }

  if (planFilter.value) {
    filtered = filtered.filter(tenant => 
      tenant.plan === planFilter.value
    )
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredTenants.value.length / itemsPerPage.value)
})

// Computed pour détecter le super-admin
const isSuperAdmin = computed(() => {
  return school.value?.domain === 'super-admin' || 
         school.value?.name?.includes('Super') ||
         !school.value
})

// Statistiques globales pour super admin
const globalStats = ref({
  totalTenants: 0,
  activeSubscriptions: 0,
  expiringSoon: 0,
  monthlyRevenue: 0
})

// Plans disponibles
const availablePlans = ref([
  {
    key: 'starter',
    name: 'Plan Starter',
    pricePerMonth: 5000,
    maxStudents: 50,
    maxTeachers: 5,
    tenantsCount: 0
  },
  {
    key: 'standard', 
    name: 'Plan Standard',
    pricePerMonth: 10000,
    maxStudents: 200,
    maxTeachers: 20,
    tenantsCount: 0
  },
  {
    key: 'enterprise',
    name: 'Plan Enterprise', 
    pricePerMonth: 150000,
    maxStudents: 999999,
    maxTeachers: 999999,
    tenantsCount: 0
  }
])

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
    name: 'Utilisateurs',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
    textColor: 'text-white',
    action: () => router.push('/users')
  },
  {
    name: 'Établissements',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6',
    bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    textColor: 'text-white',
    action: () => router.push('/admin/accounts')
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
    action: () => showReportsModal.value = true
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

// Nouvelles méthodes pour l'administration des licences
function formatPrice(price: number): string {
  return `${(price / 100).toFixed(0)} FCFA`
}

function formatPriceFCFA(price: number): string {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0 
  }).format(price)
}

// Variables pour les rapports
const reportStats = ref({
  totalTenants: 0,
  totalStudents: 0,
  totalTeachers: 0,
  monthlyRevenue: 0
})

const recentReports = ref([
  {
    id: '1',
    name: 'Rapport Mensuel Novembre 2024',
    description: 'Analyse complète des abonnements et revenus',
    type: 'subscription',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    name: 'Rapport Utilisateurs Q4 2024',
    description: 'Statistiques des élèves et professeurs',
    type: 'users',
    status: 'completed',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    name: 'Analyse Financière Trimestrielle',
    description: 'Revenus et prévisions financières',
    type: 'financial',
    status: 'generating',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
])

function getPlanBadgeClass(plan: string): string {
  switch (plan) {
    case 'starter':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'standard':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'enterprise':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    default:
      return 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

function getPlanDisplayName(plan: string): string {
  switch (plan) {
    case 'starter': return 'Starter'
    case 'standard': return 'Standard'
    case 'enterprise': return 'Enterprise'
    default: return 'Inconnu'
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'active':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'suspended':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    case 'trial':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    default:
      return 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

function getStatusDisplayName(status: string): string {
  switch (status) {
    case 'active': return 'Actif'
    case 'suspended': return 'Suspendu'
    case 'trial': return 'Essai'
    default: return 'Inconnu'
  }
}

function changeTenantPlan(tenant: any) {
  console.log('Changer le plan pour:', tenant.name)
  // Ici on ouvrirait une modal pour changer le plan
}

function extendSubscription(tenant: any) {
  console.log('Prolonger l\'abonnement pour:', tenant.name)
  // Ici on appellerait l'API pour prolonger l'abonnement
}

function generateReport() {
  console.log('Génération du rapport...')
  // Ici on générerait un rapport des abonnements
}

// Charger les statistiques globales pour super admin
async function loadGlobalStats() {
  if (isSuperAdmin.value) {
    try {
      // Simuler des statistiques
      globalStats.value = {
        totalTenants: 45,
        activeSubscriptions: 42,
        expiringSoon: 5,
        monthlyRevenue: 1250000 // en centimes
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques globales:', error)
    }
  }
}

// Nouvelles fonctions pour la gestion des établissements
async function loadTenants() {
  loadingTenants.value = true
  try {
    const { fetchTenants } = await import('@/services/api')
    const tenantsData = await fetchTenants()
    tenants.value = tenantsData
  } catch (error) {
    console.error('Erreur lors du chargement des établissements:', error)
    // Données de fallback pour le développement
    tenants.value = [
      {
        id: '1',
        name: 'École Primaire Sainte Marie',
        domain: 'sainte-marie',
        status: 'ACTIVE',
        plan: 'standard',
        currentStudents: 120,
        maxStudents: 200,
        currentTeachers: 12,
        maxTeachers: 20,
        endDate: '31/12/2024',
        createdAt: '15/01/2024',
        adminEmail: 'admin@sainte-marie.com',
        city: 'Dakar',
        type: 'École Primaire'
      },
      {
        id: '2', 
        name: 'Collège Moderne de Rufisque',
        domain: 'college-rufisque',
        status: 'ACTIVE',
        plan: 'premium',
        currentStudents: 350,
        maxStudents: 500,
        currentTeachers: 28,
        maxTeachers: 50,
        endDate: '28/02/2025',
        createdAt: '01/09/2023',
        adminEmail: 'direction@college-rufisque.sn',
        city: 'Rufisque',
        type: 'Collège'
      },
      {
        id: '3',
        name: 'Lycée Technique de Thiès',
        domain: 'lycee-thies',
        status: 'SUSPENDED',
        plan: 'basic',
        currentStudents: 45,
        maxStudents: 100,
        currentTeachers: 8,
        maxTeachers: 10,
        endDate: '15/11/2024',
        createdAt: '20/10/2023',
        adminEmail: 'admin@lycee-thies.sn',
        city: 'Thiès',
        type: 'Lycée Technique'
      }
    ]
  } finally {
    loadingTenants.value = false
  }
}

function refreshTenants() {
  loadTenants()
}

function closeTenantModal() {
  showTenantListModal.value = false
}

async function viewTenantDetails(tenant: any) {
  console.log('Affichage des détails pour:', tenant.name)
  // Ici on pourrait ouvrir un modal avec les détails complets
}

async function activateTenant(tenant: any) {
  try {
    const { updateTenantStatus } = await import('@/services/api')
    await updateTenantStatus(tenant.id, 'ACTIVE')
    
    // Mettre à jour localement
    const index = tenants.value.findIndex(t => t.id === tenant.id)
    if (index !== -1) {
      tenants.value[index].status = 'ACTIVE'
    }
    
    console.log(`Établissement ${tenant.name} réactivé avec succès`)
  } catch (error) {
    console.error('Erreur lors de la réactivation:', error)
  }
}

async function suspendTenant(tenant: any) {
  if (!confirm(`Êtes-vous sûr de vouloir suspendre ${tenant.name}?`)) {
    return
  }
  
  try {
    const { updateTenantStatus } = await import('@/services/api')
    await updateTenantStatus(tenant.id, 'SUSPENDED')
    
    // Mettre à jour localement
    const index = tenants.value.findIndex(t => t.id === tenant.id)
    if (index !== -1) {
      tenants.value[index].status = 'SUSPENDED'
    }
    
    console.log(`Établissement ${tenant.name} suspendu avec succès`)
  } catch (error) {
    console.error('Erreur lors de la suspension:', error)
  }
}

// Nouvelles fonctions pour la gestion des rapports
function closeReportsModal() {
  showReportsModal.value = false
}

async function loadReportStats() {
  try {
    // Simuler le chargement depuis l'API
    const { fetchDashboardStats } = await import('@/services/api')
    const stats = await fetchDashboardStats()
    
    reportStats.value = {
      totalTenants: stats.totalTenants || 45,
      totalStudents: stats.totalStudents || 2456,
      totalTeachers: stats.totalTeachers || 189,
      monthlyRevenue: stats.monthlyRevenue || 12500000
    }
  } catch (error) {
    console.error('Erreur lors du chargement des stats de rapport:', error)
    // Données de fallback
    reportStats.value = {
      totalTenants: 45,
      totalStudents: 2456,
      totalTeachers: 189,
      monthlyRevenue: 12500000
    }
  }
}

function generateSubscriptionReport() {
  console.log('Génération du rapport des abonnements...')
  // Ici on appellerait l'API pour générer le rapport
}

function generateUsersReport() {
  console.log('Génération du rapport des utilisateurs...')
  // Ici on appellerait l'API pour générer le rapport
}

function generateFinancialReport() {
  console.log('Génération du rapport financier...')
  // Ici on appellerait l'API pour générer le rapport
}

function generateActivityReport() {
  console.log('Génération du rapport d\'activité...')
  // Ici on appellerait l'API pour générer le rapport
}

function generateCustomReport() {
  console.log('Configuration du rapport personnalisé...')
  // Ici on ouvrirait un modal de configuration
}

function generateExportReport() {
  console.log('Génération des exports...')
  // Ici on ouvrirait les options d'export
}

function getReportTypeBadgeClass(type: string): string {
  switch (type) {
    case 'subscription':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'users':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'financial':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    case 'activity':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    default:
      return 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

function getReportTypeDisplayName(type: string): string {
  switch (type) {
    case 'subscription': return 'Abonnements'
    case 'users': return 'Utilisateurs'
    case 'financial': return 'Financier'
    case 'activity': return 'Activité'
    default: return 'Autre'
  }
}

function getReportStatusBadgeClass(status: string): string {
  switch (status) {
    case 'completed':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'generating':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'failed':
      return 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

function getReportStatusDisplayName(status: string): string {
  switch (status) {
    case 'completed': return 'Terminé'
    case 'generating': return 'En cours'
    case 'failed': return 'Échec'
    default: return 'Inconnu'
  }
}

function downloadReport(report: any) {
  console.log('Téléchargement du rapport:', report.name)
  // Ici on déclencherait le téléchargement
}

function viewReport(report: any) {
  console.log('Visualisation du rapport:', report.name)
  // Ici on ouvrirait le rapport dans un nouvel onglet ou modal
}

function deleteReport(report: any) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le rapport "${report.name}"?`)) {
    console.log('Suppression du rapport:', report.name)
    // Ici on appellerait l'API pour supprimer le rapport
    const index = recentReports.value.findIndex(r => r.id === report.id)
    if (index !== -1) {
      recentReports.value.splice(index, 1)
    }
  }
}

// Lifecycle
onMounted(() => {
  loadSchoolData()
  document.addEventListener('click', handleClickOutside)
  
  // Charger les données spécifiques aux super admins
  if (isSuperAdmin.value) {
    loadGlobalStats()
    loadReportStats()
    loadTenants()
  }
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