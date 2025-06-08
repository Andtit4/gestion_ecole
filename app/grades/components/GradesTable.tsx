'use client'

import { useState } from 'react'
import { Grade, Course } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import EditGradeDialog from './EditGradeDialog'

// Type mis à jour pour refléter la structure actuelle des données
type GradeWithDetails = Grade & {
  student: {
    id: string
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
    class?: {
      id: string
      name: string
      level: string
    } | null
  }
  course: Course
}

interface GradesTableProps {
  grades: GradeWithDetails[]
  onDelete: (id: string) => void
  onUpdate: (id: string, grade: Partial<Grade>) => void
}

export default function GradesTable({ grades, onDelete, onUpdate }: GradesTableProps) {
  const [editingGrade, setEditingGrade] = useState<GradeWithDetails | null>(null)

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Élève</TableHead>
              <TableHead>Matière</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Aucune note enregistrée
                </TableCell>
              </TableRow>
            ) : (
              grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>
                    {grade.student && grade.student.user 
                      ? `${grade.student.user.firstName} ${grade.student.user.lastName}`
                      : 'Élève inconnu'}
                  </TableCell>
                  <TableCell>{grade.course?.name || 'Matière inconnue'}</TableCell>
                  <TableCell>{grade.value}/20</TableCell>
                  <TableCell>{grade.comment || '-'}</TableCell>
                  <TableCell>
                    {new Date(grade.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingGrade(grade)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(grade.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditGradeDialog
        grade={editingGrade}
        open={!!editingGrade}
        onOpenChange={(open) => !open && setEditingGrade(null)}
        onSubmit={(updatedGrade) => {
          if (editingGrade) {
            onUpdate(editingGrade.id, updatedGrade)
            setEditingGrade(null)
          }
        }}
      />
    </>
  )
} 


