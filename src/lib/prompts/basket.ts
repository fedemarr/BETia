import type { BasketInput } from '../types'

export function buildBasketPrompt(input: BasketInput): string {
  return `Partido de básquet: ${input.homeTeam} vs ${input.awayTeam} | ${input.league} | ${input.date}

BÚSQUEDAS REQUERIDAS (hacé exactamente 2):
1. "${input.homeTeam} ${input.awayTeam} ${input.date} lesiones ausencias forma reciente ${input.league}"
2. "${input.homeTeam} ${input.awayTeam} offensive defensive rating pace head to head"

CUOTAS DEL MERCADO:
${input.marketOdds || 'No se proporcionaron cuotas — recomendá el mercado más probable.'}

Analizá pace, rating ofensivo/defensivo, lesiones clave, H2H. Devolvé SOLO el JSON del sistema.`
}
