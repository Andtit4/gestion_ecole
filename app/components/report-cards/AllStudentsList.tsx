'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, FileSpreadsheet, AlertCircle, Check, X } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'

interface AllStudentsListProps {
  classId?: string
  periods: any[]
  userRole?: string
}

export function AllStudentsList({ classId, periods, userRole = 'STUDENT' }: AllStudentsListProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const router = useRouter()

  // Utiliser un indicateur de montage pour s'assurer que les donn�es sont charg�es au montage du composant
  useEffect(() => {
    console.log('AllStudentsList - Composant mont�')
    
    // S�lectionner la p�riode la plus r�cente par d�faut si n�cessaire
    if (periods.length > 0 && !selectedPeriod) {
      const sortedPeriods = [...periods].sort((a, b) => {
        if (a.schoolYear !== b.schoolYear) {
          return b.schoolYear.localeCompare(a.schoolYear)
        }
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      })
      
      setSelectedPeriod(sortedPeriods[0].id)
      console.log('P�riode s�lectionn�e par d�faut:', sortedPeriods[0].id)
    }
    
    // Toujours charger les �l�ves au montage
    fetchAllStudents()
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // D�pendance vide pour ex�cuter uniquement au montage

  // Recharger les donn�es quand le classId change
  useEffect(() => {
    console.log('AllStudentsList - classId changed:', classId)
    fetchAllStudents()
  }, [classId])

  // Fonction pour charger tous les �l�ves
  const fetchAllStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Chargement des �l�ves - classId:', classId || 'tous')
      
      // Construire les param�tres de la requ�te
      const params = new URLSearchParams()
      if (classId) {
        params.append('classId', classId)
      }
      
      const response = await fetch(`/api/students/all?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Nombre d\'�l�ves re�us:', data.length)
      setStudents(data)
    } catch (error) {
      console.error('Erreur lors du chargement des �l�ves:', error)
      setError('Impossible de charger les �l�ves. Veuillez r�essayer plus tard.')
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les �l�ves par recherche
  const filteredStudents = searchQuery
    ? students.filter((student: any) => {
        const studentName = `${student.user.firstName} ${student.user.lastName}`.toLowerCase()
        return studentName.includes(searchQuery.toLowerCase())
      })
    : students

  // Naviguer vers la cr�ation d'un bulletin
  const navigateToCreateReportCard = (studentId: string) => {
    router.push(`/dashboard/report-cards/new?studentId=${studentId}&periodId=${selectedPeriod}`)
  }

  // Naviguer vers les notes de l'�l�ve
  const navigateToStudentGrades = (studentId: string) => {
    router.push(`/dashboard/grades?studentId=${studentId}&periodId=${selectedPeriod}`)
  }

  // Ajouter un bouton pour rafra�chir manuellement
  const handleRefresh = () => {
    fetchAllStudents()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">P�riode</label>
          <Select
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value)}
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
          <label className="block text-sm font-medium mb-1">Rechercher un �l�ve</label>
          <Input
            placeholder="Nom ou pr�nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-end">
          <Button onClick={handleRefresh} variant="outline" className="mb-0.5">
            Rafra�chir la liste
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            Liste compl�te des �l�ves {classId ? 'de la classe' : ''}
          </CardTitle>
          <div>
            {!loading && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {filteredStudents.length} �l�ve(s)
              </Badge>
            )}
          </div>
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
              Aucun �l�ve trouv�.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>�l�ve</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Bulletin</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.user.lastName} {student.user.firstName}
                    </TableCell>
                    <TableCell>{student.class?.name || 'Non assign�'}</TableCell>
                    <TableCell>
                      {student._count.grades > 0 ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          {student._count.grades} notes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-500">
                          <X className="h-3 w-3 mr-1" />
                          Aucune note
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {student._count.reportCards > 0 ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          <Check className="h-3 w-3 mr-1" />
                          {student._count.reportCards} bulletin(s)
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-500">
                          <X className="h-3 w-3 mr-1" />
                          Aucun bulletin
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => navigateToStudentGrades(student.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Notes
                      </Button>
                      
                      {(userRole === 'ADMIN' || userRole === 'TEACHER') && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => navigateToCreateReportCard(student.id)}
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-1" />
                          Cr�er bulletin
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


