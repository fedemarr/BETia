import clsx from 'clsx'
import type { ValueBet } from '@/lib/types'

interface Props {
  bet: ValueBet
}

export default function ValueBetCard({ bet }: Props) {
  const edgePct = (bet.edge * 100).toFixed(1)
  const evPct = (bet.expectedValue * 100).toFixed(1)
  const ourProbPct = (bet.ourProbability * 100).toFixed(1)
  const impliedPct = (bet.impliedProbability * 100).toFixed(1)
  const isStrong = bet.edge > 0.10

  return (
    <div
      className={clsx(
        'rounded-xl border p-4 space-y-3 transition-all',
        isStrong
          ? 'border-amber-500/60 bg-amber-500/10'
          : 'border-green-500/40 bg-green-500/8'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-100 leading-snug">{bet.market}</p>
          <p className="text-xs text-slate-400 mt-0.5">Confianza: {bet.confidence}</p>
        </div>
        <span
          className={clsx(
            'shrink-0 text-xs font-bold px-2.5 py-1 rounded-full',
            isStrong
              ? 'bg-amber-500 text-black'
              : 'bg-green-500 text-black'
          )}
        >
          {isStrong ? 'STRONG VALUE' : 'VALUE BET'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-slate-400 text-xs">Cuota</p>
          <p className="font-bold text-slate-100">{bet.marketOdds.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Prob. mercado</p>
          <p className="font-medium text-slate-300">{impliedPct}%</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Nuestra prob.</p>
          <p className="font-medium text-green-400">{ourProbPct}%</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Edge</p>
          <p className={clsx('font-bold', isStrong ? 'text-amber-400' : 'text-green-400')}>
            +{edgePct}%
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/10">
        <span className="text-xs text-slate-400">Expected Value</span>
        <span className={clsx('text-sm font-bold', parseFloat(evPct) >= 0 ? 'text-green-400' : 'text-red-400')}>
          {parseFloat(evPct) >= 0 ? '+' : ''}{evPct}%
        </span>
      </div>
    </div>
  )
}
