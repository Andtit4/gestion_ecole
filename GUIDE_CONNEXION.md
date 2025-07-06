# 🚀 Guide de Connexion - École Manager

Ce guide vous explique comment créer un admin et vous connecter à l'application.

## 📋 Prérequis

Assurez-vous d'avoir :
- ✅ Node.js installé (version 18+)
- ✅ MongoDB en fonctionnement (local ou distant)
- ✅ Les dépendances installées (`npm install` dans backend/ et dans le dossier racine)

## 🎯 Étape 1 : Démarrer le Backend

Ouvrez un terminal et exécutez :

```bash
cd backend
npm run start:dev
```

Attendez de voir le message : `Application is running on: http://[::1]:3000`

## 🏫 Étape 2 : Créer un Établissement avec Admin

Dans un **nouveau terminal**, exécutez :

```bash
cd backend
npm run create-admin
```

Le script va créer un établissement de test avec ces **identifiants par défaut** :

```
┌─────────────────────────────────────────────┐
│               CONNEXION ADMIN               │
├─────────────────────────────────────────────┤
│ 🌐 Domaine     : mon-ecole-test             │
│ 👤 Utilisateur : admin                     │
│ 🔑 Mot de passe: password123               │
│ 📧 Email       : admin@mon-ecole-test.fr   │
└─────────────────────────────────────────────┘
```

## 🖥️ Étape 3 : Démarrer le Frontend

Dans un **troisième terminal**, exécutez :

```bash
npm run dev
```

L'application sera accessible sur : `http://localhost:5173`

## 🔐 Étape 4 : Se Connecter

1. **Ouvrez votre navigateur** sur `http://localhost:5173`
2. **Vous serez automatiquement redirigé** vers la page de connexion
3. **Saisissez les identifiants** :
   - **Domaine :** `mon-ecole-test`
   - **Nom d'utilisateur :** `admin`
   - **Mot de passe :** `password123`
4. **Cliquez sur "Se connecter"**
5. **🎉 Vous êtes connecté !** Vous serez redirigé vers le dashboard

## 🛠️ Dépannage

### ❌ Problème : "Erreur de connexion"
- ✅ Vérifiez que le backend est démarré (`npm run start:dev`)
- ✅ Vérifiez que MongoDB fonctionne
- ✅ Vérifiez l'URL de connexion à MongoDB dans `.env`

### ❌ Problème : "Domaine introuvable"
- ✅ Relancez le script de création : `npm run create-admin`
- ✅ Vérifiez que le script s'est bien exécuté sans erreur

### ❌ Problème : Page blanche
- ✅ Vérifiez que le frontend est démarré (`npm run dev`)
- ✅ Videz le cache du navigateur (Ctrl+F5)

## 🔄 Créer d'Autres Établissements

Pour créer d'autres établissements, modifiez le fichier `backend/src/scripts/create-admin.ts` :

```typescript
const schoolData = {
  domain: 'nouvelle-ecole',           // Changez le domaine
  schoolName: 'Nouvelle École',       // Changez le nom
  adminUsername: 'admin',             // Gardez admin ou changez
  adminPassword: 'password123',       // Changez le mot de passe
  adminEmail: 'admin@nouvelle-ecole.fr' // Changez l'email
};
```

Puis relancez : `npm run create-admin`

## 📱 URLs Importantes

- **Frontend :** http://localhost:5173
- **Backend API :** http://localhost:3000
- **Page de connexion :** http://localhost:5173/school-login
- **Dashboard :** http://localhost:5173/school/dashboard (après connexion)

## 🎓 Fonctionnalités Disponibles

Après connexion, vous aurez accès à :

- ✅ **Dashboard** - Vue d'ensemble de l'établissement
- ✅ **Gestion des utilisateurs** - Professeurs et staff
- ✅ **Gestion des élèves** - Base de données élèves
- ✅ **Structure académique** - Classes, matières, emplois du temps
- ✅ **Évaluations** - Notes et bulletins
- ✅ **Paramètres** - Configuration de l'établissement

## 🔐 Sécurité

- 🔒 **Sessions sécurisées** - Expiration automatique après 24h
- 🔒 **Validation côté serveur** - Toutes les données sont validées
- 🔒 **Permissions** - Accès contrôlé selon les rôles
- 🔒 **Données chiffrées** - Mots de passe hashés avec bcrypt

## 📞 Support

En cas de problème :
1. Consultez les logs du terminal backend
2. Ouvrez les outils de développement du navigateur (F12)
3. Vérifiez l'onglet Console pour d'éventuelles erreurs

---

🎉 **Félicitations !** Vous êtes maintenant connecté à École Manager ! 