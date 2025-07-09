<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- En-tête avec gradient -->
    <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">Gestion de la Scolarité</h1>
            <p class="text-blue-100 mt-2">Gérez les dossiers scolaires, frais et documents administratifs</p>
          </div>
          <div class="flex space-x-4">
            <button
              @click="showNewDossierModal = true"
              class="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 font-medium"
            >
              + Nouveau Dossier
            </button>
            <button
              @click="refreshData"
              :disabled="loading"
              class="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 font-medium disabled:opacity-50"
            >
              <span v-if="loading" class="animate-spin">⟳</span>
              <span v-else>↻</span>
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
          <div class="flex items-center">
            <div class="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Dossiers Actifs</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.activeDossiers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
          <div class="flex items-center">
            <div class="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Frais Collectés</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatPrice(stats.fraisCollectes) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
          <div class="flex items-center">
            <div class="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
              <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Frais en Attente</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatPrice(stats.fraisEnAttente) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
          <div class="flex items-center">
            <div class="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Documents</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.documentsTotal }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-8">
        <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Actions Rapides</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              v-for="action in quickActions"
              :key="action.name"
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

      <!-- Filtres et recherche -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-8">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recherche</label>
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Nom élève, numéro dossier..."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Classe</label>
              <select
                v-model="filters.classe"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Toutes les classes</option>
                <option v-for="classe in availableClasses" :key="classe" :value="classe">{{ classe }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statut Paiement</label>
              <select
                v-model="filters.statusPaiement"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Tous</option>
                <option value="paye">Payé</option>
                <option value="partiellement_paye">Partiellement payé</option>
                <option value="impaye">Impayé</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                @click="applyFilters"
                class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Filtrer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des dossiers -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
        <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Dossiers Scolaires</h3>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-500">Chargement des dossiers...</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50/50 dark:bg-gray-700/50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Élève</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Classe</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frais Totaux</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payé</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reste</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <tr
                v-for="dossier in filteredDossiers"
                :key="dossier.id"
                class="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span class="text-blue-600 dark:text-blue-400 font-semibold">{{ getInitials(dossier.nomEleve) }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ dossier.nomEleve }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ dossier.numeroMatricule }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ dossier.classe }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ formatPrice(dossier.fraisTotaux) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{{ formatPrice(dossier.fraisPayes) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">{{ formatPrice(dossier.fraisRestants) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(dossier.statutPaiement)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusLabel(dossier.statutPaiement) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewDossier(dossier)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Voir
                    </button>
                    <button
                      @click="editDossier(dossier)"
                      class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Modifier
                    </button>
                    <button
                      @click="managePaiements(dossier)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      Paiements
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div v-if="!loading && filteredDossiers.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun dossier trouvé</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Commencez par créer un nouveau dossier scolaire.</p>
        </div>
      </div>
    </div>

    <!-- Modal nouveau dossier -->
    <div v-if="showNewDossierModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Nouveau Dossier Scolaire</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Cette fonctionnalité sera implémentée prochainement.</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showNewDossierModal = false"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// État local
const loading = ref(false)
const showNewDossierModal = ref(false)
const searchTerm = ref('')

// Données simulées pour l'interface
const stats = ref({
  activeDossiers: 245,
  fraisCollectes: 12500000, // en FCFA
  fraisEnAttente: 3200000,
  documentsTotal: 1205
})

const filters = ref({
  classe: '',
  statusPaiement: ''
})

const availableClasses = ref([
  'CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2',
  '6ème', '5ème', '4ème', '3ème',
  'Seconde', 'Première', 'Terminale'
])

// Données simulées des dossiers
const dossiers = ref([
  {
    id: '1',
    nomEleve: 'Amadou DIALLO',
    numeroMatricule: 'MAT001',
    classe: 'CM2',
    fraisTotaux: 150000,
    fraisPayes: 100000,
    fraisRestants: 50000,
    statutPaiement: 'partiellement_paye'
  },
  {
    id: '2',
    nomEleve: 'Fatoumata TRAORE',
    numeroMatricule: 'MAT002',
    classe: '6ème',
    fraisTotaux: 200000,
    fraisPayes: 200000,
    fraisRestants: 0,
    statutPaiement: 'paye'
  },
  {
    id: '3',
    nomEleve: 'Ibrahim KONE',
    numeroMatricule: 'MAT003',
    classe: 'Terminale',
    fraisTotaux: 300000,
    fraisPayes: 0,
    fraisRestants: 300000,
    statutPaiement: 'impaye'
  }
])

const quickActions = ref([
  {
    name: 'Gérer Frais',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
    textColor: 'text-white',
    action: () => alert('Gestion des frais - En développement')
  },
  {
    name: 'Documents',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    textColor: 'text-white',
    action: () => alert('Gestion des documents - En développement')
  },
  {
    name: 'Certificats',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    bgColor: 'bg-gradient-to-r from-purple-500 to-pink-600',
    textColor: 'text-white',
    action: () => alert('Génération de certificats - En développement')
  },
  {
    name: 'Rapports',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    bgColor: 'bg-gradient-to-r from-orange-500 to-red-600',
    textColor: 'text-white',
    action: () => alert('Rapports financiers - En développement')
  }
])

// Computed
const filteredDossiers = computed(() => {
  let result = dossiers.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    result = result.filter(dossier => 
      dossier.nomEleve.toLowerCase().includes(search) ||
      dossier.numeroMatricule.toLowerCase().includes(search)
    )
  }

  if (filters.value.classe) {
    result = result.filter(dossier => dossier.classe === filters.value.classe)
  }

  if (filters.value.statusPaiement) {
    result = result.filter(dossier => dossier.statutPaiement === filters.value.statusPaiement)
  }

  return result
})

// Méthodes
function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

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
    'paye': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'partiellement_paye': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'impaye': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return classes[status as keyof typeof classes] || classes.impaye
}

function getStatusLabel(status: string): string {
  const labels = {
    'paye': 'Payé',
    'partiellement_paye': 'Partiellement payé',
    'impaye': 'Impayé'
  }
  return labels[status as keyof typeof labels] || 'Statut inconnu'
}

function applyFilters() {
  // Les filtres sont appliqués automatiquement via computed
  console.log('Filtres appliqués:', filters.value)
}

function refreshData() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    console.log('Données actualisées')
  }, 1500)
}

function viewDossier(dossier: any) {
  console.log('Voir dossier:', dossier)
  alert(`Visualisation du dossier de ${dossier.nomEleve} - En développement`)
}

function editDossier(dossier: any) {
  console.log('Modifier dossier:', dossier)
  alert(`Modification du dossier de ${dossier.nomEleve} - En développement`)
}

function managePaiements(dossier: any) {
  console.log('Gérer paiements:', dossier)
  alert(`Gestion des paiements pour ${dossier.nomEleve} - En développement`)
}

// Lifecycle
onMounted(() => {
  console.log('ScolariteManagement mounted', route.params)
  refreshData()
})
</script> 