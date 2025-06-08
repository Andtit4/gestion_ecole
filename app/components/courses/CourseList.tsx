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
import { CourseForm } from './CourseForm'

interface Course {
  id: string
  name: string
  coefficient: number
  description: string | null
  level: string
  teacher: {
    id: string
    firstName: string
    lastName: string
  }
}

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des Matières</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Matière
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Coefficient</TableHead>
            <TableHead>Professeur</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.level}</TableCell>
              <TableCell>{course.coefficient}</TableCell>
              <TableCell>
                {course.teacher ? 
                  `${course.teacher.firstName} ${course.teacher.lastName}` : 
                  'Non assigné'
                }
              </TableCell>
              <TableCell>{course.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isFormOpen && (
        <CourseForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false)
            fetchCourses()
          }}
        />
      )}
    </div>
  )
} 


