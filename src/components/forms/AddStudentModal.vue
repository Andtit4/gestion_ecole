<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="relative w-full max-w-4xl transform rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-gray-800">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Ajouter un nouvel élève
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

        <!-- Vérification tenant -->
        <div v-if="!effectiveTenantId" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <span class="text-yellow-800 text-sm">Veuillez sélectionner un établissement avant de créer un élève.</span>
          </div>
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
                <div class="flex">
                  <input
                    v-model="form.studentNumber"
                    type="text"
                    required
                    class="flex-1 rounded-l-lg border border-r-0 border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    placeholder="Ex: STU20241234"
                  />
                                     <button
                     type="button"
                     @click="generateStudentNumberAuto"
                     class="rounded-r-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                   >
                     Auto
                   </button>
                </div>
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
            </div>
          </div>

          <!-- Adresse -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Adresse
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rue *
                </label>
                <input
                  v-model="form.address.street"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="123 Rue de la République"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ville *
                </label>
                <input
                  v-model="form.address.city"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Paris"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code postal *
                </label>
                <input
                  v-model="form.address.postalCode"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="75001"
                />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pays *
                </label>
                <input
                  v-model="form.address.country"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="France"
                />
              </div>
            </div>
          </div>

          <!-- Contact des parents -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Contact des parents/tuteurs
            </h4>
            
            <div class="space-y-4">
              <!-- Père -->
              <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">Père</h5>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    v-model="form.parentContact.fatherName"
                    type="text"
                    placeholder="Nom du père"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    v-model="form.parentContact.fatherPhone"
                    type="tel"
                    placeholder="Téléphone"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    v-model="form.parentContact.fatherEmail"
                    type="email"
                    placeholder="Email"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <!-- Mère -->
              <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">Mère</h5>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    v-model="form.parentContact.motherName"
                    type="text"
                    placeholder="Nom de la mère"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    v-model="form.parentContact.motherPhone"
                    type="tel"
                    placeholder="Téléphone"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    v-model="form.parentContact.motherEmail"
                    type="email"
                    placeholder="Email"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <!-- Tuteur -->
              <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">Tuteur légal (optionnel)</h5>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    v-model="form.parentContact.guardianName"
                    type="text"
                    placeholder="Nom du tuteur"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    v-model="form.parentContact.guardianPhone"
                    type="tel"
                    placeholder="Téléphone"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    v-model="form.parentContact.guardianEmail"
                    type="email"
                    placeholder="Email"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </div>
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
                   @change="updateClassInfo"
                   required
                    :disabled="loadingClasses"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                 >
                    <option value="">
                      {{ loadingClasses ? 'Chargement des classes...' : 'Sélectionner une classe' }}
                    </option>
                   <option v-for="classItem in availableClasses" :key="classItem.id" :value="classItem.name">
                      {{ classItem.name }} ({{ classItem.level }})
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
                  Niveau *
                </label>
                <input
                  v-model="form.academicInfo.level"
                  type="text"
                  required
                  readonly
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Niveau automatique"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Section
                </label>
                <input
                  v-model="form.academicInfo.section"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Ex: Sciences"
                />
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
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut *
                </label>
                <select
                  v-model="form.academicInfo.status"
                  required
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Sélectionner le statut</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="transferred">Transféré</option>
                  <option value="graduated">Diplômé</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Informations médicales (optionnel) -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informations médicales (optionnel)
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Allergies
                </label>
                <input
                  v-model="allergiesInput"
                  type="text"
                  @keydown.enter.prevent="addAllergy"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Tapez et appuyez sur Entrée"
                />
                <div v-if="form.medicalInfo?.allergies?.length" class="flex flex-wrap gap-2 mt-2">
                  <span
                    v-for="(allergy, index) in form.medicalInfo.allergies"
                    :key="index"
                    class="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm dark:bg-red-900 dark:text-red-200"
                  >
                    {{ allergy }}
                    <button type="button" @click="removeAllergy(index)" class="text-red-600 hover:text-red-800">×</button>
                  </span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Médicaments
                </label>
                <input
                  v-model="medicationsInput"
                  type="text"
                  @keydown.enter.prevent="addMedication"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Tapez et appuyez sur Entrée"
                />
                <div v-if="form.medicalInfo?.medications?.length" class="flex flex-wrap gap-2 mt-2">
                  <span
                    v-for="(medication, index) in form.medicalInfo.medications"
                    :key="index"
                    class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200"
                  >
                    {{ medication }}
                    <button type="button" @click="removeMedication(index)" class="text-blue-600 hover:text-blue-800">×</button>
                  </span>
                </div>
              </div>
              
                             <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Contact d'urgence
                 </label>
                 <input
                   v-model="form.medicalInfo!.emergencyContact"
                   type="text"
                   class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                   placeholder="Nom et téléphone"
                 />
               </div>
               
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Groupe sanguin
                 </label>
                 <select
                   v-model="form.medicalInfo!.bloodType"
                   class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                 >
                   <option value="">Sélectionner</option>
                   <option value="A+">A+</option>
                   <option value="A-">A-</option>
                   <option value="B+">B+</option>
                   <option value="B-">B-</option>
                   <option value="AB+">AB+</option>
                   <option value="AB-">AB-</option>
                   <option value="O+">O+</option>
                   <option value="O-">O-</option>
                 </select>
               </div>
               
               <div class="md:col-span-2">
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Besoins spéciaux
                 </label>
                 <textarea
                   v-model="form.medicalInfo!.specialNeeds"
                   rows="3"
                   class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                   placeholder="Décrivez tout besoin spécial ou remarque importante..."
                 ></textarea>
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
              :disabled="loading || !effectiveTenantId"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Création...
              </span>
              <span v-else>Créer l'élève</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import type { CreateStudentDto } from '@/types/student'
import type { Class } from '@/types/academic'
import { generateStudentNumber } from '@/services/studentService'

interface Props {
  isOpen: boolean
  tenantId?: string
  tenantName?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', student: CreateStudentDto): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tenantStore = useCurrentTenantStore()
const loading = ref(false)
const allergiesInput = ref('')
const medicationsInput = ref('')

// Computed pour l'ID et le nom du tenant (utilise les props si fournis, sinon le store)
const effectiveTenantId = computed(() => props.tenantId || tenantStore.currentTenantId)
const effectiveTenantName = computed(() => props.tenantName || tenantStore.currentTenantName)

// Initialiser le formulaire
const initForm = (): CreateStudentDto => ({
  firstName: '',
  lastName: '',
  studentNumber: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '' as 'M' | 'F',
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
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'active' as const
  },
  medicalInfo: {
    allergies: [],
    medications: [],
    emergencyContact: '',
    bloodType: '',
    specialNeeds: ''
  }
})

const form = reactive<CreateStudentDto>(initForm())

// Générer un numéro d'élève automatique
const generateStudentNumberAuto = () => {
  form.studentNumber = generateStudentNumber()
}

// Classes disponibles - chargées dynamiquement depuis l'API
const availableClasses = ref<Array<{ id: string; name: string; level: string }>>([])
const loadingClasses = ref(false)

// Charger les classes depuis l'API académique
const loadClasses = async () => {
  if (!effectiveTenantId.value) return
  
  loadingClasses.value = true
  try {
    // Import du service académique
    const { fetchClasses } = await import('@/services/academicService')
    const classes = await fetchClasses(effectiveTenantId.value)
    
    // Transformer les données pour le composant
    availableClasses.value = classes.map((classItem: Class) => ({
      id: classItem._id,
      name: classItem.name,
      level: classItem.level || 'Non défini'
    }))
    
    console.log('✅ Classes chargées:', availableClasses.value.length)
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
    const selectedClass = availableClasses.value.find(c => c.name === form.academicInfo.className)
    if (selectedClass) {
      form.academicInfo.level = selectedClass.level
      form.academicInfo.classId = selectedClass.id
    }
  }
}

// Gestion des allergies
const addAllergy = () => {
  if (allergiesInput.value.trim()) {
    if (!form.medicalInfo) {
      form.medicalInfo = { 
        allergies: [], 
        medications: [],
        emergencyContact: '',
        bloodType: '',
        specialNeeds: ''
      }
    }
    if (!form.medicalInfo.allergies) {
      form.medicalInfo.allergies = []
    }
    form.medicalInfo.allergies.push(allergiesInput.value.trim())
    allergiesInput.value = ''
  }
}

const removeAllergy = (index: number) => {
  if (form.medicalInfo?.allergies) {
    form.medicalInfo.allergies.splice(index, 1)
  }
}

// Gestion des médicaments
const addMedication = () => {
  if (medicationsInput.value.trim()) {
    if (!form.medicalInfo) {
      form.medicalInfo = { 
        allergies: [], 
        medications: [],
        emergencyContact: '',
        bloodType: '',
        specialNeeds: ''
      }
    }
    if (!form.medicalInfo.medications) {
      form.medicalInfo.medications = []
    }
    form.medicalInfo.medications.push(medicationsInput.value.trim())
    medicationsInput.value = ''
  }
}

const removeMedication = (index: number) => {
  if (form.medicalInfo?.medications) {
    form.medicalInfo.medications.splice(index, 1)
  }
}

// Soumettre le formulaire
const handleSubmit = async () => {
  if (!effectiveTenantId.value) {
    alert('Veuillez sélectionner un établissement avant de créer un élève')
    return
  }

  // Vérifications de base côté frontend
  if (!form.firstName.trim()) {
    alert('Le prénom est requis')
    return
  }
  if (!form.lastName.trim()) {
    alert('Le nom est requis')
    return
  }
  if (!form.email.trim()) {
    alert('L\'email est requis')
    return
  }
  // Validation simple de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email.trim())) {
    alert('L\'email n\'est pas valide')
    return
  }
  if (!form.dateOfBirth) {
    alert('La date de naissance est requise')
    return
  }
  if (!form.gender) {
    alert('Le genre est requis')
    return
  }
  if (!form.academicInfo.className) {
    alert('La classe est requise')
    return
  }

  loading.value = true
  try {
    // Créer une copie des données à envoyer
    const submitData = { ...form }
    
    // Nettoyer les champs vides dans parentContact
    const cleanedParentContact = { ...submitData.parentContact }
    
    // Fonction utilitaire pour nettoyer les champs vides/null/undefined
    const cleanField = (obj: Record<string, unknown>, field: string) => {
      if (!obj[field] || obj[field] === '' || obj[field] === null || obj[field] === undefined || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
        delete obj[field]
    }
    }
    
    // Nettoyer tous les champs optionnels
    cleanField(cleanedParentContact, 'fatherName')
    cleanField(cleanedParentContact, 'fatherPhone')
    cleanField(cleanedParentContact, 'fatherEmail')
    cleanField(cleanedParentContact, 'motherName')
    cleanField(cleanedParentContact, 'motherPhone')
    cleanField(cleanedParentContact, 'motherEmail')
    cleanField(cleanedParentContact, 'guardianName')
    cleanField(cleanedParentContact, 'guardianPhone')
    cleanField(cleanedParentContact, 'guardianEmail')
    
    submitData.parentContact = cleanedParentContact
    
    // Nettoyer le téléphone personnel s'il est vide
    cleanField(submitData, 'phone')
    
    // Nettoyer la section si elle est vide
    cleanField(submitData.academicInfo, 'section')

    // Nettoyer les données médicales si elles sont vides
    if (submitData.medicalInfo) {
      cleanField(submitData.medicalInfo, 'emergencyContact')
      cleanField(submitData.medicalInfo, 'bloodType')
      cleanField(submitData.medicalInfo, 'specialNeeds')
      
      // Si toutes les données médicales sont vides, supprimer l'objet entier
      if (!submitData.medicalInfo.allergies?.length && 
        !submitData.medicalInfo.medications?.length &&
        !submitData.medicalInfo.emergencyContact &&
        !submitData.medicalInfo.bloodType &&
        !submitData.medicalInfo.specialNeeds) {
      delete submitData.medicalInfo
      }
    }

    console.log('Données à envoyer:', JSON.stringify(submitData, null, 2))
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

// Réinitialiser le formulaire quand le modal se ferme
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Charger les classes quand le modal s'ouvre
    loadClasses()
  } else {
    Object.assign(form, initForm())
    allergiesInput.value = ''
    medicationsInput.value = ''
    loading.value = false
  }
})

// Charger les classes aussi quand le tenant change
watch(() => effectiveTenantId.value, (newTenantId) => {
  if (newTenantId && props.isOpen) {
    loadClasses()
  }
})
</script>