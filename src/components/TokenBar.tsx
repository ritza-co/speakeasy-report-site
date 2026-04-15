import { ALL_RUNS } from '../data/runs'

interface TokenBarProps {
  /** IDs of runs visible so far — all others are shown dimmed */
  visibleIds: string[]
  /** IDs of the current section's runs — shown fully highlighted */
  highlightIds: string[]
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

const MAX_TOTAL = Math.max(...ALL_RUNS.map(r => r.cacheRead))

export default function TokenBar({ visibleIds, highlightIds }: TokenBarProps) {
  const BAR_HEIGHT = 160 // px — total height of the bar area

  return (
    <div className="my-4">
      <p className="text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans mb-4">
        Tokens used
      </p>

      {/* Legend */}
      <div className="flex gap-5 mb-4 text-[10px] font-sans text-stone-600 dark:text-stone-400">
        <span><span className="inline-block w-2.5 h-2.5 bg-stone-300 dark:bg-stone-700 mr-1.5 align-middle" />Cache read</span>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2" style={{ height: BAR_HEIGHT + 56 }}>
        {ALL_RUNS.map(run => {
          const isVisible   = visibleIds.includes(run.id)
          const isHighlight = highlightIds.includes(run.id)
          const cacheH  = Math.round((run.cacheRead / MAX_TOTAL) * BAR_HEIGHT)

          const opacity = !isVisible ? 'opacity-0' : isHighlight ? 'opacity-100' : 'opacity-50'

          return (
            <div key={run.id} className={`flex flex-col items-center flex-1 transition-opacity duration-300 ${opacity}`}>
              {/* Total token label */}
              <div className="text-[10px] text-stone-600 dark:text-stone-400 font-sans mb-1 text-center">
                {isVisible ? fmt(run.cacheRead) : ''}
              </div>

              {/* Bar */}
              <div className="w-full flex flex-col justify-end" style={{ height: BAR_HEIGHT }}>
                <div
                  className="w-full bg-stone-300 dark:bg-stone-700"
                  style={{ height: cacheH }}
                  title={`Cache read: ${fmt(run.cacheRead)}`}
                />
              </div>

              {/* Label */}
              <div className="mt-2 text-center space-y-0.5">
                <div className="text-[10px] text-stone-500 font-sans leading-tight">{run.prompt}</div>
                <div className="text-[9px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans leading-tight">{run.config}</div>
                {isVisible && (
                  <div className="text-[9px] text-stone-600 dark:text-stone-400 font-sans">{run.turns}a</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
