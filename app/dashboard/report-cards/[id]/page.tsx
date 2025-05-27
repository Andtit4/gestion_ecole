'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'

export default function ReportCardDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [reportCard, setReportCard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReportCard = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Récupérer les données du bulletin depuis l'API
        const response = await fetch(`/api/report-cards/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
        
        const data = await response.json()
        setReportCard(data)
      } catch (error) {
        console.error('Erreur lors du chargement du bulletin:', error)
        setError('Impossible de charger le bulletin. Veuillez réessayer plus tard.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchReportCard()
  }, [params.id])

  const handleBack = () => {
    router.back()
  }

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-500">Chargement du bulletin...</p>
      </div>
    )
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Erreur</p>
          <p>{error}</p>
        </div>
        
        <Button onClick={handleBack} variant="outline">
          Retour
        </Button>
      </div>
    )
  }

  // Afficher le bulletin
  if (reportCard) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-primary text-white p-6">
            <h1 className="text-2xl font-bold">Bulletin de notes</h1>
            <p className="text-primary-foreground/90 mt-1">
              {reportCard.period.type === 'TRIMESTER' ? 'Trimestre' : 
                reportCard.period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - {reportCard.period.schoolYear}
            </p>
            <div className="mt-2 inline-block px-2 py-1 bg-white/20 rounded-full text-sm">
              {reportCard.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Informations de l'élève</h3>
                <p><span className="text-gray-500">Nom:</span> {reportCard.student.user.lastName} {reportCard.student.user.firstName}</p>
                {reportCard.student.class && (
                  <p><span className="text-gray-500">Classe:</span> {reportCard.student.class.name}</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Période</h3>
                <p><span className="text-gray-500">Date de début:</span> {new Date(reportCard.period.startDate).toLocaleDateString()}</p>
                <p><span className="text-gray-500">Date de fin:</span> {new Date(reportCard.period.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Résultats</h3>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Moyenne générale</p>
                <p className={`text-3xl font-bold ${getAverageColor(reportCard.average)}`}>
                  {reportCard.average.toFixed(2)}/20
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Appréciation</h3>
              <p>{reportCard.appreciation || 'Aucune appréciation fournie'}</p>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button onClick={handleBack} variant="outline">
                Retour
              </Button>
              
              <Button onClick={() => downloadPDF(reportCard.id)}>
                Télécharger PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Fonction pour télécharger le PDF
async function downloadPDF(reportCardId: string) {
  try {
    const response = await fetch(`/api/reportcards/export?id=${reportCardId}`, {
      method: 'GET',
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    // Convertir la réponse en blob
    const blob = await response.blob()
    
    // Créer une URL pour le blob
    const url = window.URL.createObjectURL(blob)
    
    // Créer un élément a temporaire pour télécharger le fichier
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    
    // Obtenir le nom du fichier depuis l'en-tête Content-Disposition
    // ou utiliser un nom par défaut
    const contentDisposition = response.headers.get('content-disposition')
    const fileName = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'bulletin.pdf'
    
    a.download = fileName
    
    // Ajouter au document, cliquer et nettoyer
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Erreur lors du téléchargement du PDF:', error)
    alert('Impossible de télécharger le PDF. Veuillez réessayer plus tard.')
  }
}

// Fonction pour déterminer la couleur de la moyenne
function getAverageColor(average: number): string {
  if (average >= 16) return 'text-green-600'
  if (average >= 12) return 'text-blue-600'
  if (average >= 10) return 'text-amber-600'
  return 'text-red-600'
} 