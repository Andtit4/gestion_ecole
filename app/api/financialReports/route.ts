import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/financialReports - Générer des rapports financiers
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un administrateur
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Récupérer les paramètres pour le rapport
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'summary'
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(new Date().getFullYear(), 0, 1)
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date()
    const classId = searchParams.get('classId')
    const level = searchParams.get('level')

    // Filtres de base pour la période
    const dateFilter = {
      gte: startDate,
      lte: endDate,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any = {}

    // Rapport sommaire général
    if (reportType === 'summary') {
      // Statistiques générales
      const totalInvoiced = await prisma.invoice.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          issuedDate: dateFilter,
        },
      })

      const totalPaid = await prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          paymentDate: dateFilter,
          status: 'PAID',
        },
      })

      const pendingInvoices = await prisma.invoice.count({
        where: {
          issuedDate: dateFilter,
          status: 'PENDING',
        },
      })

      const partialInvoices = await prisma.invoice.count({
        where: {
          issuedDate: dateFilter,
          status: 'PARTIAL',
        },
      })

      const paidInvoices = await prisma.invoice.count({
        where: {
          issuedDate: dateFilter,
          status: 'PAID',
        },
      })

      response = {
        period: {
          startDate,
          endDate,
        },
        financialSummary: {
          totalInvoiced: totalInvoiced._sum.totalAmount || 0,
          totalPaid: totalPaid._sum.amount || 0,
          pendingAmount: (totalInvoiced._sum.totalAmount || 0) - (totalPaid._sum.amount || 0),
          invoiceStats: {
            pending: pendingInvoices,
            partial: partialInvoices,
            paid: paidInvoices,
            total: pendingInvoices + partialInvoices + paidInvoices,
          },
        },
      }
    }
    // Rapport détaillé par classe
    else if (reportType === 'byClass') {
      let classFilter = {}
      
      if (classId) {
        classFilter = { id: classId }
      } else if (level) {
        classFilter = { level }
      }

      const classes = await prisma.renamedclass.findMany({
        where: classFilter,
        select: {
          id: true,
          name: true,
          level: true,
          students: {
            select: {
              id: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              invoices: {
                where: {
                  issuedDate: dateFilter,
                },
                select: {
                  id: true,
                  totalAmount: true,
                  paidAmount: true,
                  status: true,
                },
              },
            },
          },
        },
      })

      // Calculer les statistiques par classe
      const classSummaries = classes.map(cls => {
        const totalStudents = cls.students.length
        const totalInvoiced = cls.students.reduce(
          (sum, student) => sum + student.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
          0
        )
        const totalPaid = cls.students.reduce(
          (sum, student) => sum + student.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
          0
        )
        const pendingAmount = totalInvoiced - totalPaid
        const paymentRate = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0

        return {
          classId: cls.id,
          className: cls.name,
          level: cls.level,
          totalStudents,
          financialSummary: {
            totalInvoiced,
            totalPaid,
            pendingAmount,
            paymentRate: Math.round(paymentRate * 100) / 100, // Arrondir à 2 décimales
          },
        }
      })

      response = {
        period: {
          startDate,
          endDate,
        },
        classSummaries,
      }
    }
    // Rapport des paiements par méthode
    else if (reportType === 'byPaymentMethod') {
      const paymentsByMethod = await prisma.payment.groupBy({
        by: ['method'],
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
        where: {
          paymentDate: dateFilter,
          status: 'PAID',
        },
      })

      const methodStats = paymentsByMethod.map(method => ({
        method: method.method,
        totalAmount: method._sum.amount || 0,
        count: method._count.id,
      }))

      response = {
        period: {
          startDate,
          endDate,
        },
        paymentMethods: methodStats,
      }
    }
    // Rapport des étudiants avec des paiements en retard
    else if (reportType === 'latePayments') {
      const studentsWithLatePayments = await prisma.student.findMany({
        where: {
          invoices: {
            some: {
              dueDate: { lt: new Date() },
              status: { in: ['PENDING', 'PARTIAL'] },
            },
          },
        },
        select: {
          id: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
          invoices: {
            where: {
              dueDate: { lt: new Date() },
              status: { in: ['PENDING', 'PARTIAL'] },
            },
            select: {
              id: true,
              invoiceNumber: true,
              totalAmount: true,
              paidAmount: true,
              dueDate: true,
              status: true,
            },
          },
        },
      })

      response = {
        generatedAt: new Date(),
        latePayments: studentsWithLatePayments.map(student => ({
          studentId: student.id,
          studentName: `${student.user.firstName} ${student.user.lastName}`,
          email: student.user.email,
          class: student.class ? student.class.name : 'Non assigné',
          invoices: student.invoices.map(inv => ({
            invoiceId: inv.id,
            invoiceNumber: inv.invoiceNumber,
            totalAmount: inv.totalAmount,
            paidAmount: inv.paidAmount,
            remainingAmount: inv.totalAmount - inv.paidAmount,
            dueDate: inv.dueDate,
            status: inv.status,
            daysLate: Math.floor((new Date().getTime() - inv.dueDate.getTime()) / (1000 * 60 * 60 * 24)),
          })),
        })),
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erreur lors de la génération du rapport financier:', error)
    return NextResponse.json(
      { message: 'Erreur serveur', error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue' },
      { status: 500 }
    )
  }
} 


