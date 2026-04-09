import { DELTA_ROWS } from '../data/runs'

interface PromptDeltaTableProps {
  /** The config whose row is the current section — shown highlighted */
  highlightConfig: string
  /** Configs visible so far including current — others dimmed */
  visibleConfigs: string[]
}

export default function PromptDeltaTable({ highlightConfig, visibleConfigs }: PromptDeltaTableProps) {
  return (
    <div className="my-4">
      <p className="text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans mb-3">
        Score delta: simple vs complex prompt, by config
      </p>
      <div className="overflow-x-auto">
        <table className="w-full font-sans border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-850">
              <th className="text-left py-2.5 pr-6 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Config</th>
              <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Simple</th>
              <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Complex</th>
              <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Delta</th>
            </tr>
          </thead>
          <tbody>
            {DELTA_ROWS.map((row, i) => {
              const isVisible   = visibleConfigs.includes(row.config)
              const isHighlight = row.config === highlightConfig
              const dimmed = !isVisible ? 'opacity-0' : isHighlight ? '' : 'opacity-50'
              return (
                <tr
                  key={row.config}
                  className={`${i % 2 === 0 ? 'bg-stone-100/50 dark:bg-stone-850/20' : ''} ${isHighlight ? 'ring-1 ring-inset ring-crimson/30' : ''} transition-opacity ${dimmed}`}
                >
                  <td className={`py-2.5 pr-6 font-medium ${isHighlight ? 'text-ink dark:text-white' : 'text-stone-600 dark:text-stone-400'}`}>
                    {row.config}
                  </td>
                  <td className="py-2.5 px-4 text-center text-stone-500">{isVisible ? row.simpleScore : '—'}</td>
                  <td className="py-2.5 px-4 text-center text-stone-500">{isVisible ? row.complexScore : '—'}</td>
                  <td className="py-2.5 px-4 text-center">
                    {isVisible ? (
                      <span className={`font-semibold ${row.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {row.delta}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
