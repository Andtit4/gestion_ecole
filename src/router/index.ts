import { createRouter, createWebHistory } from 'vue-router'
import authService from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // Route par défaut - redirection vers login
    {
      path: '/',
      redirect: '/school-login'
    },

    // Routes publiques (pas d'authentification requise)
    {
      path: '/school-login',
      name: 'SchoolLogin',
      component: () => import('../views/School/SchoolLogin.vue'),
      meta: {
        title: 'Connexion Établissement',
        public: true,
        hideForAuth: true // Cacher si l'utilisateur est déjà connecté
      },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Connexion',
        public: true,
        hideForAuth: true
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Inscription',
        public: true,
        hideForAuth: true
      },
    },
    {
      path: '/tenant/register',
      name: 'TenantRegistration',
      component: () => import('../views/Tenant/TenantRegistration.vue'),
      meta: {
        title: 'Inscription Établissement',
        public: true,
      },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/Auth/ResetPassword.vue'),
      meta: {
        title: 'Récupération mot de passe',
        public: true,
      },
    },

    // Routes protégées (authentification requise)
    {
      path: '/school/dashboard',
      name: 'SchoolDashboard',
      component: () => import('../views/School/SchoolDashboard.vue'),
      meta: {
        title: 'Dashboard Établissement',
        requiresAuth: true,
      },
    },
    {
      path: '/school/:tenantId/students',
      name: 'SchoolStudentManagement',
      component: () => import('../views/School/SchoolStudentManagement.vue'),
      meta: {
        title: 'Gestion des Élèves - Établissement',
        requiresAuth: true,
      },
    },
    {
      path: '/school/:tenantId/teachers',
      name: 'SchoolTeacherManagement',
      component: () => import('../views/School/SchoolTeacherManagement.vue'),
      meta: {
        title: 'Gestion des Professeurs - Établissement',
        requiresAuth: true,
      },
    },
    {
      path: '/school/:tenantId/subjects',
      name: 'SchoolSubjectManagement',
      component: () => import('../views/Subjects/ModernSubjectManagement.vue'),
      meta: {
        title: 'Gestion des Matières - Établissement',
        requiresAuth: true,
      },
    },
    {
      path: '/school/:tenantId/structure',
      name: 'SchoolAcademicStructure',
      component: () => import('../views/Academic/AcademicStructure.vue'),
      meta: {
        title: 'Structure Académique - Établissement',
        requiresAuth: true,
      },
    },
    {
      path: '/school/:tenantId/evaluations',
      name: 'SchoolEvaluationManagement',
      component: () => import('../views/Evaluations/EvaluationManagement.vue'),
      meta: {
        title: 'Gestion des Évaluations - Établissement',
        requiresAuth: true,
      },
    },
    {
      path: '/school/:tenantId/bulletins',
      name: 'SchoolBulletinManagement',
      component: () => import('../views/Bulletins/BulletinManagement.vue'),
      meta: {
        title: 'Gestion des Bulletins - Établissement',
        requiresAuth: true,
      },
    },
    {
      path: '/users',
      name: 'UserManagement',
      component: () => import('../views/Users/UserManagement.vue'),
      meta: {
        title: 'Gestion des Utilisateurs',
        requiresAuth: true,
      },
    },
    {
      path: '/admin/accounts',
      name: 'AccountManagement',
      component: () => import('../views/Admin/AccountManagement.vue'),
      meta: {
        title: 'Gestion des Comptes',
        requiresAuth: true,
        adminOnly: true,
      },
    },
    {
      path: '/students',
      name: 'StudentManagement',
      component: () => import('../views/Students/StudentManagement.vue'),
      meta: {
        title: 'Gestion des Élèves',
        requiresAuth: true,
      },
    },
    {
      path: '/teachers',
      name: 'TeacherManagement',
      component: () => import('../views/Teachers/TeacherManagement.vue'),
      meta: {
        title: 'Gestion des Professeurs',
        requiresAuth: true,
      },
    },
    {
      path: '/teacher-assignments',
      name: 'TeacherAssignments',
      component: () => import('../views/Teachers/TeacherAssignments.vue'),
      meta: {
        title: 'Assignations Classes/Matières',
        requiresAuth: true,
      },
    },
    {
      path: '/bulletins',
      name: 'BulletinManagement',
      component: () => import('../views/Bulletins/BulletinManagement.vue'),
      meta: {
        title: 'Gestion des Bulletins',
        requiresAuth: true,
      },
    },
    {
      path: '/academic-structure',
      name: 'AcademicStructure',
      component: () => import('../views/Academic/AcademicStructure.vue'),
      meta: {
        title: 'Structure Académique',
        requiresAuth: true,
      },
    },
    {
      path: '/subjects',
      name: 'SubjectManagement',
      component: () => import('../views/Subjects/SubjectManagement.vue'),
      meta: {
        title: 'Gestion des Matières',
        requiresAuth: true,
      },
    },
    {
      path: '/teacher-subject-management',
      name: 'TeacherSubjectManagement',
      component: () => import('../views/Academic/TeacherSubjectManagement.vue'),
      meta: {
        title: 'Gestion Professeurs & Matières',
        requiresAuth: true,
      },
    },
    {
      path: '/academic',
      redirect: '/academic-structure'
    },
    {
      path: '/schedule',
      name: 'ScheduleManagement',
      component: () => import('../views/Schedule/ScheduleManagement.vue'),
      meta: {
        title: 'Gestion des Emplois du Temps',
        requiresAuth: true,
      },
    },
    {
      path: '/evaluations',
      name: 'EvaluationManagement',
      component: () => import('../views/Evaluations/EvaluationManagement.vue'),
      meta: {
        title: 'Gestion des Évaluations',
        requiresAuth: true,
      },
    },

    // Routes d'administration (pour multi-tenant)
    {
      path: '/tenant-dashboard',
      name: 'TenantDashboard',
      component: () => import('../views/Tenant/SimpleTenantDashboard.vue'),
      meta: {
        title: 'Gestion Établissements',
        requiresAuth: true,
        adminOnly: true
      },
    },
    {
      path: '/tenant/:id',
      name: 'TenantDetails',
      component: () => import('../views/Tenant/TenantDetail.vue'),
      meta: {
        title: 'Détails Établissement',
        requiresAuth: true,
        adminOnly: true
      },
    },
    {
      path: '/tenant/:id/edit',
      name: 'TenantEdit',
      component: () => import('../views/Tenant/TenantEdit.vue'),
      meta: {
        title: 'Modifier Établissement',
        requiresAuth: true,
        adminOnly: true
      },
    },
    {
      path: '/subscriptions',
      name: 'SubscriptionManagement',
      component: () => import('../views/Subscription/SimpleSubscriptionManagement.vue'),
      meta: {
        title: 'Gestion Abonnements',
        requiresAuth: true,
      },
    },
    {
      path: '/plan-management',
      name: 'PlanManagement',
      component: () => import('../views/Subscription/PlanManagement.vue'),
      meta: {
        title: 'Gestion des Plans',
        requiresAuth: true,
        adminOnly: true
      },
    },

    // Routes utilitaires et tests
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendrier',
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profil',
        requiresAuth: true,
      },
    },
    {
      path: '/form-elements',
      name: 'FormElements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Éléments de Formulaire',
        requiresAuth: true,
      },
    },
    {
      path: '/basic-tables',
      name: 'BasicTables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Tableaux de Base',
        requiresAuth: true,
      },
    },
    {
      path: '/line-chart',
      name: 'LineChart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
      meta: {
        title: 'Graphique Linéaire',
        requiresAuth: true,
      },
    },
    {
      path: '/bar-chart',
      name: 'BarChart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
      meta: {
        title: 'Graphique à Barres',
        requiresAuth: true,
      },
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alertes',
        requiresAuth: true,
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
        requiresAuth: true,
      },
    },
    {
      path: '/badges',
      name: 'Badges',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badges',
        requiresAuth: true,
      },
    },
    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Boutons',
        requiresAuth: true,
      },
    },
    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
        requiresAuth: true,
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Vidéos',
        requiresAuth: true,
      },
    },
    {
      path: '/blank',
      name: 'BlankPage',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Page Vierge',
        requiresAuth: true,
      },
    },
    {
      path: '/test-navigation',
      name: 'TestNavigation',
      component: () => import('../views/TestNavigation.vue'),
      meta: {
        title: 'Test Navigation',
        requiresAuth: true,
      },
    },
    {
      path: '/subscription-test',
      name: 'SubscriptionTest',
      component: () => import('@/views/Subscription/SubscriptionTest.vue'),
      meta: { 
        title: 'Test API Abonnements',
        requiresAuth: true,
      }
    },

    // Routes d'erreur
    {
      path: '/error-404',
      name: '404Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: 'Page non trouvée',
        public: true,
      },
    },
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: () => import('../views/Errors/Unauthorized.vue'),
      meta: {
        title: 'Accès non autorisé',
        public: true,
      },
    },

    // Catch-all route pour les pages non trouvées
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error-404'
    }
  ],
})

// Guard global avant navigation
router.beforeEach(async (to, from, next) => {
  console.log(`Navigation: ${from.path} -> ${to.path}`)
  console.log('Route meta:', to.meta)

  const isAuthenticated = authService.isAuthenticated()
  const requiresAuth = to.meta.requiresAuth
  const isPublic = to.meta.public
  const hideForAuth = to.meta.hideForAuth
  const adminOnly = to.meta.adminOnly

  console.log('Auth state check:', {
    isAuthenticated,
    requiresAuth,
    isPublic,
    hideForAuth,
    adminOnly,
    currentSchool: authService.getCurrentSchool(),
    isSuperAdmin: authService.isSuperAdmin()
  })

  // Si la route est publique, laisser passer
  if (isPublic && !hideForAuth) {
    console.log('Route publique, accès autorisé')
    next()
    return
  }

  // Si l'utilisateur est connecté et tente d'accéder à une route qui doit être cachée pour les connectés
  if (isAuthenticated && hideForAuth) {
    console.log('Utilisateur connecté tentant d\'accéder à une route cachée, redirection')
    // Rediriger vers le bon dashboard selon le type d'utilisateur
    if (authService.isSuperAdmin()) {
      next('/tenant-dashboard')
    } else {
      next('/school/dashboard')
    }
    return
  }

  // Si la route nécessite une authentification
  if (requiresAuth && !isAuthenticated) {
    console.log('Redirection vers login - utilisateur non authentifié')
    next('/school-login')
    return
  }

  // Valider la session si l'utilisateur semble authentifié
  if (isAuthenticated && requiresAuth) {
    console.log('Validation de session en cours...')
    try {
      const isValidSession = await authService.validateSession()
      if (!isValidSession) {
        console.log('Session invalide, redirection vers login')
        next('/school-login')
        return
      }
      console.log('Session valide')
    } catch (error) {
      console.error('Erreur de validation de session:', error)
      next('/school-login')
      return
    }
  }

  // Vérifier les permissions admin si nécessaire
  if (adminOnly) {
    console.log('Vérification des permissions admin...')
    const isSuperAdmin = authService.isSuperAdmin()
    const currentSchool = authService.getCurrentSchool()
    
    console.log('Admin check:', { isSuperAdmin, currentSchool })
    
    // Les super admins ont accès à toutes les routes adminOnly
    if (isSuperAdmin) {
      console.log('Super admin détecté, accès autorisé')
      next()
      return
    }
    
    // Pour les admins d'établissement, vérifier qu'ils ont un établissement
    if (!currentSchool) {
      console.log('Admin d\'établissement sans école assignée, accès refusé')
      next('/unauthorized')
      return
    }
    
    console.log('Admin d\'établissement avec école valide, accès autorisé')
  }

  // Si tout est OK, continuer
  console.log('Toutes les vérifications passées, accès autorisé')
  next()
})

// Mise à jour du titre après navigation
router.afterEach((to) => {
  const defaultTitle = 'École Manager'
  document.title = to.meta.title ? `${to.meta.title} - ${defaultTitle}` : defaultTitle
})

// Gestion des erreurs globales
router.onError((error) => {
  console.error('Erreur de navigation:', error)
  // Rediriger vers une page d'erreur si nécessaire
})

export default router
