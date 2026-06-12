'use client'

import clsx from 'clsx'
import ValueBetCard from './ValueBetCard'
import type { AnalysisResponse, ValueBet } from '@/lib/types'

interface Props {
  streamText: string
  analysis: AnalysisResponse | null
  isLoading: boolean
}

function ConfidenceBar({ value }: { value: number }) {
  const v = Number(value) || 50
  const color = v >= 70 ? 'bg-green-500' : v >= 45 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>Confianza del modelo</span>
        <span className="font-semibold text-slate-200">{v}/100</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full transition-all', color)} style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}

function RiskBadge({ risk }: { risk?: string }) {
  const r = risk ?? 'MEDIO'
  const styles: Record<string, string> = {
    BAJO:  'bg-green-500/20 text-green-400 border-green-500/30',
    MEDIO: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    ALTO:  'bg-red-500/20 text-red-400 border-red-500/30',
  }
  return (
    <span className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full border', styles[r] ?? styles.MEDIO)}>
      Riesgo {r}
    </span>
  )
}

function BestBetBanner({ bets }: { bets: ValueBet[] }) {
  if (!bets.length) return null
  const sorted = [...bets].sort((a, b) => (b.edge ?? 0) - (a.edge ?? 0))
  const top = sorted[0]
  if (!top) return null

  const isStrong = (top.edge ?? 0) > 0.10
  const edgePct  = ((top.edge ?? 0) * 100).toFixed(1)
  const prob     = ((top.ourProbability ?? 0) * 100).toFixed(0)
  const odds     = typeof top.marketOdds === 'number' ? top.marketOdds.toFixed(2) : '—'
  const ev       = ((top.expectedValue ?? 0) * 100).toFixed(1)

  return (
    <div className={clsx(
      'rounded-2xl border-2 p-5 space-y-3',
      isStrong ? 'border-amber-400 bg-amber-500/10' : 'border-green-400 bg-green-500/10'
    )}>
      <div className="flex items-center gap-2">
        <span className="text-xl">🎯</span>
        <p className={clsx('font-bold text-base', isStrong ? 'text-amber-300' : 'text-green-300')}>
          {isStrong ? 'MEJOR APUESTA — STRONG VALUE' : 'MEJOR APUESTA'}
        </p>
      </div>

      <div className="bg-slate-900/60 rounded-xl p-4 space-y-2">
        <p className="text-slate-100 font-semibold text-lg">{top.market ?? '—'}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div><span className="text-slate-400">Cuota </span><span className="font-bold text-white">{odds}</span></div>
          <div><span className="text-slate-400">Prob. estadística </span><span className="font-bold text-green-400">{prob}%</span></div>
          <div><span className="text-slate-400">Edge </span><span className={clsx('font-bold', isStrong ? 'text-amber-400' : 'text-green-400')}>+{edgePct}%</span></div>
          <div><span className="text-slate-400">EV </span><span className="font-bold text-green-400">+{ev}%</span></div>
        </div>
      </div>

      {sorted.length > 1 && (
        <div className="pt-1">
          <p className="text-xs text-slate-400 mb-2">Otras opciones con valor:</p>
          <div className="flex flex-col gap-1">
            {sorted.slice(1, 3).map((b, i) => (
              <div key={i} className="flex justify-between text-sm px-1">
                <span className="text-slate-300 truncate mr-2">{b.market ?? '—'}</span>
                <span className="text-green-400 shrink-0 font-medium">
                  {typeof b.marketOdds === 'number' ? b.marketOdds.toFixed(2) : '—'} · +{((b.edge ?? 0) * 100).toFixed(1)}% edge
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function stripJsonBlock(raw: string): string {
  // Remove ```json ... ``` blocks so only the narrative shows
  return raw
    .replace(/```json[\s\S]*?```/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim()
}

export default function AnalysisResult({ streamText, analysis, isLoading }: Props) {
  const raw          = streamText ?? ''
  const text         = isLoading ? raw : stripJsonBlock(raw)
  const hasContent   = raw.length > 0
  const hasAnalysis  = analysis != null

  const valueBets: ValueBet[] = Array.isArray(analysis?.valueBets)  ? analysis!.valueBets  : []
  const riskFactors: string[] = Array.isArray(analysis?.riskFactors) ? analysis!.riskFactors : []

  if (!hasContent && !isLoading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/30 flex flex-col items-center justify-center min-h-[500px] text-center p-8">
        <div className="text-4xl mb-4">🤖</div>
        <p className="text-slate-300 font-medium">El análisis aparecerá aquí</p>
        <p className="text-slate-500 text-sm mt-2">Completá el formulario y hacé click en Analizar</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* 🎯 Mejor apuesta — siempre arriba */}
      {hasAnalysis && valueBets.length > 0 && <BestBetBanner bets={valueBets} />}

      {/* Header */}
      {hasAnalysis && (
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg text-slate-100">
                {analysis?.match?.home ?? '?'} vs {analysis?.match?.away ?? '?'}
              </h2>
              <p className="text-slate-400 text-sm">
                {analysis?.match?.league ?? ''}{analysis?.match?.date ? ` · ${analysis.match.date}` : ''}
              </p>
            </div>
            <RiskBadge risk={analysis?.match?.risk} />
          </div>
          <ConfidenceBar value={analysis?.match?.confidence ?? 50} />
        </div>
      )}

      {/* Todas las Value Bets */}
      {hasAnalysis && valueBets.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">
            Todas las value bets ({valueBets.length})
          </h3>
          <div className="space-y-3">
            {[...valueBets]
              .sort((a, b) => (b.edge ?? 0) - (a.edge ?? 0))
              .map((bet, i) => <ValueBetCard key={i} bet={bet} />)}
          </div>
        </div>
      )}

      {/* Factores de riesgo */}
      {hasAnalysis && riskFactors.length > 0 && (
        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Factores de riesgo</h3>
          <ul className="space-y-1.5">
            {riskFactors.map((f, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-amber-400 shrink-0">⚠</span>
                {typeof f === 'string' ? f : JSON.stringify(f)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Narrativa / stream en vivo */}
      <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          {isLoading && <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-fast" />}
          {isLoading ? 'Buscando datos y analizando...' : 'Análisis completo'}
        </h3>
        <div className={clsx(
          'text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono max-h-[400px] overflow-y-auto',
          isLoading && text.length > 0 && 'cursor-blink'
        )}>
          {text || (isLoading ? <span className="text-slate-500">Conectando con Claude...</span> : null)}
        </div>
      </div>
    </div>
  )
}
