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
            <div v-if="show" class="relative w-full max-w-4xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 max-h-[90vh] overflow-y-auto">
              
              <!-- Header -->
              <div class="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 p-6 rounded-t-3xl">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {{ studentInitials }}
                    </div>
                    <div>
                      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                        {{ student?.firstName }} {{ student?.lastName }}
                      </h2>
                      <p class="text-blue-600 dark:text-blue-400 font-medium">
                        {{ student?.studentNumber }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <button
                      @click="$emit('edit', student)"
                      class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M17.5 2.5a2.121 2.121 0 013 3L12 14l-4 1 1-4z"/>
                      </svg>
                      Modifier
                    </button>
                    
                    <button
                      @click="$emit('close')"
                      class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Status Badge -->
                <div class="mt-4 flex items-center gap-4">
                  <span :class="statusBadgeClass" class="px-3 py-1 text-sm font-medium rounded-full">
                    {{ statusLabel }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ studentAge }} ans • {{ genderLabel }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 space-y-8">
                
                <!-- Informations personnelles -->
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/30">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Informations personnelles
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.email || 'Non renseigné' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Téléphone</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.phone || 'Non renseigné' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Date de naissance</label>
                      <p class="text-gray-900 dark:text-white">{{ formatDate(student?.dateOfBirth) }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Lieu de naissance</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.placeOfBirth || 'Non renseigné' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Informations académiques -->
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/30">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    Informations académiques
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Classe</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.academicInfo?.className || 'Non assigné' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Niveau</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.academicInfo?.level || 'Non renseigné' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Section</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.academicInfo?.section || 'Non renseigné' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Date d'inscription</label>
                      <p class="text-gray-900 dark:text-white">{{ formatDate(student?.academicInfo?.enrollmentDate) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Adresse -->
                <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/30">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Adresse
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Rue</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.address?.street || 'Non renseigné' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Ville</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.address?.city || 'Non renseigné' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Code postal</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.address?.postalCode || 'Non renseigné' }}</p>
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pays</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.address?.country || 'Non renseigné' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Contacts familiaux -->
                <div class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/30">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Contacts familiaux
                  </h3>
                  
                  <!-- Père -->
                  <div class="mb-6">
                    <h4 class="font-medium text-gray-900 dark:text-white mb-3">Père</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nom</label>
                        <p class="text-gray-900 dark:text-white">{{ student?.parentContact?.fatherName || 'Non renseigné' }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Téléphone</label>
                        <p class="text-gray-900 dark:text-white">{{ student?.parentContact?.fatherPhone || 'Non renseigné' }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                        <p class="text-gray-900 dark:text-white">{{ student?.parentContact?.fatherEmail || 'Non renseigné' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Mère -->
                  <div class="mb-6">
                    <h4 class="font-medium text-gray-900 dark:text-white mb-3">Mère</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nom</label>
                        <p class="text-gray-900 dark:text-white">{{ student?.parentContact?.motherName || 'Non renseigné' }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Téléphone</label>
                        <p class="text-gray-900 dark:text-white">{{ student?.parentContact?.motherPhone || 'Non renseigné' }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                        <p class="text-gray-900 dark:text-white">{{ student?.parentContact?.motherEmail || 'Non renseigné' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Tuteur légal -->
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white mb-3">Tuteur légal</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nom</label>
                        <p class="text-gray-900 dark:text-white">{{ student?.parentContact?.guardianName || 'Non renseigné' }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Téléphone</label>
                        <p class="text-gray-900 dark:text-white">{{ student?.parentContact?.guardianPhone || 'Non renseigné' }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                        <p class="text-gray-900 dark:text-white">{{ student?.parentContact?.guardianEmail || 'Non renseigné' }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Informations médicales -->
                <div v-if="hasMedicalInfo" class="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200/50 dark:border-red-700/30">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Informations médicales
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Groupe sanguin</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.medicalInfo?.bloodType || 'Non renseigné' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Contact d'urgence</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.medicalInfo?.emergencyContact || 'Non renseigné' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Allergies</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.medicalInfo?.allergies?.join(', ') || 'Aucune' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Médicaments</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.medicalInfo?.medications?.join(', ') || 'Aucun' }}</p>
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Besoins spéciaux</label>
                      <p class="text-gray-900 dark:text-white">{{ student?.medicalInfo?.specialNeeds || 'Aucun' }}</p>
                    </div>
                  </div>
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
import { computed } from 'vue'
import type { Student } from '@/types/student'

interface Props {
  show: boolean
  student: Student | null
}

const props = defineProps<Props>()

defineEmits<{
  close: []
  edit: [student: Student]
}>()

const studentInitials = computed(() => {
  if (!props.student) return ''
  return `${props.student.firstName?.charAt(0) || ''}${props.student.lastName?.charAt(0) || ''}`.toUpperCase()
})

const statusBadgeClass = computed(() => {
  const status = props.student?.academicInfo?.status
  const classes = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'transferred': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'graduated': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  }
  return classes[status as keyof typeof classes] || classes.inactive
})

const statusLabel = computed(() => {
  const status = props.student?.academicInfo?.status
  const labels = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'transferred': 'Transféré',
    'graduated': 'Diplômé'
  }
  return labels[status as keyof typeof labels] || 'Inconnu'
})

const genderLabel = computed(() => {
  const gender = props.student?.gender
  return gender === 'M' ? 'Masculin' : gender === 'F' ? 'Féminin' : 'Non spécifié'
})

const studentAge = computed(() => {
  if (!props.student?.dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(props.student.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
})

const hasMedicalInfo = computed(() => {
  const medicalInfo = props.student?.medicalInfo
  return medicalInfo && (
    medicalInfo.bloodType ||
    medicalInfo.emergencyContact ||
    medicalInfo.allergies?.length ||
    medicalInfo.medications?.length ||
    medicalInfo.specialNeeds
  )
})

function formatDate(dateString?: string): string {
  if (!dateString) return 'Non renseigné'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return 'Date invalide'
  }
}
</script> 