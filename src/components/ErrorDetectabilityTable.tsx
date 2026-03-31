type Detectability = 'compile' | 'runtime' | 'silent'

interface ErrorRow {
  file: string
  condition: string
  error: string
  detectability: Detectability
  why: string
}

const ROWS: ErrorRow[] = [
  {
    file: 'structured.ts',
    condition: 'SDK-only',
    error: 'Uses deprecated generateObject instead of generateText + Output.object',
    detectability: 'silent',
    why: 'generateObject still runs and returns results — just not the preferred v6 path',
  },
  {
    file: 'chat-route.ts',
    condition: 'Web-only',
    error: 'Missing convertToModelMessages — passes UIMessage[] directly to streamText',
    detectability: 'silent',
    why: 'streamText accepts the messages without throwing; output may be malformed',
  },
  {
    file: 'chat-route.ts',
    condition: 'SDK-only',
    error: 'Uses toTextStreamResponse() instead of toUIMessageStreamResponse()',
    detectability: 'silent',
    why: 'Both methods exist and return a Response; client receives wrong stream format',
  },
  {
    file: 'chat-route.ts',
    condition: 'SDK-only',
    error: 'Missing convertToModelMessages',
    detectability: 'silent',
    why: 'Same as web-only — no error thrown, wrong message format passed silently',
  },
  {
    file: 'ChatUI.tsx',
    condition: 'SDK-only',
    error: 'Uses v4 status values ("generating", "waiting") instead of v6 ("submitted", "streaming")',
    detectability: 'silent',
    why: 'Loading indicator never shows — no error, just a UI that appears unresponsive',
  },
  {
    file: 'tool-errors.ts',
    condition: 'Web-only',
    error: 'try/catch around generateText — tool errors are never caught',
    detectability: 'silent',
    why: 'Function always returns { succeeded: true } regardless of tool failure',
  },
  {
    file: 'tool-errors.ts',
    condition: 'SDK-only',
    error: 'Uses parameters key instead of inputSchema in tool definition',
    detectability: 'runtime',
    why: 'Tool definition is invalid — throws at runtime when the tool is invoked',
  },
]

const BADGE: Record<Detectability, { label: string; className: string }> = {
  compile: { label: 'Compile-time', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' },
  runtime: { label: 'Runtime',      className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400' },
  silent:  { label: 'Silent',       className: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400' },
}

function Badge({ type }: { type: Detectability }) {
  const { label, className } = BADGE[type]
  return (
    <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded font-sans whitespace-nowrap ${className}`}>
      {label}
    </span>
  )
}

export default function ErrorDetectabilityTable() {
  return (
    <div className="my-6 space-y-0">
      {/* Header */}
      <div className="grid grid-cols-[80px_90px_1fr_100px] gap-3 pb-2 border-b border-stone-200 dark:border-stone-800">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-sans">File</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-sans">Condition</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-sans">Error</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-sans">Detectability</p>
      </div>

      {ROWS.map((row, i) => (
        <div
          key={i}
          className={`grid grid-cols-[80px_90px_1fr_100px] gap-3 items-start py-3 border-b border-stone-200 dark:border-stone-800`}
        >
          <p className="text-[12px] font-mono text-ink dark:text-white leading-snug">{row.file}</p>
          <p className="text-[12px] text-stone-500 dark:text-stone-400 font-sans leading-snug">{row.condition}</p>
          <div>
            <p className="text-[12px] text-stone-600 dark:text-stone-300 font-sans leading-snug">{row.error}</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 font-sans mt-0.5 leading-snug">{row.why}</p>
          </div>
          <div className="flex justify-start">
            <Badge type={row.detectability} />
          </div>
        </div>
      ))}
    </div>
  )
}
