import type { TennisInput } from '../types'

export function buildTennisPrompt(input: TennisInput): string {
  return `Sos un analista de tenis especializado en modelos estadísticos para
partidos de ${input.p1} vs ${input.p2} (${input.tournament} · ${input.round} · Superficie: ${input.surface}).

=== DATOS HISTÓRICOS DISPONIBLES ===
${input.historicalData || 'No se proporcionaron datos históricos. Indicá nivel de confianza BAJO.'}

Analizá TODOS los mercados siguientes:

1. GANADOR DEL PARTIDO
   - P(victoria ${input.p1}), P(victoria ${input.p2})
   - Considerá: ranking ELO en superficie, forma reciente (últimas 10 semanas),
     H2H histórico, H2H en esta superficie específica

2. SETS
   - P(match más de 3.5 sets), P(menos de 3.5 sets)
   - Resultados más probables: 3-0, 3-1, 3-2 (con % para cada uno)
   - P(${input.p1} gana 3-0 o 3-1 = sin sets perdidos)
   - P(${input.p2} gana 3-0 o 3-1)
   - P(tie-break en al menos un set)
   - P(tie-break en el set final)

3. GAMES TOTALES
   - Promedio esperado de games del partido
   - P(Over 38.5), P(Over 39.5), P(Over 40.5) games totales
   - Games promedio por set

4. ESTADÍSTICAS DE SERVICIO
   - Aces esperados por set (${input.p1} y ${input.p2})
   - Dobles faltas esperadas por set (${input.p1} y ${input.p2})
   - % primer servicio histórico (${input.p1} y ${input.p2})
   - P(break de servicio en cada set)
   - P(${input.p1} pierde su servicio en algún momento)
   - P(${input.p2} pierde su servicio en algún momento)

5. HANDICAP DE SETS Y GAMES
   - ${input.p1} -1.5 sets: %
   - ${input.p2} +1.5 sets: %
   - Hándicap de games: -3.5, +3.5

6. MERCADOS DE SETS INDIVIDUALES
   - P(${input.p1} gana Set 1)
   - P(${input.p2} gana Set 1)
   - P(Set 1 Over/Under 10.5 games)

=== FACTORES ESPECÍFICOS DE TENIS ===
- Superficie: ajuste de probabilidades según ${input.surface}
- Historial reciente del jugador en esta superficie (última temporada)
- Condición física: historial de lesiones, partidos recientes acumulados
- Presión de ranking (necesidad de puntos para clasificación)

=== CUOTAS ACTUALES DEL MERCADO ===
${input.marketOdds || 'No se proporcionaron cuotas. Omití el cálculo de value bets.'}

=== CÁLCULO DE VALUE BETS ===
- implied_probability = 1 / odds
- edge = nuestra_probabilidad - implied_probability
- VALUE BET si edge > 0.05
- STRONG VALUE BET si edge > 0.10
- expected_value = (nuestra_prob × odds) - 1

=== FORMATO DE RESPUESTA ===
Primero el JSON dentro de \`\`\`json ... \`\`\`.
Luego resumen narrativo de 130-170 palabras en español.

Partido: ${input.p1} vs ${input.p2}
Torneo: ${input.tournament} — ${input.round}
Superficie: ${input.surface}
Fecha: ${input.date}`
}
