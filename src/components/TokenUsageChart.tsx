interface Category {
  label: string
  tokens: number
  color: string
  darkColor: string
}

interface Condition {
  label: string
  total: number
  categories: Category[]
}

const MAX_CONTEXT = 200000

const CONDITIONS: Condition[] = [
  {
    label: 'Web-only',
    total: 23000,
    categories: [
      { label: 'Messages',       tokens: 6400,  color: 'bg-crimson',         darkColor: 'bg-crimson' },
      { label: 'System tools',   tokens: 8300,  color: 'bg-stone-400',       darkColor: 'bg-stone-500' },
      { label: 'System prompt',  tokens: 6100,  color: 'bg-stone-300',       darkColor: 'bg-stone-600' },
      { label: 'Memory files',   tokens: 2100,  color: 'bg-stone-200',       darkColor: 'bg-stone-700' },
      { label: 'Skills',         tokens: 476,   color: 'bg-stone-100',       darkColor: 'bg-stone-800' },
    ],
  },
  {
    label: 'SDK-only',
    total: 28000,
    categories: [
      { label: 'Messages',       tokens: 10900, color: 'bg-crimson',         darkColor: 'bg-crimson' },
      { label: 'System tools',   tokens: 8300,  color: 'bg-stone-400',       darkColor: 'bg-stone-500' },
      { label: 'System prompt',  tokens: 6100,  color: 'bg-stone-300',       darkColor: 'bg-stone-600' },
      { label: 'Memory files',   tokens: 2100,  color: 'bg-stone-200',       darkColor: 'bg-stone-700' },
      { label: 'Skills',         tokens: 476,   color: 'bg-stone-100',       darkColor: 'bg-stone-800' },
    ],
  },
  {
    label: 'SDK + MCP',
    total: 48000,
    categories: [
      { label: 'Messages',       tokens: 30700, color: 'bg-crimson',         darkColor: 'bg-crimson' },
      { label: 'System tools',   tokens: 8300,  color: 'bg-stone-400',       darkColor: 'bg-stone-500' },
      { label: 'System prompt',  tokens: 6200,  color: 'bg-stone-300',       darkColor: 'bg-stone-600' },
      { label: 'Memory files',   tokens: 2100,  color: 'bg-stone-200',       darkColor: 'bg-stone-700' },
      { label: 'Skills',         tokens: 476,   color: 'bg-stone-100',       darkColor: 'bg-stone-800' },
      { label: 'MCP tools',      tokens: 486,   color: 'bg-violet-400',      darkColor: 'bg-violet-600' },
    ],
  },
]

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export default function TokenUsageChart() {
  return (
    <div className="my-6 space-y-6">
      {CONDITIONS.map((c) => (
        <div key={c.label}>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[13px] font-semibold text-ink dark:text-white font-sans">{c.label}</p>
            <p className="text-[11px] text-stone-400 font-sans">
              {fmt(c.total)} / 200k &nbsp;·&nbsp; {Math.round((c.total / MAX_CONTEXT) * 100)}% of limit
            </p>
          </div>

          {/* Stacked bar, scaled to max context */}
          <div
            className="flex h-5 rounded overflow-hidden bg-stone-100 dark:bg-stone-900"
          >
            <div
              className="flex h-full rounded overflow-hidden"
              style={{ width: `${(c.total / MAX_CONTEXT) * 100}%` }}
            >
              {c.categories.map((cat, i) => (
                <div
                  key={i}
                  className={`${cat.color} dark:${cat.darkColor} h-full flex-shrink-0`}
                  style={{ width: `${(cat.tokens / c.total) * 100}%` }}
                  title={`${cat.label}: ${fmt(cat.tokens)}`}
                />
              ))}
            </div>
          </div>

          {/* Per-category legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {c.categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-sm flex-shrink-0 ${cat.color} dark:${cat.darkColor}`} />
                <span className="text-[11px] text-stone-400 dark:text-stone-500 font-sans">
                  {cat.label}: {Math.round((cat.tokens / c.total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Callout */}
      <div className="mt-2 border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1">
        <p className="text-[13px] text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
          The fixed overhead — system prompt, system tools, memory files, and skills —
          was identical across all three conditions (~17k tokens). Every difference
          between the bars comes from messages and, in the MCP condition, the two
          loaded MCP tool schemas.
        </p>
      </div>
    </div>
  )
}
