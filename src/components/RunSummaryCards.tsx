interface RunCard {
  label: string
  score: string
  turns: number
  cacheRead: string
  keyMiss: string
}

interface RunSummaryCardsProps {
  runs: RunCard[]
}

export default function RunSummaryCards({ runs }: RunSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      {runs.map((run, i) => (
        <div
          key={run.label}
          className={`border p-5 space-y-3 ${
            i === 0
              ? 'border-stone-200 dark:border-stone-850 bg-white/40 dark:bg-stone-900/40'
              : 'border-crimson/30 bg-white/40 dark:bg-stone-900/40'
          }`}
        >
          <p className={`text-[10px] uppercase tracking-widest font-sans ${i === 0 ? 'text-stone-600 dark:text-stone-400' : 'text-crimson'}`}>
            {run.label}
          </p>
          <div className="flex gap-6">
            <div>
              <p className="font-serif text-2xl font-bold text-ink dark:text-white">{run.score}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans mt-0.5">score</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-ink dark:text-white">{run.turns}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans mt-0.5">actions</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-ink dark:text-white">{run.cacheRead}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans mt-0.5">cache read</p>
            </div>
          </div>
          <div className="border-t border-stone-200 dark:border-stone-850 pt-3">
            <p className="text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans mb-1">Key miss</p>
            <p className="text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed font-sans">{run.keyMiss}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
