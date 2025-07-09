import api from './api'

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

class ScolariteService {
  private baseUrl = '/api/scolarite'

  // Dossiers scolaires
  async createDossier(dossier: CreateDossierScolaire): Promise<DossierScolaire> {
    try {
      const response = await api.post(`${this.baseUrl}/dossiers`, dossier)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création du dossier:', error)
      throw error
    }
  }

  async getDossiers(
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

      const response = await api.get(`${this.baseUrl}/dossiers?${params}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des dossiers:', error)
      throw error
    }
  }

  async getDossier(id: string): Promise<DossierScolaire> {
    try {
      const response = await api.get(`${this.baseUrl}/dossiers/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du dossier:', error)
      throw error
    }
  }

  async getDossierByMatricule(matricule: string): Promise<DossierScolaire> {
    try {
      const response = await api.get(`${this.baseUrl}/dossiers/matricule/${matricule}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du dossier par matricule:', error)
      throw error
    }
  }

  async updateDossier(id: string, updates: Partial<CreateDossierScolaire>): Promise<DossierScolaire> {
    try {
      const response = await api.patch(`${this.baseUrl}/dossiers/${id}`, updates)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du dossier:', error)
      throw error
    }
  }

  async deleteDossier(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`${this.baseUrl}/dossiers/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression du dossier:', error)
      throw error
    }
  }

  // Gestion des frais
  async addFrais(dossierId: string, frais: FraisScolaire): Promise<DossierScolaire> {
    try {
      const response = await api.post(`${this.baseUrl}/dossiers/${dossierId}/frais`, frais)
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'ajout des frais:', error)
      throw error
    }
  }

  // Gestion des paiements
  async addPaiement(dossierId: string, paiement: Paiement): Promise<DossierScolaire> {
    try {
      const response = await api.post(`${this.baseUrl}/dossiers/${dossierId}/paiements`, paiement)
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'ajout du paiement:', error)
      throw error
    }
  }

  // Gestion des documents
  async addDocument(dossierId: string, document: DocumentScolaire): Promise<DossierScolaire> {
    try {
      const response = await api.post(`${this.baseUrl}/dossiers/${dossierId}/documents`, document)
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error)
      throw error
    }
  }

  // Statistiques
  async getStatistics(anneeScolaire?: string): Promise<ScolariteStatistics> {
    try {
      const params = anneeScolaire ? `?anneeScolaire=${anneeScolaire}` : ''
      const response = await api.get(`${this.baseUrl}/statistics${params}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }

  // Rapports
  async getFinancialReport(
    anneeScolaire: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    try {
      const params = new URLSearchParams({ anneeScolaire })
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await api.get(`${this.baseUrl}/reports/financial?${params}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la génération du rapport financier:', error)
      throw error
    }
  }

  // Données utilitaires
  async getAvailableClasses(): Promise<{ classes: string[] }> {
    try {
      const response = await api.get(`${this.baseUrl}/classes`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des classes:', error)
      throw error
    }
  }

  async getFraisTypes(): Promise<{ types: string[] }> {
    try {
      const response = await api.get(`${this.baseUrl}/frais-types`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des types de frais:', error)
      throw error
    }
  }

  async getMethodesPaiement(): Promise<{ methodes: string[] }> {
    try {
      const response = await api.get(`${this.baseUrl}/methodes-paiement`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des méthodes de paiement:', error)
      throw error
    }
  }

  async getAnneesScolaires(): Promise<{ annees: string[] }> {
    try {
      const response = await api.get(`${this.baseUrl}/annees-scolaires`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des années scolaires:', error)
      throw error
    }
  }
}

export default new ScolariteService() 