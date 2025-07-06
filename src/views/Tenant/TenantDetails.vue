<template>
  <div class="p-6 space-y-6">
    <!-- En-tête avec navigation -->
    <div class="flex items-center justify-between">
      <div>
        <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <router-link to="/tenant-dashboard" class="hover:text-gray-700">
            Établissements
          </router-link>
          <span>›</span>
          <span class="text-gray-900">{{ tenant?.name || 'Chargement...' }}</span>
        </nav>
        
        <h1 class="text-3xl font-bold text-gray-900">
          {{ tenant?.name }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ tenant?.domain }}.monecole.fr
        </p>
      </div>

      <div class="flex space-x-3">
        <button
          @click="refreshData"
          :disabled="loading"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          ↻ Actualiser
        </button>
        
        <router-link
          :to="`/tenant/${tenantId}/edit`"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Modifier
        </router-link>
      </div>
    </div>

    <!-- Statut et badges -->
    <div v-if="tenant" class="flex items-center space-x-4">
      <span
        :class="getStatusBadgeClass(tenant.status)"
        class="px-3 py-1 text-sm font-medium rounded-full"
      >
        {{ getStatusLabel(tenant.status) }}
      </span>
      
      <span
        :class="subscriptionStore.getPlanBadgeColor(tenant.subscription.plan)"
        class="px-3 py-1 text-sm font-medium rounded-full"
      >
        Plan {{ getPlanLabel(tenant.subscription.plan) }}
      </span>
      
      <span v-if="daysUntilExpiry <= 30" class="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
        Expire dans {{ daysUntilExpiry }} jours
      </span>
    </div>

    <!-- Contenu principal -->
    <div v-if="tenant" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Informations principales -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Détails de l'établissement -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              Informations Générales
            </h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Contact</h3>
                <div class="space-y-2 text-sm">
                  <p>
                    <span class="text-gray-500">Email:</span>
                    <span class="ml-2">{{ tenant.email }}</span>
                  </p>
                  <p v-if="tenant.phone">
                    <span class="text-gray-500">Téléphone:</span>
                    <span class="ml-2">{{ tenant.phone }}</span>
                  </p>
                  <p>
                    <span class="text-gray-500">Domaine:</span>
                    <span class="ml-2">{{ tenant.domain }}.monecole.fr</span>
                  </p>
                </div>
              </div>

              <div v-if="tenant.address">
                <h3 class="text-sm font-medium text-gray-700 mb-2">Adresse</h3>
                <div class="text-sm text-gray-600">
                  <p>{{ tenant.address.street }}</p>
                  <p>{{ tenant.address.postalCode }} {{ tenant.address.city }}</p>
                  <p>{{ tenant.address.country }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration académique -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              Configuration Académique
            </h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-1">Type d'établissement</h3>
                <p class="text-sm text-gray-600">{{ getSchoolTypeLabel(tenant.settings.schoolType) }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-1">Système de notation</h3>
                <p class="text-sm text-gray-600">
                  {{ getGradeSystemLabel(tenant.settings.gradeSystem) }} 
                  (max: {{ tenant.settings.maxGrade }})
                </p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-1">Année scolaire</h3>
                <p class="text-sm text-gray-600">
                  {{ tenant.settings.academicYearStart }} → {{ tenant.settings.academicYearEnd }}
                </p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-1">Langue</h3>
                <p class="text-sm text-gray-600">{{ tenant.settings.language.toUpperCase() }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-1">Fuseau horaire</h3>
                <p class="text-sm text-gray-600">{{ tenant.settings.timezone }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-1">Devise</h3>
                <p class="text-sm text-gray-600">{{ tenant.settings.currency }}</p>
              </div>
            </div>

            <!-- Logo et thème -->
            <div v-if="tenant.settings.logoUrl || tenant.settings.theme" class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-sm font-medium text-gray-700 mb-4">Personnalisation</h3>
              
              <div class="flex items-center space-x-6">
                <div v-if="tenant.settings.logoUrl">
                  <h4 class="text-xs font-medium text-gray-600 mb-2">Logo</h4>
                  <img
                    :src="tenant.settings.logoUrl"
                    :alt="tenant.name"
                    class="w-16 h-16 object-cover rounded border border-gray-300"
                  />
                </div>
                
                <div v-if="tenant.settings.theme" class="flex items-center space-x-4">
                  <div>
                    <h4 class="text-xs font-medium text-gray-600 mb-2">Couleurs</h4>
                    <div class="flex items-center space-x-2">
                      <div 
                        :style="{ backgroundColor: tenant.settings.theme.primaryColor }"
                        class="w-6 h-6 rounded border border-gray-300"
                        :title="tenant.settings.theme.primaryColor"
                      ></div>
                      <div 
                        :style="{ backgroundColor: tenant.settings.theme.secondaryColor }"
                        class="w-6 h-6 rounded border border-gray-300"
                        :title="tenant.settings.theme.secondaryColor"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques d'utilisation -->
        <div v-if="usageStats" class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              Utilisation Actuelle
            </h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Élèves -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-sm font-medium text-gray-700">Élèves</h3>
                  <span class="text-sm text-gray-500">
                    {{ usageStats.currentStudents }} / {{ usageStats.maxStudents === 999999 ? '∞' : usageStats.maxStudents }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    :class="subscriptionStore.getUsageColor(usageStats.studentUsagePercent)"
                    class="h-3 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min(usageStats.studentUsagePercent, 100)}%` }"
                  ></div>
                </div>
                <p :class="subscriptionStore.getUsageColor(usageStats.studentUsagePercent)" 
                   class="text-xs mt-1 text-right font-medium">
                  {{ usageStats.studentUsagePercent }}%
                </p>
              </div>

              <!-- Professeurs -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-sm font-medium text-gray-700">Professeurs</h3>
                  <span class="text-sm text-gray-500">
                    {{ usageStats.currentTeachers }} / {{ usageStats.maxTeachers === 999999 ? '∞' : usageStats.maxTeachers }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    :class="subscriptionStore.getUsageColor(usageStats.teacherUsagePercent)"
                    class="h-3 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min(usageStats.teacherUsagePercent, 100)}%` }"
                  ></div>
                </div>
                <p :class="subscriptionStore.getUsageColor(usageStats.teacherUsagePercent)" 
                   class="text-xs mt-1 text-right font-medium">
                  {{ usageStats.teacherUsagePercent }}%
                </p>
              </div>
            </div>

            <!-- Alertes d'utilisation -->
            <div class="mt-6 space-y-3">
              <div 
                v-if="usageStats.studentUsagePercent >= 90"
                class="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div class="flex items-center">
                  <span class="text-red-500 mr-2">⚠️</span>
                  <p class="text-sm text-red-800">
                    <strong>Limite d'élèves presque atteinte!</strong>
                    Envisagez une mise à niveau de votre plan.
                  </p>
                </div>
              </div>
              
              <div 
                v-if="usageStats.teacherUsagePercent >= 90"
                class="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div class="flex items-center">
                  <span class="text-red-500 mr-2">⚠️</span>
                  <p class="text-sm text-red-800">
                    <strong>Limite de professeurs presque atteinte!</strong>
                    Envisagez une mise à niveau de votre plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar droite -->
      <div class="space-y-6">
        
        <!-- Informations d'abonnement -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              Abonnement
            </h2>
          </div>
          
          <div class="p-6">
            <div class="text-center mb-4">
              <p class="text-2xl font-bold text-blue-600">
                {{ subscriptionStore.formatPrice(tenant.subscription.pricePerMonth) }}
              </p>
              <p class="text-sm text-gray-500">/mois</p>
            </div>
            
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Plan:</span>
                <span class="font-medium">{{ getPlanLabel(tenant.subscription.plan) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Début:</span>
                <span class="font-medium">{{ formatDate(tenant.subscription.startDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Fin:</span>
                <span class="font-medium" :class="getExpirationColor()">
                  {{ formatDate(tenant.subscription.endDate) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Status:</span>
                <span class="font-medium" :class="tenant.subscription.isActive ? 'text-green-600' : 'text-red-600'">
                  {{ tenant.subscription.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </div>
            </div>

            <div class="mt-6 space-y-2">
              <router-link
                :to="`/tenant/${tenantId}/subscription`"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
              >
                Gérer l'abonnement
              </router-link>
              
              <button
                @click="renewSubscription"
                class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Renouveler
              </button>
            </div>
          </div>
        </div>

        <!-- Fonctionnalités du plan -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              Fonctionnalités
            </h2>
          </div>
          
          <div class="p-6">
            <ul class="space-y-2">
              <li
                v-for="feature in tenant.subscription.features"
                :key="feature"
                class="flex items-start text-sm text-gray-600"
              >
                <span class="text-green-500 mr-2 mt-0.5">✓</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              Actions
            </h2>
          </div>
          
          <div class="p-6 space-y-3">
            <button
              v-if="tenant.status !== 'active'"
              @click="activateTenant"
              class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Activer
            </button>
            
            <button
              v-if="tenant.status === 'active'"
              @click="suspendTenant"
              class="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Suspendre
            </button>
            
            <button
              @click="exportData"
              class="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Exporter les données
            </button>
            
            <button
              @click="deleteTenant"
              class="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-else-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-500">Chargement des détails...</p>
      </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <span class="text-red-500 mr-2">❌</span>
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTenantStore } from '../../stores/tenantStore'
import { useSubscriptionStore } from '../../stores/subscriptionStore'
import type { Tenant, TenantStatus, SubscriptionPlan } from '../../types/tenant'

const route = useRoute()
const router = useRouter()
const tenantStore = useTenantStore()
const subscriptionStore = useSubscriptionStore()

// État local
const loading = ref(false)
const error = ref<string | null>(null)

// Données computées
const tenantId = computed(() => route.params.id as string)
const tenant = computed(() => tenantStore.tenants.find(t => t._id === tenantId.value))
const usageStats = computed(() => subscriptionStore.usageStats)

const daysUntilExpiry = computed(() => {
  if (!tenant.value) return 0
  return Math.ceil((new Date(tenant.value.subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
})

// Méthodes utilitaires
function getStatusBadgeClass(status: TenantStatus): string {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'suspended': return 'bg-red-100 text-red-800'
    case 'cancelled': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusLabel(status: TenantStatus): string {
  switch (status) {
    case 'active': return 'Actif'
    case 'pending': return 'En attente'
    case 'suspended': return 'Suspendu'
    case 'cancelled': return 'Annulé'
    default: return status
  }
}

function getPlanLabel(plan: SubscriptionPlan): string {
  switch (plan) {
    case 'basic': return 'Basique'
    case 'standard': return 'Standard'
    case 'premium': return 'Premium'
    case 'enterprise': return 'Entreprise'
    default: return plan
  }
}

function getSchoolTypeLabel(type: string): string {
  switch (type) {
    case 'primary': return 'École primaire'
    case 'secondary': return 'Collège/Lycée'
    case 'university': return 'Université'
    case 'mixed': return 'Établissement mixte'
    default: return type
  }
}

function getGradeSystemLabel(system: string): string {
  switch (system) {
    case 'numeric': return 'Numérique'
    case 'letter': return 'Lettres'
    case 'points': return 'Points'
    default: return system
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function getExpirationColor(): string {
  if (daysUntilExpiry.value < 0) return 'text-red-600'
  if (daysUntilExpiry.value <= 7) return 'text-red-600'
  if (daysUntilExpiry.value <= 30) return 'text-yellow-600'
  return 'text-gray-900'
}

// Actions
async function refreshData() {
  if (!tenantId.value) return
  
  loading.value = true
  error.value = null
  
  try {
    // Charger les détails du tenant
    await tenantStore.fetchTenants()
    
    // Charger les stats d'utilisation
    if (tenant.value) {
      await subscriptionStore.loadTenantSubscriptionData(tenantId.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

async function activateTenant() {
  if (!tenant.value) return
  
  try {
    await tenantStore.activateTenant(tenant.value._id)
    await refreshData()
  } catch (err) {
    console.error('Erreur activation:', err)
  }
}

async function suspendTenant() {
  if (!tenant.value) return
  
  if (confirm(`Êtes-vous sûr de vouloir suspendre ${tenant.value.name} ?`)) {
    try {
      await tenantStore.suspendTenant(tenant.value._id)
      await refreshData()
    } catch (err) {
      console.error('Erreur suspension:', err)
    }
  }
}

async function renewSubscription() {
  if (!tenant.value) return
  
  try {
    await subscriptionStore.renewSubscription(tenant.value._id)
    await refreshData()
  } catch (err) {
    console.error('Erreur renouvellement:', err)
  }
}

function exportData() {
  if (!tenant.value) return
  
  // Générer un export JSON des données
  const exportData = {
    tenant: tenant.value,
    usageStats: usageStats.value,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${tenant.value.domain}-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function deleteTenant() {
  if (!tenant.value) return
  
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${tenant.value.name} ? Cette action est irréversible.`)) {
    try {
      await tenantStore.deleteTenant(tenant.value._id)
      router.push('/tenant-dashboard')
    } catch (err) {
      console.error('Erreur suppression:', err)
    }
  }
}

// Lifecycle
onMounted(async () => {
  await refreshData()
})
</script> 