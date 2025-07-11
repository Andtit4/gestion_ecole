import api from './api'
import { fetchClasses, fetchAcademicYears } from './academicService'
import { fetchStudents } from './studentService'

export interface FraisScolaire {
  type: string
  montant: number
  description: string
  obligatoire?: boolean
  dateEcheance?: string
}

export interface Paiement {
  montant: number
  datePaiement: string
  methodePaiement: string
  numeroTransaction?: string
  remarques?: string
  dateEnregistrement?: string
}

export interface DocumentScolaire {
  nom: string
  type: string
  cheminFichier?: string
  dateCreation?: string
  dateExpiration?: string
  statut?: string
}

export interface DossierScolaire {
  id: string
  tenantId: string
  etudiantId: string
  nomEleve: string
  numeroMatricule: string
  classe: string
  anneeScolaire: string
  frais: FraisScolaire[]
  paiements: Paiement[]
  documents: DocumentScolaire[]
  statutPaiement: 'paye' | 'partiellement_paye' | 'impaye'
  fraisTotaux: number
  fraisPayes: number
  fraisRestants: number
  remarques?: string
  actif: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateDossierScolaire {
  etudiantId: string
  nomEleve: string
  numeroMatricule: string
  classe: string
  anneeScolaire: string
  frais?: FraisScolaire[]
  paiements?: Paiement[]
  documents?: DocumentScolaire[]
  remarques?: string
}

export interface ScolariteStatistics {
  activeDossiers: number
  fraisCollectes: number
  fraisEnAttente: number
  documentsTotal: number
  repartitionParStatut: any[]
  repartitionParClasse: any[]
}

export interface DossiersResponse {
  dossiers: DossierScolaire[]
  total: number
  page: number
  totalPages: number
}

export interface FiltersOptions {
  classe?: string
  anneeScolaire?: string
  statutPaiement?: 'paye' | 'partiellement_paye' | 'impaye'
  search?: string
}

// Les fonctions de cache et de résolution de domaine ne sont plus nécessaires
// car nous utilisons la même approche que teacherService (tenant ID direct)

// Helper pour créer les headers avec tenant ID (même approche que teacherService)
const createTenantHeaders = (tenantId: string) => {
  return {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId, // Même approche que teacherService
  }
}

// Helper pour les requêtes avec tenant
const makeRequest = async (method: string, url: string, tenantId: string, data?: any) => {
  const headers = createTenantHeaders(tenantId) // Plus besoin d'async
  
  const config: RequestInit = {
    method,
    headers,
  }
  
  if (data) {
    config.body = JSON.stringify(data)
  }
  
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}${url}`, config)
  
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    
    try {
      const errorData = JSON.parse(errorText)
      if (errorData.message) {
        errorMessage = errorData.message
      }
    } catch (e) {
      if (errorText) {
        errorMessage = errorText
      }
    }
    
    throw new Error(errorMessage)
  }
  
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  }
  
  return null
}

class ScolariteService {
  private baseUrl = '/scolarite'

  // Dossiers scolaires
  async createDossier(dossier: CreateDossierScolaire, tenantId: string): Promise<DossierScolaire> {
    try {
      const response = await makeRequest('POST', `${this.baseUrl}/dossiers`, tenantId, dossier)
      return response
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error)
      throw error
    }
  }

  async getDossiers(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    filters: FiltersOptions = {}
  ): Promise<DossiersResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      })

      const response = await makeRequest('GET', `${this.baseUrl}/dossiers?${params}`, tenantId)
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des dossiers:', error)
      throw error
    }
  }

  async getDossier(id: string, tenantId: string): Promise<DossierScolaire> {
    try {
      const response = await makeRequest('GET', `${this.baseUrl}/dossiers/${id}`, tenantId)
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération du dossier:', error)
      throw error
    }
  }

  async getDossierByMatricule(matricule: string, tenantId: string): Promise<DossierScolaire> {
    try {
      const response = await makeRequest('GET', `${this.baseUrl}/dossiers/matricule/${matricule}`, tenantId)
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération du dossier par matricule:', error)
      throw error
    }
  }

  async updateDossier(id: string, updates: Partial<CreateDossierScolaire>, tenantId: string): Promise<DossierScolaire> {
    try {
      const response = await makeRequest('PATCH', `${this.baseUrl}/dossiers/${id}`, tenantId, updates)
      return response
    } catch (error) {
      console.error('Erreur lors de la mise à jour du dossier:', error)
      throw error
    }
  }

  // Frais scolaires
  async addFrais(dossierId: string, frais: FraisScolaire, tenantId: string): Promise<DossierScolaire> {
    try {
      const response = await makeRequest('POST', `${this.baseUrl}/dossiers/${dossierId}/frais`, tenantId, frais)
      return response
    } catch (error) {
      console.error('Erreur lors de l\'ajout des frais:', error)
      throw error
    }
  }

  // Paiements
  async addPaiement(dossierId: string, paiement: Paiement, tenantId: string): Promise<DossierScolaire> {
    try {
      const response = await makeRequest('POST', `${this.baseUrl}/dossiers/${dossierId}/paiements`, tenantId, paiement)
      return response
    } catch (error) {
      console.error('Erreur lors de l\'ajout du paiement:', error)
      throw error
    }
  }

  // Documents
  async addDocument(dossierId: string, document: DocumentScolaire, tenantId: string): Promise<DossierScolaire> {
    try {
      const response = await makeRequest('POST', `${this.baseUrl}/dossiers/${dossierId}/documents`, tenantId, document)
      return response
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error)
      throw error
    }
  }

  // Statistiques
  async getStatistics(tenantId: string, anneeScolaire?: string): Promise<ScolariteStatistics> {
    try {
      const params = anneeScolaire ? `?anneeScolaire=${anneeScolaire}` : ''
      const response = await makeRequest('GET', `${this.baseUrl}/statistics${params}`, tenantId)
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }

  // Rapports
  async getFinancialReport(
    tenantId: string,
    anneeScolaire: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    try {
      const params = new URLSearchParams({ anneeScolaire })
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const response = await makeRequest('GET', `${this.baseUrl}/reports/financial?${params}`, tenantId)
      return response
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error)
      throw error
    }
  }

  // Données utilitaires - maintenant utilise les vraies données académiques
  async getAvailableClasses(tenantId: string): Promise<{ classes: string[] }> {
    try {
      // Utiliser les vraies classes académiques
      const academicClasses = await fetchClasses(tenantId)
      const classNames = academicClasses.map(cls => cls.name)
      
      return { classes: classNames }
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error)
      // Fallback vers l'ancien endpoint si nécessaire
      try {
        const response = await makeRequest('GET', `${this.baseUrl}/classes`, tenantId)
        return response
      } catch (fallbackError) {
        console.error('Erreur fallback:', fallbackError)
        throw error
      }
    }
  }

  async getFraisTypes(tenantId: string): Promise<{ types: string[] }> {
    try {
      const response = await makeRequest('GET', `${this.baseUrl}/frais-types`, tenantId)
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des types de frais:', error)
      throw error
    }
  }

  async getMethodesPaiement(tenantId: string): Promise<{ methodes: string[] }> {
    try {
      const response = await makeRequest('GET', `${this.baseUrl}/methodes-paiement`, tenantId)
      return response
    } catch (error) {
      console.error('Erreur lors de la récupération des méthodes de paiement:', error)
      throw error
    }
  }

  async getAnneesScolaires(tenantId: string): Promise<{ annees: string[] }> {
    try {
      // Utiliser les vraies années scolaires académiques
      const academicYears = await fetchAcademicYears(tenantId)
      const yearNames = academicYears.map(year => year.name)
      
      return { annees: yearNames }
    } catch (error) {
      console.error('Erreur lors de la récupération des années scolaires:', error)
      // Fallback vers l'ancien endpoint si nécessaire  
      try {
        const response = await makeRequest('GET', `${this.baseUrl}/annees-scolaires`, tenantId)
        return response
      } catch (fallbackError) {
        console.error('Erreur fallback:', fallbackError)
        throw error
      }
    }
  }

  // Nouvelle méthode pour récupérer les élèves actifs
  async getAvailableStudents(tenantId: string) {
    try {
      // Utiliser fetchStudents au lieu de getStudents pour avoir la même réponse que SchoolStudentManagement
      const { fetchStudents } = await import('./studentService')
      const response = await fetchStudents(tenantId, 1, 1000) // Récupérer jusqu'à 1000 élèves
      
      // Filtrer uniquement les élèves actifs
      const allStudents = response.students || []
      console.log('Debug: Tous les étudiants récupérés:', allStudents.length)
      
      return allStudents.filter(student => {
        // Gérer différents emplacements du statut
        const status = student.academicInfo?.status || student.status
        console.log('Debug: Étudiant', student.firstName, student.lastName, 'status:', status)
        return status === 'active'
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des élèves:', error)
      throw error
    }
  }
}

export const scolariteService = new ScolariteService()
export default scolariteService 