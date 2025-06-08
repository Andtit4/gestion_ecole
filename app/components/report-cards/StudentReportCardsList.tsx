'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DownloadIcon, AlertCircleIcon, EyeIcon } from 'lucide-react'
import { getClassReportCards, downloadReportCardPDF } from './ReportCardAPI'
import { useRouter } from 'next/navigation'

interface StudentReportCardsListProps {
  classId?: string
  periods: any[]
  userRole?: string
}

export function StudentReportCardsList({ classId, periods, userRole = 'STUDENT' }: StudentReportCardsListProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [reportCards, setReportCards] = useState<any[]>([])
  const [classData, setClassData] = useState<any>(null)
  const router = useRouter()

  // Colonnes du tableau
  const columns = [
    {
      id: 'student',
      header: '�l�ve',
      cell: ({ row }: any) => (
        <div className="font-medium">
          {row.original.student.user.lastName} {row.original.student.user.firstName}
        </div>
      )
    },
    {
      id: 'class',
      header: 'Classe',
      cell: ({ row }: any) => <div>{row.original.student.class?.name || '-'}</div>
    },
    {
      id: 'average',
      header: 'Moyenne',
      cell: ({ row }: any) => (
        <div className={getAverageColor(row.original.average)}>
          {row.original.average.toFixed(2)}/20
        </div>
      )
    },
    {
      id: 'status',
      header: 'Statut',
      cell: ({ row }: any) => (
        <div className={`px-2 py-1 rounded-full text-xs inline-block ${
          row.original.status === 'PUBLISHED' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-amber-100 text-amber-800'
        }`}>
          {row.original.status === 'PUBLISHED' ? 'Publi�' : 'Brouillon'}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push(`/dashboard/report-cards/${row.original.id}`)}
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Voir
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => downloadReportCardPDF(row.original.id)}
            disabled={row.original.status !== 'PUBLISHED'}
          >
            <DownloadIcon className="h-4 w-4 mr-1" />
            PDF
          </Button>
        </div>
      )
    }
  ]

  // Charger les donn�es quand le classId ou la p�riode change
  useEffect(() => {
    if (classId && selectedPeriod) {
      fetchReportCards()
    } else if (periods.length > 0 && !selectedPeriod) {
      // S�lectionner la p�riode la plus r�cente par d�faut
      const sortedPeriods = [...periods].sort((a, b) => {
        if (a.schoolYear !== b.schoolYear) {
          return b.schoolYear.localeCompare(a.schoolYear)
        }
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      })
      
      setSelectedPeriod(sortedPeriods[0].id)
    }
  }, [classId, selectedPeriod, periods])

  // Fonction pour charger les bulletins
  const fetchReportCards = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getClassReportCards(classId || '', selectedPeriod)
      setReportCards(data.reportCards)
      setClassData(data)
    } catch (error) {
      console.error('Erreur lors du chargement des bulletins:', error)
      setError('Impossible de charger les bulletins. Veuillez r�essayer plus tard.')
    } finally {
      setLoading(false)
    }
  }

  // Filtrer les bulletins par recherche
  const filteredReportCards = searchQuery
    ? reportCards.filter((card: any) => {
        const studentName = `${card.student.user.firstName} ${card.student.user.lastName}`.toLowerCase()
        return studentName.includes(searchQuery.toLowerCase())
      })
    : reportCards

  // Fonction pour d�terminer la couleur de la moyenne
  function getAverageColor(average: number): string {
    if (average >= 16) return 'text-green-600 font-semibold'
    if (average >= 12) return 'text-blue-600'
    if (average >= 10) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
      </div>
      
      {/* Afficher les stats si disponibles et que l'utilisateur est admin ou enseignant */}
      {classData && classData.stats && (userRole === 'ADMIN' || userRole === 'TEACHER') && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-500">�l�ves</div>
            <div className="text-xl font-semibold">{classData.stats.totalStudents}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-500">Bulletins</div>
            <div className="text-xl font-semibold">{classData.stats.totalReportCards}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-500">Moyenne de classe</div>
            <div className={`text-xl font-semibold ${getAverageColor(classData.stats.averageClassAverage)}`}>
              {classData.stats.averageClassAverage.toFixed(2)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-500">Meilleure moyenne</div>
            <div className={`text-xl font-semibold ${getAverageColor(classData.stats.highestAverage)}`}>
              {classData.stats.highestAverage.toFixed(2)}
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <DataTable
        columns={columns}
        data={filteredReportCards}
        loading={loading}
        searchPlaceholder="Rechercher un �l�ve..."
      />
      
      {filteredReportCards.length === 0 && !loading && !error && (
        <div className="text-center py-6 text-gray-500">
          Aucun bulletin disponible pour cette p�riode
        </div>
      )}
    </div>
  )
} 


