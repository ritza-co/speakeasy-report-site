interface DocRef {
  label: string
  href: string
  note: string
}

interface DocReferencesProps {
  refs: DocRef[]
}

export default function DocReferences({ refs }: DocReferencesProps) {
  return (
    <div className="my-6 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold">
          Vercel AI SDK documentation
        </span>
      </div>
      <ul className="divide-y divide-stone-100 dark:divide-stone-800">
        {refs.map((ref, i) => (
          <li key={i} className="flex items-start gap-4 px-4 py-3">
            <div className="flex-1 min-w-0">
              <a
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-sans font-medium text-crimson underline underline-offset-2 hover:opacity-75"
              >
                {ref.label}
              </a>
              <p className="text-[12px] text-stone-500 dark:text-stone-400 font-sans mt-0.5">
                {ref.note}
              </p>
            </div>
            <span className="text-[11px] text-stone-300 dark:text-stone-600 font-sans mt-0.5 flex-shrink-0">↗</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
