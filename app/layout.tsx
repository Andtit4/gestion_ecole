import './globals.css'
import { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import { AuthProvider } from './components/providers/AuthProvider'
import { Navbar } from '@/components/navigation/Navbar'
import { ToastProvider } from './components/providers/ToastProvider'
import { ThemeProvider } from './theme-provider'

const urbanist = Urbanist({ 
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Gestion École',
  description: 'Application de gestion scolaire',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${urbanist.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-urbanist bg-gray-50 text-gray-900">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <ToastProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 