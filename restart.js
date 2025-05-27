// Script pour nettoyer le cache et redémarrer l'application
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Nettoyage du cache et redémarrage de l\'application...');

// Créer ou mettre à jour le fichier .env.local
const envContent = `DATABASE_URL="mysql://root:@localhost:3306/gestion_ecole"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="votre_secret_tres_securise_pour_next_auth"`;

fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
console.log('Fichier .env.local créé/mis à jour');

// Supprimer le dossier .next
try {
    if (fs.existsSync(path.join(__dirname, '.next'))) {
        console.log('Suppression du dossier .next...');
        if (process.platform === 'win32') {
            execSync('rmdir /s /q .next', { stdio: 'inherit' });
        } else {
            execSync('rm -rf .next', { stdio: 'inherit' });
        }
    }
} catch (error) {
    console.error('Erreur lors de la suppression du dossier .next:', error);
}

console.log('Redémarrage du serveur de développement...');
console.log('Exécutez la commande: npm run dev');
console.log('---');
console.log('IMPORTANT: Après le redémarrage, veuillez vider le cache de votre navigateur et supprimer les cookies du site');