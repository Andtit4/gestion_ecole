# Guide de Création des Utilisateurs Super-Admin

## 📋 Vue d'ensemble

Ce guide explique comment créer et utiliser des utilisateurs super-administrateurs dans le système de gestion scolaire. Il y a deux types de super-admins disponibles :

1. **Super-Admin système** (table `SuperAdmin`) - pour la gestion multi-tenant
2. **Super-Admin utilisateur** (table `User`) - pour la gestion complète des fonctionnalités **avec authentification par mot de passe**

## 🚀 Scripts de Création

### 1. Super-Admin Système (Multi-tenant)

```bash
cd backend
npm run create-super-admin
```

**Caractéristiques :**
- Stocké dans la table `SuperAdmin`
- Gestion de tous les établissements
- Connexion via le domaine `SUPER_ADMIN`
- Identifiants : `superadmin` / `SuperAdmin2024!`

### 2. Super-Admin Utilisateur (Permissions complètes)

```bash
cd backend
npm run create-super-admin-user
```

**Caractéristiques :**
- Stocké dans la table `User`
- Toutes les permissions disponibles (24 permissions)
- Tenant ID : `SUPER_ADMIN_TENANT`
- Email : `superadmin@school-system.com`
- **Mot de passe** : `SuperAdmin2024!`
- ✅ **Peut se connecter via l'API d'authentification**

### 3. Admin d'Établissement (Table User)

```bash
cd backend
npm run create-admin-user
```

**Caractéristiques :**
- Stocké dans la table `User`
- Assigné au premier établissement trouvé
- Permissions d'administration complètes
- Email : `admin@mon-ecole.com`
- **Mot de passe** : `AdminPass123!`
- ✅ **Peut se connecter via l'API d'authentification**

### 4. Test d'Authentification

```bash
cd backend
npm run test-user-auth
```

**Teste** :
- Authentification super-admin
- Authentification admin d'établissement  
- Rejet des mauvais mots de passe
- Rejet des utilisateurs inexistants

## 📊 Permissions Accordées

### Super-Admin Utilisateur (24 permissions)

| Catégorie | Permissions |
|-----------|-------------|
| **Élèves** | `view_students`, `create_students`, `edit_students`, `delete_students` |
| **Notes** | `view_grades`, `create_grades`, `edit_grades`, `delete_grades` |
| **Professeurs** | `view_teachers`, `create_teachers`, `edit_teachers`, `delete_teachers` |
| **Parents** | `view_parents`, `create_parents`, `edit_parents`, `delete_parents` |
| **Administration** | `manage_settings`, `manage_users`, `manage_billing`, `view_reports` |
| **Communication** | `send_messages`, `view_messages` |
| **Emploi du temps** | `view_schedule`, `manage_schedule` |

## 🔐 Informations de Connexion

### Super-Admin Système
```
URL: http://localhost:3000/school-login
Domaine: SUPER_ADMIN
Nom d'utilisateur: superadmin
Mot de passe: SuperAdmin2024!
```

### Super-Admin Utilisateur (API)
```
POST /users/auth/login
{
  "email": "superadmin@school-system.com",
  "password": "SuperAdmin2024!",
  "tenantId": "SUPER_ADMIN_TENANT"
}
```

### Admin d'Établissement (API)
```
POST /users/auth/login
{
  "email": "admin@mon-ecole.com", 
  "password": "AdminPass123!",
  "tenantId": "68540ab873220ffd7c30046f"
}
```

### Connexion normale (Établissement existant)
```
URL: http://localhost:3000/school-login
Domaine: mon-ecole-test
Nom d'utilisateur: admin
Mot de passe: password123
```

## 🔑 Gestion des Mots de Passe

### Endpoints disponibles

#### Authentification
```bash
POST /users/auth/login
Body: { email, password, tenantId }
```

#### Définir un mot de passe
```bash
POST /users/:id/set-password
Headers: X-Tenant-Id: <tenantId>
Body: { password: "nouveauMotDePasse" }
```

#### Changer un mot de passe
```bash
POST /users/:id/change-password
Headers: X-Tenant-Id: <tenantId>
Body: { 
  currentPassword: "ancienMotDePasse",
  newPassword: "nouveauMotDePasse" 
}
```

#### Vérifier si un utilisateur a un mot de passe
```bash
GET /users/:id/has-password
Headers: X-Tenant-Id: <tenantId>
```

## 📝 Utilisation des Utilisateurs Créés

### 1. Via l'Interface Web

Les super-admins système peuvent se connecter via l'interface de connexion normale en utilisant le domaine `SUPER_ADMIN`.

### 2. Via l'API Backend

Les utilisateurs de la table `User` peuvent maintenant :
- ✅ Se connecter avec email/mot de passe
- ✅ Être utilisés pour tests d'API
- ✅ Développement de fonctionnalités
- ✅ Gestion programmatique

### 3. Vérification des Utilisateurs Créés

```javascript
// Dans la console MongoDB
db.users.find({ "role": "admin" })
db.superadmins.find({})

// Vérifier qu'ils ont des mots de passe
db.users.find({ "role": "admin", "password": { $exists: true } })
```

### 4. Tests de Connexion

```bash
# Test via script
npm run test-user-auth

# Test via cURL
curl -X POST http://localhost:8000/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@school-system.com",
    "password": "SuperAdmin2024!",
    "tenantId": "SUPER_ADMIN_TENANT"
  }'
```

## ⚠️ Notes Importantes

### Sécurité
- Les super-admins ont accès à **TOUTES** les fonctionnalités
- ✅ **Mots de passe hashés** avec bcryptjs (12 rounds)
- ✅ **Mots de passe non exposés** dans les réponses API
- Changez les mots de passe par défaut en production
- Utilisez ces comptes uniquement pour l'administration

### Base de Données
- Les utilisateurs super-admin utilisent un `tenantId` spécial : `SUPER_ADMIN_TENANT`
- ✅ **Champ password** ajouté au schéma User (select: false par défaut)
- Ils ne sont pas liés à un établissement spécifique
- Ils ont accès à tous les modules du système

### Développement
- Les scripts peuvent être exécutés plusieurs fois (vérification d'existence)
- ✅ **Définition automatique** du mot de passe si manquant
- Les utilisateurs existants ne sont pas écrasés
- Tous les scripts affichent des informations détaillées

## 🛠️ Scripts Disponibles

| Script | Description | Table | Mot de passe | Usage |
|--------|-------------|-------|--------------|-------|
| `create-super-admin` | Super-admin système | `SuperAdmin` | ✅ Oui | Gestion multi-tenant |
| `create-super-admin-user` | Super-admin utilisateur | `User` | ✅ Oui | Permissions complètes + API |
| `create-admin-user` | Admin d'établissement | `User` | ✅ Oui | Gestion d'un établissement + API |
| `create-admin` | Admin d'établissement | `Tenant` | ✅ Oui | Connexion web standard |
| `test-user-auth` | Test authentification | - | - | Validation des logins |

## 🔧 Dépannage

### Erreur "Utilisateur existe déjà"
- Normal si le script a déjà été exécuté
- Les utilisateurs existants sont préservés
- ✅ **Le script définit automatiquement le mot de passe** si manquant

### Erreur "Aucun tenant trouvé"
- Exécutez d'abord `npm run create-admin` pour créer un établissement
- Ou modifiez le script pour utiliser un `tenantId` spécifique

### Problème de connexion API
- Vérifiez que le backend est démarré sur le port 8000
- Vérifiez la connexion MongoDB
- Utilisez `npm run test-user-auth` pour valider l'authentification
- Consultez les logs de l'application

### Erreur "Email ou mot de passe incorrect"
- Vérifiez l'email exact utilisé
- Vérifiez que le tenantId correspond
- Utilisez le script de test pour valider

## 📚 Utilisation Recommandée

1. **Pour la gestion multi-tenant** : Utilisez le super-admin système
2. **Pour les tests de permissions + API** : Utilisez le super-admin utilisateur  
3. **Pour l'administration d'école + API** : Utilisez les admins d'établissement
4. **Pour les tests d'authentification** : Utilisez le script de test

## 🎯 Nouvelles Fonctionnalités

✅ **Authentification par mot de passe** pour tous les utilisateurs
✅ **API complète** de gestion des mots de passe
✅ **Hashage sécurisé** des mots de passe (bcryptjs, 12 rounds)
✅ **Scripts de test** automatisés
✅ **Compatibilité** avec le système existant
✅ **Sécurité renforcée** (pas d'exposition des mots de passe)

---

*Ce guide couvre la création et l'utilisation complète des comptes super-administrateurs avec authentification par mot de passe dans le système de gestion scolaire.* 