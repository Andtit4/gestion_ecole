'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert'
import { useToast } from '@/app/components/ui/use-toast'
import { Download, RefreshCw, Bug, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Separator } from '@/app/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { generateReportCardPDF } from '@/app/lib/pdf-generator'
import { DownloadPDFButton } from '@/app/components/report-cards/DownloadPDFButton'

export default function DebugReportCardsPage() {
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [periods, setPeriods] = useState<any[]>([])
  const [reportCards, setReportCards] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [activeTab, setActiveTab] = useState('create')
  const [average, setAverage] = useState('15')
  const [status, setStatus] = useState('DRAFT')
  const { toast } = useToast()

  // Charger les données de test
  useEffect(() => {
    fetchDebugData()
  }, [])

  const fetchDebugData = async () => {
    setLoading(true)
    try {
      // Charger les élèves
      const studentsResponse = await fetch('/api/debug/students')
      const studentsData = await studentsResponse.json()
      setStudents(studentsData)
      if (studentsData.length > 0) {
        setSelectedStudent(studentsData[0].id)
      }

      // Charger les périodes
      const periodsResponse = await fetch('/api/debug/periods')
      const periodsData = await periodsResponse.json()
      setPeriods(periodsData)
      if (periodsData.length > 0) {
        setSelectedPeriod(periodsData[0].id)
      }

      // Charger les bulletins existants
      const reportCardsResponse = await fetch('/api/report-cards')
      const reportCardsData = await reportCardsResponse.json()
      setReportCards(reportCardsData)

      toast({
        title: "Données chargées",
        description: `${studentsData.length} élèves, ${periodsData.length} périodes, ${reportCardsData.length} bulletins`,
      })
    } catch (error) {
      console.error('Erreur lors du chargement des données de débogage:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données de débogage",
      })
    } finally {
      setLoading(false)
    }
  }

  // Créer un bulletin de test
  const createTestReportCard = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/test-report-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          periodId: selectedPeriod,
          average: parseFloat(average),
          appreciation: "Bulletin créé depuis l'outil de débogage",
          status
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du bulletin de test')
      }

      const data = await response.json()
      
      toast({
        title: "Bulletin créé",
        description: data.message || "Le bulletin de test a été créé avec succès",
      })

      // Rafraîchir la liste des bulletins
      const reportCardsResponse = await fetch('/api/report-cards')
      const reportCardsData = await reportCardsResponse.json()
      setReportCards(reportCardsData)
    } catch (error) {
      console.error('Erreur lors de la création du bulletin de test:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création du bulletin",
      })
    } finally {
      setLoading(false)
    }
  }

  // Télécharger un bulletin en PDF
  const downloadPDF = async (reportCard: any) => {
    try {
      setLoading(true)
      
      // Vérification des données nécessaires
      if (!reportCard || !reportCard.student?.user || !reportCard.period) {
        throw new Error('Données du bulletin incomplètes pour générer le PDF')
      }
      
      console.log('Tentative de génération PDF côté client...');
      
      try {
        // Tentative de génération côté client
        const pdfBlob = await generateReportCardPDF(reportCard)
        
        // Créer un URL pour le blob
        const url = URL.createObjectURL(pdfBlob)
        
        // Créer un lien de téléchargement
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
  const downloadPDFViaAPI = async (reportCard: any) => {
    try {
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
      throw error; // Propager l'erreur pour gérer en amont
    }
  }

  // Supprimer un bulletin
  const deleteReportCard = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bulletin?')) {
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`/api/report-cards?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du bulletin')
      }

      toast({
        title: "Bulletin supprimé",
        description: "Le bulletin a été supprimé avec succès",
      })

      // Rafraîchir la liste des bulletins
      const reportCardsResponse = await fetch('/api/report-cards')
      const reportCardsData = await reportCardsResponse.json()
      setReportCards(reportCardsData)
    } catch (error) {
      console.error('Erreur lors de la suppression du bulletin:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la suppression",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour afficher un statut
  const formatStatus = (status: string) => {
    if (status === 'DRAFT') return 'Brouillon'
    if (status === 'PUBLISHED') return 'Publié'
    return status
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Débogage des bulletins</h1>
          <p className="text-muted-foreground">Outils pour tester et déboguer les bulletins de notes</p>
        </div>
        <Button onClick={fetchDebugData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </Button>
      </div>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Mode de débogage</AlertTitle>
        <AlertDescription>
          Cette page est destinée au débogage et à la création de données de test. 
          N'utilisez pas ces outils en production.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="create">Créer un bulletin</TabsTrigger>
          <TabsTrigger value="list">Bulletins existants ({reportCards.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Créer un bulletin de test</CardTitle>
              <CardDescription>
                Utilisez ce formulaire pour créer rapidement un bulletin de test.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Élève</label>
                  <Select 
                    value={selectedStudent} 
                    onValueChange={setSelectedStudent}
                    disabled={loading || students.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un élève" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.user.firstName} {student.user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Période</label>
                  <Select 
                    value={selectedPeriod} 
                    onValueChange={setSelectedPeriod}
                    disabled={loading || periods.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une période" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.type === 'TRIMESTER' ? 'Trimestre' : 
                           period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - {period.schoolYear}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Moyenne</label>
                  <Input
                    type="number"
                    value={average}
                    onChange={(e) => setAverage(e.target.value)}
                    min="0"
                    max="20"
                    step="0.5"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Statut</label>
                  <Select 
                    value={status} 
                    onValueChange={setStatus}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Statut du bulletin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Brouillon</SelectItem>
                      <SelectItem value="PUBLISHED">Publié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={createTestReportCard} disabled={loading}>
                <Bug className="h-4 w-4 mr-2" />
                Créer un bulletin de test
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Bulletins existants</CardTitle>
              <CardDescription>
                Liste des bulletins créés dans la base de données.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportCards.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Aucun bulletin trouvé</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportCards.map((reportCard) => (
                    <div key={reportCard.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">
                            {reportCard.student.user.firstName} {reportCard.student.user.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {reportCard.period.type === 'TRIMESTER' ? 'Trimestre' : 
                             reportCard.period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - {reportCard.period.schoolYear}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <DownloadPDFButton 
                            reportCard={reportCard}
                            size="sm"
                            variant="outline"
                          />
                          <Button size="sm" variant="destructive" onClick={() => deleteReportCard(reportCard.id)}>
                            Supprimer
                          </Button>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Moyenne:</span>{' '}
                          <span className={reportCard.average >= 10 ? 'text-green-600' : 'text-red-600'}>
                            {reportCard.average.toFixed(2)}/20
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Statut:</span>{' '}
                          <span>{formatStatus(reportCard.status)}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Appréciation:</span>{' '}
                          <span>{reportCard.appreciation || 'Aucune appréciation'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 