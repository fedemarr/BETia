'use client'

import clsx from 'clsx'
import type { Sport } from '@/lib/types'

const SPORTS = [
  { id: 'football' as Sport, label: 'Fútbol', icon: '⚽' },
  { id: 'tennis'   as Sport, label: 'Tenis',  icon: '🎾' },
  { id: 'basket'   as Sport, label: 'Básquet', icon: '🏀' },
]

interface Props {
  sport: Sport
  onSelect: (sport: Sport) => void
}

export default function SportTabs({ sport, onSelect }: Props) {
  return (
    <div className="flex gap-2 border-b border-slate-700 pb-0">
      {SPORTS.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={clsx(
            'flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-lg transition-all',
            sport === s.id
              ? 'bg-slate-800 text-green-400 border-b-2 border-green-400 -mb-px'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          )}
        >
          <span className="text-base">{s.icon}</span>
          {s.label}
        </button>
      ))}
    </div>
  )
}
