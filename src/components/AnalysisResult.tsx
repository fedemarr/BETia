'use client'

import clsx from 'clsx'
import ValueBetCard from './ValueBetCard'
import type { AnalysisResponse } from '@/lib/types'

interface Props {
  streamText: string
  analysis: AnalysisResponse | null
  isLoading: boolean
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 70 ? 'bg-green-500' : value >= 45 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>Confianza del modelo</span>
        <span className="font-semibold text-slate-200">{value}/100</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all', color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function RiskBadge({ risk }: { risk: string }) {
  const styles = {
    BAJO:  'bg-green-500/20 text-green-400 border-green-500/30',
    MEDIO: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    ALTO:  'bg-red-500/20 text-red-400 border-red-500/30',
  }[risk] ?? 'bg-slate-700 text-slate-300 border-slate-600'

  return (
    <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full border', styles)}>
      Riesgo {risk}
    </span>
  )
}

export default function AnalysisResult({ streamText, analysis, isLoading }: Props) {
  const hasContent = streamText.length > 0
  const hasAnalysis = analysis !== null

  if (!hasContent && !isLoading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/30 flex flex-col items-center justify-center min-h-[500px] text-center p-8">
        <div className="text-4xl mb-4">🤖</div>
        <p className="text-slate-300 font-medium">El análisis aparecerá aquí</p>
        <p className="text-slate-500 text-sm mt-2">
          Completá el formulario y hacé click en Analizar
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header del análisis */}
      {hasAnalysis && (
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg text-slate-100">
                {analysis.match.home} vs {analysis.match.away}
              </h2>
              <p className="text-slate-400 text-sm">{analysis.match.league} · {analysis.match.date}</p>
            </div>
            <RiskBadge risk={analysis.match.risk} />
          </div>
          <ConfidenceBar value={analysis.match.confidence} />
        </div>
      )}

      {/* Value Bets */}
      {hasAnalysis && analysis.valueBets.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">
            Value Bets detectadas ({analysis.valueBets.length})
          </h3>
          <div className="space-y-3">
            {analysis.valueBets
              .sort((a, b) => b.edge - a.edge)
              .map((bet, i) => (
                <ValueBetCard key={i} bet={bet} />
              ))}
          </div>
        </div>
      )}

      {/* Factores de riesgo */}
      {hasAnalysis && analysis.riskFactors.length > 0 && (
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Factores de riesgo
          </h3>
          <ul className="space-y-1.5">
            {analysis.riskFactors.map((f, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-amber-400 shrink-0">⚠</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Narrativa / stream en vivo */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          {isLoading && (
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-fast" />
          )}
          {isLoading ? 'Analizando...' : 'Análisis completo'}
        </h3>
        <div
          className={clsx(
            'text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono max-h-[400px] overflow-y-auto',
            isLoading && streamText.length > 0 && 'cursor-blink'
          )}
        >
          {streamText || (
            isLoading ? (
              <span className="text-slate-500">Conectando con Claude...</span>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
