type Score = 'pass' | 'partial' | 'fail'

interface Row {
  file: string
  description: string
  webOnly: Score
  sdkOnly: Score
  mcpExplicit: Score
}

const ROWS: Row[] = [
  {
    file: 'structured.ts',
    description: 'Structured output',
    webOnly: 'pass',
    sdkOnly: 'fail',
    mcpExplicit: 'pass',
  },
  {
    file: 'chat-route.ts',
    description: 'Streaming chat route',
    webOnly: 'partial',
    sdkOnly: 'fail',
    mcpExplicit: 'pass',
  },
  {
    file: 'ChatUI.tsx',
    description: 'Chat UI component',
    webOnly: 'pass',
    sdkOnly: 'pass',
    mcpExplicit: 'pass',
  },
  {
    file: 'tool-errors.ts',
    description: 'Tool error handling',
    webOnly: 'fail',
    sdkOnly: 'partial',
    mcpExplicit: 'pass',
  },
]

const TOTALS = [
  { label: 'Web-only', score: '2.5 / 4' },
  { label: 'SDK-only', score: '1.5 / 4' },
  { label: 'SDK + MCP', score: '4 / 4' },
]

const BADGE: Record<Score, { label: string; className: string }> = {
  pass:    { label: 'Pass',    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' },
  partial: { label: 'Partial', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400' },
  fail:    { label: 'Fail',    className: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400' },
}

function Badge({ score }: { score: Score }) {
  const { label, className } = BADGE[score]
  return (
    <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded font-sans ${className}`}>
      {label}
    </span>
  )
}

export default function CorrectnessScorecard() {
  return (
    <div className="my-6">
      {/* Header */}
      <div className="grid grid-cols-[1fr_100px_100px_100px] gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-sans">File</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-sans text-center">Web-only</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-sans text-center">SDK-only</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-sans text-center">SDK + MCP</p>
      </div>

      {/* Rows */}
      {ROWS.map((row, i) => (
        <div
          key={i}
          className={`grid grid-cols-[1fr_100px_100px_100px] gap-2 items-center py-3 border-b border-stone-200 dark:border-stone-800`}
        >
          <div>
            <p className="text-[13px] font-mono text-ink dark:text-white">{row.file}</p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 font-sans mt-0.5">{row.description}</p>
          </div>
          <div className="flex justify-center"><Badge score={row.webOnly} /></div>
          <div className="flex justify-center"><Badge score={row.sdkOnly} /></div>
          <div className="flex justify-center"><Badge score={row.mcpExplicit} /></div>
        </div>
      ))}

      {/* Totals */}
      <div className="grid grid-cols-[1fr_100px_100px_100px] gap-2 items-center pt-3">
        <p className="text-[11px] text-stone-400 font-sans uppercase tracking-widest">Total</p>
        {TOTALS.map((t) => (
          <p key={t.label} className="text-[13px] font-semibold text-ink dark:text-white font-sans text-center">
            {t.score}
          </p>
        ))}
      </div>
    </div>
  )
}
