# Système d'Authentification - École Manager

Ce document décrit le système d'authentification complet implémenté dans l'application École Manager.

## 🔐 Architecture

Le système d'authentification comprend :

1. **Service d'authentification** (`src/services/authService.ts`)
2. **Store d'authentification** (`src/stores/authStore.ts`)
3. **Guards de route** (`src/router/index.ts`)
4. **Pages d'authentification** (`src/views/Auth/`, `src/views/School/`)
5. **Composants utilitaires** (`src/components/auth/`)

## 🚀 Fonctionnalités

### ✅ Connexion sécurisée
- Authentification par domaine, nom d'utilisateur et mot de passe
- Validation des identifiants côté serveur
- Gestion des erreurs avec messages explicites
- Interface utilisateur moderne et responsive

### ✅ Gestion de session
- Stockage sécurisé des données d'authentification
- Validation automatique de session
- Expiration automatique après 24h
- Persistance des données de connexion

### ✅ Protection des routes
- Guards automatiques sur toutes les routes protégées
- Redirection automatique vers la page de connexion
- Protection contre l'accès non autorisé
- Gestion des permissions administrateur

### ✅ Déconnexion sécurisée
- Nettoyage complet des données locales
- Confirmation avant déconnexion
- Redirection automatique

### ✅ Récupération de mot de passe
- Interface de récupération par domaine et email
- Génération de nouveaux identifiants
- Validation des données avant traitement

## 📁 Structure des fichiers

```
src/
├── services/
│   ├── authService.ts           # Service principal d'authentification
│   └── tenantService.ts         # Service API pour les tenants
├── stores/
│   └── authStore.ts             # Store Pinia pour l'état d'authentification
├── views/
│   ├── Auth/
│   │   ├── ResetPassword.vue    # Page de récupération de mot de passe
│   │   └── Signin.vue           # Page de connexion générale
│   ├── School/
│   │   └── SchoolLogin.vue      # Page de connexion établissement
│   └── Errors/
│       └── Unauthorized.vue     # Page d'erreur d'autorisation
├── components/
│   └── auth/
│       └── LogoutButton.vue     # Bouton de déconnexion réutilisable
└── router/
    └── index.ts                 # Configuration des routes et guards
```

## 🔧 Configuration des routes

### Routes publiques
- `/school-login` - Connexion établissement
- `/signin` - Connexion générale
- `/signup` - Inscription
- `/tenant/register` - Inscription établissement
- `/reset-password` - Récupération mot de passe
- `/error-404` - Page non trouvée
- `/unauthorized` - Accès non autorisé

### Routes protégées
Toutes les autres routes nécessitent une authentification :
- `/school/dashboard` - Dashboard principal
- `/users` - Gestion utilisateurs
- `/students` - Gestion élèves
- `/teachers` - Gestion professeurs
- etc.

## 🛠 Utilisation

### 1. Connexion

```typescript
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// Connexion
const success = await authStore.login({
  domain: 'mon-ecole',
  username: 'admin',
  password: 'password123'
})

if (success) {
  // Redirection automatique vers le dashboard
  router.push('/school/dashboard')
}
```

### 2. Vérification de l'état d'authentification

```typescript
// Dans un composant Vue
const authStore = useAuthStore()

// État de connexion
const isAuthenticated = authStore.isAuthenticated
const currentSchool = authStore.currentSchool
const loading = authStore.loading
const error = authStore.error
```

### 3. Déconnexion

```typescript
// Déconnexion simple
await authStore.logout()

// Ou utiliser le composant LogoutButton
import LogoutButton from '@/components/auth/LogoutButton.vue'
```

### 4. Protection de routes personnalisées

```typescript
// Dans router/index.ts
{
  path: '/admin-only',
  component: AdminComponent,
  meta: {
    requiresAuth: true,
    adminOnly: true // Accès admin uniquement
  }
}
```

## 🔐 Sécurité

### Fonctionnalités de sécurité implémentées :

1. **Validation côté serveur** - Toutes les authentifications sont vérifiées côté backend
2. **Expiration de session** - Sessions automatiquement expirées après 24h
3. **Nettoyage automatique** - Suppression des données obsolètes
4. **Validation de session** - Vérification périodique de la validité des sessions
5. **Protection CSRF** - Headers de sécurité inclus dans les requêtes API
6. **Stockage sécurisé** - Données sensibles stockées avec timestamp de validation

### Bonnes pratiques :

- ✅ Pas de stockage de mots de passe en local
- ✅ Validation systématique des sessions actives
- ✅ Nettoyage automatique à la déconnexion
- ✅ Gestion d'erreurs exhaustive
- ✅ Logs de sécurité pour le débogage

## 🎨 Interface utilisateur

### Design moderne :
- Interface responsive et accessible
- Thème sombre/clair supporté
- Animation de chargement
- Messages d'erreur contextuels
- Design system cohérent avec Tailwind CSS

### UX optimisée :
- Validation en temps réel des formulaires
- Indicateurs de progression
- Confirmations pour les actions sensibles
- Navigation intuitive
- Accessibilité clavier complète

## 🧪 Tests

### Tests recommandés :
1. **Tests unitaires** - Services et stores
2. **Tests d'intégration** - Flux d'authentification
3. **Tests E2E** - Parcours utilisateur complet
4. **Tests de sécurité** - Vérification des permissions

### Commandes de test :
```bash
# Tests unitaires
npm run test:unit

# Tests E2E
npm run test:e2e

# Tests de couverture
npm run test:coverage
```

## 🚨 Dépannage

### Problèmes courants :

1. **Session expirée**
   - Vérifier la validité du token
   - Renouveler la session si possible
   - Rediriger vers la connexion

2. **Erreur de réseau**
   - Vérifier la connectivité
   - Réessayer automatiquement
   - Afficher un message explicite

3. **Permissions insuffisantes**
   - Vérifier les rôles utilisateur
   - Rediriger vers une page d'erreur
   - Logger l'tentative d'accès

### Logs utiles :
```typescript
// Activer les logs de débogage
console.log('Navigation:', { from: from.path, to: to.path })
console.log('Auth state:', authService.getAuthState())
```

## 📈 Améliorations futures

### Fonctionnalités à implémenter :
- [ ] Authentification à deux facteurs (2FA)
- [ ] Connexion SSO (Single Sign-On)
- [ ] Refresh tokens automatiques
- [ ] Session management avancé
- [ ] Audit trail des connexions
- [ ] Rate limiting sur les tentatives de connexion
- [ ] Politique de mot de passe renforcée

### Optimisations :
- [ ] Cache intelligent des données utilisateur
- [ ] Préchargement des permissions
- [ ] Optimisation des requêtes réseau
- [ ] Compression des données stockées

## 🤝 Contribution

Pour contribuer au système d'authentification :

1. Respecter l'architecture existante
2. Tester exhaustivement les modifications
3. Documenter les nouvelles fonctionnalités
4. Suivre les standards de sécurité
5. Maintenir la compatibilité ascendante

## 📞 Support

En cas de problème :
1. Consulter les logs de la console
2. Vérifier la configuration réseau
3. Tester en mode développement
4. Contacter l'équipe de développement

---

**Version :** 1.0.0  
**Dernière mise à jour :** 2024  
**Auteur :** Équipe École Manager 