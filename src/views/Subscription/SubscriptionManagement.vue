<template>
  <div class="p-6 space-y-6">
    <!-- En-tête -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">
          Gestion des Abonnements
        </h1>
        <p class="text-gray-600 mt-1">
          Gérez les plans et la facturation de vos établissements
        </p>
      </div>
      
      <div class="flex space-x-4">
        <button
          @click="() => { console.log('Clic sur Créer un abonnement'); showCreateModal = true }"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Créer un abonnement
        </button>
        
        <button
          @click="refreshData"
          :disabled="loading"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <span v-if="loading">⟳</span>
          <span v-else>↻</span>
          Actualiser
        </button>
      </div>
    </div>

    <!-- Sélecteur d'établissement -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex items-center space-x-4">
        <label class="block text-sm font-medium text-gray-700">
          Établissement :
        </label>
        <select
          v-model="selectedTenantId"
          @change="loadTenantData"
          class="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-64"
        >
          <option value="">Sélectionnez un établissement</option>
          <option
            v-for="tenant in tenantStore.tenants"
            :key="tenant._id"
            :value="tenant._id"
          >
            {{ tenant.name }} ({{ tenant.domain }})
          </option>
        </select>
      </div>
    </div>

    <!-- Contenu principal (affiché seulement si un tenant est sélectionné) -->
    <div v-if="selectedTenantId && currentTenant">
      
      <!-- Informations de l'abonnement actuel -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Abonnement Actuel - {{ currentTenant.name }}
          </h2>
        </div>
        
        <div class="p-6" v-if="usageStats">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Plan actuel -->
            <div class="col-span-1">
              <div class="text-center p-6 border rounded-lg">
                <div :class="subscriptionStore.getPlanBadgeColor(usageStats.subscription.plan as SubscriptionPlan)" 
                     class="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4">
                  {{ getPlanLabel(usageStats.subscription.plan as SubscriptionPlan) }}
                </div>
                
                <p class="text-3xl font-bold text-gray-900 mb-2">
                  {{ subscriptionStore.formatPrice(usageStats.subscription.pricePerMonth) }}
                </p>
                <p class="text-sm text-gray-500 mb-4">/mois</p>
                
                <div class="space-y-2 text-sm">
                  <p>
                    <span class="font-medium">Début:</span>
                    {{ formatDate(usageStats.subscription.startDate) }}
                  </p>
                  <p>
                    <span class="font-medium">Fin:</span>
                    {{ formatDate(usageStats.subscription.endDate) }}
                  </p>
                  <p :class="getExpirationClass(usageStats.daysUntilExpiry)">
                    {{ subscriptionStore.formatDaysUntilExpiry(usageStats.daysUntilExpiry) }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Utilisation -->
            <div class="col-span-2">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Utilisation</h3>
              
              <div class="space-y-4">
                <!-- Élèves -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Élèves</span>
                    <span class="text-sm text-gray-500">
                      {{ usageStats.subscription.currentStudents }} / {{ usageStats.subscription.maxStudents === 999999 ? '∞' : usageStats.subscription.maxStudents }}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      :class="subscriptionStore.getUsageColor(usageStats.usagePercentage.students)"
                      class="h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${Math.min(usageStats.usagePercentage.students, 100)}%` }"
                    ></div>
                  </div>
                  <p :class="subscriptionStore.getUsageColor(usageStats.usagePercentage.students)" 
                     class="text-xs mt-1 text-right">
                    {{ usageStats.usagePercentage.students }}%
                  </p>
                </div>

                <!-- Professeurs -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Professeurs</span>
                    <span class="text-sm text-gray-500">
                      {{ usageStats.subscription.currentTeachers }} / {{ usageStats.subscription.maxTeachers === 999999 ? '∞' : usageStats.subscription.maxTeachers }}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      :class="subscriptionStore.getUsageColor(usageStats.usagePercentage.teachers)"
                      class="h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${Math.min(usageStats.usagePercentage.teachers, 100)}%` }"
                    ></div>
                  </div>
                  <p :class="subscriptionStore.getUsageColor(usageStats.usagePercentage.teachers)" 
                     class="text-xs mt-1 text-right">
                    {{ usageStats.usagePercentage.teachers }}%
                  </p>
                </div>

                <!-- Fonctionnalités -->
                <div class="mt-6">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Fonctionnalités incluses</h4>
                  <div class="grid grid-cols-2 gap-2">
                    <div
                      v-for="feature in getCurrentPlanFeatures()"
                      :key="feature"
                      class="flex items-center text-sm text-gray-600"
                    >
                      <span class="text-green-500 mr-2">✓</span>
                      {{ feature }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="mt-6 flex flex-wrap gap-3">
            <button
              @click="showUpgradeModal = true"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Changer de plan
            </button>
            
            <button
              @click="showRenewModal = true"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Renouveler
            </button>
            
            <button
              @click="cancelSubscription"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Annuler l'abonnement
            </button>
          </div>
        </div>
      </div>

      <!-- Plans disponibles -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Plans Disponibles
          </h2>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="{ plan, details } in subscriptionStore.sortedPlans"
              :key="plan"
              class="border rounded-lg p-6 relative"
              :class="{
                'border-blue-500 bg-blue-50': usageStats?.subscription.plan === plan,
                'border-gray-200': usageStats?.subscription.plan !== plan
              }"
            >
              <!-- Badge plan actuel -->
              <div
                v-if="usageStats?.subscription.plan === plan"
                class="absolute -top-3 left-1/2 transform -translate-x-1/2"
              >
                <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Plan Actuel
                </span>
              </div>

              <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ details.name }}
                </h3>
                <p class="text-3xl font-bold text-blue-600 mt-2">
                  {{ details.pricePerMonth }}€
                </p>
                <p class="text-sm text-gray-500">/mois</p>
                
                <div class="mt-4 space-y-2">
                  <p class="text-sm">
                    <strong>{{ details.maxStudents === 999999 ? 'Illimité' : details.maxStudents }}</strong> élèves
                  </p>
                  <p class="text-sm">
                    <strong>{{ details.maxTeachers === 999999 ? 'Illimité' : details.maxTeachers }}</strong> professeurs
                  </p>
                </div>
                
                <div class="mt-4">
                  <ul class="text-xs text-gray-600 space-y-1">
                    <li v-for="feature in details.features.slice(0, 4)" :key="feature">
                      ✓ {{ feature }}
                    </li>
                  </ul>
                </div>

                <!-- Bouton d'action -->
                <div class="mt-6">
                  <button
                    v-if="usageStats?.subscription.plan !== plan"
                    @click="selectPlanForUpgrade(plan, details)"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Passer à ce plan
                  </button>
                  <div
                    v-else
                    class="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg text-sm"
                  >
                    Plan actuel
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Historique de facturation -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Historique de Facturation
          </h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facture
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="invoice in billingHistory" :key="invoice.invoiceNumber">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ invoice.invoiceNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(invoice.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ invoice.plan }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ subscriptionStore.formatPrice(invoice.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getInvoiceStatusClass(invoice.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ getInvoiceStatusLabel(invoice.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button class="text-blue-600 hover:text-blue-800 transition-colors">
                    Télécharger PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="bg-white rounded-lg shadow p-8 text-center">
      <div class="text-6xl mb-4">💳</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Sélectionnez un établissement
      </h3>
      <p class="text-gray-500">
        Choisissez un établissement dans la liste pour gérer son abonnement.
      </p>
    </div>

    <!-- Modal de changement de plan -->
    <div v-if="showUpgradeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Changer de Plan
        </h3>
        
        <div v-if="selectedPlan" class="mb-4">
          <p class="text-sm text-gray-600 mb-2">
            Passer au plan <strong>{{ selectedPlan.name }}</strong>
          </p>
          <p class="text-lg font-bold text-blue-600">
            {{ subscriptionStore.formatPrice(selectedPlan.pricePerMonth) }}/mois
          </p>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Durée (en mois)
            </label>
            <select v-model="upgradeDuration" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="1">1 mois</option>
              <option value="3">3 mois</option>
              <option value="6">6 mois</option>
              <option value="12">12 mois</option>
            </select>
          </div>
          
          <div class="mt-4 p-3 bg-gray-50 rounded-md">
            <p class="text-sm text-gray-600">
              <strong>Total:</strong>
              {{ subscriptionStore.formatPrice(selectedPlan.pricePerMonth * upgradeDuration) }}
            </p>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="showUpgradeModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="confirmUpgrade"
            :disabled="upgradeLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="upgradeLoading">Traitement...</span>
            <span v-else>Confirmer</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de renouvellement -->
    <div v-if="showRenewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Renouveler l'Abonnement
        </h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Durée de renouvellement (en mois)
          </label>
          <select v-model="renewDuration" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="1">1 mois</option>
            <option value="3">3 mois</option>
            <option value="6">6 mois</option>
            <option value="12">12 mois</option>
          </select>
        </div>
        
        <div v-if="usageStats" class="mt-4 p-3 bg-gray-50 rounded-md">
          <p class="text-sm text-gray-600">
            <strong>Total:</strong>
            {{ subscriptionStore.formatPrice(usageStats.subscription.pricePerMonth * renewDuration) }}
          </p>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showRenewModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="confirmRenewal"
            :disabled="renewLoading"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <span v-if="renewLoading">Traitement...</span>
            <span v-else>Renouveler</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de création d'abonnement -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Créer un Nouvel Abonnement
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Établissement
            </label>
            <select v-model="newSubscriptionTenant" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">Sélectionnez un établissement</option>
              <option
                v-for="tenant in tenantStore.tenants"
                :key="tenant._id"
                :value="tenant._id"
              >
                {{ tenant.name }} ({{ tenant.domain }})
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Plan
            </label>
            <select v-model="newSubscriptionPlan" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">Sélectionnez un plan</option>
              <option
                v-for="{ plan, details } in subscriptionStore.sortedPlans"
                :key="plan"
                :value="plan"
              >
                {{ details.name }} - {{ subscriptionStore.formatPrice(details.pricePerMonth) }}/mois
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Durée (en mois)
            </label>
            <select v-model="newSubscriptionDuration" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="1">1 mois</option>
              <option value="3">3 mois</option>
              <option value="6">6 mois</option>
              <option value="12">12 mois</option>
            </select>
          </div>
          
          <div v-if="newSubscriptionPlan" class="p-3 bg-gray-50 rounded-md">
            <p class="text-sm text-gray-600">
              <strong>Total:</strong>
              {{ formatNewSubscriptionPrice() }}
            </p>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="() => { console.log('Clic sur confirmer création'); confirmCreateSubscription() }"
            :disabled="createLoading || !newSubscriptionTenant || !newSubscriptionPlan"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="createLoading">Traitement...</span>
            <span v-else>Créer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTenantStore } from '../../stores/tenantStore'
import { useSubscriptionStore } from '../../stores/subscriptionStore'
import { SubscriptionPlan } from '../../types/tenant'
import type { PlanDetails } from '../../types/tenant'
import type { CreateSubscriptionRequest } from '../../services/api'

const tenantStore = useTenantStore()
const subscriptionStore = useSubscriptionStore()

// État local
const loading = ref(false)
const selectedTenantId = ref('')
const showUpgradeModal = ref(false)
const showRenewModal = ref(false)
const selectedPlan = ref<PlanDetails | null>(null)
const upgradeDuration = ref(12)
const renewDuration = ref(12)
const upgradeLoading = ref(false)
const renewLoading = ref(false)
const showCreateModal = ref(false)
const newSubscriptionTenant = ref('')
const newSubscriptionPlan = ref('')
const newSubscriptionDuration = ref(12)
const createLoading = ref(false)

// Données computées
const currentTenant = computed(() => 
  tenantStore.tenants.find(t => t._id === selectedTenantId.value)
)

const usageStats = computed(() => subscriptionStore.usageStats)
const billingHistory = computed(() => subscriptionStore.billingHistory)

// Méthodes utilitaires
function getPlanLabel(plan: SubscriptionPlan | string): string {
  switch (plan) {
    case 'basic': return 'Basique'
    case 'standard': return 'Standard'
    case 'premium': return 'Premium'
    case 'enterprise': return 'Entreprise'
    default: return String(plan)
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function getExpirationClass(days: number): string {
  if (days < 0) return 'text-red-600 font-medium'
  if (days <= 7) return 'text-red-600 font-medium'
  if (days <= 30) return 'text-yellow-600 font-medium'
  return 'text-gray-900'
}

function getInvoiceStatusClass(status: string): string {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'failed': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getInvoiceStatusLabel(status: string): string {
  switch (status) {
    case 'paid': return 'Payé'
    case 'pending': return 'En attente'
    case 'failed': return 'Échec'
    default: return status
  }
}

function getCurrentPlanFeatures(): string[] {
  if (!usageStats.value) return []
  
  if (usageStats.value.subscription.plan === 'basic') {
    return ['Gestion des élèves', 'Gestion des notes', 'Bulletins basiques', 'Support email']
  } else if (usageStats.value.subscription.plan === 'standard') {
    return ['Toutes fonctionnalités Basiques', 'Emplois du temps', 'Communication parents', 'Support prioritaire']
  } else if (usageStats.value.subscription.plan === 'premium') {
    return ['Toutes fonctionnalités Standard', 'Rapports avancés', 'API complète', 'Support téléphonique']
  } else if (usageStats.value.subscription.plan === 'enterprise') {
    return ['Utilisateurs illimités', 'Multi-établissements', 'Intégrations personnalisées', 'Support 24/7']
  } else {
    return []
  }
}

function formatNewSubscriptionPrice(): string {
  const selectedPlan = subscriptionStore.sortedPlans.find(p => p.plan === newSubscriptionPlan.value)
  if (selectedPlan) {
    return subscriptionStore.formatPrice(selectedPlan.details.pricePerMonth * newSubscriptionDuration.value)
  }
  return subscriptionStore.formatPrice(0)
}

// Actions
async function refreshData() {
  console.log('=== Début refreshData ===')
  loading.value = true
  try {
    console.log('Chargement des tenants...')
    await tenantStore.fetchTenants()
    console.log('Tenants chargés:', tenantStore.tenants.length)
    
    console.log('Chargement des plans...')
    await subscriptionStore.fetchPlanDetails()
    console.log('Plans chargés:', subscriptionStore.sortedPlans.length)
    
    if (selectedTenantId.value) {
      console.log('Chargement des données tenant...')
      await loadTenantData()
    }
    console.log('=== refreshData terminé ===')
  } catch (error) {
    console.error('Erreur dans refreshData:', error)
  } finally {
    loading.value = false
  }
}

async function loadTenantData() {
  if (!selectedTenantId.value) return
  
  loading.value = true
  try {
    await subscriptionStore.loadTenantSubscriptionData(selectedTenantId.value)
  } finally {
    loading.value = false
  }
}

function selectPlanForUpgrade(plan: SubscriptionPlan, details: PlanDetails) {
  selectedPlan.value = details
  showUpgradeModal.value = true
}

async function confirmUpgrade() {
  if (!selectedPlan.value || !selectedTenantId.value) return
  
  upgradeLoading.value = true
  try {
    await subscriptionStore.upgradePlan(selectedTenantId.value, selectedPlan.value.name.toLowerCase() as SubscriptionPlan, upgradeDuration.value)
    
    showUpgradeModal.value = false
    selectedPlan.value = null
    await loadTenantData()
  } catch (err) {
    console.error('Erreur upgrade:', err)
  } finally {
    upgradeLoading.value = false
  }
}

async function confirmRenewal() {
  if (!selectedTenantId.value) return
  
  renewLoading.value = true
  try {
    await subscriptionStore.renewSubscription(selectedTenantId.value, renewDuration.value)
    
    showRenewModal.value = false
    await loadTenantData()
  } catch (err) {
    console.error('Erreur renouvellement:', err)
  } finally {
    renewLoading.value = false
  }
}

async function cancelSubscription() {
  if (!selectedTenantId.value || !currentTenant.value) return
  
  if (confirm(`Êtes-vous sûr de vouloir annuler l'abonnement de ${currentTenant.value.name} ?`)) {
    try {
      await subscriptionStore.cancelSubscription(selectedTenantId.value)
      await loadTenantData()
    } catch (err) {
      console.error('Erreur annulation:', err)
    }
  }
}

async function confirmCreateSubscription() {
  console.log('=== Début création abonnement ===')
  console.log('Tenant:', newSubscriptionTenant.value)
  console.log('Plan:', newSubscriptionPlan.value)
  console.log('Duration:', newSubscriptionDuration.value)
  
  if (!newSubscriptionTenant.value || !newSubscriptionPlan.value || !newSubscriptionDuration.value) {
    console.error('Données manquantes pour la création')
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }
  
  createLoading.value = true
  console.log('Loading activé')
  
  try {
    const createData: CreateSubscriptionRequest = {
      tenantId: newSubscriptionTenant.value,
      plan: newSubscriptionPlan.value,
      duration: newSubscriptionDuration.value
    }
    
    console.log('Données à envoyer:', createData)
    console.log('Appel de subscriptionStore.createSubscription...')
    
    const result = await subscriptionStore.createSubscription(createData)
    
    console.log('Résultat création:', result)
    
    showCreateModal.value = false
    newSubscriptionTenant.value = ''
    newSubscriptionPlan.value = ''
    newSubscriptionDuration.value = 12
    
    console.log('Appel de refreshData...')
    await refreshData()
    
    console.log('=== Création terminée avec succès ===')
    alert('Abonnement créé avec succès !')
  } catch (err) {
    console.error('=== Erreur création abonnement ===')
    console.error('Erreur complète:', err)
    console.error('Message:', err instanceof Error ? err.message : 'Erreur inconnue')
    alert(`Erreur lors de la création: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
  } finally {
    createLoading.value = false
    console.log('Loading désactivé')
  }
}

// Lifecycle
onMounted(async () => {
  await refreshData()
})
</script> 