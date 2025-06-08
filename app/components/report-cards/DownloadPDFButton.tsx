'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { generateReportCardPDF } from '@/lib/pdf-generator'

// Types
interface ReportCard {
  id: string
  student: {
    user: {
      firstName: string
      lastName: string
    }
  }
  period: any
  average: number
  appreciation?: string | null
  generatedAt: string
  status: string
}

interface DownloadPDFButtonProps {
  reportCard: ReportCard
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showText?: boolean
  className?: string
}

export function DownloadPDFButton({
  reportCard,
  variant = 'outline',
  size = 'sm',
  showText = true,
  className = '',
}: DownloadPDFButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Fonction principale pour t�l�charger le PDF
  const handleDownload = async () => {
    try {
      setLoading(true)
      
      if (!reportCard || !reportCard.student?.user || !reportCard.period) {
        throw new Error('Donn�es du bulletin incompl�tes pour g�n�rer le PDF')
      }
      
      // Afficher une notification pour indiquer que le t�l�chargement est en cours
      toast({
        title: "G�n�ration du PDF en cours",
        description: "Veuillez patienter pendant la cr�ation du document...",
      });
      
      try {
        // Tentative de g�n�ration c�t� client
        console.log('Tentative de g�n�ration PDF c�t� client...');
        const pdfBlob = await generateReportCardPDF(reportCard)
        await downloadBlob(pdfBlob)
      } catch (clientError) {
        console.error('Erreur g�n�ration PDF c�t� client, tentative via API:', clientError)
        // Si la g�n�ration c�t� client �choue, essayer via l'API
        await downloadViaAPI()
      }
    } catch (error) {
      console.error('Erreur lors de la g�n�ration du PDF:', error)
      toast({
        variant: "destructive",
        title: "Erreur PDF",
        description: error instanceof Error ? error.message : "Impossible de g�n�rer le PDF du bulletin",
      })
      
      // Derni�re tentative via l'API
      try {
        await downloadViaAPI()
      } catch (finalError) {
        console.error('Toutes les tentatives de g�n�ration PDF ont �chou�:', finalError)
      }
    } finally {
      setLoading(false)
    }
  }

  // T�l�charger � partir d'un Blob
  const downloadBlob = async (blob: Blob) => {
    try {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const fileName = `Bulletin_${reportCard.student.user.lastName.replace(/\s+/g, '_')}_${reportCard.student.user.firstName.replace(/\s+/g, '_')}`
      link.download = `${fileName}.pdf`
      
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
      
      toast({
        title: "PDF g�n�r� avec succ�s",
        description: "Le bulletin a �t� t�l�charg� en format PDF",
        variant: "default",
      })
      
      return true
    } catch (error) {
      console.error('Erreur lors du t�l�chargement du blob PDF:', error)
      throw error
    }
  }

  // T�l�charger via l'API
  const downloadViaAPI = async () => {
    console.log('Tentative de t�l�chargement via API...');
    
    try {
      const response = await fetch('/api/debug/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportCardId: reportCard.id })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success || !data.pdfData) {
        throw new Error('Donn�es PDF invalides re�ues de l\'API')
      }
      
      const link = document.createElement('a')
      link.href = data.pdfData
      link.download = data.fileName || `Bulletin.pdf`
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
      
      toast({
        title: "PDF g�n�r� via serveur",
        description: "Le bulletin a �t� t�l�charg� en format PDF",
        variant: "default",
      })
      
      return true
    } catch (error) {
      console.error('Erreur lors du t�l�chargement du PDF via API:', error)
      toast({
        variant: "destructive",
        title: "�chec de g�n�ration PDF",
        description: error instanceof Error ? error.message : "Impossible de g�n�rer le PDF du bulletin via l'API",
      })
      throw error
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className={`h-4 w-4 animate-spin ${showText ? 'mr-2' : ''}`} />
      ) : (
        <Download className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
      )}
      {showText && (loading ? 'G�n�ration...' : 'PDF')}
    </Button>
  )
} 


