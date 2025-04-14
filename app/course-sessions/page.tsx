'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CourseSessionForm } from '@/components/course-sessions/CourseSessionForm'
import { toast } from 'sonner'

interface CourseSession {
  id: string
  date: string
  startTime: string
  endTime: string
  content: string
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  class: {
    id: string
    name: string
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

interface Class {
  id: string
  name: string
}

interface Course {
  id: string
  name: string
}

interface Teacher {
  id: string
  firstName: string
  lastName: string
}

export default function CourseSessionsPage() {
  const { data: session } = useSession()
  const [sessions, setSessions] = useState<CourseSession[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<CourseSession | null>(null)
  const [filters, setFilters] = useState({
    classId: '',
    courseId: '',
    teacherId: '',
    status: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    fetchSessions()
    fetchClasses()
    fetchCourses()
    fetchTeachers()
  }, [filters])

  const fetchSessions = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.classId) params.append('classId', filters.classId)
      if (filters.courseId) params.append('courseId', filters.courseId)
      if (filters.teacherId) params.append('teacherId', filters.teacherId)
      if (filters.status) params.append('status', filters.status)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const response = await fetch(`/api/course-sessions?${params.toString()}`)
      if (!response.ok) throw new Error('Erreur lors de la récupération des sessions')
      const data = await response.json()
      setSessions(data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des sessions')
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      if (!response.ok) throw new Error('Erreur lors de la récupération des classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des classes')
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

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers')
      if (!response.ok) throw new Error('Erreur lors de la récupération des professeurs')
      const data = await response.json()
      setTeachers(data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des professeurs')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) return

    try {
      const response = await fetch(`/api/course-sessions?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Erreur lors de la suppression de la session')
      toast.success('Session supprimée avec succès')
      fetchSessions()
    } catch (error) {
      toast.error('Erreur lors de la suppression de la session')
    }
  }

  const handleEdit = (session: CourseSession) => {
    setSelectedSession(session)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setSelectedSession(null)
    setIsFormOpen(false)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/course-sessions', {
        method: selectedSession ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedSession ? { ...data, id: selectedSession.id } : data),
      })
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde de la session')
      toast.success('Session sauvegardée avec succès')
      handleFormClose()
      fetchSessions()
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde de la session')
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Sessions de Cours</h1>
        <Button onClick={() => setIsFormOpen(true)}>Ajouter une session</Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.classId}
              onValueChange={(value) => setFilters({ ...filters, classId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les classes</SelectItem>
                {classes.map((class_) => (
                  <SelectItem key={class_.id} value={class_.id}>
                    {class_.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.courseId}
              onValueChange={(value) => setFilters({ ...filters, courseId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les matières</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
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
                <SelectItem value="">Tous les professeurs</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="PLANNED">Planifié</SelectItem>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="COMPLETED">Terminé</SelectItem>
                <SelectItem value="CANCELLED">Annulé</SelectItem>
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
          <CardTitle>Liste des Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Professeur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    {new Date(session.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {session.startTime} - {session.endTime}
                  </TableCell>
                  <TableCell>{session.class.name}</TableCell>
                  <TableCell>{session.course.name}</TableCell>
                  <TableCell>
                    {session.teacher.firstName} {session.teacher.lastName}
                  </TableCell>
                  <TableCell>
                    {session.status === 'PLANNED'
                      ? 'Planifié'
                      : session.status === 'IN_PROGRESS'
                      ? 'En cours'
                      : session.status === 'COMPLETED'
                      ? 'Terminé'
                      : 'Annulé'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(session)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(session.id)}
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
        <CourseSessionForm
          session={selectedSession}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          classes={classes}
          courses={courses}
          teachers={teachers}
        />
      )}
    </div>
  )
} 