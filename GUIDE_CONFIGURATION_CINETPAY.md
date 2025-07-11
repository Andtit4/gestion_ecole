# 💳 Guide de Configuration CinetPay

## 🎯 Vue d'ensemble

L'intégration CinetPay permet d'accepter les paiements en ligne via :
- **Flooz** (Mobile Money)
- **Tmoney** (Mobile Money)  
- **Carte bancaire** (Visa, Mastercard)

## 🔧 Configuration

### 1. **Obtenir vos clés CinetPay**

1. Créez un compte sur [CinetPay](https://cinetpay.com)
2. Accédez à votre back-office
3. Allez dans **Intégration** pour récupérer :
   - `APIKEY` (votre clé API)
   - `SITE_ID` (identifiant de votre site)

### 2. **Configuration des variables d'environnement**

Créez un fichier `.env` à la racine du projet avec :

```env
# Configuration de l'API
VITE_API_URL=http://localhost:3000/api/v1

# Configuration CinetPay
VITE_CINETPAY_APIKEY=votre_vraie_apikey_ici
VITE_CINETPAY_SITE_ID=votre_vraie_site_id_ici

# URLs de callback (remplacer par votre domaine)
VITE_CINETPAY_NOTIFY_URL=https://votre-domaine.com/api/cinetpay/notify
VITE_CINETPAY_RETURN_URL=https://votre-domaine.com/payment/return

# Mode (TEST pour les tests, PRODUCTION pour la production)
VITE_CINETPAY_MODE=TEST
```

### 3. **Configuration du pays/devise**

Dans `src/services/cinetpayService.ts`, modifiez selon votre pays :

```typescript
this.config = {
  // ...autres configs
  currency: 'XAF', // XOF pour Sénégal/Burkina, XAF pour Cameroun/Gabon, etc.
  country: 'TG',   // TG pour Togo, CI pour Côte d'Ivoire, etc.
}
```

## 🚀 Fonctionnement

### **Flux de paiement**

1. **Sélection de la méthode** : L'utilisateur choisit Flooz, Tmoney ou Carte bancaire
2. **Initialisation** : L'application génère un lien de paiement CinetPay
3. **Redirection** : L'utilisateur est redirigé vers la plateforme CinetPay
4. **Paiement** : L'utilisateur effectue son paiement sur CinetPay
5. **Retour** : CinetPay notifie votre application du résultat

### **Méthodes supportées**

| Méthode | Channel CinetPay | Description |
|---------|------------------|-------------|
| **Flooz** | `MOBILE_MONEY` | Paiement mobile Moov |
| **Tmoney** | `MOBILE_MONEY` | Paiement mobile Togocom |
| **Carte bancaire** | `CREDIT_CARD` | Visa/Mastercard |
| **Espèces** | - | Paiement traditionnel (sans CinetPay) |
| **Paypal** | - | Paiement traditionnel (sans CinetPay) |

## 🔒 Sécurité

### **URLs de callback**

Les URLs `notify_url` et `return_url` doivent :
- Être accessibles publiquement (pas de localhost en production)
- Utiliser HTTPS en production
- Traiter les notifications CinetPay côté backend

### **Gestion des webhooks** (À implémenter côté backend)

```javascript
// Exemple d'endpoint de notification
app.post('/api/cinetpay/notify', (req, res) => {
  const { transaction_id, status, amount } = req.body
  
  if (status === 'ACCEPTED') {
    // Marquer le paiement comme confirmé en base
    // Envoyer confirmation à l'utilisateur
  }
  
  res.status(200).send('OK')
})
```

## 🧪 Tests

### **Mode TEST**

En mode TEST, utilisez les numéros de test CinetPay :
- **Flooz/Tmoney** : `+22890000000`
- **Carte** : `4111111111111111` (Visa test)

### **Vérification de la configuration**

La console affiche des logs pour vérifier :
```
✅ Méthodes de paiement configurées: ['Espèces', 'Flooz', 'Tmoney', 'Paypal', 'Carte bancaire']
🔄 Initialisation du paiement CinetPay: { transaction_id: "PAY_123...", amount: 5000, channel: "MOBILE_MONEY" }
✅ Paiement CinetPay initialisé avec succès: 5df64dd9c5447...
```

## ⚠️ Points importants

1. **Montants** : Doivent être des multiples de 5
2. **Devise** : Respecter la devise autorisée pour votre pays
3. **Callbacks** : Implémenter les webhooks pour la confirmation automatique
4. **Production** : Changer le mode en `PRODUCTION` et mettre les vraies URLs

## 🆘 Dépannage

### **Erreurs courantes**

| Erreur | Cause | Solution |
|--------|--------|----------|
| `Status: 609 AUTH_NOT_FOUND` | APIKEY incorrecte | Vérifier la clé API |
| `Status: 613 ERROR_SITE_ID_NOTVALID` | SITE_ID incorrect | Vérifier l'ID du site |
| `certificate has expired` | Certificat SSL expiré | Mettre à jour les certificats |
| `Page 400 accès interdit` | URL localhost | Utiliser IP ou domaine public |

### **Logs de débogage**

Activez les logs dans la console du navigateur pour diagnostiquer :
```javascript
console.log('🔄 Initialisation du paiement CinetPay:', paymentData)
```

## 📞 Support

- **Documentation CinetPay** : [https://docs.cinetpay.com](https://docs.cinetpay.com)
- **Support CinetPay** : Via votre back-office
- **Test de l'API** : Utilisez Postman avec les exemples fournis 