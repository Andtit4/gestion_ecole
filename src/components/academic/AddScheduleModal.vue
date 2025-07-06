<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="relative w-full max-w-2xl transform rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Nouveau Créneau Horaire
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Informations générales -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations générales
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom du créneau *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Ex: Mathématiques - 6ème A"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jour de la semaine *
                </label>
                <select
                  v-model="form.dayOfWeek"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner un jour</option>
                  <option v-for="day in dayOfWeekOptions" :key="day.value" :value="day.value">
                    {{ day.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de cours *
                </label>
                <select
                  v-model="form.type"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner un type</option>
                  <option v-for="type in scheduleTypeOptions" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Heure de début *
                </label>
                <input
                  v-model="form.startTime"
                  type="time"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  @change="calculateDuration"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Heure de fin *
                </label>
                <input
                  v-model="form.endTime"
                  type="time"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  @change="calculateDuration"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Classe *
                </label>
                <select
                  v-model="form.classId"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner une classe</option>
                  <option v-for="classItem in classes" :key="classItem._id" :value="classItem._id">
                    {{ classItem.name }} ({{ classItem.level }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Année scolaire *
                </label>
                <select
                  v-model="form.academicYearId"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner une année</option>
                  <option v-for="year in academicYears" :key="year._id" :value="year._id">
                    {{ year.name }} {{ year.isActive ? '(Active)' : '' }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salle de classe
                </label>
                <input
                  v-model="form.classroom"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Ex: Salle 101, Amphi A"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Couleur d'affichage
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="form.color"
                    type="color"
                    class="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    v-model="form.color"
                    type="text"
                    class="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  v-model="form.description"
                  rows="2"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Description du créneau..."
                ></textarea>
              </div>

              <div class="md:col-span-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div class="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-medium">
                    Durée calculée: {{ calculatedDuration }} minutes ({{ formatDuration(calculatedDuration) }})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Options avancées -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Options avancées
            </h4>
            
            <div class="space-y-4">
              <label class="flex items-center">
                <input
                  v-model="form.isRecurring"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Créneau récurrent (se répète chaque semaine)
                </span>
              </label>

              <div v-if="!form.isRecurring" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date de début de validité
                  </label>
                  <input
                    v-model="form.startDate"
                    type="date"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date de fin de validité
                  </label>
                  <input
                    v-model="form.endDate"
                    type="date"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Création...
              </span>
              <span v-else>Créer le créneau</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { CreateScheduleDto, AcademicYear, Class } from '@/types/academic'
import { DAY_OF_WEEK_OPTIONS, SCHEDULE_TYPE_OPTIONS } from '@/types/academic'
import { calculateDuration as calcDuration, formatDuration } from '@/services/academicService'

interface Props {
  isOpen: boolean
  academicYears: AcademicYear[]
  classes: Class[]
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', scheduleData: CreateScheduleDto): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const dayOfWeekOptions = DAY_OF_WEEK_OPTIONS
const scheduleTypeOptions = SCHEDULE_TYPE_OPTIONS

// Initialiser le formulaire
const initForm = (): CreateScheduleDto => ({
  name: '',
  dayOfWeek: 'monday' as any,
  startTime: '08:00',
  endTime: '09:00',
  duration: 60,
  classId: '',
  academicYearId: '',
  type: 'course' as any,
  classroom: '',
  description: '',
  color: '#3B82F6',
  isRecurring: true,
  status: 'active'
})

const form = reactive<CreateScheduleDto>(initForm())

// Calculer la durée automatiquement
const calculatedDuration = computed(() => {
  if (form.startTime && form.endTime) {
    return calcDuration(form.startTime, form.endTime)
  }
  return 0
})

// Mettre à jour la durée dans le formulaire
const calculateDuration = () => {
  if (form.startTime && form.endTime) {
    form.duration = calcDuration(form.startTime, form.endTime)
  }
}

// Validation du formulaire
const validateForm = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!form.name?.trim()) {
    errors.push('Le nom du créneau est requis')
  }
  
  if (!form.classId) {
    errors.push('La classe est requise')
  }
  
  if (!form.academicYearId) {
    errors.push('L\'année académique est requise')
  }
  
  if (!form.dayOfWeek) {
    errors.push('Le jour de la semaine est requis')
  }
  
  if (!form.type) {
    errors.push('Le type de créneau est requis')
  }
  
  // Validation des heures
  if (!form.startTime || !form.endTime) {
    errors.push('Les heures de début et de fin sont requises')
  } else if (form.endTime <= form.startTime) {
    errors.push('L\'heure de fin doit être postérieure à l\'heure de début')
  }
  
  // Validation du format des heures (HH:MM)
  const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (form.startTime && !timePattern.test(form.startTime)) {
    errors.push('L\'heure de début doit être au format HH:MM')
  }
  if (form.endTime && !timePattern.test(form.endTime)) {
    errors.push('L\'heure de fin doit être au format HH:MM')
  }
  
  return { isValid: errors.length === 0, errors }
}

// Soumettre le formulaire
const handleSubmit = async () => {
  // Valider le formulaire
  const validation = validateForm()
  if (!validation.isValid) {
    alert('Erreurs de validation:\n' + validation.errors.join('\n'))
    return
  }
  
  loading.value = true
  try {
    // Nettoyer les données avant envoi
    const submitData: any = {
      name: form.name.trim(),
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
      classId: form.classId,
      academicYearId: form.academicYearId,
      type: form.type,
      duration: calculatedDuration.value,
      isRecurring: form.isRecurring,
      status: form.status || 'active'
    }
    
    // Ajouter les champs optionnels s'ils sont remplis
    if (form.classroom?.trim()) {
      submitData.classroom = form.classroom.trim()
    }
    if (form.description?.trim()) {
      submitData.description = form.description.trim()
    }
    if (form.color?.trim()) {
      submitData.color = form.color.trim()
    }
    if (form.subjectId?.trim()) {
      submitData.subjectId = form.subjectId.trim()
    }
    if (form.teacherId?.trim()) {
      submitData.teacherId = form.teacherId.trim()
    }
    
    // Si non récurrent, ajouter les dates de validité
    if (!submitData.isRecurring) {
      if (form.startDate) {
        submitData.startDate = form.startDate
      }
      if (form.endDate) {
        submitData.endDate = form.endDate
      }
    }
    
    console.log('Données de créneau à envoyer:', JSON.stringify(submitData, null, 2))
    emit('submit', submitData)
  } finally {
    loading.value = false
  }
}

// Fermer le modal
const closeModal = () => {
  emit('close')
}

// Réinitialiser le formulaire quand le modal se ferme
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    Object.assign(form, initForm())
    loading.value = false
  } else {
    // Pré-sélectionner l'année active si disponible
    const activeYear = props.academicYears.find(year => year.isActive)
    if (activeYear && !form.academicYearId) {
      form.academicYearId = activeYear._id
    }
  }
})

// Mettre à jour la durée quand les heures changent
watch([() => form.startTime, () => form.endTime], () => {
  calculateDuration()
})
</script>