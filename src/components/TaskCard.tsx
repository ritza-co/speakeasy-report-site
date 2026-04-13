export default function TaskCard() {
  return (
    <div className="my-6 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold">
          Task prompt — identical across all conditions
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="text-[14px] font-mono text-ink dark:text-stone-200 leading-relaxed whitespace-pre-wrap">
          {`I'm building a small TypeScript utility using the Vercel AI SDK.

I need a function that calls an AI model with a tool attached. The tool should always throw an error when the model tries to use it. The function should force the model to use the tool, then detect whether the tool errored and return the result — including the error message if there was one.

You have web search available. Use it to look up how the Vercel AI SDK handles tool errors before writing any code.`}
        </p>
      </div>
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex gap-6">
        <span className="text-[12px] text-stone-600 dark:text-stone-400 font-sans">
          <span className="font-semibold text-ink dark:text-white">Model:</span> Claude Sonnet 4.6
        </span>
        <span className="text-[12px] text-stone-600 dark:text-stone-400 font-sans">
          <span className="font-semibold text-ink dark:text-white">Date:</span> 30 March 2026
        </span>
      </div>
    </div>
  )
}
