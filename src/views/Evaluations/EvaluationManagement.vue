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
              <div class="h-12 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
                <div class="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Évaluations & Notes
              </h1>
              <p class="text-sm text-purple-600 dark:text-purple-400 font-medium">{{ tenantName ? `${tenantName} - ` : '' }}Gestion complète des évaluations</p>
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
        <!-- Total Évaluations -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-purple-500 to-purple-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full bg-purple-100 py-0.5 pl-2 pr-2.5 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                Total
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Évaluations</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalEvaluations || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Créées au total</p>
            </div>
          </div>
        </div>

        <!-- Évaluations publiées -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full bg-emerald-100 py-0.5 pl-2 pr-2.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Publiées
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Publiées</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.publishedEvaluations || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Visibles aux élèves</p>
            </div>
          </div>
        </div>

        <!-- Notes saisies -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-blue-500 to-blue-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full bg-blue-100 py-0.5 pl-2 pr-2.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                Notes
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Notes saisies</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalGrades || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Notes attribuées</p>
            </div>
          </div>
        </div>

        <!-- Moyenne générale -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-orange-500 to-orange-600">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <span class="flex items-center gap-1 rounded-full py-0.5 pl-2 pr-2.5 text-sm font-medium" :class="averageColor">
                <div class="w-2 h-2 rounded-full" :class="averageDotColor"></div>
                {{ averageLabel }}
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Moyenne générale</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ formattedAverage }}/20</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Toutes matières</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Actions rapides -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8">
        <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
          Actions rapides
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Nouvelle évaluation -->
          <button
            @click="openCreateEvaluationModal"
            class="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10 flex items-center space-x-4">
              <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <div class="text-left">
                <p class="text-lg font-semibold">Nouvelle évaluation</p>
                <p class="text-purple-100 text-sm">Créer une nouvelle évaluation</p>
              </div>
            </div>
          </button>

          <!-- Saisir notes -->
          <button
            @click="openGradeEntryModal"
            class="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10 flex items-center space-x-4">
              <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <div class="text-left">
                <p class="text-lg font-semibold">Saisir des notes</p>
                <p class="text-blue-100 text-sm">Attribuer des notes aux élèves</p>
              </div>
            </div>
          </button>

          <!-- Consulter bulletins -->
          <button
            @click="navigateToBulletins"
            class="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10 flex items-center space-x-4">
              <div class="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div class="text-left">
                <p class="text-lg font-semibold">Consulter bulletins</p>
                <p class="text-emerald-100 text-sm">Voir les bulletins de notes</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Liste des évaluations -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Évaluations récentes</h3>
            <div class="flex items-center space-x-4">
              <!-- Filtres -->
              <select v-model="filters.type" @change="loadEvaluations" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Tous types</option>
                <option value="controle">Contrôle</option>
                <option value="examen">Examen</option>
                <option value="devoir">Devoir</option>
                <option value="oral">Oral</option>
                <option value="projet">Projet</option>
              </select>
              <button 
                @click="loadEvaluations" 
                class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Tableau des évaluations -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>

          <div v-else-if="evaluations.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Aucune évaluation trouvée</p>
            <button 
              @click="openCreateEvaluationModal"
              class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Créer la première évaluation
            </button>
          </div>

          <div v-else class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Évaluation</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="evaluation in evaluations" :key="evaluation._id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ evaluation.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ evaluation.description || 'Aucune description' }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getTypeColor(evaluation.type)">
                      {{ formatType(evaluation.type) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatDate(evaluation.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="evaluation.isPublished ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'">
                      {{ evaluation.isPublished ? 'Publiée' : 'Brouillon' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-3">
                      <button @click="editEvaluation(evaluation)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Modifier
                      </button>
                      <button @click="manageGrades(evaluation)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        Notes
                      </button>
                      <button @click="deleteEvaluation(evaluation)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>

    <!-- Modal de création d'évaluation -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showCreateModal = false"></div>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Nouvelle Évaluation
            </h3>
            
            <form @submit.prevent="createEvaluation" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom de l'évaluation</label>
                <input 
                  v-model="newEvaluation.name"
                  type="text" 
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ex: Contrôle Mathématiques"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea 
                  v-model="newEvaluation.description"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="3"
                  placeholder="Description de l'évaluation..."
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select 
                  v-model="newEvaluation.type"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="controle">Contrôle</option>
                  <option value="examen">Examen</option>
                  <option value="devoir">Devoir</option>
                  <option value="oral">Oral</option>
                  <option value="projet">Projet</option>
                  <option value="tp">TP</option>
                  <option value="participation">Participation</option>
                </select>
              </div>
              
              <!-- Matière -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Matière *
                </label>
                <select 
                  v-model="newEvaluation.subjectId"
                  required
                  :disabled="loadingFormData"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                >
                  <option value="">
                    {{ loadingFormData ? 'Chargement...' : 'Sélectionner une matière' }}
                  </option>
                  <option v-for="subject in subjects" :key="subject._id" :value="subject._id">
                    {{ subject.name }} ({{ subject.code }})
                  </option>
                </select>
                <p v-if="subjects.length === 0 && !loadingFormData" class="mt-1 text-sm text-red-600">
                  Aucune matière disponible. 
                  <router-link :to="`/school/${tenantId}/academic-structure`" class="underline">
                    Créer des matières
                  </router-link>
                </p>
              </div>
              
              <!-- Classe -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Classe *
                </label>
                <select 
                  v-model="newEvaluation.classId"
                  required
                  :disabled="loadingFormData"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                >
                  <option value="">
                    {{ loadingFormData ? 'Chargement...' : 'Sélectionner une classe' }}
                  </option>
                  <option v-for="classItem in classes" :key="classItem._id" :value="classItem._id">
                    {{ classItem.name }} ({{ classItem.level }})
                  </option>
                </select>
                <p v-if="classes.length === 0 && !loadingFormData" class="mt-1 text-sm text-red-600">
                  Aucune classe disponible. 
                  <router-link :to="`/school/${tenantId}/academic-structure`" class="underline">
                    Créer des classes
                  </router-link>
                </p>
              </div>
              
              <!-- Enseignant (optionnel) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enseignant (optionnel)
                </label>
                <select 
                  v-model="newEvaluation.teacherId"
                  :disabled="loadingFormData"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                >
                  <option value="">
                    {{ loadingFormData ? 'Chargement...' : 'Aucun enseignant sélectionné' }}
                  </option>
                  <option v-for="teacher in teachers" :key="teacher._id" :value="teacher._id">
                    {{ teacher.firstName }} {{ teacher.lastName }}
                    <span v-if="teacher.subjects && teacher.subjects.length > 0">
                      - {{ getTeacherSubjectsDisplay(teacher) }}
                    </span>
                  </option>
                </select>
                <div v-if="teachers.length === 0 && !loadingFormData" class="mt-2">
                  <p class="text-sm text-amber-600 dark:text-amber-400 mb-2">
                    ⚠️ Aucun enseignant disponible dans votre établissement.
                  </p>
                  <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p><strong>Pour ajouter des enseignants :</strong></p>
                    <p>1. 
                      <router-link 
                        :to="`/school/${tenantId}/teachers`" 
                        class="text-purple-600 hover:text-purple-500 underline"
                      >
                        Aller dans la gestion des enseignants
                      </router-link>
                    </p>
                    <p>2. <strong>Ou</strong> exécuter le script de test :</p>
                    <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                      node create-test-teachers.mjs
                    </code>
                  </div>
                </div>
              </div>
              
              <!-- Année académique -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Année académique *
                </label>
                <select 
                  v-model="newEvaluation.academicYearId"
                  required
                  :disabled="loadingFormData"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                >
                  <option value="">
                    {{ loadingFormData ? 'Chargement...' : 'Sélectionner une année académique' }}
                  </option>
                  <option v-for="year in academicYears" :key="year._id" :value="year._id">
                    {{ year.name }} {{ year.isActive ? '(Active)' : '' }}
                  </option>
                </select>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                  <input 
                    v-model="newEvaluation.date"
                    type="date" 
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Note max</label>
                  <input 
                    v-model.number="newEvaluation.maxScore"
                    type="number" 
                    required
                    min="1"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="20"
                  >
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Coefficient</label>
                <input 
                  v-model.number="newEvaluation.coefficient"
                  type="number" 
                  required
                  min="0.1"
                  step="0.1"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="1"
                >
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="newEvaluation.isPublished"
                  type="checkbox" 
                  class="h-4 w-4 text-purple-600 border-gray-300 rounded"
                >
                <label class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Publier immédiatement
                </label>
              </div>
              
              <!-- Validation visuelle -->
              <div v-if="!isFormValid" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md p-3">
                <div class="flex">
                  <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Champs requis manquants
                    </h3>
                    <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                      <ul class="list-disc pl-5 space-y-1">
                                                 <li v-if="!newEvaluation.subjectId">Matière requise</li>
                         <li v-if="!newEvaluation.classId">Classe requise</li>
                         <li v-if="!newEvaluation.academicYearId">Année académique requise</li>
                         <li v-if="!newEvaluation.name">Nom de l'évaluation requis</li>
                         <li v-if="!newEvaluation.type">Type d'évaluation requis</li>
                         <li v-if="!newEvaluation.date">Date requise</li>
                         <li v-if="!newEvaluation.maxScore || newEvaluation.maxScore <= 0">Note maximum requise</li>
                         <li v-if="!newEvaluation.coefficient || newEvaluation.coefficient <= 0">Coefficient requis</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Résumé de l'évaluation si formulaire valide -->
              <div v-else-if="isFormValid" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md p-3">
                <div class="flex">
                  <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                      Évaluation prête à créer
                    </h3>
                                         <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                       <p><strong>{{ newEvaluation.name }}</strong> - {{ newEvaluation.type }}</p>
                       <p>{{ getSelectedSubjectName() }} pour {{ getSelectedClassName() }}</p>
                       <p v-if="newEvaluation.teacherId">Enseignant : {{ getSelectedTeacherName() }}</p>
                       <p>Note sur {{ newEvaluation.maxScore }} - Coefficient {{ newEvaluation.coefficient }}</p>
                     </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button 
                  type="submit"
                  :disabled="creatingEvaluation || !isFormValid || loadingFormData"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ creatingEvaluation ? 'Création...' : loadingFormData ? 'Chargement...' : 'Créer l\'évaluation' }}
                </button>
                <button 
                  type="button"
                  @click="showCreateModal = false"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:col-start-1 sm:text-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de succès -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showSuccessModal = false"></div>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{{ modalTitle }}</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ modalMessage }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="showSuccessModal = false"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'erreur -->
    <div v-if="showErrorModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showErrorModal = false"></div>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">{{ modalTitle }}</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ modalMessage }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="showErrorModal = false"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation standardisé -->
    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmModalTitle"
      :message="confirmMessage"
      :type="confirmModalType"
      :confirm-text="confirmModalText"
      @confirm="onConfirm"
      @cancel="showConfirmModal = false"
    />

    <!-- Grade Management Modal -->
    <GradeManagementModal
      :is-visible="showGradeModal"
      :evaluation="selectedEvaluation"
      :tenant-id="tenantId"
      @close="closeGradeModal"
      @grades-updated="onGradesUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import { fetchEvaluations, createEvaluation as createEvaluationAPI, updateEvaluation as updateEvaluationAPI, deleteEvaluation as deleteEvaluationAPI, fetchEvaluationStats } from '@/services/evaluationService'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import GradeManagementModal from '@/components/evaluations/GradeManagementModal.vue'

const route = useRoute()
const router = useRouter()
const currentTenantStore = useCurrentTenantStore()

// Récupérer l'ID du tenant depuis les paramètres de route
const tenantId = computed(() => route.params.tenantId as string)

// State
const loading = ref(false)
const evaluations = ref([])
const error = ref<string | null>(null)
const stats = ref({
  totalEvaluations: 0,
  publishedEvaluations: 0,
  totalGrades: 0,
  averageGrade: 0
})

// Additional data for form
const subjects = ref([])
const classes = ref([])
const teachers = ref([])
const academicYears = ref([])
const loadingFormData = ref(false)

// Modals
const showCreateModal = ref(false)
const showGradeModal = ref(false)
const selectedEvaluation = ref<any>(null)
const creatingEvaluation = ref(false)

// ConfirmModal state
const showConfirmModal = ref(false)
const confirmModalTitle = ref('')
const confirmMessage = ref('')
const confirmModalType = ref<'danger' | 'warning' | 'success' | 'info'>('warning')
const confirmModalText = ref('Confirmer')
const confirmAction = ref<(() => void) | null>(null)

// Filters
const filters = ref({
  type: ''
})

// New evaluation form
const newEvaluation = ref({
  name: '',
  description: '',
  type: '',
  subjectId: '',
  classId: '',
  teacherId: '',
  academicYearId: '',
  periodId: '',
  date: '',
  maxScore: 20,
  coefficient: 1,
  scale: 'twenty' as const,
  isPublished: false
})

// Computed
const tenantName = computed(() => {
  if (currentTenantStore.tenantName) {
    return currentTenantStore.tenantName
  }
  
  try {
    const tenantId = route.params.tenantId as string
    if (!tenantId) return null
    
    const stored = localStorage.getItem(`tenant_${tenantId}`)
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

const formattedAverage = computed(() => {
  return (stats.value.averageGrade || 0).toFixed(1)
})

const averageColor = computed(() => {
  const avg = stats.value.averageGrade || 0
  if (avg >= 14) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  if (avg >= 10) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
  return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
})

const averageDotColor = computed(() => {
  const avg = stats.value.averageGrade || 0
  if (avg >= 14) return 'bg-green-500'
  if (avg >= 10) return 'bg-orange-500'
  return 'bg-red-500'
})

const averageLabel = computed(() => {
  const avg = stats.value.averageGrade || 0
  if (avg >= 14) return 'Excellent'
  if (avg >= 10) return 'Satisfaisant'
  return 'À améliorer'
})

const isFormValid = computed(() => {
  return !!(
    newEvaluation.value.name &&
    newEvaluation.value.type &&
    newEvaluation.value.subjectId &&
    newEvaluation.value.classId &&
    newEvaluation.value.academicYearId &&
    newEvaluation.value.date &&
    newEvaluation.value.maxScore > 0 &&
    newEvaluation.value.coefficient > 0
  )
})

// Methods
const goBack = () => {
  const tenantId = route.params.tenantId
  router.push(`/tenant/${tenantId}`)
}

const openCreateEvaluationModal = async () => {
  resetForm()
  await loadFormData()
  showCreateModal.value = true
}

const loadFormData = async () => {
  // Utiliser le même tenant ID que dans TeacherManagement
  const currentTenantId = currentTenantStore.currentTenantId || tenantId.value
  if (!currentTenantId) return
  
  console.log('🔍 LoadFormData - Tenant IDs:', {
    currentTenantStore: currentTenantStore.currentTenantId,
    routeParams: tenantId.value,
    using: currentTenantId
  })
  
  loadingFormData.value = true
  try {
    // Import des services de manière dynamique
    const { getSubjects, fetchClasses, fetchAcademicYears, getTeachers } = await import('@/services/academicService')
    
    // Charger les données en parallèle
    const [subjectsData, classesData, academicYearsData, teachersData] = await Promise.allSettled([
      getSubjects(currentTenantId),
      fetchClasses(currentTenantId),
      fetchAcademicYears(currentTenantId),
      getTeachers(currentTenantId)
    ])
    
    // Traiter les résultats avec diagnostic détaillé
    subjects.value = subjectsData.status === 'fulfilled' ? subjectsData.value : []
    classes.value = classesData.status === 'fulfilled' ? classesData.value : []
    academicYears.value = academicYearsData.status === 'fulfilled' ? academicYearsData.value : []
    teachers.value = teachersData.status === 'fulfilled' ? teachersData.value : []
    
    // Diagnostic détaillé
    console.log('✅ Données formulaire chargées:', {
      subjects: subjects.value.length,
      classes: classes.value.length,
      academicYears: academicYears.value.length,
      teachers: teachers.value.length
    })
    
    // Diagnostic des erreurs
    if (subjectsData.status === 'rejected') {
      console.error('❌ Erreur chargement matières:', subjectsData.reason)
    }
    if (classesData.status === 'rejected') {
      console.error('❌ Erreur chargement classes:', classesData.reason)
    }
    if (academicYearsData.status === 'rejected') {
      console.error('❌ Erreur chargement années:', academicYearsData.reason)
    }
    if (teachersData.status === 'rejected') {
      console.error('❌ Erreur chargement enseignants:', teachersData.reason)
    }
    
    // Afficher les enseignants trouvés
    if (teachers.value.length > 0) {
      console.log('👨‍🏫 Enseignants trouvés:', teachers.value.map(t => `${t.firstName} ${t.lastName} (${t._id})`))
    } else {
      console.warn('⚠️ Aucun enseignant trouvé avec tenant ID:', currentTenantId)
    }
    
    // Auto-sélectionner l'année académique active si disponible
    const activeYear = academicYears.value.find(year => year.isActive)
    if (activeYear) {
      newEvaluation.value.academicYearId = activeYear._id
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des données du formulaire:', error)
    showError('Erreur lors du chargement des données du formulaire')
  } finally {
    loadingFormData.value = false
  }
}

const resetForm = () => {
  newEvaluation.value = {
    name: '',
    description: '',
    type: '',
    subjectId: '',
    classId: '',
    teacherId: '',
    academicYearId: '',
    periodId: '',
    date: '',
    maxScore: 20,
    coefficient: 1,
    scale: 'twenty' as const,
    isPublished: false
  }
}

const initializeTenant = async () => {
  if (!tenantId.value) {
    console.error('Aucun tenantId trouvé dans les paramètres de route')
    return
  }
  
  console.log('🔍 Initialisation du tenant avec ID:', tenantId.value)
  
  try {
    // Récupérer le domaine du tenant via l'API directe
    const response = await fetch(`http://localhost:3000/api/v1/tenants/${tenantId.value}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    
    const tenant = await response.json()
    console.log('✅ Tenant récupéré:', tenant)
    
    // Utiliser le domaine du tenant pour les appels API suivants
    const domain = tenant.domain
    localStorage.setItem('currentTenant', domain)
    console.log('💾 Tenant domain stocké dans localStorage:', domain)
    
    return domain
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation du tenant:', error)
    showError('Erreur lors de l\'initialisation de l\'établissement')
    return null
  }
}

const loadEvaluations = async () => {
  if (!tenantId.value) {
    showError('Aucun établissement sélectionné')
    return
  }

  loading.value = true
  try {
    console.log('📊 Chargement des évaluations depuis l\'API...')
    const response = await fetchEvaluations(tenantId.value, filters.value)
    
    // L'API retourne { evaluations, total, page, limit, totalPages }
    if (response && response.evaluations) {
      evaluations.value = response.evaluations
      console.log('✅ Évaluations chargées:', evaluations.value.length, 'évaluations')
    } else if (Array.isArray(response)) {
      evaluations.value = response
    } else {
      evaluations.value = []
    }
    
    await loadStats()
  } catch (err) {
    console.error('Erreur lors du chargement des évaluations:', err)
    showError('Erreur lors du chargement des évaluations')
    evaluations.value = []
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  if (!tenantId.value) return
  
  try {
    console.log('📊 Chargement des statistiques depuis l\'API...')
    const response = await fetchEvaluationStats(tenantId.value)
    stats.value = response || {
      totalEvaluations: evaluations.value.length,
      publishedEvaluations: evaluations.value.filter(e => e.isPublished).length,
      totalGrades: 0,
      averageGrade: 0,
      pendingEvaluations: 0
    }
    console.log('✅ Statistiques chargées:', stats.value)
  } catch (err) {
    console.error('Erreur lors du chargement des statistiques:', err)
    // Calculs de base en cas d'erreur
    stats.value = {
      totalEvaluations: evaluations.value.length,
      publishedEvaluations: evaluations.value.filter(e => e.isPublished).length,
      totalGrades: 0,
      averageGrade: 0,
      pendingEvaluations: 0
    }
  }
}

const createEvaluation = async () => {
  if (!tenantId.value) {
    showErrorMessage('Erreur', 'Aucun établissement sélectionné')
    return
  }

  // Validation côté frontend
  if (!newEvaluation.value.subjectId) {
    showErrorMessage('Erreur de validation', 'Veuillez sélectionner une matière')
    return
  }
  
  if (!newEvaluation.value.classId) {
    showErrorMessage('Erreur de validation', 'Veuillez sélectionner une classe')
    return
  }
  
  if (!newEvaluation.value.academicYearId) {
    showErrorMessage('Erreur de validation', 'Veuillez sélectionner une année académique')
    return
  }

  console.log('🚀 Début création évaluation')
  console.log('🔑 TenantId utilisé:', tenantId.value)

  try {
    creatingEvaluation.value = true
    
    // Préparer les données d'évaluation - omettre les champs vides
    const evaluationData = {
      ...newEvaluation.value,
      scale: 'twenty' as const
    }
    
    // Supprimer les champs optionnels vides pour éviter les erreurs de validation backend
    if (!evaluationData.teacherId || evaluationData.teacherId.trim() === '') {
      delete evaluationData.teacherId
    }
    
    if (!evaluationData.periodId || evaluationData.periodId.trim() === '') {
      delete evaluationData.periodId
    }
    
    if (!evaluationData.description || evaluationData.description.trim() === '') {
      delete evaluationData.description
    }
    
    console.log('📝 Données évaluation:', evaluationData)
    console.log('📡 Appel createEvaluationAPI...')
    
    await createEvaluationAPI(tenantId.value, evaluationData)
    
    console.log('✅ Évaluation créée avec succès')
    showCreateModal.value = false
    await loadEvaluations() // Recharger la liste
    resetForm()
    showSuccessMessage('Évaluation créée', 'L\'évaluation a été créée avec succès.')
  } catch (err) {
    console.error('❌ Erreur lors de la création de l\'évaluation:', err)
    console.error('❌ Détails de l\'erreur:', err.message)
    showErrorMessage('Erreur de création', `Impossible de créer l'évaluation: ${err.message}`)
  } finally {
    creatingEvaluation.value = false
  }
}

const editEvaluation = (evaluation: any) => {
  // TODO: Implémenter l'édition
  console.log('Modifier évaluation:', evaluation)
}

const manageGrades = (evaluation: any) => {
  selectedEvaluation.value = evaluation
  showGradeModal.value = true
}

const deleteEvaluation = async (evaluation: any) => {
  if (!tenantId.value) {
    showErrorMessage('Erreur', 'Aucun établissement sélectionné')
    return
  }

  showModal(
    'danger',
    'Confirmer la suppression',
    `Êtes-vous sûr de vouloir supprimer l'évaluation "${evaluation.name}" ? Cette action est irréversible.`,
    'Supprimer',
    async () => {
      try {
        await deleteEvaluationAPI(tenantId.value, evaluation._id)
        await loadEvaluations()
        showSuccessMessage('Évaluation supprimée', 'L\'évaluation a été supprimée avec succès.')
      } catch (err) {
        console.error('Erreur lors de la suppression:', err)
        showErrorMessage('Erreur de suppression', 'Impossible de supprimer l\'évaluation. Veuillez réessayer.')
      }
    }
  )
}

const navigateToBulletins = () => {
  const tenantId = route.params.tenantId
  router.push(`/school/${tenantId}/bulletins`)
}

const openGradeEntryModal = () => {
  // Fonction générique pour ouvrir la saisie de notes
  // On pourrait sélectionner la première évaluation par défaut
  if (evaluations.value.length > 0) {
    selectedEvaluation.value = evaluations.value[0]
    showGradeModal.value = true
  } else {
    showErrorMessage('Aucune évaluation', 'Créez d\'abord une évaluation pour saisir des notes.')
  }
}

const openBulletinView = () => {
  navigateToBulletins()
}

const closeGradeModal = () => {
  showGradeModal.value = false
  selectedEvaluation.value = null
}

const onGradesUpdated = () => {
  // Recharger les stats après mise à jour des notes
  loadStats()
}

// Utility functions
const showError = (message: string) => {
  error.value = message
  setTimeout(() => {
    error.value = null
  }, 5000)
}

const showModal = (type: 'danger' | 'warning' | 'success' | 'info', title: string, message: string, confirmText = 'OK', action?: () => void) => {
  confirmModalType.value = type
  confirmModalTitle.value = title
  confirmMessage.value = message
  confirmModalText.value = confirmText
  confirmAction.value = action || null
  showConfirmModal.value = true
}

const showErrorMessage = (title: string, message: string) => {
  showModal('danger', title, message, 'OK')
}

const showSuccessMessage = (title: string, message: string) => {
  showModal('success', title, message, 'OK')
}

const showConfirmMessage = (title: string, message: string, action: () => void) => {
  showModal('warning', title, message, 'Confirmer', action)
}

const getSelectedSubjectName = () => {
  const subject = subjects.value.find(s => s._id === newEvaluation.value.subjectId)
  return subject ? subject.name : 'Matière non sélectionnée'
}

const getSelectedClassName = () => {
  const classItem = classes.value.find(c => c._id === newEvaluation.value.classId)
  return classItem ? classItem.name : 'Classe non sélectionnée'
}

const getSelectedTeacherName = () => {
  if (!newEvaluation.value.teacherId) return 'Aucun enseignant'
  const teacher = teachers.value.find(t => t._id === newEvaluation.value.teacherId)
  return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Enseignant non trouvé'
}

const getTeacherSubjectsDisplay = (teacher) => {
  if (!teacher.subjects || teacher.subjects.length === 0) {
    return 'Aucune matière'
  }
  
  // Si les subjects sont des objets avec une propriété 'name'
  if (typeof teacher.subjects[0] === 'object' && teacher.subjects[0].name) {
    return teacher.subjects.map(subject => subject.name).join(', ')
  }
  
  // Si les subjects sont des strings
  if (typeof teacher.subjects[0] === 'string') {
    return teacher.subjects.join(', ')
  }
  
  return 'Matières non définies'
}

const onConfirm = () => {
  if (confirmAction.value) {
    confirmAction.value()
  }
  showConfirmModal.value = false
  confirmAction.value = null
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

const formatType = (type: string) => {
  const types: Record<string, string> = {
    controle: 'Contrôle',
    examen: 'Examen',
    devoir: 'Devoir',
    oral: 'Oral',
    projet: 'Projet',
    tp: 'TP',
    participation: 'Participation'
  }
  return types[type] || type
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    controle: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    examen: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    devoir: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    oral: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    projet: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    tp: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    participation: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
  }
  return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 Composant EvaluationManagement monté')
  console.log('🔍 Tenant IDs au montage:', {
    routeParams: tenantId.value,
    currentTenant: currentTenantStore.currentTenantId
  })
  
  // S'assurer que le tenant store a le bon ID
  if (!currentTenantStore.currentTenantId && tenantId.value) {
    console.log('📍 Initialisation du tenant store avec:', tenantId.value)
    // Créer un objet tenant minimal à partir de l'ID
    try {
      const tenantResponse = await fetch(`http://localhost:3000/api/v1/tenants/${tenantId.value}`)
      if (tenantResponse.ok) {
        const tenantData = await tenantResponse.json()
        const tenant = {
          id: tenantData._id,
          name: tenantData.name || tenantData.schoolName || 'Établissement',
          domain: tenantData.domain,
          email: tenantData.email || ''
        }
        currentTenantStore.setSelectedTenant(tenant)
        console.log('✅ Tenant store initialisé:', tenant)
      }
    } catch (error) {
      console.error('❌ Erreur initialisation tenant store:', error)
    }
  }
  
  const domain = await initializeTenant()
  if (domain) {
    // Le tenant est initialisé, charger les évaluations
    await loadEvaluations()
  }
})
</script> 