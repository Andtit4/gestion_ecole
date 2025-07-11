# 🔍 Diagnostic CinetPay - Erreur de Paiement

## 🚨 Erreur rencontrée
```
Une erreur s'est produite, votre paiement a échoué
```

## 📋 Vérifications à effectuer

### 1. **Statut du compte marchand**
- [ ] Connectez-vous à votre back-office CinetPay
- [ ] Vérifiez le statut de votre compte (Actif/En attente/Suspendu)
- [ ] Assurez-vous que le service est bien configuré

### 2. **Configuration du service**
- [ ] Allez dans **Services** > **Votre service**
- [ ] Vérifiez que le service est **identifié** et **actif**
- [ ] Contrôlez les URLs de notification et retour

### 3. **Limites et restrictions**
- [ ] Vérifiez les limites de transaction (montant min/max)
- [ ] Contrôlez les restrictions géographiques
- [ ] Assurez-vous que Flooz/Tmoney sont activés

### 4. **Mode Test vs Production**
- [ ] Vérifiez si vous êtes en mode TEST ou PRODUCTION
- [ ] En mode TEST, utilisez les numéros de test CinetPay

## 🛠️ Solutions à tester

### Solution 1: Changer la devise
Le Togo utilise XOF, mais votre compte pourrait être configuré différemment.

### Solution 2: URLs de callback
Les URLs localhost ne fonctionnent pas avec CinetPay en production.

### Solution 3: Numéros de test
En mode TEST, utilisez les numéros fournis par CinetPay :
- **Flooz test** : +22890000000
- **Tmoney test** : +22890000000

### Solution 4: Montant minimum
Certains comptes ont un montant minimum (ex: 100 FCFA au lieu de 5 FCFA).

## 📞 Support CinetPay
Si le problème persiste :
1. Contactez le support CinetPay via votre back-office
2. Mentionnez l'erreur et votre transaction_id
3. Demandez la vérification de votre configuration 