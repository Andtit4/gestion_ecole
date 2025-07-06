# 🚀 Guide de Connexion Super Administrateur - École Manager

Ce guide explique comment créer et utiliser un compte Super Administrateur pour gérer tous les établissements.

## 📋 Table des Matières

1. [Création du Super Admin](#création-du-super-admin)
2. [Connexion](#connexion)
3. [Fonctionnalités Disponibles](#fonctionnalités-disponibles)
4. [Dépannage](#dépannage)

---

## 🎯 Création du Super Admin

### Méthode 1 : Via le Script (Recommandée)

```bash
# Dans le dossier backend
cd backend
npm run create-super-admin
```

Si MongoDB est accessible, le script créera automatiquement le super admin.

### Méthode 2 : Via l'API (Alternative)

Si le script ne fonctionne pas, vous pouvez créer le super admin via l'API une fois le serveur démarré :

1. **Démarrer le serveur backend :**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Utiliser Postman ou curl pour créer le super admin :**
   ```bash
   curl -X POST http://localhost:3000/super-admin/create \
   -H "Content-Type: application/json" \
   -d '{
     "username": "superadmin",
     "email": "superadmin@ecole-manager.fr",
     "firstName": "Super",
     "lastName": "Administrateur",
     "password": "SuperAdmin2024!"
   }'
   ```

---

## 🔑 Connexion Super Admin

### Identifiants par Défaut

- **URL :** http://localhost:5173/school-login
- **Domaine :** `SUPER_ADMIN` (en majuscules)
- **Username :** `superadmin`
- **Mot de passe :** `SuperAdmin2024!`

### Étapes de Connexion

1. Ouvrez votre navigateur et allez sur : http://localhost:5173/school-login

2. Remplissez le formulaire :
   ```
   Domaine d'établissement : SUPER_ADMIN
   Nom d'utilisateur : superadmin
   Mot de passe : SuperAdmin2024!
   ```

3. Cliquez sur **"Se connecter"**

4. Vous serez automatiquement redirigé vers : http://localhost:5173/tenant-dashboard

---

## 🛠️ Fonctionnalités Disponibles

### Dashboard Multi-Établissements (`/tenant-dashboard`)

- **Vue d'ensemble globale** de tous les établissements
- **Statistiques en temps réel** : nombre total d'établissements, actifs, en attente
- **Gestion des établissements** : création, modification, suspension, activation
- **Monitoring des abonnements** : expiration, utilisation des limites

### Gestion des Plans (`/plan-management`)

- **Création de nouveaux plans** d'abonnement
- **Modification des plans existants** : prix, limites, fonctionnalités
- **Gestion des fonctionnalités** par plan
- **Tarification flexible**

### Gestion des Abonnements (`/subscriptions`)

- **Vue globale de tous les abonnements**
- **Renouvellement automatique ou manuel**
- **Gestion des facturations**
- **Alertes d'expiration**

### Administration Système

- **Accès à toutes les données** de tous les établissements
- **Gestion des utilisateurs** de chaque établissement
- **Supervision des performances** système
- **Logs et audits** de sécurité

---

## 🎯 Pages Accessibles en tant que Super Admin

| Route | Description | Permissions |
|-------|-------------|-------------|
| `/tenant-dashboard` | Dashboard principal multi-établissements | ✅ Super Admin seulement |
| `/tenant/:id` | Détails d'un établissement spécifique | ✅ Super Admin seulement |
| `/tenant/:id/edit` | Modification d'un établissement | ✅ Super Admin seulement |
| `/plan-management` | Gestion des plans d'abonnement | ✅ Super Admin seulement |
| `/subscriptions` | Gestion des abonnements | ✅ Accessible |
| Toutes les autres routes | Accès complet au système | ✅ Permissions élevées |

---

## 🔒 Permissions du Super Admin

### Permissions Système
- `MANAGE_ALL_TENANTS` - Gestion de tous les établissements
- `MANAGE_ALL_USERS` - Gestion de tous les utilisateurs
- `MANAGE_SUBSCRIPTIONS` - Gestion des abonnements
- `MANAGE_PLANS` - Gestion des plans
- `SYSTEM_ADMIN` - Administration système
- `VIEW_ALL_DATA` - Vue sur toutes les données
- `MODIFY_ALL_DATA` - Modification de toutes les données
- `DELETE_ANY_DATA` - Suppression de données

### Différences avec un Admin d'Établissement

| Fonctionnalité | Admin Établissement | Super Admin |
|----------------|-------------------|-------------|
| Gestion de son établissement | ✅ | ✅ |
| Gestion d'autres établissements | ❌ | ✅ |
| Création de nouveaux établissements | ❌ | ✅ |
| Gestion des plans et tarifs | ❌ | ✅ |
| Vue globale multi-tenant | ❌ | ✅ |
| Administration système | ❌ | ✅ |

---

## 🚨 Dépannage

### Problème : "Domaine invalide pour super admin"

**Solution :** Assurez-vous d'utiliser exactement `SUPER_ADMIN` en majuscules dans le champ domaine.

### Problème : "Identifiants invalides"

**Solutions :**
1. Vérifiez que le super admin a été créé avec succès
2. Utilisez exactement ces identifiants :
   - Username : `superadmin`
   - Password : `SuperAdmin2024!`

### Problème : Page blanche après connexion

**Solutions :**
1. Vérifiez que le frontend est démarré sur http://localhost:5173
2. Consultez la console du navigateur pour les erreurs
3. Vérifiez que l'API backend répond sur http://localhost:3000

### Problème : Accès refusé à certaines pages

**Solution :** Vérifiez que vous êtes bien connecté en tant que super admin et non comme admin d'établissement.

### Problème : Erreur de connexion à la base de données

**Solutions :**
1. Vérifiez que MongoDB est démarré
2. Vérifiez la variable d'environnement `MONGODB_URI`
3. Redémarrez le serveur backend

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** du serveur backend
2. **Consultez la console** du navigateur
3. **Redémarrez** les services (frontend + backend)
4. **Vérifiez** que tous les ports sont accessibles :
   - Frontend : http://localhost:5173
   - Backend : http://localhost:3000
   - MongoDB : Port 27017 (ou MongoDB Atlas)

---

## 🔄 Changement de Mot de Passe

Pour changer le mot de passe du super admin :

1. Connectez-vous en tant que super admin
2. Allez dans le profil utilisateur
3. Utilisez la fonction "Changer le mot de passe"
4. Le nouveau mot de passe sera demandé lors de la prochaine connexion

---

## ⚡ Conseils d'Usage

1. **Sécurité :** Changez le mot de passe par défaut après la première connexion
2. **Backup :** Effectuez régulièrement des sauvegardes de la base de données
3. **Monitoring :** Surveillez les performances et l'usage des établissements
4. **Maintenance :** Planifiez des maintenances pendant les heures creuses

---

*Guide créé pour École Manager - Version Super Admin* 