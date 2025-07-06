<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-medium text-gray-900">
        Configuration de l'établissement
      </h2>
      <p class="text-sm text-gray-600 mt-1">
        Personnalisez les paramètres de votre établissement scolaire
      </p>
    </div>

    <form @submit.prevent="saveSettings" class="p-6 space-y-6">
      
      <!-- Informations générales -->
      <div class="space-y-4">
        <h3 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
          Informations Générales
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'établissement
            </label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email de contact
            </label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Type d'établissement
            </label>
            <select
              v-model="formData.settings.schoolType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="primary">École primaire</option>
              <option value="secondary">Collège/Lycée</option>
              <option value="university">Université</option>
              <option value="mixed">Établissement mixte</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Adresse -->
      <div class="space-y-4" v-if="formData.address">
        <h3 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
          Adresse
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rue
            </label>
            <input
              v-model="formData.address.street"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ville
            </label>
            <input
              v-model="formData.address.city"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Code postal
            </label>
            <input
              v-model="formData.address.postalCode"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Pays
            </label>
            <input
              v-model="formData.address.country"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Configuration académique -->
      <div class="space-y-4">
        <h3 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
          Configuration Académique
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Système de notation
            </label>
            <select
              v-model="formData.settings.gradeSystem"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="numeric">Numérique (0-20)</option>
              <option value="letter">Lettres (A-F)</option>
              <option value="points">Points (0-100)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Note maximale
            </label>
            <input
              v-model.number="formData.settings.maxGrade"
              type="number"
              min="1"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Langue principale
            </label>
            <select
              v-model="formData.settings.language"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="de">Allemand</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Début d'année scolaire
            </label>
            <input
              v-model="formData.settings.academicYearStart"
              type="text"
              pattern="\d{2}-\d{2}"
              placeholder="09-01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p class="text-xs text-gray-500 mt-1">Format: MM-JJ</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fin d'année scolaire
            </label>
            <input
              v-model="formData.settings.academicYearEnd"
              type="text"
              pattern="\d{2}-\d{2}"
              placeholder="07-15"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p class="text-xs text-gray-500 mt-1">Format: MM-JJ</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fuseau horaire
            </label>
            <select
              v-model="formData.settings.timezone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Devise
            </label>
            <select
              v-model="formData.settings.currency"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar US ($)</option>
              <option value="GBP">Livre Sterling (£)</option>
              <option value="CHF">Franc Suisse (CHF)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Personnalisation -->
      <div class="space-y-4">
        <h3 class="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
          Personnalisation
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              URL du logo
            </label>
            <input
              v-model="formData.settings.logoUrl"
              type="url"
              placeholder="https://exemple.com/logo.png"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-1">URL publique vers le logo de votre établissement</p>
          </div>

          <div v-if="formData.settings.logoUrl" class="flex items-center">
            <div class="w-16 h-16 border border-gray-300 rounded-md overflow-hidden">
              <img
                :src="formData.settings.logoUrl"
                alt="Logo"
                class="w-full h-full object-cover"
                @error="formData.settings.logoUrl = ''"
              />
            </div>
          </div>
        </div>

        <!-- Couleurs du thème -->
        <div v-if="formData.settings.theme" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Couleur principale
            </label>
            <div class="flex items-center space-x-2">
              <input
                v-model="formData.settings.theme.primaryColor"
                type="color"
                class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                v-model="formData.settings.theme.primaryColor"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Couleur secondaire
            </label>
            <div class="flex items-center space-x-2">
              <input
                v-model="formData.settings.theme.secondaryColor"
                type="color"
                class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                v-model="formData.settings.theme.secondaryColor"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="resetToOriginal"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Annuler les modifications
        </button>
        
        <div class="flex space-x-3">
          <button
            type="button"
            @click="previewChanges"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Aperçu
          </button>
          
          <button
            type="submit"
            :disabled="loading || !hasChanges"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
    </form>

    <!-- Modal d'aperçu -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Aperçu de la configuration
            </h3>
            <button
              @click="showPreview = false"
              class="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div class="space-y-4 text-sm">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="font-medium text-gray-700">Nom:</span>
                <span class="ml-2">{{ formData.name }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Type:</span>
                <span class="ml-2">{{ getSchoolTypeLabel(formData.settings.schoolType) }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Système de notes:</span>
                <span class="ml-2">{{ getGradeSystemLabel(formData.settings.gradeSystem) }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Note max:</span>
                <span class="ml-2">{{ formData.settings.maxGrade }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Année scolaire:</span>
                <span class="ml-2">{{ formData.settings.academicYearStart }} → {{ formData.settings.academicYearEnd }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Langue:</span>
                <span class="ml-2">{{ formData.settings.language.toUpperCase() }}</span>
              </div>
            </div>
            
            <div v-if="formData.settings.theme" class="flex items-center space-x-4">
              <span class="font-medium text-gray-700">Couleurs:</span>
              <div class="flex items-center space-x-2">
                <div 
                  :style="{ backgroundColor: formData.settings.theme.primaryColor }"
                  class="w-6 h-6 rounded border border-gray-300"
                ></div>
                <span class="text-xs">{{ formData.settings.theme.primaryColor }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <div 
                  :style="{ backgroundColor: formData.settings.theme.secondaryColor }"
                  class="w-6 h-6 rounded border border-gray-300"
                ></div>
                <span class="text-xs">{{ formData.settings.theme.secondaryColor }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button
              @click="showPreview = false"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useTenantStore } from '../../stores/tenantStore'
import type { Tenant } from '../../types/tenant'

const props = defineProps<{
  tenant: Tenant
}>()

const emit = defineEmits<{
  updated: [tenant: Tenant]
}>()

const toast = useToast()
const tenantStore = useTenantStore()

// État local
const loading = ref(false)
const showPreview = ref(false)
const originalData = ref<Tenant | null>(null)

// Données du formulaire
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    postalCode: '',
    country: ''
  },
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
})

// Vérifier s'il y a des changements
const hasChanges = computed(() => {
  if (!originalData.value) return false
  
  return JSON.stringify(formData) !== JSON.stringify({
    name: originalData.value.name,
    email: originalData.value.email,
    phone: originalData.value.phone || '',
    address: originalData.value.address || formData.address,
    settings: originalData.value.settings
  })
})

// Méthodes utilitaires
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

// Actions
function loadTenantData() {
  if (!props.tenant) return
  
  originalData.value = { ...props.tenant }
  
  Object.assign(formData, {
    name: props.tenant.name,
    email: props.tenant.email,
    phone: props.tenant.phone || '',
    address: props.tenant.address || {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    settings: {
      ...props.tenant.settings,
      theme: props.tenant.settings.theme || {
        primaryColor: '#1f2937',
        secondaryColor: '#3b82f6'
      }
    }
  })
}

function resetToOriginal() {
  if (originalData.value) {
    loadTenantData()
  }
}

function previewChanges() {
  showPreview.value = true
}

async function saveSettings() {
  if (!props.tenant || !hasChanges.value) return
  
  loading.value = true
  
  try {
    const updateData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      address: formData.address.street ? formData.address : undefined,
      settings: formData.settings
    }
    
    const updatedTenant = await tenantStore.updateTenant(props.tenant._id, updateData)
    
    if (updatedTenant) {
      originalData.value = { ...updatedTenant }
      emit('updated', updatedTenant)
      toast.success('Configuration sauvegardée avec succès')
    }
  } catch (err: any) {
    toast.error('Erreur lors de la sauvegarde')
    console.error('Erreur sauvegarde:', err)
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.tenant, loadTenantData, { immediate: true })

// Lifecycle
onMounted(() => {
  loadTenantData()
})
</script> 