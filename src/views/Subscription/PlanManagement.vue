<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
    <!-- Header moderne avec glass effect -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo et titre -->
          <div class="flex items-center group">
            <button 
              @click="$router.push('/school/dashboard')"
              class="flex items-center mr-6 p-2 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              title="Retour au dashboard"
            >
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div class="relative">
              <div class="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
                </svg>
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Gestion des Plans
              </h1>
              <p class="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Administration des abonnements</p>
            </div>
          </div>

          <!-- Actions header -->
          <div class="flex items-center space-x-4">
            <button
              @click="refreshPlans"
              :disabled="loading"
              class="p-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group disabled:opacity-50"
            >
              <svg class="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            
            <button
              @click="openCreateModal"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouveau Plan
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Banner d'information -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl mb-8">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="relative z-10">
          <div class="flex items-center justify-between">
        <div>
              <h2 class="text-3xl font-bold text-white mb-2">
                🎯 Plans d'Abonnement
              </h2>
              <p class="text-indigo-100 text-lg mb-4">
                Créez et gérez vos plans avec leurs tarifs et caractéristiques
              </p>
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-sm text-white">{{ plans?.length || 0 }} plans actifs</span>
                </div>
            <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span class="text-sm text-white">Tarification en FCFA</span>
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              <svg class="w-20 h-20 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10"/>
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

      <!-- Liste des Plans avec design moderne -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Message de chargement -->
        <div v-if="loading" class="col-span-full flex items-center justify-center py-12">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Chargement des plans...</p>
          </div>
        </div>
        
        <!-- Message si aucun plan -->
        <div v-else-if="!plans || plans.length === 0" class="col-span-full text-center py-12">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun plan disponible</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Commencez par créer votre premier plan d'abonnement.</p>
          <button
            @click="openCreateModal"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg transform hover:scale-105"
          >
            Créer un Plan
          </button>
    </div>

        <!-- Liste des plans -->
        <template v-else>
      <div
        v-for="plan in plans"
        :key="plan.id"
            class="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            :class="plan.popular ? 'ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-transparent' : ''"
      >
        <!-- Badge populaire -->
        <div
          v-if="plan.popular"
            class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
        >
            <span class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
            ⭐ Populaire
          </span>
        </div>

        <div class="text-center">
          <!-- Icône du plan -->
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <span class="text-2xl font-bold text-white">{{ plan.name.charAt(0) }}</span>
          </div>
          
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ plan.name }}
          </h3>
            
            <!-- Badge de validité -->
            <div class="mb-3 flex justify-center">
              <span 
                class="px-3 py-1 text-xs font-semibold rounded-full"
                :class="plan.validity === 'yearly' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'"
              >
                {{ formatValidityLabel(plan.validity) }}
              </span>
            </div>
            
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">
            {{ plan.description }}
          </p>
          
          <div class="mb-8">
              <span class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {{ formatPrice(plan.monthlyPrice) }}
            </span>
              <span class="text-gray-500 dark:text-gray-400 block text-sm mt-1">
                /{{ plan.validity === 'yearly' ? 'an' : 'mois' }}
              </span>
              <div v-if="plan.validity === 'yearly'" class="mt-2">
                <span class="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                  🎯 Facturation annuelle
                </span>
              </div>
          </div>
          
          <!-- Statistiques du plan -->
            <div class="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur rounded-2xl p-4 mb-6 border border-gray-200/50 dark:border-gray-600/50">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="text-center">
                  <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {{ plan.maxStudents === 999999 ? '∞' : plan.maxStudents }}
                </div>
                <div class="text-gray-600 dark:text-gray-400">Élèves</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {{ plan.maxTeachers === 999999 ? '∞' : plan.maxTeachers }}
                </div>
                <div class="text-gray-600 dark:text-gray-400">Professeurs</div>
              </div>
            </div>
          </div>
          
          <div class="text-left mb-8">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Fonctionnalités incluses
            </h4>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li v-for="feature in plan.features" :key="feature" class="flex items-start">
                <svg class="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
          
          <div class="space-y-3">
            <button
              @click="editPlan(plan)"
                class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-sm font-semibold shadow-lg transform hover:scale-105 hover:shadow-xl"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier le Plan
                </span>
            </button>
            <button
              @click="deletePlan(plan.id)"
                class="w-full bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 px-4 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 text-sm font-semibold border border-red-200/50 dark:border-red-600/30 backdrop-blur"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </span>
            </button>
            </div>
          </div>
        </div>
        </template>
      </div>
    </main>

    <!-- Modal de création/modification avec design moderne -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-gray-700/30">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {{ editingPlan ? 'Modifier le Plan' : 'Créer un Nouveau Plan' }}
        </h3>
          <button
            @click="closeModal"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors"
          >
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="savePlan" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Nom du plan *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 backdrop-blur"
              placeholder="ex: Plan Premium"
            >
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 backdrop-blur resize-none"
              placeholder="Description du plan..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Prix {{ formData.validity === 'yearly' ? 'annuel' : 'mensuel' }} (FCFA) *
              </label>
              <input
                v-model.number="formData.monthlyPrice"
                type="number"
                required
                min="0"
                step="1000"
                class="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 backdrop-blur"
                :placeholder="formData.validity === 'yearly' ? '500000' : '50000'"
              >
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {{ formData.validity === 'yearly' ? 'Prix pour une année complète' : 'Prix pour un mois' }}
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Élèves max *
              </label>
              <input
                v-model.number="formData.maxStudents"
                type="number"
                required
                min="1"
                class="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 backdrop-blur"
                placeholder="100"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Professeurs max *
            </label>
            <input
              v-model.number="formData.maxTeachers"
              type="number"
              required
              min="1"
              class="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 backdrop-blur"
              placeholder="10"
            >
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Validité *
            </label>
            <select
              v-model="formData.validity"
              class="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 backdrop-blur"
            >
              <option value="monthly">Mensuel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Fonctionnalités (une par ligne)
            </label>
            <textarea
              v-model="featuresText"
              rows="5"
              class="w-full bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 backdrop-blur resize-none"
              placeholder="Gestion des élèves&#10;Gestion des notes&#10;Bulletins scolaires&#10;Support email"
            ></textarea>
          </div>
          
          <div class="flex items-center p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl backdrop-blur">
            <input
              v-model="formData.popular"
              type="checkbox"
              id="popular"
              class="rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5"
            >
            <label for="popular" class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Marquer comme plan populaire (badge spécial)
            </label>
          </div>
          
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200/50 dark:border-gray-600/50">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-medium backdrop-blur"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ saving ? 'Enregistrement...' : (editingPlan ? 'Modifier' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  getAllPlans,
  createCustomPlan, 
  updateCustomPlan, 
  deleteCustomPlan,
  fetchCustomPlans 
} from '@/services/api'
import type { CustomPlan } from '@/services/api'

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  validity: 'monthly' | 'yearly'
  maxStudents: number
  maxTeachers: number
  features: string[]
  popular: boolean
}

// État
const plans = ref<Plan[]>([])
const standardPlans = ref<Plan[]>([])
const customPlans = ref<CustomPlan[]>([])
const allPlansData = ref<any>(null)

const showModal = ref(false)
const editingPlan = ref<Plan | null>(null)
const saving = ref(false)
const loading = ref(false)

const formData = ref<Omit<Plan, 'id'>>({
  name: '',
  description: '',
  monthlyPrice: 0,
  validity: 'monthly',
  maxStudents: 100,
  maxTeachers: 10,
  features: [],
  popular: false
})

const featuresText = ref('')

// Fonctions utilitaires
function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatValidityLabel(validity: 'monthly' | 'yearly'): string {
  return validity === 'yearly' ? 'Annuel' : 'Mensuel'
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Actions
function openCreateModal() {
  editingPlan.value = null
  formData.value = {
    name: '',
    description: '',
    monthlyPrice: 0,
    validity: 'monthly',
    maxStudents: 100,
    maxTeachers: 10,
    features: [],
    popular: false
  }
  featuresText.value = ''
  showModal.value = true
}

function editPlan(plan: Plan) {
  editingPlan.value = plan
  formData.value = { ...plan }
  featuresText.value = plan.features.join('\n')
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingPlan.value = null
}

async function loadPlans() {
  loading.value = true
  try {
    const data = await getAllPlans()
    console.log('Plans chargés depuis API:', data)
    
    // Adapter à la nouvelle structure d'API
    if (Array.isArray(data)) {
      plans.value = data
    } else if (data && data.plans) {
      plans.value = data.plans
    } else {
      plans.value = []
    }
    
    console.log('Plans assignés:', plans.value)
  } catch (error) {
    console.error('Erreur lors du chargement des plans:', error)
    // En cas d'erreur, initialiser avec un tableau vide
    plans.value = []
  } finally {
    loading.value = false
  }
}

function refreshPlans() {
  loadPlans()
}

async function savePlan() {
  if (!formData.value.name || formData.value.monthlyPrice <= 0) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  saving.value = true

  try {
    // Traiter les fonctionnalités
    const features = featuresText.value
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0)

    if (editingPlan.value) {
      // Modification via API
      const updateData = {
        name: formData.value.name,
        description: formData.value.description,
        monthlyPrice: formData.value.monthlyPrice,
        validity: formData.value.validity,
        maxStudents: formData.value.maxStudents,
        maxTeachers: formData.value.maxTeachers,
        features: features,
        popular: formData.value.popular
      }

      await updateCustomPlan(editingPlan.value.id, updateData)
      alert('Plan modifié avec succès !')
      await loadPlans() // Recharger les plans
    } else {
      // Création via API
      const apiPlanData = {
        name: formData.value.name,
        description: formData.value.description,
        monthlyPrice: formData.value.monthlyPrice,
        validity: formData.value.validity,
        maxStudents: formData.value.maxStudents,
        maxTeachers: formData.value.maxTeachers,
        features: features
      }

      console.log('Création du plan via API...')
      await createCustomPlan(apiPlanData)
      alert('Plan créé avec succès !')
      await loadPlans() // Recharger les plans
    }

    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du plan:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    alert(`Erreur lors de la sauvegarde: ${errorMessage}`)
  } finally {
    saving.value = false
  }
}

async function deletePlan(planId: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce plan? Cette action est irréversible.')) {
    try {
      await deleteCustomPlan(planId)
      alert('Plan supprimé avec succès !')
      await loadPlans() // Recharger les plans
    } catch (error) {
      console.error('Erreur lors de la suppression du plan:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      alert(`Erreur lors de la suppression: ${errorMessage}`)
    }
  }
}

// Charger tous les plans au montage
onMounted(async () => {
  await loadPlans()
})
</script> 