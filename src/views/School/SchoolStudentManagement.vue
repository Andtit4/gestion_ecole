<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Header moderne avec glass effect -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Navigation Breadcrumb -->
          <div class="flex items-center gap-3">
            <button 
              @click="$router.go(-1)"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Retour au Dashboard
            </button>
            <span class="text-gray-400 dark:text-gray-500">/</span>
            <span class="text-gray-900 dark:text-white font-medium">Gestion des Élèves</span>
          </div>

          <!-- En-tête de l'établissement -->
          <div v-if="loadingSchool" class="animate-pulse flex items-center gap-4">
            <div class="h-12 w-12 bg-gray-300 rounded-xl"></div>
            <div>
              <div class="h-6 bg-gray-300 rounded w-32 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div v-else-if="currentSchool" class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {{ currentSchool.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{{ currentSchool.name }}</h1>
              <p class="text-sm text-blue-600 dark:text-blue-400">{{ currentSchool.city }} • {{ currentSchool.status }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal avec animations -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Statistiques avec design moderne -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <!-- Gradient background -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-blue-100 dark:bg-blue-900/30">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                +{{ stats.recentEnrollments }}
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Élèves</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Inscrits cette année</p>
            </div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-green-500 to-emerald-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-green-100 dark:bg-green-900/30">
                <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {{ stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0 }}%
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Élèves Actifs</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.active }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Présents aujourd'hui</p>
            </div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-purple-500 to-pink-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-purple-100 dark:bg-purple-900/30">
                <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6"/>
                </svg>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                {{ Object.keys(stats.byClass).length }}
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Classes</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ Object.keys(stats.byClass).length }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Niveaux disponibles</p>
            </div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-orange-500 to-red-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-orange-100 dark:bg-orange-900/30">
                <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                {{ stats.averageAge }} ans
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Âge Moyen</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.averageAge }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Dans l'établissement</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides et filtres modernisés -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Liste des Élèves</h3>
              <p class="text-gray-500 dark:text-gray-400">{{ filteredStudents.length }} élève(s) trouvé(s)</p>
            </div>
            <div class="flex items-center space-x-3">
              <!-- Bouton d'ajout d'élève -->
              <button 
                @click="showCreateModal = true"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Nouvel Élève
              </button>
              
              <!-- Bouton d'actualisation -->
              <button 
                @click="refreshData"
                :disabled="loading"
                class="inline-flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="{ 'animate-spin': loading }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
              
              <!-- Bouton d'export -->
              <button 
                @click="showExportConfirmation"
                class="inline-flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Filtres avec design moderne -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un élève..."
                class="w-full pl-10 pr-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
              />
            </div>
            
            <select
              v-model="selectedClass"
              class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
            >
              <option value="">Toutes les classes</option>
              <option v-for="className in availableClasses" :key="className" :value="className">{{ className }}</option>
            </select>
            
            <select
              v-model="selectedStatus"
              class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="transferred">Transféré</option>
              <option value="graduated">Diplômé</option>
            </select>

            <select
              v-model="selectedGender"
              class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
            >
              <option value="">Tous les genres</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>

            <button
              @click="clearFilters"
              class="px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Effacer filtres
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des élèves avec cards modernes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="student in filteredStudents"
          :key="student._id"
          class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30"
        >
          <!-- Header de l'étudiant -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg">
                {{ getStudentInitials(student) }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  {{ student.firstName }} {{ student.lastName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ student.studentNumber }}</p>
              </div>
            </div>
            
            <span :class="getStatusBadgeClass(student.academicInfo.status)" class="px-3 py-1 text-xs font-medium rounded-full">
              {{ getStatusLabel(student.academicInfo.status) }}
            </span>
          </div>

          <!-- Informations de l'étudiant -->
          <div class="space-y-3 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0h4"/>
              </svg>
              <span class="text-gray-700 dark:text-gray-300">{{ student.academicInfo.className || 'Non assigné' }}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m-6 6l6 6"/>
              </svg>
              <span class="text-gray-700 dark:text-gray-300">{{ calculateAge(student.dateOfBirth) }} ans</span>
            </div>

            <div v-if="student.parentContact?.guardianEmail" class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span class="text-gray-700 dark:text-gray-300">{{ student.parentContact.guardianEmail }}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span class="text-gray-700 dark:text-gray-300">{{ getGenderLabel(student.gender) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              @click="viewStudent(student)"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              Voir
            </button>
            
            <button
              @click="editStudent(student)"
              class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M17.5 2.5a2.121 2.121 0 013 3L12 14l-4 1 1-4z"/>
              </svg>
            </button>
            
            <button
              @click="deleteStudent(student)"
              class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Card vide si aucun élève -->
        <div v-if="!filteredStudents.length" class="col-span-full">
          <div class="text-center py-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun élève trouvé</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              {{ !currentSchool ? 'Aucun établissement sélectionné' : 'Commencez par créer un nouvel élève.' }}
            </p>
            <button
              v-if="currentSchool"
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Créer un élève
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de création -->
    <AddStudentModal
      :isOpen="showCreateModal"
      :tenantId="tenantId"
      :tenantName="currentSchool?.name"
      @close="showCreateModal = false"
      @submit="onStudentCreated"
    />

    <!-- Modal de visualisation -->
    <ViewStudentModal
      :show="showViewModal"
      :student="selectedStudent"
      @close="showViewModal = false"
      @edit="onEditFromView"
    />

    <!-- Modal d'édition -->
    <EditStudentModal
      :isOpen="showEditModal"
      :student="selectedStudent"
      :tenantId="tenantId"
      :tenantName="currentSchool?.name"
      @close="showEditModal = false"
      @submit="onStudentUpdated"
    />

    <!-- Modal de confirmation -->
    <ConfirmModal
      :show="showConfirmModal"
      :title="'Confirmation'"
      :message="confirmMessage"
      :type="'danger'"
      @confirm="onConfirm"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchStudents, deleteStudent as deleteStudentApi, createStudent, updateStudent } from '@/services/studentService'
import { fetchTenant, type TenantListItem } from '@/services/api'
import type { Student, CreateStudentDto, UpdateStudentDto } from '@/types/student'
import AddStudentModal from '@/components/forms/AddStudentModal.vue'
import ViewStudentModal from '@/components/forms/ViewStudentModal.vue'
import EditStudentModal from '@/components/forms/EditStudentModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const route = useRoute()

// État local
const students = ref<Student[]>([])
const currentSchool = ref<TenantListItem | null>(null)
const loading = ref(false)
const loadingSchool = ref(false)
const showCreateModal = ref(false)
const showViewModal = ref(false)
const showEditModal = ref(false)
const showConfirmModal = ref(false)
const confirmMessage = ref('')

// Récupérer l'ID du tenant depuis les paramètres de route
const tenantId = computed(() => route.params.tenantId as string)

// Variables d'état pour les modals
const selectedStudent = ref<Student | null>(null)
const confirmAction = ref<(() => void) | null>(null)

// Filtres
const searchQuery = ref('')
const selectedClass = ref('')
const selectedStatus = ref('')
const selectedGender = ref('')

// Computed properties
const filteredStudents = computed(() => {
  let filtered = students.value

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(student =>
      student.firstName?.toLowerCase().includes(search) ||
      student.lastName?.toLowerCase().includes(search) ||
      student.studentNumber?.toLowerCase().includes(search) ||
      student.parentContact?.guardianEmail?.toLowerCase().includes(search)
    )
  }

  if (selectedClass.value) {
    filtered = filtered.filter(student => student.academicInfo.className === selectedClass.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(student => student.academicInfo.status === selectedStatus.value)
  }

  if (selectedGender.value) {
    filtered = filtered.filter(student => student.gender === selectedGender.value)
  }

  return filtered
})

const stats = computed(() => {
  const total = students.value.length
  const active = students.value.filter(s => s.academicInfo.status === 'active').length
  const inactive = students.value.filter(s => s.academicInfo.status === 'inactive').length
  const recentEnrollments = students.value.filter(s => {
    const enrollmentDate = new Date(s.academicInfo.enrollmentDate)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return enrollmentDate > thirtyDaysAgo
  }).length
  
  const byClass = students.value.reduce((acc, student) => {
    if (student.academicInfo.className) {
      acc[student.academicInfo.className] = (acc[student.academicInfo.className] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const averageAge = students.value.length > 0 
    ? Math.round(students.value.reduce((sum, student) => sum + calculateAge(student.dateOfBirth), 0) / students.value.length)
    : 0

  return { total, active, inactive, byClass, recentEnrollments, averageAge }
})

const availableClasses = computed(() => {
  const classes = [...new Set(students.value.map(s => s.academicInfo.className).filter(Boolean))]
  return classes.sort()
})

// Méthodes utilitaires
function getStudentInitials(student: Student): string {
  return `${student.firstName?.charAt(0) || ''}${student.lastName?.charAt(0) || ''}`.toUpperCase()
}

function getStatusBadgeClass(status: string): string {
  const classes = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'transferred': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'graduated': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  }
  return classes[status as keyof typeof classes] || classes.inactive
}

function getStatusLabel(status: string): string {
  const labels = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'transferred': 'Transféré',
    'graduated': 'Diplômé'
  }
  return labels[status as keyof typeof labels] || 'Inconnu'
}

function getGenderLabel(gender: string): string {
  return gender === 'M' ? 'Masculin' : gender === 'F' ? 'Féminin' : 'Non spécifié'
}

function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Actions
async function loadSchoolData() {
  if (!tenantId.value) return
  
  loadingSchool.value = true
  try {
    currentSchool.value = await fetchTenant(tenantId.value)
  } catch (error) {
    console.error('Erreur lors du chargement des données de l\'établissement:', error)
    alert('Erreur lors du chargement des données de l\'établissement')
  } finally {
    loadingSchool.value = false
  }
}

async function refreshData() {
  if (!tenantId.value) return

  loading.value = true
  try {
    const response = await fetchStudents(tenantId.value)
    students.value = response.students || []
  } catch (error) {
    console.error('Erreur lors du chargement des élèves:', error)
    alert('Erreur lors du chargement des élèves')
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  searchQuery.value = ''
  selectedClass.value = ''
  selectedStatus.value = ''
  selectedGender.value = ''
}

function viewStudent(student: Student) {
  console.log('Voir élève:', student)
  selectedStudent.value = student
  showViewModal.value = true
}

function editStudent(student: Student) {
  console.log('Modifier élève:', student)
  selectedStudent.value = student
  showEditModal.value = true
}

async function deleteStudent(student: Student) {
  if (!tenantId.value) return

  selectedStudent.value = student
  confirmMessage.value = `Êtes-vous sûr de vouloir supprimer l'élève ${student.firstName} ${student.lastName} ? Cette action est irréversible.`
  confirmAction.value = async () => {
    try {
      await deleteStudentApi(student._id, tenantId.value)
      students.value = students.value.filter(s => s._id !== student._id)
      alert('Élève supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de l\'élève')
    }
  }
  showConfirmModal.value = true
}

function showExportConfirmation() {
  confirmMessage.value = `Voulez-vous télécharger la liste de ${filteredStudents.value.length} élève(s) au format Excel ?`
  confirmAction.value = exportStudents
  showConfirmModal.value = true
}

function onConfirm() {
  if (confirmAction.value) {
    confirmAction.value()
    confirmAction.value = null
  }
  showConfirmModal.value = false
}

function onEditFromView(student: Student) {
  showViewModal.value = false
  selectedStudent.value = student
  showEditModal.value = true
}

async function onStudentUpdated(updateData: UpdateStudentDto) {
  if (!selectedStudent.value || !tenantId.value) return

  try {
    loading.value = true
    const updatedStudent = await updateStudent(selectedStudent.value._id, updateData, tenantId.value)
    
    // Mettre à jour l'élève dans la liste
    const index = students.value.findIndex(s => s._id === selectedStudent.value!._id)
    if (index !== -1) {
      students.value[index] = updatedStudent
    }
    
    showEditModal.value = false
    selectedStudent.value = null
    alert('Élève modifié avec succès !')
  } catch (error) {
    console.error('Erreur lors de la modification:', error)
    alert('Erreur lors de la modification de l\'élève')
  } finally {
    loading.value = false
  }
}

function exportStudents() {
  console.log('Export des élèves vers Excel...')
  
  if (!filteredStudents.value.length) {
    alert('Aucun élève à exporter')
    return
  }

  try {
    // Préparer les données pour l'export
    const exportData = filteredStudents.value.map(student => ({
      'Numéro d\'élève': student.studentNumber || '',
      'Prénom': student.firstName || '',
      'Nom': student.lastName || '', 
      'Date de naissance': student.dateOfBirth || '',
      'Âge': calculateAge(student.dateOfBirth),
      'Genre': getGenderLabel(student.gender),
      'Email': student.email || '',
      'Téléphone': student.phone || '',
      'Classe': student.academicInfo.className || 'Non assigné',
      'Niveau': student.academicInfo.level || '',
      'Section': student.academicInfo.section || '',
      'Statut': getStatusLabel(student.academicInfo.status),
      'Date d\'inscription': student.academicInfo.enrollmentDate || '',
      'Adresse': `${student.address?.street || ''}, ${student.address?.city || ''} ${student.address?.postalCode || ''}`.trim(),
      'Pays': student.address?.country || '',
      'Nom du père': student.parentContact?.fatherName || '',
      'Téléphone père': student.parentContact?.fatherPhone || '',
      'Email père': student.parentContact?.fatherEmail || '',
      'Nom de la mère': student.parentContact?.motherName || '',
      'Téléphone mère': student.parentContact?.motherPhone || '',
      'Email mère': student.parentContact?.motherEmail || '',
      'Tuteur légal': student.parentContact?.guardianName || '',
      'Téléphone tuteur': student.parentContact?.guardianPhone || '',
      'Email tuteur': student.parentContact?.guardianEmail || '',
      'Contact d\'urgence': student.medicalInfo?.emergencyContact || '',
      'Groupe sanguin': student.medicalInfo?.bloodType || '',
      'Allergies': student.medicalInfo?.allergies?.join(', ') || '',
      'Médicaments': student.medicalInfo?.medications?.join(', ') || '',
      'Besoins spéciaux': student.medicalInfo?.specialNeeds || ''
    }))

    // Créer un nouveau classeur
    const workbook = XLSX.utils.book_new()
    
    // Créer une feuille de calcul
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    
    // Définir la largeur des colonnes
    const columnWidths = [
      { wch: 15 }, // Numéro d'élève
      { wch: 15 }, // Prénom
      { wch: 15 }, // Nom
      { wch: 12 }, // Date de naissance
      { wch: 5 },  // Âge
      { wch: 10 }, // Genre
      { wch: 25 }, // Email
      { wch: 15 }, // Téléphone
      { wch: 12 }, // Classe
      { wch: 10 }, // Niveau
      { wch: 10 }, // Section
      { wch: 10 }, // Statut
      { wch: 12 }, // Date d'inscription
      { wch: 40 }, // Adresse
      { wch: 10 }, // Pays
      { wch: 20 }, // Nom du père
      { wch: 15 }, // Téléphone père
      { wch: 25 }, // Email père
      { wch: 20 }, // Nom de la mère
      { wch: 15 }, // Téléphone mère
      { wch: 25 }, // Email mère
      { wch: 20 }, // Tuteur légal
      { wch: 15 }, // Téléphone tuteur
      { wch: 25 }, // Email tuteur
      { wch: 20 }, // Contact d'urgence
      { wch: 15 }, // Groupe sanguin
      { wch: 30 }, // Allergies
      { wch: 30 }, // Médicaments
      { wch: 30 }  // Besoins spéciaux
    ]
    
    worksheet['!cols'] = columnWidths
    
    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Élèves')
    
    // Générer le fichier Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    
    // Créer un Blob et télécharger le fichier
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    const schoolName = currentSchool.value?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'etablissement'
    const currentDate = new Date().toISOString().split('T')[0]
    const filename = `eleves_${schoolName}_${currentDate}.xlsx`
    
    saveAs(data, filename)
    
    alert(`Liste des élèves exportée avec succès ! (${filteredStudents.value.length} élèves)`)
  } catch (error) {
    console.error('Erreur lors de l\'exportation:', error)
    alert('Erreur lors de l\'exportation des données')
  }
}

async function onStudentCreated(studentData: CreateStudentDto) {
  console.log('Création d\'élève avec les données:', studentData)
  
  if (!tenantId.value) {
    alert('Erreur: Aucun établissement sélectionné')
    return
  }

  try {
    loading.value = true
    
    // Appeler l'API pour créer l'élève
    const newStudent = await createStudent(studentData, tenantId.value)
    console.log('Élève créé avec succès:', newStudent)
    
    // Fermer le modal
    showCreateModal.value = false
    
    // Recharger la liste des élèves
    await refreshData()
    
    alert('Élève créé avec succès !')
  } catch (error) {
    console.error('Erreur lors de la création de l\'élève:', error)
    alert(`Erreur lors de la création de l'élève: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Charger les données de l'établissement et les élèves en parallèle
  await Promise.all([
    loadSchoolData(),
    refreshData()
  ])
})
</script> 