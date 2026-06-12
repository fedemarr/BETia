'use client'

import { useState } from 'react'
import SportTabs from '@/components/SportTabs'
import AnalysisForm from '@/components/AnalysisForm'
import AnalysisResult from '@/components/AnalysisResult'
import { parseAnalysisResponse } from '@/lib/types'
import type { Sport, AnalysisInput, AnalysisResponse } from '@/lib/types'

export default function Home() {
  const [sport, setSport] = useState<Sport>('football')
  const [isLoading, setIsLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSportChange(s: Sport) {
    setSport(s)
    setStreamText('')
    setAnalysis(null)
    setError(null)
  }

  async function handleAnalyze(input: AnalysisInput) {
    setIsLoading(true)
    setStreamText('')
    setAnalysis(null)
    setError(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(errData.error ?? `HTTP ${res.status}`)
      }

      if (!res.body) throw new Error('Sin respuesta del servidor.')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setStreamText(fullText)
      }

      if (!fullText) {
        throw new Error('No se recibió respuesta. Verificá que ANTHROPIC_API_KEY esté configurada en Vercel.')
      }

      const parsed = parseAnalysisResponse(fullText)
      if (parsed) {
        setAnalysis(parsed)
      } else {
        throw new Error('No se pudo interpretar la respuesta. Intentá de nuevo.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con Claude')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎰</span>
            <div>
              <h1 className="font-bold text-slate-100 leading-none">Bet AI Analyst</h1>
              <p className="text-xs text-slate-500">IA busca los datos · vos apostás</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Claude AI
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <SportTabs sport={sport} onSelect={handleSportChange} />

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300 flex gap-3 items-start">
            <span className="text-lg shrink-0">⚠️</span>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-red-400/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AnalysisForm sport={sport} onAnalyze={handleAnalyze} isLoading={isLoading} />
          <AnalysisResult analysis={analysis} isLoading={isLoading} streamText={streamText} />
        </div>

        <footer className="text-center text-xs text-slate-700 pb-4">
          Análisis estadístico — no garantiza resultados. Apostar con responsabilidad.
        </footer>
      </div>
    </main>
  )
}
