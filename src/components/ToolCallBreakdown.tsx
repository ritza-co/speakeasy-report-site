interface ToolCall {
  name: string
  category: 'research' | 'mcp' | 'inspect' | 'write' | 'setup'
  count: number
}

interface Condition {
  label: string
  total: number
  calls: ToolCall[]
}

const CONDITIONS: Condition[] = [
  {
    label: 'Web-only',
    total: 6,
    calls: [
      { name: 'Web research (subagent)', category: 'research', count: 1 },
      { name: 'File writes',             category: 'write',    count: 4 },
      { name: 'Setup',                   category: 'setup',    count: 1 },
    ],
  },
  {
    label: 'SDK-only',
    total: 9,
    calls: [
      { name: 'Exploration subagents',   category: 'research', count: 2 },
      { name: 'Type inspection',         category: 'inspect',  count: 2 },
      { name: 'File writes',             category: 'write',    count: 4 },
      { name: 'Setup',                   category: 'setup',    count: 1 },
    ],
  },
  {
    label: 'SDK + MCP',
    total: 37,
    calls: [
      { name: 'MCP doc searches',        category: 'mcp',      count: 4 },
      { name: 'MCP doc fetches',         category: 'mcp',      count: 4 },
      { name: 'Type inspection',         category: 'inspect',  count: 19 },
      { name: 'File writes',             category: 'write',    count: 4 },
      { name: 'Setup / other',           category: 'setup',    count: 6 },
    ],
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  research: 'bg-blue-400 dark:bg-blue-600',
  mcp:      'bg-violet-500 dark:bg-violet-600',
  inspect:  'bg-amber-400 dark:bg-amber-500',
  write:    'bg-emerald-500 dark:bg-emerald-600',
  setup:    'bg-stone-300 dark:bg-stone-600',
}

const CATEGORY_LABELS: Record<string, string> = {
  research: 'Web research',
  mcp:      'MCP queries',
  inspect:  'Type inspection',
  write:    'File writes',
  setup:    'Setup / other',
}

export default function ToolCallBreakdown() {
  const maxTotal = Math.max(...CONDITIONS.map(c => c.total))

  return (
    <div className="my-6 space-y-6">
      {CONDITIONS.map((condition) => (
        <div key={condition.label}>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[13px] font-semibold text-ink dark:text-white font-sans">{condition.label}</p>
            <p className="text-[12px] text-stone-600 dark:text-stone-400 font-sans">{condition.total} tool calls</p>
          </div>

          {/* Stacked bar */}
          <div className="flex h-5 rounded overflow-hidden w-full mb-2" style={{ maxWidth: `${(condition.total / maxTotal) * 100}%` }}>
            {condition.calls.map((call, i) => (
              <div
                key={i}
                className={`${CATEGORY_COLORS[call.category]} h-full`}
                style={{ width: `${(call.count / condition.total) * 100}%` }}
                title={`${call.name}: ${call.count}`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            {condition.calls.map((call, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-sm flex-shrink-0 ${CATEGORY_COLORS[call.category]}`} />
                <span className="text-[11px] text-stone-600 dark:text-stone-400 font-sans">
                  {call.name} ({call.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Legend key */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 pt-3 border-t border-stone-200 dark:border-stone-800">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${CATEGORY_COLORS[key]}`} />
            <span className="text-[11px] text-stone-600 dark:text-stone-400 font-sans">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
