<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="relative w-full max-w-4xl transform rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Modifier l'élève
            </h3>
            <p v-if="effectiveTenantName" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pour l'établissement: {{ effectiveTenantName }}
            </p>
          </div>
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
          <!-- Informations personnelles -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations personnelles
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prénom *
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Prénom de l'élève"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom de famille *
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Nom de famille"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Numéro d'élève *
                </label>
                <input
                  v-model="form.studentNumber"
                  type="text"
                  required
                  readonly
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  placeholder="Ex: STU20241234"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="email@exemple.com"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Téléphone
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de naissance *
                </label>
                <input
                  v-model="form.dateOfBirth"
                  type="date"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Genre *
                </label>
                <select
                  v-model="form.gender"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner le genre</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lieu de naissance
                </label>
                <input
                  v-model="form.placeOfBirth"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Ville de naissance"
                />
              </div>
            </div>
          </div>

          <!-- Informations académiques -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations académiques
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Classe *
                </label>
                <div class="relative">
                <select
                  v-model="form.academicInfo.className"
                  required
                  @change="updateClassInfo"
                    :disabled="loadingClasses"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                >
                    <option value="">
                      {{ loadingClasses ? 'Chargement des classes...' : 'Sélectionner une classe' }}
                    </option>
                  <option v-for="classOption in availableClasses" :key="classOption.id" :value="classOption.name">
                      {{ classOption.name }} ({{ classOption.level }})
                  </option>
                </select>
                  <div v-if="loadingClasses" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg class="w-4 h-4 animate-spin text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section
                </label>
                <input
                  v-model="form.academicInfo.section"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Section (optionnel)"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut *
                </label>
                <select
                  v-model="form.academicInfo.status"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="transferred">Transféré</option>
                  <option value="graduated">Diplômé</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date d'inscription *
                </label>
                <input
                  v-model="form.academicInfo.enrollmentDate"
                  type="date"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Modification...
              </span>
              <span v-else>Modifier l'élève</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import type { Student, UpdateStudentDto } from '@/types/student'

interface Props {
  isOpen: boolean
  student: Student | null
  tenantId?: string
  tenantName?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [student: UpdateStudentDto]
}>()

const loading = ref(false)

// Computed pour le tenant effectif
const effectiveTenantName = computed(() => {
  return props.tenantName || 'Établissement'
})

// Initialiser le formulaire avec les données de l'élève
const initForm = (): UpdateStudentDto => {
  if (!props.student) {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      placeOfBirth: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: 'France'
      },
      parentContact: {
        fatherName: '',
        fatherPhone: '',
        fatherEmail: '',
        motherName: '',
        motherPhone: '',
        motherEmail: '',
        guardianName: '',
        guardianPhone: '',
        guardianEmail: ''
      },
      academicInfo: {
        classId: '',
        className: '',
        level: '',
        section: '',
        enrollmentDate: '',
        status: 'active' as const
      }
    }
  }

  const student = props.student
  return {
    firstName: student.firstName || '',
    lastName: student.lastName || '',
    email: student.email || '',
    phone: student.phone || '',
    dateOfBirth: student.dateOfBirth || '',
    gender: student.gender || '',
    placeOfBirth: student.placeOfBirth || '',
    address: {
      street: student.address?.street || '',
      city: student.address?.city || '',
      postalCode: student.address?.postalCode || '',
      country: student.address?.country || 'France'
    },
    parentContact: {
      fatherName: student.parentContact?.fatherName || '',
      fatherPhone: student.parentContact?.fatherPhone || '',
      fatherEmail: student.parentContact?.fatherEmail || '',
      motherName: student.parentContact?.motherName || '',
      motherPhone: student.parentContact?.motherPhone || '',
      motherEmail: student.parentContact?.motherEmail || '',
      guardianName: student.parentContact?.guardianName || '',
      guardianPhone: student.parentContact?.guardianPhone || '',
      guardianEmail: student.parentContact?.guardianEmail || ''
    },
    academicInfo: {
      classId: student.academicInfo?.classId || '',
      className: student.academicInfo?.className || '',
      level: student.academicInfo?.level || '',
      section: student.academicInfo?.section || '',
      enrollmentDate: student.academicInfo?.enrollmentDate || '',
      status: (student.academicInfo?.status as 'active' | 'inactive' | 'transferred' | 'graduated') || 'active'
    }
  }
}

const form = reactive<UpdateStudentDto & { studentNumber?: string }>(initForm())

// Classes disponibles - chargées dynamiquement depuis l'API
const availableClasses = ref<Array<{ id: string; name: string; level: string }>>([])
const loadingClasses = ref(false)

// Charger les classes depuis l'API académique
const loadClasses = async () => {
  if (!props.tenantId) return
  
  loadingClasses.value = true
  try {
    // Import du service académique
    const { fetchClasses } = await import('@/services/academicService')
    const classes = await fetchClasses(props.tenantId)
    
    // Transformer les données pour le composant
    availableClasses.value = classes.map(classItem => ({
      id: classItem._id,
      name: classItem.name,
      level: classItem.level || classItem.grade || 'Non défini'
    }))
    
    console.log('✅ Classes chargées pour édition:', availableClasses.value.length)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des classes:', error)
    // Fallback vers quelques classes par défaut en cas d'erreur
    availableClasses.value = [
      { id: 'temp-1', name: '6ème A', level: '6ème' },
      { id: 'temp-2', name: '5ème A', level: '5ème' },
      { id: 'temp-3', name: '4ème A', level: '4ème' },
      { id: 'temp-4', name: '3ème A', level: '3ème' }
]
  } finally {
    loadingClasses.value = false
  }
}

// Mettre à jour les informations de classe
const updateClassInfo = () => {
  if (form.academicInfo.className) {
    const selectedClass = availableClasses.find(c => c.name === form.academicInfo.className)
    if (selectedClass) {
      form.academicInfo.level = selectedClass.level
      form.academicInfo.classId = selectedClass.id
    }
  }
}

// Soumettre le formulaire
const handleSubmit = async () => {
  loading.value = true
  try {
    // Créer une copie des données à envoyer
    const submitData = { ...form }
    
    // Nettoyer les champs vides dans parentContact
    const cleanedParentContact = { ...submitData.parentContact }
    // Nettoyer les emails vides
    if (cleanedParentContact.fatherEmail === '') {
      delete cleanedParentContact.fatherEmail
    }
    if (cleanedParentContact.motherEmail === '') {
      delete cleanedParentContact.motherEmail
    }
    if (cleanedParentContact.guardianEmail === '') {
      delete cleanedParentContact.guardianEmail
    }
    // Nettoyer les champs vides (optionnels)
    if (cleanedParentContact.fatherName === '') {
      delete cleanedParentContact.fatherName
    }
    if (cleanedParentContact.fatherPhone === '') {
      delete cleanedParentContact.fatherPhone
    }
    if (cleanedParentContact.motherName === '') {
      delete cleanedParentContact.motherName
    }
    if (cleanedParentContact.motherPhone === '') {
      delete cleanedParentContact.motherPhone
    }
    if (cleanedParentContact.guardianName === '') {
      delete cleanedParentContact.guardianName
    }
    if (cleanedParentContact.guardianPhone === '') {
      delete cleanedParentContact.guardianPhone
    }
    submitData.parentContact = cleanedParentContact
    
    // Nettoyer le téléphone personnel s'il est vide
    if (submitData.phone === '') {
      delete submitData.phone
    }
    
    // Nettoyer la section si elle est vide
    if (submitData.academicInfo.section === '') {
      delete submitData.academicInfo.section
    }

    // Retirer le studentNumber des données à envoyer (readonly)
    delete submitData.studentNumber

    console.log('Données de modification à envoyer:', JSON.stringify(submitData, null, 2))
    console.log('Pour l\'établissement:', effectiveTenantName.value)
    emit('submit', submitData)
  } finally {
    loading.value = false
  }
}

// Fermer le modal
const closeModal = () => {
  emit('close')
}

// Réinitialiser le formulaire quand le modal s'ouvre avec un nouvel élève
watch(() => [props.isOpen, props.student], ([isOpen, student]) => {
  if (isOpen && student) {
    Object.assign(form, initForm())
    // Ajouter le numéro d'élève pour l'affichage (readonly)
    form.studentNumber = student.studentNumber
    // Charger les classes
    loadClasses()
  }
}, { immediate: true })

// Charger les classes aussi quand le tenant change
watch(() => props.tenantId, (newTenantId) => {
  if (newTenantId && props.isOpen) {
    loadClasses()
  }
})
</script>
