<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
    <!-- Header moderne -->
    <header
      class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-lg shadow-blue-500/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Navigation Breadcrumb -->
          <div class="flex items-center gap-3">
            <button @click="$router.go(-1)"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </button>
            <span class="text-gray-400 dark:text-gray-500">/</span>
            <span class="text-gray-900 dark:text-white font-medium">Cours en Ligne</span>
          </div>

          <!-- Titre et description -->
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1
                class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Cours en Ligne</h1>
              <p class="text-sm text-blue-600 dark:text-blue-400">Vidéoconférence et enseignement à distance</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">

      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Cours programmés -->
        <div
          class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-blue-500 to-purple-600">
          </div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-blue-100 dark:bg-blue-900/30">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span
                class="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Programmés
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Cours Programmés</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statistics.scheduledCourses || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">À venir</p>
            </div>
          </div>
        </div>

        <!-- Cours en direct -->
        <div
          class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-green-500 to-emerald-600">
          </div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-green-100 dark:bg-green-900/30">
                <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span
                class="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 animate-pulse">
                🔴 LIVE
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">En Direct</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statistics.liveCourses || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Maintenant</p>
            </div>
          </div>
        </div>

        <!-- Total étudiants -->
        <div
          class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-purple-500 to-pink-600">
          </div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-purple-100 dark:bg-purple-900/30">
                <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <span
                class="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                Participants
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Étudiants</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statistics.totalStudents || 0 }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Inscrits</p>
            </div>
          </div>
        </div>

        <!-- Temps total -->
        <div
          class="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/30">
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-orange-500 to-red-600">
          </div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-200 bg-orange-100 dark:bg-orange-900/30">
                <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span
                class="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                Heures
              </span>
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Temps d'Enseignement</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatDuration(statistics.totalDuration ||
                0) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Ce mois</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div
        class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Actions Rapides</h3>
              <p class="text-gray-500 dark:text-gray-400">Gérez vos cours en ligne</p>
            </div>
            <button @click="createNewCourse"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouveau Cours en Ligne
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Démarrer cours immédiat -->
            <button @click="startImmediateCourse"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-200 dark:border-green-800/30">
              <div
                class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              <div class="relative z-10">
                <div class="mb-4">
                  <div
                    class="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 w-fit group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4z" />
                    </svg>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cours Immédiat</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Démarrer un cours maintenant sans planification</p>
              </div>
            </button>

            <!-- Rejoindre cours en direct -->
            <button @click="handleJoinCourse"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-200 dark:border-purple-800/30">
              <div
                class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              <div class="relative z-10">
                <div class="mb-4">
                  <div
                    class="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 w-fit group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Rejoindre un Cours</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Participer à un cours en direct en tant qu'invité
                </p>
              </div>
            </button>

            <!-- Voir calendrier -->
            <button @click="showCalendarView = true"
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-200 dark:border-orange-800/30">
              <div
                class="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              <div class="relative z-10">
                <div class="mb-4">
                  <div
                    class="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 w-fit group-hover:scale-110 transition-transform duration-200">
                    <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Calendrier</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Voir la planification de tous vos cours</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des cours -->
      <div
        class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Mes Cours</h3>
              <p class="text-gray-500 dark:text-gray-400">{{ courses.length }} cours trouvés</p>
            </div>

            <!-- Filtres -->
            <div class="flex items-center gap-4">
              <select v-model="filters.status" @change="loadCourses"
                class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tous les statuts</option>
                <option value="scheduled">Programmés</option>
                <option value="live">En direct</option>
                <option value="ended">Terminés</option>
                <option value="cancelled">Annulés</option>
              </select>

              <button @click="loadCourses"
                class="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                title="Actualiser">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Cours -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <div v-else-if="courses.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun cours</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Commencez par créer votre premier cours en ligne.
            </p>
            <div class="mt-6">
              <button @click="createNewCourse"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouveau cours
              </button>
            </div>
          </div>
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="course in courses" :key="course.id"
              class="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border"
              :class="{
                'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800/30': course.status === 'live',
                'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30': course.status === 'scheduled',
                'bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800/20 dark:to-slate-800/20 border-gray-200 dark:border-gray-700/30': course.status === 'ended',
                'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800/30': course.status === 'cancelled'
              }">
              <!-- Badge de statut flottant -->
              <div class="absolute top-4 right-4 z-10">
                <span
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm"
                  :class="{
                    'bg-green-500/90 text-white': course.status === 'live',
                    'bg-blue-500/90 text-white': course.status === 'scheduled',
                    'bg-gray-500/90 text-white': course.status === 'ended',
                    'bg-red-500/90 text-white': course.status === 'cancelled'
                  }">
                  <span v-if="course.status === 'live'" class="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  <svg v-else-if="course.status === 'scheduled'" class="w-3 h-3 mr-1.5" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else-if="course.status === 'ended'" class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="course.status === 'cancelled'" class="w-3 h-3 mr-1.5" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {{ getStatusLabel(course.status) }}
                </span>
              </div>

              <!-- Contenu de la carte -->
              <div class="p-6">
                <!-- En-tête du cours -->
                <div class="mb-4">
                  <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2 pr-20 line-clamp-2">
                    {{ course.title }}
                  </h4>
                  <p v-if="course.description" class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                    {{ course.description }}
                  </p>
                </div>

                <!-- Détails du cours en grid -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div class="flex items-center gap-2 text-sm">
                    <div class="p-1.5 rounded-lg" :class="{
                      'bg-green-100 dark:bg-green-900/30': course.status === 'live',
                      'bg-blue-100 dark:bg-blue-900/30': course.status === 'scheduled',
                      'bg-gray-100 dark:bg-gray-700': course.status === 'ended',
                      'bg-red-100 dark:bg-red-900/30': course.status === 'cancelled'
                    }">
                      <svg class="w-4 h-4" :class="{
                        'text-green-600 dark:text-green-400': course.status === 'live',
                        'text-blue-600 dark:text-blue-400': course.status === 'scheduled',
                        'text-gray-600 dark:text-gray-400': course.status === 'ended',
                        'text-red-600 dark:text-red-400': course.status === 'cancelled'
                      }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ course.subject }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 text-sm">
                    <div class="p-1.5 rounded-lg" :class="{
                      'bg-green-100 dark:bg-green-900/30': course.status === 'live',
                      'bg-blue-100 dark:bg-blue-900/30': course.status === 'scheduled',
                      'bg-gray-100 dark:bg-gray-700': course.status === 'ended',
                      'bg-red-100 dark:bg-red-900/30': course.status === 'cancelled'
                    }">
                      <svg class="w-4 h-4" :class="{
                        'text-green-600 dark:text-green-400': course.status === 'live',
                        'text-blue-600 dark:text-blue-400': course.status === 'scheduled',
                        'text-gray-600 dark:text-gray-400': course.status === 'ended',
                        'text-red-600 dark:text-red-400': course.status === 'cancelled'
                      }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ course.className }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 text-sm">
                    <div class="p-1.5 rounded-lg" :class="{
                      'bg-green-100 dark:bg-green-900/30': course.status === 'live',
                      'bg-blue-100 dark:bg-blue-900/30': course.status === 'scheduled',
                      'bg-gray-100 dark:bg-gray-700': course.status === 'ended',
                      'bg-red-100 dark:bg-red-900/30': course.status === 'cancelled'
                    }">
                      <svg class="w-4 h-4" :class="{
                        'text-green-600 dark:text-green-400': course.status === 'live',
                        'text-blue-600 dark:text-blue-400': course.status === 'scheduled',
                        'text-gray-600 dark:text-gray-400': course.status === 'ended',
                        'text-red-600 dark:text-red-400': course.status === 'cancelled'
                      }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ formatDateTime(course.scheduledAt)
                      }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 text-sm">
                    <div class="p-1.5 rounded-lg" :class="{
                      'bg-green-100 dark:bg-green-900/30': course.status === 'live',
                      'bg-blue-100 dark:bg-blue-900/30': course.status === 'scheduled',
                      'bg-gray-100 dark:bg-gray-700': course.status === 'ended',
                      'bg-red-100 dark:bg-red-900/30': course.status === 'cancelled'
                    }">
                      <svg class="w-4 h-4" :class="{
                        'text-green-600 dark:text-green-400': course.status === 'live',
                        'text-blue-600 dark:text-blue-400': course.status === 'scheduled',
                        'text-gray-600 dark:text-gray-400': course.status === 'ended',
                        'text-red-600 dark:text-red-400': course.status === 'cancelled'
                      }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ course.duration }} min</p>
                    </div>
                  </div>
                </div>

                <!-- Participants avec avatars améliorés -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="flex -space-x-3">
                      <div v-for="(participant, index) in (course.participants || []).slice(0, 4)"
                        :key="participant.userId"
                        class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold border-3 border-white dark:border-gray-800 shadow-lg"
                        :style="{ backgroundColor: `hsl(${(index * 137.508) % 360}, 70%, 50%)` }"
                        :title="participant.name">
                        {{ getInitials(participant.name) }}
                      </div>
                      <div v-if="(course.participants || []).length > 4"
                        class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-semibold border-3 border-white dark:border-gray-800 shadow-lg">
                        +{{ (course.participants || []).length - 4 }}
                      </div>
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      <span class="font-medium">{{ (course.participants || []).length }}</span>
                      <span class="ml-1">participant{{ (course.participants || []).length > 1 ? 's' : '' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions améliorées -->
                <div class="flex items-center gap-3">
                  <!-- Action principale -->
                  <button v-if="course.status === 'scheduled'" @click="startCourse(course)"
                    class="flex-1 inline-flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h8l4 4z" />
                    </svg>
                    Démarrer le cours
                  </button>

                  <button v-else-if="course.status === 'live'" @click="joinCourse(course)"
                    class="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-pulse">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Rejoindre maintenant
                  </button>

                  <div v-else
                    class="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-xl">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ course.status == 'ended' ? 'Cours terminé' : 'Cours annulé' }}
                  </div>

                  <!-- Menu actions -->
                  <div class="relative" v-click-outside="() => openActionMenu = null">
                    <button @click="openActionMenu = openActionMenu === course.id ? null : course.id"
                      class="p-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors duration-200 shadow-sm border border-gray-200 dark:border-gray-600">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    <div v-if="openActionMenu === course.id"
                      class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                      <div class="py-2">
                        <button @click="editCourse(course)"
                          class="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-150">
                          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Modifier le cours
                        </button>
                        <button @click="duplicateCourse(course)"
                          class="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-150">
                          <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Dupliquer
                        </button>
                        <button v-if="course.status === 'live'" @click="endCourse(course)"
                          class="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-150">
                          <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                          </svg>
                          Terminer le cours
                        </button>
                        <div class="border-t border-gray-100 dark:border-gray-600 my-2"></div>
                        <button @click="deleteCourse(course)"
                          class="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors duration-150">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Supprimer définitivement
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <CreateCourseModal :show="showCreateCourseModal" :course-type="currentCourseType"
      @close="showCreateCourseModal = false" @created="onCourseCreated" />

    <!-- Modal de rejoindre un cours -->
    <JoinCourseModal :show="showJoinCourseModal" @close="showJoinCourseModal = false" @joined="onCourseJoined" />

    <!-- Modal de confirmation -->
    <ConfirmModal :show="confirmModal.show" :title="confirmModal.title" :message="confirmModal.message"
      :type="confirmModal.type" :confirm-text="confirmModal.confirmText" @confirm="handleConfirm"
      @cancel="closeConfirmModal" />

    <!-- Modal de succès/erreur -->
    <ConfirmModal :show="notificationModal.show" :title="notificationModal.title" :message="notificationModal.message"
      :type="notificationModal.type" :confirm-text="'OK'" @confirm="closeNotificationModal"
      @cancel="closeNotificationModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCurrentTenantStore } from '@/stores/currentTenantStore'
import onlineCourseService from '@/services/onlineCourseService'
import type {
  OnlineCourse,
  CourseFilters,
  CourseStatistics
} from '@/types/onlineCourse'

// Composants
import CreateCourseModal from '@/components/courses/CreateCourseModal.vue'
import JoinCourseModal from '@/components/courses/JoinCourseModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

// Route and store
const route = useRoute()
const currentTenantStore = useCurrentTenantStore()
const tenantId = computed(() => currentTenantStore.currentTenantId || route.params.tenantId as string || '')

// Data
const courses = ref<OnlineCourse[]>([])
const statistics = ref<CourseStatistics>({
  totalCourses: 0,
  liveCourses: 0,
  scheduledCourses: 0,
  completedCourses: 0,
  totalStudents: 0,
  averageAttendance: 0,
  totalDuration: 0,
  popularSubjects: []
})

// Loading states
const loading = ref(false)

// Filters
const filters = ref<CourseFilters>({
  status: undefined,
  subject: '',
  className: '',
  search: ''
})

// UI state
const showCreateCourseModal = ref(false)
const showJoinCourseModal = ref(false)
const showCalendarView = ref(false)
const openActionMenu = ref<string | null>(null)
const currentCourseType = ref<'normal' | 'immediate'>('normal')

// Modal de confirmation
const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  type: 'danger' as 'danger' | 'warning' | 'success' | 'info',
  confirmText: 'Confirmer',
  action: '' as string,
  courseId: ''
})

// Modal de notification
const notificationModal = ref({
  show: false,
  title: '',
  message: '',
  type: 'success' as 'danger' | 'warning' | 'success' | 'info'
})

// Methods
const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`
  }
  return `${mins}m`
}

const getStatusLabel = (status: string): string => {
  const labels: { [key: string]: string } = {
    'scheduled': 'Programmé',
    'live': 'En direct',
    'ended': 'Terminé',
    'cancelled': 'Annulé'
  }
  return labels[status] || status
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}
/*  .toUpperCase()
 .substring(0, 2)
}
*/
// Fonction utilitaire pour générer des URLs Jitsi Meet propres
const generateCleanJitsiUrl = (title: string): string => {
  const timestamp = Date.now()

  // Nettoyer le titre pour l'URL - éliminer TOUS les caractères spéciaux
  const courseSlug = title
    .toLowerCase()
    .normalize('NFD') // Décomposer les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les diacritiques
    .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Remplacer plusieurs tirets consécutifs par un seul
    .replace(/^-|-$/g, '') // Supprimer les tirets en début et fin
    .substring(0, 30) // Limiter la longueur

  // Assurer qu'on a au moins quelque chose
  const finalSlug = courseSlug || 'cours'

  return `https://meet.jit.si/${finalSlug}-${timestamp}`
}

const loadCourses = async () => {
  try {
    loading.value = true
    const response = await onlineCourseService.getCourses(tenantId.value, 1, 50, filters.value)
    courses.value = response.courses || []
  } catch (error) {
    console.error('❌ Erreur lors du chargement des cours:', error)
    showNotification('Erreur', 'Impossible de charger les cours', 'danger')
  } finally {
    loading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const stats = await onlineCourseService.getStatistics(tenantId.value)
    statistics.value = stats
  } catch (error) {
    console.error('❌ Erreur lors du chargement des statistiques:', error)
  }
}

// Fonction pour créer un nouveau cours
const createNewCourse = () => {
  currentCourseType.value = 'normal'
  showCreateCourseModal.value = true
}

const startImmediateCourse = () => {
  currentCourseType.value = 'immediate'
  showCreateCourseModal.value = true
}

const handleJoinCourse = () => {
  showJoinCourseModal.value = true
}

// Fonction de test supprimée car inutilisée

const onCourseCreated = async (courseData: any) => {
  try {
    console.log('🎥 Création du cours avec données:', courseData)

    // Préparer les données pour l'API backend
    const createCoursePayload = {
      title: courseData.title,
      description: courseData.description || '',
      subject: courseData.subject,
      className: courseData.className,
      startTime: courseData.scheduledAt || (currentCourseType.value === 'immediate' ? new Date().toISOString() : new Date(Date.now() + 60000).toISOString()),
      duration: courseData.duration || 60,
      teacher: {
        id: 'current-teacher-id', // TODO: récupérer le vrai ID du professeur connecté
        name: 'Professeur',
        email: 'prof@example.com'
      },
      maxParticipants: 50,
      settings: {
        allowRecording: true,
        requirePassword: false,
        waitingRoom: false
      }
    }

    console.log('📤 Envoi des données à l\'API:', createCoursePayload)

    // Appeler l'API backend pour créer réellement le cours
    const response = await onlineCourseService.createCourse(createCoursePayload, tenantId.value)

    console.log('✅ Cours créé avec succès dans la base de données:', response)

    // Si c'est un cours immédiat, ouvrir Jitsi Meet
    if (currentCourseType.value === 'immediate' && response.data?.meetingUrl) {
      onlineCourseService.openMeeting(response.data.meetingUrl, 'Professeur')
    }

    showCreateCourseModal.value = false

    const courseTime = courseData.scheduledAt ? new Date(courseData.scheduledAt).toLocaleString('fr-FR') : 'immédiatement'
    showNotification(
      'Cours Créé',
      `Le cours "${courseData.title}" a été créé et programmé pour ${courseTime} !`,
      'success'
    )

    // Recharger les données depuis la base pour avoir les vrais cours
    await Promise.all([loadCourses(), loadStatistics()])

  } catch (error) {
    console.error('❌ Erreur lors de la création du cours:', error)
    showNotification(
      'Erreur',
      `Erreur lors de la création du cours: ${error instanceof Error ? error.message : String(error)}`,
      'danger'
    )
  }
}

const onCourseJoined = (joinData: { courseId: string; participantName: string; userType: string }) => {
  try {
    // Créer une URL de meeting propre pour test
    const meetingUrl = generateCleanJitsiUrl(`course-${joinData.courseId}`)

    // Ouvrir directement Jitsi Meet
    onlineCourseService.openMeeting(meetingUrl, joinData.participantName)

    showJoinCourseModal.value = false

    showNotification(
      'Connexion Réussie',
      `Vous avez rejoint le cours avec succès en tant que ${joinData.userType === 'student' ? 'élève' : joinData.userType === 'teacher' ? 'professeur' : 'invité'} !`,
      'success'
    )

  } catch (error) {
    console.error('❌ Erreur lors de la participation au cours:', error)
    showNotification('Erreur', 'Erreur lors de la participation au cours', 'danger')
  }
}

// Méthodes pour les confirmations
const showConfirmation = (title: string, message: string, action: string, courseId: string = '', type: 'danger' | 'warning' | 'success' | 'info' = 'warning') => {
  confirmModal.value = {
    show: true,
    title,
    message,
    type,
    confirmText: type === 'danger' ? 'Supprimer' : 'Confirmer',
    action,
    courseId
  }
}

const handleConfirm = async () => {
  const action = confirmModal.value.action
  const courseId = confirmModal.value.courseId

  closeConfirmModal()

  try {
    switch (action) {
      case 'delete':
        await deleteCourseConfirmed(courseId)
        break
      case 'end':
        await endCourseConfirmed(courseId)
        break
      default:
        console.log('Action confirmée:', action)
    }
  } catch (error) {
    console.error('Erreur lors de l\'action:', error)
    showNotification('Erreur', 'Une erreur est survenue', 'danger')
  }
}

const closeConfirmModal = () => {
  confirmModal.value.show = false
  confirmModal.value.action = ''
  confirmModal.value.courseId = ''
}

// Méthodes pour les notifications
const showNotification = (title: string, message: string, type: 'danger' | 'warning' | 'success' | 'info' = 'info') => {
  notificationModal.value = {
    show: true,
    title,
    message,
    type
  }
}

const closeNotificationModal = () => {
  notificationModal.value.show = false
}

// Actions sur les cours
const startCourse = async (course: OnlineCourse) => {
  try {
    // console.log('🚀 Démarrage du cours:', { courseId: course._id, tenantId: tenantId.value })
    await onlineCourseService.startCourse(course._id, tenantId.value)

    // Rejoindre automatiquement le cours
    await joinCourse(course)

    // Recharger les données
    await Promise.all([loadCourses(), loadStatistics()])

    showNotification('Cours Démarré', 'Le cours a été démarré avec succès !', 'success')

  } catch (error) {
    console.error('❌ Erreur lors du démarrage du cours:', error)
    showNotification('Erreur', 'Erreur lors du démarrage du cours', 'danger')
  }
}

const joinCourse = async (course: OnlineCourse) => {
  try {
    // Récupérer le nom de l'utilisateur (à adapter selon votre système d'auth)
    console.log('TenantId:', tenantId.value)
    const userName = 'Professeur' // TODO: récupérer le vrai nom

    const response = await onlineCourseService.joinCourse({
      courseId: course._id,
      userId: 'current-user-id', // TODO: récupérer le vrai ID
      userName,
      userType: 'teacher'
    }, tenantId.value)

    // Ouvrir Jitsi Meet
    onlineCourseService.openMeeting(response.meetingUrl, userName)

  } catch (error) {
    console.error('❌ Erreur lors de la participation au cours:', error)
    showNotification('Erreur', 'Erreur lors de la participation au cours', 'danger')
  }
}

const endCourse = (course: OnlineCourse) => {
  showConfirmation(
    'Terminer le cours',
    `Êtes-vous sûr de vouloir terminer le cours "${course.title}" ?`,
    'end',
    course.id,
    'warning'
  )
}

const endCourseConfirmed = async (courseId: string) => {
  try {
    await onlineCourseService.endCourse(courseId, tenantId.value)
    await Promise.all([loadCourses(), loadStatistics()])

    showNotification('Cours Terminé', 'Le cours a été terminé avec succès', 'success')

  } catch (error) {
    console.error('❌ Erreur lors de la fin du cours:', error)
    showNotification('Erreur', 'Erreur lors de la fin du cours', 'danger')
  }
}

const editCourse = (course: OnlineCourse) => {
  // TODO: Ouvrir modal d'édition
  console.log('Édition du cours:', course)
  showNotification('Fonctionnalité', 'L\'édition de cours sera bientôt disponible', 'info')
}

const duplicateCourse = (course: OnlineCourse) => {
  // TODO: Dupliquer le cours
  console.log('Duplication du cours:', course)
  showNotification('Fonctionnalité', 'La duplication de cours sera bientôt disponible', 'info')
}

const deleteCourse = (course: OnlineCourse) => {
  showConfirmation(
    'Supprimer le cours',
    `Êtes-vous sûr de vouloir supprimer définitivement le cours "${course.title}" ?`,
    'delete',
    course.id,
    'danger'
  )
}

const deleteCourseConfirmed = async (courseId: string) => {
  try {
    await onlineCourseService.deleteCourse(courseId, tenantId.value)
    await Promise.all([loadCourses(), loadStatistics()])

    showNotification('Cours Supprimé', 'Le cours a été supprimé avec succès', 'success')

  } catch (error) {
    console.error('❌ Erreur lors de la suppression du cours:', error)
    showNotification('Erreur', 'Erreur lors de la suppression du cours', 'danger')
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadCourses(),
    loadStatistics()
  ])
})

// Click outside directive (simple implementation)
const vClickOutside = {
  mounted(el: HTMLElement & { clickOutsideEvent?: (event: Event) => void }, binding: { value: () => void }) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement & { clickOutsideEvent?: (event: Event) => void }) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>