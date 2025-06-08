import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './theme-provider'
import { NextAuthProvider } from './components/providers/NextAuthProvider'
import Layout from './components/Layout'
import { Toaster } from './components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'

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
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          <NextAuthProvider>
            <Layout>
              {children}
            </Layout>
          </NextAuthProvider>
          <Toaster />
          <SonnerToaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
} 


