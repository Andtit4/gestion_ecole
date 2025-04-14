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
import { Plus, Download } from 'lucide-react'
import { ReportCardForm } from './ReportCardForm'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ReportCard {
  id: string
  period: {
    id: string
    type: string
    startDate: string
    endDate: string
    schoolYear: string
  }
  student: {
    id: string
    firstName: string
    lastName: string
  }
  average: number
  appreciation: string | null
  generatedAt: string
  status: string
}

interface Student {
  id: string
  firstName: string
  lastName: string
}

interface Period {
  id: string
  type: string
  startDate: string
  endDate: string
  schoolYear: string
}

export function ReportCardList() {
  const [reportCards, setReportCards] = useState<ReportCard[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [periods, setPeriods] = useState<Period[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchStudents()
    fetchPeriods()
  }, [])

  useEffect(() => {
    if (selectedStudent || selectedPeriod) {
      fetchReportCards()
    }
  }, [selectedStudent, selectedPeriod])

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

  const fetchPeriods = async () => {
    try {
      const response = await fetch('/api/periods')
      if (!response.ok) throw new Error('Erreur lors de la récupération des périodes')
      const data = await response.json()
      setPeriods(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const fetchReportCards = async () => {
    try {
      let url = '/api/report-cards'
      const params = new URLSearchParams()
      if (selectedStudent) params.append('studentId', selectedStudent)
      if (selectedPeriod) params.append('periodId', selectedPeriod)
      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url)
      if (!response.ok) throw new Error('Erreur lors de la récupération des relevés')
      const data = await response.json()
      setReportCards(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleDownload = async (reportCardId: string) => {
    try {
      const response = await fetch(`/api/report-cards/${reportCardId}/pdf`)
      if (!response.ok) throw new Error('Erreur lors de la génération du PDF')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `releve-${reportCardId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Liste des Relevés de Notes</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Relevé
        </Button>
      </div>

      <div className="flex space-x-4">
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

        <Select
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les périodes</SelectItem>
            {periods.map((period) => (
              <SelectItem key={period.id} value={period.id}>
                {period.type} - {period.schoolYear}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Moyenne</TableHead>
            <TableHead>Appréciation</TableHead>
            <TableHead>Date de génération</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reportCards.map((reportCard) => (
            <TableRow key={reportCard.id}>
              <TableCell>
                {reportCard.student.firstName} {reportCard.student.lastName}
              </TableCell>
              <TableCell>
                {reportCard.period.type} - {reportCard.period.schoolYear}
              </TableCell>
              <TableCell>{reportCard.average.toFixed(2)}</TableCell>
              <TableCell>{reportCard.appreciation}</TableCell>
              <TableCell>
                {new Date(reportCard.generatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{reportCard.status}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(reportCard.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isFormOpen && (
        <ReportCardForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false)
            fetchReportCards()
          }}
        />
      )}
    </div>
  )
} 