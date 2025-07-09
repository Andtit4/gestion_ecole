import jsPDF from 'jspdf'
import type { Student } from '@/types/student'

export interface BulletinData {
  student: Student
  grades: any[]
  subjects: any[]
  studentAverage: number
  rank: string
  tenantName: string
  period?: string
  className?: string
}

export class BulletinPdfService {
  private doc: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number
  private currentY: number

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
    this.margin = 20
    this.currentY = this.margin
  }

  public async generateBulletin(data: BulletinData): Promise<void> {
    try {
      this.setupDoc()
      this.addHeader(data)
      this.addStudentInfo(data)
      this.addGradesTable(data)
      this.addFooter(data)
      
      // Télécharger le PDF
      const fileName = `Bulletin_${data.student.firstName}_${data.student.lastName}_${new Date().getFullYear()}.pdf`
      this.doc.save(fileName)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      throw new Error('Impossible de générer le bulletin PDF')
    }
  }

  private setupDoc(): void {
    // Configuration de la police par défaut
    this.doc.setFont('helvetica')
    this.doc.setFontSize(10)
  }

  private addHeader(data: BulletinData): void {
    // En-tête avec logo et informations établissement
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(data.tenantName || 'Établissement Scolaire', this.pageWidth / 2, this.currentY, { align: 'center' })
    this.currentY += 10

    this.doc.setFontSize(14)
    this.doc.text('BULLETIN DE NOTES', this.pageWidth / 2, this.currentY, { align: 'center' })
    this.currentY += 5

    // Ligne de séparation
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 15
  }

  private addStudentInfo(data: BulletinData): void {
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('INFORMATIONS ÉLÈVE', this.margin, this.currentY)
    this.currentY += 8

    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)

    // Informations sur deux colonnes
    const leftColumn = this.margin
    const rightColumn = this.pageWidth / 2 + 10

    // Colonne gauche
    this.doc.text(`Nom: ${data.student.lastName}`, leftColumn, this.currentY)
    this.doc.text(`Prénom: ${data.student.firstName}`, leftColumn, this.currentY + 5)
    this.doc.text(`Numéro: ${data.student.studentNumber || 'N/A'}`, leftColumn, this.currentY + 10)

    // Colonne droite
    this.doc.text(`Classe: ${data.className || data.student.academicInfo?.className || 'N/A'}`, rightColumn, this.currentY)
    this.doc.text(`Période: ${data.period || 'Année complète'}`, rightColumn, this.currentY + 5)
    this.doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, rightColumn, this.currentY + 10)

    this.currentY += 20
  }

  private addGradesTable(data: BulletinData): void {
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('NOTES PAR MATIÈRE', this.margin, this.currentY)
    this.currentY += 10

    // En-têtes du tableau
    const headers = ['Matière', 'Notes', 'Moyenne', 'Coefficient', 'Appréciation']
    const colWidths = [40, 35, 20, 20, 35]
    const startX = this.margin
    let currentX = startX

    // Dessiner les en-têtes
    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'bold')
    
    headers.forEach((header, index) => {
      this.doc.rect(currentX, this.currentY, colWidths[index], 8)
      this.doc.text(header, currentX + 2, this.currentY + 5)
      currentX += colWidths[index]
    })
    this.currentY += 8

    // Grouper les notes par matière
    const subjectGrades = this.groupGradesBySubject(data.grades)

    this.doc.setFont('helvetica', 'normal')
    
    Object.entries(subjectGrades).forEach(([subjectName, grades]) => {
      const subjectAverage = this.calculateSubjectAverage(grades as any[])
      const appreciation = this.getAppreciation(subjectAverage)
      
      // Données de la ligne
      const rowData = [
        subjectName,
        this.formatGradesList(grades as any[]),
        subjectAverage.toFixed(1),
        '1', // Coefficient par défaut
        appreciation
      ]

      currentX = startX
      rowData.forEach((data, index) => {
        this.doc.rect(currentX, this.currentY, colWidths[index], 6)
        this.doc.text(data.toString(), currentX + 2, this.currentY + 4)
        currentX += colWidths[index]
      })
      this.currentY += 6
    })

    this.currentY += 10

    // Résumé des moyennes
    this.addSummary(data)
  }

  private addSummary(data: BulletinData): void {
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    
    // Cadre pour le résumé
    const summaryHeight = 25
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, summaryHeight)
    
    this.doc.text('RÉSUMÉ', this.margin + 5, this.currentY + 8)
    
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`Moyenne générale: ${data.studentAverage.toFixed(1)}/20`, this.margin + 5, this.currentY + 15)
    this.doc.text(`Rang: ${data.rank}`, this.margin + 5, this.currentY + 20)
    
    // Appréciation générale
    const appreciation = this.getAppreciation(data.studentAverage)
    this.doc.text(`Appréciation: ${appreciation}`, this.pageWidth / 2 + 10, this.currentY + 15)

    this.currentY += summaryHeight + 10
  }

  private addFooter(data: BulletinData): void {
    const footerY = this.pageHeight - 30
    
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'italic')
    this.doc.text(`Bulletin généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 
                 this.pageWidth / 2, footerY, { align: 'center' })
    
    this.doc.text('Document confidentiel - Usage strictement personnel', 
                 this.pageWidth / 2, footerY + 5, { align: 'center' })
  }

  private groupGradesBySubject(grades: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {}
    
    grades.forEach(grade => {
      const subjectName = grade.subjectInfo?.name || 'Matière inconnue'
      if (!grouped[subjectName]) {
        grouped[subjectName] = []
      }
      grouped[subjectName].push(grade)
    })
    
    return grouped
  }

  private calculateSubjectAverage(subjectGrades: any[]): number {
    if (subjectGrades.length === 0) return 0
    
    let weightedSum = 0
    let weightSum = 0
    
    subjectGrades.forEach(grade => {
      if (!grade.isAbsent && (grade.score || grade.grade)) {
        const score = grade.score || grade.grade || 0
        const maxScore = grade.maxScore || grade.evaluationInfo?.maxScore || 20
        const coefficient = grade.evaluationInfo?.coefficient || 1
        
        // Convertir en note sur 20
        const normalizedGrade = (score / maxScore) * 20
        weightedSum += normalizedGrade * coefficient
        weightSum += coefficient
      }
    })
    
    return weightSum > 0 ? weightedSum / weightSum : 0
  }

  private formatGradesList(grades: any[]): string {
    const gradeStrings = grades
      .filter(grade => !grade.isAbsent && (grade.score || grade.grade))
      .map(grade => {
        const score = grade.score || grade.grade || 0
        const maxScore = grade.maxScore || grade.evaluationInfo?.maxScore || 20
        return `${score}/${maxScore}`
      })
    
    return gradeStrings.join(', ') || 'Aucune note'
  }

  private getAppreciation(average: number): string {
    if (average >= 16) return 'Excellent'
    if (average >= 14) return 'Très bien'
    if (average >= 12) return 'Bien'
    if (average >= 10) return 'Assez bien'
    return 'Insuffisant'
  }
}

// Export d'une fonction utilitaire
export const generateStudentBulletinPDF = async (data: BulletinData): Promise<void> => {
  const pdfService = new BulletinPdfService()
  await pdfService.generateBulletin(data)
} 