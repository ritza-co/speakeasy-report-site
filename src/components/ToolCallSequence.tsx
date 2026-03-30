interface ToolCall {
  tool: string
  description: string
  outcome?: 'found' | 'failed' | 'neutral'
}

interface ToolCallSequenceProps {
  label: string
  calls: ToolCall[]
}

const OUTCOME_STYLES: Record<string, string> = {
  found:   'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  failed:  'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  neutral: 'bg-stone-50 dark:bg-stone-900 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800',
}

const OUTCOME_DOTS: Record<string, string> = {
  found:   'bg-emerald-400',
  failed:  'bg-red-400',
  neutral: 'bg-stone-300 dark:bg-stone-600',
}

export default function ToolCallSequence({ label, calls }: ToolCallSequenceProps) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold mb-3">
        {label}
      </p>
      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-stone-200 dark:bg-stone-800" />
        <div className="space-y-2">
          {calls.map((call, i) => {
            const outcome = call.outcome ?? 'neutral'
            return (
              <div key={i} className="flex gap-3 items-start">
                <div className={`mt-[6px] w-[15px] h-[15px] rounded-full border-2 border-white dark:border-black flex-shrink-0 z-10 ${OUTCOME_DOTS[outcome]}`} />
                <div className={`flex-1 border rounded px-3 py-2 text-[12px] font-sans ${OUTCOME_STYLES[outcome]}`}>
                  <span className="font-mono font-semibold">{call.tool}</span>
                  {' '}
                  <span className="opacity-75">{call.description}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
