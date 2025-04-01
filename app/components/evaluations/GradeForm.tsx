'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Student {
  id: string
  name: string
  email: string
  userId: string
}

interface Grade {
  id?: string
  value: number
  comment?: string
  studentId: string
  evaluationId: string
}

interface GradeFormProps {
  evaluationId: string
}

export default function GradeForm({ evaluationId }: GradeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Record<string, Grade>>({})
  const [evaluation, setEvaluation] = useState<{
    id: string
    title: string
    date: string
    maxScore: number
    classId: string
    class: { name: string }
    subject: { name: string }
  } | null>(null)

  useEffect(() => {
    fetchEvaluationDetails()
  }, [evaluationId])

  const fetchEvaluationDetails = async () => {
    setIsLoading(true)
    try {
      // Récupération des détails de l'évaluation
      const evalResponse = await fetch(`/api/evaluations/${evaluationId}`)
      if (!evalResponse.ok) {
        throw new Error('Impossible de charger les détails de l\'évaluation')
      }
      const evalData = await evalResponse.json()
      setEvaluation(evalData)

      // Récupération des élèves de la classe
      const studentsResponse = await fetch(`/api/classes/${evalData.classId}/students`)
      if (!studentsResponse.ok) {
        throw new Error('Impossible de charger la liste des élèves')
      }
      const studentsData = await studentsResponse.json()
      setStudents(studentsData)

      // Récupération des notes existantes
      const gradesResponse = await fetch(`/api/evaluations/${evaluationId}/grades`)
      if (!gradesResponse.ok) {
        throw new Error('Impossible de charger les notes existantes')
      }
      const gradesData = await gradesResponse.json()

      // Initialiser les notes
      const gradesMap: Record<string, Grade> = {}
      studentsData.forEach((student: Student) => {
        const existingGrade = gradesData.find((g: Grade) => g.studentId === student.id)
        gradesMap[student.id] = existingGrade || {
          studentId: student.id,
          evaluationId: evaluationId,
          value: 0,
          comment: ''
        }
      })
      setGrades(gradesMap)

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      setErrorMessage('Une erreur est survenue lors du chargement des données')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGradeChange = (studentId: string, value: number) => {
    const maxScore = evaluation?.maxScore || 20
    // Limiter la valeur entre 0 et maxScore
    const clampedValue = Math.max(0, Math.min(value, maxScore))
    
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        value: clampedValue
      }
    }))
  }

  const handleCommentChange = (studentId: string, comment: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        comment
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const gradesToSubmit = Object.values(grades)
      
      const response = await fetch(`/api/evaluations/${evaluationId}/grades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ grades: gradesToSubmit })
      })

      if (response.ok) {
        setSuccessMessage('Les notes ont été enregistrées avec succès')
        // Recharger les données pour avoir les IDs mis à jour
        await fetchEvaluationDetails()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Une erreur est survenue lors de l\'enregistrement des notes')
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des notes:', error)
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Une erreur est survenue lors de l\'enregistrement des notes')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center p-4">Chargement en cours...</div>
  }

  if (!evaluation) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">Impossible de charger les détails de évaluation</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Saisie des notes - {evaluation.title}
        </h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
          <div>
            <p className="text-sm text-gray-500">Classe</p>
            <p className="font-medium">{evaluation.class.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Matière</p>
            <p className="font-medium">{evaluation.subject.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{new Date(evaluation.date).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Note maximale</p>
            <p className="font-medium">{evaluation.maxScore}</p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élève
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note sur {evaluation.maxScore}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commentaire
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        max={evaluation.maxScore}
                        step="0.5"
                        value={grades[student.id]?.value || 0}
                        onChange={(e) => handleGradeChange(student.id, parseFloat(e.target.value))}
                        className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <textarea
                        rows={2}
                        value={grades[student.id]?.comment || ''}
                        onChange={(e) => handleCommentChange(student.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Commentaire facultatif"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer les notes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 