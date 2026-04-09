const CHANGES = [
  {
    label: 'Structured output',
    before: 'generateObject({ schema })',
    after: 'generateText({ output: Output.object({ schema }) })',
    note: 'generateObject removed; Output.object is now the pattern',
  },
  {
    label: 'Streaming response',
    before: 'result.toDataStreamResponse()',
    after: 'result.toUIMessageStreamResponse()',
    note: 'New response format aligned with UIMessage shape',
  },
  {
    label: 'Message format',
    before: 'message.content  // string',
    after: 'message.parts    // array of typed parts',
    note: 'Content field replaced by parts array across UI and server',
  },
  {
    label: 'Passing messages to model',
    before: 'streamText({ messages })',
    after: 'streamText({ messages: convertToModelMessages(messages) })',
    note: 'New conversion step required before sending UI messages',
  },
]

export default function SdkChangesTable() {
  return (
    <div className="my-6 space-y-0">
      {CHANGES.map((row, i) => (
        <div
          key={i}
          className={`grid grid-cols-1 gap-2 py-4 px-0 border-t border-stone-200 dark:border-stone-800 ${i === CHANGES.length - 1 ? 'border-b' : ''}`}
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-crimson font-sans font-medium">
            {row.label}
          </p>
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 mt-1">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-stone-600 dark:text-stone-400 font-sans mb-1">Before (v4)</p>
              <code className="block text-[12px] font-mono bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 px-3 py-2 rounded leading-relaxed">
                {row.before}
              </code>
            </div>
            <span className="text-stone-300 dark:text-stone-700 font-sans text-[16px] select-none mt-6">→</span>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-stone-600 dark:text-stone-400 font-sans mb-1">After (v6)</p>
              <code className="block text-[12px] font-mono bg-stone-100 dark:bg-stone-900 text-ink dark:text-white px-3 py-2 rounded leading-relaxed">
                {row.after}
              </code>
            </div>
          </div>
          <p className="text-[12px] text-stone-600 dark:text-stone-400 font-sans mt-1">{row.note}</p>
        </div>
      ))}
    </div>
  )
}
