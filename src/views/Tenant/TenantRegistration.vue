<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <div class="mx-auto max-w-6xl">
      <!-- En-tête moderne avec gradient -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white mb-8">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="relative px-8 py-12 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h1 class="text-4xl font-bold mb-4">
            Créez votre établissement scolaire
          </h1>
          <p class="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Rejoignez des milliers d'établissements qui nous font confiance pour gérer leur administration scolaire
          </p>
          
          <!-- Progress bar moderne -->
          <div class="flex justify-center">
            <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <div v-for="(step, index) in steps" :key="index" class="flex items-center">
                <div :class="[
                  'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300',
                  currentStep > index 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : currentStep === index 
                      ? 'bg-white text-blue-600 shadow-lg scale-110' 
                      : 'bg-white/30 text-white/70'
                ]">
                  <svg v-if="currentStep > index" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div v-if="index < steps.length - 1" class="w-8 h-0.5 bg-white/30 mx-2"></div>
              </div>
            </div>
          </div>
          
          <!-- Étapes texte -->
          <div class="flex justify-center mt-4">
            <div class="text-sm text-blue-100">
              Étape {{ currentStep + 1 }} sur {{ steps.length }} : {{ steps[currentStep]?.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire principal avec design moderne -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <form @submit.prevent="handleSubmit" class="p-8 lg:p-12">
          
          <!-- Étape 1: Informations établissement -->
          <div v-if="currentStep === 0" class="space-y-8">
            <div class="text-center pb-6 border-b border-stroke dark:border-strokedark">
              <h2 class="text-2xl font-bold text-black dark:text-white mb-2">
                Informations de l'établissement
              </h2>
              <p class="text-meta-4 dark:text-meta-5">
                Renseignez les informations principales de votre établissement
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Colonne gauche -->
              <div class="space-y-6">
                <div class="group">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"/>
                      </svg>
                      Nom de l'établissement *
                    </span>
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200 placeholder-gray-400"
                    placeholder="Ex: Lycée Saint-Joseph"
                  />
                </div>

                <div class="group">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"/>
                      </svg>
                      Nom de domaine *
                    </span>
                  </label>
                  <div class="flex rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 focus-within:border-blue-500 transition-colors">
                    <input
                      v-model="formData.domain"
                      type="text"
                      required
                      @input="checkDomainAvailability"
                      class="flex-1 px-4 py-4 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200 placeholder-gray-400 border-none outline-none"
                      placeholder="mon-ecole"
                    />
                    <span class="px-4 py-4 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium">
                      .schools.com
                    </span>
                  </div>
                  <div v-if="domainCheckStatus" class="mt-2 text-sm flex items-center" :class="domainCheckStatus.available ? 'text-green-600' : 'text-red-600'">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="domainCheckStatus.available" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    {{ domainCheckStatus.message }}
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                      </svg>
                      Email de contact *
                    </span>
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200 placeholder-gray-400"
                    placeholder="contact@mon-ecole.fr"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      Téléphone
                    </span>
                  </label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200 placeholder-gray-400"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>

              <!-- Colonne droite -->
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      Type d'établissement *
                    </span>
                  </label>
                  <select
                    v-model="formData.settings.schoolType"
                    required
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="primary">🎒 École Primaire</option>
                    <option value="secondary">🎓 Collège/Lycée</option>
                    <option value="university">🏛️ Université</option>
                    <option value="mixed">🏫 Établissement Mixte</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                      Système de notation *
                    </span>
                  </label>
                  <select
                    v-model="formData.settings.gradeSystem"
                    required
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200"
                  >
                    <option value="">Sélectionnez un système</option>
                    <option value="numeric">📊 Numérique (0-20)</option>
                    <option value="letter">🔤 Lettres (A-F)</option>
                    <option value="points">💯 Points (0-100)</option>
                  </select>
                </div>

                <div v-if="formData.settings.gradeSystem === 'numeric'" class="group">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                      </svg>
                      Note maximale
                    </span>
                  </label>
                  <input
                    v-model.number="formData.settings.maxGrade"
                    type="number"
                    min="1"
                    max="100"
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200 placeholder-gray-400"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                      </svg>
                      Langue principale *
                    </span>
                  </label>
                  <select
                    v-model="formData.settings.language"
                    required
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200"
                  >
                    <option value="fr">🇫🇷 Français</option>
                    <option value="en">🇬🇧 Anglais</option>
                    <option value="es">🇪🇸 Espagnol</option>
                    <option value="de">🇩🇪 Allemand</option>
                  </select>
                </div>

                <!-- Info box moderne -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <div class="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                        💡 Bon à savoir
                      </h4>
                      <p class="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                        Ces paramètres pourront être modifiés ultérieurement dans les réglages de votre établissement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 2: Administrateur -->
          <div v-if="currentStep === 1" class="p-8 lg:p-12">
            <!-- En-tête section -->
            <div class="text-center mb-10">
              <div class="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4">
                <svg class="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Compte administrateur
              </h2>
              <p class="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Créez le compte de l'administrateur principal qui gérera votre établissement
              </p>
            </div>

            <div class="max-w-3xl mx-auto space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Prénom -->
                <div class="group">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      Prénom *
                    </span>
                  </label>
                  <input
                    v-model="formData.admin.firstName"
                    type="text"
                    required
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-green-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200 placeholder-gray-400"
                    placeholder="Jean"
                  />
                </div>

                <!-- Nom -->
                <div class="group">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      Nom *
                    </span>
                  </label>
                  <input
                    v-model="formData.admin.lastName"
                    type="text"
                    required
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-green-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200 placeholder-gray-400"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="group">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                    Email administrateur *
                  </span>
                </label>
                <input
                  v-model="formData.admin.email"
                  type="email"
                  required
                  @input="checkEmailAvailability"
                  class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-green-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200 placeholder-gray-400"
                  placeholder="admin@mon-ecole.fr"
                />
                <div v-if="emailCheckStatus" class="mt-2 text-sm flex items-center" :class="emailCheckStatus.available ? 'text-green-600' : 'text-red-600'">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="emailCheckStatus.available" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  {{ emailCheckStatus.message }}
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Téléphone -->
                <div class="group">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      Téléphone
                    </span>
                  </label>
                  <input
                    v-model="formData.admin.phone"
                    type="tel"
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-green-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200 placeholder-gray-400"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <!-- Titre -->
                <div class="group">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V9a2 2 0 11-4 0V6m4 0H8m5 5v.01M8 19l4 2 4-2m-4-2v2m0-6V9"/>
                      </svg>
                      Titre/Fonction
                    </span>
                  </label>
                  <input
                    v-model="formData.admin.title"
                    type="text"
                    class="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:border-green-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all duration-200 placeholder-gray-400"
                    placeholder="Directeur, Principal..."
                  />
                </div>
              </div>

              <!-- Info box moderne -->
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl">
                      <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                      🔐 Identifiants automatiques
                    </h4>
                    <p class="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                      Nous générerons automatiquement un nom d'utilisateur et un mot de passe sécurisé pour ce compte administrateur. Vous les recevrez à la fin de l'inscription.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 3: Plan d'abonnement -->
          <div v-if="currentStep === 2" class="p-8 lg:p-12">
            <!-- En-tête section -->
            <div class="text-center mb-10">
              <div class="inline-flex items-center justify-center w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4">
                <svg class="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Choisissez votre plan
              </h2>
              <p class="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Sélectionnez le plan qui correspond le mieux aux besoins de votre établissement
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                v-for="(plan, index) in availablePlans" 
                :key="plan.key"
                @click="selectPlan(plan)"
                :class="[
                  'relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 transform hover:-translate-y-1',
                  selectedPlan === plan.key 
                    ? 'border-blue-500 shadow-xl shadow-blue-100 dark:shadow-blue-900/20 bg-blue-50 dark:bg-blue-900/10' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg bg-white dark:bg-gray-800'
                ]"
              >
                <div v-if="plan.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span class="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg">
                    ⭐ Populaire
                  </span>
                </div>

                <!-- Icône du plan -->
                <div class="flex justify-center mb-4">
                  <div :class="getPlanIconStyle(index)" class="w-14 h-14 rounded-full flex items-center justify-center">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getPlanIcon(plan.key)"/>
                    </svg>
                  </div>
                </div>

                <div class="text-center">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {{ plan.name }}
                  </h3>
                  <div class="mb-4">
                    <span class="text-3xl font-bold text-gray-900 dark:text-white">
                      {{ plan.monthlyPrice }}€
                    </span>
                    <span class="text-gray-500 dark:text-gray-400 text-base">/mois</span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 min-h-[2rem] flex items-center justify-center">
                    {{ plan.description }}
                  </p>
                  
                  <ul class="space-y-2 text-sm mb-6 text-left">
                    <li v-for="feature in plan.features" :key="feature" class="flex items-start">
                      <div class="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg class="w-2.5 h-2.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span class="text-gray-700 dark:text-gray-300 leading-tight">{{ feature }}</span>
                    </li>
                  </ul>

                  <!-- Bouton de sélection -->
                  <button 
                    type="button"
                    :class="[
                      'w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 border-2',
                      selectedPlan === plan.key 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-md' 
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    ]"
                  >
                    {{ selectedPlan === plan.key ? '✓ Sélectionné' : 'Choisir ce plan' }}
                  </button>
                </div>

                <!-- Badge de sélection -->
                <div v-if="selectedPlan === plan.key" class="absolute top-4 right-4">
                  <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex justify-between items-center pt-8 border-t border-stroke dark:border-strokedark">
            <button
              v-if="currentStep > 0"
              type="button"
              @click="previousStep"
              class="flex items-center px-6 py-3 border border-stroke dark:border-strokedark rounded-lg text-black dark:text-white hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Précédent
            </button>
            <div v-else></div>
            
            <div class="flex items-center space-x-4">
              <div class="text-sm text-meta-4 dark:text-meta-5">
                Étape {{ currentStep + 1 }} sur {{ steps.length }}
              </div>
              
              <button
                v-if="currentStep < steps.length - 1"
                type="button"
                @click="nextStep"
                :disabled="!canProceed"
                class="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              
              <button
                v-else
                type="submit"
                :disabled="loading || !isFormValid"
                class="flex items-center px-8 py-3 bg-success text-white rounded-lg hover:bg-success/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création en cours...
                </span>
                <span v-else>
                  Créer l'établissement
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de succès -->
    <RegistrationSuccess 
      v-if="showSuccessModal"
      :tenant-name="formData.name"
      :credentials="{ 
        domain: formData.domain, 
        username: adminCredentials?.username || '', 
        password: adminCredentials?.password || '' 
      }"
      @close="showSuccessModal = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import RegistrationSuccess from '@/components/tenant/RegistrationSuccess.vue'
import tenantService from '@/services/tenantService'
import { 
  SubscriptionPlan 
} from '@/types/tenant'
import type { 
  CreateTenantDto, 
  CreateTenantResponse,
  CreateAdminDto 
} from '@/types/tenant'

const router = useRouter()
const currentPageTitle = ref('Inscription Établissement')

// État du formulaire multi-étapes
const currentStep = ref(0)
const loading = ref(false)
const showSuccessModal = ref(false)
const adminCredentials = ref<{ username: string, password: string } | null>(null)

// Validation de disponibilité
const domainCheckStatus = ref<{ available: boolean, message: string } | null>(null)
const emailCheckStatus = ref<{ available: boolean, message: string } | null>(null)
let domainCheckTimeout: ReturnType<typeof setTimeout> | null = null
let emailCheckTimeout: ReturnType<typeof setTimeout> | null = null

// Configuration des étapes
const steps = ref([
  { title: 'Établissement', description: 'Informations générales' },
  { title: 'Administrateur', description: 'Compte admin' },
  { title: 'Plan', description: 'Abonnement' }
])

// Plan sélectionné
const selectedPlan = ref<SubscriptionPlan>(SubscriptionPlan.STANDARD)

// Données du formulaire
const formData = ref<CreateTenantDto>({
  name: '',
  domain: '',
  email: '',
  phone: '',
  settings: {
    schoolType: 'secondary',
    academicYearStart: '09-01',
    academicYearEnd: '07-15',
    gradeSystem: 'numeric',
    maxGrade: 20,
    language: 'fr',
    timezone: 'Europe/Paris',
    currency: 'EUR',
    theme: {
      primaryColor: '#1f2937',
      secondaryColor: '#3b82f6'
    }
  },
  admin: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: ''
  },
  subscription: {
    plan: SubscriptionPlan.STANDARD,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 an
    maxStudents: 500,
    maxTeachers: 50,
    pricePerMonth: 59
  }
})

// Plans disponibles
const availablePlans = ref([
  {
    key: SubscriptionPlan.BASIC,
    name: 'Basique',
    description: 'Parfait pour débuter',
    monthlyPrice: 29,
    features: [
      '100 élèves maximum',
      '10 professeurs',
      'Gestion des notes',
      'Support email',
      'Bulletins scolaires'
    ],
    popular: false,
    maxStudents: 100,
    maxTeachers: 10
  },
  {
    key: SubscriptionPlan.STANDARD,
    name: 'Standard',
    description: 'Le choix idéal',
    monthlyPrice: 59,
    features: [
      '500 élèves maximum',
      '50 professeurs',
      'Emplois du temps',
      'Communication parents',
      'Rapports détaillés',
      'Support prioritaire'
    ],
    popular: true,
    maxStudents: 500,
    maxTeachers: 50
  },
  {
    key: SubscriptionPlan.PREMIUM,
    name: 'Premium',
    description: 'Pour les grands établissements',
    monthlyPrice: 99,
    features: [
      '1000 élèves maximum',
      '100 professeurs',
      'Rapports avancés',
      'API complète',
      'Intégrations tierces',
      'Formation incluse'
    ],
    popular: false,
    maxStudents: 1000,
    maxTeachers: 100
  },
  {
    key: SubscriptionPlan.ENTERPRISE,
    name: 'Entreprise',
    description: 'Solutions sur mesure',
    monthlyPrice: 199,
    features: [
      'Utilisateurs illimités',
      'Multi-établissements',
      'Intégrations personnalisées',
      'Support dédié 24/7',
      'Formations sur site',
      'SLA garanti'
    ],
    popular: false,
    maxStudents: 9999,
    maxTeachers: 999
  }
])

// Fonctions pour le style des cartes de plan
const getPlanIconStyle = (index: number) => {
  const styles = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-orange-500'
  ]
  return styles[index % styles.length]
}

const getPlanIcon = (planKey: SubscriptionPlan) => {
  const icons: Record<SubscriptionPlan, string> = {
    [SubscriptionPlan.BASIC]: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z',
    [SubscriptionPlan.STANDARD]: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    [SubscriptionPlan.PREMIUM]: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    [SubscriptionPlan.ENTERPRISE]: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
  }
  return icons[planKey]
}

// Computed
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return formData.value.name && 
             formData.value.domain && 
             formData.value.email && 
             formData.value.settings.schoolType && 
             formData.value.settings.gradeSystem &&
             (!domainCheckStatus.value || domainCheckStatus.value.available)
    case 1:
      return formData.value.admin.firstName && 
             formData.value.admin.lastName && 
             formData.value.admin.email &&
             (!emailCheckStatus.value || emailCheckStatus.value.available)
    case 2:
      return selectedPlan.value
    default:
      return false
  }
})

const isFormValid = computed(() => {
  return canProceed.value && currentStep.value === steps.value.length - 1
})

// Méthodes de navigation
function nextStep() {
  if (canProceed.value && currentStep.value < steps.value.length - 1) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Sélection du plan
function selectPlan(plan: typeof availablePlans.value[0]) {
  selectedPlan.value = plan.key
  formData.value.subscription.plan = plan.key
  formData.value.subscription.pricePerMonth = plan.monthlyPrice
  formData.value.subscription.maxStudents = plan.maxStudents
  formData.value.subscription.maxTeachers = plan.maxTeachers
}

// Vérification de disponibilité du domaine
async function checkDomainAvailability() {
  if (domainCheckTimeout) {
    clearTimeout(domainCheckTimeout)
  }
  
  if (!formData.value.domain || formData.value.domain.length < 3) {
    domainCheckStatus.value = null
    return
  }

  domainCheckTimeout = setTimeout(async () => {
    try {
      const available = await tenantService.checkDomainAvailability(formData.value.domain)
      domainCheckStatus.value = {
        available,
        message: available ? '✓ Domaine disponible' : '✗ Domaine déjà utilisé'
      }
    } catch (error) {
      domainCheckStatus.value = {
        available: true,
        message: '✓ Domaine disponible'
      }
    }
  }, 500)
}

// Vérification de disponibilité de l'email
async function checkEmailAvailability() {
  if (emailCheckTimeout) {
    clearTimeout(emailCheckTimeout)
  }
  
  if (!formData.value.admin.email || !formData.value.admin.email.includes('@')) {
    emailCheckStatus.value = null
    return
  }

  emailCheckTimeout = setTimeout(async () => {
    try {
      const available = await tenantService.checkEmailAvailability(formData.value.admin.email)
      emailCheckStatus.value = {
        available,
        message: available ? '✓ Email disponible' : '✗ Email déjà utilisé'
      }
    } catch (error) {
      emailCheckStatus.value = {
        available: true,
        message: '✓ Email disponible'
      }
    }
  }, 500)
}

// Soumission du formulaire
async function handleSubmit() {
  if (!isFormValid.value) return
  
  loading.value = true
  
  try {
    console.log('🚀 Création du tenant avec les données:', formData.value)
    const response: CreateTenantResponse = await tenantService.createTenant(formData.value)
    
    console.log('✅ Tenant créé avec succès:', response)
    adminCredentials.value = response.adminCredentials
    showSuccessModal.value = true
    
  } catch (error: any) {
    console.error('❌ Erreur lors de la création:', error)
    
    // Analyser le type d'erreur pour un message plus précis
    let errorMessage = 'Erreur lors de la création de l\'établissement'
    
    if (error.message) {
      if (error.message.includes('subscription.plan must be one of')) {
        errorMessage = `Plan d'abonnement invalide. Les plans acceptés sont : basic, standard, premium, enterprise`
      } else if (error.message.includes('404')) {
        errorMessage = '⚠️ Serveur non disponible - Mode de démonstration activé'
      } else if (error.message.includes('domain')) {
        errorMessage = 'Ce domaine est déjà utilisé par un autre établissement'
      } else if (error.message.includes('email')) {
        errorMessage = 'Cette adresse email est déjà utilisée'
      } else {
        errorMessage = error.message
      }
    }
    
    // Créer une notification plus user-friendly
    if (errorMessage.includes('Mode de démonstration')) {
      // En mode démo, montrer un message plus positif
      alert('⚠️ Le serveur backend n\'est pas disponible.\n\nVous pouvez néanmoins tester l\'interface utilisateur.\nLes données ne seront pas sauvegardées.')
    } else {
      alert(`❌ ${errorMessage}`)
    }
    
  } finally {
    loading.value = false
  }
}

// Copier les identifiants
async function copyCredentials() {
  if (!adminCredentials.value) return
  
  const text = `Nom d'utilisateur: ${adminCredentials.value.username}\nMot de passe: ${adminCredentials.value.password}`
  
  try {
    await navigator.clipboard.writeText(text)
    alert('Identifiants copiés dans le presse-papiers')
  } catch (error) {
    console.error('Erreur de copie:', error)
    // Fallback pour anciens navigateurs
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Identifiants copiés dans le presse-papiers')
  }
}

// Redirection vers la connexion
function goToLogin() {
  router.push('/school-login')
}

// Initialisation
onMounted(() => {
  // Sélectionner le plan standard par défaut
  const standardPlan = availablePlans.value.find(p => p.key === SubscriptionPlan.STANDARD)
  if (standardPlan) {
    selectPlan(standardPlan)
  }
})
</script>

<style scoped>
/* Animations pour les transitions entre étapes */
.step-transition {
  transition: all 0.3s ease-in-out;
}

/* Style pour les plans d'abonnement */
.plan-card {
  transition: all 0.2s ease-in-out;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Styles pour les inputs */
input:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Animation de chargement */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>