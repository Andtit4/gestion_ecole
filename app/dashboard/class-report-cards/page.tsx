'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FileIcon, PlusIcon, Users2Icon } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Skeleton } from '@/app/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert'
import { StudentReportCardsList } from '@/app/components/report-cards/StudentReportCardsList'
import { generateClassReportCards } from '@/app/components/report-cards/ReportCardAPI'
import { useToast } from '@/app/components/ui/use-toast'

export default function ClassReportCardsPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [classes, setClasses] = useState<any[]>([])
  const [periods, setPeriods] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const userRole = session?.user?.role || 'STUDENT'

  // Charger les classes et les périodes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Charger les classes
        const classesResponse = await fetch('/api/classes')
        if (!classesResponse.ok) {
          throw new Error('Impossible de charger les classes')
        }
        const classesData = await classesResponse.json()
        setClasses(classesData)
        
        // Charger les périodes
        const periodsResponse = await fetch('/api/periods')
        if (!periodsResponse.ok) {
          throw new Error('Impossible de charger les périodes')
        }
        const periodsData = await periodsResponse.json()
        setPeriods(periodsData)
        
        // Sélectionner la classe par défaut si l'utilisateur est un enseignant
        if (userRole === 'TEACHER' && classesData.length > 0) {
          setSelectedClassId(classesData[0].id)
        }
        
        // Sélectionner la période la plus récente par défaut
        if (periodsData.length > 0) {
          const sortedPeriods = [...periodsData].sort((a, b) => {
            if (a.schoolYear !== b.schoolYear) {
              return b.schoolYear.localeCompare(a.schoolYear)
            }
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
          })
          
          setSelectedPeriodId(sortedPeriods[0].id)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        setError('Erreur lors du chargement des données. Veuillez réessayer plus tard.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (session) {
      fetchData()
    }
  }, [session, userRole])

  // Fonction pour générer des bulletins pour la classe sélectionnée
  const handleGenerateReportCards = async () => {
    if (!selectedClassId || !selectedPeriodId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une classe et une période"
      })
      return
    }
    
    try {
      setIsGenerating(true)
      
      const result = await generateClassReportCards({
        classId: selectedClassId,
        periodId: selectedPeriodId,
        status: 'DRAFT'
      })
      
      toast({
        title: "Bulletins générés",
        description: `${result.reportCards.length} bulletins ont été créés. ${result.skippedCount} élèves avaient déjà un bulletin.`
      })
      
      // Rafraîchir la liste des bulletins
      window.location.reload()
    } catch (error) {
      console.error('Erreur lors de la génération des bulletins:', error)
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la génération des bulletins"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-[40px] w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[50px] w-full" />
          <Skeleton className="h-[50px] w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Accès refusé</AlertTitle>
          <AlertDescription>
            Vous devez être connecté pour accéder à cette page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (userRole !== 'ADMIN' && userRole !== 'TEACHER') {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Accès refusé</AlertTitle>
          <AlertDescription>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Bulletins par classe</h1>
        
        {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
          <Button 
            onClick={handleGenerateReportCards} 
            disabled={isGenerating || !selectedClassId || !selectedPeriodId}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">⭮</span>
                Génération...
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4 mr-2" />
                Générer les bulletins
              </>
            )}
          </Button>
        )}
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sélectionner une classe</CardTitle>
          <CardDescription>
            Choisissez une classe pour afficher ou générer les bulletins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Classe</label>
              <Select
                value={selectedClassId}
                onValueChange={(value) => setSelectedClassId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Période</label>
              <Select
                value={selectedPeriodId}
                onValueChange={(value) => setSelectedPeriodId(value)}
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
        </CardContent>
      </Card>
      
      {selectedClassId ? (
        <StudentReportCardsList 
          classId={selectedClassId} 
          periods={periods}
          userRole={userRole}
        />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <Users2Icon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Aucune classe sélectionnée</h3>
          <p className="mt-2 text-sm text-gray-500">
            Veuillez sélectionner une classe pour afficher les bulletins
          </p>
        </div>
      )}
    </div>
  )
} 