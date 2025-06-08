'use client'

import { useState } from 'react'
import { Button } from './button'
import { Download, Loader2 } from 'lucide-react'

interface DownloadPDFButtonProps {
  reportCardId: string
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  label?: string
}

/**
 * Bouton réutilisable pour télécharger un bulletin au format PDF
 */
export function DownloadPDFButton({
  reportCardId,
  className = '',
  variant = 'default',
  size = 'default',
  showIcon = true,
  label = 'Télécharger PDF'
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log(`Téléchargement du bulletin ID: ${reportCardId}`)
      
      // Essayer d'abord la méthode de téléchargement côté client
      await downloadPDFClient(reportCardId)
    } catch (clientError) {
      console.error('Erreur téléchargement côté client:', clientError)
      
      try {
        // Fallback: Essayer le téléchargement côté serveur
        await downloadPDFServer(reportCardId)
      } catch (serverError) {
        console.error('Erreur téléchargement côté serveur:', serverError)
        setError('Impossible de générer le PDF. Veuillez réessayer plus tard.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Télécharge le PDF généré côté client avec jsPDF
   */
  const downloadPDFClient = async (id: string) => {
    try {
      // Récupérer les données du bulletin
      const response = await fetch(`/api/report-cards/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const reportCard = await response.json()
      
      // Dynamiquement importer jsPDF et les autres dépendances
      const { default: jsPDF } = await import('jspdf')
      await import('jspdf-autotable')
      const { format } = await import('date-fns')
      const { fr } = await import('date-fns/locale')
      
      // Créer un nouveau document PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      // Définir les couleurs
      const primaryColor = [41, 98, 255] // RGB - Bleu principal
      const secondaryColor = [80, 80, 80] // RGB - Gris foncé
      const lightGray = [240, 240, 240] // RGB - Gris clair pour alternance
      
      // Ajouter un en-tête stylisé avec fond bleu
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.rect(0, 0, 210, 40, 'F')
      
      // Titre du document
      doc.setFontSize(24)
      doc.setTextColor(255, 255, 255) // Blanc
      doc.text('BULLETIN DE NOTES', 105, 20, { align: 'center' })
      
      // Sous-titre - Information de période
      const periodLabel = reportCard.period.type === 'TRIMESTER' 
        ? 'Trimestre' 
        : reportCard.period.type === 'SEMESTER' 
          ? 'Semestre' 
          : 'Année'
      
      doc.setFontSize(14)
      doc.text(`${periodLabel} - ${reportCard.period.schoolYear}`, 105, 30, { align: 'center' })
      
      // Dates formatées
      let periodDates = ''
      try {
        const startDate = format(new Date(reportCard.period.startDate), 'dd MMMM yyyy', { locale: fr })
        const endDate = format(new Date(reportCard.period.endDate), 'dd MMMM yyyy', { locale: fr })
        periodDates = `Période du ${startDate} au ${endDate}`
      } catch (error) {
        console.error('Erreur lors du formatage des dates:', error)
        periodDates = `Période scolaire ${reportCard.period.schoolYear}`
      }
      doc.text(periodDates, 105, 45, { align: 'center' })
      
      // Informations sur l'élève dans une boîte
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0) // Noir
      
      // Boîte d'information de l'élève
      doc.setFillColor(245, 245, 245) // Fond gris très clair
      doc.roundedRect(15, 50, 180, 35, 3, 3, 'F')
      
      doc.setFontSize(14)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.text('Informations de l\'élève', 105, 60, { align: 'center' })
      
      doc.setFontSize(12)
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
      
      // Affichage des informations de l'élève
      doc.text(`Nom: ${reportCard.student.user.lastName} ${reportCard.student.user.firstName}`, 25, 70)
      doc.text(`Classe: ${reportCard.student.class?.name || 'Non assigné'}`, 25, 78)
      
      // Section résultats
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.setTextColor(255, 255, 255)
      doc.roundedRect(15, 95, 180, 10, 1, 1, 'F')
      doc.text('RÉSULTATS', 105, 102, { align: 'center' })
      
      // Affichage de la moyenne avec couleur selon valeur
      doc.setFontSize(16)
      const avgColor = reportCard.average >= 16 ? [46, 125, 50] : // Vert
                      reportCard.average >= 12 ? [33, 150, 243] : // Bleu
                      reportCard.average >= 10 ? [255, 152, 0] : // Orange
                      [244, 67, 54] // Rouge
      
      doc.setTextColor(avgColor[0], avgColor[1], avgColor[2])
      doc.text(`Moyenne générale: ${reportCard.average.toFixed(2)}/20`, 105, 115, { align: 'center' })
      
      // Table des informations supplémentaires
      const studentInfos = [
        ['Statut du bulletin', reportCard.status === 'DRAFT' ? 'Brouillon' : 'Publié'],
      ]
      
      // Ajouter la date de génération si disponible
      if (reportCard.generatedAt) {
        try {
          const generatedDate = format(new Date(reportCard.generatedAt), 'dd MMMM yyyy', { locale: fr })
          studentInfos.push(['Généré le', generatedDate])
        } catch (error) {
          console.error('Erreur lors du formatage de la date de génération:', error)
          studentInfos.push(['Généré le', 'Date non disponible'])
        }
      }
      
      // @ts-ignore - autoTable n'est pas reconnu par TypeScript mais ajouté par le plugin
      doc.autoTable({
        startY: 125,
        head: [['Information', 'Détail']],
        body: studentInfos,
        theme: 'grid',
        headStyles: {
          fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
        },
        alternateRowStyles: {
          fillColor: lightGray
        },
        margin: { left: 15, right: 15 }
      })
      
      // Appréciation
      doc.setFontSize(14)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      // @ts-ignore - autoTable n'est pas reconnu par TypeScript mais ajouté par le plugin
      doc.text('Appréciation générale', 105, doc.autoTable.previous.finalY + 15, { align: 'center' })
      
      const appreciation = reportCard.appreciation || 'Aucune appréciation fournie.'
      
      // Cadre pour l'appréciation
      doc.setDrawColor(200, 200, 200)
      doc.setFillColor(250, 250, 250)
      // @ts-ignore - autoTable n'est pas reconnu par TypeScript mais ajouté par le plugin
      doc.roundedRect(15, doc.autoTable.previous.finalY + 20, 180, 40, 2, 2, 'FD')
      
      // Texte d'appréciation
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      
      // Gestion du texte long avec retour à la ligne automatique
      const textLines = doc.splitTextToSize(appreciation, 170)
      // @ts-ignore - autoTable n'est pas reconnu par TypeScript mais ajouté par le plugin
      doc.text(textLines, 20, doc.autoTable.previous.finalY + 28)
      
      // Pied de page
      const pageCount = doc.getNumberOfPages()
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        try {
          const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: fr })
          doc.text(
            `EcoleGestion - Bulletin généré le ${currentDate}`,
            105,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          )
        } catch (error) {
          console.error('Erreur lors du formatage de la date de pied de page:', error)
          doc.text(
            `EcoleGestion - Bulletin scolaire`,
            105,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          )
        }
      }
      
      // Nom du fichier pour le téléchargement
      const fileName = `Bulletin_${reportCard.student.user.lastName.replace(/\s+/g, '_')}_${reportCard.student.user.firstName.replace(/\s+/g, '_')}.pdf`
      
      // Télécharger le PDF
      doc.save(fileName)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF côté client:', error)
      throw error // Propager l'erreur pour utiliser la méthode de secours
    }
  }

  /**
   * Télécharge le PDF généré côté serveur via l'API
   */
  const downloadPDFServer = async (id: string) => {
    try {
      // Récupérer le PDF via l'API
      const response = await fetch(`/api/reportcards/export?id=${id}`, {
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
      console.error('Erreur lors du téléchargement du PDF côté serveur:', error)
      throw error // Propager l'erreur
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleDownload}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            {showIcon && <Download className="mr-2 h-4 w-4" />}
            {label}
          </>
        )}
      </Button>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </>
  )
} 


