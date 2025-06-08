import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import puppeteer from 'puppeteer'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID du bulletin est requis' },
        { status: 400 }
      )
    }

    // Récupérer le bulletin complet avec toutes les données nécessaires
    const reportCard = await prisma.reportcard.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: true,
            class: true
          }
        },
        period: true
      }
    })

    if (!reportCard) {
      return NextResponse.json(
        { error: 'Bulletin non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier les permissions d'accès
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      // Pour les étudiants, vérifier que c'est leur propre bulletin
      if (session.user.role === 'STUDENT') {
        const student = await prisma.student.findFirst({
          where: { userId: session.user.id }
        })
        
        if (!student || student.id !== reportCard.studentId) {
          return NextResponse.json(
            { error: 'Vous n\'avez pas les permissions nécessaires' },
            { status: 403 }
          )
        }
      }
      
      // Pour les parents, vérifier que c'est le bulletin de leur enfant
      else if (session.user.role === 'PARENT') {
        const parent = await prisma.parent.findFirst({
          where: { userId: session.user.id },
          include: { children: true }
        })
        
        if (!parent || !parent.children.some(child => child.id === reportCard.studentId)) {
          return NextResponse.json(
            { error: 'Vous n\'avez pas les permissions nécessaires' },
            { status: 403 }
          )
        }
      }
    }

    // Récupérer les notes pour ce bulletin
    const grades = await prisma.grade.findMany({
      where: {
        studentId: reportCard.studentId,
        date: {
          gte: reportCard.period.startDate,
          lte: reportCard.period.endDate
        }
      },
      include: {
        course: true,
        teacher: {
          include: {
            user: true
          }
        }
      },
      orderBy: [
        { course: { name: 'asc' } },
        { date: 'asc' }
      ]
    })

    // Calculer les moyennes par matière
    const courseGrades = grades.reduce((acc, grade) => {
      const courseId = grade.courseId
      
      if (!acc[courseId]) {
        acc[courseId] = {
          courseName: grade.course.name,
          grades: [],
          totalWeightedValue: 0,
          totalWeight: 0
        }
      }
      
      const coef = grade.coefficient || 1
      acc[courseId].grades.push(grade)
      acc[courseId].totalWeightedValue += grade.value * coef
      acc[courseId].totalWeight += coef
      
      return acc
    }, {} as Record<string, { courseName: string, grades: any[], totalWeightedValue: number, totalWeight: number }>)

    // Transformer en un tableau de moyennes par matière
    const courseAverages = Object.values(courseGrades).map(course => ({
      name: course.courseName,
      average: course.totalWeightedValue / course.totalWeight,
      grades: course.grades
    }))

    // Construire le contenu HTML du bulletin pour le PDF
    const studentName = `${reportCard.student.user.firstName} ${reportCard.student.user.lastName}`
    const className = reportCard.student.class?.name || 'Non assignée'
    const periodName = `${reportCard.period.type === 'TRIMESTER' ? 'Trimestre' : 
                        reportCard.period.type === 'SEMESTER' ? 'Semestre' : 'Année'} - ${reportCard.period.schoolYear}`
    
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date)
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Bulletin de ${studentName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            .header h1 {
              margin-bottom: 5px;
              color: #2563eb;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .info-container {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .info-box {
              border: 1px solid #ddd;
              border-radius: 5px;
              padding: 15px;
              width: 45%;
              background-color: #f9f9f9;
            }
            .info-box h3 {
              margin-top: 0;
              color: #2563eb;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .appreciation {
              border: 1px solid #ddd;
              border-radius: 5px;
              padding: 15px;
              margin-bottom: 30px;
              background-color: #f9f9f9;
            }
            .appreciation h3 {
              margin-top: 0;
              color: #2563eb;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #666;
              margin-top: 40px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bulletin de notes</h1>
            <p>${periodName}</p>
            <p>Du ${formatDate(reportCard.period.startDate)} au ${formatDate(reportCard.period.endDate)}</p>
          </div>
          
          <div class="info-container">
            <div class="info-box">
              <h3>Élève</h3>
              <p><strong>Nom :</strong> ${studentName}</p>
              <p><strong>Classe :</strong> ${className}</p>
            </div>
            
            <div class="info-box">
              <h3>Résultats</h3>
              <p><strong>Moyenne générale :</strong> ${reportCard.average.toFixed(2)}/20</p>
              <p><strong>Bulletin généré le :</strong> ${formatDate(reportCard.generatedAt)}</p>
              <p><strong>Statut :</strong> ${reportCard.status === 'DRAFT' ? 'Brouillon' : 'Publié'}</p>
            </div>
          </div>
          
          <h3>Résultats par matière</h3>
          <table>
            <thead>
              <tr>
                <th>Matière</th>
                <th>Moyenne</th>
              </tr>
            </thead>
            <tbody>
              ${courseAverages.map(course => `
                <tr>
                  <td>${course.name}</td>
                  <td>${course.average.toFixed(2)}/20</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          ${reportCard.appreciation ? `
            <div class="appreciation">
              <h3>Appréciation générale</h3>
              <p>${reportCard.appreciation}</p>
            </div>
          ` : ''}
          
          <h3>Détail des notes</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Matière</th>
                <th>Type</th>
                <th>Enseignant</th>
                <th>Coef</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              ${grades.map(grade => `
                <tr>
                  <td>${formatDate(grade.date)}</td>
                  <td>${grade.course.name}</td>
                  <td>${grade.type === 'EXAM' ? 'Examen' : 
                         grade.type === 'QUIZ' ? 'Quiz' : 'Devoir'}</td>
                  <td>${grade.teacher.user.firstName} ${grade.teacher.user.lastName}</td>
                  <td>${grade.coefficient || 1}</td>
                  <td>${grade.value}/20</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>École Gestion - Document généré le ${formatDate(new Date().toISOString())}</p>
          </div>
        </body>
      </html>
    `

    // Générer le PDF avec Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    
    // Générer le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    })
    
    await browser.close()

    // Définir les en-têtes pour un téléchargement de fichier PDF
    const filename = `bulletin_${reportCard.student.user.lastName.toLowerCase()}_${reportCard.student.user.firstName.toLowerCase()}_${reportCard.period.schoolYear}.pdf`
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Erreur lors de l\'exportation du bulletin en PDF:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'exportation du bulletin' },
      { status: 500 }
    )
  }
} 


