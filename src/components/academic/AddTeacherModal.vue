<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-4 mx-auto p-0 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-2xl bg-white dark:bg-gray-800 max-h-[95vh] overflow-hidden">
      <!-- En-tête fixe -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between p-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ teacher ? 'Modifier le professeur' : 'Nouveau professeur' }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ajoutez les informations personnelles et professionnelles du professeur
            </p>
          </div>
          <button
            @click="closeModal"
            class="rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 p-2 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenu avec scroll -->
      <div class="overflow-y-auto max-h-[calc(95vh-140px)]">
        <form @submit.prevent="handleSubmit" class="p-6 space-y-8">
          
          <!-- Section 1: Informations personnelles -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <div class="flex items-center mb-6">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">Informations personnelles</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Détails personnels du professeur</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Prénom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prénom *
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Prénom du professeur"
                />
              </div>

              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom *
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Nom de famille"
                />
              </div>

              <!-- Genre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Genre
                </label>
                <select
                  v-model="form.gender"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Sélectionner</option>
                  <option value="male">Masculin</option>
                  <option value="female">Féminin</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="professeur@exemple.com"
                />
              </div>

              <!-- Téléphone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Téléphone
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <!-- Date de naissance -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de naissance
                </label>
                <input
                  v-model="form.dateOfBirth"
                  type="date"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <!-- Adresse -->
            <div class="mt-6">
              <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Adresse</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="lg:col-span-2">
                  <input
                    v-model="form.address.street"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Rue et numéro"
                  />
                </div>
                <div>
                  <input
                    v-model="form.address.city"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Ville"
                  />
                </div>
                <div>
                  <input
                    v-model="form.address.zipCode"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Code postal"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Informations professionnelles -->
          <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
            <div class="flex items-center mb-6">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">Informations professionnelles</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Détails de l'emploi et qualification</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- ID Employé -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID Employé *
                </label>
                <div class="relative">
                  <input
                    v-model="form.employeeId"
                    type="text"
                    required
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-12"
                    placeholder="EMP001"
                  />
                  <button
                    type="button"
                    @click="generateEmployeeId"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    title="Générer automatiquement"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Date d'embauche -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date d'embauche
                </label>
                <input
                  v-model="form.hireDate"
                  type="date"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <!-- Statut -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut
                </label>
                <select
                  v-model="form.status"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>

              <!-- Type d'emploi -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type d'emploi
                </label>
                <select
                  v-model="form.employmentType"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="full-time">Temps plein</option>
                  <option value="part-time">Temps partiel</option>
                  <option value="contract">Contractuel</option>
                </select>
              </div>

              <!-- Département -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Département
                </label>
                <input
                  v-model="form.department"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Mathématiques, Lettres..."
                />
              </div>

              <!-- Expérience -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expérience (années)
                </label>
                <input
                  v-model.number="form.experience"
                  type="number"
                  min="0"
                  max="50"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                />
              </div>

              <!-- Salaire -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salaire (optionnel)
                </label>
                <div class="relative">
                  <input
                    v-model.number="form.salary"
                    type="number"
                    min="0"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-12"
                    placeholder="50000"
                  />
                  <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">€</span>
                </div>
              </div>

              <!-- Spécialisation -->
              <div class="md:col-span-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Spécialisation
                </label>
                <input
                  v-model="form.specialization"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Algèbre, Littérature..."
                />
              </div>
            </div>

            <!-- Formation -->
            <div class="mt-6">
              <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Formation</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <input
                    v-model="form.education.degree"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Master, Doctorat..."
                  />
                </div>
                <div>
                  <input
                    v-model="form.education.field"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Domaine d'étude"
                  />
                </div>
                <div>
                  <input
                    v-model="form.education.institution"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Université/École"
                  />
                </div>
                <div>
                  <input
                    v-model.number="form.education.year"
                    type="number"
                    min="1950"
                    :max="new Date().getFullYear()"
                    class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Année"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Matières et assignations -->
          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
            <div class="flex items-center mb-6">
              <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">Matières enseignées</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Sélectionnez les matières que ce professeur enseigne</p>
              </div>
            </div>

            <div class="space-y-6">
              <!-- Sélection des matières -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Matières disponibles
                </label>
                
                <div v-if="subjects.length === 0" class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  <p class="text-sm">Aucune matière disponible</p>
                  <p class="text-xs text-gray-400 mt-1">Créez d'abord des matières dans la gestion académique</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label
                    v-for="subject in subjects"
                    :key="subject._id"
                    class="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    :class="{
                      'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600': form.subjects.includes(subject._id)
                    }"
                  >
                    <input
                      type="checkbox"
                      :value="subject._id"
                      v-model="form.subjects"
                      class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <div class="ml-3 flex-1">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ subject.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ subject.code }}</div>
                    </div>
                    <div 
                      v-if="subject.color"
                      class="w-4 h-4 rounded-full ml-2"
                      :style="{ backgroundColor: subject.color }"
                    ></div>
                  </label>
                </div>

                <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <strong>{{ form.subjects?.length || 0 }}</strong> matière(s) sélectionnée(s)
                </div>
              </div>

              <!-- Assignations classe-matière (si le professeur a des matières) -->
              <div v-if="form.subjects.length > 0" class="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Assignations classe-matière (optionnel)
                </h5>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Vous pourrez assigner ce professeur à des classes spécifiques après sa création
                </p>

                <!-- Aperçu des matières sélectionnées -->
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="subjectId in form.subjects"
                    :key="subjectId"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {{ getSubjectName(subjectId) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Contact d'urgence -->
          <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6">
            <div class="flex items-center mb-6">
              <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">Contact d'urgence</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Personne à contacter en cas d'urgence</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom du contact
                </label>
                <input
                  v-model="form.emergencyContact"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Nom et prénom"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Téléphone d'urgence
                </label>
                <input
                  v-model="form.emergencyPhone"
                  type="tel"
                  class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>

        </form>
      </div>

      <!-- Boutons d'action fixes -->
      <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Les champs marqués d'un * sont obligatoires
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              @click="handleSubmit"
              :disabled="loading"
              class="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Création...' : (teacher ? 'Modifier' : 'Créer le professeur') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import { createSubject } from '@/services/academicService'
import type { CreateTeacherDto, Subject, Teacher, CreateSubjectDto } from '@/types/academic'

interface Props {
  show: boolean
  teacher?: Teacher | null
  subjects: Subject[]
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', teacherData: CreateTeacherDto): void
  (e: 'subjectsCreated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tenantStore = useCurrentTenantStore()
const loading = ref(false)
const creatingSubjects = ref(false)

const initForm = (): CreateTeacherDto => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  employeeId: '',
  hireDate: new Date().toISOString().split('T')[0],
  status: 'active',
  subjects: [],
  education: {
    degree: '',
    field: '',
    institution: '',
    year: undefined
  },
  experience: 0,
  salary: undefined,
  employmentType: 'full-time',
  department: '',
  specialization: '',
  emergencyContact: '',
  emergencyPhone: ''
})

const form = reactive<CreateTeacherDto>(initForm())

// Matières par défaut à créer
const defaultSubjects: CreateSubjectDto[] = [
  { name: 'Mathématiques', code: 'MATH', description: 'Mathématiques générales', credits: 4, color: '#3B82F6' },
  { name: 'Français', code: 'FR', description: 'Langue française et littérature', credits: 4, color: '#EF4444' },
  { name: 'Histoire-Géographie', code: 'HG', description: 'Histoire et géographie', credits: 3, color: '#F59E0B' },
  { name: 'Sciences Physiques', code: 'PC', description: 'Physique et chimie', credits: 3, color: '#10B981' },
  { name: 'Sciences de la Vie et de la Terre', code: 'SVT', description: 'Biologie et géologie', credits: 3, color: '#22C55E' },
  { name: 'Anglais', code: 'ANG', description: 'Langue anglaise', credits: 3, color: '#6366F1' },
  { name: 'Éducation Physique et Sportive', code: 'EPS', description: 'Sport et activités physiques', credits: 2, color: '#8B5CF6' },
  { name: 'Arts Plastiques', code: 'ART', description: 'Arts visuels et créatifs', credits: 2, color: '#EC4899' },
  { name: 'Musique', code: 'MUS', description: 'Éducation musicale', credits: 2, color: '#F97316' },
  { name: 'Technologie', code: 'TECH', description: 'Sciences et technologie', credits: 2, color: '#06B6D4' }
]

// Créer les matières par défaut
const createDefaultSubjects = async () => {
  if (!tenantStore.currentTenantId) {
    alert('Veuillez sélectionner un établissement')
    return
  }

  creatingSubjects.value = true
  try {
    const createdSubjects = []
    for (const subjectData of defaultSubjects) {
      try {
        const subject = await createSubject(subjectData, tenantStore.currentTenantId)
        createdSubjects.push(subject)
      } catch (error) {
        console.warn(`Matière ${subjectData.name} peut-être déjà existante:`, error)
      }
    }
    
    if (createdSubjects.length > 0) {
      alert(`${createdSubjects.length} matière(s) créée(s) avec succès !`)
      emit('subjectsCreated')
    } else {
      alert('Les matières existent peut-être déjà. Veuillez vérifier la gestion des matières.')
    }
  } catch (error) {
    console.error('Erreur lors de la création des matières:', error)
    alert('Erreur lors de la création des matières')
  } finally {
    creatingSubjects.value = false
  }
}

// Générer un ID employé automatique
const generateEmployeeId = () => {
  const timestamp = Date.now().toString().slice(-6)
  form.employeeId = `PROF${timestamp}`
}

// Obtenir le nom d'une matière par son ID
const getSubjectName = (subjectId: string): string => {
  const subject = props.subjects.find(s => s._id === subjectId)
  return subject ? subject.name : 'Matière inconnue'
}

// Soumettre le formulaire
const handleSubmit = async () => {
  if (!tenantStore.currentTenantId) {
    alert('Veuillez sélectionner un établissement avant de créer un professeur')
    return
  }

  loading.value = true
  try {
    // Nettoyer les données avant envoi
    const submitData = { ...form }
    
    // Supprimer les champs vides
    if (!submitData.phone?.trim()) delete submitData.phone
    if (!submitData.dateOfBirth?.trim()) delete submitData.dateOfBirth
    if (!submitData.gender?.trim()) delete submitData.gender
    if (!submitData.department?.trim()) delete submitData.department
    if (!submitData.specialization?.trim()) delete submitData.specialization
    if (!submitData.emergencyContact?.trim()) delete submitData.emergencyContact
    if (!submitData.emergencyPhone?.trim()) delete submitData.emergencyPhone
    
    // Nettoyer l'adresse
    const hasAddress = Object.values(submitData.address || {}).some(value => value?.trim())
    if (!hasAddress) {
      delete submitData.address
    }
    
    // Nettoyer l'éducation
    const hasEducation = Object.values(submitData.education || {}).some(value => value)
    if (!hasEducation) {
      delete submitData.education
    }
    
    if (!submitData.subjects?.length) {
      delete submitData.subjects
    }
    
    console.log('Données professeur à envoyer:', JSON.stringify(submitData, null, 2))
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
watch(() => props.show, (show) => {
  if (!show) {
    Object.assign(form, initForm())
    loading.value = false
  } else if (props.teacher) {
    // Pré-remplir le formulaire en mode modification
    Object.assign(form, {
      ...props.teacher,
      subjects: Array.isArray(props.teacher.subjects) ? 
        props.teacher.subjects.map(s => typeof s === 'string' ? s : s._id) : 
        [],
      dateOfBirth: props.teacher.dateOfBirth ? new Date(props.teacher.dateOfBirth).toISOString().split('T')[0] : '',
      hireDate: props.teacher.hireDate ? new Date(props.teacher.hireDate).toISOString().split('T')[0] : '',
      address: props.teacher.address || initForm().address,
      education: props.teacher.education || initForm().education
    })
  }
})
</script> 