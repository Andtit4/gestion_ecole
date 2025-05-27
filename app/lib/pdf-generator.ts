import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Déclaration pour étendre jsPDF avec autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Types pour les données du bulletin
interface ReportCardData {
  id: string;
  student: {
    user: {
      firstName: string;
      lastName: string;
    };
    class?: {
      name: string;
    } | null;
  };
  period: {
    type: string;
    schoolYear: string;
    startDate: string;
    endDate: string;
  };
  average: number;
  appreciation?: string | null;
  status: string;
  generatedAt: string;
}

/**
 * Génère un PDF pour un bulletin de notes avec une mise en page améliorée
 * @param reportCard Les données du bulletin
 * @returns Blob du PDF généré
 */
export const generateReportCardPDF = async (reportCard: ReportCardData): Promise<Blob> => {
  try {
    // Vérification des données requises
    if (!reportCard) throw new Error('Données du bulletin manquantes');
    if (!reportCard.student?.user) throw new Error('Données de l\'élève manquantes');
    if (!reportCard.period) throw new Error('Données de la période manquantes');
    
    // Créer un nouveau document PDF (orientation portrait, unités mm, format A4)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Définir les couleurs
    const primaryColor = [41, 98, 255]; // RGB - Bleu principal
    const secondaryColor = [80, 80, 80]; // RGB - Gris foncé
    const lightGray = [240, 240, 240]; // RGB - Gris clair pour alternance
    
    // Ajouter un en-tête stylisé
    // Fond bleu en haut de page
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Titre du document
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255); // Blanc
    doc.text('BULLETIN DE NOTES', 105, 20, { align: 'center' });
    
    // Sous-titre - Information de période
    const periodLabel = reportCard.period.type === 'TRIMESTER' 
      ? 'Trimestre' 
      : reportCard.period.type === 'SEMESTER' 
        ? 'Semestre' 
        : 'Année';
    
    doc.setFontSize(14);
    doc.text(`${periodLabel} - ${reportCard.period.schoolYear}`, 105, 30, { align: 'center' });
    
    // Informations sur l'élève
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Noir
    
    // Boîte d'information de l'élève
    doc.setFillColor(245, 245, 245); // Fond gris très clair
    doc.roundedRect(15, 50, 180, 35, 3, 3, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Informations de l\'élève', 105, 60, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    
    // Affichage des informations de l'élève
    doc.text(`Nom: ${reportCard.student.user.lastName} ${reportCard.student.user.firstName}`, 25, 70);
    doc.text(`Classe: ${reportCard.student.class?.name || 'Non assigné'}`, 25, 78);
    
    // Dates formatées
    let periodDates = '';
    try {
      const startDate = format(new Date(reportCard.period.startDate), 'dd MMMM yyyy', { locale: fr });
      const endDate = format(new Date(reportCard.period.endDate), 'dd MMMM yyyy', { locale: fr });
      periodDates = `Période du ${startDate} au ${endDate}`;
    } catch (error) {
      console.error('Erreur lors du formatage des dates:', error);
      periodDates = `Période scolaire ${reportCard.period.schoolYear}`;
    }
    doc.text(periodDates, 105, 45, { align: 'center' });
    
    // Section résultats
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(15, 95, 180, 10, 1, 1, 'F');
    doc.text('RÉSULTATS', 105, 102, { align: 'center' });
    
    // Affichage de la moyenne avec couleur selon valeur
    doc.setFontSize(16);
    const avgColor = reportCard.average >= 16 ? [46, 125, 50] : // Vert
                    reportCard.average >= 12 ? [33, 150, 243] : // Bleu
                    reportCard.average >= 10 ? [255, 152, 0] : // Orange
                    [244, 67, 54]; // Rouge
    
    doc.setTextColor(avgColor[0], avgColor[1], avgColor[2]);
    doc.text(`Moyenne générale: ${reportCard.average.toFixed(2)}/20`, 105, 115, { align: 'center' });
    
    // Table des informations supplémentaires
    const studentInfos = [
      ['Statut du bulletin', reportCard.status === 'DRAFT' ? 'Brouillon' : 'Publié'],
    ];
    
    // Ajouter la date de génération si disponible
    if (reportCard.generatedAt) {
      try {
        const generatedDate = format(new Date(reportCard.generatedAt), 'dd MMMM yyyy', { locale: fr });
        studentInfos.push(['Généré le', generatedDate]);
      } catch (error) {
        console.error('Erreur lors du formatage de la date de génération:', error);
        studentInfos.push(['Généré le', 'Date non disponible']);
      }
    }
    
    doc.autoTable({
      startY: 125,
      head: [['Information', 'Détail']],
      body: studentInfos,
      theme: 'grid',
      headStyles: {
        fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
      },
      alternateRowStyles: {
        fillColor: lightGray
      },
      margin: { left: 15, right: 15 }
    });
    
    // Appréciation
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Appréciation générale', 105, doc.autoTable.previous.finalY + 15, { align: 'center' });
    
    const appreciation = reportCard.appreciation || 'Aucune appréciation fournie.';
    
    // Cadre pour l'appréciation
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, doc.autoTable.previous.finalY + 20, 180, 40, 2, 2, 'FD');
    
    // Texte d'appréciation
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    
    // Gestion du texte long avec retour à la ligne automatique
    const textLines = doc.splitTextToSize(appreciation, 170);
    doc.text(textLines, 20, doc.autoTable.previous.finalY + 28);
    
    // Pied de page
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      try {
        const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: fr });
        doc.text(
          `EcoleGestion - Bulletin généré le ${currentDate}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      } catch (error) {
        console.error('Erreur lors du formatage de la date de pied de page:', error);
        doc.text(
          `EcoleGestion - Bulletin scolaire`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
    }
    
    // Retourner le PDF comme un Blob
    return doc.output('blob');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error(`Erreur lors de la génération du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}; 