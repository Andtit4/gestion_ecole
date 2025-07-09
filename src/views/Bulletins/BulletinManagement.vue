<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Header moderne avec glass effect -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center group">
            <!-- Bouton retour -->
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
              <div class="h-12 w-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Bulletins de Notes
              </h1>
              <p class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{{ tenantName ? `${tenantName} - ` : '' }}Consultation et génération des bulletins</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
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

      <!-- Métriques des bulletins -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Étudiants -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-blue-500 to-blue-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full bg-blue-100 py-0.5 pl-2 pr-2.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                Étudiants
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Étudiants</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalStudents || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Inscrits cette année</p>
            </div>
          </div>
        </div>

        <!-- Classes -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-purple-500 to-purple-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full bg-purple-100 py-0.5 pl-2 pr-2.5 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                Classes
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Classes</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalClasses || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Créées dans l'établissement</p>
            </div>
          </div>
        </div>

        <!-- Bulletins générés -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full bg-emerald-100 py-0.5 pl-2 pr-2.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Bulletins
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Bulletins générés</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.generatedBulletins || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Ce trimestre</p>
            </div>
          </div>
        </div>

        <!-- Moyenne générale -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-orange-500 to-red-500"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-orange-500 to-red-500">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full py-0.5 pl-2 pr-2.5 text-sm font-medium" :class="averageColorClass">
                <div class="w-2 h-2 rounded-full" :class="averageDotClass"></div>
                {{ averageLabel }}
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Moyenne générale</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ formattedAverage }}/20</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Toutes classes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section de consultation des bulletins -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8">
        <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
          Consultation des bulletins
        </h3>

        <!-- Filtres -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Sélection de classe -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Classe
            </label>
            <div class="relative">
              <select
                v-model="selectedClassId"
                @change="onClassChange"
                :disabled="loadingClasses"
                class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50 transition-all"
              >
                <option value="">
                  {{ loadingClasses ? 'Chargement...' : 'Toutes les classes' }}
                </option>
                <option v-for="classItem in classes" :key="classItem._id" :value="classItem._id">
                  {{ classItem.name }} ({{ classItem.level || 'Non défini' }})
                </option>
              </select>
              <div v-if="loadingClasses" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg class="w-5 h-5 animate-spin text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Sélection de période -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Période
            </label>
            <select
              v-model="selectedPeriod"
              @change="onPeriodChange"
              class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white transition-all"
            >
              <option value="">Toute l'année</option>
              <option value="trimestre1">1er Trimestre</option>
              <option value="trimestre2">2ème Trimestre</option>
              <option value="trimestre3">3ème Trimestre</option>
            </select>
          </div>

          <!-- Recherche d'étudiant -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rechercher un élève
            </label>
            <div class="relative">
              <input
                v-model="searchStudent"
                @input="onStudentSearch"
                type="text"
                placeholder="Nom ou prénom..."
                class="w-full rounded-xl border border-gray-300 px-4 py-3 pl-10 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white transition-all"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Actions groupées -->
        <div v-if="!loading && filteredStudents.length > 0" class="flex justify-between items-center mb-6">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ filteredStudents.length }} élève{{ filteredStudents.length > 1 ? 's' : '' }} trouvé{{ filteredStudents.length > 1 ? 's' : '' }}
          </div>
          
          <button
            @click="generateAllBulletinsPDF"
            :disabled="generatingAllPDFs"
            class="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="generatingAllPDFs" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            {{ generatingAllPDFs ? 'Génération...' : 'Télécharger tous les bulletins' }}
          </button>
        </div>

        <!-- Liste des étudiants -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="flex items-center gap-3 text-emerald-600">
            <svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="font-medium">Chargement des données...</span>
          </div>
        </div>

        <div v-else-if="filteredStudents.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
          </svg>
          <p class="text-gray-600 dark:text-gray-400 font-medium">Aucun élève trouvé</p>
          <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">Modifiez vos critères de recherche</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="student in filteredStudents"
            :key="student._id"
            class="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/30 dark:border-gray-600/30"
          >
            <div class="flex items-center space-x-4 mb-4">
              <!-- Avatar avec initiales -->
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                {{ getStudentInitials(student) }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ student.firstName }} {{ student.lastName }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ student.academicInfo?.className || 'Classe non définie' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  {{ student.studentNumber }}
                </p>
              </div>
            </div>

            <!-- Moyennes par matière (exemple) -->
            <div class="space-y-2 mb-4">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600 dark:text-gray-400">Moyenne générale</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ getStudentAverage(student) }}/20</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="viewBulletin(student)"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Voir bulletin
              </button>
              <button
                @click="generatePDF(student)"
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de bulletin détaillé -->
    <div v-if="showBulletinModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeBulletinModal">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <div class="relative w-full max-w-4xl transform rounded-3xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
          <!-- Header du modal -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Bulletin de {{ selectedStudent?.firstName }} {{ selectedStudent?.lastName }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ selectedStudent?.academicInfo?.className || 'Classe non définie' }} - {{ selectedPeriod || 'Année complète' }}
              </p>
            </div>
            <button
              @click="closeBulletinModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Contenu du bulletin -->
          <div class="p-6 space-y-6">
            <!-- Informations élève -->
            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-4">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-600 dark:text-gray-400">Nom complet:</span>
                  <p class="text-gray-900 dark:text-white">{{ selectedStudent?.firstName }} {{ selectedStudent?.lastName }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-600 dark:text-gray-400">Numéro:</span>
                  <p class="text-gray-900 dark:text-white">{{ selectedStudent?.studentNumber }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-600 dark:text-gray-400">Classe:</span>
                  <p class="text-gray-900 dark:text-white">{{ selectedStudent?.academicInfo?.className || 'Non définie' }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-600 dark:text-gray-400">Statut:</span>
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {{ selectedStudent?.academicInfo?.status || 'Active' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Notes par matière -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Notes par matière</h4>
              
              <div v-if="loadingGrades" class="flex justify-center py-8">
                <svg class="w-6 h-6 animate-spin text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>

              <div v-else-if="studentGrades.length === 0" class="text-center py-8">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p class="text-gray-600 dark:text-gray-400">Aucune note disponible</p>
              </div>

              <div v-else class="space-y-4">
                <!-- Notes groupées par matière -->
                <div v-for="(subjectGrades, subjectName) in groupedGrades" :key="subjectName" class="space-y-2">
                  <h6 class="font-semibold text-gray-800 dark:text-gray-200 text-sm border-b border-gray-200 dark:border-gray-600 pb-1">
                    {{ subjectName }}
                  </h6>
                  <div class="space-y-2 ml-4">
                    <div
                      v-for="grade in subjectGrades"
                      :key="grade._id"
                      class="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div class="flex-1">
                        <h5 class="font-medium text-gray-900 dark:text-white text-sm">{{ grade.evaluationInfo?.name || 'Évaluation inconnue' }}</h5>
                        <p class="text-xs text-gray-500 dark:text-gray-500">{{ formatDate(grade.evaluationInfo?.date) }}</p>
                      </div>
                      <div class="text-right">
                        <div class="text-lg font-bold" :class="getGradeColor(grade.score || grade.grade || 0, grade.maxScore || grade.evaluationInfo?.maxScore || 20)">
                          {{ grade.isAbsent ? 'ABS' : `${grade.score || grade.grade || 0}/${grade.maxScore || grade.evaluationInfo?.maxScore || 20}` }}
                        </div>
                        <div v-if="grade.evaluationInfo?.coefficient" class="text-xs text-gray-500">
                          Coeff. {{ grade.evaluationInfo.coefficient }}
                        </div>
                      </div>
                    </div>
                    <!-- Moyenne de la matière -->
                    <div class="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-600 rounded-lg border-t border-gray-300 dark:border-gray-500">
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Moyenne {{ subjectName }}:</span>
                      <span class="text-sm font-bold text-gray-900 dark:text-white">{{ calculateSubjectAverage(subjectGrades).toFixed(1) }}/20</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Moyennes -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Moyennes</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ getStudentAverage(selectedStudent) }}/20</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Moyenne générale</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ calculateClassRank(selectedStudent) }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Rang de classe</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ getAppreciation(getStudentAverage(selectedStudent)) }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">Appréciation</div>
                </div>
              </div>
            </div>

            <!-- Actions du modal -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="closeBulletinModal"
                class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                Fermer
              </button>
              <button
                @click="generatePDF(selectedStudent)"
                class="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                Télécharger PDF
              </button>
              <button
                @click="sendByEmail(selectedStudent)"
                class="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg"
              >
                Envoyer par email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ConfirmModal -->
    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmModalTitle"
      :message="confirmMessage"
      :type="confirmModalType"
      :confirm-text="confirmModalText"
      @confirm="onConfirm"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import type { Student } from '@/types/student'
import type { Class } from '@/types/academic'

const route = useRoute()
const router = useRouter()
const currentTenantStore = useCurrentTenantStore()

// État de l'application
const loading = ref(true)
const loadingClasses = ref(false)
const loadingGrades = ref(false)
const generatingAllPDFs = ref(false)
const error = ref<string | null>(null)

// Données
const students = ref<Student[]>([])
const classes = ref<Class[]>([])
const studentGrades = ref<any[]>([])
const evaluations = ref<any[]>([])
const subjects = ref<any[]>([])
const stats = ref({
  totalStudents: 0,
  totalClasses: 0,
  generatedBulletins: 0,
  averageGrade: 0
})

// Filtres
const selectedClassId = ref('')
const selectedPeriod = ref('')
const searchStudent = ref('')

// Modal état
const showBulletinModal = ref(false)
const selectedStudent = ref<Student | null>(null)

// ConfirmModal state
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmMessage = ref('')
const confirmModalType = ref<'danger' | 'warning' | 'success' | 'info'>('warning')
const confirmModalText = ref('Confirmer')
const confirmAction = ref<(() => void) | null>(null)

// Computed pour le tenant
const tenantId = computed(() => {
  return route.params.tenantId as string
})

const tenantName = computed(() => {
  if (currentTenantStore.tenantName) {
    return currentTenantStore.tenantName
  }
  
  try {
    const id = tenantId.value
    if (!id) return null
    
    const stored = localStorage.getItem(`tenant_${id}`)
    if (stored) {
      const tenant = JSON.parse(stored)
      return tenant.name || tenant.schoolName || 'Établissement'
    }
    return 'Établissement'
  } catch (error) {
    console.error('Erreur lors de la récupération du nom du tenant:', error)
    return 'Établissement'
  }
})

const shouldShowBackButton = computed(() => {
  return route.path.includes('/school/')
})

// Computed pour les filtres
const filteredStudents = computed(() => {
  let filtered = students.value

  // Filtrer par classe
  if (selectedClassId.value) {
    filtered = filtered.filter(student => 
      student.academicInfo?.classId === selectedClassId.value
    )
  }

  // Filtrer par recherche
  if (searchStudent.value) {
    const search = searchStudent.value.toLowerCase()
    filtered = filtered.filter(student =>
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search) ||
      student.studentNumber.toLowerCase().includes(search)
    )
  }

  return filtered
})

// Computed pour les métriques moyennes
const formattedAverage = computed(() => {
  return stats.value.averageGrade ? stats.value.averageGrade.toFixed(1) : '0.0'
})

const averageColorClass = computed(() => {
  const avg = stats.value.averageGrade
  if (avg >= 16) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  if (avg >= 14) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  if (avg >= 12) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  if (avg >= 10) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
})

const averageDotClass = computed(() => {
  const avg = stats.value.averageGrade
  if (avg >= 16) return 'bg-green-500'
  if (avg >= 14) return 'bg-blue-500'
  if (avg >= 12) return 'bg-orange-500'
  if (avg >= 10) return 'bg-yellow-500'
  return 'bg-red-500'
})

const averageLabel = computed(() => {
  const avg = stats.value.averageGrade
  if (avg >= 16) return 'Excellent'
  if (avg >= 14) return 'Très bien'
  if (avg >= 12) return 'Bien'
  if (avg >= 10) return 'Assez bien'
  return 'Insuffisant'
})

// Grouper les notes par matière pour l'affichage dans le bulletin
const groupedGrades = computed(() => {
  const grouped: Record<string, any[]> = {}
  
  studentGrades.value.forEach(grade => {
    const subjectName = grade.subjectInfo?.name || 'Matière inconnue'
    if (!grouped[subjectName]) {
      grouped[subjectName] = []
    }
    grouped[subjectName].push(grade)
  })
  
  return grouped
})

// Méthodes API
const loadStudents = async () => {
  if (!tenantId.value) return
  
  try {
    const { getStudents } = await import('@/services/studentService')
    const fetchedStudents = await getStudents(tenantId.value)
    students.value = fetchedStudents
    stats.value.totalStudents = fetchedStudents.length
    console.log('✅ Étudiants chargés:', fetchedStudents.length)
  } catch (err) {
    console.error('❌ Erreur lors du chargement des étudiants:', err)
    error.value = 'Impossible de charger les étudiants'
  }
}

const loadClasses = async () => {
  if (!tenantId.value) return
  
  loadingClasses.value = true
  try {
    const { fetchClasses } = await import('@/services/academicService')
    const fetchedClasses = await fetchClasses(tenantId.value)
    classes.value = fetchedClasses
    stats.value.totalClasses = fetchedClasses.length
    console.log('✅ Classes chargées:', fetchedClasses.length)
  } catch (err) {
    console.error('❌ Erreur lors du chargement des classes:', err)
    error.value = 'Impossible de charger les classes'
  } finally {
    loadingClasses.value = false
  }
}

const loadEvaluations = async () => {
  if (!tenantId.value) return
  
  try {
    const { fetchEvaluations } = await import('@/services/evaluationService')
    const response = await fetchEvaluations(tenantId.value)
    
    // Debug de la structure de la réponse
    console.log('📊 Réponse évaluations:', response)
    
    // Gérer différentes structures de réponse possibles
    let evaluationsData = []
    if (response && Array.isArray(response.evaluations)) {
      evaluationsData = response.evaluations
    } else if (Array.isArray(response)) {
      evaluationsData = response
    } else if (response && Array.isArray(response.data)) {
      evaluationsData = response.data
    } else {
      console.warn('⚠️ Structure de réponse inattendue pour les évaluations:', response)
      evaluationsData = []
    }
    
    evaluations.value = evaluationsData
    console.log('✅ Évaluations chargées:', evaluations.value.length)
  } catch (err) {
    console.error('❌ Erreur lors du chargement des évaluations:', err)
    evaluations.value = []
  }
}

const loadSubjects = async () => {
  if (!tenantId.value) return
  
  try {
    const { getSubjects } = await import('@/services/academicService')
    const response = await getSubjects(tenantId.value)
    
    // Debug de la structure de la réponse
    console.log('📖 Réponse matières:', response)
    
    // Gérer différentes structures de réponse possibles
    let subjectsData = []
    if (Array.isArray(response)) {
      subjectsData = response
    } else if (response && Array.isArray(response.data)) {
      subjectsData = response.data
    } else if (response && Array.isArray(response.subjects)) {
      subjectsData = response.subjects
    } else {
      console.warn('⚠️ Structure de réponse inattendue pour les matières:', response)
      subjectsData = []
    }
    
    subjects.value = subjectsData
    console.log('✅ Matières chargées:', subjects.value.length)
  } catch (err) {
    console.error('❌ Erreur lors du chargement des matières:', err)
    subjects.value = []
  }
}

const loadStudentGrades = async (student: Student) => {
  if (!tenantId.value || !student._id) return []
  
  loadingGrades.value = true
  try {
    const { fetchStudentGrades } = await import('@/services/evaluationService')
    const grades = await fetchStudentGrades(tenantId.value, student._id)
    console.log('✅ Notes chargées pour', student.firstName, ':', grades.length)
    
    // Enrichir les notes avec les informations d'évaluation et de matière
    const enrichedGrades = grades.map(grade => {
      const evaluation = Array.isArray(evaluations.value) 
        ? evaluations.value.find(evaluation => evaluation._id === grade.evaluationId)
        : null
      const subject = Array.isArray(subjects.value) 
        ? subjects.value.find(subj => subj._id === evaluation?.subjectId)
        : null
      
      return {
        ...grade,
        evaluationInfo: evaluation || {
          name: 'Évaluation inconnue',
          date: null,
          maxScore: grade.maxScore || 20,
          coefficient: 1
        },
        subjectInfo: subject || {
          name: 'Matière inconnue',
          code: 'UNKNOWN'
        }
      }
    })
    
    return enrichedGrades
  } catch (err) {
    console.error('❌ Erreur lors du chargement des notes:', err)
    return []
  } finally {
    loadingGrades.value = false
  }
}

const calculateStats = async () => {
  if (students.value.length === 0) return
  
  try {
    let totalGrades = 0
    let gradeCount = 0
    let studentsWithGrades = 0
    
    // Vérifier que les données de référence sont disponibles
    if (!Array.isArray(evaluations.value) || !Array.isArray(subjects.value)) {
      console.warn('⚠️ Données de référence non disponibles pour le calcul des stats')
      stats.value.averageGrade = 0
      stats.value.generatedBulletins = 0
      return
    }
    
    // Calculer les vraies moyennes pour tous les étudiants
    for (const student of students.value) {
      if (student._id) {
        const grades = await loadStudentGrades(student)
        if (grades.length > 0) {
          studentsWithGrades++
          // Calculer la moyenne pondérée pour cet étudiant
          let weightedSum = 0
          let weightSum = 0
          
          grades.forEach(grade => {
            if (!grade.isAbsent && (grade.score || grade.grade)) {
              const score = grade.score || grade.grade || 0
              const maxScore = grade.maxScore || grade.evaluationInfo?.maxScore || 20
              const coefficient = grade.evaluationInfo?.coefficient || 1
              
              // Convertir en note sur 20
              const normalizedGrade = (score / maxScore) * 20
              weightedSum += normalizedGrade * coefficient
              weightSum += coefficient
            }
          })
          
          if (weightSum > 0) {
            const studentAverage = weightedSum / weightSum
            totalGrades += studentAverage
            gradeCount++
          }
        }
      }
    }
    
    // Mettre à jour les statistiques avec les vraies données
    stats.value.averageGrade = gradeCount > 0 ? totalGrades / gradeCount : 0
    stats.value.generatedBulletins = studentsWithGrades
  } catch (err) {
    console.error('❌ Erreur lors du calcul des statistiques:', err)
    // Fallback avec les données précédentes
    stats.value.averageGrade = 0
    stats.value.generatedBulletins = 0
  }
}

// Méthodes utilitaires
const getStudentInitials = (student: Student) => {
  return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase()
}

// Cache pour les moyennes des étudiants
const studentAverages = ref<Map<string, number>>(new Map())
const studentRanks = ref<Map<string, string>>(new Map())

const calculateStudentAverage = async (student: Student) => {
  if (!student._id) return 0
  
  // Vérifier le cache d'abord
  if (studentAverages.value.has(student._id)) {
    return studentAverages.value.get(student._id) || 0
  }
  
  // Vérifier que les données de référence sont disponibles
  if (!Array.isArray(evaluations.value) || !Array.isArray(subjects.value)) {
    console.warn('⚠️ Données de référence non disponibles pour', student.firstName)
    return 0
  }
  
  try {
    const grades = await loadStudentGrades(student)
    if (grades.length === 0) return 0
    
    let weightedSum = 0
    let weightSum = 0
    
    grades.forEach(grade => {
      if (!grade.isAbsent && (grade.score || grade.grade)) {
        const score = grade.score || grade.grade || 0
        const maxScore = grade.maxScore || grade.evaluationInfo?.maxScore || 20
        const coefficient = grade.evaluationInfo?.coefficient || 1
        
        // Convertir en note sur 20
        const normalizedGrade = (score / maxScore) * 20
        weightedSum += normalizedGrade * coefficient
        weightSum += coefficient
      }
    })
    
    const average = weightSum > 0 ? weightedSum / weightSum : 0
    
    // Mettre en cache
    studentAverages.value.set(student._id, average)
    
    return average
  } catch (err) {
    console.error('❌ Erreur calcul moyenne étudiant:', err)
    return 0
  }
}

const getStudentAverage = (student: Student | null) => {
  if (!student?._id) return '0.0'
  const average = studentAverages.value.get(student._id) || 0
  return average.toFixed(1)
}

const calculateClassRank = (student: Student | null) => {
  if (!student?._id) return 'N/A'
  return studentRanks.value.get(student._id) || 'N/A'
}

const calculateAllRanks = async () => {
  try {
    // Calculer les moyennes de tous les étudiants
    const averagesPromises = students.value.map(async (student) => {
      const average = await calculateStudentAverage(student)
      return { student, average }
    })
    
    const studentAveragesArray = await Promise.all(averagesPromises)
    
    // Trier par moyenne décroissante
    studentAveragesArray.sort((a, b) => b.average - a.average)
    
    // Assigner les rangs
    studentAveragesArray.forEach((item, index) => {
      if (item.student._id) {
        const rank = `${index + 1}/${students.value.length}`
        studentRanks.value.set(item.student._id, rank)
      }
    })
    
    console.log('✅ Rangs calculés pour', studentAveragesArray.length, 'étudiants')
  } catch (err) {
    console.error('❌ Erreur calcul des rangs:', err)
  }
}

const getAppreciation = (average: string | number) => {
  const avg = typeof average === 'string' ? parseFloat(average) : average
  if (avg >= 16) return 'Excellent'
  if (avg >= 14) return 'Très bien'
  if (avg >= 12) return 'Bien'
  if (avg >= 10) return 'Assez bien'
  return 'Insuffisant'
}

const calculateSubjectAverage = (subjectGrades: any[]) => {
  if (subjectGrades.length === 0) return 0
  
  let weightedSum = 0
  let weightSum = 0
  
  subjectGrades.forEach(grade => {
    if (!grade.isAbsent && (grade.score || grade.grade)) {
      const score = grade.score || grade.grade || 0
      const maxScore = grade.maxScore || grade.evaluationInfo?.maxScore || 20
      const coefficient = grade.evaluationInfo?.coefficient || 1
      
      // Convertir en note sur 20
      const normalizedGrade = (score / maxScore) * 20
      weightedSum += normalizedGrade * coefficient
      weightSum += coefficient
    }
  })
  
  return weightSum > 0 ? weightedSum / weightSum : 0
}

const getGradeColor = (grade: number, maxGrade: number) => {
  const percentage = (grade / maxGrade) * 100
  if (percentage >= 80) return 'text-green-600 dark:text-green-400'
  if (percentage >= 60) return 'text-blue-600 dark:text-blue-400'
  if (percentage >= 50) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Non définie'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Gestionnaires d'événements
const onClassChange = () => {
  console.log('Filtre classe changé:', selectedClassId.value)
}

const onPeriodChange = () => {
  console.log('Filtre période changé:', selectedPeriod.value)
}

const onStudentSearch = () => {
  console.log('Recherche élève:', searchStudent.value)
}

const viewBulletin = async (student: Student) => {
  selectedStudent.value = student
  showBulletinModal.value = true
  
  // Charger les notes de l'étudiant
  studentGrades.value = await loadStudentGrades(student)
  
  // S'assurer que la moyenne de cet étudiant est calculée
  if (student._id && !studentAverages.value.has(student._id)) {
    await calculateStudentAverage(student)
  }
}

const closeBulletinModal = () => {
  showBulletinModal.value = false
  selectedStudent.value = null
  studentGrades.value = []
}

const generatePDF = async (student: Student) => {
  if (!student) {
    showModal('error', 'Erreur', 'Aucun étudiant sélectionné pour la génération du PDF.', 'OK')
    return
  }

  try {
    // Afficher un message de chargement
    showModal('info', 'Génération en cours', `Génération du bulletin PDF pour ${student.firstName} ${student.lastName}...`, 'Patientez')
    
    // Charger les notes de l'étudiant si pas déjà chargées
    let grades = studentGrades.value
    if (!grades.length || selectedStudent.value?._id !== student._id) {
      grades = await loadStudentGrades(student)
    }

    // Calculer la moyenne si pas déjà calculée
    let average = studentAverages.value.get(student._id) || 0
    if (average === 0) {
      average = await calculateStudentAverage(student)
    }

    // Obtenir le rang
    const rank = studentRanks.value.get(student._id) || 'N/A'

    // Préparer les données pour le PDF
    const bulletinData = {
      student,
      grades,
      subjects: subjects.value,
      studentAverage: average,
      rank,
      tenantName: tenantName.value || 'Établissement',
      period: selectedPeriod.value || 'Année complète',
      className: student.academicInfo?.className || 'Non définie'
    }

    // Générer le PDF
    const { generateStudentBulletinPDF } = await import('@/services/bulletinPdfService')
    await generateStudentBulletinPDF(bulletinData)

    // Fermer le modal de chargement et afficher succès
    showConfirmModal.value = false
    setTimeout(() => {
      showModal('success', 'PDF généré', `Le bulletin de ${student.firstName} ${student.lastName} a été téléchargé avec succès.`, 'OK')
    }, 100)

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
    showConfirmModal.value = false
    setTimeout(() => {
      showModal('danger', 'Erreur de génération', 'Une erreur s\'est produite lors de la génération du PDF. Veuillez réessayer.', 'OK')
    }, 100)
  }
}

const generateAllBulletinsPDF = async () => {
  if (filteredStudents.value.length === 0) {
    showModal('warning', 'Aucun élève', 'Aucun élève trouvé pour la génération des bulletins.', 'OK')
    return
  }

  generatingAllPDFs.value = true
  let successCount = 0
  let errorCount = 0

  try {
    showModal('info', 'Génération en cours', `Génération de ${filteredStudents.value.length} bulletins en cours...`, 'Patientez')

    // Générer les PDFs un par un pour éviter de surcharger le navigateur
    for (const student of filteredStudents.value) {
      try {
        // Charger les notes de l'étudiant
        const grades = await loadStudentGrades(student)

        // Calculer la moyenne si pas déjà calculée
        let average = studentAverages.value.get(student._id) || 0
        if (average === 0) {
          average = await calculateStudentAverage(student)
        }

        // Obtenir le rang
        const rank = studentRanks.value.get(student._id) || 'N/A'

        // Préparer les données pour le PDF
        const bulletinData = {
          student,
          grades,
          subjects: subjects.value,
          studentAverage: average,
          rank,
          tenantName: tenantName.value || 'Établissement',
          period: selectedPeriod.value || 'Année complète',
          className: student.academicInfo?.className || 'Non définie'
        }

        // Générer le PDF
        const { generateStudentBulletinPDF } = await import('@/services/bulletinPdfService')
        await generateStudentBulletinPDF(bulletinData)
        
        successCount++
        
        // Petite pause pour éviter de bloquer l'interface
        await new Promise(resolve => setTimeout(resolve, 200))

      } catch (error) {
        console.error(`Erreur génération PDF pour ${student.firstName} ${student.lastName}:`, error)
        errorCount++
      }
    }

    // Afficher le résultat
    showConfirmModal.value = false
    setTimeout(() => {
      if (errorCount === 0) {
        showModal('success', 'Génération terminée', `${successCount} bulletins ont été générés avec succès!`, 'OK')
      } else {
        showModal('warning', 'Génération terminée avec erreurs', `${successCount} bulletins générés avec succès, ${errorCount} erreurs.`, 'OK')
      }
    }, 100)

  } catch (error) {
    console.error('Erreur lors de la génération en masse:', error)
    showConfirmModal.value = false
    setTimeout(() => {
      showModal('danger', 'Erreur de génération', 'Une erreur globale s\'est produite lors de la génération des bulletins.', 'OK')
    }, 100)
  } finally {
    generatingAllPDFs.value = false
  }
}

const sendByEmail = (student: Student) => {
  showModal('info', 'Envoi par email', `Le bulletin de ${student.firstName} ${student.lastName} sera bientôt envoyé par email.`, 'OK')
}

// Navigation
const goBack = () => {
  router.push(`/school/${tenantId.value}/evaluations`)
}

// Modals
const showModal = (type: 'danger' | 'warning' | 'success' | 'info', title: string, message: string, confirmText = 'OK', action?: () => void) => {
  confirmModalType.value = type
  confirmModalTitle.value = title
  confirmMessage.value = message
  confirmModalText.value = confirmText
  confirmAction.value = action || null
  showConfirmModal.value = true
}

const onConfirm = () => {
  if (confirmAction.value) {
    confirmAction.value()
  }
  showConfirmModal.value = false
  confirmAction.value = null
}

// Lifecycle et watchers
onMounted(async () => {
  loading.value = true
  try {
    // Charger d'abord les données de référence
    await Promise.all([
      loadEvaluations(),
      loadSubjects(),
      loadClasses()
    ])
    // Puis charger les étudiants
    await loadStudents()
    
    // Calculer les moyennes et rangs avec les vraies notes
    await calculateAllRanks()
    await calculateStats()
  } catch (err) {
    console.error('❌ Erreur lors du chargement initial:', err)
  } finally {
    loading.value = false
  }
})

// Watcher pour recharger quand le tenant change
watch(() => tenantId.value, async (newTenantId) => {
  if (newTenantId) {
    // Réinitialiser les caches
    studentAverages.value.clear()
    studentRanks.value.clear()
    
    await Promise.all([
      loadEvaluations(),
      loadSubjects(),
      loadClasses()
    ])
    await loadStudents()
    
    // Recalculer les moyennes et rangs
    await calculateAllRanks()
    await calculateStats()
  }
})
</script> 