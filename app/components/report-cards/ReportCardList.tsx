'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2, AlertCircle, PlusCircle, RefreshCw, BugPlay, Download, ExternalLink } from 'lucide-react'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { formatDate } from '@/app/lib/utils'
import { ReportCardForm } from './ReportCardForm'
import { useToast } from '../../components/ui/use-toast'
import { generateReportCardPDF } from '@/app/lib/pdf-generator'
import { DownloadPDFButton } from './DownloadPDFButton'
import { useRouter } from 'next/navigation'

// Types
type ReportCard = {
  id: string
  studentId: string
  periodId: string
  average: number
  appreciation?: string | null
  generatedAt: string
  status: string
  student: {
    id: string
    user: {
      firstName: string
      lastName: string
    }
    class?: {
      name: string
    } | null
  }
  period: {
    type: string
    startDate: string
    endDate: string
    schoolYear: string
  }
}

interface ReportCardListProps {
  reportCards: ReportCard[]
  isLoading: boolean
  onUpdate: (id: string, data: any) => void
  onDelete: (id: string) => void
  userRole?: string
}

export function ReportCardList({
  reportCards,
  isLoading,
  onUpdate,
  onDelete,
  userRole = 'STUDENT'
}: ReportCardListProps) {
  const [viewReportCard, setViewReportCard] = useState<ReportCard | null>(null)
  const [editReportCard, setEditReportCard] = useState<ReportCard | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [reportCardToDelete, setReportCardToDelete] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Vérifier si l'utilisateur peut modifier ou supprimer
  const canEdit = userRole === 'ADMIN' || userRole === 'TEACHER'
  const canDelete = userRole === 'ADMIN'

  // Naviguer vers la page détaillée du bulletin
  const navigateToDetail = (id: string) => {
    router.push(`/dashboard/report-cards/${id}`)
  }

  // Ouvrir la boîte de dialogue de confirmation de suppression
  const openDeleteConfirm = (id: string) => {
    setReportCardToDelete(id)
    setDeleteConfirmOpen(true)
  }

  // Confirmer la suppression
  const confirmDelete = () => {
    if (reportCardToDelete) {
      onDelete(reportCardToDelete)
      setDeleteConfirmOpen(false)
      setReportCardToDelete(null)
    }
  }

  // Fonction pour créer un bulletin de test via l'API de secours
  const createTestReportCard = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/debug/test-report-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})  // Pas besoin de fournir de données, l'API les générera
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du bulletin de test')
      }

      const data = await response.json()
      console.log('Bulletin de test créé:', data)
      
      // Afficher un message de succès
      toast({
        title: "Bulletin de test créé",
        description: data.message || "Le bulletin de test a été créé avec succès",
      })

      // Actualiser la liste des bulletins
      // Simulation de rafraîchissement car nous n'avons pas accès à la fonction fetchReportCards
      setTimeout(() => {
        setLoading(false)
        // Informer le parent qu'il doit rafraîchir
        toast({
          title: "Rafraîchissement nécessaire",
          description: "Veuillez actualiser la page pour voir le nouveau bulletin",
        })
      }, 1500)
    } catch (error) {
      console.error('Erreur lors de la création du bulletin de test:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création du bulletin de test",
      })
      setLoading(false)
    }
  }

  // Fonction pour afficher un badge de statut
  const getStatusBadge = (status: string) => {
    if (status === 'DRAFT') {
      return <Badge variant="outline">Brouillon</Badge>
    } else if (status === 'PUBLISHED') {
      return <Badge variant="default">Publié</Badge>
    }
    return <Badge variant="secondary">{status}</Badge>
  }

  // Fonction pour afficher une couleur selon la moyenne
  const getAverageColor = (average: number) => {
    if (average >= 16) return 'text-green-600 font-medium'
    if (average >= 14) return 'text-green-500'
    if (average >= 12) return 'text-lime-600'
    if (average >= 10) return 'text-yellow-600'
    if (average >= 8) return 'text-orange-500'
    return 'text-red-500'
  }

  // Afficher une ligne de chargement
  const renderSkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    </TableRow>
  )

  // Fonction pour télécharger un bulletin en PDF
  const downloadReportCardPDF = async (reportCard: ReportCard) => {
    try {
      setLoading(true)
      
      // Vérification des données nécessaires au PDF
      if (!reportCard || !reportCard.student?.user || !reportCard.period) {
        throw new Error('Données du bulletin incomplètes pour générer le PDF')
      }
      
      console.log('Tentative de génération PDF côté client...');
      
      try {
        // Création du PDF côté client
        const pdfBlob = await generateReportCardPDF(reportCard)
        
        // Créer un URL pour le blob
        const url = URL.createObjectURL(pdfBlob)
        
        // Créer un lien de téléchargement avec un nom spécifique
        const link = document.createElement('a')
        link.href = url
        const fileName = `Bulletin_${reportCard.student.user.lastName.replace(/\s+/g, '_')}_${reportCard.student.user.firstName.replace(/\s+/g, '_')}`
        link.download = `${fileName}.pdf`
        
        // Simuler un clic pour télécharger
        document.body.appendChild(link)
        link.click()
        
        // Nettoyer
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 100)
        
        toast({
          title: "PDF généré",
          description: "Le bulletin a été téléchargé en format PDF",
        })
      } catch (clientError) {
        console.error('Erreur génération PDF côté client, tentative via API:', clientError);
        // Si la génération côté client échoue, essayer via l'API
        await downloadPDFViaAPI(reportCard);
      }
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      toast({
        variant: "destructive",
        title: "Erreur PDF",
        description: error instanceof Error ? error.message : "Impossible de générer le PDF du bulletin",
      })
      
      // Dernière tentative via l'API
      try {
        await downloadPDFViaAPI(reportCard);
      } catch (finalError) {
        console.error('Toutes les tentatives de génération PDF ont échoué:', finalError);
      }
    } finally {
      setLoading(false)
    }
  }

  // Fonction alternative pour télécharger le PDF via l'API
  const downloadPDFViaAPI = async (reportCard: ReportCard) => {
    try {
      setLoading(true)
      
      console.log('Téléchargement du PDF via l\'API de secours');
      
      const response = await fetch('/api/debug/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportCardId: reportCard.id })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success || !data.pdfData) {
        throw new Error('Données PDF invalides reçues de l\'API');
      }
      
      // Créer un lien avec les données base64
      const link = document.createElement('a');
      link.href = data.pdfData;
      link.download = data.fileName || `Bulletin.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
      toast({
        title: "PDF généré via API",
        description: "Le bulletin a été téléchargé en format PDF",
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF via API:', error);
      toast({
        variant: "destructive",
        title: "Erreur API PDF",
        description: error instanceof Error ? error.message : "Impossible de générer le PDF du bulletin via l'API",
      });
    } finally {
      setLoading(false);
    }
  }

  // Afficher un état vide
  if (!loading && reportCards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Aucun bulletin trouvé</CardTitle>
          <CardDescription>
            Aucun bulletin ne correspond à vos critères de recherche.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">
              Essayez de modifier vos filtres ou créez un nouveau bulletin.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Liste des bulletins</CardTitle>
          <CardDescription>
            {loading
              ? 'Chargement des bulletins...'
              : `${reportCards.length} bulletin(s) trouvé(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowCreateForm(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouveau bulletin
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            {/* Bouton de secours pour créer un bulletin de test */}
            <Button variant="secondary" onClick={createTestReportCard}>
              <BugPlay className="h-4 w-4 mr-2" />
              Créer un bulletin de test
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Moyenne</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, index) => renderSkeletonRow())
              ) : (
                reportCards.map((reportCard) => (
                  <TableRow key={reportCard.id}>
                    <TableCell className="font-medium">
                      {reportCard.student.user.firstName} {reportCard.student.user.lastName}
                    </TableCell>
                    <TableCell>
                      {reportCard.student.class?.name || 'Non assigné'}
                    </TableCell>
                    <TableCell className={getAverageColor(reportCard.average)}>
                      {reportCard.average.toFixed(2)}/20
                    </TableCell>
                    <TableCell>
                      {reportCard.period.type === 'TRIMESTER' ? 'Trimestre' : 
                       reportCard.period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - {reportCard.period.schoolYear}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(reportCard.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        className="mr-1"
                        onClick={() => setViewReportCard(reportCard)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <DownloadPDFButton
                        reportCard={reportCard}
                        variant="outline"
                        size="icon"
                        showText={false}
                        className="mr-1"
                      />
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="mr-1"
                        onClick={() => navigateToDetail(reportCard.id)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      
                      {canEdit && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="mr-1"
                          onClick={() => setEditReportCard(reportCard)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {canDelete && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-red-500"
                          onClick={() => openDeleteConfirm(reportCard.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogue pour voir les détails du bulletin */}
      {viewReportCard && (
        <Dialog open={!!viewReportCard} onOpenChange={() => setViewReportCard(null)}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Détails du bulletin</DialogTitle>
              <DialogDescription>
                Bulletin de {viewReportCard.student.user.firstName} {viewReportCard.student.user.lastName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Élève:</div>
                <div className="col-span-3">
                  {viewReportCard.student.user.firstName} {viewReportCard.student.user.lastName}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Classe:</div>
                <div className="col-span-3">
                  {viewReportCard.student.class?.name || 'Non assigné'}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Période:</div>
                <div className="col-span-3">
                  {viewReportCard.period.type === 'TRIMESTER' ? 'Trimestre' : 
                   viewReportCard.period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - {viewReportCard.period.schoolYear}
                  <div className="text-xs text-gray-500">
                    Du {formatDate(viewReportCard.period.startDate)} au {formatDate(viewReportCard.period.endDate)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Moyenne:</div>
                <div className={`col-span-3 ${getAverageColor(viewReportCard.average)}`}>
                  {viewReportCard.average.toFixed(2)}/20
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-sm font-medium">Appréciation:</div>
                <div className="col-span-3 text-sm">
                  {viewReportCard.appreciation || 'Aucune appréciation fournie.'}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Statut:</div>
                <div className="col-span-3">
                  {getStatusBadge(viewReportCard.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Généré le:</div>
                <div className="col-span-3 text-sm text-gray-500">
                  {formatDate(viewReportCard.generatedAt)}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setViewReportCard(null)}
              >
                Fermer
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setViewReportCard(null);
                  navigateToDetail(viewReportCard.id);
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir la page complète
              </Button>
              <DownloadPDFButton
                reportCard={viewReportCard}
                variant="default"
                showText={true}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bulletin? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Formulaire d'édition */}
      {editReportCard && (
        <ReportCardForm
          initialData={editReportCard}
          onSubmit={(data) => {
            onUpdate(editReportCard.id, data)
            setEditReportCard(null)
          }}
          onCancel={() => setEditReportCard(null)}
        />
      )}
    </>
  )
} 