import type { BasketInput } from '../types'

export function buildBasketPrompt(input: BasketInput): string {
  return `Analizá el partido de básquet: ${input.homeTeam} vs ${input.awayTeam}
Liga: ${input.league} | Fecha: ${input.date}

=== PASO 1: BÚSQUEDA DE DATOS (ejecutá estas búsquedas con web_search) ===

Buscá en este orden:
1. "${input.homeTeam} ${input.league} últimos partidos resultados 2025" — forma reciente del local
2. "${input.awayTeam} ${input.league} últimos partidos resultados 2025" — forma reciente visitante
3. "${input.homeTeam} vs ${input.awayTeam} head to head ${input.league}" — H2H
4. "${input.homeTeam} ${input.awayTeam} lesiones ausencias ${input.date}" — roster actual
5. "${input.homeTeam} offensive rating defensive rating pace 2025" — stats avanzadas local
6. "${input.awayTeam} offensive rating defensive rating pace 2025" — stats avanzadas visitante
7. "${input.homeTeam} ${input.awayTeam} back to back schedule ${input.league}" — fatiga/schedule

Recopilá: últimos 5 partidos, Offensive/Defensive Rating, Net Rating, pace, lesiones clave.

=== PASO 2: ANÁLISIS DE MERCADOS ===

1. GANADOR DEL PARTIDO
   - P(victoria local) / P(victoria visitante)
   - Net Rating, pace, forma, ventaja local (+3.2 pts histórico NBA)

2. TOTAL DE PUNTOS
   - Puntos esperados totales
   - P(Over 210.5 / 215.5 / 218.5 / 221.5 / 226.5)
   - Pace cruzado × eficiencia defensiva

3. PUNTOS POR EQUIPO
   - ${input.homeTeam}: Over/Under 106.5 / 108.5 / 110.5
   - ${input.awayTeam}: Over/Under 106.5 / 108.5 / 110.5

4. HÁNDICAP DE PUNTOS
   - ${input.homeTeam}: -2.5 / -4.5 / -5.5 / -7.5
   - ${input.awayTeam}: +2.5 / +4.5 / +5.5 / +7.5

5. CUARTOS
   - Q1 total Over/Under 52.5 / 54.5 / 56.5
   - Equipo ganando al descanso (%) | Diferencia > 10 pts al medio (%)

6. TRIPLES
   - Total Over/Under 22.5 / 24.5 / 26.5
   - Por equipo Over/Under 12.5

7. ESPECIALES
   - P(prórroga) | P(diferencia > 15 pts) | P(ambos superan 110 pts)

8. JUGADORES CLAVE (top 2 de cada equipo)
   - Puntos esperados | P(supera su promedio) | P(doble-doble)

=== FACTORES ESPECÍFICOS ===
- Back-to-back: penalización -3.1 pts si algún equipo jugó ayer
- Minutos acumulados de estrellas (fatiga de playoffs/temporada)
- Motivación: posición playoff vs eliminado

=== CUOTAS DEL MERCADO ===
${input.marketOdds || 'No se proporcionaron cuotas. Omití el cálculo de value bets.'}

=== VALUE BETS ===
- implied_probability = 1 / odds | edge = nuestra_prob - implied_prob
- VALUE BET si edge > 0.05 | STRONG VALUE BET si edge > 0.10

=== FORMATO FINAL ===
\`\`\`json con todos los campos de AnalysisResponse.
Luego narrativa de 130-170 palabras en español.`
}
