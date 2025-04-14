'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GradeForm } from '@/components/grades/GradeForm'
import { toast } from 'sonner'

interface Grade {
  id: string
  value: number
  type: 'HOMEWORK' | 'QUIZ' | 'EXAM'
  date: string
  coefficient: number
  comment?: string
  student: {
    id: string
    firstName: string
    lastName: string
    class: {
      id: string
      name: string
    }
  }
  course: {
    id: string
    name: string
  }
  teacher: {
    id: string
    firstName: string
    lastName: string
  }
}

interface Student {
  id: string
  firstName: string
  lastName: string
  class: {
    id: string
    name: string
  }
}

interface Course {
  id: string
  name: string
}

export default function GradesPage() {
  const { data: session } = useSession()
  const [grades, setGrades] = useState<Grade[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)
  const [filters, setFilters] = useState({
    studentId: '',
    courseId: '',
    type: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    fetchGrades()
    fetchStudents()
    fetchCourses()
  }, [filters])

  const fetchGrades = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.studentId) params.append('studentId', filters.studentId)
      if (filters.courseId) params.append('courseId', filters.courseId)
      if (filters.type) params.append('type', filters.type)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const response = await fetch(`/api/grades?${params.toString()}`)
      if (!response.ok) throw new Error('Erreur lors de la récupération des notes')
      const data = await response.json()
      setGrades(data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des notes')
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (!response.ok) throw new Error('Erreur lors de la récupération des élèves')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des élèves')
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('Erreur lors de la récupération des cours')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des cours')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return

    try {
      const response = await fetch(`/api/grades?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Erreur lors de la suppression de la note')
      toast.success('Note supprimée avec succès')
      fetchGrades()
    } catch (error) {
      toast.error('Erreur lors de la suppression de la note')
    }
  }

  const handleEdit = (grade: Grade) => {
    setSelectedGrade(grade)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setSelectedGrade(null)
    setIsFormOpen(false)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/grades', {
        method: selectedGrade ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedGrade ? { ...data, id: selectedGrade.id } : data),
      })
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde de la note')
      toast.success('Note sauvegardée avec succès')
      handleFormClose()
      fetchGrades()
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde de la note')
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Notes</h1>
        <Button onClick={() => setIsFormOpen(true)}>Ajouter une note</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.studentId}
              onValueChange={(value) => setFilters({ ...filters, studentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un élève" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les élèves</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} - {student.class.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.courseId}
              onValueChange={(value) => setFilters({ ...filters, courseId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un cours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les cours</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type d'évaluation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les types</SelectItem>
                <SelectItem value="HOMEWORK">Devoir</SelectItem>
                <SelectItem value="QUIZ">Contrôle</SelectItem>
                <SelectItem value="EXAM">Examen</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              placeholder="Date de début"
            />

            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              placeholder="Date de fin"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>
                    {grade.student.firstName} {grade.student.lastName}
                  </TableCell>
                  <TableCell>{grade.student.class.name}</TableCell>
                  <TableCell>{grade.course.name}</TableCell>
                  <TableCell>
                    {grade.type === 'HOMEWORK'
                      ? 'Devoir'
                      : grade.type === 'QUIZ'
                      ? 'Contrôle'
                      : 'Examen'}
                  </TableCell>
                  <TableCell>{grade.value}</TableCell>
                  <TableCell>{grade.coefficient}</TableCell>
                  <TableCell>
                    {new Date(grade.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(grade)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(grade.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isFormOpen && (
        <GradeForm
          grade={selectedGrade}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          students={students}
          courses={courses}
        />
      )}
    </div>
  )
} 