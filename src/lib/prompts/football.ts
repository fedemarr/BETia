import type { FootballInput } from '../types'

export function buildFootballPrompt(input: FootballInput): string {
  return `Analizá el partido de fútbol: ${input.homeTeam} vs ${input.awayTeam}
Liga: ${input.league} | Fecha: ${input.date}

=== PASO 1: BÚSQUEDA DE DATOS (ejecutá estas búsquedas con web_search) ===

Buscá en este orden:
1. "${input.homeTeam} últimos partidos 2025 resultados goles" — forma reciente del local
2. "${input.awayTeam} últimos partidos 2025 resultados goles" — forma reciente del visitante
3. "${input.homeTeam} vs ${input.awayTeam} historial head to head" — H2H
4. "${input.homeTeam} ${input.awayTeam} lesiones bajas ${input.date}" — lesiones/suspensiones
5. "${input.homeTeam} ${input.awayTeam} estadísticas xG corners tarjetas ${input.league}" — stats avanzadas

Recopilá al menos: últimos 5 partidos de cada equipo, H2H reciente, lesiones confirmadas,
posición en la tabla, xG promedio si está disponible.

=== PASO 2: ANÁLISIS DE MERCADOS ===

Con los datos encontrados, analizá TODOS estos mercados:

1. RESULTADO FINAL (1X2)
   - P(victoria local), P(empate), P(victoria visitante)
   - Modelo Dixon-Coles con ventaja local (factor 1.15)
   - Considerá: forma reciente, rendimiento local/visitante, H2H

2. GOLES (Modelo Poisson)
   - Calculá λ_home y λ_away (goles esperados)
   - Over/Under 1.5, 2.5, 3.5 | BTTS Sí/No
   - Top 5 marcadores más probables | Goles primer tiempo

3. CORNERS
   - Promedio esperado | P(Over 7.5 / 8.5 / 9.5 / 10.5)

4. TARJETAS AMARILLAS
   - P(Over 2.5 / 3.5 / 4.5) | P(tarjeta roja)

5. FALTAS
   - Total esperado | P(Over 22.5 / 26.5)

6. HÁNDICAP ASIÁTICO
   - Local -0.5 / -1 / -1.5 | Visitante +0.5 / +1 / +1.5

7. JUGADORES DESTACADOS (si encontraste datos)
   - Top 3 candidatos a goleador con probabilidad

=== CUOTAS DEL MERCADO ===
${input.marketOdds || 'No se proporcionaron cuotas. Omití el cálculo de value bets.'}

=== PASO 3: VALUE BETS ===
Para cada mercado con cuotas:
- implied_probability = 1 / odds
- edge = nuestra_probabilidad - implied_probability
- VALUE BET si edge > 0.05 | STRONG VALUE BET si edge > 0.10
- expected_value = (nuestra_prob × odds) - 1

=== SCORE DE CONFIANZA (0-100) ===
- Cantidad de datos encontrados (máx 30 pts)
- Recencia de los datos (máx 25 pts)
- Coherencia del modelo Poisson (máx 25 pts)
- H2H consistency (máx 20 pts)

=== FORMATO FINAL ===
\`\`\`json con todos los campos de AnalysisResponse.
Luego narrativa de 150-200 palabras en español destacando value bets y factores de riesgo.`
}
