const MAX_CONTENT_LENGTH = 20_000

export async function fetchOddsFromUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(12_000),
    })

    if (!res.ok) return ''

    const html = await res.text()

    // Extraer JSON embebido en el HTML (window.__INITIAL_STATE__, __NEXT_DATA__, etc.)
    const jsonMatches = [
      html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i),
      html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});\s*<\/script>/i),
      html.match(/window\.__STATE__\s*=\s*({[\s\S]*?});\s*<\/script>/i),
    ]

    for (const match of jsonMatches) {
      if (match?.[1]) {
        try {
          const data = JSON.parse(match[1])
          const str = JSON.stringify(data)
          // Si contiene datos que parecen cuotas (números decimales como 1.80, 2.10, etc.)
          if (/\d\.\d{2}/.test(str)) {
            return `JSON extraído de la página:\n${str.slice(0, MAX_CONTENT_LENGTH)}`
          }
        } catch {}
      }
    }

    // Fallback: extraer texto visible eliminando scripts/styles/tags
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()

    if (cleaned.length < 200) return '' // Probablemente bloqueado

    return cleaned.slice(0, MAX_CONTENT_LENGTH)
  } catch {
    return ''
  }
}

export function isUrl(str: string): boolean {
  return /^https?:\/\/.+/.test(str.trim())
}
