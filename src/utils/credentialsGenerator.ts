/**
 * Générateur d'identifiants et mots de passe sécurisés
 */

/**
 * Génère un nom d'utilisateur basé sur le prénom et nom
 */
export function generateUsername(firstName: string, lastName: string): string {
  const cleanFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '')
  const cleanLastName = lastName.toLowerCase().replace(/[^a-z]/g, '')
  
  // Format: prenom.nom
  let username = `${cleanFirstName}.${cleanLastName}`
  
  // Si le nom d'utilisateur est trop long, le tronquer
  if (username.length > 20) {
    username = username.substring(0, 20)
  }
  
  return username
}

/**
 * Génère un mot de passe sécurisé
 */
export function generateSecurePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'
  
  const allChars = uppercase + lowercase + numbers + symbols
  
  let password = ''
  
  // Assurer au moins un caractère de chaque type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Remplir le reste avec des caractères aléatoires
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Mélanger le mot de passe
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Génère un mot de passe simple pour les étudiants
 */
export function generateStudentPassword(): string {
  const consonants = 'bcdfghjklmnpqrstvwxz'
  const vowels = 'aeiouy'
  const numbers = '0123456789'
  
  let password = ''
  
  // Format: CVCVCV + 2 chiffres (ex: "mupalo23")
  for (let i = 0; i < 6; i++) {
    if (i % 2 === 0) {
      password += consonants[Math.floor(Math.random() * consonants.length)]
    } else {
      password += vowels[Math.floor(Math.random() * vowels.length)]
    }
  }
  
  // Ajouter 2 chiffres
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  
  return password
}

/**
 * Génère un identifiant unique basé sur le nom et la date
 */
export function generateUniqueId(firstName: string, lastName: string): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
  
  return `${initials}${year}${month}${day}${random}`
}

/**
 * Valide la force d'un mot de passe
 */
export function validatePasswordStrength(password: string): {
  score: number
  feedback: string[]
  isStrong: boolean
} {
  const feedback: string[] = []
  let score = 0
  
  // Longueur
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Le mot de passe doit contenir au moins 8 caractères')
  }
  
  // Lettres majuscules
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Ajoutez au moins une lettre majuscule')
  }
  
  // Lettres minuscules
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Ajoutez au moins une lettre minuscule')
  }
  
  // Chiffres
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Ajoutez au moins un chiffre')
  }
  
  // Caractères spéciaux
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Ajoutez au moins un caractère spécial')
  }
  
  return {
    score,
    feedback,
    isStrong: score >= 4
  }
}

/**
 * Génère des identifiants complets pour un étudiant
 */
export function generateStudentCredentials(firstName: string, lastName: string, email: string): {
  username: string
  password: string
  email: string
} {
  return {
    username: generateUsername(firstName, lastName),
    password: generateStudentPassword(),
    email: email.toLowerCase()
  }
} 