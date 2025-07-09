<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
        
        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div v-if="show" class="relative w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30">
              
              <!-- Header -->
              <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ mode === 'create' ? 'Nouvel Établissement' : 'Modifier Établissement' }}
                  </h3>
                  <button
                    @click="$emit('close')"
                    class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
                
                <!-- Informations générales -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom de l'établissement *
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                      placeholder="École Primaire Victor Hugo"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Domaine *
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.domain"
                        type="text"
                        required
                        class="w-full px-4 py-3 pr-28 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                        placeholder="victor-hugo"
                      />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        .schools.com
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Contact admin -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email administrateur *
                    </label>
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                      placeholder="admin@victor-hugo.fr"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Téléphone
                    </label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                </div>

                <!-- Adresse -->
                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Adresse</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ville *
                      </label>
                      <input
                        v-model="form.city"
                        type="text"
                        required
                        class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                        placeholder="Paris"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type d'établissement
                      </label>
                      <select
                        v-model="form.type"
                        class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                      >
                        <option value="École Primaire">École Primaire</option>
                        <option value="Collège">Collège</option>
                        <option value="Lycée">Lycée</option>
                        <option value="École Maternelle">École Maternelle</option>
                        <option value="Établissement">Établissement</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Plan d'abonnement -->
                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Plan d'Abonnement</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Plan *
                      </label>
                      <select
                        v-model="form.plan"
                        required
                        class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                        @change="updatePlanLimits"
                      >
                        <option value="">Sélectionner un plan</option>
                        <option 
                          v-for="plan in availablePlans" 
                          :key="plan.id" 
                          :value="plan.id"
                        >
                          {{ plan.name }} ({{ plan.maxStudents }} élèves) - {{ formatPrice(plan.monthlyPrice) }}{{ formatValidityPeriod(plan.validity) }}
                        </option>
                      </select>
                      <p v-if="loadingPlans" class="text-sm text-gray-500 mt-1">Chargement des plans...</p>
                      <p v-else-if="availablePlans.length === 0" class="text-sm text-orange-600 mt-1">Aucun plan disponible</p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max élèves
                      </label>
                      <input
                        v-model.number="form.maxStudents"
                        type="number"
                        min="1"
                        class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max professeurs
                      </label>
                      <input
                        v-model.number="form.maxTeachers"
                        type="number"
                        min="1"
                        class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                      />
                    </div>
                  </div>

                  <!-- Indicateur d'expiration automatique -->
                  <div v-if="form.plan && selectedPlanInfo" class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div class="flex items-center space-x-2">
                      <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div class="text-sm">
                        <p class="font-medium text-blue-900 dark:text-blue-100">
                          Abonnement {{ selectedPlanInfo.validity === 'yearly' ? 'annuel' : 'mensuel' }}
                        </p>
                        <p class="text-blue-700 dark:text-blue-300">
                          Expiration prévue : <strong>{{ previewExpirationDate }}</strong>
                          ({{ selectedPlanInfo.validity === 'yearly' ? '12 mois' : '1 mois' }} à partir d'aujourd'hui)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer avec boutons -->
                <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  
                  <button
                    type="submit"
                    :disabled="loading"
                    class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    <span v-if="loading" class="inline-flex items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ mode === 'create' ? 'Création...' : 'Modification...' }}
                    </span>
                    <span v-else>
                      {{ mode === 'create' ? 'Créer l\'établissement' : 'Sauvegarder les modifications' }}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useTenantStore } from '@/stores/tenantStore'
import { getAllPlans, type CustomPlan } from '@/services/api'
import type { TenantListItem } from '@/services/api'

interface Props {
  show: boolean
  tenant?: TenantListItem | null
  mode: 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  tenant: null
})

const emit = defineEmits<{
  close: []
  saved: [tenant: TenantListItem]
}>()

const loading = ref(false)
const loadingPlans = ref(false)
const tenantStore = useTenantStore()

// Plans disponibles
const availablePlans = ref<CustomPlan[]>([])

// Formulaire
const form = reactive({
  name: '',
  domain: '',
  email: '',
  phone: '',
  city: '',
  type: 'École Primaire',
  plan: '',
  maxStudents: 100,
  maxTeachers: 10
})

// Computed pour le plan sélectionné
const selectedPlanInfo = computed(() => {
  return availablePlans.value.find(plan => plan.id === form.plan)
})

// Computed pour la date d'expiration prévue
const previewExpirationDate = computed(() => {
  if (!selectedPlanInfo.value) return ''
  
  const startDate = new Date()
  const endDate = new Date(startDate)
  
  if (selectedPlanInfo.value.validity === 'yearly') {
    endDate.setFullYear(endDate.getFullYear() + 1)
  } else {
    endDate.setMonth(endDate.getMonth() + 1)
  }
  
  return endDate.toLocaleDateString('fr-FR')
})

// Fonctions utilitaires pour l'affichage
function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatValidityPeriod(validity: string): string {
  return validity === 'yearly' ? '/an' : '/mois'
}

// Charger les plans depuis l'API
async function loadPlans() {
  loadingPlans.value = true
  try {
    const plansData = await getAllPlans()
    console.log('Plans chargés:', plansData)
    
    if (Array.isArray(plansData)) {
      availablePlans.value = plansData
    } else if (plansData && plansData.plans) {
      availablePlans.value = plansData.plans
    } else {
      availablePlans.value = []
    }
  } catch (error) {
    console.error('Erreur lors du chargement des plans:', error)
    availablePlans.value = []
  } finally {
    loadingPlans.value = false
  }
}

// Plans prédéfinis (fallback)
const planLimits = {
  starter: { students: 50, teachers: 5 },
  standard: { students: 200, teachers: 20 },
  enterprise: { students: 1000, teachers: 100 }
}

// Watcher pour remplir le formulaire en mode édition
watch(() => [props.tenant, props.mode, props.show] as const, ([newTenant, mode, show]) => {
  console.log('Modal watcher triggered:', { mode, show, tenant: newTenant?.name })
  
  if (show) {
    // Charger les plans quand la modal s'ouvre
    loadPlans()
    
    if (mode === 'edit' && newTenant) {
      // Mode édition : remplir avec les données du tenant
      console.log('Filling form with tenant data:', newTenant)
      form.name = newTenant.name || ''
      form.domain = newTenant.domain || ''
      form.email = newTenant.adminEmail || ''
      form.city = newTenant.city || ''
      form.type = newTenant.type || 'École Primaire'
      form.plan = newTenant.plan || ''
      form.maxStudents = newTenant.maxStudents || 100
      form.maxTeachers = newTenant.maxTeachers || 10
      form.phone = '' // Le téléphone n'est pas dans TenantListItem
    } else if (mode === 'create') {
      // Mode création : reset le formulaire
      console.log('Resetting form for create mode')
      resetForm()
    }
  }
}, { immediate: true })

// Reset form when modal closes
watch(() => props.show, (show) => {
  if (!show) {
    // Petit délai pour éviter les effets visuels indésirables
    setTimeout(resetForm, 100)
  }
})

function resetForm() {
  form.name = ''
  form.domain = ''
  form.email = ''
  form.phone = ''
  form.city = ''
  form.type = 'École Primaire'
  form.plan = ''
  form.maxStudents = 100
  form.maxTeachers = 10
}

function updatePlanLimits() {
  // Chercher le plan sélectionné dans les plans disponibles
  const selectedPlan = availablePlans.value.find(plan => plan.id === form.plan)
  
  if (selectedPlan) {
    console.log('Plan sélectionné:', {
      name: selectedPlan.name,
      maxStudents: selectedPlan.maxStudents,
      maxTeachers: selectedPlan.maxTeachers,
      validity: selectedPlan.validity,
      price: selectedPlan.monthlyPrice
    })
    
    form.maxStudents = selectedPlan.maxStudents
    form.maxTeachers = selectedPlan.maxTeachers
  } else {
    // Fallback vers les plans prédéfinis
    const plan = form.plan as keyof typeof planLimits
    if (plan && planLimits[plan]) {
      form.maxStudents = planLimits[plan].students
      form.maxTeachers = planLimits[plan].teachers
    }
  }
}

// Calculer la date d'expiration selon la validité du plan
function calculateExpirationDate(validity: string): Date {
  const startDate = new Date()
  const endDate = new Date(startDate)
  
  if (validity === 'yearly') {
    // Plan annuel : +12 mois
    endDate.setFullYear(endDate.getFullYear() + 1)
  } else {
    // Plan mensuel : +1 mois
    endDate.setMonth(endDate.getMonth() + 1)
  }
  
  console.log('Calcul expiration:', {
    validity,
    startDate: startDate.toLocaleDateString('fr-FR'),
    endDate: endDate.toLocaleDateString('fr-FR'),
    duration: validity === 'yearly' ? '12 mois' : '1 mois'
  })
  
  return endDate
}

// Charger les plans au montage du composant
onMounted(() => {
  loadPlans()
})

async function handleSubmit() {
  loading.value = true
  
  try {
    // Récupérer le plan sélectionné pour obtenir son prix et sa validité
    const selectedPlan = availablePlans.value.find(plan => plan.id === form.plan)
    const planPrice = selectedPlan ? selectedPlan.monthlyPrice : 29 // Fallback
    const planValidity = selectedPlan ? selectedPlan.validity : 'monthly' // Fallback
    
    // Calculer la date d'expiration selon la validité du plan
    const expirationDate = calculateExpirationDate(planValidity)
    
    if (props.mode === 'create') {
      // Création d'un nouvel établissement
      await tenantStore.createTenant({
        name: form.name,
        domain: form.domain,
        email: form.email,
        phone: form.phone,
        address: {
          street: '',
          city: form.city,
          postalCode: '',
          country: 'France'
        },
        settings: {
          schoolType: form.type === 'École Primaire' ? 'primary' : 
                     form.type === 'Collège' ? 'secondary' :
                     form.type === 'Lycée' ? 'secondary' : 'mixed',
          academicYearStart: '09-01',
          academicYearEnd: '07-15',
          gradeSystem: 'numeric',
          maxGrade: 20,
          language: 'fr',
          timezone: 'Europe/Paris',
          currency: 'XOF'
        },
        subscription: {
          plan: selectedPlan ? 'custom' : form.plan, // Utiliser 'custom' pour les plans personnalisés
          customPlanId: selectedPlan ? selectedPlan.id : undefined,
          validity: planValidity,
          startDate: new Date().toISOString(),
          endDate: expirationDate.toISOString(),
          maxStudents: form.maxStudents,
          maxTeachers: form.maxTeachers,
          pricePerMonth: planPrice
        },
        admin: {
          firstName: 'Admin',
          lastName: 'Établissement',
          email: form.email
        }
      })
    } else if (props.tenant) {
      // Modification d'un établissement existant - utiliser la nouvelle API
      await tenantStore.updateTenant(props.tenant.id, {
        name: form.name,
        domain: form.domain,
        email: form.email,
        phone: form.phone,
        address: {
          street: '',
          city: form.city,
          postalCode: '',
          country: 'France'
        },
        settings: {
          schoolType: form.type === 'École Primaire' ? 'primary' : 
                     form.type === 'Collège' ? 'secondary' :
                     form.type === 'Lycée' ? 'secondary' : 'mixed',
        }
      })
    }

    // Créer l'objet tenant mis à jour pour l'émission
    const tenantData: TenantListItem = {
      id: props.tenant?.id || Date.now().toString(),
      name: form.name,
      domain: form.domain,
      status: props.tenant?.status || 'PENDING',
      plan: selectedPlan ? 'custom' : form.plan,
      currentStudents: props.tenant?.currentStudents || 0,
      maxStudents: form.maxStudents,
      currentTeachers: props.tenant?.currentTeachers || 0,
      maxTeachers: form.maxTeachers,
      endDate: expirationDate.toLocaleDateString('fr-FR'),
      createdAt: props.tenant?.createdAt || new Date().toLocaleDateString('fr-FR'),
      adminEmail: form.email,
      city: form.city,
      type: form.type
    }

    emit('saved', tenantData)
    emit('close')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Erreur lors de la sauvegarde de l\'établissement')
  } finally {
    loading.value = false
  }
}
</script> 