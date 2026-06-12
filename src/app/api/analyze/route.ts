import { streamAnalysis } from '@/lib/claude/analyze'
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
