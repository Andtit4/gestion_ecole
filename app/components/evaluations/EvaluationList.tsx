'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Subject {
  id: string
  name: string
}

interface Class {
  id: string
  name: string
}

interface Evaluation {
  id: string
  title: string
  date: string
  coefficient: number
  maxScore: number
  subjectId: string
  classId: string
  subject: Subject
  class: Class
}

interface EvaluationListProps {
  classId?: string
  teacherId?: string
  limit?: number
  showActions?: boolean
}

export default function EvaluationList({ 
  classId, 
  teacherId, 
  limit,
  showActions = true
}: EvaluationListProps) {
  const { data: session } = useSession()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEvaluations()
  }, [classId, teacherId])

  const fetchEvaluations = async () => {
    setIsLoading(true)
    try {
      let url = '/api/evaluations'
      const params = new URLSearchParams()
      
      if (classId) params.append('classId', classId)
      if (teacherId) params.append('teacherId', teacherId)
      if (limit) params.append('limit', limit.toString())
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setEvaluations(data)
      } else {
        setError('Erreur lors du chargement des évaluations')
      }
    } catch (error) {
      console.error('Erreur lors du chargement des évaluations:', error)
      setError('Une erreur est survenue lors du chargement des évaluations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette évaluation?')) return
    
    try {
      const response = await fetch(`/api/evaluations/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setEvaluations(evaluations.filter(evaluation => evaluation.id !== id))
      } else {
        setError('Erreur lors de la suppression de l\'évaluation')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      setError('Une erreur est survenue lors de la suppression')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return <div className="text-center p-4">Chargement en cours...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (evaluations.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Aucune évaluation trouvée</p>
        {showActions && session?.user?.role === 'TEACHER' && (
          <Link
            href={classId ? `/teacher/classes/${classId}/evaluations/new` : `/teacher/evaluations/new`}
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Créer une évaluation
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Matière
            </th>
            {!classId && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classe
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coefficient
            </th>
            {showActions && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {evaluations.map(evaluation => (
            <tr key={evaluation.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{evaluation.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{evaluation.subject.name}</div>
              </td>
              {!classId && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{evaluation.class.name}</div>
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(evaluation.date)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{evaluation.coefficient}</div>
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/teacher/evaluations/${evaluation.id}/grades`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Notes
                    </Link>
                    {session?.user?.role === 'TEACHER' && (
                      <>
                        <Link
                          href={`/teacher/evaluations/${evaluation.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(evaluation.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 


