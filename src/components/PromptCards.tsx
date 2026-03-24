interface PromptCardsProps {
  vague: string
  preciseIntro: string
  preciseSteps: string[]
  preciseOutro: string
}

export default function PromptCards({ vague, preciseIntro, preciseSteps, preciseOutro }: PromptCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      <div className="border border-stone-200 dark:border-stone-850 bg-white/50 dark:bg-stone-900/50 p-5">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-3 font-sans">
          Vague prompt
        </p>
        <p className="text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed font-sans italic">
          "{vague}"
        </p>
      </div>
      <div className="border border-crimson/30 bg-white/50 dark:bg-stone-900/50 p-5">
        <p className="text-[10px] uppercase tracking-widest text-crimson mb-3 font-sans">
          Precise prompt
        </p>
        <div className="text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed font-sans italic space-y-2">
          <p>"{preciseIntro}"</p>
          <ol className="list-decimal pl-5 space-y-1 not-italic">
            {preciseSteps.map((step, i) => (
              <li key={i} className="italic">{step}</li>
            ))}
          </ol>
          <p>{preciseOutro}"</p>
        </div>
      </div>
    </div>
  )
}
