# Guide de Résolution - Redirection vers /school-login

## 🔍 Problème Identifié

Quand vous accédez à `/admin/accounts`, vous êtes redirigé vers `/school-login` au lieu d'accéder à la page.

## 🛠️ Solution Étape par Étape

### 1. Utilisez le système de diagnostic

Nous avons ajouté des outils de diagnostic complets. Voici comment les utiliser :

#### A. Connectez-vous d'abord
```
URL: http://localhost:3000/school-login
Domaine: mon-ecole-test
Nom d'utilisateur: admin
Mot de passe: password123
```

#### B. Ouvrez la console du navigateur (F12)

#### C. Exécutez le diagnostic
```javascript
window.authDebug.checkAuth()
```

### 2. Vérifiez les logs de navigation

Après avoir tenté d'accéder à `/admin/accounts`, regardez les logs dans la console. Vous devriez voir :

```
Navigation: /school/dashboard -> /admin/accounts
Route meta: { title: 'Gestion des Comptes', requiresAuth: true, adminOnly: true }
Auth state check: { 
  isAuthenticated: true/false,
  currentSchool: {...},
  adminOnly: true,
  ... 
}
```

### 3. Points de Vérification

| Vérification | Attendu | Action si Échec |
|--------------|---------|----------------|
| `isAuthenticated: true` | ✅ | Reconnectez-vous |
| `currentSchool: {...}` | ✅ Objet école | Problème de session |
| `adminOnly: true` | ✅ | Route protégée admin |
| Session valide | ✅ | Token expiré |

### 4. Solutions Selon le Diagnostic

#### A. Si `isAuthenticated: false`
```javascript
// Forcer la déconnexion et reconnecter
window.authDebug.logout()
// Puis reconnectez-vous
```

#### B. Si `currentSchool: null`
```javascript
// Vérifier le localStorage
window.authDebug.checkAuth()
// Si les données sont corrompues :
window.authDebug.clearStorage()
// Puis reconnectez-vous
```

#### C. Si session invalide
```javascript
// Tester la validation de session
await window.authDebug.validateSession()
// Si false, reconnectez-vous
```

### 5. Connexion avec le Super-Admin

Si le problème persiste, utilisez le super-admin système :

```
Domaine: SUPER_ADMIN
Nom d'utilisateur: superadmin
Mot de passe: SuperAdmin2024!
```

Ce compte a **garantie d'accès** à toutes les routes `adminOnly`.

### 6. Vérifications Backend

#### A. Vérifiez que le backend fonctionne
```bash
cd backend
npm run start:dev
```

#### B. Testez l'API directement
```bash
curl http://localhost:8000/tenants
```

### 7. Solutions Avancées

#### A. Nettoyer complètement le navigateur
```javascript
// Vider tout le stockage
localStorage.clear()
sessionStorage.clear()
// Puis rechargez la page et reconnectez-vous
```

#### B. Vérifier la base de données
```javascript
// Dans MongoDB Compass ou mongo shell
db.tenants.find({ "domain": "mon-ecole-test" })
db.users.find({ "role": "admin" })
```

## 🎯 Solution Rapide (Recommandée)

1. **Ouvrez la console** (F12)
2. **Exécutez** : `window.authDebug.checkAuth()`
3. **Copiez les résultats** et analysez l'état
4. **Si tout semble OK**, testez : `await window.authDebug.validateSession()`
5. **Si ça retourne false** : Reconnectez-vous
6. **Si le problème persiste** : Utilisez le super-admin `SUPER_ADMIN`

## 🐛 Debug Avancé

### Logs à surveiller dans la console :

```
✅ Navigation: /school/dashboard -> /admin/accounts
✅ Auth state check: { isAuthenticated: true, ... }
✅ Validation de session en cours...
✅ Session valide
✅ Vérification des permissions admin...
✅ Admin check: { isSuperAdmin: false, currentSchool: {...} }
✅ Admin d'établissement avec école valide, accès autorisé
✅ Toutes les vérifications passées, accès autorisé
```

### En cas d'échec, vous verrez :
```
❌ Redirection vers login - utilisateur non authentifié
❌ Session invalide, redirection vers login
❌ Admin d'établissement sans école assignée, accès refusé
```

## 📞 Support

Si aucune de ces solutions ne fonctionne :

1. **Partagez les logs** de la console après `window.authDebug.checkAuth()`
2. **Indiquez** quelle étape échoue spécifiquement
3. **Vérifiez** que le backend est bien démarré sur le port 8000

---

*Ce guide devrait résoudre 99% des problèmes de redirection vers /school-login* 