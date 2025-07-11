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
            <span class="text-gray-900 dark:text-white font-medium">Gestion de la Scolarité</span>
          </div>

          <!-- Titre et description -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Scolarité</h1>
              <p class="text-sm text-green-600 dark:text-green-400">Frais et Documents Scolaires</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal avec animations -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Statistiques avec design moderne -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Dossiers Actifs -->
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
                Actifs
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Dossiers Actifs</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statistics.activeDossiers || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">En cours de suivi</p>
            </div>
          </div>
        </div>

        <!-- Frais Collectés -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-blue-100 dark:bg-blue-900/30">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Collectés
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Frais Collectés</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(statistics.fraisCollectes || 0) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Total perçu</p>
            </div>
          </div>
        </div>

        <!-- Frais en Attente -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-orange-500 to-red-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-orange-100 dark:bg-orange-900/30">
                <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                En attente
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Frais en Attente</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(statistics.fraisEnAttente || 0) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">À collecter</p>
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-purple-500 to-pink-600"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-purple-100 dark:bg-purple-900/30">
                <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <span class="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                Total
              </span>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Documents</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statistics.documentsTotal || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Fichiers gérés</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides modernisées -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Actions Rapides</h3>
              <p class="text-gray-500 dark:text-gray-400">Gestion des opérations courantes</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Nouveau Dossier -->
            <button
              @click="showCreateModal = true"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-200 dark:border-blue-800/30"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative z-10">
                <div class="mb-4">
                  <div class="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 w-fit group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nouveau Dossier</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Créer un dossier de scolarité pour un élève</p>
              </div>
            </button>

            <!-- Enregistrer Paiement -->
            <button
              @click="showPaymentModal = true"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-200 dark:border-green-800/30"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative z-10">
                <div class="mb-4">
                  <div class="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 w-fit group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Enregistrer Paiement</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Ajouter un paiement de frais</p>
              </div>
            </button>

            <!-- Gérer Frais -->
            <button
              @click="showFeesModal = true"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-200 dark:border-purple-800/30"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative z-10">
                <div class="mb-4">
                  <div class="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 w-fit group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gérer Frais</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Configurer les frais scolaires</p>
              </div>
            </button>

            <!-- Rapport Financier -->
            <button
              @click="exportReport"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-200 dark:border-orange-800/30"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative z-10">
                <div class="mb-4">
                  <div class="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 w-fit group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Rapport Financier</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Exporter les données financières</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Filtres modernisés -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Filtres et Recherche</h3>
              <p class="text-gray-500 dark:text-gray-400">{{ dossiers.length }} dossier(s) trouvé(s)</p>
            </div>
            <div class="flex items-center space-x-3">
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
            </div>
          </div>
          
          <!-- Grille de filtres -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                v-model="filters.search"
                @input="debouncedSearch"
                type="text"
                placeholder="Rechercher un élève..."
                class="w-full pl-10 pr-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
              />
            </div>

            <div>
              <select
                v-model="filters.classe"
                @change="loadDossiers"
                class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
              >
                <option value="">Toutes les classes</option>
                <option v-for="classe in availableClasses" :key="classe" :value="classe">{{ classe }}</option>
              </select>
            </div>

            <div>
              <select
                v-model="filters.statutPaiement"
                @change="loadDossiers"
                class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
              >
                <option value="">Tous les statuts</option>
                <option value="paye">Payé</option>
                <option value="partiellement_paye">Partiellement payé</option>
                <option value="impaye">Impayé</option>
              </select>
            </div>

            <div>
              <select
                v-model="filters.anneeScolaire"
                @change="loadDossiers"
                class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
              >
                <option value="">Toutes les années</option>
                <option v-for="annee in availableAnnees" :key="annee" :value="annee">{{ annee }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Table des dossiers modernisée -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Dossiers Scolaires</h3>
          <p class="text-gray-500 dark:text-gray-400">Gestion des frais et documents</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-16">
          <div class="flex items-center space-x-4">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <span class="text-lg text-gray-600 dark:text-gray-400">Chargement des dossiers...</span>
          </div>
        </div>

        <!-- Data Table -->
        <div v-else-if="dossiers.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <thead class="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Élève</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matricule</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Classe</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frais Totaux</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payé</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Restant</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white/30 dark:bg-gray-800/30 divide-y divide-gray-200/30 dark:divide-gray-700/30">
              <tr v-for="dossier in dossiers" :key="dossier.id" class="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {{ dossier.nomEleve.charAt(0).toUpperCase() }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ dossier.nomEleve }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ dossier.anneeScolaire }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">{{ dossier.numeroMatricule }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ dossier.classe }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(dossier.fraisTotaux) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-green-600 dark:text-green-400">{{ formatCurrency(dossier.fraisPayes) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-red-600 dark:text-red-400">{{ formatCurrency(dossier.fraisRestants) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': dossier.statutPaiement === 'paye',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': dossier.statutPaiement === 'partiellement_paye',
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': dossier.statutPaiement === 'impaye'
                    }"
                    class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ getStatutLabel(dossier.statutPaiement) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="viewDossier(dossier)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    Voir
                  </button>
                  <button
                    @click="editDossier(dossier)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                  >
                    Modifier
                  </button>
                  <button
                    @click="addPayment(dossier)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                  >
                    Paiement
                  </button>
                  <button
                    v-if="dossier.paiements && dossier.paiements.length > 0"
                    @click="downloadLastReceipt(dossier)"
                    class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
                    title="Télécharger le reçu du dernier paiement"
                  >
                    📄 Reçu
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucun dossier trouvé</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">Commencez par créer un dossier de scolarité pour un élève.</p>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Créer un Dossier
          </button>
        </div>

        <!-- Pagination modernisée -->
        <div v-if="totalPages > 1" class="bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center justify-between">
            <div class="flex justify-between flex-1 sm:hidden">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-200"
              >
                Précédent
              </button>
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-200"
              >
                Suivant
              </button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  Affichage de
                  <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                  à
                  <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span>
                  sur
                  <span class="font-medium">{{ totalItems }}</span>
                  résultats
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                  <button
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-200"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>

                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="{
                      'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-400': page === currentPage,
                      'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700': page !== currentPage
                    }"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200"
                  >
                    {{ page }}
                  </button>

                  <button
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-200"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de création de dossier modernisé -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header du modal -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold text-white">Nouveau Dossier de Scolarité</h3>
              <p class="text-blue-100 mt-1">Sélectionner un élève existant</p>
            </div>
            <button
              @click="showCreateModal = false"
              class="text-white hover:text-blue-200 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Contenu du modal -->
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form @submit.prevent="createDossier" class="space-y-6">
            <!-- Sélection de l'élève -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Sélectionner un élève *</label>
              <div class="relative">
                <select
                  v-model="selectedStudent"
                  required
                  class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="">Choisir un élève...</option>
                  <option v-for="student in availableStudents" :key="student.id" :value="student">
                    {{ student.firstName }} {{ student.lastName }} - {{ student.studentNumber }} ({{ student.currentClass }})
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Seuls les élèves déjà inscrits dans l'établissement sont disponibles
              </p>
            </div>

            <!-- Informations pré-remplies -->
            <div v-if="selectedStudent" class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <h4 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Informations de l'élève</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Nom complet</label>
                  <p class="text-blue-900 dark:text-blue-100 font-medium">{{ selectedStudent.firstName }} {{ selectedStudent.lastName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Numéro de matricule</label>
                  <p class="text-blue-900 dark:text-blue-100 font-mono bg-white dark:bg-gray-800 px-3 py-1 rounded-lg">{{ selectedStudent.studentNumber }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Classe actuelle</label>
                  <p class="text-blue-900 dark:text-blue-100 font-medium">{{ selectedStudent.currentClass }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Statut</label>
                  <span class="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {{ selectedStudent.status === 'active' ? 'Actif' : selectedStudent.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Configuration du dossier -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Année scolaire *</label>
                <select
                  v-model="newDossier.anneeScolaire"
                  required
                  class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="">Sélectionner une année</option>
                  <option v-for="annee in availableAnnees" :key="annee" :value="annee">{{ annee }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Classe pour cette année *</label>
                <select
                  v-model="newDossier.classe"
                  required
                  class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="">Sélectionner une classe</option>
                  <option v-for="classe in availableClasses" :key="classe" :value="classe">{{ classe }}</option>
                </select>
              </div>
            </div>

            <!-- Remarques -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Remarques</label>
              <textarea
                v-model="newDossier.remarques"
                rows="3"
                placeholder="Notes ou remarques concernant ce dossier..."
                class="w-full px-4 py-3 rounded-2xl border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
              ></textarea>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="isCreatingDossier || !selectedStudent"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <span v-if="isCreatingDossier" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création...
                </span>
                <span v-else>Créer le Dossier</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modals additionnels (placeholders pour les autres fonctionnalités) -->
    <!-- Modal de paiement -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 rounded-t-3xl">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white">💰 Enregistrer un Paiement</h3>
            <button @click="closePaymentModal" class="text-white hover:text-green-200 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
          <form @submit.prevent="submitPayment" class="space-y-6">
            
            <!-- Sélection du dossier scolaire -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                📋 Dossier Scolaire <span class="text-red-500">*</span>
              </label>
              <select
                v-model="newPayment.dossierId"
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                :disabled="isSubmittingPayment"
              >
                <option value="">Sélectionner un dossier...</option>
                <option 
                  v-for="dossier in dossiers" 
                  :key="dossier._id || dossier.id" 
                  :value="dossier._id || dossier.id"
                  :disabled="dossier.statutPaiement === 'paye'"
                >
                  {{ dossier.nomEleve }} - {{ dossier.numeroMatricule }} ({{ dossier.classe }})
                  <span v-if="dossier.fraisRestants > 0"> - Reste: {{ formatCurrency(dossier.fraisRestants) }}</span>
                  <span v-else-if="dossier.statutPaiement === 'paye'"> - ✅ Payé</span>
                </option>
              </select>
              <p v-if="selectedDossierDetails" class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <strong>{{ selectedDossierDetails.nomEleve }}</strong><br>
                Frais totaux: {{ formatCurrency(selectedDossierDetails.fraisTotaux) }}<br>
                Déjà payé: {{ formatCurrency(selectedDossierDetails.fraisPayes) }}<br>
                <span class="text-green-600 dark:text-green-400 font-semibold">
                  Reste à payer: {{ formatCurrency(selectedDossierDetails.fraisRestants) }}
                </span>
              </p>
            </div>

            <!-- Montant du paiement -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                💵 Montant du Paiement <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model.number="newPayment.montant"
                  type="number"
                  min="1"
                  step="1"
                  required
                  :max="selectedDossierDetails?.fraisRestants || undefined"
                  placeholder="Montant en FCFA"
                  class="w-full px-4 py-3 pr-16 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                  :disabled="isSubmittingPayment || !newPayment.dossierId"
                />
                <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                  FCFA
                </span>
              </div>
              <div v-if="selectedDossierDetails" class="flex gap-2">
                <button
                  type="button"
                  @click="newPayment.montant = Math.min(50000, selectedDossierDetails.fraisRestants)"
                  class="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                  :disabled="selectedDossierDetails.fraisRestants < 50000"
                >
                  50,000 FCFA
                </button>
                <button
                  type="button"
                  @click="newPayment.montant = selectedDossierDetails.fraisRestants"
                  class="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200"
                >
                  Solde complet
                </button>
              </div>
            </div>

            <!-- Date du paiement -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                📅 Date du Paiement <span class="text-red-500">*</span>
              </label>
              <input
                v-model="newPayment.datePaiement"
                type="date"
                required
                :max="new Date().toISOString().split('T')[0]"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                :disabled="isSubmittingPayment"
              />
            </div>

            <!-- Méthode de paiement -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                💳 Méthode de Paiement <span class="text-red-500">*</span>
              </label>
              <select
                v-model="newPayment.methodePaiement"
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                :disabled="isSubmittingPayment"
              >
                <option value="">Sélectionner une méthode...</option>
                <option v-for="method in paymentMethods" :key="method" :value="method">
                  {{ method }}
                </option>
              </select>
            </div>

            <!-- Numéro de transaction (optionnel) -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                🔢 Numéro de Transaction <span class="text-gray-400">(optionnel)</span>
              </label>
              <input
                v-model="newPayment.numeroTransaction"
                type="text"
                placeholder="Référence ou numéro de transaction"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                :disabled="isSubmittingPayment"
              />
            </div>

            <!-- Remarques (optionnel) -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                💬 Remarques <span class="text-gray-400">(optionnel)</span>
              </label>
              <textarea
                v-model="newPayment.remarques"
                rows="3"
                placeholder="Commentaires ou notes sur ce paiement..."
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none"
                :disabled="isSubmittingPayment"
              ></textarea>
            </div>

            <!-- Actions du modal -->
            <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="closePaymentModal"
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Annuler
              </button>
              <button
                @click="submitPayment"
                :disabled="!isPaymentFormValid || isSubmittingPayment || isInitializingOnlinePayment"
                type="button"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg v-if="isSubmittingPayment || isInitializingOnlinePayment" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span v-if="isInitializingOnlinePayment">
                  🔄 Initialisation {{ newPayment.methodePaiement }}...
                </span>
                <span v-else-if="isSubmittingPayment">
                  💰 Enregistrement...
                </span>
                <span v-else>
                  {{ requiresCinetPay(newPayment.methodePaiement) ? '🔄 Procéder au paiement' : '💰 Enregistrer le paiement' }}
                </span>
              </button>
            </div>

            <!-- Information sur les paiements en ligne -->
            <div v-if="requiresCinetPay(newPayment.methodePaiement)" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="text-sm text-blue-800 dark:text-blue-200">
                  <p class="font-medium mb-1">💳 Paiement sécurisé avec {{ newPayment.methodePaiement }}</p>
                  <p class="text-xs">
                    Vous serez redirigé vers la plateforme CinetPay pour effectuer votre paiement de manière sécurisée. 
                    Le paiement sera automatiquement confirmé une fois la transaction validée.
                  </p>
                  <p class="text-xs mt-1 text-blue-600 dark:text-blue-300">
                    ⚡ Paiement en temps réel • 🔒 100% sécurisé • 📱 Compatible mobile
                  </p>
                </div>
              </div>
            </div>

            <!-- Champs spécifiques pour les paiements mobiles (Flooz, Tmoney) -->
            <div v-if="requiresCinetPay(newPayment.methodePaiement)" class="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Informations de paiement {{ newPayment.methodePaiement }}
                </h4>
              </div>

              <!-- Numéro de téléphone à créditer -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📱 Numéro de téléphone à créditer <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newPayment.telephonePaiement"
                  type="tel"
                  placeholder="+228 XX XX XX XX"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Numéro {{ newPayment.methodePaiement }} qui sera débité pour ce paiement
                </p>
              </div>

              <!-- Email de confirmation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📧 Email de confirmation <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newPayment.emailPaiement"
                  type="email"
                  placeholder="exemple@email.com"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Adresse email pour recevoir la confirmation de paiement
                </p>
              </div>
            </div>

            <!-- Numéro de transaction -->
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de gestion des frais -->
    <div v-if="showFeesModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4 rounded-t-3xl">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white">🧾 Gérer les Frais Scolaires</h3>
            <button @click="closeFeesModal" class="text-white hover:text-purple-200 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
          
          <!-- Onglets de navigation -->
          <div class="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
            <button
              @click="feesActiveTab = 'view'"
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200',
                feesActiveTab === 'view'
                  ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              📋 Voir les Frais
            </button>
            <button
              @click="feesActiveTab = 'add'"
              :class="[
                'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-200',
                feesActiveTab === 'add'
                  ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              ➕ Ajouter des Frais
            </button>
          </div>

          <!-- Onglet: Voir les Frais -->
          <div v-show="feesActiveTab === 'view'" class="space-y-6">
            
            <!-- Sélection du dossier pour voir les frais -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                📋 Sélectionner un Dossier
              </label>
              <select
                v-model="selectedFeeDossier"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="">Choisir un dossier...</option>
                <option 
                  v-for="dossier in dossiers" 
                  :key="dossier._id || dossier.id" 
                  :value="dossier._id || dossier.id"
                >
                  {{ dossier.nomEleve }} - {{ dossier.numeroMatricule }} ({{ dossier.classe }})
                </option>
              </select>
            </div>

            <!-- Affichage des frais du dossier sélectionné -->
            <div v-if="selectedDossierForFees" class="space-y-4">
              <div class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800/30">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ selectedDossierForFees.nomEleve }}</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Frais totaux:</span>
                    <div class="font-semibold text-purple-600 dark:text-purple-400">{{ formatCurrency(selectedDossierForFees.fraisTotaux) }}</div>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Déjà payé:</span>
                    <div class="font-semibold text-green-600 dark:text-green-400">{{ formatCurrency(selectedDossierForFees.fraisPayes) }}</div>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Reste à payer:</span>
                    <div class="font-semibold text-orange-600 dark:text-orange-400">{{ formatCurrency(selectedDossierForFees.fraisRestants) }}</div>
                  </div>
                  <div>
                    <span class="text-gray-500 dark:text-gray-400">Statut:</span>
                    <div class="font-semibold" :class="getStatusColor(selectedDossierForFees.statutPaiement)">
                      {{ getStatutLabel(selectedDossierForFees.statutPaiement) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Liste des frais -->
              <div class="space-y-3">
                <h5 class="text-lg font-semibold text-gray-900 dark:text-white">Liste des Frais ({{ selectedDossierForFees.frais.length }})</h5>
                
                <div v-if="selectedDossierForFees.frais.length === 0" class="text-center py-8">
                  <div class="text-gray-400 dark:text-gray-500 text-lg mb-2">💸</div>
                  <p class="text-gray-500 dark:text-gray-400">Aucun frais configuré pour ce dossier</p>
                  <button
                    @click="feesActiveTab = 'add'; newFee.dossierId = selectedDossierForFees._id || selectedDossierForFees.id"
                    class="mt-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                  >
                    Ajouter des frais →
                  </button>
                </div>

                <div v-else class="space-y-3">
                  <div
                    v-for="(frais, index) in selectedDossierForFees.frais"
                    :key="index"
                    class="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-200"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                :class="{
                                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': frais.obligatoire,
                                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': !frais.obligatoire
                                }">
                            {{ frais.obligatoire ? '🔴 Obligatoire' : '🔵 Optionnel' }}
                          </span>
                          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                            {{ frais.type }}
                          </span>
                        </div>
                        <h6 class="font-semibold text-gray-900 dark:text-white">{{ frais.description || frais.type }}</h6>
                        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ formatCurrency(frais.montant) }}</p>
                        <p v-if="frais.dateEcheance" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          📅 Échéance: {{ formatDate(frais.dateEcheance) }}
                        </p>
                      </div>
                      <div class="flex gap-2">
                        <button
                          @click="editFee(frais, index)"
                          class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                          title="Modifier"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          @click="deleteFee(frais, index)"
                          class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          title="Supprimer"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet: Ajouter des Frais -->
          <div v-show="feesActiveTab === 'add'" class="space-y-6">
            <form @submit.prevent="submitFee" class="space-y-6">
              
              <!-- Sélection du dossier -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  📋 Dossier Scolaire <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="newFee.dossierId"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  :disabled="isSubmittingFee"
                >
                  <option value="">Sélectionner un dossier...</option>
                  <option 
                    v-for="dossier in dossiers" 
                    :key="dossier._id || dossier.id" 
                    :value="dossier._id || dossier.id"
                  >
                    {{ dossier.nomEleve }} - {{ dossier.numeroMatricule }} ({{ dossier.classe }})
                  </option>
                </select>
              </div>

              <!-- Type de frais -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  🏷️ Type de Frais <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="newFee.type"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  :disabled="isSubmittingFee"
                >
                  <option value="">Choisir un type...</option>
                  <option v-for="type in fraisTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>

              <!-- Description -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  📝 Description <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newFee.description"
                  type="text"
                  required
                  placeholder="Description détaillée des frais"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  :disabled="isSubmittingFee"
                />
              </div>

              <!-- Montant -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  💰 Montant <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model.number="newFee.montant"
                    type="number"
                    min="1"
                    step="1"
                    required
                    placeholder="Montant en FCFA"
                    class="w-full px-4 py-3 pr-16 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                    :disabled="isSubmittingFee"
                  />
                  <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                    FCFA
                  </span>
                </div>
                <div class="flex gap-2">
                  <button
                    type="button"
                    @click="newFee.montant = 50000"
                    class="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200"
                  >
                    50,000
                  </button>
                  <button
                    type="button"
                    @click="newFee.montant = 100000"
                    class="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200"
                  >
                    100,000
                  </button>
                  <button
                    type="button"
                    @click="newFee.montant = 150000"
                    class="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200"
                  >
                    150,000
                  </button>
                </div>
              </div>

              <!-- Caractère obligatoire -->
              <div class="space-y-2">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    v-model="newFee.obligatoire"
                    type="checkbox"
                    class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    :disabled="isSubmittingFee"
                  />
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    🔴 Frais obligatoire
                  </span>
                </label>
                <p class="text-xs text-gray-500 dark:text-gray-400 ml-8">
                  Les frais obligatoires doivent être payés en priorité
                </p>
              </div>

              <!-- Date d'échéance -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  📅 Date d'Échéance <span class="text-gray-400">(optionnel)</span>
                </label>
                <input
                  v-model="newFee.dateEcheance"
                  type="date"
                  :min="new Date().toISOString().split('T')[0]"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  :disabled="isSubmittingFee"
                />
              </div>

              <!-- 🐛 Panneau de debug pour la validation -->
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                <h6 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🐛 Debug - État de la validation</h6>
                
                <!-- État des champs -->
                <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div class="flex items-center gap-2">
                    <span :class="feeFormDebug.dossierId ? 'text-green-600' : 'text-red-600'">
                      {{ feeFormDebug.dossierId ? '✅' : '❌' }}
                    </span>
                    <span class="text-gray-600 dark:text-gray-400">Dossier: {{ newFee.dossierId || 'vide' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="feeFormDebug.type ? 'text-green-600' : 'text-red-600'">
                      {{ feeFormDebug.type ? '✅' : '❌' }}
                    </span>
                    <span class="text-gray-600 dark:text-gray-400">Type: {{ newFee.type || 'vide' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="feeFormDebug.description ? 'text-green-600' : 'text-red-600'">
                      {{ feeFormDebug.description ? '✅' : '❌' }}
                    </span>
                    <span class="text-gray-600 dark:text-gray-400">Description: {{ newFee.description || 'vide' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="feeFormDebug.montant ? 'text-green-600' : 'text-red-600'">
                      {{ feeFormDebug.montant ? '✅' : '❌' }}
                    </span>
                    <span class="text-gray-600 dark:text-gray-400">Montant: {{ newFee.montant }}</span>
                  </div>
                </div>

                <!-- Informations sur les dossiers disponibles -->
                <div class="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                  <strong>📋 Dossiers disponibles:</strong> {{ dossiers.length }}
                  <div v-if="dossiers.length > 0" class="mt-1">
                    <div v-for="(dossier, index) in dossiers.slice(0, 3)" :key="dossier._id || dossier.id" class="truncate">
                      {{ index + 1 }}. {{ dossier.nomEleve }} (ID: {{ dossier._id || dossier.id }})
                    </div>
                    <div v-if="dossiers.length > 3" class="text-gray-500">... et {{ dossiers.length - 3 }} autres</div>
                  </div>
                  <div v-else class="text-red-600">❌ Aucun dossier chargé !</div>
                </div>

                <!-- Données brutes pour debug -->
                <div class="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs font-mono">
                  <strong>🔍 Données brutes:</strong><br>
                  dossierId: "{{ newFee.dossierId }}" (type: {{ typeof newFee.dossierId }})<br>
                  type: "{{ newFee.type }}" (type: {{ typeof newFee.type }})<br>
                  description: "{{ newFee.description }}" (type: {{ typeof newFee.description }})<br>
                  montant: {{ newFee.montant }} (type: {{ typeof newFee.montant }})
                </div>

                <!-- Résultat final -->
                <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div class="flex items-center gap-2">
                    <span :class="feeFormDebug.overall ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                      {{ feeFormDebug.overall ? '✅ FORMULAIRE VALIDE' : '❌ FORMULAIRE INVALIDE' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Boutons d'action -->
              <div class="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  @click="closeFeesModal"
                  class="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
                  :disabled="isSubmittingFee"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  class="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  :disabled="isSubmittingFee || !isFeeFormValid"
                >
                  <svg v-if="isSubmittingFee" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ isSubmittingFee ? 'Ajout en cours...' : 'Ajouter les Frais' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import { fetchTenant } from '@/services/api'
import cinetpayService from '@/services/cinetpayService'
import scolariteService, { 
  type DossierScolaire, 
  type CreateDossierScolaire, 
  type ScolariteStatistics,
  type FiltersOptions,
  type Paiement,
  type FraisScolaire
} from '@/services/scolariteService'
import pdfReceiptService from '@/services/pdfReceiptService'

// Simple debounce function
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Route and reactive data
const route = useRoute()
const currentTenantStore = useCurrentTenantStore()
const tenantId = computed(() => currentTenantStore.currentTenantId || route.params.tenantId as string || '')

// Informations de l'établissement (valeurs par défaut, puis récupérées via API)
const etablissementInfo = ref({
  nom: 'COMPLEXE SCOLAIRE EXCELLENCE',
  telephone: '+228 22 XX XX XX',
  adresse: 'BP 1234, Lomé - TOGO',
  email: 'contact@excellence-togo.org'
})

// Fonction pour récupérer les informations de l'établissement
const loadEtablissementInfo = async () => {
  try {
    if (!tenantId.value || tenantId.value === 'undefined' || tenantId.value === 'null') {
      console.warn('⚠️ ID du tenant manquant, utilisation des valeurs par défaut')
      return
    }

    console.log('📍 Récupération des informations de l\'établissement pour tenant:', tenantId.value)
    
    const tenantData = await fetchTenant(tenantId.value)
    
    // Mettre à jour les informations de l'établissement
    etablissementInfo.value = {
      nom: tenantData.name || 'COMPLEXE SCOLAIRE EXCELLENCE',
      telephone: tenantData.phone || '+228 22 XX XX XX',
      adresse: tenantData.city ? `${tenantData.city} - TOGO` : 'BP 1234, Lomé - TOGO',
      email: tenantData.adminEmail || 'contact@excellence-togo.org'
    }

    console.log('✅ Informations de l\'établissement récupérées:', etablissementInfo.value)
    
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des informations de l\'établissement:', error)
    console.log('📝 Utilisation des valeurs par défaut')
  }
}

// Data
const dossiers = ref<DossierScolaire[]>([])
const availableStudents = ref<any[]>([]) // Changed type to any[] as Student type is removed
const selectedStudent = ref<any | null>(null) // Changed type to any | null
const statistics = ref<ScolariteStatistics>({
  activeDossiers: 0,
  fraisCollectes: 0,
  fraisEnAttente: 0,
  documentsTotal: 0,
  repartitionParStatut: [],
  repartitionParClasse: []
})

// Loading states
const loading = ref(false)
const isCreatingDossier = ref(false)
const loadingStudents = ref(false)

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)
const totalItems = ref(0)
const totalPages = ref(0)

// Filters
const filters = ref<FiltersOptions>({
  classe: '',
  anneeScolaire: '',
  statutPaiement: undefined,
  search: ''
})

// Available options
const availableClasses = ref<string[]>([])
const availableAnnees = ref<string[]>([])
const fraisTypes = ref<string[]>([])
const paymentMethods = ref<string[]>([])

// Modals
const showCreateModal = ref(false)
const showPaymentModal = ref(false)
const showFeesModal = ref(false)
const showDocumentModal = ref(false)

// Form data
const newDossier = ref<CreateDossierScolaire>({
  etudiantId: '',
  nomEleve: '',
  numeroMatricule: '',
  classe: '',
  anneeScolaire: '',
  remarques: ''
})

// 💰 Payment form data
const newPayment = ref({
  dossierId: '',
  montant: 0,
  datePaiement: new Date().toISOString().split('T')[0], // Date d'aujourd'hui par défaut
  methodePaiement: '',
  numeroTransaction: '',
  remarques: '',
  // Nouveaux champs pour les paiements mobiles
  telephonePaiement: '',
  emailPaiement: ''
})

const isSubmittingPayment = ref(false)

// 🔄 Variables pour les paiements en ligne (CinetPay)
const isInitializingOnlinePayment = ref(false)
const onlinePaymentUrl = ref('')

// 🧾 Fees management data
const feesActiveTab = ref('view') // 'view' or 'add'
const selectedFeeDossier = ref('')
const isSubmittingFee = ref(false)

const newFee = ref({
  dossierId: '',
  type: '',
  description: '',
  montant: 0,
  obligatoire: false,
  dateEcheance: ''
})

// 💰 Payment computed properties
const selectedDossierDetails = computed(() => {
  if (!newPayment.value.dossierId) return null
  return dossiers.value.find(d => (d._id || d.id) === newPayment.value.dossierId) || null
})

const isPaymentFormValid = computed(() => {
  const basicValidation = newPayment.value.dossierId && 
         newPayment.value.montant > 0 && 
         newPayment.value.datePaiement && 
         newPayment.value.methodePaiement &&
         (!selectedDossierDetails.value || newPayment.value.montant <= selectedDossierDetails.value.fraisRestants)

  // Validation supplémentaire pour les paiements mobiles
  if (requiresCinetPay(newPayment.value.methodePaiement)) {
    return basicValidation && 
           newPayment.value.telephonePaiement.trim() !== '' &&
           newPayment.value.emailPaiement.trim() !== ''
  }

  return basicValidation
})

// 🧾 Fees computed properties
const selectedDossierForFees = computed(() => {
  if (!selectedFeeDossier.value) return null
  return dossiers.value.find(d => (d._id || d.id) === selectedFeeDossier.value) || null
})

const isFeeFormValid = computed(() => {
  const isValid = newFee.value.dossierId && 
         newFee.value.type && 
         newFee.value.description && 
         newFee.value.montant > 0
  
  // Debug - afficher les valeurs dans la console pour comprendre le problème
  console.log('🧾 Validation des frais:', {
    dossierId: newFee.value.dossierId,
    type: newFee.value.type,
    description: newFee.value.description,
    montant: newFee.value.montant,
    isValid
  })
  
  return isValid
})

// Computed property pour debug affiché dans l'interface
const feeFormDebug = computed(() => {
  return {
    dossierId: !!newFee.value.dossierId,
    type: !!newFee.value.type,
    description: !!newFee.value.description,
    montant: newFee.value.montant > 0,
    overall: isFeeFormValid.value
  }
})

// Computed properties
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// ✨ Watcher pour sélection automatique de classe
watch(selectedStudent, (newStudent) => {
  if (newStudent) {
    updateStudentInfo()
  }
}, { immediate: true })

// 🐛 Watcher pour debug des frais
watch(newFee, (newValue) => {
  console.log('🧾 newFee a changé:', JSON.stringify(newValue, null, 2))
}, { deep: true })

// 🐛 Watcher spécifique pour dossierId
watch(() => newFee.value.dossierId, (newId, oldId) => {
  console.log('🧾 dossierId changé:', { ancien: oldId, nouveau: newId, type: typeof newId })
})

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount)
}

const getStatutLabel = (statut: string): string => {
  const labels = {
    'paye': 'Payé',
    'partiellement_paye': 'Partiellement payé',
    'impaye': 'Impayé'
  }
  return labels[statut] || statut
}

const loadStudents = async () => {
  try {
    loadingStudents.value = true
    // Utiliser la nouvelle méthode du service scolarité qui récupère les élèves actifs
    availableStudents.value = await scolariteService.getAvailableStudents(tenantId.value)
  } catch (error) {
    console.error('Erreur lors du chargement des élèves:', error)
    availableStudents.value = []
  } finally {
    loadingStudents.value = false
  }
}

const loadDossiers = async () => {
  try {
    loading.value = true
    const response = await scolariteService.getDossiers(tenantId.value, currentPage.value, pageSize.value, filters.value)
    
    dossiers.value = response.dossiers
    totalItems.value = response.total
    totalPages.value = response.totalPages
  } catch (error) {
    console.error('Erreur lors du chargement des dossiers:', error)
    dossiers.value = []
  } finally {
    loading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const stats = await scolariteService.getStatistics(tenantId.value, filters.value.anneeScolaire)
    statistics.value = stats
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

const loadUtilityData = async () => {
  try {
    // Définir les méthodes de paiement spécifiques demandées
    const specificPaymentMethods = ['Espèces', 'Flooz', 'Tmoney', 'Paypal', 'Carte bancaire']
    
    const [classes, annees, types] = await Promise.all([
      scolariteService.getAvailableClasses(tenantId.value),
      scolariteService.getAnneesScolaires(tenantId.value),
      scolariteService.getFraisTypes(tenantId.value)
    ])

    availableClasses.value = classes.classes
    availableAnnees.value = annees.annees
    fraisTypes.value = types.types
    // Utiliser les méthodes de paiement spécifiques au lieu de l'API
    paymentMethods.value = specificPaymentMethods
    
    console.log('✅ Méthodes de paiement configurées:', paymentMethods.value)
  } catch (error) {
    console.error('Erreur lors du chargement des données utilitaires:', error)
    // En cas d'erreur, utiliser au moins les méthodes de paiement par défaut
    paymentMethods.value = ['Espèces', 'Flooz', 'Tmoney', 'Paypal', 'Carte bancaire']
  }
}

const updateStudentInfo = () => {
  if (selectedStudent.value) {
    // Informations de base de l'élève
    newDossier.value.etudiantId = selectedStudent.value._id || selectedStudent.value.id
    newDossier.value.nomEleve = `${selectedStudent.value.firstName} ${selectedStudent.value.lastName}`
    newDossier.value.numeroMatricule = selectedStudent.value.studentNumber

    // ✨ Sélection automatique de la classe de l'élève
    // Chercher la classe dans différents emplacements possibles
    let studentClass = ''
    
    // Méthode 1: currentClass (structure ancienne)
    if (selectedStudent.value.currentClass) {
      studentClass = selectedStudent.value.currentClass
    }
    // Méthode 2: academicInfo.className (structure moderne)
    else if (selectedStudent.value.academicInfo && selectedStudent.value.academicInfo.className) {
      studentClass = selectedStudent.value.academicInfo.className
    }
    // Méthode 3: academicInfo.class (autre variante possible)
    else if (selectedStudent.value.academicInfo && selectedStudent.value.academicInfo.class) {
      studentClass = selectedStudent.value.academicInfo.class
    }
    // Méthode 4: classe directe
    else if (selectedStudent.value.classe || selectedStudent.value.class) {
      studentClass = selectedStudent.value.classe || selectedStudent.value.class
    }

    // Vérifier que la classe trouvée existe dans les classes disponibles
    if (studentClass && availableClasses.value.includes(studentClass)) {
      newDossier.value.classe = studentClass
      console.log('✅ Classe sélectionnée automatiquement:', studentClass)
    } else {
      newDossier.value.classe = ''
      if (studentClass) {
        console.warn('⚠️ Classe de l\'élève non trouvée dans les classes disponibles:', studentClass)
        console.log('Classes disponibles:', availableClasses.value)
      } else {
        console.log('ℹ️ Aucune classe définie pour cet élève')
      }
    }
  }
}

const createDossier = async () => {
  if (!selectedStudent.value) {
    console.error('Aucun élève sélectionné')
    return
  }

  try {
    isCreatingDossier.value = true
    
    // Validation du tenantId
    const currentTenantId = tenantId.value
    if (!currentTenantId || currentTenantId === 'undefined' || currentTenantId === 'null') {
      console.error('TenantId manquant ou invalide:', currentTenantId)
      throw new Error('Impossible de créer le dossier : tenant non identifié')
    }
    
    // Validation des données requises
    const studentId = selectedStudent.value._id || selectedStudent.value.id
    if (!studentId) {
      console.error('ID étudiant manquant')
      throw new Error('ID étudiant manquant')
    }
    
    // Préparer les données du dossier
    const dossierData: CreateDossierScolaire = {
      etudiantId: studentId,
      nomEleve: `${selectedStudent.value.firstName} ${selectedStudent.value.lastName}`,
      numeroMatricule: selectedStudent.value.studentNumber,
      classe: newDossier.value.classe,
      anneeScolaire: newDossier.value.anneeScolaire,
      remarques: newDossier.value.remarques
    }
    
    console.log('Création du dossier avec:', {
      tenantId: currentTenantId,
      studentId,
      dossierData
    })
    
    await scolariteService.createDossier(dossierData, currentTenantId)
    
    // Reset form
    selectedStudent.value = null
    newDossier.value = {
      etudiantId: '',
      nomEleve: '',
      numeroMatricule: '',
      classe: '',
      anneeScolaire: '',
      remarques: ''
    }
    
    showCreateModal.value = false
    
    // Recharger les données
    await Promise.all([
      loadDossiers(),
      loadStatistics()
    ])
    
    console.log('Dossier créé avec succès')
  } catch (error) {
    console.error('Erreur lors de la création du dossier:', error)
    // Afficher un message d'erreur plus explicite à l'utilisateur
    alert(`Erreur lors de la création du dossier: ${error.message || error}`)
  } finally {
    isCreatingDossier.value = false
  }
}

const goToPage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await loadDossiers()
  }
}

const debouncedSearch = debounce(async () => {
  currentPage.value = 1
  await loadDossiers()
}, 500)

const viewDossier = (dossier: DossierScolaire) => {
  // Navigate to detail view or open modal
  console.log('Viewing dossier:', dossier.id)
}

const editDossier = (dossier: DossierScolaire) => {
  // Open edit modal
  console.log('Editing dossier:', dossier.id)
}

const addPayment = (dossier: DossierScolaire) => {
  // Open payment modal
  console.log('Adding payment for dossier:', dossier.id)
}

const exportReport = async () => {
  try {
    const report = await scolariteService.getFinancialReport(
      tenantId.value,
      filters.value.anneeScolaire || new Date().getFullYear().toString()
    )
    console.log('Financial report:', report)
    // Implement report download logic
  } catch (error) {
    console.error('Erreur lors de l\'export du rapport:', error)
  }
}

const refreshData = async () => {
  await Promise.all([
    loadDossiers(),
    loadStatistics(),
    loadStudents()
  ])
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  newPayment.value = {
    dossierId: '',
    montant: 0,
    datePaiement: new Date().toISOString().split('T')[0],
    methodePaiement: '',
    numeroTransaction: '',
    remarques: '',
    telephonePaiement: '',
    emailPaiement: ''
  }
}

const submitPayment = async () => {
  if (!isPaymentFormValid.value) {
    alert('Veuillez remplir tous les champs requis et vérifier que le montant ne dépasse pas le solde restant.')
    return
  }

  try {
    isSubmittingPayment.value = true
    const currentTenantId = tenantId.value
    if (!currentTenantId || currentTenantId === 'undefined' || currentTenantId === 'null') {
      throw new Error('TenantId manquant ou invalide.')
    }

    // 🔄 Vérifier si la méthode de paiement nécessite CinetPay
    if (requiresCinetPay(newPayment.value.methodePaiement)) {
      console.log('💳 Méthode de paiement en ligne détectée:', newPayment.value.methodePaiement)
      
      // Vérifier la configuration CinetPay
      if (!cinetpayService.isConfigured()) {
        alert('⚠️ CinetPay n\'est pas configuré. Veuillez contacter l\'administrateur pour configurer les clés API.')
        return
      }

      // Récupérer les détails du dossier sélectionné
      const dossierDetails = selectedDossierDetails.value
      if (!dossierDetails) {
        throw new Error('Dossier non trouvé')
      }

      // Extraire nom et prénom de l'élève
      const { nom, prenom } = extractStudentNames(dossierDetails.nomEleve)

      try {
        isInitializingOnlinePayment.value = true
        
        // Préparer les informations de l'élève
        const studentInfo = {
          nom,
          prenom,
          matricule: dossierDetails.numeroMatricule,
          classe: dossierDetails.classe,
          anneeScolaire: dossierDetails.anneeScolaire,
          // Utiliser les champs saisis par l'utilisateur pour les paiements mobiles
          email: newPayment.value.emailPaiement || `${dossierDetails.numeroMatricule}@${etablissementInfo.value.nom.toLowerCase().replace(/\s+/g, '')}.tg`,
          telephone: newPayment.value.telephonePaiement || '+22800000000'
        }

        // Initialiser le paiement CinetPay
        const paymentResponse = await cinetpayService.initiatePayment(
          newPayment.value.montant,
          `Paiement frais scolaires - ${studentInfo.prenom} ${studentInfo.nom} - ${studentInfo.classe}`,
          newPayment.value.methodePaiement,
          studentInfo,
          {
            nom: etablissementInfo.value.nom,
            adresse: etablissementInfo.value.adresse
          }
        )

        if (paymentResponse.data?.payment_url) {
          console.log('✅ URL de paiement CinetPay générée:', paymentResponse.data.payment_url)
          
          // Rediriger vers le portail de paiement CinetPay
          window.location.href = paymentResponse.data.payment_url
          
          // Note: Le paiement sera confirmé par webhook/callback
          // Pour l'instant, fermer le modal car l'utilisateur sera redirigé
          closePaymentModal()
          
          alert(`🔄 Redirection vers ${newPayment.value.methodePaiement} en cours...\n\nVous allez être redirigé vers la plateforme de paiement sécurisée.`)
          
          return // Sortir de la fonction car on redirige
          
        } else {
          throw new Error('URL de paiement non reçue de CinetPay')
        }
        
      } catch (cinetpayError) {
        console.error('❌ Erreur CinetPay:', cinetpayError)
        alert(`Erreur lors de l'initialisation du paiement ${newPayment.value.methodePaiement}:\n${cinetpayError.message || cinetpayError}`)
        return
      } finally {
        isInitializingOnlinePayment.value = false
      }
    }

    // 💰 PAIEMENT TRADITIONNEL (Espèces, Paypal)
    console.log('💰 Traitement du paiement traditionnel...')

    const paymentData: Paiement = {
      montant: newPayment.value.montant,
      datePaiement: newPayment.value.datePaiement,
      methodePaiement: newPayment.value.methodePaiement,
      numeroTransaction: newPayment.value.numeroTransaction || undefined,
      remarques: newPayment.value.remarques || undefined
    }

    console.log('Enregistrement du paiement:', {
      dossierId: newPayment.value.dossierId,
      paymentData,
      tenantId: currentTenantId
    })

    const dossierMisAJour = await scolariteService.addPaiement(
      newPayment.value.dossierId,
      paymentData,
      currentTenantId
    )

    console.log('✅ Paiement enregistré avec succès !')

    // 🧾 GÉNÉRATION DU REÇU PDF
    try {
      console.log('📄 Génération du reçu PDF...')
      
      const numeroRecu = pdfReceiptService.generateReceiptNumber()
      
      // Préparer les données pour le reçu
      const receiptData = {
        dossier: dossierMisAJour,
        paiement: {
          ...paymentData,
          dateEnregistrement: new Date().toISOString()
        },
        numeroRecu,
        etablissement: {
          nom: etablissementInfo.value.nom,
          adresse: etablissementInfo.value.adresse,
          telephone: etablissementInfo.value.telephone,
          email: etablissementInfo.value.email
        }
      }
      
      // Générer et télécharger le reçu PDF
      await pdfReceiptService.generateReceipt(receiptData)
      
      console.log('✅ Reçu PDF généré et téléchargé !')
      
      // Fermer le modal et reset le formulaire
      closePaymentModal()
      
      // Recharger les données
      await Promise.all([
        loadDossiers(),
        loadStatistics()
      ])
      
      // Message de succès avec mention du reçu PDF
      alert(`💰 Paiement enregistré avec succès !\n📄 Reçu N° ${numeroRecu} téléchargé automatiquement.`)
      
    } catch (pdfError) {
      console.error('❌ Erreur lors de la génération du reçu PDF:', pdfError)
      
      // Même si le PDF échoue, le paiement est enregistré
      closePaymentModal()
      
      await Promise.all([
        loadDossiers(),
        loadStatistics()
      ])
      
      alert(`💰 Paiement enregistré avec succès !\n⚠️ Erreur lors de la génération du reçu PDF. Vous pouvez le télécharger depuis la liste des paiements.`)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement du paiement:', error)
    alert(`Erreur lors de l'enregistrement du paiement: ${error.message || error}`)
  } finally {
    isSubmittingPayment.value = false
  }
}

// 🧾 === GESTION DES FRAIS ===

// Méthodes pour la gestion des frais
const closeFeesModal = () => {
  showFeesModal.value = false
  feesActiveTab.value = 'view'
  selectedFeeDossier.value = ''
  newFee.value = {
    dossierId: '',
    type: '',
    description: '',
    montant: 0,
    obligatoire: false,
    dateEcheance: ''
  }
}

const submitFee = async () => {
  if (!isFeeFormValid.value) {
    alert('Veuillez remplir tous les champs requis.')
    return
  }

  try {
    isSubmittingFee.value = true
    const currentTenantId = tenantId.value
    if (!currentTenantId || currentTenantId === 'undefined' || currentTenantId === 'null') {
      throw new Error('TenantId manquant ou invalide.')
    }

    const feeData: FraisScolaire = {
      type: newFee.value.type,
      description: newFee.value.description,
      montant: newFee.value.montant,
      obligatoire: newFee.value.obligatoire,
      dateEcheance: newFee.value.dateEcheance || undefined
    }

    console.log('Ajout de frais:', {
      dossierId: newFee.value.dossierId,
      feeData,
      tenantId: currentTenantId
    })

    await scolariteService.addFrais(newFee.value.dossierId, feeData, currentTenantId)

    // Reset form et recharger
    closeFeesModal()
    
    await Promise.all([
      loadDossiers(),
      loadStatistics()
    ])
    
    console.log('✅ Frais ajoutés avec succès !')
    alert('🧾 Frais ajoutés avec succès !')
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des frais:', error)
    alert(`Erreur lors de l'ajout des frais: ${error.message || error}`)
  } finally {
    isSubmittingFee.value = false
  }
}

const editFee = (frais: FraisScolaire, index: number) => {
  // TODO: Implémenter la modification des frais
  console.log('Modification des frais:', frais, index)
  alert('Fonctionnalité de modification en développement...')
}

const deleteFee = async (frais: FraisScolaire, index: number) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer ces frais : ${frais.description}?`)) {
    return
  }
  
  // TODO: Implémenter la suppression des frais
  console.log('Suppression des frais:', frais, index)
  alert('Fonctionnalité de suppression en développement...')
}

// Méthodes utilitaires
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusColor = (statut: string): string => {
  const colors = {
    'paye': 'text-green-600 dark:text-green-400',
    'partiellement_paye': 'text-orange-600 dark:text-orange-400',
    'impaye': 'text-red-600 dark:text-red-400'
  }
  return colors[statut] || 'text-gray-600 dark:text-gray-400'
}

// 📄 Fonction pour télécharger un reçu PDF
const downloadLastReceipt = async (dossier: DossierScolaire) => {
  try {
    if (!dossier.paiements || dossier.paiements.length === 0) {
      alert('Aucun paiement trouvé pour ce dossier.')
      return
    }

    // Récupérer le dernier paiement (le plus récent)
    const dernierPaiement = dossier.paiements[dossier.paiements.length - 1]
    
    console.log('📄 Génération du reçu pour le dernier paiement...', dernierPaiement)
    
    const numeroRecu = pdfReceiptService.generateReceiptNumber()
    
    // Préparer les données pour le reçu
    const receiptData = {
      dossier,
      paiement: {
        ...dernierPaiement,
        dateEnregistrement: dernierPaiement.dateEnregistrement || new Date().toISOString()
      },
      numeroRecu,
      etablissement: {
        nom: etablissementInfo.value.nom,
        adresse: etablissementInfo.value.adresse,
        telephone: etablissementInfo.value.telephone,
        email: etablissementInfo.value.email
      }
    }
    
    // Générer et télécharger le reçu PDF
    await pdfReceiptService.generateReceipt(receiptData)
    
    console.log('✅ Reçu PDF téléchargé avec succès !')
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du reçu:', error)
    alert(`Erreur lors de la génération du reçu: ${error.message || error}`)
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadEtablissementInfo(),
    loadStudents(),
    loadUtilityData(),
    loadDossiers(),
    loadStatistics()
  ])
})

// 💳 Fonction pour vérifier si la méthode de paiement nécessite CinetPay
const requiresCinetPay = (methodePaiement: string): boolean => {
  const onlineMethods = ['flooz', 'tmoney', 'carte bancaire']
  return onlineMethods.includes(methodePaiement.toLowerCase())
}

// 💳 Fonction pour extraire nom et prénom de l'élève
const extractStudentNames = (nomComplet: string): { nom: string; prenom: string } => {
  if (!nomComplet || nomComplet.trim() === '') {
    return {
      prenom: 'Prenom',
      nom: 'Nom'
    }
  }
  
  const parts = nomComplet.trim().split(' ').filter(part => part.length > 0)
  
  if (parts.length === 0) {
    return {
      prenom: 'Prenom',
      nom: 'Nom'
    }
  } else if (parts.length === 1) {
    return {
      prenom: parts[0],
      nom: 'Nom'
    }
  } else {
    return {
      prenom: parts[0],
      nom: parts.slice(1).join(' ')
    }
  }
}
</script> 