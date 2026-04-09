interface TestEnvironmentCardProps {
  model?: string
  date?: string
}

export default function TestEnvironmentCard({
  model = 'Claude Sonnet 4.6',
  date  = '27 March 2026',
}: TestEnvironmentCardProps) {
  const FIELDS = [
    { label: 'Model', value: model },
    { label: 'Date',  value: date  },
  ]

  return (
    <div className="my-6 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
      {FIELDS.map((field, i) => (
        <div
          key={i}
          className="grid grid-cols-[140px_1fr] border-b border-stone-200 dark:border-stone-800 last:border-b-0"
        >
          <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900">
            <span className="text-[12px] font-semibold text-stone-600 dark:text-stone-400 font-sans uppercase tracking-wide">
              {field.label}
            </span>
          </div>
          <div className="px-4 py-2.5">
            <span className="text-[13px] text-ink dark:text-white font-sans">
              {field.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
