import type { FootballInput } from '../types'

export function buildFootballPrompt(input: FootballInput): string {
  return `Sos un analista de fútbol profesional con acceso a los siguientes datos
del partido ${input.homeTeam} vs ${input.awayTeam} (${input.league}):

=== DATOS HISTÓRICOS DISPONIBLES ===
${input.historicalData || 'No se proporcionaron datos históricos. Indicá nivel de confianza BAJO y avisá que se necesitan más datos.'}

Con base en esos datos, analizá TODOS los mercados siguientes y devolvé
el análisis en el formato especificado. Sé preciso y fundamentá cada
probabilidad con los datos históricos.

=== MERCADOS A ANALIZAR ===

1. RESULTADO FINAL (1X2)
   - Calcula P(victoria local), P(empate), P(victoria visitante)
   - Usá el modelo Dixon-Coles ajustado con ventaja local (factor 1.15)
   - Considerá: forma reciente (últimos 5 partidos), rendimiento como local/visitante, H2H

2. GOLES (Modelo Poisson obligatorio)
   - Calculá λ_home y λ_away (goles esperados por equipo)
   - Derivá probabilidades para: Over/Under 1.5, 2.5, 3.5
   - BTTS Sí / No
   - Marcador más probable (top 5 scores)
   - Goles primer tiempo Over/Under 0.5, 1.5
   - Primer equipo en anotar (local %, visitante %, sin goles primer tiempo %)

3. CORNERS
   - Promedio esperado de corners del partido
   - P(Over 7.5), P(Over 8.5), P(Over 9.5), P(Over 10.5)
   - Corners primer tiempo Over/Under 4.5
   - Equipo con más corners
   - Fundamento: promedio de corners últimos 10 partidos de cada equipo

4. TARJETAS AMARILLAS
   - Promedio esperado del partido
   - P(Over 2.5), P(Over 3.5), P(Over 4.5) amarillas
   - P(tarjeta roja en el partido)
   - Equipo con más amarillas (%)

5. FALTAS
   - Total de faltas esperadas
   - P(Over 22.5), P(Over 26.5) faltas totales
   - Equipo más foulero (%)

6. HÁNDICAP ASIÁTICO
   - Local -0.5, -1, -1.5
   - Visitante +0.5, +1, +1.5
   - Hándicap de goles para Over/Under

7. ESTADÍSTICAS DE JUGADORES (si hay datos disponibles)
   - Goleador probable: top 3 candidatos con % de probabilidad
   - Jugador con más probabilidad de ser amonestado
   - Jugador con más probabilidad de dar asistencia

=== CUOTAS ACTUALES DEL MERCADO ===
${input.marketOdds || 'No se proporcionaron cuotas. Omití el cálculo de value bets.'}

=== CÁLCULO DE VALUE BETS ===
Para cada mercado donde haya cuotas disponibles:
- Calculá implied_probability = 1 / odds
- Calculá edge = nuestra_probabilidad - implied_probability
- Si edge > 0.05 (5%): marcalo como VALUE BET
- Si edge > 0.10 (10%): marcalo como STRONG VALUE BET
- Calculá expected_value = (nuestra_prob × odds) - 1

=== FACTORES DE RIESGO ===
Analizá y mencioná:
- Lesiones o suspensiones confirmadas
- Fatiga (partidos en los últimos 4 días)
- Motivación (posición en la tabla, necesidad de puntos)
- Clima (si afecta el juego)
- Historial entre estos equipos (últimos 5 H2H)

=== SCORE DE CONFIANZA (0-100) ===
Calculalo en base a:
- Cantidad de partidos históricos disponibles (máx 25 pts)
- Coherencia entre Poisson y regresión logística (máx 25 pts)
- Recencia de los datos (máx 20 pts)
- Consistencia H2H con el modelo (máx 20 pts)
- Alineación con cuotas de mercado (máx 10 pts)

=== FORMATO DE RESPUESTA ===
Primero el JSON con todos los datos estructurados dentro de \`\`\`json ... \`\`\`.
Luego un resumen narrativo de 150-200 palabras en español que:
- Destaque los mercados más confiables
- Mencione los value bets con mayor edge
- Señale los principales factores de riesgo
- Indique el nivel de confianza general
- Recuerde que son probabilidades, no certezas

Partido: ${input.homeTeam} vs ${input.awayTeam}
Liga: ${input.league}
Fecha: ${input.date}`
}
