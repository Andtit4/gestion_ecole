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
import { Plus } from 'lucide-react'
import { GradeForm } from './GradeForm'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Grade {
  id: string
  value: number
  type: string
  date: string
  coefficient: number
  comment: string | null
  student: {
    id: string
    firstName: string
    lastName: string
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

interface Course {
  id: string
  name: string
}

interface Student {
  id: string
  firstName: string
  lastName: string
}

export function GradeList() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchCourses()
    fetchStudents()
  }, [])

  useEffect(() => {
    if (selectedCourse || selectedStudent) {
      fetchGrades()
    }
  }, [selectedCourse, selectedStudent])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (!response.ok) throw new Error('Erreur lors de la récupération des cours')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (!response.ok) throw new Error('Erreur lors de la récupération des élèves')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const fetchGrades = async () => {
    try {
      let url = '/api/grades'
      const params = new URLSearchParams()
      if (selectedCourse) params.append('courseId', selectedCourse)
      if (selectedStudent) params.append('studentId', selectedStudent)
      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url)
      if (!response.ok) throw new Error('Erreur lors de la récupération des notes')
      const data = await response.json()
      setGrades(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des Notes</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Note
        </Button>
      </div>

      <div className="flex space-x-4">
        <Select
          value={selectedCourse}
          onValueChange={setSelectedCourse}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par matière" />
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
          value={selectedStudent}
          onValueChange={setSelectedStudent}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par élève" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les élèves</SelectItem>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead>Matière</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Coefficient</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Professeur</TableHead>
            <TableHead>Commentaire</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell>
                {grade.student.firstName} {grade.student.lastName}
              </TableCell>
              <TableCell>{grade.course.name}</TableCell>
              <TableCell>{grade.type}</TableCell>
              <TableCell>{grade.value}</TableCell>
              <TableCell>{grade.coefficient}</TableCell>
              <TableCell>
                {new Date(grade.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {grade.teacher.firstName} {grade.teacher.lastName}
              </TableCell>
              <TableCell>{grade.comment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isFormOpen && (
        <GradeForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false)
            fetchGrades()
          }}
        />
      )}
    </div>
  )
} 