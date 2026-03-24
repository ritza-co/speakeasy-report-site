interface ToolCall {
  name: string
  count: number
  category: 'mcp' | 'write' | 'read' | 'run' | 'other'
}

interface AgentRun {
  label: string
  promptStyle: 'vague' | 'precise'
  tools: ToolCall[]
}

interface AgentActivityProps {
  runs: AgentRun[]
}

const CATEGORY_STYLES: Record<ToolCall['category'], { bg: string; text: string; border: string }> = {
  mcp:   { bg: 'bg-emerald-50 dark:bg-emerald-950/40',  text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  write: { bg: 'bg-blue-50 dark:bg-blue-950/40',        text: 'text-blue-700 dark:text-blue-400',       border: 'border-blue-200 dark:border-blue-800' },
  read:  { bg: 'bg-stone-50 dark:bg-stone-900/60',      text: 'text-stone-600 dark:text-stone-400',     border: 'border-stone-200 dark:border-stone-700' },
  run:   { bg: 'bg-amber-50 dark:bg-amber-950/40',      text: 'text-amber-700 dark:text-amber-400',     border: 'border-amber-200 dark:border-amber-800' },
  other: { bg: 'bg-stone-50 dark:bg-stone-900/60',      text: 'text-stone-500 dark:text-stone-500',     border: 'border-stone-200 dark:border-stone-700' },
}


function ToolBadge({ tool }: { tool: ToolCall }) {
  const style = CATEGORY_STYLES[tool.category]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border ${style.bg} ${style.text} ${style.border}`}
    >
      {tool.name}
      {tool.count > 1 && (
        <span className="font-sans font-semibold opacity-70">×{tool.count}</span>
      )}
    </span>
  )
}

export default function AgentActivity({ runs }: AgentActivityProps) {
  return (
    <div className="space-y-0 my-4">
      {runs.map((run, i) => (
        <div
          key={run.label}
          className={`border-t border-stone-200 dark:border-stone-800 py-4 ${i === runs.length - 1 ? 'border-b' : ''}`}
        >
          <p className={`text-[10px] uppercase tracking-widest font-sans mb-3 ${run.promptStyle === 'vague' ? 'text-stone-400' : 'text-crimson'}`}>
            {run.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {run.tools.map(tool => (
              <ToolBadge key={tool.name} tool={tool} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
