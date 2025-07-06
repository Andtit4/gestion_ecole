<template>
  <div class="mx-auto max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-black dark:text-white">
        Abonnement - {{ tenant?.name }}
      </h1>
      <p class="text-meta-4 dark:text-meta-5 mt-2">
        Gérez l'abonnement et les fonctionnalités de cet établissement
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-sm border border-red-300 bg-red-50 p-4 dark:bg-red-900/20">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="tenant" class="space-y-8">
      <!-- Current Subscription Card -->
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 class="text-xl font-semibold text-black dark:text-white mb-4">
          Abonnement Actuel
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="usageStats">
          <!-- Plan Info -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-body dark:text-bodydark">Plan :</span>
              <span :class="getPlanBadgeClasses(usageStats.subscription.plan)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ formatPlan(usageStats.subscription.plan) }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-body dark:text-bodydark">Statut :</span>
              <span :class="getStatusBadgeClasses(usageStats.subscription.status)" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ formatStatus(usageStats.subscription.status) }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-body dark:text-bodydark">Prix mensuel :</span>
              <span class="font-semibold text-black dark:text-white">
                {{ usageStats.subscription.pricePerMonth }}€/mois
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-body dark:text-bodydark">Date de fin :</span>
              <span class="font-semibold text-black dark:text-white">
                {{ new Date(usageStats.subscription.endDate).toLocaleDateString('fr-FR') }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-body dark:text-bodydark">Expire dans :</span>
              <span :class="getExpirationClass(usageStats.daysUntilExpiry)" class="font-semibold">
                {{ formatDaysUntilExpiry(usageStats.daysUntilExpiry) }}
              </span>
            </div>
          </div>

          <!-- Usage Stats -->
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-body dark:text-bodydark">Élèves</span>
                <span class="text-black dark:text-white">
                  {{ usageStats.subscription.currentStudents }}/{{ usageStats.subscription.maxStudents }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  class="h-2 rounded-full"
                  :class="getUsageBarClass(usageStats.usagePercentage.students)"
                  :style="{ width: `${Math.min(usageStats.usagePercentage.students, 100)}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500">{{ usageStats.usagePercentage.students }}% utilisé</span>
            </div>

            <div>
              <div class="flex justify-between mb-2">
                <span class="text-body dark:text-bodydark">Professeurs</span>
                <span class="text-black dark:text-white">
                  {{ usageStats.subscription.currentTeachers }}/{{ usageStats.subscription.maxTeachers }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  class="h-2 rounded-full"
                  :class="getUsageBarClass(usageStats.usagePercentage.teachers)"
                  :style="{ width: `${Math.min(usageStats.usagePercentage.teachers, 100)}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500">{{ usageStats.usagePercentage.teachers }}% utilisé</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-3 mt-6">
          <button 
            @click="openUpgradeModal"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
            Mettre à niveau
          </button>

          <button 
            @click="openRenewModal"
            class="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Renouveler
          </button>

          <button 
            @click="loadBillingHistory"
            class="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Voir l'historique
          </button>
        </div>
      </div>

      <!-- Features List -->
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 class="text-xl font-semibold text-black dark:text-white mb-4">
          Fonctionnalités Incluses
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="feature in getPlanFeatures(tenant.subscription?.plan)" :key="feature" class="flex items-center">
            <svg class="w-5 h-5 text-success mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-body dark:text-bodydark">{{ feature }}</span>
          </div>
        </div>
      </div>

      <!-- Billing History -->
      <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h2 class="text-xl font-semibold text-black dark:text-white mb-4">
          Historique de Facturation
        </h2>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-stroke dark:border-strokedark">
                <th class="py-3 px-4 text-left text-meta-5 dark:text-meta-4">Date</th>
                <th class="py-3 px-4 text-left text-meta-5 dark:text-meta-4">Description</th>
                <th class="py-3 px-4 text-left text-meta-5 dark:text-meta-4">Montant</th>
                <th class="py-3 px-4 text-left text-meta-5 dark:text-meta-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in tenant.subscription?.paymentHistory || []" :key="payment.id" class="border-b border-stroke dark:border-strokedark">
                <td class="py-3 px-4 text-black dark:text-white">{{ formatDate(payment.date) }}</td>
                <td class="py-3 px-4 text-body dark:text-bodydark">{{ payment.description }}</td>
                <td class="py-3 px-4 text-black dark:text-white">{{ payment.amount }}€</td>
                <td class="py-3 px-4">
                  <span :class="payment.status === 'completed' ? 'text-success' : 'text-warning'" class="font-medium">
                    {{ payment.status === 'completed' ? 'Payé' : 'En attente' }}
                  </span>
                </td>
              </tr>
              <tr v-if="!tenant.subscription?.paymentHistory?.length">
                <td colspan="4" class="py-8 text-center text-meta-4 dark:text-meta-5">
                  Aucun historique de paiement
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <div v-if="showUpgradeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-boxdark rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Améliorer l'Abonnement</h3>
        
        <div class="space-y-3">
          <div v-for="plan in getUpgradePlans()" :key="plan.key" 
            @click="selectedUpgradePlan = plan.key"
            :class="['p-4 border rounded-lg cursor-pointer', selectedUpgradePlan === plan.key ? 'border-primary bg-primary/5' : 'border-stroke dark:border-strokedark']">
            <div class="flex justify-between items-center">
              <div>
                <h4 class="font-medium text-black dark:text-white">{{ plan.name }}</h4>
                <p class="text-sm text-meta-4 dark:text-meta-5">{{ plan.description }}</p>
              </div>
              <span class="font-semibold text-primary">{{ plan.price }}€/mois</span>
            </div>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="showUpgradeModal = false" class="flex-1 py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-meta-4">
            Annuler
          </button>
          <button @click="confirmUpgrade" :disabled="!selectedUpgradePlan || upgrading" class="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50">
            {{ upgrading ? 'Traitement...' : 'Améliorer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Downgrade Modal -->
    <div v-if="showDowngradeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-boxdark rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Rétrograder l'Abonnement</h3>
        
        <div class="space-y-3">
          <div v-for="plan in getDowngradePlans()" :key="plan.key" 
            @click="selectedDowngradePlan = plan.key"
            :class="['p-4 border rounded-lg cursor-pointer', selectedDowngradePlan === plan.key ? 'border-primary bg-primary/5' : 'border-stroke dark:border-strokedark']">
            <div class="flex justify-between items-center">
              <div>
                <h4 class="font-medium text-black dark:text-white">{{ plan.name }}</h4>
                <p class="text-sm text-meta-4 dark:text-meta-5">{{ plan.description }}</p>
              </div>
              <span class="font-semibold text-primary">{{ plan.price }}€/mois</span>
            </div>
          </div>
        </div>

        <div class="bg-warning/10 border border-warning rounded-lg p-4 mt-4">
          <p class="text-warning text-sm">
            ⚠️ La rétrogradation prendra effet à la fin de la période de facturation actuelle.
          </p>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="showDowngradeModal = false" class="flex-1 py-2 px-4 border border-stroke dark:border-strokedark rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-meta-4">
            Annuler
          </button>
          <button @click="confirmDowngrade" :disabled="!selectedDowngradePlan || downgrading" class="flex-1 py-2 px-4 bg-warning text-white rounded-md hover:bg-opacity-90 disabled:opacity-50">
            {{ downgrading ? 'Traitement...' : 'Rétrograder' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { fetchTenant } from '@/services/api'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import type { Tenant, SubscriptionPlan } from '@/types/tenant'

const route = useRoute()
const subscriptionStore = useSubscriptionStore()

// Reactive data
const tenant = ref<Tenant | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const upgrading = ref(false)
const downgrading = ref(false)

// Modals
const showUpgradeModal = ref(false)
const showDowngradeModal = ref(false)
const showRenewModal = ref(false)
const showBillingModal = ref(false)
const selectedUpgradePlan = ref<SubscriptionPlan | null>(null)
const selectedDowngradePlan = ref<SubscriptionPlan | null>(null)
const renewDuration = ref(12)
const upgradeDuration = ref(12)

// Computed properties
const tenantId = computed(() => route.params.id as string)
const usageStats = computed(() => subscriptionStore.usageStats)
const plans = computed(() => subscriptionStore.plans)
const billingHistory = computed(() => subscriptionStore.billingHistory)

// Methods
const loadTenant = async () => {
  try {
    loading.value = true
    error.value = null
    tenant.value = await fetchTenant(tenantId.value)
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement de l\'établissement'
  } finally {
    loading.value = false
  }
}

const loadSubscriptionData = async () => {
  try {
    await subscriptionStore.loadTenantSubscriptionData(tenantId.value)
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des données d\'abonnement'
  }
}

const loadBillingHistory = async () => {
  try {
    await subscriptionStore.fetchBillingHistory(tenantId.value)
    showBillingModal.value = true
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement de l\'historique'
  }
}

// Modal functions
const openUpgradeModal = () => {
  showUpgradeModal.value = true
}

const openRenewModal = () => {
  showRenewModal.value = true
}

const confirmUpgrade = async () => {
  if (!selectedUpgradePlan.value) return
  
  try {
    await subscriptionStore.upgradePlan(tenantId.value, selectedUpgradePlan.value, upgradeDuration.value)
    showUpgradeModal.value = false
    selectedUpgradePlan.value = null
  } catch (err: any) {
    console.error('Erreur lors de l\'amélioration:', err)
  }
}

const confirmDowngrade = async () => {
  if (!selectedDowngradePlan.value) return
  
  try {
    await subscriptionStore.downgradePlan(tenantId.value, selectedDowngradePlan.value)
    showDowngradeModal.value = false
    selectedDowngradePlan.value = null
  } catch (err: any) {
    console.error('Erreur lors de la rétrogradation:', err)
  }
}

const confirmRenewal = async () => {
  try {
    await subscriptionStore.renewSubscription(tenantId.value, renewDuration.value)
    showRenewModal.value = false
  } catch (err: any) {
    console.error('Erreur lors du renouvellement:', err)
  }
}

// Utility functions
const formatPlan = (plan?: string) => {
  const plans = {
    'BASIC': 'Basique',
    'STANDARD': 'Standard',
    'PREMIUM': 'Premium',
    'ENTERPRISE': 'Entreprise'
  }
  return plan ? plans[plan as keyof typeof plans] || plan : 'Non défini'
}

const formatStatus = (status?: string) => {
  const statuses = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'expired': 'Expiré',
    'cancelled': 'Annulé'
  }
  return status ? statuses[status as keyof typeof statuses] || status : 'Non défini'
}

const formatDaysUntilExpiry = (days: number): string => {
  if (days < 0) return 'Expiré'
  if (days === 0) return 'Expire aujourd\'hui'
  if (days === 1) return 'Expire demain'
  if (days <= 7) return `Expire dans ${days} jours`
  if (days <= 30) return `Expire dans ${days} jours`
  return `Expire dans ${Math.ceil(days / 30)} mois`
}

const getPlanBadgeClasses = (plan?: string) => {
  const classes = {
    'BASIC': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    'STANDARD': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    'PREMIUM': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
    'ENTERPRISE': 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
  }
  return plan ? classes[plan as keyof typeof classes] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
}

const getStatusBadgeClasses = (status?: string) => {
  const classes = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    'inactive': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
    'expired': 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200',
    'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
  return status ? classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
}

const getExpirationClass = (days: number): string => {
  if (days < 0) return 'text-red-600'
  if (days <= 7) return 'text-red-600'
  if (days <= 30) return 'text-orange-600'
  return 'text-green-600'
}

const getUsageBarClass = (percentage: number): string => {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 75) return 'bg-orange-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getUpgradePlans = () => {
  const currentPlan = usageStats.value?.subscription?.plan
  const allPlans = [
    { key: 'BASIC' as SubscriptionPlan, name: 'Basique', price: 29, description: 'Pour petits établissements' },
    { key: 'STANDARD' as SubscriptionPlan, name: 'Standard', price: 59, description: 'Pour établissements moyens' },
    { key: 'PREMIUM' as SubscriptionPlan, name: 'Premium', price: 99, description: 'Pour grands établissements' },
    { key: 'ENTERPRISE' as SubscriptionPlan, name: 'Entreprise', price: 199, description: 'Pour groupes scolaires' }
  ]
  
  const currentIndex = allPlans.findIndex(p => p.key === currentPlan)
  return allPlans.slice(currentIndex + 1)
}

const getDowngradePlans = () => {
  const currentPlan = usageStats.value?.subscription?.plan
  const allPlans = [
    { key: 'BASIC' as SubscriptionPlan, name: 'Basique', price: 29, description: 'Pour petits établissements' },
    { key: 'STANDARD' as SubscriptionPlan, name: 'Standard', price: 59, description: 'Pour établissements moyens' },
    { key: 'PREMIUM' as SubscriptionPlan, name: 'Premium', price: 99, description: 'Pour grands établissements' },
    { key: 'ENTERPRISE' as SubscriptionPlan, name: 'Entreprise', price: 199, description: 'Pour groupes scolaires' }
  ]
  
  const currentIndex = allPlans.findIndex(p => p.key === currentPlan)
  return allPlans.slice(0, currentIndex)
}

const getPlanFeatures = (plan?: SubscriptionPlan) => {
  const features = {
    BASIC: [
      'Gestion des élèves (100)',
      'Gestion des professeurs (10)',
      'Notes et évaluations',
      'Support email'
    ],
    STANDARD: [
      'Gestion des élèves (500)',
      'Gestion des professeurs (50)',
      'Notes et évaluations',
      'Emplois du temps',
      'Communication parents',
      'Support prioritaire'
    ],
    PREMIUM: [
      'Gestion des élèves (1000)',
      'Gestion des professeurs (100)',
      'Toutes fonctionnalités Standard',
      'Bulletins personnalisés',
      'Rapports avancés',
      'API complète',
      'Support téléphonique'
    ],
    ENTERPRISE: [
      'Utilisateurs illimités',
      'Toutes fonctionnalités Premium',
      'Multi-établissements',
      'Intégrations personnalisées',
      'Formation dédiée',
      'Support 24/7'
    ]
  }
  return plan ? features[plan] : []
}

const formatDate = (date?: string | Date) => {
  if (!date) return 'Non défini'
  return new Date(date).toLocaleDateString('fr-FR')
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadTenant(),
    loadSubscriptionData()
  ])
})
</script> 