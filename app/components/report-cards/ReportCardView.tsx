'use client'

import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { Printer, X, Download } from 'lucide-react'

type Period = {
  id: string
  type: string
  startDate: string
  endDate: string
  schoolYear: string
  status: string
}

type Student = {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
  }
  class?: {
    id: string
    name: string
  } | null
}

type Grade = {
  id: string
  value: number
  type: string
  date: string
  coefficient: number
  comment?: string | null
  course: {
    id: string
    name: string
  }
  teacher: {
    id: string
    user: {
      firstName: string
      lastName: string
    }
  }
}

type ReportCard = {
  id: string
  periodId: string
  studentId: string
  average: number
  appreciation?: string | null
  generatedAt: string
  status: string
  period: Period
  student: Student
}

interface ReportCardViewProps {
  reportCard: ReportCard
  open: boolean
  onClose: () => void
}

export default function ReportCardView({ reportCard, open, onClose }: ReportCardViewProps) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  // Gérer l'impression
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Bulletin_${reportCard.student.user.lastName}_${reportCard.period.schoolYear}`,
  })

  // Formater une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  // Charger les notes pour la période
  useState(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/grades?studentId=${reportCard.studentId}`, {
          credentials: 'include'
        })
        
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des notes')
        }
        
        const data = await res.json()
        
        // Filtrer les notes pour la période
        const periodStart = new Date(reportCard.period.startDate)
        const periodEnd = new Date(reportCard.period.endDate)
        
        const filteredGrades = data.filter((grade: Grade) => {
          const gradeDate = new Date(grade.date)
          return gradeDate >= periodStart && gradeDate <= periodEnd
        })
        
        // Trier par matière
        filteredGrades.sort((a: Grade, b: Grade) => 
          a.course.name.localeCompare(b.course.name)
        )
        
        setGrades(filteredGrades)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (open) {
      fetchGrades()
    }
  }, [open, reportCard.studentId, reportCard.period.startDate, reportCard.period.endDate])

  // Calculer la moyenne par matière
  const courseAverages = grades.reduce((acc: Record<string, {total: number, count: number, name: string}>, grade) => {
    const courseId = grade.course.id
    if (!acc[courseId]) {
      acc[courseId] = {
        total: 0,
        count: 0,
        name: grade.course.name
      }
    }
    
    const coef = grade.coefficient || 1
    acc[courseId].total += grade.value * coef
    acc[courseId].count += coef
    
    return acc
  }, {})

  // Convertir en tableau
  const averagesBySubject = Object.values(courseAverages).map(({ total, count, name }) => ({
    name,
    average: total / count
  })).sort((a, b) => a.name.localeCompare(b.name))

  // Statut du bulletin
  const getStatusBadge = () => {
    switch (reportCard.status) {
      case 'DRAFT':
        return <Badge variant="outline">Brouillon</Badge>
      case 'PUBLISHED':
        return <Badge variant="default">Publié</Badge>
      default:
        return <Badge variant="secondary">{reportCard.status}</Badge>
    }
  }

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/reportcards/export?id=${reportCard.id}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'exportation du bulletin");
      }
      
      // Créer un blob à partir de la réponse
      const blob = await response.blob();
      
      // Créer une URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien pour télécharger
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin_${reportCard.student.user.lastName.toLowerCase()}_${reportCard.period.schoolYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      a.remove();
      
    } catch (error) {
      console.error('Erreur:', error);
      // Vous pouvez afficher une notification d'erreur ici
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulletin de notes</DialogTitle>
          <DialogDescription>
            {reportCard.student.user.firstName} {reportCard.student.user.lastName} - {' '}
            {reportCard.period.type === 'TRIMESTER' ? 'Trimestre' : 
             reportCard.period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - {reportCard.period.schoolYear}
          </DialogDescription>
        </DialogHeader>

        <div ref={contentRef} className="p-6 bg-white">
          <div className="mb-6 print:mb-10 border-b pb-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold print:text-3xl">Bulletin de notes</h1>
              <p className="text-gray-500">
                {reportCard.period.type === 'TRIMESTER' ? 'Trimestre' : 
                 reportCard.period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - {reportCard.period.schoolYear}
              </p>
              <p className="text-sm text-gray-500">
                Du {formatDate(reportCard.period.startDate)} au {formatDate(reportCard.period.endDate)}
              </p>
            </div>
            <div className="print:absolute print:right-6 print:top-6">
              {getStatusBadge()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 print:mb-10">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Élève</h3>
                <p>{reportCard.student.user.firstName} {reportCard.student.user.lastName}</p>
                <p className="text-sm text-gray-500">
                  Classe: {reportCard.student.class?.name || 'Non assignée'}
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Résultats</h3>
                <p className="text-xl">{reportCard.average.toFixed(2)}/20</p>
                <p className="text-sm text-gray-500">
                  Bulletin généré le {formatDate(reportCard.generatedAt)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 print:mb-10">
            <h3 className="font-semibold mb-4">Résultats par matière</h3>
            {loading ? (
              <p>Chargement des notes...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead className="text-right">Moyenne</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {averagesBySubject.map((subject) => (
                    <TableRow key={subject.name}>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell className="text-right">{subject.average.toFixed(2)}/20</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {reportCard.appreciation && (
            <div className="mb-6 print:mb-10">
              <h3 className="font-semibold mb-2">Appréciation générale</h3>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <p>{reportCard.appreciation}</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mb-6 print:mb-10">
            <h3 className="font-semibold mb-4">Détail des notes</h3>
            {loading ? (
              <p>Chargement des notes...</p>
            ) : grades.length === 0 ? (
              <p>Aucune note pour cette période</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Enseignant</TableHead>
                    <TableHead className="text-right">Coef.</TableHead>
                    <TableHead className="text-right">Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>{formatDate(grade.date)}</TableCell>
                      <TableCell>{grade.course.name}</TableCell>
                      <TableCell>
                        {grade.type === 'EXAM' ? 'Examen' : 
                         grade.type === 'QUIZ' ? 'Quiz' : 'Devoir'}
                      </TableCell>
                      <TableCell>
                        {grade.teacher.user.firstName} {grade.teacher.user.lastName}
                      </TableCell>
                      <TableCell className="text-right">{grade.coefficient || 1}</TableCell>
                      <TableCell className="text-right">{grade.value}/20</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="print:hidden">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Fermer
            </Button>
          </div>
          <div className="print:hidden flex gap-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger PDF
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 


