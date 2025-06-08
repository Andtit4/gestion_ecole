/**
 * API client pour les bulletins de notes
 * Ce fichier contient des fonctions utilitaires pour interagir avec l'API des bulletins
 */

// Types pour les bulletins
export type ReportCardStatus = 'DRAFT' | 'PUBLISHED'

export interface ReportCardCreateInput {
  studentId: string
  periodId: string
  average?: number
  appreciation?: string
  status: ReportCardStatus
}

export interface ReportCardUpdateInput {
  id: string
  average?: number
  appreciation?: string
  status?: ReportCardStatus
}

export interface ReportCardBatchCreateInput {
  classId: string
  periodId: string
  appreciation?: string
  status?: ReportCardStatus
}

// Fonction pour récupérer tous les bulletins (avec filtres optionnels)
export async function getAllReportCards(filters: {
  periodId?: string
  status?: ReportCardStatus
} = {}) {
  try {
    // Construire l'URL avec les filtres
    const params = new URLSearchParams()
    
    if (filters.periodId) {
      params.append('periodId', filters.periodId)
    }
    
    if (filters.status) {
      params.append('status', filters.status)
    }
    
    const url = `/api/report-cards${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des bulletins:', error)
    throw error
  }
}

// Fonction pour récupérer un bulletin spécifique
export async function getReportCard(id: string) {
  try {
    const response = await fetch(`/api/report-cards/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération du bulletin ${id}:`, error)
    throw error
  }
}

// Fonction pour récupérer les bulletins d'un élève
export async function getStudentReportCards(studentId: string, schoolYear?: string) {
  try {
    const params = new URLSearchParams({ studentId })
    
    if (schoolYear) {
      params.append('schoolYear', schoolYear)
    }
    
    const response = await fetch(`/api/report-cards/student?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération des bulletins de l'élève ${studentId}:`, error)
    throw error
  }
}

// Fonction pour récupérer les bulletins d'une classe
export async function getClassReportCards(classId: string, periodId?: string, status?: ReportCardStatus) {
  try {
    const params = new URLSearchParams({ classId })
    
    if (periodId) {
      params.append('periodId', periodId)
    }
    
    if (status) {
      params.append('status', status)
    }
    
    const response = await fetch(`/api/report-cards/class?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la récupération des bulletins de la classe ${classId}:`, error)
    throw error
  }
}

// Fonction pour créer un nouveau bulletin
export async function createReportCard(data: ReportCardCreateInput) {
  try {
    const response = await fetch('/api/report-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la création du bulletin:', error)
    throw error
  }
}

// Fonction pour mettre à jour un bulletin existant
export async function updateReportCard(data: ReportCardUpdateInput) {
  try {
    const response = await fetch('/api/report-cards', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du bulletin ${data.id}:`, error)
    throw error
  }
}

// Fonction pour supprimer un bulletin
export async function deleteReportCard(id: string) {
  try {
    const response = await fetch(`/api/report-cards?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Erreur lors de la suppression du bulletin ${id}:`, error)
    throw error
  }
}

// Fonction pour générer des bulletins en masse pour une classe
export async function generateClassReportCards(data: ReportCardBatchCreateInput) {
  try {
    const response = await fetch('/api/report-cards/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la génération en masse des bulletins:', error)
    throw error
  }
}

// Fonction pour mettre à jour le statut de plusieurs bulletins
export async function updateReportCardsStatus(reportCardIds: string[], status: ReportCardStatus) {
  try {
    const response = await fetch('/api/report-cards/batch', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reportCardIds, status })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la mise à jour en masse des bulletins:', error)
    throw error
  }
}

// Fonction pour supprimer plusieurs bulletins
export async function deleteReportCards(reportCardIds: string[]) {
  try {
    const response = await fetch(`/api/report-cards/batch?ids=${reportCardIds.join(',')}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la suppression en masse des bulletins:', error)
    throw error
  }
}

// Fonction pour télécharger un bulletin en PDF
export function downloadReportCardPDF(id: string) {
  window.open(`/api/report-cards/export?id=${id}`, '_blank')
} 


