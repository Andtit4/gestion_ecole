<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />
    
    <!-- En-tête avec design amélioré -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-bold mb-2">
            🎯 Gestion des Plans d'Abonnement
          </h1>
          <p class="text-blue-100 text-lg">
            Créez et gérez vos plans avec leurs tarifs et caractéristiques en toute simplicité
          </p>
          <div class="flex items-center gap-4 mt-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-400 rounded-full"></div>
              <span class="text-sm">{{ plans.length }} plans actifs</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span class="text-sm">Tarification en CFA</span>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col items-center gap-4">
          <button
            @click="openCreateModal"
            class="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg transform hover:scale-105"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Créer un Nouveau Plan
          </button>
          
          <button
            @click="refreshPlans"
            :disabled="loading"
            class="bg-white/20 backdrop-blur text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Actualiser
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des Plans avec design amélioré -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300 relative transform hover:-translate-y-2"
        :class="plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''"
      >
        <!-- Badge populaire -->
        <div
          v-if="plan.popular"
          class="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <span class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            ⭐ Populaire
          </span>
        </div>

        <div class="text-center">
          <!-- Icône du plan -->
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span class="text-2xl font-bold text-white">{{ plan.name.charAt(0) }}</span>
          </div>
          
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {{ plan.name }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">
            {{ plan.description }}
          </p>
          
          <div class="mb-8">
            <span class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {{ formatPrice(plan.monthlyPrice) }}
            </span>
            <span class="text-gray-500 dark:text-gray-400 block text-sm mt-1">/mois</span>
          </div>
          
          <!-- Statistiques du plan -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
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
              class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-semibold shadow-md transform hover:scale-105"
            >
              ✏️ Modifier le Plan
            </button>
            <button
              @click="deletePlan(plan.id)"
              class="w-full bg-red-50 text-red-600 py-3 px-4 rounded-xl hover:bg-red-100 transition-colors text-sm font-semibold border border-red-200"
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création/modification -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ editingPlan ? 'Modifier le Plan' : 'Créer un Nouveau Plan' }}
        </h3>
        
        <form @submit.prevent="savePlan" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom du plan *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
              placeholder="ex: Plan Premium"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
              placeholder="Description du plan..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix mensuel (CFA) *
              </label>
              <input
                v-model.number="formData.monthlyPrice"
                type="number"
                required
                min="0"
                step="1000"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                placeholder="50000"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Élèves max *
              </label>
              <input
                v-model.number="formData.maxStudents"
                type="number"
                required
                min="1"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                placeholder="100"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Professeurs max *
            </label>
            <input
              v-model.number="formData.maxTeachers"
              type="number"
              required
              min="1"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
              placeholder="10"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fonctionnalités (une par ligne)
            </label>
            <textarea
              v-model="featuresText"
              rows="5"
              class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
              placeholder="Gestion des élèves&#10;Gestion des notes&#10;Bulletins scolaires&#10;Support email"
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input
              v-model="formData.popular"
              type="checkbox"
              id="popular"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
            <label for="popular" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Plan populaire (badge spécial)
            </label>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Enregistrement...' : (editingPlan ? 'Modifier' : 'Créer') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { fetchCustomPlans, createCustomPlan } from '@/services/api'
import type { CustomPlan } from '@/services/api'

const pageTitle = ref('Gestion des Plans')

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  maxStudents: number
  maxTeachers: number
  features: string[]
  popular: boolean
}

// État
const plans = ref<Plan[]>([
  // Plans de base statiques (affichés en lecture seule)
  {
    id: 'starter-static',
    name: 'Plan Starter',
    description: 'Pour les petites écoles',
    monthlyPrice: 5000,
    maxStudents: 50,
    maxTeachers: 5,
    features: [
      'Gestion des élèves',
      'Gestion des notes de base',
      'Bulletins simples',
      'Support par email'
    ],
    popular: false
  },
  {
    id: 'standard-static',
    name: 'Plan Standard',
    description: 'Le choix idéal pour la plupart des établissements',
    monthlyPrice: 10000,
    maxStudents: 200,
    maxTeachers: 20,
    features: [
      'Toutes les fonctionnalités Starter',
      'Emplois du temps avancés',
      'Communication avec les parents',
      'Gestion des absences',
      'Rapports détaillés',
      'Support prioritaire'
    ],
    popular: true
  },
  {
    id: 'enterprise-static',
    name: 'Plan Enterprise',
    description: 'Pour les grandes institutions',
    monthlyPrice: 150000,
    maxStudents: 999999,
    maxTeachers: 999999,
    features: [
      'Toutes les fonctionnalités Standard',
      'Multi-établissements',
      'API complète',
      'Intégrations personnalisées',
      'Formation dédiée',
      'Support 24/7',
      'Gestionnaire de compte dédié',
      'Sauvegarde avancée'
    ],
    popular: false
  }
])

const customPlans = ref<CustomPlan[]>([])

const showModal = ref(false)
const editingPlan = ref<Plan | null>(null)
const saving = ref(false)
const loading = ref(false)

const formData = ref<Omit<Plan, 'id'>>({
  name: '',
  description: '',
  monthlyPrice: 0,
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
      // Modification (plans statiques uniquement - pas d'API pour le moment)
      const planData: Plan = {
        ...formData.value,
        features,
        id: editingPlan.value.id
      }
      
      const index = plans.value.findIndex(p => p.id === editingPlan.value!.id)
      if (index > -1) {
        plans.value[index] = planData
      }
      alert('Plan modifié avec succès !')
    } else {
      // Création via API
      const apiPlanData = {
        name: formData.value.name,
        description: formData.value.description,
        monthlyPrice: formData.value.monthlyPrice,
        maxStudents: formData.value.maxStudents,
        maxTeachers: formData.value.maxTeachers,
        features: features
      }

      console.log('Création du plan via API...')
      const newPlan = await createCustomPlan(apiPlanData)
      
      // Ajouter le plan créé à la liste des plans personnalisés
      customPlans.value.push(newPlan)
      alert('Plan créé avec succès via l\'API !')
    }

    closeModal()
  } catch (error) {
    console.error('Erreur:', error)
    alert(`Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
  } finally {
    saving.value = false
  }
}

function deletePlan(planId: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce plan ? Cette action est irréversible.')) {
    const index = plans.value.findIndex(p => p.id === planId)
    if (index > -1) {
      plans.value.splice(index, 1)
      alert('Plan supprimé avec succès !')
    }
  }
}

async function refreshPlans() {
  loading.value = true
  try {
    console.log('Actualisation des plans...')
    const fetchedPlans = await fetchCustomPlans()
    customPlans.value = fetchedPlans
    console.log('Plans personnalisés chargés:', fetchedPlans)
    alert('Plans actualisés avec succès !')
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
    alert('Erreur lors de l\'actualisation des plans')
  } finally {
    loading.value = false
  }
}

// Charger les plans au montage
onMounted(async () => {
  await refreshPlans()
})
</script> 