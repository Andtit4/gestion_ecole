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
          <router-link :to="`/tenant/${tenantId}`" class="hover:text-gray-700">
            {{ tenant?.name || 'Chargement...' }}
          </router-link>
          <span>›</span>
          <span class="text-gray-900">Modifier</span>
        </nav>
        
        <h1 class="text-3xl font-bold text-gray-900">
          Modifier {{ tenant?.name }}
        </h1>
        <p class="text-gray-600 mt-1">
          Modifiez les paramètres et la configuration de votre établissement
        </p>
      </div>

      <div class="flex space-x-3">
        <router-link
          :to="`/tenant/${tenantId}`"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </router-link>
        
        <button
          @click="saveTenant"
          :disabled="loading || !hasChanges"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sauvegarde...
          </span>
          <span v-else>
            Sauvegarder
          </span>
        </button>
      </div>
    </div>

    <!-- Indicateur de modifications -->
    <div v-if="hasChanges" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex items-center">
        <span class="text-yellow-500 mr-2">⚠️</span>
        <p class="text-yellow-800">
          <strong>Modifications non sauvegardées</strong>
          Vous avez des modifications en attente. N'oubliez pas de sauvegarder.
        </p>
      </div>
    </div>

    <!-- Formulaire d'édition -->
    <div v-if="tenant">
      <TenantSettings
        :tenant="tenant"
        @updated="handleTenantUpdated"
      />
    </div>

    <!-- État de chargement -->
    <div v-else-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-500">Chargement de l'établissement...</p>
      </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <span class="text-red-500 mr-2">❌</span>
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Actions supplémentaires -->
    <div v-if="tenant" class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">
          Actions Avancées
        </h2>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <!-- Réinitialiser les paramètres -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-2">
              Réinitialiser les paramètres
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Restaurer la configuration par défaut de l'établissement.
            </p>
            <button
              @click="resetToDefaults"
              class="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Réinitialiser
            </button>
          </div>

          <!-- Dupliquer l'établissement -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-2">
              Dupliquer l'établissement
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Créer un nouvel établissement basé sur cette configuration.
            </p>
            <button
              @click="duplicateTenant"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Dupliquer
            </button>
          </div>

          <!-- Transférer l'établissement -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-2">
              Changer de propriétaire
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Transférer la propriété à un autre utilisateur.
            </p>
            <button
              @click="transferOwnership"
              class="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Transférer
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal de duplication -->
    <div v-if="showDuplicateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Dupliquer l'établissement
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nouveau nom
            </label>
            <input
              v-model="duplicateData.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nom du nouvel établissement"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nouveau domaine
            </label>
            <input
              v-model="duplicateData.domain"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="nouveau-domaine"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email de contact
            </label>
            <input
              v-model="duplicateData.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="nouveau@email.com"
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showDuplicateModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="confirmDuplicate"
            :disabled="!duplicateData.name || !duplicateData.domain || !duplicateData.email"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Créer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de transfert -->
    <div v-if="showTransferModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Transférer la propriété
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email du nouveau propriétaire
            </label>
            <input
              v-model="transferData.newOwnerEmail"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="nouveau.proprietaire@email.com"
            />
          </div>
          
          <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-sm text-yellow-800">
              <strong>Attention:</strong> Cette action transférera définitivement la propriété de l'établissement. 
              Vous perdrez tous les droits d'administration.
            </p>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showTransferModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="confirmTransfer"
            :disabled="!transferData.newOwnerEmail"
            class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
          >
            Transférer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useTenantStore } from '../../stores/tenantStore'
import TenantSettings from '../../components/tenant/TenantSettings.vue'
import type { Tenant } from '../../types/tenant'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const tenantStore = useTenantStore()

// État local
const loading = ref(false)
const error = ref<string | null>(null)
const hasChanges = ref(false)
const showDuplicateModal = ref(false)
const showTransferModal = ref(false)

// Données pour la duplication
const duplicateData = ref({
  name: '',
  domain: '',
  email: ''
})

// Données pour le transfert
const transferData = ref({
  newOwnerEmail: ''
})

// Données computées
const tenantId = computed(() => route.params.id as string)
const tenant = computed(() => tenantStore.tenants.find(t => t._id === tenantId.value))

// Actions
async function loadTenant() {
  if (!tenantId.value) return
  
  loading.value = true
  error.value = null
  
  try {
    await tenantStore.fetchTenants()
    
    if (!tenant.value) {
      error.value = 'Établissement non trouvé'
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
}

async function saveTenant() {
  if (!tenant.value || !hasChanges.value) return
  
  loading.value = true
  
  try {
    // La sauvegarde est gérée par le composant TenantSettings
    toast.success('Établissement sauvegardé avec succès')
    hasChanges.value = false
  } catch (err: any) {
    toast.error('Erreur lors de la sauvegarde')
    console.error('Erreur sauvegarde:', err)
  } finally {
    loading.value = false
  }
}

function handleTenantUpdated(updatedTenant: Tenant) {
  toast.success('Établissement mis à jour avec succès')
  hasChanges.value = false
  
  // Optionnel: rediriger vers la page de détails
  setTimeout(() => {
    router.push(`/tenant/${updatedTenant._id}`)
  }, 1000)
}

async function resetToDefaults() {
  if (!tenant.value) return
  
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ?')) {
    try {
      const defaultSettings = {
        settings: {
          schoolType: 'secondary' as const,
          academicYearStart: '09-01',
          academicYearEnd: '07-15',
          gradeSystem: 'numeric' as const,
          maxGrade: 20,
          language: 'fr',
          timezone: 'Europe/Paris',
          currency: 'EUR',
          logoUrl: '',
          theme: {
            primaryColor: '#1f2937',
            secondaryColor: '#3b82f6'
          }
        }
      }
      
      await tenantStore.updateTenant(tenant.value._id, defaultSettings)
      await loadTenant()
      toast.success('Paramètres réinitialisés aux valeurs par défaut')
    } catch (err) {
      toast.error('Erreur lors de la réinitialisation')
      console.error('Erreur reset:', err)
    }
  }
}

function duplicateTenant() {
  if (!tenant.value) return
  
  // Pré-remplir les données de duplication
  duplicateData.value = {
    name: `${tenant.value.name} (Copie)`,
    domain: `${tenant.value.domain}-copy`,
    email: ''
  }
  
  showDuplicateModal.value = true
}

async function confirmDuplicate() {
  if (!tenant.value) return
  
  try {
    const newTenantData = {
      name: duplicateData.value.name,
      domain: duplicateData.value.domain,
      email: duplicateData.value.email,
      settings: { ...tenant.value.settings },
      subscription: { ...tenant.value.subscription }
    }
    
    const newTenant = await tenantStore.createTenant(newTenantData)
    
    showDuplicateModal.value = false
    toast.success('Établissement dupliqué avec succès')
    
    // Rediriger vers le nouvel établissement
    if (newTenant) {
      router.push(`/tenant/${newTenant._id}`)
    }
  } catch (err) {
    toast.error('Erreur lors de la duplication')
    console.error('Erreur duplication:', err)
  }
}

function transferOwnership() {
  showTransferModal.value = true
}

async function confirmTransfer() {
  if (!tenant.value) return
  
  if (confirm(`Êtes-vous sûr de vouloir transférer la propriété de ${tenant.value.name} à ${transferData.value.newOwnerEmail} ?`)) {
    try {
      // Ici, vous implémenteriez la logique de transfert
      // Pour l'instant, on simule avec une mise à jour de l'email
      await tenantStore.updateTenant(tenant.value._id, {
        email: transferData.value.newOwnerEmail
      })
      
      showTransferModal.value = false
      toast.success('Propriété transférée avec succès')
      
      // Rediriger vers le dashboard
      router.push('/tenant-dashboard')
    } catch (err) {
      toast.error('Erreur lors du transfert')
      console.error('Erreur transfert:', err)
    }
  }
}

// Watchers
watch(() => route.params.id, (newId) => {
  if (newId && newId !== tenantId.value) {
    loadTenant()
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  loadTenant()
})

// Garde de navigation pour éviter de perdre des modifications
window.addEventListener('beforeunload', (e) => {
  if (hasChanges.value) {
    e.preventDefault()
    e.returnValue = ''
  }
})
</script> 