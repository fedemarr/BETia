import type { FootballInput } from '../types'

export function buildFootballPrompt(input: FootballInput): string {
  return `Partido: ${input.homeTeam} vs ${input.awayTeam} | ${input.league} | ${input.date}

BÚSQUEDAS REQUERIDAS (hacé exactamente 2):
1. "${input.homeTeam} ${input.awayTeam} ${input.date} preview lesiones forma reciente"
2. "${input.homeTeam} ${input.awayTeam} head to head últimos goles estadísticas"

CUOTAS DEL MERCADO:
${input.marketOdds || 'No se proporcionaron cuotas — analizá igual y recomendá el mercado más probable.'}

Analizá forma reciente de ambos equipos, lesiones, H2H, goles promedio, y determiná la mejor apuesta.
Devolvé SOLO el JSON según el formato del sistema.`
}
