type Score = 'Yes' | 'Partial' | 'No'

interface ConceptRow {
  concept: string
  scores: Score[]
}

interface ConceptScoreTableProps {
  columns: string[]
  rows: ConceptRow[]
  scores?: { label: string; value: string }[]
}

function ScoreCell({ score }: { score: Score }) {
  const styles: Record<Score, string> = {
    Yes:     'bg-emerald-50  dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
    Partial: 'bg-amber-50    dark:bg-amber-950/40   text-amber-700  dark:text-amber-400',
    No:      'bg-red-50      dark:bg-red-950/40     text-red-700    dark:text-red-400',
  }
  return (
    <td className={`py-2.5 px-4 text-center text-[12px] font-medium font-sans ${styles[score]}`}>
      {score}
    </td>
  )
}

export default function ConceptScoreTable({ columns, rows, scores }: ConceptScoreTableProps) {
  return (
    <div className="my-4 space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full font-sans border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-850">
              <th className="text-left py-2.5 pr-6 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">
                Concept
              </th>
              {columns.map(col => (
                <th key={col} className="py-2.5 px-4 text-center text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal min-w-[110px]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.concept} className={i % 2 === 0 ? 'bg-stone-100/50 dark:bg-stone-850/20' : ''}>
                <td className="py-2.5 pr-6 text-stone-600 dark:text-stone-400 text-[13px]">
                  {row.concept}
                </td>
                {row.scores.map((score, j) => (
                  <ScoreCell key={j} score={score} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {scores && (
        <div className="flex gap-4 pt-1">
          {scores.map(s => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans">{s.label}</span>
              <span className="font-serif text-lg font-bold text-ink dark:text-white">{s.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
