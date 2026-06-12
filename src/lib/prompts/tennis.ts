import type { TennisInput } from '../types'

export function buildTennisPrompt(input: TennisInput): string {
  return `Partido de tenis: ${input.p1} vs ${input.p2} | ${input.tournament} | ${input.surface} | ${input.date}

BÚSQUEDAS REQUERIDAS (hacé exactamente 2):
1. "${input.p1} ${input.p2} ${input.surface} forma reciente 2025 head to head"
2. "${input.p1} ${input.p2} ${input.tournament} lesiones ranking actualizado"

CUOTAS DEL MERCADO:
${input.marketOdds || 'No se proporcionaron cuotas — recomendá el mercado más probable.'}

Analizá ELO en ${input.surface}, H2H, forma reciente, lesiones. Devolvé SOLO el JSON del sistema.`
}
