// Script pour nettoyer le cache et redémarrer l'application
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Nettoyage du cache et redémarrage de l\'application...');

// Supprimer le dossier .next
try {
    if (fs.existsSync(path.join(__dirname, '.next'))) {
        console.log('🗑️  Suppression du dossier .next...');
        if (process.platform === 'win32') {
            execSync('rmdir /s /q .next', { stdio: 'inherit' });
        } else {
            execSync('rm -rf .next', { stdio: 'inherit' });
        }
    }
} catch (error) {
    console.error('❌ Erreur lors de la suppression du dossier .next:', error);
}

console.log('✅ Nettoyage terminé!');
console.log('');
console.log('🚀 Pour redémarrer le serveur de développement, exécutez:');
console.log('npm run dev');
console.log('');
console.log('🔴 IMPORTANT: Après le redémarrage:');
console.log('1. Videz le cache de votre navigateur (Ctrl+F5 / Cmd+Shift+R)');
console.log('2. Supprimez les cookies du site');
console.log('3. Rechargez la page');
console.log('');
console.log('Les modifications de design devraient maintenant être visibles!');