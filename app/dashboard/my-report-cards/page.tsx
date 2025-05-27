'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { BookIcon, DownloadIcon, EyeIcon } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { Skeleton } from '@/app/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert'
import { getStudentReportCards, downloadReportCardPDF } from '@/app/components/report-cards/ReportCardAPI'
import { useRouter } from 'next/navigation'

export default function MyReportCardsPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [reportCards, setReportCards] = useState<any[]>([])
  const [periods, setPeriods] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>('')
  const [schoolYears, setSchoolYears] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const userRole = session?.user?.role || 'STUDENT'

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Charger les périodes
        const periodsResponse = await fetch('/api/periods')
        if (!periodsResponse.ok) {
          throw new Error('Impossible de charger les périodes')
        }
        const periodsData = await periodsResponse.json()
        setPeriods(periodsData)
        
        // Extraire les années scolaires uniques
        const years = [...new Set(periodsData.map((p: any) => p.schoolYear))].sort().reverse()
        setSchoolYears(years)
        
        if (years.length > 0) {
          setSelectedSchoolYear(years[0])
        }
        
        // Récupérer l'ID de l'élève selon le rôle
        if (userRole === 'STUDENT') {
          // Pour un élève, récupérer son propre ID
          const studentResponse = await fetch('/api/students/me')
          if (studentResponse.ok) {
            const studentData = await studentResponse.json()
            setSelectedStudentId(studentData.id)
            setStudents([studentData])
          } else {
            throw new Error('Impossible de récupérer les informations de l\'élève')
          }
        } else if (userRole === 'PARENT') {
          // Pour un parent, récupérer la liste de ses enfants
          const childrenResponse = await fetch('/api/parents/children')
          if (childrenResponse.ok) {
            const childrenData = await childrenResponse.json()
            setStudents(childrenData)
            
            if (childrenData.length > 0) {
              setSelectedStudentId(childrenData[0].id)
            }
          } else {
            throw new Error('Impossible de récupérer la liste des enfants')
          }
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

  // Charger les bulletins quand l'élève ou l'année scolaire change
  useEffect(() => {
    const loadReportCards = async () => {
      if (!selectedStudentId || !selectedSchoolYear) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await getStudentReportCards(selectedStudentId, selectedSchoolYear)
        setReportCards(data)
      } catch (error) {
        console.error('Erreur lors du chargement des bulletins:', error)
        setError('Impossible de charger les bulletins. Veuillez réessayer plus tard.')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadReportCards()
  }, [selectedStudentId, selectedSchoolYear])

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Fonction pour déterminer la couleur de la moyenne
  function getAverageColor(average: number): string {
    if (average >= 16) return 'text-green-600 font-semibold'
    if (average >= 12) return 'text-blue-600'
    if (average >= 10) return 'text-amber-600'
    return 'text-red-600'
  }

  if (status === 'loading' || (isLoading && !error)) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-[40px] w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[50px] w-full" />
          <Skeleton className="h-[50px] w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
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

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Mes bulletins de notes</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Sélectionnez une année scolaire pour afficher les bulletins correspondants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userRole === 'PARENT' && students.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Élève</label>
                <Select
                  value={selectedStudentId}
                  onValueChange={(value) => setSelectedStudentId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un élève" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.user.lastName} {student.user.firstName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Année scolaire</label>
              <Select
                value={selectedSchoolYear}
                onValueChange={(value) => setSelectedSchoolYear(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  {schoolYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {reportCards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <BookIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Aucun bulletin disponible</h3>
          <p className="mt-2 text-sm text-gray-500">
            Aucun bulletin n'est disponible pour cette année scolaire
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCards.map((reportCard) => (
            <Card key={reportCard.id} className="overflow-hidden">
              <div className={`p-4 ${
                reportCard.status === 'PUBLISHED' 
                  ? 'bg-green-50 border-b border-green-100' 
                  : 'bg-amber-50 border-b border-amber-100'
              }`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    {reportCard.period.type === 'TRIMESTER' ? 'Trimestre' : 
                     reportCard.period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - {reportCard.period.schoolYear}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    reportCard.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {reportCard.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Période</p>
                  <p className="text-sm">
                    {formatDate(reportCard.period.startDate)} - {formatDate(reportCard.period.endDate)}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Moyenne générale</p>
                  <p className={`text-xl font-bold ${getAverageColor(reportCard.average)}`}>
                    {reportCard.average.toFixed(2)}/20
                  </p>
                </div>
                {reportCard.appreciation && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Appréciation</p>
                    <p className="text-sm line-clamp-2">{reportCard.appreciation}</p>
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/report-cards/${reportCard.id}`)}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => downloadReportCardPDF(reportCard.id)}
                    disabled={reportCard.status !== 'PUBLISHED'}
                  >
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 