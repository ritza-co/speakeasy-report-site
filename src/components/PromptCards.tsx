interface PromptCardsProps {
  simple: string
  complexIntro: string
  complexSteps: string[]
  complexOutro: string
}

export default function PromptCards({ simple, complexIntro, complexSteps, complexOutro }: PromptCardsProps) {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <span className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold">
            Simple prompt
          </span>
        </div>
        <div className="px-4 py-4 space-y-3">
          <p className="text-[13px] font-mono text-ink dark:text-stone-200 leading-relaxed">{simple}</p>
        </div>
      </div>
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <span className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold">
            Complex prompt
          </span>
        </div>
        <div className="px-4 py-4 space-y-3">
          <p className="text-[13px] font-mono text-ink dark:text-stone-200 leading-relaxed">{complexIntro}</p>
          <ol className="list-decimal pl-5 space-y-1">
            {complexSteps.map((step, i) => (
              <li key={i} className="text-[13px] font-mono text-ink dark:text-stone-200 leading-relaxed">{step}</li>
            ))}
          </ol>
          <p className="text-[13px] font-mono text-ink dark:text-stone-200 leading-relaxed">{complexOutro}</p>
        </div>
      </div>
    </div>
  )
}
