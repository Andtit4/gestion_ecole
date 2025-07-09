<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Header moderne avec glass effect et bouton retour -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Bouton retour et titre -->
          <div class="flex items-center space-x-4">
            <button 
              @click="$router.push('/school/dashboard')"
              class="p-3 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
            >
              <svg class="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Gestion des Abonnements
              </h1>
              <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">Plans et tarification</p>
            </div>
          </div>
          
          <!-- Bouton nouveau plan -->
          <button 
            @click="openPlanModal()"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouveau Plan
          </button>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Banner d'information -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-3xl font-bold text-white mb-2">Gestion des Plans d'Abonnement</h2>
              <p class="text-indigo-100 text-lg">Créez et gérez vos plans tarifaires en FCFA</p>
            </div>
            <div class="hidden md:block">
              <svg class="w-20 h-20 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
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

      <!-- Statistiques des plans -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30">
          <div class="flex items-center">
            <div class="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Plans Totaux</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ plans.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30">
          <div class="flex items-center">
            <div class="p-3 rounded-2xl bg-green-100 dark:bg-green-900/30">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Plans Populaires</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ popularPlansCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/30">
          <div class="flex items-center">
            <div class="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Prix Moyen</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ averagePrice }} FCFA</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des plans avec design moderne -->
      <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Plans d'Abonnement</h3>
          
          <!-- Message si aucun plan -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">Chargement des plans...</p>
          </div>

          <div v-else-if="plans.length === 0" class="text-center py-12">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucun plan disponible</h4>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Commencez par créer votre premier plan d'abonnement.</p>
            <button 
              @click="openPlanModal()"
              class="mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Créer un Plan
            </button>
          </div>

          <!-- Grille des plans -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="plan in plans" 
              :key="plan.id"
              class="group relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              :class="{ 'ring-2 ring-indigo-500 ring-opacity-50': plan.popular }"
            >
              <!-- Badge populaire -->
              <div v-if="plan.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  POPULAIRE
                </span>
              </div>

              <div class="space-y-4">
                <!-- Header du plan -->
                <div class="text-center">
                  <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ plan.name }}</h4>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mt-2">{{ plan.description }}</p>
                </div>

                <!-- Prix -->
                <div class="text-center">
                  <div class="flex items-baseline justify-center">
                    <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatPrice(plan.monthlyPrice) }}</span>
                    <span class="text-gray-600 dark:text-gray-400 ml-1">FCFA/mois</span>
                  </div>
                </div>

                <!-- Limites -->
                <div class="space-y-2">
                  <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg class="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Jusqu'à {{ plan.maxStudents }} élèves
                  </div>
                  <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg class="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0v-4a1 1 0 011-1h2a1 1 0 011 1v4m-5 0v-6a1 1 0 011-1h2a1 1 0 011 1v6" />
                    </svg>
                    Jusqu'à {{ plan.maxTeachers }} professeurs
                  </div>
                </div>

                <!-- Fonctionnalités -->
                <div class="space-y-2">
                  <h5 class="font-medium text-gray-900 dark:text-white text-sm">Fonctionnalités :</h5>
                  <ul class="space-y-1">
                    <li v-for="feature in plan.features" :key="feature" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg class="h-3 w-3 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ feature }}
                    </li>
                  </ul>
                </div>

                <!-- Actions -->
                <div class="flex space-x-2 pt-4">
                  <button 
                    @click="editPlan(plan)"
                    class="flex-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium"
                  >
                    Modifier
                  </button>
                  <button 
                    @click="deletePlan(plan.id)"
                    class="flex-1 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de création/modification de plan -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ isEditing ? 'Modifier le Plan' : 'Nouveau Plan' }}
            </h3>
            <button 
              @click="closeModal"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="savePlan" class="space-y-6">
            <!-- Nom du plan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du plan
              </label>
              <input 
                v-model="planForm.name"
                type="text" 
                required
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ex: Plan Premium"
              >
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea 
                v-model="planForm.description"
                required
                rows="3"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Description du plan..."
              ></textarea>
            </div>

            <!-- Prix et limites -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prix mensuel (FCFA)
                </label>
                <input 
                  v-model.number="planForm.monthlyPrice"
                  type="number" 
                  required
                  min="0"
                  step="1000"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="50000"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre max d'élèves
                </label>
                <input 
                  v-model.number="planForm.maxStudents"
                  type="number" 
                  required
                  min="1"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre max de professeurs
                </label>
                <input 
                  v-model.number="planForm.maxTeachers"
                  type="number" 
                  required
                  min="1"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="25"
                >
              </div>
            </div>

            <!-- Fonctionnalités -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fonctionnalités
              </label>
              <div class="space-y-2">
                <div v-for="(feature, index) in planForm.features" :key="index" class="flex items-center space-x-2">
                  <input 
                    v-model="planForm.features[index]"
                    type="text"
                    class="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Fonctionnalité..."
                  >
                  <button 
                    type="button"
                    @click="removeFeature(index)"
                    class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <button 
                  type="button"
                  @click="addFeature"
                  class="w-full px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl hover:border-indigo-300 hover:text-indigo-500 transition-colors"
                >
                  + Ajouter une fonctionnalité
                </button>
              </div>
            </div>

            <!-- Plan populaire -->
            <div class="flex items-center space-x-3">
              <input 
                v-model="planForm.popular"
                type="checkbox"
                class="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              >
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Marquer comme plan populaire
              </label>
            </div>

            <!-- Boutons d'action -->
            <div class="flex space-x-4 pt-4">
              <button 
                type="button"
                @click="closeModal"
                class="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Annuler
              </button>
              <button 
                type="submit"
                :disabled="saving"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="saving" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sauvegarde...
                </span>
                <span v-else>
                  {{ isEditing ? 'Mettre à jour' : 'Créer le plan' }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAllPlans, createCustomPlan, updateCustomPlan, deleteCustomPlan } from '@/services/api'

// État réactif
const plans = ref([])
const loading = ref(true)
const showModal = ref(false)
const saving = ref(false)
const isEditing = ref(false)
const editingPlanId = ref(null)

// Formulaire de plan
const planForm = ref({
  name: '',
  description: '',
  monthlyPrice: 0,
  maxStudents: 0,
  maxTeachers: 0,
  features: [''],
  popular: false
})

// Statistiques calculées
const popularPlansCount = computed(() => {
  return plans.value.filter(plan => plan.popular).length
})

const averagePrice = computed(() => {
  if (plans.value.length === 0) return 0
  const total = plans.value.reduce((sum, plan) => sum + plan.monthlyPrice, 0)
  return Math.round(total / plans.value.length)
})

// Méthodes
const loadPlans = async () => {
  try {
    loading.value = true
    const data = await getAllPlans()
    plans.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des plans:', error)
    // Plans de fallback en cas d'erreur API
    plans.value = []
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const openPlanModal = (plan = null) => {
  if (plan) {
    isEditing.value = true
    editingPlanId.value = plan.id
    planForm.value = {
      name: plan.name,
      description: plan.description,
      monthlyPrice: plan.monthlyPrice,
      maxStudents: plan.maxStudents,
      maxTeachers: plan.maxTeachers,
      features: [...plan.features],
      popular: plan.popular
    }
  } else {
    isEditing.value = false
    editingPlanId.value = null
    planForm.value = {
      name: '',
      description: '',
      monthlyPrice: 0,
      maxStudents: 0,
      maxTeachers: 0,
      features: [''],
      popular: false
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingPlanId.value = null
}

const editPlan = (plan) => {
  openPlanModal(plan)
}

const addFeature = () => {
  planForm.value.features.push('')
}

const removeFeature = (index) => {
  if (planForm.value.features.length > 1) {
    planForm.value.features.splice(index, 1)
  }
}

const savePlan = async () => {
  try {
    saving.value = true
    
    // Filtrer les fonctionnalités vides
    const features = planForm.value.features.filter(f => f.trim() !== '')
    
    const planData = {
      ...planForm.value,
      features
    }

    if (isEditing.value) {
      await updateCustomPlan(editingPlanId.value, planData)
    } else {
      await createCustomPlan(planData)
    }

    // Recharger les plans
    await loadPlans()
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du plan:', error)
    alert('Erreur lors de la sauvegarde du plan')
  } finally {
    saving.value = false
  }
}

const deletePlan = async (planId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
    return
  }

  try {
    await deleteCustomPlan(planId)
    await loadPlans()
  } catch (error) {
    console.error('Erreur lors de la suppression du plan:', error)
    alert('Erreur lors de la suppression du plan')
  }
}

// Chargement initial
onMounted(() => {
  loadPlans()
})
</script> 