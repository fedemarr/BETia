import { streamAnalysis } from '@/lib/claude/analyze'
import { fetchOddsFromUrl, isUrl } from '@/lib/utils/fetchOdds'
import type { AnalysisInput } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnalysisInput

    if (!body?.sport) {
      return new Response(JSON.stringify({ error: 'El campo sport es obligatorio' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Si marketOdds es una URL, intentamos fetchear el contenido
    if (body.marketOdds && isUrl(body.marketOdds)) {
      const originalUrl = body.marketOdds.trim()
      const pageContent = await fetchOddsFromUrl(originalUrl)

      if (pageContent) {
        body.marketOdds = `El usuario proporcionó esta URL de cuotas: ${originalUrl}\n\nContenido extraído de la página:\n${pageContent}\n\nExtrae todas las cuotas disponibles de este contenido.`
      } else {
        // El fetch falló (JS rendering requerido) — le decimos a Claude que busque
        body.marketOdds = `El usuario proporcionó esta URL de cuotas: ${originalUrl}\n\nNo se pudo obtener el contenido directamente (la página requiere JavaScript). Usá web_search para buscar las cuotas de este partido en esa casa de apuestas o en fuentes alternativas (Oddschecker, FlashScore, SofaScore).`
      }
    }

    const stream = await streamAnalysis(body)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('[analyze] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Error al procesar el análisis. Verificá la API key de Claude.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
