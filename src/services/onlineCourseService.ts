import type { 
  OnlineCourse, 
  CreateOnlineCourse, 
  JoinCourseRequest, 
  CourseFilters, 
  CourseStatistics,
  CourseAttendee 
} from '../types/onlineCourse'

// Helper pour créer les headers avec tenant
const createTenantHeaders = (tenantId: string): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    'X-Tenant-Id': tenantId,
  }
}

// Fonction utilitaire pour générer des URLs Jitsi Meet propres
const generateCleanJitsiUrl = (title: string): string => {
  const timestamp = Date.now()
  
  // Nettoyer le titre pour l'URL - éliminer TOUS les caractères spéciaux
  const courseSlug = title
    .toLowerCase()
    .normalize('NFD') // Décomposer les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les diacritiques
    .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Remplacer plusieurs tirets consécutifs par un seul
    .replace(/^-|-$/g, '') // Supprimer les tirets en début et fin
    .substring(0, 30) // Limiter la longueur
  
  // Assurer qu'on a au moins quelque chose
  const finalSlug = courseSlug || 'cours'
  
  return `https://meet.jit.si/${finalSlug}-${timestamp}`
}

// Helper pour les requêtes avec tenant
const makeRequest = async (method: string, url: string, tenantId: string, data?: any) => {
  const headers = createTenantHeaders(tenantId)
  
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

class OnlineCourseService {
  private readonly baseUrl = '/online-courses'

  /**
   * Génère un ID unique pour la réunion Jitsi Meet
   */
  private generateMeetingId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `course-${timestamp}-${random}`
  }

  /**
   * Génère l'URL Jitsi Meet
   */
  private generateMeetingUrl(meetingId: string, tenantName?: string): string {
    // Utiliser le domaine de l'établissement comme préfixe si disponible
    const roomName = tenantName ? `${tenantName}-${meetingId}` : meetingId
    return `https://meet.jit.si/${roomName.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()}`
  }

  /**
   * Crée un nouveau cours en ligne
   */
  async createCourse(courseData: any, tenantId: string): Promise<{ success: boolean; data: any; message?: string }> {
    try {
      console.log('📤 Envoi à l\'API backend:', { courseData, tenantId })

      const response = await makeRequest('POST', `${this.baseUrl}`, tenantId, courseData)
      
      console.log('✅ Réponse de l\'API backend:', response)
      return response
    } catch (error) {
      console.error('❌ Erreur lors de la création du cours:', error)
      throw error
    }
  }

  /**
   * Récupère la liste des cours
   */
  async getCourses(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    filters: CourseFilters = {}
  ): Promise<{
    courses: OnlineCourse[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      })

      const response = await makeRequest('GET', `${this.baseUrl}?${params}`, tenantId)
      
      // Extraire les données de response.data au lieu de response directement
      return {
        courses: response.data?.courses || [],
        total: response.data?.total || 0,
        page: response.data?.page || page,
        totalPages: response.data?.totalPages || 1
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des cours:', error)
      throw error
    }
  }

  /**
   * Récupère un cours spécifique
   */
  async getCourse(courseId: string, tenantId: string): Promise<OnlineCourse> {
    try {
      const response = await makeRequest('GET', `${this.baseUrl}/${courseId}`, tenantId)
      return response.data || response
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du cours:', error)
      throw error
    }
  }

  /**
   * Met à jour un cours
   */
  async updateCourse(courseId: string, updates: Partial<OnlineCourse>, tenantId: string): Promise<OnlineCourse> {
    try {
      const response = await makeRequest('PATCH', `${this.baseUrl}/${courseId}`, tenantId, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      return response.data || response
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du cours:', error)
      throw error
    }
  }

  /**
   * Supprime un cours
   */
  async deleteCourse(courseId: string, tenantId: string): Promise<void> {
    try {
      await makeRequest('DELETE', `${this.baseUrl}/${courseId}`, tenantId)
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du cours:', error)
      throw error
    }
  }

  /**
   * Démarre un cours (change le statut à 'live')
   */
  async startCourse(courseId: string, tenantId: string): Promise<OnlineCourse> {
    try {
      const response = await makeRequest('PATCH', `${this.baseUrl}/${courseId}/status`, tenantId, { status: 'live' })
      return response.data || response
    } catch (error) {
      console.error('❌ Erreur lors du démarrage du cours:', error)
      throw error
    }
  }

  /**
   * Termine un cours (change le statut à 'ended')
   */
  async endCourse(courseId: string, tenantId: string): Promise<OnlineCourse> {
    try {
      const response = await makeRequest('POST', `${this.baseUrl}/${courseId}/end`, tenantId)
      return response.data || response
    } catch (error) {
      console.error('❌ Erreur lors de la fin du cours:', error)
      throw error
    }
  }

  /**
   * Rejoint un cours (ajoute un participant)
   */
  async joinCourse(joinRequest: JoinCourseRequest, tenantId: string): Promise<{
    course: OnlineCourse
    meetingUrl: string
    participant: CourseAttendee
  }> {
    try {
      const response = await makeRequest('POST', `${this.baseUrl}/join`, tenantId, {
        courseId: joinRequest.courseId,
        userId: joinRequest.userId,
        userName: joinRequest.userName,
        userType: joinRequest.userType,
        // joinedAt: new Date().toISOString()
      })
      
      console.log('✅ Participant rejoint le cours:', response)
      return response.data || response
    } catch (error) {
      console.error('❌ Erreur lors de la participation au cours:', error)
      throw error
    }
  }

  /**
   * Quitte un cours (met à jour le participant)
   */
  async leaveCourse(courseId: string, userId: string, tenantId: string): Promise<void> {
    try {
      await makeRequest('POST', `${this.baseUrl}/${courseId}/leave`, tenantId, {
        userId,
        leftAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('❌ Erreur lors de la sortie du cours:', error)
      throw error
    }
  }

  /**
   * Récupère les statistiques des cours
   */
  async getStatistics(tenantId: string, dateFrom?: string, dateTo?: string): Promise<CourseStatistics> {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)

      const response = await makeRequest('GET', `${this.baseUrl}/statistics?${params}`, tenantId)
      return response.data || response
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }

  /**
   * Récupère les cours d'un professeur
   */
  async getTeacherCourses(teacherId: string, tenantId: string): Promise<OnlineCourse[]> {
    try {
      const response = await makeRequest('GET', `${this.baseUrl}/teacher/${teacherId}`, tenantId)
      return response.data?.courses || response.courses || []
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des cours du professeur:', error)
      throw error
    }
  }

  /**
   * Récupère les cours d'un étudiant
   */
  async getStudentCourses(studentId: string, tenantId: string): Promise<OnlineCourse[]> {
    try {
      const response = await makeRequest('GET', `${this.baseUrl}/student/${studentId}`, tenantId)
      return response.data?.courses || response.courses || []
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des cours de l\'étudiant:', error)
      throw error
    }
  }

  /**
   * Ouvre Jitsi Meet dans une nouvelle fenêtre/onglet
   */
  openMeeting(meetingUrl: string, userName: string): void {
    // Ajouter le nom d'utilisateur à l'URL Jitsi
    const urlWithUser = `${meetingUrl}#userInfo.displayName="${encodeURIComponent(userName)}"`
    
    // Ouvrir dans une nouvelle fenêtre optimisée pour la vidéoconférence
    window.open(
      urlWithUser,
      'jitsi-meeting',
      'width=1200,height=800,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=yes'
    )
  }

  /**
   * Intègre Jitsi Meet dans un iframe
   */
  embedMeeting(containerId: string, meetingUrl: string, userName: string): void {
    const container = document.getElementById(containerId)
    if (!container) {
      console.error('❌ Conteneur non trouvé:', containerId)
      return
    }

    // Nettoyer le conteneur
    container.innerHTML = ''

    // Créer l'iframe Jitsi
    const iframe = document.createElement('iframe')
    iframe.src = `${meetingUrl}#userInfo.displayName="${encodeURIComponent(userName)}"`
    iframe.width = '100%'
    iframe.height = '600'
    iframe.frameBorder = '0'
    iframe.allow = 'camera; microphone; fullscreen; display-capture'
    iframe.style.border = '1px solid #ddd'
    iframe.style.borderRadius = '8px'

    container.appendChild(iframe)

    console.log('🎥 Jitsi Meet intégré dans:', containerId)
  }
}

export const onlineCourseService = new OnlineCourseService()
export default onlineCourseService 