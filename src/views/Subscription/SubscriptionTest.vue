<template>
  <div class="mx-auto max-w-4xl p-6">
    <h1 class="text-2xl font-bold text-black dark:text-white mb-6">
      Test API Abonnements
    </h1>

    <!-- Test des Plans -->
    <div class="bg-white dark:bg-boxdark rounded-lg shadow mb-6 p-6">
      <h2 class="text-lg font-semibold mb-4">Plans Disponibles</h2>
      <button 
        @click="testPlans" 
        :disabled="loading"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {{ loading ? 'Chargement...' : 'Charger les Plans' }}
      </button>
      
      <div v-if="plans && Object.keys(plans).length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="(plan, key) in plans" 
          :key="key"
          class="border rounded p-4"
        >
          <h3 class="font-semibold">{{ plan.name }}</h3>
          <p class="text-sm text-gray-600">{{ plan.description }}</p>
          <p class="font-bold">{{ plan.pricePerMonth }}€/mois</p>
          <p class="text-sm">{{ plan.maxStudents }} élèves | {{ plan.maxTeachers }} professeurs</p>
        </div>
      </div>
    </div>

    <!-- Test Tenant Selection -->
    <div class="bg-white dark:bg-boxdark rounded-lg shadow mb-6 p-6">
      <h2 class="text-lg font-semibold mb-4">Sélection Tenant</h2>
      <button 
        @click="loadTenants" 
        :disabled="loading"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mb-4"
      >
        {{ loading ? 'Chargement...' : 'Charger les Tenants' }}
      </button>
      
      <select 
        v-if="tenants.length > 0" 
        v-model="selectedTenantId" 
        class="w-full border rounded px-3 py-2 mb-4"
      >
        <option value="">Sélectionner un établissement</option>
        <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
          {{ tenant.name }} ({{ tenant.domain }})
        </option>
      </select>
    </div>

    <!-- Test Stats Usage -->
    <div v-if="selectedTenantId" class="bg-white dark:bg-boxdark rounded-lg shadow mb-6 p-6">
      <h2 class="text-lg font-semibold mb-4">Statistiques d'Utilisation</h2>
      <button 
        @click="testUsageStats" 
        :disabled="loading"
        class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 mb-4"
      >
        {{ loading ? 'Chargement...' : 'Charger les Stats' }}
      </button>
      
      <div v-if="usageStats" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="border rounded p-4">
            <h4 class="font-semibold">Plan Actuel</h4>
            <p>{{ usageStats.subscription.plan }}</p>
            <p class="text-sm text-gray-600">{{ usageStats.subscription.pricePerMonth }}€/mois</p>
          </div>
          <div class="border rounded p-4">
            <h4 class="font-semibold">Utilisation</h4>
            <p>Élèves: {{ usageStats.subscription.currentStudents }}/{{ usageStats.subscription.maxStudents }}</p>
            <p>Profs: {{ usageStats.subscription.currentTeachers }}/{{ usageStats.subscription.maxTeachers }}</p>
          </div>
        </div>
        <div class="border rounded p-4">
          <h4 class="font-semibold">Dates</h4>
          <p>Début: {{ usageStats.subscription.startDate }}</p>
          <p>Fin: {{ usageStats.subscription.endDate }}</p>
          <p>Expire dans: {{ usageStats.daysUntilExpiry }} jours</p>
        </div>
      </div>
    </div>

    <!-- Test Actions -->
    <div v-if="selectedTenantId" class="bg-white dark:bg-boxdark rounded-lg shadow mb-6 p-6">
      <h2 class="text-lg font-semibold mb-4">Actions de Test</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          @click="testUpgrade" 
          :disabled="loading"
          class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          Test Upgrade
        </button>
        
        <button 
          @click="testRenewal" 
          :disabled="loading"
          class="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
        >
          Test Renouvellement
        </button>
        
        <button 
          @click="testBillingHistory" 
          :disabled="loading"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Test Historique
        </button>
      </div>
    </div>

    <!-- Historique Facturation -->
    <div v-if="billingHistory.length > 0" class="bg-white dark:bg-boxdark rounded-lg shadow mb-6 p-6">
      <h2 class="text-lg font-semibold mb-4">Historique de Facturation</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2">Facture</th>
              <th class="text-left py-2">Date</th>
              <th class="text-left py-2">Plan</th>
              <th class="text-left py-2">Montant</th>
              <th class="text-left py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in billingHistory" :key="item.id" class="border-b">
              <td class="py-2">{{ item.invoiceNumber }}</td>
              <td class="py-2">{{ item.date }}</td>
              <td class="py-2">{{ item.plan }}</td>
              <td class="py-2">{{ item.amount }}€</td>
              <td class="py-2">
                <span 
                  :class="getStatusClass(item.status)"
                  class="px-2 py-1 rounded text-xs"
                >
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="messages.length > 0" class="bg-white dark:bg-boxdark rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Messages de Debug</h2>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="message.type === 'error' ? 'text-red-600' : message.type === 'success' ? 'text-green-600' : 'text-gray-600'"
          class="text-sm font-mono bg-gray-50 p-2 rounded"
        >
          [{{ message.time }}] {{ message.text }}
        </div>
      </div>
      <button 
        @click="clearMessages" 
        class="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Effacer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  fetchPlanDetails, 
  fetchUsageStats, 
  fetchBillingHistory,
  fetchTenants,
  upgradePlan,
  renewSubscription,
  type PlanDetails, 
  type UsageStats, 
  type BillingHistoryItem,
  type TenantListItem
} from '@/services/api'

// État
const loading = ref(false)
const plans = ref<Record<string, PlanDetails>>({})
const tenants = ref<TenantListItem[]>([])
const selectedTenantId = ref('')
const usageStats = ref<UsageStats | null>(null)
const billingHistory = ref<BillingHistoryItem[]>([])
const messages = ref<Array<{type: string, text: string, time: string}>>([])

// Fonctions utilitaires
const addMessage = (type: string, text: string) => {
  messages.value.push({
    type,
    text,
    time: new Date().toLocaleTimeString()
  })
}

const clearMessages = () => {
  messages.value = []
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'failed': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Tests des API
const testPlans = async () => {
  loading.value = true
  try {
    addMessage('info', 'Chargement des plans...')
    const planData = await fetchPlanDetails()
    plans.value = planData
    addMessage('success', `Plans chargés: ${Object.keys(planData).join(', ')}`)
  } catch (error: any) {
    addMessage('error', `Erreur plans: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const loadTenants = async () => {
  loading.value = true
  try {
    addMessage('info', 'Chargement des tenants...')
    const tenantData = await fetchTenants()
    tenants.value = tenantData
    addMessage('success', `Tenants chargés: ${tenantData.length} établissements`)
  } catch (error: any) {
    addMessage('error', `Erreur tenants: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const testUsageStats = async () => {
  if (!selectedTenantId.value) return
  
  loading.value = true
  try {
    addMessage('info', `Chargement stats pour ${selectedTenantId.value}...`)
    const stats = await fetchUsageStats(selectedTenantId.value)
    usageStats.value = stats
    addMessage('success', `Stats chargées: plan ${stats.subscription.plan}`)
  } catch (error: any) {
    addMessage('error', `Erreur stats: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const testUpgrade = async () => {
  if (!selectedTenantId.value) return
  
  loading.value = true
  try {
    addMessage('info', 'Test upgrade vers PREMIUM...')
    const result = await upgradePlan(selectedTenantId.value, 'PREMIUM', 1)
    addMessage('success', `Upgrade réussi: facture ${result.invoice.invoiceNumber}`)
    await testUsageStats() // Recharger les stats
  } catch (error: any) {
    addMessage('error', `Erreur upgrade: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const testRenewal = async () => {
  if (!selectedTenantId.value) return
  
  loading.value = true
  try {
    addMessage('info', 'Test renouvellement 3 mois...')
    const result = await renewSubscription(selectedTenantId.value, 3)
    addMessage('success', `Renouvellement réussi: facture ${result.invoice.invoiceNumber}`)
    await testUsageStats() // Recharger les stats
  } catch (error: any) {
    addMessage('error', `Erreur renouvellement: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const testBillingHistory = async () => {
  if (!selectedTenantId.value) return
  
  loading.value = true
  try {
    addMessage('info', 'Chargement historique facturation...')
    const history = await fetchBillingHistory(selectedTenantId.value)
    billingHistory.value = history
    addMessage('success', `Historique chargé: ${history.length} factures`)
  } catch (error: any) {
    addMessage('error', `Erreur historique: ${error.message}`)
  } finally {
    loading.value = false
  }
}
</script> 