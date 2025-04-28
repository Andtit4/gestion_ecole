'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CourseForm } from '@/components/courses/CourseForm'
import { toast } from 'sonner'

interface Course {
  id: string
  name: string
  coefficient: number
  level: string
  description: string
  teacher: {
    id: string
    firstName: string
    lastName: string
  }
}

interface Teacher {
  id: string
  firstName: string
  lastName: string
}

export default function CoursesPage() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [filters, setFilters] = useState({
    level: '',
    teacherId: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCourses()
    fetchTeachers()
  }, [filters])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      let url = '/api/courses'
      const params = new URLSearchParams()
      
      if (filters.level) params.append('level', filters.level)
      if (filters.teacherId) params.append('teacherId', filters.teacherId)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Échec de la récupération des matières')
      }
      
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error)
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les matières',
        variant: 'destructive',
      })
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers')
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Échec de la récupération des enseignants')
      }
      
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des enseignants:', error)
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les enseignants',
        variant: 'destructive',
      })
      setTeachers([])
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) return

    try {
      const response = await fetch(`/api/courses?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Erreur lors de la suppression de la matière')
      toast.success('Matière supprimée avec succès')
      fetchCourses()
    } catch (error) {
      toast.error('Erreur lors de la suppression de la matière')
    }
  }

  const handleEdit = (course: Course) => {
    setSelectedCourse(course)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setSelectedCourse(null)
    setIsFormOpen(false)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/courses', {
        method: selectedCourse ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCourse ? { ...data, id: selectedCourse.id } : data),
      })
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde de la matière')
      toast.success('Matière sauvegardée avec succès')
      handleFormClose()
      fetchCourses()
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde de la matière')
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Matières</h1>
        <Button onClick={() => setIsFormOpen(true)}>Ajouter une matière</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={filters.level}
              onValueChange={(value) => setFilters({ ...filters, level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="6ème">6ème</SelectItem>
                <SelectItem value="5ème">5ème</SelectItem>
                <SelectItem value="4ème">4ème</SelectItem>
                <SelectItem value="3ème">3ème</SelectItem>
                <SelectItem value="2nde">2nde</SelectItem>
                <SelectItem value="1ère">1ère</SelectItem>
                <SelectItem value="Terminale">Terminale</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.teacherId}
              onValueChange={(value) => setFilters({ ...filters, teacherId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Professeur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les professeurs</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Matières</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Professeur</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.coefficient}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>
                    {course.teacher.firstName} {course.teacher.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(course)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
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
        <CourseForm
          course={selectedCourse}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          teachers={teachers}
        />
      )}
    </div>
  )
} 