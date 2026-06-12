export type Sport = 'football' | 'tennis' | 'basket'
export type Surface = 'clay' | 'hard' | 'grass' | 'carpet'
export type Risk = 'BAJO' | 'MEDIO' | 'ALTO'
export type ConfidenceLevel = 'ALTO' | 'MEDIO' | 'BAJO'

export interface FootballInput {
  sport: 'football'
  homeTeam: string
  awayTeam: string
  league: string
  date: string
  historicalData: string
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
  historicalData: string
  marketOdds: string
}

export interface BasketInput {
  sport: 'basket'
  homeTeam: string
  awayTeam: string
  league: string
  date: string
  historicalData: string
  marketOdds: string
}

export type AnalysisInput = FootballInput | TennisInput | BasketInput

export interface ValueBet {
  market: string
  ourProbability: number
  marketOdds: number
  impliedProbability: number
  edge: number
  expectedValue: number
  confidence: ConfidenceLevel
}

export interface AnalysisResponse {
  sport: Sport
  match: {
    home: string
    away: string
    league: string
    date: string
    confidence: number
    risk: Risk
  }
  markets: {
    // Fútbol
    result?: { homeWin: number; draw: number; awayWin: number }
    goals?: {
      xgHome: number
      xgAway: number
      over15: number
      over25: number
      over35: number
      bttsYes: number
      bttsNo: number
      firstGoalHome: number
      firstGoalAway: number
      mostLikelyScore: Array<{ score: string; prob: number }>
    }
    corners?: { avg: number; over75: number; over85: number; over95: number }
    cards?: {
      avgYellow: number
      yellowOver25: number
      yellowOver35: number
      redCardYes: number
      avgRed: number
    }
    fouls?: { avg: number; over225: number; over265: number }
    handicap?: Record<string, number>
    players?: Array<{ name: string; market: string; probability: number }>

    // Tenis
    winner?: { p1Win: number; p2Win: number }
    sets?: {
      over35: number
      under35: number
      scores: Array<{ result: string; prob: number }>
      tiebreakAny: number
      tiebreakFinal: number
    }
    games?: { avg: number; over385: number; over395: number; over405: number }
    serving?: {
      p1Aces: number
      p2Aces: number
      p1DblFaults: number
      p2DblFaults: number
      p1FirstServ: number
      p2FirstServ: number
    }

    // Básquet
    total?: { avg: number; over2105: number; over2185: number; over2265: number }
    teamPoints?: {
      homePPG: number
      awayPPG: number
      homeDefRating: number
      awayDefRating: number
    }
    quarters?: { q1Over545: number; halfLeadHome: number; overtime: number }
    threePointers?: { totalOver225: number; homeOver125: number; awayOver125: number }
    keyPlayers?: Array<{ name: string; team: string; ppgExpected: number; overPPG: number }>
  }
  valueBets: ValueBet[]
  riskFactors: string[]
  narrative: string
  modelVersion: string
  dataPointsUsed: number
}

export function parseAnalysisResponse(text: string): AnalysisResponse | null {
  // Extraer JSON de bloque markdown ```json ... ```
  const jsonBlock = text.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonBlock?.[1]) {
    try { return JSON.parse(jsonBlock[1]) } catch {}
  }

  // Extraer JSON crudo buscando el objeto principal
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)) } catch {}
  }

  return null
}
