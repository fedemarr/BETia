import type { TennisInput } from '../types'

export function buildTennisPrompt(input: TennisInput): string {
  return `Analizá el partido de tenis: ${input.p1} vs ${input.p2}
Torneo: ${input.tournament} | Ronda: ${input.round} | Superficie: ${input.surface} | Fecha: ${input.date}

=== PASO 1: BÚSQUEDA DE DATOS (ejecutá estas búsquedas con web_search) ===

Buscá en este orden:
1. "${input.p1} últimos partidos 2025 resultados ${input.surface}" — forma reciente en esta superficie
2. "${input.p2} últimos partidos 2025 resultados ${input.surface}" — forma reciente en esta superficie
3. "${input.p1} vs ${input.p2} historial head to head" — H2H completo
4. "${input.p1} ${input.p2} ranking ELO ${input.surface} 2025" — ELO por superficie
5. "${input.p1} ${input.p2} lesiones estado físico ${input.tournament} 2025" — condición física
6. "${input.p1} ${input.p2} estadísticas servicio aces dobles faltas" — stats de servicio

Recopilá: últimas 10 semanas de resultados, H2H en ${input.surface}, ranking actual, lesiones.

=== PASO 2: ANÁLISIS DE MERCADOS ===

1. GANADOR DEL PARTIDO
   - P(victoria ${input.p1}) / P(victoria ${input.p2})
   - ELO en ${input.surface}, forma reciente, H2H en esta superficie

2. SETS
   - P(over/under 3.5 sets)
   - Resultados más probables: 3-0, 3-1, 3-2 (con %)
   - P(tie-break en algún set) / P(tie-break en set final)

3. GAMES TOTALES
   - Promedio esperado | P(Over 38.5 / 39.5 / 40.5)

4. ESTADÍSTICAS DE SERVICIO
   - Aces esperados por set (ambos jugadores)
   - % 1er servicio | P(break en cada set)

5. HÁNDICAP DE SETS
   - ${input.p1} -1.5 sets / ${input.p2} +1.5 sets

6. SET 1
   - P(${input.p1} gana Set 1) / P(${input.p2} gana Set 1)
   - P(Set 1 Over/Under 10.5 games)

=== FACTORES ESPECÍFICOS ===
- Ajuste por superficie ${input.surface} (afecta aces, duración, breaks)
- Condición física y partidos acumulados recientes
- Presión de ranking en este torneo

=== CUOTAS DEL MERCADO ===
${input.marketOdds || 'No se proporcionaron cuotas. Omití el cálculo de value bets.'}

=== VALUE BETS ===
- implied_probability = 1 / odds | edge = nuestra_prob - implied_prob
- VALUE BET si edge > 0.05 | STRONG VALUE BET si edge > 0.10

=== FORMATO FINAL ===
\`\`\`json con todos los campos de AnalysisResponse.
Luego narrativa de 130-170 palabras en español.`
}
