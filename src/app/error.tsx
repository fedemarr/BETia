'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="max-w-lg text-center space-y-4">
        <p className="text-slate-400 text-sm">Error de la aplicación</p>
        <pre className="text-red-400 font-mono text-xs bg-slate-800 p-4 rounded-xl text-left overflow-auto max-h-64 border border-red-500/30">
          {error.message}
          {error.stack ? `\n\n${error.stack}` : ''}
        </pre>
        <button
          onClick={reset}
          className="px-4 py-2 bg-green-500 text-black rounded-lg text-sm font-medium"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
