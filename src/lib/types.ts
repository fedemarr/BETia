export type Sport = 'football' | 'tennis' | 'basket'
export type Surface = 'clay' | 'hard' | 'grass' | 'carpet'
export type Risk = 'BAJO' | 'MEDIO' | 'ALTO'

export interface FootballInput {
  sport: 'football'
  homeTeam: string
  awayTeam: string
  league: string
  date: string
  marketOdds: string
}

export interface TennisInput {
  sport: 'tennis'
  p1: string
  p2: string
  tournament: string
  surface: Surface
  round: string
  date: string
  marketOdds: string
}

export interface BasketInput {
  sport: 'basket'
  homeTeam: string
  awayTeam: string
  league: string
  date: string
  marketOdds: string
}

export type AnalysisInput = FootballInput | TennisInput | BasketInput

export interface BetRecommendation {
  market: string
  odds: number
  confidence: number
  edge?: number
  reason: string
}

export interface AnalysisResponse {
  bestBet: BetRecommendation
  alternatives?: Array<{ market: string; odds: number; confidence: number }>
  riskLevel?: 'BAJO' | 'MEDIO' | 'ALTO'
  dataQuality?: 'ALTA' | 'MEDIA' | 'BAJA'
  // Legacy fields (kept for backward compat)
  valueBets?: unknown[]
  riskFactors?: string[]
}

export function parseAnalysisResponse(text: string): AnalysisResponse | null {
  const jsonBlock = text.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonBlock?.[1]) {
    try {
      const parsed = JSON.parse(jsonBlock[1])
      if (parsed?.bestBet) return parsed as AnalysisResponse
    } catch {}
  }

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try {
      const parsed = JSON.parse(text.slice(start, end + 1))
      if (parsed?.bestBet) return parsed as AnalysisResponse
    } catch {}
  }

  return null
}
