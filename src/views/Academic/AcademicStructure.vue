<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Header moderne avec glass effect -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center group">
            <!-- Bouton retour conditionnel -->
            <button
              v-if="shouldShowBackButton"
              @click="goBack"
              class="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-4 group"
            >
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="relative">
              <div class="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Structure Académique
              </h1>
              <p class="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{{ tenantName ? `${tenantName} - ` : '' }}Gestion complète de l'organisation scolaire</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal avec animations -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Message d'erreur global -->
      <div v-if="error" class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-500 to-red-600 p-6 shadow-2xl">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="relative z-10 flex items-center">
          <svg class="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-white font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Métriques avec design moderne -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Année Scolaire Active -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-blue-500 to-blue-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full py-0.5 pl-2 pr-2.5 text-sm font-medium" :class="currentAcademicYear ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'">
                <div class="w-2 h-2 rounded-full" :class="currentAcademicYear ? 'bg-emerald-500' : 'bg-gray-400'"></div>
                {{ currentAcademicYear ? 'Active' : 'Aucune' }}
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Année Scolaire</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ currentAcademicYear?.name || 'Non définie' }}</p>
              <p v-if="currentAcademicYear" class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(currentAcademicYear.startDate) }} - {{ formatDate(currentAcademicYear.endDate) }}</p>
            </div>
          </div>
        </div>

        <!-- Classes -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full bg-emerald-100 py-0.5 pl-2 pr-2.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Actives
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Classes</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ classes.length }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Classes configurées</p>
            </div>
          </div>
        </div>

        <!-- Matières -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-orange-500 to-orange-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full bg-orange-100 py-0.5 pl-2 pr-2.5 text-sm font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                Disponibles
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Matières</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ subjects.length }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Matières enseignées</p>
            </div>
          </div>
        </div>

        <!-- Emplois du temps -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-purple-500 to-purple-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full bg-purple-100 py-0.5 pl-2 pr-2.5 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                Actifs
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Créneaux EDT</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ schedules.length }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Créneaux programmés</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides redesignées -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Actions Rapides</h3>
            <div class="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span class="font-medium text-sm">Création rapide</span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Créer Année Scolaire -->
            <button 
              @click="openAddAcademicYearModal"
              class="group relative p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-left"
            >
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110 bg-gradient-to-r from-blue-500 to-blue-600">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Année Scolaire</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 text-center">Créer une nouvelle année scolaire avec ses périodes</p>
            </button>

            <!-- Créer Classe -->
            <button 
              @click="openAddClassModal"
              :disabled="academicYears.length === 0"
              class="group relative p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Classe</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 text-center">{{ academicYears.length === 0 ? 'Créez d\'abord une année scolaire' : 'Ajouter une nouvelle classe ou niveau' }}</p>
            </button>

            <!-- Créer Emploi du temps -->
            <button 
              @click="openAddScheduleModal"
              :disabled="classes.length === 0"
              class="group relative p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110 bg-gradient-to-r from-purple-500 to-purple-600">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Emploi du Temps</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 text-center">{{ classes.length === 0 ? 'Créez d\'abord des classes' : 'Programmer un nouveau créneau horaire' }}</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Grille principale -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Années Scolaires -->
        <div class="lg:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
          <div class="p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-white flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  Années Scolaires
                </h3>
                <p class="text-blue-100 text-sm">Gestion des années scolaires et périodes d'évaluation</p>
              </div>
              <button
                @click="openAddAcademicYearModal"
                class="p-3 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="p-8">
            <div v-if="loading.academicYears" class="flex items-center justify-center py-12">
              <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Chargement des années scolaires...</p>
              </div>
            </div>

            <div v-else-if="academicYears.length === 0" class="text-center py-12">
              <div class="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Aucune année scolaire</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">Commencez par créer votre première année scolaire</p>
              <button
                @click="openAddAcademicYearModal"
                class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Créer une année scolaire
              </button>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="year in academicYears"
                :key="year._id"
                class="rounded-2xl border transition-all duration-300 hover:shadow-lg group"
                :class="year.isActive ? 'border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'"
              >
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="font-bold text-lg text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ year.name }}</h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(year.startDate) }} - {{ formatDate(year.endDate) }}</p>
                    </div>
                    <span
                      v-if="year.isActive"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                      <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                  
                  <div class="space-y-3">
                    <h5 class="font-semibold text-gray-700 dark:text-gray-300 text-sm">Périodes d'évaluation</h5>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        v-for="period in year.periods"
                        :key="period.name"
                        class="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border transition-colors"
                        :class="period.isActive ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700' : 'border-gray-200 dark:border-gray-700'"
                      >
                        <span class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ period.name }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatDate(period.startDate) }} - {{ formatDate(period.endDate) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne latérale -->
        <div class="space-y-6">
          <!-- Classes et Niveaux -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <div class="p-6 bg-gradient-to-r from-emerald-600 to-emerald-700">
              <h3 class="text-lg font-bold text-white flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
                Classes
              </h3>
              <p class="text-emerald-100 text-sm">{{ classes.length }} classes configurées</p>
            </div>
            <div class="p-6">
              <div v-if="loading.classes" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-emerald-600 border-t-transparent"></div>
              </div>
              
              <div v-else-if="classes.length === 0" class="text-center py-8">
                <div class="bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Aucune classe</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {{ academicYears.length === 0 ? 'Créez d\'abord une année scolaire' : 'Commencez par créer vos classes' }}
                </p>
                <button
                  @click="openAddClassModal"
                  :disabled="academicYears.length === 0"
                  class="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Créer une classe
                </button>
              </div>

              <div v-else class="space-y-4 max-h-80 overflow-y-auto">
                <div
                  v-for="classItem in classes.slice(0, 5)"
                  :key="classItem._id"
                  class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white/50 dark:bg-gray-800/50"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-800 dark:text-white">{{ classItem.name }}</h4>
                    <span :class="getSchoolTypeBadgeClass(classItem.schoolType)" class="rounded-full px-2 py-1 text-xs font-medium">
                      {{ getSchoolTypeLabel(classItem.schoolType) }}
                    </span>
                  </div>
                  <div class="space-y-1 text-xs">
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Niveau:</span>
                      <span class="font-medium text-gray-800 dark:text-white">{{ classItem.level }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Capacité:</span>
                      <span class="font-medium text-gray-800 dark:text-white">{{ classItem.capacity }} élèves</span>
                    </div>
                  </div>
                </div>
                
                <button
                  v-if="classes.length > 5"
                  @click="openAddClassModal"
                  class="w-full text-center py-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm transition-colors"
                >
                  Voir toutes les classes ({{ classes.length }})
                </button>
              </div>
            </div>
          </div>

          <!-- Emplois du temps -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
            <div class="p-6 bg-gradient-to-r from-purple-600 to-purple-700">
              <h3 class="text-lg font-bold text-white flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Emplois du Temps
              </h3>
              <p class="text-purple-100 text-sm">{{ schedules.length }} créneaux programmés</p>
            </div>
            <div class="p-6">
              <div v-if="loading.schedules" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-purple-600 border-t-transparent"></div>
              </div>
              
              <div v-else-if="schedules.length === 0" class="text-center py-8">
                <div class="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Aucun créneau</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {{ classes.length === 0 ? 'Créez d\'abord des classes' : 'Programmez vos premiers créneaux' }}
                </p>
                <button
                  @click="openAddScheduleModal"
                  :disabled="classes.length === 0"
                  class="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Créer un créneau
                </button>
              </div>

              <div v-else class="space-y-4 max-h-80 overflow-y-auto">
                <div
                  v-for="schedule in schedules.slice(0, 4)"
                  :key="schedule._id"
                  class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600 bg-white/50 dark:bg-gray-800/50"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-800 dark:text-white text-sm">{{ schedule.name }}</h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ getDayOfWeekLabel(schedule.dayOfWeek) }}</p>
                    </div>
                    <div
                      v-if="schedule.color"
                      class="w-3 h-3 rounded-full ml-2"
                      :style="{ backgroundColor: schedule.color }"
                    ></div>
                  </div>
                  <div class="space-y-1 text-xs">
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Horaire:</span>
                      <span class="font-medium text-gray-800 dark:text-white">{{ schedule.startTime }} - {{ schedule.endTime }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">Type:</span>
                      <span class="font-medium text-gray-800 dark:text-white">{{ getScheduleTypeLabel(schedule.type) }}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  v-if="schedules.length > 4"
                  @click="openAddScheduleModal"
                  class="w-full text-center py-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm transition-colors"
                >
                  Voir tous les créneaux ({{ schedules.length }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modaux -->
    <AddAcademicYearModal
      :isOpen="modals.addAcademicYear"
      @close="closeAddAcademicYearModal"
      @submit="handleCreateAcademicYear"
    />

    <AddClassModal
      :isOpen="modals.addClass"
      :academicYears="academicYears"
      :tenantId="TENANT_ID"
      :tenantName="tenantName"
      @close="closeAddClassModal"
      @submit="handleCreateClass"
    />

    <AddScheduleModal
      :isOpen="modals.addSchedule"
      :academicYears="academicYears"
      :classes="classes"
      @close="closeAddScheduleModal"
      @submit="handleCreateSchedule"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddAcademicYearModal from '@/components/academic/AddAcademicYearModal.vue'
import AddClassModal from '@/components/academic/AddClassModal.vue'
import AddScheduleModal from '@/components/academic/AddScheduleModal.vue'

import type { 
  AcademicYear, 
  Class, 
  Schedule, 
  CreateAcademicYearDto, 
  CreateClassDto, 
  CreateScheduleDto 
} from '@/types/academic'

import { 
  fetchAcademicYears,
  fetchActiveAcademicYear,
  fetchClasses,
  fetchSchedules,
  createAcademicYear,
  createClass,
  createSchedule,
  formatDate,
  formatDuration,
  getSchoolTypeLabel,
  getDayOfWeekLabel,
  getScheduleTypeLabel
} from '@/services/academicService'

// Router et route
const route = useRoute()
const router = useRouter()

// Mock tenant ID (à remplacer par la vraie logique tenant)
const TENANT_ID = route.params.tenantId as string || '507f1f77bcf86cd799439011'

const currentPageTitle = ref('Structure Académique')

// Détection si on doit afficher le bouton retour (si on a un tenantId dans l'URL)
const shouldShowBackButton = computed(() => !!route.params.tenantId)

// Nom du tenant pour l'affichage
const tenantName = computed(() => {
  if (route.params.tenantId) {
    // Récupérer depuis le localStorage ou une autre source
    const currentSchool = localStorage.getItem('currentSchool')
    if (currentSchool) {
      try {
        const school = JSON.parse(currentSchool)
        return school.name
      } catch (e) {
        // Ignore
      }
    }
    return `Établissement ${route.params.tenantId}`
  }
  return ''
})

// Fonction pour revenir en arrière
const goBack = () => {
  console.log('=== GoBack Function Called ===')
  console.log('Current route:', route)
  console.log('Route params:', route.params)
  console.log('Route name:', route.name)
  console.log('Route path:', route.path)
  
  try {
    const tenantId = route.params.tenantId as string
    console.log('Extracted tenantId:', tenantId, typeof tenantId)
    
    if (tenantId && tenantId !== 'undefined' && tenantId.trim() !== '') {
      // Retourner vers la page de détail du tenant
      const targetPath = `/tenant/${tenantId}`
      console.log('Navigating to tenant detail:', targetPath)
      router.push(targetPath).catch(err => {
        console.error('Router.push error:', err)
        // Fallback sur router.back si push échoue
        router.back()
      })
    } else {
      // Retour navigateur standard
      console.log('Using browser back - no valid tenantId')
      router.back()
    }
  } catch (error) {
    console.error('Erreur lors de la navigation retour:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    
    // Fallback en cas d'erreur - essayer d'aller vers la gestion des comptes
    try {
      router.push('/admin/accounts')
    } catch (fallbackError) {
      console.error('Fallback navigation failed:', fallbackError)
      // En dernier recours, recharger la page vers l'accueil
      window.location.href = '/'
    }
  }
}

// État des données
const academicYears = ref<AcademicYear[]>([])
const classes = ref<Class[]>([])
const schedules = ref<Schedule[]>([])
const subjects = ref([]) // Mock subjects pour l'affichage

// État de chargement
const loading = reactive({
  academicYears: false,
  classes: false,
  schedules: false
})

// État des modaux
const modals = reactive({
  addAcademicYear: false,
  addClass: false,
  addSchedule: false
})

// État d'erreur
const error = ref<string | null>(null)

// Année scolaire active
const currentAcademicYear = computed(() => {
  return academicYears.value.find(year => year.isActive) || null
})

// Fonctions pour gérer les modaux
const openAddAcademicYearModal = () => {
  modals.addAcademicYear = true
}

const closeAddAcademicYearModal = () => {
  modals.addAcademicYear = false
}

const openAddClassModal = () => {
  modals.addClass = true
}

const closeAddClassModal = () => {
  modals.addClass = false
}

const openAddScheduleModal = () => {
  modals.addSchedule = true
}

const closeAddScheduleModal = () => {
  modals.addSchedule = false
}

// Fonction pour afficher les messages d'erreur
const showError = (message: string) => {
  error.value = message
  setTimeout(() => {
    error.value = null
  }, 5000)
}

// Fonctions pour charger les données
const loadAcademicYears = async () => {
  loading.academicYears = true
  try {
    academicYears.value = await fetchAcademicYears(TENANT_ID)
  } catch (err) {
    console.error('Erreur lors du chargement des années scolaires:', err)
    showError('Erreur lors du chargement des années scolaires')
  } finally {
    loading.academicYears = false
  }
}

const loadClasses = async () => {
  loading.classes = true
  try {
    classes.value = await fetchClasses(TENANT_ID)
  } catch (err) {
    console.error('Erreur lors du chargement des classes:', err)
    showError('Erreur lors du chargement des classes')
  } finally {
    loading.classes = false
  }
}

const loadSchedules = async () => {
  loading.schedules = true
  try {
    schedules.value = await fetchSchedules(TENANT_ID)
  } catch (err) {
    console.error('Erreur lors du chargement des créneaux:', err)
    showError('Erreur lors du chargement des créneaux')
  } finally {
    loading.schedules = false
  }
}

// Gestionnaires de création
const handleCreateAcademicYear = async (academicYearData: CreateAcademicYearDto) => {
  try {
    const newAcademicYear = await createAcademicYear(academicYearData, TENANT_ID)
    academicYears.value.push(newAcademicYear)
    
    // Si cette année est active, désactiver les autres
    if (newAcademicYear.isActive) {
      academicYears.value.forEach(year => {
        if (year._id !== newAcademicYear._id) {
          year.isActive = false
        }
      })
    }
    
    closeAddAcademicYearModal()
    console.log('Année scolaire créée avec succès:', newAcademicYear)
  } catch (err) {
    console.error('Erreur lors de la création de l\'année scolaire:', err)
    showError('Erreur lors de la création de l\'année scolaire')
  }
}

const handleCreateClass = async (classData: CreateClassDto) => {
  try {
    const newClass = await createClass(classData, TENANT_ID)
    classes.value.push(newClass)
    closeAddClassModal()
    console.log('Classe créée avec succès:', newClass)
  } catch (err) {
    console.error('Erreur lors de la création de la classe:', err)
    showError('Erreur lors de la création de la classe')
  }
}

const handleCreateSchedule = async (scheduleData: CreateScheduleDto) => {
  try {
    const newSchedule = await createSchedule(scheduleData, TENANT_ID)
    schedules.value.push(newSchedule)
    closeAddScheduleModal()
    console.log('Créneau créé avec succès:', newSchedule)
  } catch (err) {
    console.error('Erreur lors de la création du créneau:', err)
    showError('Erreur lors de la création du créneau')
  }
}

// Fonctions d'utilitaire pour l'affichage
const getSchoolTypeBadgeClass = (schoolType: string): string => {
  const classes: Record<string, string> = {
    'primary': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'middle': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'high': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'university': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  }
  return classes[schoolType] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

// Chargement initial des données
onMounted(async () => {
  await Promise.all([
    loadAcademicYears(),
    loadClasses(),
    loadSchedules()
  ])
})
</script>