<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click="closeModal"
  >
    <div 
      class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ user ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur' }}
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
        <!-- Informations de base -->
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
              placeholder="utilisateur@ecole.com"
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
        </div>

        <!-- Rôle et statut -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rôle *
            </label>
            <select
              v-model="formData.role"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Sélectionner un rôle</option>
              <option value="admin">Administrateur</option>
              <option value="student">Élève</option>
              <option value="parent">Parent</option>
            </select>
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
              <option value="suspended">Suspendu</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>

        <!-- Champs conditionnels selon le rôle -->
        <div v-if="formData.role === 'admin'">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Département
            </label>
            <input
              v-model="formData.department"
              type="text"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Direction, Administration, etc."
            />
          </div>
        </div>

        <div v-if="formData.role === 'student'">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Classe
              </label>
              <input
                v-model="formData.class"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="6ème A, CP, etc."
              />
            </div>


          </div>
        </div>

        <div v-if="formData.role === 'parent'">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enfants (optionnel)
            </label>
            <textarea
              v-model="formData.children"
              rows="2"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Noms des enfants ou IDs des élèves"
            ></textarea>
          </div>
        </div>

        <!-- Adresse -->
        <div>
          <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Adresse</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rue
              </label>
              <input
                v-model="formData.address.street"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="123 rue de la Paix"
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
                v-model="formData.address.postalCode"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="75001"
              />
            </div>

            <div class="md:col-span-2">
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
        </div>

        <!-- Permissions (pour admin) -->
        <div v-if="formData.role === 'admin'" class="border-t pt-4">
          <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Permissions</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <label
              v-for="permission in availablePermissions"
              :key="permission.value"
              class="flex items-center space-x-2 text-sm"
            >
              <input
                type="checkbox"
                :value="permission.value"
                v-model="formData.permissions"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-gray-700 dark:text-gray-300">{{ permission.label }}</span>
            </label>
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
            {{ loading ? 'Traitement...' : (user ? 'Modifier' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { User } from '@/types/tenant'

interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  status: string
  department?: string
  class?: string
  children?: string
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  permissions: string[]
}

interface Props {
  show: boolean
  user?: User | null
}

interface Emits {
  (e: 'close'): void
  (e: 'created', userData: CreateUserData): void
  (e: 'updated', id: string, userData: Partial<CreateUserData>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)

const formData = ref<CreateUserData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  status: 'active',
  department: '',
  class: '',
  children: '',
  address: {
    street: '',
    city: '',
    postalCode: '',
    country: 'France'
  },
  permissions: []
})

const availablePermissions = [
  { value: 'view_students', label: 'Voir les élèves' },
  { value: 'create_students', label: 'Créer des élèves' },
  { value: 'manage_settings', label: 'Gérer les paramètres' },
  { value: 'manage_users', label: 'Gérer les utilisateurs' },
  { value: 'view_grades', label: 'Voir les notes' },
  { value: 'create_grades', label: 'Créer des notes' },
  { value: 'view_teachers', label: 'Voir les professeurs' },
  { value: 'send_messages', label: 'Envoyer des messages' },
  { value: 'view_schedule', label: 'Voir l\'emploi du temps' }
]

const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    status: 'active',
    department: '',
    class: '',
    children: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    permissions: []
  }
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const handleSubmit = async () => {
  if (loading.value) return

  try {
    loading.value = true

    // Préparer les données pour l'API
    const userData: any = {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      role: formData.value.role,
      status: formData.value.status,
      permissions: formData.value.permissions
    }

    // Ajouter les champs optionnels s'ils sont remplis
    if (formData.value.phone) userData.phone = formData.value.phone
    if (formData.value.department) userData.department = formData.value.department
    if (formData.value.class) userData.class = formData.value.class
    
    // Gérer les enfants pour les parents
    if (formData.value.children && formData.value.role === 'parent') {
      userData.childrenIds = formData.value.children.split(',').map(id => id.trim()).filter(id => id)
    }

    // Gérer l'adresse seulement si au moins un champ est rempli
    if (formData.value.address.street || formData.value.address.city || formData.value.address.postalCode) {
      userData.address = formData.value.address
    }

    if (props.user) {
      emit('updated', props.user.id, userData)
    } else {
      emit('created', userData)
    }

    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error)
    alert('Une erreur est survenue lors de la sauvegarde')
  } finally {
    loading.value = false
  }
}

// Watcher pour remplir le formulaire en mode modification
watch(() => props.user, (user) => {
  if (user) {
    formData.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || '',
      status: user.status || 'active',
      department: user.department || '',
      class: user.class || '',
      children: user.childrenIds?.join(', ') || '', // Convertir les IDs en string
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || 'France'
      },
      permissions: user.permissions || []
    }
  }
}, { immediate: true })

watch(() => props.show, (show) => {
  if (!show) {
    resetForm()
  }
})
</script> 