import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface ReportCardData {
  id: string
  student: {
    user: {
      firstName: string
      lastName: string
    }
  }
  period: {
    type: string
    schoolYear: string
    startDate: string
    endDate: string
  }
  average: number | null
  appreciation?: string | null
  status: string
}

/**
 * Génère un PDF pour un bulletin scolaire
 * @param reportCard - Données du bulletin
 * @returns Buffer du PDF généré
 */
export async function generateReportCardPDF(reportCard: ReportCardData): Promise<Buffer> {
  const doc = new jsPDF()
  
  // En-tête du document
  doc.setFontSize(20)
  doc.text('Bulletin Scolaire', 105, 30, { align: 'center' })
  
  // Informations de l'élève
  doc.setFontSize(14)
  doc.text(`Élève: ${reportCard.student.user.firstName} ${reportCard.student.user.lastName}`, 20, 50)
  
  // Informations de la période
  doc.setFontSize(12)
  doc.text(`Période: ${reportCard.period.type}`, 20, 70)
  doc.text(`Année scolaire: ${reportCard.period.schoolYear}`, 20, 80)
  doc.text(`Du ${new Date(reportCard.period.startDate).toLocaleDateString('fr-FR')} au ${new Date(reportCard.period.endDate).toLocaleDateString('fr-FR')}`, 20, 90)
  
  // Moyenne générale
  if (reportCard.average !== null) {
    doc.setFontSize(14)
    doc.text(`Moyenne générale: ${reportCard.average}/20`, 20, 110)
  }
  
  // Appréciation
  if (reportCard.appreciation) {
    doc.setFontSize(12)
    doc.text('Appréciation générale:', 20, 130)
    
    // Diviser le texte long en plusieurs lignes
    const splitText = doc.splitTextToSize(reportCard.appreciation, 170)
    doc.text(splitText, 20, 140)
  }
  
  // Statut
  doc.setFontSize(10)
  doc.text(`Statut: ${reportCard.status}`, 20, 200)
  
  // Date de génération
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 280)
  
  // Convertir en Buffer
  const pdfArrayBuffer = doc.output('arraybuffer')
  return Buffer.from(pdfArrayBuffer)
}

/**
 * Génère un PDF pour plusieurs bulletins (classe entière)
 * @param reportCards - Liste des bulletins
 * @returns Buffer du PDF généré
 */
export async function generateClassReportCardsPDF(reportCards: ReportCardData[]): Promise<Buffer> {
  const doc = new jsPDF()
  
  reportCards.forEach((reportCard, index) => {
    if (index > 0) {
      doc.addPage()
    }
    
    // Utiliser la même logique que pour un bulletin individuel
    // En-tête du document
    doc.setFontSize(20)
    doc.text('Bulletin Scolaire', 105, 30, { align: 'center' })
    
    // Informations de l'élève
    doc.setFontSize(14)
    doc.text(`Élève: ${reportCard.student.user.firstName} ${reportCard.student.user.lastName}`, 20, 50)
    
    // Informations de la période
    doc.setFontSize(12)
    doc.text(`Période: ${reportCard.period.type}`, 20, 70)
    doc.text(`Année scolaire: ${reportCard.period.schoolYear}`, 20, 80)
    doc.text(`Du ${new Date(reportCard.period.startDate).toLocaleDateString('fr-FR')} au ${new Date(reportCard.period.endDate).toLocaleDateString('fr-FR')}`, 20, 90)
    
    // Moyenne générale
    if (reportCard.average !== null) {
      doc.setFontSize(14)
      doc.text(`Moyenne générale: ${reportCard.average}/20`, 20, 110)
    }
    
    // Appréciation
    if (reportCard.appreciation) {
      doc.setFontSize(12)
      doc.text('Appréciation générale:', 20, 130)
      
      const splitText = doc.splitTextToSize(reportCard.appreciation, 170)
      doc.text(splitText, 20, 140)
    }
    
    // Statut
    doc.setFontSize(10)
    doc.text(`Statut: ${reportCard.status}`, 20, 200)
  })
  
  // Date de génération sur la dernière page
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 280)
  
  // Convertir en Buffer
  const pdfArrayBuffer = doc.output('arraybuffer')
  return Buffer.from(pdfArrayBuffer)
} 

