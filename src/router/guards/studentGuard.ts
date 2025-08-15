// src/router/guards/studentGuard.ts
// src/router/guards/studentGuard.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export function studentGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    // Rediriger vers la page de connexion si non authentifié
    return next({ name: 'student-login', query: { redirect: to.fullPath } });
  }

  if (!authStore.isStudent) {
    // Rediriger vers le tableau de bord approprié si l'utilisateur n'est pas un élève
    return next(authStore.isAdmin ? '/admin/dashboard' : '/');
  }

  // Autoriser l'accès à la route
  next();
}