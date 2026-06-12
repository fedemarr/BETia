import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bet AI Analyst',
  description: 'Análisis estadístico deportivo con inteligencia artificial',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
