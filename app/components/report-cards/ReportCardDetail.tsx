'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Eye, Calendar, User, School, Star } from 'lucide-react'
import { Button } from '../ui/button'
import { DownloadPDFButton } from './DownloadPDFButton'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'

interface ReportCardDetailProps {
  reportCard: {
    id: string
    studentId: string
    periodId: string
    average: number
    appreciation?: string | null
    generatedAt: string
    status: string
    period: {
      id: string
      type: string
      startDate: string
      endDate: string
      schoolYear: string
      status: string
    }
    student: {
      id: string
      user: {
        id: string
        firstName: string
        lastName: string
      }
      class?: {
        id: string
        name: string
      } | null
    }
  }
  onClose: () => void
  showBackButton?: boolean
}

export function ReportCardDetail({ reportCard, onClose, showBackButton = true }: ReportCardDetailProps) {
  // Formater les dates
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr })
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error)
      return 'Date invalide'
    }
  }

  // Déterminer la couleur de la moyenne
  const getAverageColor = (average: number) => {
    if (average >= 16) return 'text-green-600'
    if (average >= 12) return 'text-blue-600'
    if (average >= 10) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">Bulletin de notes</CardTitle>
            <CardDescription className="text-primary-foreground/90 mt-1">
              {reportCard.period.type === 'TRIMESTER' ? 'Trimestre' : 
                reportCard.period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - {reportCard.period.schoolYear}
            </CardDescription>
          </div>
          <Badge 
            variant={reportCard.status === 'PUBLISHED' ? 'default' : 'secondary'}
            className="ml-auto"
          >
            {reportCard.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations sur l'élève */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informations de l'élève
            </h3>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Nom:</span>
                <p className="font-medium">{reportCard.student.user.lastName} {reportCard.student.user.firstName}</p>
              </div>
              
              {reportCard.student.class && (
                <div>
                  <span className="text-sm text-muted-foreground">Classe:</span>
                  <p className="font-medium flex items-center gap-1">
                    <School className="h-4 w-4 text-primary/70" />
                    {reportCard.student.class.name}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Informations sur la période */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Période
            </h3>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Date de début:</span>
                <p className="font-medium">{formatDate(reportCard.period.startDate)}</p>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Date de fin:</span>
                <p className="font-medium">{formatDate(reportCard.period.endDate)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Résultats */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Résultats
          </h3>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex flex-col items-center justify-center py-4">
              <span className="text-sm text-muted-foreground mb-1">Moyenne générale</span>
              <p className={`text-3xl font-bold ${getAverageColor(reportCard.average)}`}>
                {reportCard.average.toFixed(2)}/20
              </p>
            </div>
          </div>
        </div>
        
        {/* Appréciation */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Appréciation
          </h3>
          
          <div className="bg-muted/50 p-4 rounded-lg min-h-[100px]">
            {reportCard.appreciation ? (
              <p className="text-sm leading-relaxed">{reportCard.appreciation}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Aucune appréciation fournie</p>
            )}
          </div>
        </div>
        
        {/* Date de génération */}
        {reportCard.generatedAt && (
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Généré le {formatDate(reportCard.generatedAt)}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-4">
        {showBackButton && (
          <Button variant="outline" onClick={onClose}>
            Retour
          </Button>
        )}
        
        <DownloadPDFButton
          reportCard={reportCard}
          variant="default"
          className="ml-auto"
        />
      </CardFooter>
    </Card>
  )
} 


