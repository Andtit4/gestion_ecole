<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="closeModal"
  >
    <div 
      class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ teacher ? 'Modifier le Professeur' : 'Ajouter un Nouveau Professeur' }}
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Informations personnelles -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prénom *
            </label>
            <input
              v-model="formData.firstName"
              type="text"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Entrez le prénom"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom *
            </label>
            <input
              v-model="formData.lastName"
              type="text"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Entrez le nom"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="professeur@ecole.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Matricule employé
            </label>
            <input
              v-model="formData.employeeId"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="EMP001"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genre
            </label>
            <select
              v-model="formData.gender"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Sélectionner le genre</option>
              <option value="male">Masculin</option>
              <option value="female">Féminin</option>
              <option value="other">Autre</option>
            </select>
          </div>

                      <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de naissance
              </label>
              <input
                v-model="formData.dateOfBirth"
                type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date d'embauche
            </label>
            <input
              v-model="formData.hireDate"
              type="date"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- Informations professionnelles -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Département
            </label>
            <input
              v-model="formData.department"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Mathématiques, Sciences, etc."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <select
              v-model="formData.status"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="on_leave">En congé</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type d'emploi
            </label>
            <select
              v-model="formData.employmentType"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="full_time">Temps plein</option>
              <option value="part_time">Temps partiel</option>
              <option value="contract">Contractuel</option>
              <option value="substitute">Remplaçant</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Salaire (€)
            </label>
            <input
              v-model.number="formData.salary"
              type="number"
              step="0.01"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="3000.00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Années d'expérience
            </label>
            <input
              v-model.number="formData.experience"
              type="number"
              min="0"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="5"
            />
          </div>
        </div>

        <!-- Matières enseignées -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Matières enseignées
          </label>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <input
                v-model="newSubject"
                type="text"
                class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Ajouter une matière"
                @keyup.enter="addSubject"
              />
              <button
                type="button"
                @click="addSubject"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Ajouter
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(subject, index) in formData.subjects"
                :key="index"
                class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {{ subject }}
                <button
                  type="button"
                  @click="removeSubject(index)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Adresse -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rue
            </label>
            <input
              v-model="formData.address.street"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="123 Rue de la République"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ville
            </label>
            <input
              v-model="formData.address.city"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Paris"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code postal
            </label>
            <input
              v-model="formData.address.zipCode"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="75001"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pays
            </label>
            <input
              v-model="formData.address.country"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="France"
            />
          </div>
        </div>

        <!-- Contact d'urgence -->
        <div class="border-t pt-4">
          <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Contact d'urgence</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du contact d'urgence
              </label>
              <input
                v-model="formData.emergencyContact"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Nom complet du contact d'urgence"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone d'urgence
              </label>
              <input
                v-model="formData.emergencyPhone"
                type="tel"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            @click="closeModal"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Traitement...' : (teacher ? 'Modifier' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { createTeacher, updateTeacher, getTeachers, getSubjects } from '@/services/academicService'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import type { Teacher, CreateTeacherDto } from '@/types/academic'

interface Props {
  show: boolean
  teacher?: Teacher | null
}

interface Emits {
  (e: 'close'): void
  (e: 'created', teacher: Teacher): void
  (e: 'updated', teacher: Teacher): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tenantStore = useCurrentTenantStore()
const loading = ref(false)
const newSubject = ref('')

const formData = ref<CreateTeacherDto>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  employeeId: '',
  gender: '',
  dateOfBirth: '',
  hireDate: '',
  department: '',
  status: 'active',
  employmentType: 'full-time',
  salary: 0,
  experience: 0,
  subjects: [],
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  emergencyContact: '',
  emergencyPhone: ''
})

const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    gender: '',
    dateOfBirth: '',
    hireDate: '',
    department: '',
    status: 'active',
    employmentType: 'full-time',
    salary: 0,
    experience: 0,
    subjects: [],
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    emergencyContact: '',
    emergencyPhone: ''
  }
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const addSubject = () => {
  if (newSubject.value.trim() && !formData.value.subjects.includes(newSubject.value.trim())) {
    formData.value.subjects.push(newSubject.value.trim())
    newSubject.value = ''
  }
}

const removeSubject = (index: number) => {
  formData.value.subjects.splice(index, 1)
}

const handleSubmit = async () => {
  if (loading.value) return

  if (!tenantStore.currentTenantId) {
    alert('Veuillez sélectionner un établissement avant de créer un professeur')
    return
  }

  try {
    loading.value = true

    if (props.teacher) {
      // Mode modification
      const updatedTeacher = await updateTeacher(props.teacher._id, formData.value, tenantStore.currentTenantId)
      emit('updated', updatedTeacher)
    } else {
      // Mode création
      const newTeacher = await createTeacher(formData.value, tenantStore.currentTenantId)
      emit('created', newTeacher)
    }

    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du professeur:', error)
    alert('Une erreur est survenue lors de la sauvegarde')
  } finally {
    loading.value = false
  }
}

// Watcher pour remplir le formulaire en mode modification
watch(() => props.teacher, (teacher) => {
  if (teacher) {
    formData.value = {
      firstName: teacher.firstName || '',
      lastName: teacher.lastName || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      employeeId: teacher.employeeId || '',
      gender: teacher.gender || '',
      dateOfBirth: teacher.dateOfBirth || '',
      hireDate: teacher.hireDate || '',
      department: teacher.department || '',
      status: teacher.status || 'active',
      employmentType: teacher.employmentType || 'full-time',
      salary: teacher.salary || 0,
      experience: teacher.experience || 0,
      subjects: [...(teacher.subjects || [])],
      address: {
        street: teacher.address?.street || '',
        city: teacher.address?.city || '',
        state: teacher.address?.state || '',
        zipCode: teacher.address?.zipCode || '',
        country: teacher.address?.country || ''
      },
      emergencyContact: teacher.emergencyContact || '',
      emergencyPhone: teacher.emergencyPhone || ''
    }
  }
}, { immediate: true })

watch(() => props.show, (show) => {
  if (!show) {
    resetForm()
  }
})
</script> 