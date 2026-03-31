interface PromptCardsProps {
  simple: string
  complexIntro: string
  complexSteps: string[]
  complexOutro: string
}

export default function PromptCards({ simple, complexIntro, complexSteps, complexOutro }: PromptCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      <div className="border border-stone-200 dark:border-stone-850 bg-white/50 dark:bg-stone-900/50 p-5">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-3 font-sans">
          Simple prompt
        </p>
        <p className="text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed font-sans italic">
          "{simple}"
        </p>
      </div>
      <div className="border border-crimson/30 bg-white/50 dark:bg-stone-900/50 p-5">
        <p className="text-[10px] uppercase tracking-widest text-crimson mb-3 font-sans">
          Complex prompt
        </p>
        <div className="text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed font-sans italic space-y-2">
          <p>"{complexIntro}"</p>
          <ol className="list-decimal pl-5 space-y-1 not-italic">
            {complexSteps.map((step, i) => (
              <li key={i} className="italic">{step}</li>
            ))}
          </ol>
          <p>{complexOutro}"</p>
        </div>
      </div>
    </div>
  )
}
