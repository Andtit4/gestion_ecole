'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function DebugPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [apiData, setApiData] = useState<any>({
    periods: [],
    students: [],
    classes: [],
    reportCards: []
  })

  useEffect(() => {
    // Charger les données API au chargement de la page
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [periods, students, classes, reportCards] = await Promise.all([
        fetch('/api/periods').then(res => res.json()),
        fetch('/api/students').then(res => res.json()),
        fetch('/api/classes').then(res => res.json()),
        fetch('/api/report-cards').then(res => res.json())
      ])

      setApiData({
        periods,
        students,
        classes,
        reportCards
      })

      setResult({
        success: true,
        message: 'Données chargées avec succès'
      })
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors du chargement des données'
      })
    } finally {
      setLoading(false)
    }
  }

  const createTestPeriod = async () => {
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/periods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'TRIMESTER',
          startDate: new Date('2023-09-01').toISOString(),
          endDate: new Date('2023-12-20').toISOString(),
          schoolYear: '2023-2024',
          status: 'ACTIVE'
        })
      })

      if (response.ok) {
        await fetchAllData()
        setResult({
          success: true,
          message: 'Période de test créée avec succès'
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Une erreur est survenue'
      })
    } finally {
      setLoading(false)
    }
  }

  const createTestClass = async () => {
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Classe Test',
          level: 'CM2',
          year: 2023
        })
      })

      if (response.ok) {
        await fetchAllData()
        setResult({
          success: true,
          message: 'Classe de test créée avec succès'
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Une erreur est survenue'
      })
    } finally {
      setLoading(false)
    }
  }

  const createTestStudent = async () => {
    setLoading(true)
    setResult(null)
    try {
      // Créer d'abord un utilisateur si nécessaire
      const userResponse = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Élève',
          lastName: 'Test',
          email: 'eleve.test@ecole.com',
          password: 'motdepasse',
          classId: apiData.classes.length > 0 ? apiData.classes[0].id : null
        })
      })

      if (userResponse.ok) {
        await fetchAllData()
        setResult({
          success: true,
          message: 'Élève de test créé avec succès'
        })
      } else {
        const data = await userResponse.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Une erreur est survenue'
      })
    } finally {
      setLoading(false)
    }
  }

  const createTestReportCard = async () => {
    setLoading(true)
    setResult(null)
    try {
      // Vérifier que nous avons un élève et une période
      if (apiData.students.length === 0 || apiData.periods.length === 0) {
        throw new Error('Vous devez créer au moins un élève et une période avant de créer un bulletin')
      }

      const response = await fetch('/api/report-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: apiData.students[0].id,
          periodId: apiData.periods[0].id,
          average: 14.5,
          appreciation: 'Bon travail dans l\'ensemble. Continuez ainsi !',
          status: 'DRAFT'
        })
      })

      if (response.ok) {
        await fetchAllData()
        setResult({
          success: true,
          message: 'Bulletin de test créé avec succès'
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Une erreur est survenue'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Outils de débogage</h1>

      {result && (
        <div className={`p-4 mb-6 border rounded-md flex items-center gap-3 ${result.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {result.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p>{result.message}</p>
        </div>
      )}

      <Tabs defaultValue="data">
        <TabsList>
          <TabsTrigger value="data">Données</TabsTrigger>
          <TabsTrigger value="create">Créer des données</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Données actuelles</CardTitle>
              <CardDescription>
                Données récupérées depuis les API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Périodes ({apiData.periods.length})</h3>
                <ul className="list-disc pl-5">
                  {apiData.periods.map((period: any) => (
                    <li key={period.id}>
                      {period.type} - {period.schoolYear} ({period.status})
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Classes ({apiData.classes.length})</h3>
                <ul className="list-disc pl-5">
                  {apiData.classes.map((cls: any) => (
                    <li key={cls.id}>
                      {cls.name} - {cls.level} ({cls.year})
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Élèves ({apiData.students.length})</h3>
                <ul className="list-disc pl-5">
                  {apiData.students.map((student: any) => (
                    <li key={student.id}>
                      {student.user.firstName} {student.user.lastName}
                      {student.class ? ` (${student.class.name})` : ' (Sans classe)'}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Bulletins ({apiData.reportCards.length})</h3>
                <ul className="list-disc pl-5">
                  {apiData.reportCards.map((reportCard: any) => (
                    <li key={reportCard.id}>
                      Élève: {reportCard.student.user.firstName} {reportCard.student.user.lastName} -
                      Période: {reportCard.period.type} {reportCard.period.schoolYear} -
                      Moyenne: {reportCard.average} -
                      Statut: {reportCard.status}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={fetchAllData} disabled={loading}>
                {loading ? "Chargement..." : "Rafraîchir les données"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Création de données de test</CardTitle>
              <CardDescription>
                Utilisez ces boutons pour créer rapidement des données de test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Périodes</h3>
                <Button onClick={createTestPeriod} disabled={loading}>
                  {loading ? "Création en cours..." : "Créer une période de test"}
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Classes</h3>
                <Button onClick={createTestClass} disabled={loading}>
                  {loading ? "Création en cours..." : "Créer une classe de test"}
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Élèves</h3>
                <Button onClick={createTestStudent} disabled={loading}>
                  {loading ? "Création en cours..." : "Créer un élève de test"}
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Bulletins</h3>
                <Button onClick={createTestReportCard} disabled={loading}>
                  {loading ? "Création en cours..." : "Créer un bulletin de test"}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                Les données créées ici sont destinées uniquement au développement et aux tests.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 