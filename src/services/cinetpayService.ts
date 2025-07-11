export interface CinetPayPaymentRequest {
  apikey: string
  site_id: string
  transaction_id: string
  amount: number
  currency: string
  description: string
  notify_url: string
  return_url: string
  channels: 'MOBILE_MONEY' | 'CREDIT_CARD' | 'ALL'
  lang?: string
  metadata?: string
  customer_id?: string
  customer_name?: string
  customer_surname?: string
  customer_email?: string
  customer_phone_number?: string
  customer_address?: string
  customer_city?: string
  customer_country?: string
  customer_state?: string
  customer_zip_code?: string
  invoice_data?: {
    [key: string]: string
  }
}

export interface CinetPayPaymentResponse {
  code: string
  message: string
  description: string
  data?: {
    payment_token: string
    payment_url: string
  }
  api_response_id: string
}

export interface CinetPayConfig {
  apikey: string
  site_id: string
  notify_url: string
  return_url: string
  currency: string
  country: string
  mode: 'TEST' | 'PRODUCTION'
}

class CinetPayService {
  private config: CinetPayConfig
  private readonly apiUrl = 'https://api-checkout.cinetpay.com/v2/payment'

  constructor() {
    // Configuration par défaut - À remplacer par vos vraies clés
    this.config = {
      apikey: import.meta.env.VITE_CINETPAY_APIKEY || '18009367496604431a245a46.85929512',
      site_id: import.meta.env.VITE_CINETPAY_SITE_ID || '5870321',
      notify_url: import.meta.env.VITE_CINETPAY_NOTIFY_URL || 'https://webhook.site/test-notify',
      return_url: import.meta.env.VITE_CINETPAY_RETURN_URL || 'https://webhook.site/test-return',
      currency: 'XOF', // Franc CFA UEMOA (Togo, Sénégal, Burkina, etc.)
      country: 'TG', // Togo
      mode: (import.meta.env.VITE_CINETPAY_MODE as 'TEST' | 'PRODUCTION') || 'TEST'
    }
  }

  /**
   * Génère un ID de transaction unique
   */
  generateTransactionId(): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 100000)
    return `PAY_${timestamp}_${random}`
  }

  /**
   * Nettoie une chaîne en supprimant les caractères spéciaux
   */
  private sanitizeString(str: string): string {
    if (!str) return ''
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-zA-Z0-9\s\-_\.]/g, '') // Garde seulement lettres, chiffres, espaces, tirets, underscores, points
      .trim()
  }

  /**
   * Nettoie un email pour s'assurer qu'il est valide
   */
  private sanitizeEmail(email: string): string {
    if (!email || !email.includes('@')) {
      return 'test@example.com'
    }
    
    // Supprimer les accents et caractères spéciaux
    const cleaned = email
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-zA-Z0-9@._-]/g, '') // Garde seulement caractères valides pour email
      .trim()
    
    // Vérifier le format basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleaned)) {
      return 'test@example.com'
    }
    
    return cleaned
  }

  /**
   * Nettoie un numéro de téléphone
   */
  private sanitizePhone(phone: string): string {
    if (!phone) return '+22890000000'
    
    // Supprimer tous les caractères non numériques sauf le +
    const cleaned = phone.replace(/[^\d+]/g, '')
    
    // S'assurer qu'il commence par +
    if (!cleaned.startsWith('+')) {
      return '+228' + cleaned
    }
    
    return cleaned
  }

  /**
   * Détermine le channel selon la méthode de paiement
   */
  private getChannelFromMethod(methodePaiement: string): 'MOBILE_MONEY' | 'CREDIT_CARD' | 'ALL' {
    switch (methodePaiement.toLowerCase()) {
      case 'flooz':
      case 'tmoney':
        return 'MOBILE_MONEY'
      case 'carte bancaire':
        return 'CREDIT_CARD'
      default:
        return 'ALL'
    }
  }

  /**
   * Initialise un paiement CinetPay
   */
  async initiatePayment(
    amount: number,
    description: string,
    methodePaiement: string,
    studentInfo: {
      nom: string
      prenom: string
      email?: string
      telephone?: string
      matricule: string
      classe: string
      anneeScolaire: string
    },
    etablissementInfo?: {
      nom: string
      adresse: string
    }
  ): Promise<CinetPayPaymentResponse> {
    try {
      // Vérifier que le montant est un multiple de 5 et suffisant
      if (amount % 5 !== 0) {
        throw new Error('Le montant doit être un multiple de 5')
      }
      
      // Certains comptes CinetPay ont un minimum de 100 FCFA
      if (amount < 100) {
        throw new Error('Le montant minimum est de 100 FCFA')
      }

      const transactionId = this.generateTransactionId()
      const channel = this.getChannelFromMethod(methodePaiement)

      console.log('🔍 Debug CinetPay - Configuration:', {
        apikey: this.config.apikey ? `${this.config.apikey.substring(0, 10)}...` : 'MANQUANT',
        site_id: this.config.site_id,
        currency: this.config.currency,
        country: this.config.country,
        mode: this.config.mode,
        notify_url: this.config.notify_url,
        return_url: this.config.return_url
      })

      // Vérification des URLs (CinetPay n'accepte pas localhost)
      if (this.config.notify_url.includes('localhost') || this.config.return_url.includes('localhost')) {
        console.warn('⚠️ ATTENTION: CinetPay ne fonctionne pas avec localhost')
        console.warn('💡 Utilisation d\'URLs de test publiques')
        
        // Pour les tests, utiliser des URLs de test valides
        this.config.notify_url = 'https://webhook.site/unique-notify-id'
        this.config.return_url = 'https://webhook.site/unique-return-id'
        
        console.log('🔧 URLs modifiées pour le test:', {
          notify_url: this.config.notify_url,
          return_url: this.config.return_url
        })
      }

      // Alerte si on est en mode TEST
      if (this.config.mode === 'TEST') {
        console.log('🧪 MODE TEST - Utilisez les numéros de test CinetPay')
        console.log('📱 Numéro Flooz/Tmoney test: +22890000000')
      }

      // Préparer les données de base
      const paymentData: CinetPayPaymentRequest = {
        apikey: this.config.apikey,
        site_id: this.config.site_id,
        transaction_id: transactionId,
        amount: amount,
        currency: this.config.currency,
        description: description || `Paiement frais scolaires`,
        notify_url: this.config.notify_url,
        return_url: this.config.return_url,
        channels: channel,
        lang: 'fr',
        metadata: `student_${studentInfo.matricule}`,
        invoice_data: {
          'Eleve': `${studentInfo.prenom} ${studentInfo.nom}`,
          'Matricule': studentInfo.matricule,
          'Classe': studentInfo.classe
        }
      }

      // Ajouter les informations client OBLIGATOIRES pour tous les types de paiement
      // (Pas seulement pour la carte bancaire)
      paymentData.customer_id = this.sanitizeString(studentInfo.matricule) || 'TEST001'
      paymentData.customer_name = this.sanitizeString(studentInfo.nom) || 'Test'
      paymentData.customer_surname = this.sanitizeString(studentInfo.prenom) || 'User'
      paymentData.customer_email = this.sanitizeEmail(studentInfo.email || `${studentInfo.matricule}@example.com`)
      paymentData.customer_phone_number = this.sanitizePhone(studentInfo.telephone || '+22890000000')
      paymentData.customer_address = this.sanitizeString(etablissementInfo?.adresse || 'Lome')
      paymentData.customer_city = 'Lome'
      paymentData.customer_country = this.config.country
      paymentData.customer_state = this.config.country
      paymentData.customer_zip_code = '01000'

      // Nettoyer la description pour éviter les caractères spéciaux
      paymentData.description = this.sanitizeString(description) || 'Paiement frais scolaires'

      // Nettoyer les données de facturation
      if (paymentData.invoice_data) {
        const cleanedInvoiceData: { [key: string]: string } = {}
        Object.entries(paymentData.invoice_data).forEach(([key, value]) => {
          cleanedInvoiceData[this.sanitizeString(key)] = this.sanitizeString(value)
        })
        paymentData.invoice_data = cleanedInvoiceData
      }

      console.log('🔍 Debug CinetPay - Données de paiement:', {
        transaction_id: transactionId,
        amount,
        currency: paymentData.currency,
        description: paymentData.description,
        channels: channel,
        customer_name: paymentData.customer_name,
        customer_surname: paymentData.customer_surname,
        customer_email: paymentData.customer_email,
        customer_phone_number: paymentData.customer_phone_number,
        customer_country: paymentData.customer_country,
        notify_url: paymentData.notify_url,
        return_url: paymentData.return_url
      })

      // Validation des champs obligatoires
      const requiredFields = [
        { name: 'apikey', value: paymentData.apikey },
        { name: 'site_id', value: paymentData.site_id },
        { name: 'transaction_id', value: paymentData.transaction_id },
        { name: 'amount', value: paymentData.amount },
        { name: 'currency', value: paymentData.currency },
        { name: 'description', value: paymentData.description },
        { name: 'notify_url', value: paymentData.notify_url },
        { name: 'return_url', value: paymentData.return_url },
        { name: 'channels', value: paymentData.channels },
        { name: 'customer_name', value: paymentData.customer_name },
        { name: 'customer_surname', value: paymentData.customer_surname },
        { name: 'customer_email', value: paymentData.customer_email },
        { name: 'customer_phone_number', value: paymentData.customer_phone_number },
        { name: 'customer_address', value: paymentData.customer_address },
        { name: 'customer_city', value: paymentData.customer_city },
        { name: 'customer_country', value: paymentData.customer_country },
        { name: 'customer_state', value: paymentData.customer_state },
        { name: 'customer_zip_code', value: paymentData.customer_zip_code }
      ]

      const missingFields = requiredFields.filter(field => !field.value || field.value.toString().trim() === '')
      
      if (missingFields.length > 0) {
        console.error('❌ Champs obligatoires manquants:', missingFields.map(f => f.name))
        throw new Error(`Champs obligatoires manquants: ${missingFields.map(f => f.name).join(', ')}`)
      }

      console.log('✅ Validation des champs: OK')

      console.log('🔄 Initialisation du paiement CinetPay:', {
        transaction_id: transactionId,
        amount,
        currency: this.config.currency,
        channel,
        method: methodePaiement
      })

      // Effectuer la requête
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'GestionEcole/1.0'
        },
        body: JSON.stringify(paymentData)
      })

      // Lire la réponse en tant que texte d'abord pour le debug
      const responseText = await response.text()
      console.log('📥 Réponse brute CinetPay:', responseText)

      let result: CinetPayPaymentResponse
      try {
        result = JSON.parse(responseText) as CinetPayPaymentResponse
      } catch (parseError) {
        console.error('❌ Erreur de parsing JSON:', parseError)
        console.error('📥 Réponse non-JSON:', responseText)
        throw new Error(`Réponse invalide de CinetPay: ${responseText}`)
      }

      console.log('📥 Réponse CinetPay parsée:', result)

      if (!response.ok) {
        console.error('❌ Erreur HTTP:', response.status, response.statusText)
        console.error('❌ Corps de la réponse:', result)
        
        // Analyser l'erreur 400 spécifiquement
        if (response.status === 400) {
          console.error('🔍 Analyse erreur 400 - Données envoyées:', JSON.stringify(paymentData, null, 2))
          
          if (result.message) {
            throw new Error(`Erreur CinetPay 400: ${result.message}${result.description ? ` - ${result.description}` : ''}`)
          } else {
            throw new Error(`Erreur 400: Données invalides - ${responseText}`)
          }
        }
        
        throw new Error(`Erreur HTTP ${response.status}: ${result.message || response.statusText}`)
      }

      if (result.code !== '201') {
        console.error('❌ Erreur CinetPay - Code:', result.code)
        console.error('❌ Erreur CinetPay - Message:', result.message)
        console.error('❌ Erreur CinetPay - Description:', result.description)
        throw new Error(`Erreur CinetPay ${result.code}: ${result.description || result.message}`)
      }

      console.log('✅ Paiement CinetPay initialisé avec succès:', result.data?.payment_token)

      return result

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du paiement CinetPay:', error)
      
      // Log des détails de l'erreur si c'est une erreur fetch
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Erreur de connexion à l\'API CinetPay. Vérifiez votre connexion internet.')
      }
      
      throw error
    }
  }

  /**
   * Vérifie la configuration CinetPay
   */
  isConfigured(): boolean {
    return (
      this.config.apikey !== 'YOUR_APIKEY_HERE' &&
      this.config.site_id !== 'YOUR_SITE_ID_HERE' &&
      this.config.apikey.length > 10 &&
      this.config.site_id.length > 3
    )
  }

  /**
   * Obtient la configuration actuelle (sans les clés sensibles)
   */
  getPublicConfig() {
    return {
      currency: this.config.currency,
      country: this.config.country,
      mode: this.config.mode,
      configured: this.isConfigured()
    }
  }

  /**
   * Met à jour la configuration
   */
  updateConfig(newConfig: Partial<CinetPayConfig>) {
    this.config = { ...this.config, ...newConfig }
  }
}

export const cinetpayService = new CinetPayService()
export default cinetpayService 