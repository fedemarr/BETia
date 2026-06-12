import type { BasketInput } from '../types'

export function buildBasketPrompt(input: BasketInput): string {
  return `Sos un analista de básquet especializado en estadísticas NBA/EuroLeague para
el partido ${input.homeTeam} vs ${input.awayTeam} (${input.league}).

=== DATOS HISTÓRICOS DISPONIBLES ===
${input.historicalData || 'No se proporcionaron datos históricos. Indicá nivel de confianza BAJO.'}

Analizá TODOS los mercados siguientes:

1. GANADOR DEL PARTIDO
   - P(victoria local), P(victoria visitante)
   - Considerá: Offensive/Defensive Rating, Net Rating, pace, forma reciente
   - Ajuste por ventaja de cancha local (+3.2 puntos histórico NBA)

2. TOTAL DE PUNTOS
   - Puntos esperados: ${input.homeTeam} + ${input.awayTeam}
   - P(Over 210.5), P(Over 215.5), P(Over 218.5), P(Over 221.5), P(Over 226.5)
   - Considera: pace del partido esperado, defensive ratings cruzados

3. PUNTOS POR EQUIPO (moneyline de puntos)
   - ${input.homeTeam} Over/Under 106.5, 108.5, 110.5
   - ${input.awayTeam} Over/Under 106.5, 108.5, 110.5

4. HÁNDICAP DE PUNTOS
   - ${input.homeTeam} -2.5, -4.5, -5.5, -7.5
   - ${input.awayTeam} +2.5, +4.5, +5.5, +7.5

5. CUARTOS (Quarter betting)
   - Q1 total Over/Under 52.5, 54.5, 56.5
   - Q1 ganador (local %, visitante %)
   - Equipo que va ganando al descanso (%)
   - Diferencia al descanso mayor a 10 puntos (%)

6. TRIPLES
   - Total triples del partido Over/Under 22.5, 24.5, 26.5
   - ${input.homeTeam} triples Over/Under 12.5
   - ${input.awayTeam} triples Over/Under 12.5

7. PRÓRROGA Y RESULTADOS ESPECIALES
   - P(prórroga en el partido)
   - P(diferencia final > 15 puntos)
   - P(ambos equipos superan 110 pts)

8. ESTADÍSTICAS DE JUGADORES CLAVE
   Para los 2 jugadores estelares de cada equipo:
   - P(supera su promedio de puntos)
   - Puntos esperados en este partido
   - P(doble-doble o triple-doble)
   - P(ser el máximo anotador del partido)

=== FACTORES ESPECÍFICOS DE BÁSQUET ===
- Back-to-back: ¿algún equipo jugó ayer? (penalización estadística -3.1 pts)
- Minutos acumulados de jugadores clave (fatiga)
- Historial en esta cancha
- Motivación de playoffs vs temporada regular
- Lesiones y ausencias confirmadas en el roster

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

Partido: ${input.homeTeam} vs ${input.awayTeam}
Liga: ${input.league}
Fecha: ${input.date}`
}
