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

      if (!res.body) throw new Error('Sin respuesta del servidor')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStreamText(fullText)
      }

      const parsed = parseAnalysisResponse(fullText)
      if (parsed) setAnalysis(parsed)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con Claude'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎰</span>
            <div>
              <h1 className="font-bold text-slate-100 leading-none">Bet AI Analyst</h1>
              <p className="text-xs text-slate-500">Análisis estadístico deportivo</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Claude Sonnet 4.6
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <SportTabs sport={sport} onSelect={handleSportChange} />

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalysisForm sport={sport} onAnalyze={handleAnalyze} isLoading={isLoading} />
          <AnalysisResult streamText={streamText} analysis={analysis} isLoading={isLoading} />
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-600 py-4">
          Las probabilidades son estimaciones estadísticas, no garantías de resultado.
          Apostar con responsabilidad.
        </footer>
      </div>
    </main>
  )
}
