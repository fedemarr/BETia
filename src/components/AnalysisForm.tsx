'use client'

import { useState } from 'react'
import clsx from 'clsx'
import type { Sport, AnalysisInput, FootballInput, TennisInput, BasketInput, Surface } from '@/lib/types'

interface Props {
  sport: Sport
  onAnalyze: (input: AnalysisInput) => void
  isLoading: boolean
}

const SURFACES: { value: Surface; label: string }[] = [
  { value: 'clay',   label: 'Polvo de ladrillo' },
  { value: 'hard',   label: 'Dura' },
  { value: 'grass',  label: 'Hierba' },
  { value: 'carpet', label: 'Moqueta' },
]

const LEAGUES_BASKET = ['NBA', 'EuroLeague', 'NCB', 'ACB', 'NBL', 'Otra']

const EXAMPLE_ODDS = {
  football: `{"1X2": {"home": 2.10, "draw": 3.40, "away": 3.60},\n"goals": {"over15": 1.25, "over25": 1.85, "over35": 3.20},\n"btts": {"yes": 1.95, "no": 1.85},\n"corners": {"over85": 1.90, "under85": 1.90}}`,
  tennis:   `{"winner": {"p1": 1.80, "p2": 2.05},\n"sets": {"over35": 2.10, "under35": 1.70},\n"set1Winner": {"p1": 1.85, "p2": 2.00}}`,
  basket:   `{"moneyline": {"home": 1.75, "away": 2.15},\n"total": {"line": 218.5, "over": 1.90, "under": 1.90},\n"handicap": {"home": -4.5, "homeOdds": 1.90}}`,
}

export default function AnalysisForm({ sport, onAnalyze, isLoading }: Props) {
  const today = new Date().toISOString().split('T')[0]

  const [football, setFootball] = useState<Omit<FootballInput, 'sport'>>({
    homeTeam: '', awayTeam: '', league: '', date: today, marketOdds: '',
  })
  const [tennis, setTennis] = useState<Omit<TennisInput, 'sport'>>({
    p1: '', p2: '', tournament: '', surface: 'clay', round: '', date: today, marketOdds: '',
  })
  const [basket, setBasket] = useState<Omit<BasketInput, 'sport'>>({
    homeTeam: '', awayTeam: '', league: 'NBA', date: today, marketOdds: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const input: AnalysisInput =
      sport === 'football' ? { sport, ...football } :
      sport === 'tennis'   ? { sport, ...tennis }   :
                             { sport, ...basket }
    onAnalyze(input)
  }

  function fillExample() {
    if (sport === 'football') {
      setFootball(p => ({
        ...p,
        homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga',
        marketOdds: EXAMPLE_ODDS.football,
      }))
    } else if (sport === 'tennis') {
      setTennis(p => ({
        ...p,
        p1: 'Carlos Alcaraz', p2: 'Novak Djokovic',
        tournament: 'Wimbledon', surface: 'grass', round: 'Semifinal',
        marketOdds: EXAMPLE_ODDS.tennis,
      }))
    } else {
      setBasket(p => ({
        ...p,
        homeTeam: 'LA Lakers', awayTeam: 'Boston Celtics', league: 'NBA',
        marketOdds: EXAMPLE_ODDS.basket,
      }))
    }
  }

  const inputCls = 'w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition'
  const textareaCls = clsx(inputCls, 'resize-none font-mono text-xs leading-relaxed')
  const labelCls = 'block text-xs font-medium text-slate-400 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700 bg-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-200">Configurar partido</h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <span>🔍</span> La IA busca automáticamente los datos actualizados
          </p>
        </div>
        <button
          type="button"
          onClick={fillExample}
          className="text-xs text-green-400 hover:text-green-300 underline underline-offset-2"
        >
          Cargar ejemplo
        </button>
      </div>

      {sport === 'football' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Equipo local</label>
              <input className={inputCls} placeholder="Real Madrid" value={football.homeTeam}
                onChange={e => setFootball(p => ({ ...p, homeTeam: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Equipo visitante</label>
              <input className={inputCls} placeholder="Barcelona" value={football.awayTeam}
                onChange={e => setFootball(p => ({ ...p, awayTeam: e.target.value }))} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Liga</label>
              <input className={inputCls} placeholder="La Liga" value={football.league}
                onChange={e => setFootball(p => ({ ...p, league: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Fecha</label>
              <input type="date" className={inputCls} value={football.date}
                onChange={e => setFootball(p => ({ ...p, date: e.target.value }))} required />
            </div>
          </div>
        </>
      )}

      {sport === 'tennis' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Jugador 1</label>
              <input className={inputCls} placeholder="Carlos Alcaraz" value={tennis.p1}
                onChange={e => setTennis(p => ({ ...p, p1: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Jugador 2</label>
              <input className={inputCls} placeholder="Novak Djokovic" value={tennis.p2}
                onChange={e => setTennis(p => ({ ...p, p2: e.target.value }))} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Torneo</label>
              <input className={inputCls} placeholder="Wimbledon" value={tennis.tournament}
                onChange={e => setTennis(p => ({ ...p, tournament: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Ronda</label>
              <input className={inputCls} placeholder="Semifinal" value={tennis.round}
                onChange={e => setTennis(p => ({ ...p, round: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Fecha</label>
              <input type="date" className={inputCls} value={tennis.date}
                onChange={e => setTennis(p => ({ ...p, date: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Superficie</label>
            <select className={inputCls} value={tennis.surface}
              onChange={e => setTennis(p => ({ ...p, surface: e.target.value as Surface }))}>
              {SURFACES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {sport === 'basket' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Equipo local</label>
              <input className={inputCls} placeholder="LA Lakers" value={basket.homeTeam}
                onChange={e => setBasket(p => ({ ...p, homeTeam: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Equipo visitante</label>
              <input className={inputCls} placeholder="Boston Celtics" value={basket.awayTeam}
                onChange={e => setBasket(p => ({ ...p, awayTeam: e.target.value }))} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Liga</label>
              <select className={inputCls} value={basket.league}
                onChange={e => setBasket(p => ({ ...p, league: e.target.value }))}>
                {LEAGUES_BASKET.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Fecha</label>
              <input type="date" className={inputCls} value={basket.date}
                onChange={e => setBasket(p => ({ ...p, date: e.target.value }))} required />
            </div>
          </div>
        </>
      )}

      {/* Cuotas del mercado */}
      <div>
        <label className={labelCls}>
          Cuotas del mercado
        </label>
        <textarea
          className={textareaCls}
          rows={3}
          placeholder={`https://www.betano.bet.ar/cuotas-de-partido/...\n\nO pegá las cuotas directamente:\n${EXAMPLE_ODDS[sport]}`}
          value={sport === 'football' ? football.marketOdds : sport === 'tennis' ? tennis.marketOdds : basket.marketOdds}
          onChange={e => {
            const v = e.target.value
            if (sport === 'football') setFootball(p => ({ ...p, marketOdds: v }))
            else if (sport === 'tennis') setTennis(p => ({ ...p, marketOdds: v }))
            else setBasket(p => ({ ...p, marketOdds: v }))
          }}
        />
        <p className="text-xs text-slate-600 mt-1">
          Pegá el link de Betano, Bet365, Codere, etc. — o las cuotas en texto/JSON
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={clsx(
          'w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all',
          isLoading
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-400 text-black'
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin" />
            Buscando datos y analizando...
          </span>
        ) : (
          '🤖 Analizar partido'
        )}
      </button>
    </form>
  )
}
