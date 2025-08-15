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
            <div v-if="show" class="relative w-full max-w-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30">
              
              <!-- Header -->
              <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                        {{ courseType === 'immediate' ? 'Cours Immédiat' : 'Nouveau Cours en Ligne' }}
                      </h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ courseType === 'immediate' ? 'Démarrer maintenant' : 'Créer et planifier' }}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    @click="$emit('close')"
                    class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Form -->
              <div class="p-6 space-y-6">
                <!-- Nom du cours -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Nom du cours *
                  </label>
                  <input
                    v-model="formData.title"
                    type="text"
                    :placeholder="courseType === 'immediate' ? 'Cours immédiat - ' + defaultDateTime : 'Ex: Mathématiques - Algèbre'"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <!-- Matière -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Matière *
                  </label>
                  <select
                    v-model="formData.subject"
                    :disabled="isLoadingData"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                  >
                    <option value="">
                      {{ isLoadingData ? 'Chargement des matières...' : 'Sélectionner une matière' }}
                    </option>
                    <option v-for="subject in subjects" :key="subject._id" :value="subject.name">
                      {{ subject.name }}
                    </option>
                  </select>
                </div>

                <!-- Classe -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Classe *
                  </label>
                  <select
                    v-model="formData.className"
                    :disabled="isLoadingData"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                  >
                    <option value="">
                      {{ isLoadingData ? 'Chargement des classes...' : 'Sélectionner une classe' }}
                    </option>
                    <option v-for="cls in classes" :key="cls._id" :value="cls.name">
                      {{ cls.name }}
                    </option>
                  </select>
                </div>

                <!-- Durée (seulement pour cours planifié) -->
                <div v-if="courseType !== 'immediate'">
                  <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Durée (minutes)
                  </label>
                  <select
                    v-model="formData.duration"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option :value="30">30 minutes</option>
                    <option :value="45">45 minutes</option>
                    <option :value="60">1 heure</option>
                    <option :value="90">1h30</option>
                    <option :value="120">2 heures</option>
                  </select>
                </div>

                <!-- Planification (seulement pour cours planifié) -->
                <div v-if="courseType !== 'immediate'" class="space-y-4">
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      Planification du cours
                    </h4>
                  </div>

                  <!-- Date et heure sur la même ligne -->
                  <div class="grid grid-cols-2 gap-4">
                    <!-- Date -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Date *
                      </label>
                      <input
                        v-model="formData.startDate"
                        type="date"
                        :min="minDate"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <!-- Heure -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Heure *
                      </label>
                      <input
                        v-model="formData.startTime"
                        type="time"
                        step="300"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>

                  <!-- Aperçu de la date/heure -->
                  <div v-if="formData.startDate && formData.startTime" class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
                    <div class="flex items-center gap-2 text-sm">
                      <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="text-blue-700 dark:text-blue-300 font-medium">
                        Début du cours : {{ formatSchedulePreview(formData.startDate, formData.startTime) }}
                      </span>
                    </div>
                    <div v-if="scheduledDateTimeError" class="mt-2 text-sm text-red-600 dark:text-red-400">
                      {{ scheduledDateTimeError }}
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Description (optionnelle)
                  </label>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    placeholder="Décrivez le contenu du cours..."
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div class="flex items-center justify-end space-x-4">
                  <button
                    @click="$emit('close')"
                    class="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  
                  <button
                    @click="createCourse"
                    :disabled="!isFormValid"
                    :class="[
                      'px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium text-white',
                      isFormValid 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    ]"
                  >
                    <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    {{ courseType === 'immediate' ? 'Démarrer Maintenant' : 'Créer le Cours' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchClasses, getSubjects } from '@/services/academicService'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import type { Class, Subject } from '@/types/academic'

interface Props {
  show: boolean
  courseType?: 'normal' | 'immediate'
}

const props = withDefaults(defineProps<Props>(), {
  courseType: 'normal'
})

interface FormData {
  title: string
  subject: string
  className: string
  duration: number
  description: string
  startDate: string
  startTime: string
}

const emit = defineEmits<{
  close: []
  created: [course: FormData & { scheduledAt?: string }]
}>()

const route = useRoute()
const currentTenantStore = useCurrentTenantStore()

// Récupérer l'ID du tenant de la même façon que les autres pages
const tenantId = computed(() => {
  return route.params.tenantId as string || currentTenantStore.currentTenantId || ''
})

// Données réactives pour les classes et matières
const classes = ref<Class[]>([])
const subjects = ref<Subject[]>([])
const isLoadingData = ref(false)

// Date minimum (aujourd'hui)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Heure par défaut (dans 1 heure, arrondie aux 5 minutes)
const defaultTime = computed(() => {
  const now = new Date()
  now.setHours(now.getHours() + 1)
  const minutes = Math.ceil(now.getMinutes() / 5) * 5
  now.setMinutes(minutes)
  now.setSeconds(0)
  return now.toTimeString().slice(0, 5)
})

const formData = ref<FormData>({
  title: '',
  subject: '',
  className: '',
  duration: 60,
  description: '',
  startDate: minDate.value,
  startTime: defaultTime.value
})

const defaultDateTime = computed(() => {
  return new Date().toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Validation de la date/heure programmée
const scheduledDateTimeError = computed(() => {
  if (props.courseType === 'immediate') return null
  if (!formData.value.startDate || !formData.value.startTime) return null
  
  const scheduledDateTime = new Date(`${formData.value.startDate}T${formData.value.startTime}`)
  const now = new Date()
  
  if (scheduledDateTime <= now) {
    return 'La date et l\'heure doivent être dans le futur'
  }
  
  const hoursDiff = (scheduledDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (hoursDiff < 0.5) {
    return 'Le cours doit être programmé au moins 30 minutes à l\'avance'
  }
  
  return null
})

// Formatage de l'aperçu de la planification
const formatSchedulePreview = (date: string, time: string) => {
  if (!date || !time) return ''
  
  const scheduledDate = new Date(`${date}T${time}`)
  const now = new Date()
  
  const formatted = scheduledDate.toLocaleString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const timeDiff = scheduledDate.getTime() - now.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hoursDiff = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  let timeUntil = ''
  if (daysDiff > 0) {
    timeUntil = `dans ${daysDiff} jour${daysDiff > 1 ? 's' : ''}`
    if (hoursDiff > 0) {
      timeUntil += ` et ${hoursDiff}h`
    }
  } else if (hoursDiff > 0) {
    timeUntil = `dans ${hoursDiff}h`
  } else {
    const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    timeUntil = `dans ${minutesDiff} min`
  }
  
  return `${formatted} (${timeUntil})`
}

const isFormValid = computed(() => {
  const basicValidation = formData.value.title.trim() !== '' && 
                          formData.value.subject !== '' && 
                          formData.value.className !== ''
  
  if (props.courseType === 'immediate') {
    return basicValidation
  }
  
  // Pour les cours planifiés, valider aussi la date/heure
  const dateTimeValidation = formData.value.startDate !== '' && 
                             formData.value.startTime !== '' && 
                             !scheduledDateTimeError.value
  
  return basicValidation && dateTimeValidation
})

// Charger les données de classes et matières
const loadData = async () => {
  const currentTenantId = tenantId.value
  if (!currentTenantId) {
    console.warn('⚠️ Aucun tenant ID disponible pour charger les données')
    return
  }
  
  console.log('🔍 Chargement des données pour tenant:', currentTenantId)
  
  isLoadingData.value = true
  try {
    // Utiliser la même méthode que les autres pages
    const [classesData, subjectsData] = await Promise.all([
      fetchClasses(currentTenantId),
      getSubjects(currentTenantId)
    ])
    
    // Filtrer uniquement les éléments actifs
    classes.value = classesData.filter(cls => cls.status === 'active')
    subjects.value = subjectsData.filter(subject => subject.status === 'active')
    
    console.log('✅ Données chargées avec succès:', {
      tenantId: currentTenantId,
      classes: classes.value.length,
      subjects: subjects.value.length,
      classesRaw: classesData.length,
      subjectsRaw: subjectsData.length
    })
    
    // Diagnostic des données reçues
    if (classes.value.length === 0) {
      console.warn('⚠️ Aucune classe active trouvée')
    }
    if (subjects.value.length === 0) {
      console.warn('⚠️ Aucune matière active trouvée')
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du chargement des données:', error)
    console.error('Détails de l\'erreur:', {
      message: error.message,
      tenantId: currentTenantId
    })
    
    // Fallback vers des données par défaut en cas d'erreur
    subjects.value = [
      { _id: 'default1', name: 'Mathématiques', code: 'MATH', credits: 0, status: 'active', tenantId: currentTenantId, createdAt: '', updatedAt: '' },
      { _id: 'default2', name: 'Français', code: 'FR', credits: 0, status: 'active', tenantId: currentTenantId, createdAt: '', updatedAt: '' },
      { _id: 'default3', name: 'Sciences', code: 'SCI', credits: 0, status: 'active', tenantId: currentTenantId, createdAt: '', updatedAt: '' }
    ] as Subject[]
    
    classes.value = []
    
    console.log('📝 Données de fallback utilisées')
  } finally {
    isLoadingData.value = false
  }
}

// Reset form when modal opens/closes
watch(() => props.show, (newShow) => {
  if (newShow) {
    console.log('📖 Modal ouvert, réinitialisation du formulaire')
    formData.value = {
      title: props.courseType === 'immediate' ? `Cours immédiat - ${defaultDateTime.value}` : '',
      subject: '',
      className: '',
      duration: 60,
      description: '',
      startDate: minDate.value,
      startTime: defaultTime.value
    }
    // Charger les données quand le modal s'ouvre
    loadData()
  }
})

// Charger les données au montage du composant si le modal est déjà ouvert
onMounted(() => {
  if (props.show) {
    console.log('📖 Composant monté avec modal ouvert')
    loadData()
  }
})

const createCourse = () => {
  if (isFormValid.value) {
    const courseData = { ...formData.value }
    
    // Calculer la date/heure de début
    if (props.courseType === 'immediate') {
      // Pour les cours immédiats, utiliser l'heure actuelle
      courseData.scheduledAt = new Date().toISOString()
    } else {
      // Pour les cours planifiés, utiliser la date/heure sélectionnée
      const scheduledDateTime = new Date(`${formData.value.startDate}T${formData.value.startTime}`)
      courseData.scheduledAt = scheduledDateTime.toISOString()
    }
    
    console.log('✅ Création du cours:', {
      ...courseData,
      scheduledAt: courseData.scheduledAt,
      scheduledAtFormatted: new Date(courseData.scheduledAt).toLocaleString('fr-FR')
    })
    
    emit('created', courseData)
  } else {
    console.warn('⚠️ Formulaire invalide:', {
      formData: formData.value,
      errors: {
        title: formData.value.title.trim() === '',
        subject: formData.value.subject === '',
        className: formData.value.className === '',
        dateTimeError: scheduledDateTimeError.value
      }
    })
  }
}
</script> 