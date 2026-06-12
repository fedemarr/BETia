'use client'

import clsx from 'clsx'
import type { AnalysisResponse } from '@/lib/types'

interface Props {
  analysis: AnalysisResponse | null
  isLoading: boolean
  streamText: string
}

function ConfidenceRing({ value }: { value: number }) {
  const v = Math.min(100, Math.max(0, value))
  const color = v >= 70 ? 'text-green-400' : v >= 50 ? 'text-amber-400' : 'text-red-400'
  const label = v >= 70 ? 'Alta' : v >= 50 ? 'Media' : 'Baja'
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={clsx('text-4xl font-black tabular-nums', color)}>{v}<span className="text-lg font-normal">%</span></div>
      <div className="text-xs text-slate-400">Confianza {label}</div>
    </div>
  )
}

function RiskBadge({ level }: { level?: string }) {
  const styles: Record<string, string> = {
    BAJO:  'bg-green-500/20 text-green-300 border-green-500/30',
    MEDIO: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    ALTO:  'bg-red-500/20 text-red-300 border-red-500/30',
  }
  const l = level ?? 'MEDIO'
  return (
    <span className={clsx('text-xs font-semibold px-3 py-1 rounded-full border', styles[l] ?? styles.MEDIO)}>
      Riesgo {l}
    </span>
  )
}

function DataQualityBadge({ quality }: { quality?: string }) {
  const styles: Record<string, string> = {
    ALTA:  'text-green-400',
    MEDIA: 'text-amber-400',
    BAJA:  'text-red-400',
  }
  const q = quality ?? 'MEDIA'
  return (
    <span className={clsx('text-xs', styles[q] ?? styles.MEDIA)}>
      Datos: {q}
    </span>
  )
}

export default function AnalysisResult({ analysis, isLoading, streamText }: Props) {
  if (!isLoading && !analysis) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/30 flex flex-col items-center justify-center min-h-[420px] text-center p-8 gap-4">
        <div className="text-5xl">🎯</div>
        <div>
          <p className="text-slate-200 font-semibold text-lg">Tu apuesta aparecerá aquí</p>
          <p className="text-slate-500 text-sm mt-1">La IA busca los datos y te dice exactamente qué apostar</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/30 flex flex-col items-center justify-center min-h-[420px] text-center p-8 gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-green-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
        </div>
        <div>
          <p className="text-slate-200 font-semibold">Buscando datos del partido...</p>
          <p className="text-slate-500 text-sm mt-1">Forma reciente · Lesiones · H2H · Estadísticas</p>
        </div>
        {streamText && (
          <div className="text-xs text-slate-600 max-w-xs truncate">Procesando respuesta...</div>
        )}
      </div>
    )
  }

  const bet = analysis!.bestBet
  const alts = analysis!.alternatives ?? []
  const isHighConfidence = (bet.confidence ?? 0) >= 70
  const hasEdge = typeof bet.edge === 'number' && bet.edge > 0
  const edgePct = hasEdge ? (bet.edge! * 100).toFixed(1) : null

  return (
    <div className="space-y-4">

      {/* Apuesta principal */}
      <div className={clsx(
        'rounded-2xl border-2 p-6 space-y-5',
        isHighConfidence ? 'border-green-400 bg-green-500/8' : 'border-amber-400 bg-amber-500/8'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className={clsx('font-bold text-sm uppercase tracking-wider', isHighConfidence ? 'text-green-400' : 'text-amber-400')}>
              Mejor apuesta
            </span>
          </div>
          <RiskBadge level={analysis!.riskLevel} />
        </div>

        {/* Mercado destacado */}
        <div className="bg-slate-900/60 rounded-xl p-5 space-y-4">
          <p className="text-white font-bold text-2xl leading-tight">{bet.market}</p>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-slate-400 text-xs uppercase tracking-wide">Cuota</p>
              <p className="text-4xl font-black text-white tabular-nums">
                {typeof bet.odds === 'number' && bet.odds > 0 ? bet.odds.toFixed(2) : '—'}
              </p>
            </div>
            <ConfidenceRing value={bet.confidence ?? 50} />
            {edgePct && (
              <div className="text-right space-y-0.5">
                <p className="text-slate-400 text-xs uppercase tracking-wide">Edge</p>
                <p className="text-2xl font-black text-green-400">+{edgePct}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Razón */}
        {bet.reason && (
          <div className="flex gap-3 bg-slate-800/60 rounded-xl p-4">
            <span className="text-lg shrink-0">💡</span>
            <p className="text-slate-300 text-sm leading-relaxed">{bet.reason}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <DataQualityBadge quality={analysis!.dataQuality} />
          <p className="text-xs text-slate-600">Análisis estadístico IA · No garantiza resultado</p>
        </div>
      </div>

      {/* Alternativas */}
      {alts.length > 0 && (
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Otras opciones</p>
          <div className="space-y-2">
            {alts.map((alt, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                <span className="text-slate-300 text-sm">{alt.market}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-white font-bold text-sm">
                    {typeof alt.odds === 'number' && alt.odds > 0 ? alt.odds.toFixed(2) : '—'}
                  </span>
                  <span className={clsx(
                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                    (alt.confidence ?? 0) >= 65 ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                  )}>
                    {alt.confidence ?? 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
