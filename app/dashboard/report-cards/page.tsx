'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, BugPlay, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ReportCardList } from '@/components/report-cards/ReportCardList'
import { ReportCardForm } from '@/components/report-cards/ReportCardForm'
import { StudentReportCardsList } from '@/components/report-cards/StudentReportCardsList'
import { StudentsWithGradesList } from '@/components/report-cards/StudentsWithGradesList'
import { AllStudentsList } from '@/components/report-cards/AllStudentsList'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ReportCardsPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [classes, setClasses] = useState<any[]>([])
  const [periods, setPeriods] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>('STUDENT')
  const { toast } = useToast()

  // Charger les p�riodes et les classes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Charger les p�riodes
        const periodsResponse = await fetch('/api/periods')
        if (!periodsResponse.ok) {
          throw new Error('Impossible de charger les p�riodes')
        }
        const periodsData = await periodsResponse.json()
        setPeriods(periodsData)
        
        // Charger les classes
        const classesResponse = await fetch('/api/classes')
        if (!classesResponse.ok) {
          throw new Error('Impossible de charger les classes')
        }
        const classesData = await classesResponse.json()
        setClasses(classesData)
        
        // D�terminer le r�le de l'utilisateur
        if (session?.user?.role) {
          setUserRole(session.user.role)
        }
        
        if (classesData.length > 0) {
          setSelectedClassId(classesData[0].id)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des donn�es:', error)
        setError('Erreur lors du chargement des donn�es. Veuillez r�essayer plus tard.')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (session) {
      fetchData()
    }
  }, [session])

  // G�rer la soumission du formulaire de bulletin
  const handleFormSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/report-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`)
      }
      
      setShowForm(false)
      toast({
        title: "Bulletin cr��",
        description: "Le bulletin a �t� cr�� avec succ�s",
      })
      
      // Recharger la page pour voir le nouveau bulletin
      window.location.reload()
    } catch (error) {
      console.error('Erreur lors de la cr�ation du bulletin:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la cr�ation du bulletin",
      })
    }
  }

  // Cr�er un bulletin de test via notre API de secours
  const createTestReportCard = async () => {
    try {
      const response = await fetch('/api/debug/test-report-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la cr�ation du bulletin de test')
      }

      const data = await response.json()
      console.log('Bulletin de test cr��:', data)
      
      toast({
        title: "Bulletin de test cr��",
        description: data.message || "Le bulletin de test a �t� cr�� avec succ�s",
      })

      // Rafra�chir la page
      window.location.reload()
    } catch (error) {
      console.error('Erreur lors de la cr�ation du bulletin de test:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la cr�ation du bulletin de test",
      })
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
          <AlertTitle>Acc�s refus�</AlertTitle>
          <AlertDescription>
            Vous devez �tre connect� pour acc�der � cette page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Bulletins de notes</h1>
        
        <div className="flex space-x-2">
          {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau bulletin
            </Button>
          )}
          
          <Button variant="outline" onClick={createTestReportCard}>
            <BugPlay className="h-4 w-4 mr-2" />
            Cr�er bulletin test
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="all-students">
        <TabsList className="mb-6">
          <TabsTrigger value="all-students">Tous les �l�ves</TabsTrigger>
          <TabsTrigger value="bulletins">Bulletins</TabsTrigger>
          <TabsTrigger value="students-with-grades">�l�ves avec notes</TabsTrigger>
          {userRole === 'ADMIN' && <TabsTrigger value="admin">Gestion</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="bulletins">
          <div className="space-y-6">
            {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
              <Card>
                <CardHeader>
                  <CardTitle>Filtres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Classe</label>
                      <Select
                        value={selectedClassId}
                        onValueChange={setSelectedClassId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="S�lectionner une classe" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((class_) => (
                            <SelectItem key={class_.id} value={class_.id}>
                              {class_.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">P�riode</label>
                      <Select
                        value={selectedPeriod}
                        onValueChange={setSelectedPeriod}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="S�lectionner une p�riode" />
                        </SelectTrigger>
                        <SelectContent>
                          {periods.map((period) => (
                            <SelectItem key={period.id} value={period.id}>
                              {period.type === 'TRIMESTER' ? 'Trimestre' : 
                               period.type === 'SEMESTER' ? 'Semestre' : 'Ann�e'} - {period.schoolYear}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Recherche</label>
                      <Input placeholder="Rechercher un �l�ve..." />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {selectedClassId && (
              <StudentReportCardsList 
                classId={selectedClassId} 
                periods={periods}
                userRole={userRole}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all-students">
          <AllStudentsList
            classId={selectedClassId}
            periods={periods}
            userRole={userRole}
          />
        </TabsContent>
        
        <TabsContent value="students-with-grades">
          <StudentsWithGradesList
            classId={selectedClassId}
            periods={periods}
            userRole={userRole}
          />
        </TabsContent>
        
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Outils d'administration des bulletins</CardTitle>
              <CardDescription>
                Outils pour g�rer les bulletins de notes et les p�riodes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Bulletins</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={createTestReportCard}>
                      Cr�er un bulletin de test
                    </Button>
                    <Button variant="outline">
                      G�n�rer les bulletins pour une classe
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">P�riodes</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      G�rer les p�riodes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Formulaire de cr�ation de bulletin */}
      {showForm && (
        <ReportCardForm 
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
} 


