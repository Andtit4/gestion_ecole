'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Input } from '@/app/components/ui/input'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import { Eye, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/app/components/ui/skeleton'
import { useRouter } from 'next/navigation'

interface StudentsWithGradesListProps {
  classId?: string
  periods: any[]
  userRole?: string
}

export function StudentsWithGradesList({ classId, periods, userRole = 'STUDENT' }: StudentsWithGradesListProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const router = useRouter()

  // Charger les données quand le classId ou la période change
  useEffect(() => {
    if (periods.length > 0 && !selectedPeriod) {
      // Sélectionner la période la plus récente par défaut
      const sortedPeriods = [...periods].sort((a, b) => {
        if (a.schoolYear !== b.schoolYear) {
          return b.schoolYear.localeCompare(a.schoolYear)
        }
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      })
      
      setSelectedPeriod(sortedPeriods[0].id)
    } else if (selectedPeriod) {
      fetchStudentsWithGrades()
    }
  }, [classId, selectedPeriod, periods])

  // Fonction pour charger les élèves ayant des notes
  const fetchStudentsWithGrades = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Construire les paramètres de la requête
      const params = new URLSearchParams()
      if (selectedPeriod) {
        params.append('periodId', selectedPeriod)
      }
      if (classId) {
        params.append('classId', classId)
      }
      
      const response = await fetch(`/api/students/with-grades?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Erreur lors du chargement des élèves avec notes:', error)
      setError('Impossible de charger les élèves. Veuillez réessayer plus tard.')
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les élèves par recherche
  const filteredStudents = searchQuery
    ? students.filter((student: any) => {
        const studentName = `${student.user.firstName} ${student.user.lastName}`.toLowerCase()
        return studentName.includes(searchQuery.toLowerCase())
      })
    : students

  // Naviguer vers la création d'un bulletin
  const navigateToCreateReportCard = (studentId: string) => {
    router.push(`/dashboard/report-cards/new?studentId=${studentId}&periodId=${selectedPeriod}`)
  }

  // Naviguer vers les notes de l'élève
  const navigateToStudentGrades = (studentId: string) => {
    router.push(`/dashboard/grades?studentId=${studentId}&periodId=${selectedPeriod}`)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Période</label>
          <Select
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value)}
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
        
        <div>
          <label className="block text-sm font-medium mb-1">Rechercher un élève</label>
          <Input
            placeholder="Nom ou prénom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Élèves avec notes {classId ? 'de la classe' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Aucun élève avec des notes pour cette période.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Élève</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Nombre de notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.user.lastName} {student.user.firstName}
                    </TableCell>
                    <TableCell>{student.class?.name || 'Non assigné'}</TableCell>
                    <TableCell>{student._count.grades}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => navigateToStudentGrades(student.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir les notes
                      </Button>
                      
                      {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => navigateToCreateReportCard(student.id)}
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-1" />
                          Créer bulletin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 