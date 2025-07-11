import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { DossierScolaire, Paiement } from './scolariteService'

// Étendre jsPDF pour inclure autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export interface ReceiptData {
  dossier: DossierScolaire
  paiement: Paiement & { dateEnregistrement?: string }
  numeroRecu: string
  etablissement: {
    nom: string
    adresse: string
    telephone?: string
    email?: string
  }
}

class PDFReceiptService {
  
  /**
   * Génère et télécharge un reçu PDF pour un paiement
   */
  async generateReceipt(data: ReceiptData): Promise<void> {
    const pdf = new jsPDF()
    
    // Configuration des couleurs
    const primaryColor = [147, 51, 234] // Purple-600
    const secondaryColor = [99, 102, 241] // Indigo-500
    const textColor = [31, 41, 55] // Gray-800
    const lightGray = [243, 244, 246] // Gray-100
    
    let yPosition = 20
    
    // === EN-TÊTE OPTIMISÉ ===
    yPosition = this.addHeader(pdf, data.etablissement, yPosition)
    yPosition += 15 // Réduction de l'espacement
    
    // === TITRE DU REÇU ===
    pdf.setFontSize(20) // Réduction de la taille
    pdf.setTextColor(...primaryColor)
    pdf.setFont('helvetica', 'bold')
    pdf.text('REÇU DE PAIEMENT', 105, yPosition, { align: 'center' })
    yPosition += 15 // Réduction de l'espacement
    
    // === NUMÉRO DE REÇU ET DATE ===
    pdf.setFontSize(10) // Réduction de la taille
    pdf.setTextColor(...textColor)
    pdf.setFont('helvetica', 'normal')
    
    const today = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    pdf.text(`Reçu N° : ${data.numeroRecu}`, 20, yPosition)
    pdf.text(`Date : ${today}`, 150, yPosition)
    yPosition += 18 // Réduction de l'espacement
    
    // === INFORMATIONS DE L'ÉLÈVE ===
    yPosition = this.addStudentInfo(pdf, data.dossier, yPosition)
    yPosition += 15 // Réduction de l'espacement
    
    // === DÉTAILS DU PAIEMENT ===
    yPosition = this.addPaymentDetails(pdf, data.paiement, yPosition)
    yPosition += 12 // Réduction de l'espacement
    
    // === RÉCAPITULATIF FINANCIER ===
    yPosition = this.addFinancialSummary(pdf, data.dossier, data.paiement, yPosition)
    yPosition += 12 // Réduction de l'espacement
    
    // === SIGNATURE ET CACHET ===
    this.addSignatureSection(pdf, yPosition)
    
    // === PIED DE PAGE ===
    this.addFooter(pdf, data.etablissement)
    
    // Télécharger le PDF
    const fileName = `Recu_${data.numeroRecu}_${data.dossier.nomEleve.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
    
    console.log('✅ Reçu PDF généré et téléchargé:', fileName)
  }
  
  /**
   * Ajoute l'en-tête avec le nom de l'établissement et téléphone
   */
  private addHeader(pdf: jsPDF, etablissement: ReceiptData['etablissement'], yPos: number): number {
    // Rectangle d'en-tête plus compact
    pdf.setFillColor(147, 51, 234) // Purple-600
    pdf.rect(0, 0, 210, 28, 'F')
    
    // Nom de l'établissement (plus grand et centré)
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(etablissement.nom, 105, 12, { align: 'center' })
    
    // Ligne avec adresse et téléphone
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    
    // Adresse à gauche
    pdf.text(etablissement.adresse, 20, 20)
    
    // Téléphone à droite
    if (etablissement.telephone) {
      pdf.text(`Tél: ${etablissement.telephone}`, 190, 20, { align: 'right' })
    }
    
    // Email au centre (si disponible)
    if (etablissement.email) {
      pdf.text(etablissement.email, 105, 24, { align: 'center' })
    }
    
    return 28
  }
  
  /**
   * Ajoute les informations de l'élève dans un cadre compact
   */
  private addStudentInfo(pdf: jsPDF, dossier: DossierScolaire, yPos: number): number {
    const startY = yPos
    const boxHeight = 28 // Réduction de la hauteur
    
    // Cadre de fond
    pdf.setFillColor(248, 250, 252) // Blue-50
    pdf.setDrawColor(203, 213, 225) // Slate-300
    pdf.rect(20, startY, 170, boxHeight, 'FD')
    
    // Titre de la section
    pdf.setFontSize(12) // Réduction de la taille
    pdf.setTextColor(30, 58, 138) // Blue-800
    pdf.setFont('helvetica', 'bold')
    pdf.text('INFORMATIONS DE L\'ÉLÈVE', 25, startY + 8)
    
    // Détails de l'élève sur 2 lignes
    pdf.setFontSize(9) // Réduction de la taille
    pdf.setTextColor(31, 41, 55) // Gray-800
    pdf.setFont('helvetica', 'normal')
    
    // Ligne 1
    pdf.text(`Nom: ${dossier.nomEleve}`, 25, startY + 16)
    pdf.text(`Classe: ${dossier.classe}`, 115, startY + 16)
    
    // Ligne 2
    pdf.text(`Matricule: ${dossier.numeroMatricule}`, 25, startY + 23)
    pdf.text(`Année: ${dossier.anneeScolaire}`, 115, startY + 23)
    
    return startY + boxHeight
  }
  
  /**
   * Ajoute les détails du paiement dans un tableau compact
   */
  private addPaymentDetails(pdf: jsPDF, paiement: Paiement & { dateEnregistrement?: string }, yPos: number): number {
    // Titre de la section
    pdf.setFontSize(12)
    pdf.setTextColor(30, 58, 138) // Blue-800
    pdf.setFont('helvetica', 'bold')
    pdf.text('DÉTAILS DU PAIEMENT', 20, yPos)
    
    // Tableau compact
    const tableData = [
      ['Montant payé', this.formatCurrency(paiement.montant)],
      ['Date du paiement', this.formatDate(paiement.datePaiement)],
      ['Méthode de paiement', paiement.methodePaiement],
      ['Numéro de transaction', paiement.numeroTransaction || 'N/A']
    ]
    
    let currentY = yPos + 8
    const rowHeight = 10 // Réduction de la hauteur des lignes
    
    tableData.forEach((row, index) => {
      const rowY = currentY + (index * rowHeight)
      
      // Fond alterné
      if (index % 2 === 0) {
        pdf.setFillColor(249, 250, 251) // Gray-50
        pdf.rect(20, rowY - 2, 170, rowHeight, 'F')
      }
      
      // Bordures
      pdf.setDrawColor(203, 213, 225)
      pdf.rect(20, rowY - 2, 170, rowHeight)
      pdf.rect(20, rowY - 2, 60, rowHeight)
      
      // Texte
      pdf.setFontSize(9)
      pdf.setTextColor(31, 41, 55)
      pdf.setFont('helvetica', 'bold')
      pdf.text(row[0], 22, rowY + 4)
      
      pdf.setFont('helvetica', 'normal')
      pdf.text(row[1], 82, rowY + 4)
    })
    
    return currentY + (tableData.length * rowHeight) + 8
  }
  
  /**
   * Ajoute le récapitulatif financier compact
   */
  private addFinancialSummary(pdf: jsPDF, dossier: DossierScolaire, paiement: Paiement, yPos: number): number {
    // Titre de la section
    pdf.setFontSize(12)
    pdf.setTextColor(30, 58, 138) // Blue-800
    pdf.setFont('helvetica', 'bold')
    pdf.text('RÉCAPITULATIF FINANCIER', 20, yPos)
    
    const tableData = [
      ['Frais totaux', this.formatCurrency(dossier.fraisTotaux)],
      ['Payé avant ce paiement', this.formatCurrency(dossier.fraisPayes - paiement.montant)],
      ['Montant de ce paiement', this.formatCurrency(paiement.montant)],
      ['Total maintenant payé', this.formatCurrency(dossier.fraisPayes)],
      ['Solde restant', this.formatCurrency(dossier.fraisRestants)]
    ]
    
    let currentY = yPos + 8
    const rowHeight = 10
    
    tableData.forEach((row, index) => {
      const rowY = currentY + (index * rowHeight)
      
      // Fond spécial pour le solde restant
      if (index === 4) {
        const fillColor = dossier.fraisRestants > 0 ? [254, 202, 202] : [187, 247, 208] // Red-200 : Green-200
        pdf.setFillColor(...fillColor)
        pdf.rect(20, rowY - 2, 170, rowHeight, 'F')
      } else if (index % 2 === 0) {
        pdf.setFillColor(254, 249, 195) // Yellow-100
        pdf.rect(20, rowY - 2, 170, rowHeight, 'F')
      }
      
      // Bordures
      pdf.setDrawColor(203, 213, 225)
      pdf.rect(20, rowY - 2, 170, rowHeight)
      pdf.rect(20, rowY - 2, 60, rowHeight)
      
      // Texte
      pdf.setFontSize(9)
      if (index === 4) {
        const textColor = dossier.fraisRestants > 0 ? [153, 27, 27] : [21, 128, 61] // Red-800 : Green-800
        pdf.setTextColor(...textColor)
      } else {
        pdf.setTextColor(31, 41, 55)
      }
      
      pdf.setFont('helvetica', 'bold')
      pdf.text(row[0], 22, rowY + 4)
      pdf.text(row[1], 82, rowY + 4)
    })
    
    return currentY + (tableData.length * rowHeight) + 8
  }
  
  /**
   * Ajoute la section signature et cachet compacte
   */
  private addSignatureSection(pdf: jsPDF, yPos: number): void {
    // Cadre pour signature plus petit
    pdf.setDrawColor(203, 213, 225) // Slate-300
    pdf.rect(130, yPos, 50, 25)
    
    pdf.setFontSize(8)
    pdf.setTextColor(75, 85, 99) // Gray-600
    pdf.setFont('helvetica', 'normal')
    pdf.text('Signature et cachet', 132, yPos + 8)
    pdf.text('de l\'établissement', 132, yPos + 15)
    
    // Note de validité
    pdf.setFontSize(7)
    pdf.setTextColor(107, 114, 128) // Gray-500
    pdf.text('Ce reçu fait foi de paiement', 20, yPos + 15)
    pdf.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 20, yPos + 22)
  }
  
  /**
   * Ajoute le pied de page
   */
  private addFooter(pdf: jsPDF, etablissement: ReceiptData['etablissement']): void {
    const pageHeight = pdf.internal.pageSize.height
    const footerY = pageHeight - 15
    
    // Ligne de séparation
    pdf.setDrawColor(203, 213, 225) // Slate-300
    pdf.line(20, footerY - 5, 190, footerY - 5)
    
    // Texte du pied de page
    pdf.setFontSize(8)
    pdf.setTextColor(107, 114, 128) // Gray-500
    pdf.setFont('helvetica', 'normal')
    pdf.text('Merci pour votre confiance', 105, footerY, { align: 'center' })
  }
  
  /**
   * Génère un numéro de reçu unique
   */
  generateReceiptNumber(): string {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const timestamp = Date.now().toString().slice(-4)
    
    return `REC${year}${month}${day}${timestamp}`
  }
  
  /**
   * Formate une devise
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount)
  }
  
  /**
   * Formate une date
   */
  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

export const pdfReceiptService = new PDFReceiptService()
export default pdfReceiptService 