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
  football: `{"1X2": {"home": 2.10, "draw": 3.40, "away": 3.60},\n"goals": {"over15": 1.25, "over25": 1.85, "over35": 3.20},\n"btts": {"yes": 1.95, "no": 1.85}}`,
  tennis:   `{"winner": {"p1": 1.80, "p2": 2.05},\n"sets": {"over35": 2.10, "under35": 1.70}}`,
  basket:   `{"moneyline": {"home": 1.75, "away": 2.15},\n"total": {"line": 218.5, "over": 1.90, "under": 1.90}}`,
}

const EXAMPLE_DATA = {
  football: `Real Madrid últimos 5 partidos (local): G 3-1, G 2-0, E 1-1, G 4-0, G 2-1
Media goles marcados (local): 2.4 | Media goles recibidos: 0.8
Barcelona últimos 5 partidos (visitante): P 0-2, G 1-0, E 2-2, G 3-1, P 0-1
Media goles marcados (visitante): 1.2 | Media goles recibidos: 1.2
H2H últimos 5: Real Madrid 3V, 1E, 1D
Corners: Real Madrid 6.8 prom | Barcelona 5.2 prom`,
  tennis: `Alcaraz último mes: W-W-W-L-W (4-1 clay) Ranking ELO clay: 2180
Djokovic último mes: W-L-W-W-L (3-2 clay) Ranking ELO clay: 2150
H2H: Alcaraz 3-2 Djokovic | H2H en clay: Alcaraz 2-0
Aces prom: Alcaraz 4.2/partido | Djokovic 3.1/partido
Break points conversión: Alcaraz 42% | Djokovic 48%`,
  basket: `Lakers últimos 5 (local): G 118-105, P 102-115, G 125-118, G 112-108, P 98-115
Offensive Rating Lakers: 112.4 | Defensive Rating: 108.2
Celtics últimos 5 (visitante): G 125-110, G 118-102, P 98-110, G 120-115, G 115-108
Offensive Rating Celtics: 118.2 | Defensive Rating: 105.1
H2H temporada: Celtics 2-1 Lakers`,
}

export default function AnalysisForm({ sport, onAnalyze, isLoading }: Props) {
  const today = new Date().toISOString().split('T')[0]

  const [football, setFootball] = useState<Omit<FootballInput, 'sport'>>({
    homeTeam: '', awayTeam: '', league: '', date: today,
    historicalData: '', marketOdds: '',
  })
  const [tennis, setTennis] = useState<Omit<TennisInput, 'sport'>>({
    p1: '', p2: '', tournament: '', surface: 'clay', round: '', date: today,
    historicalData: '', marketOdds: '',
  })
  const [basket, setBasket] = useState<Omit<BasketInput, 'sport'>>({
    homeTeam: '', awayTeam: '', league: 'NBA', date: today,
    historicalData: '', marketOdds: '',
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
      setFootball(prev => ({
        ...prev,
        homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga',
        historicalData: EXAMPLE_DATA.football,
        marketOdds: EXAMPLE_ODDS.football,
      }))
    } else if (sport === 'tennis') {
      setTennis(prev => ({
        ...prev,
        p1: 'Carlos Alcaraz', p2: 'Novak Djokovic',
        tournament: 'Roland Garros', surface: 'clay', round: 'Semifinal',
        historicalData: EXAMPLE_DATA.tennis,
        marketOdds: EXAMPLE_ODDS.tennis,
      }))
    } else {
      setBasket(prev => ({
        ...prev,
        homeTeam: 'LA Lakers', awayTeam: 'Boston Celtics', league: 'NBA',
        historicalData: EXAMPLE_DATA.basket,
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
        <h2 className="font-semibold text-slate-200">Configurar partido</h2>
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
              <input className={inputCls} placeholder="Roland Garros" value={tennis.tournament}
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

      {/* Datos históricos */}
      <div>
        <label className={labelCls}>
          Datos históricos
          <span className="text-slate-600 ml-1">(forma, H2H, estadísticas)</span>
        </label>
        <textarea
          className={textareaCls}
          rows={5}
          placeholder={EXAMPLE_DATA[sport]}
          value={sport === 'football' ? football.historicalData : sport === 'tennis' ? tennis.historicalData : basket.historicalData}
          onChange={e => {
            const v = e.target.value
            if (sport === 'football') setFootball(p => ({ ...p, historicalData: v }))
            else if (sport === 'tennis') setTennis(p => ({ ...p, historicalData: v }))
            else setBasket(p => ({ ...p, historicalData: v }))
          }}
        />
      </div>

      {/* Cuotas */}
      <div>
        <label className={labelCls}>
          Cuotas del mercado
          <span className="text-slate-600 ml-1">(JSON o texto libre)</span>
        </label>
        <textarea
          className={textareaCls}
          rows={4}
          placeholder={EXAMPLE_ODDS[sport]}
          value={sport === 'football' ? football.marketOdds : sport === 'tennis' ? tennis.marketOdds : basket.marketOdds}
          onChange={e => {
            const v = e.target.value
            if (sport === 'football') setFootball(p => ({ ...p, marketOdds: v }))
            else if (sport === 'tennis') setTennis(p => ({ ...p, marketOdds: v }))
            else setBasket(p => ({ ...p, marketOdds: v }))
          }}
        />
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
            Analizando con Claude...
          </span>
        ) : (
          '🤖 Analizar partido'
        )}
      </button>
    </form>
  )
}
