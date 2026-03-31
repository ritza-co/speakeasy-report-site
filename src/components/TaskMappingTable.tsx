const MAPPINGS = [
  {
    requirement: '"returns a structured object containing a list of tags and a confidence score"',
    pattern: 'generateText + Output.object()',
    note: 'generateObject no longer exists in v6',
  },
  {
    requirement: '"stream the response back to the caller"',
    pattern: 'toUIMessageStreamResponse()',
    note: 'toDataStreamResponse() is the old v4 method',
  },
  {
    requirement: '"read a conversation history from the request body"',
    pattern: 'convertToModelMessages(messages)',
    note: 'UI messages must be converted before passing to streamText',
  },
  {
    requirement: '"each message can contain multiple pieces of content — text, images, or other types"',
    pattern: 'message.parts[]',
    note: 'message.content is the v4 string field, replaced by parts array',
  },
  {
    requirement: '"return whether the tool failed, include the error message"',
    pattern: 'steps[n].content — tool-error parts',
    note: 'try/catch does not catch tool errors in v6; they appear as content parts',
  },
]

export default function TaskMappingTable() {
  return (
    <div className="my-4 space-y-0">
      {MAPPINGS.map((row, i) => (
        <div
          key={i}
          className={`grid grid-cols-[1fr_auto_1fr] items-start gap-4 py-3 px-0 border-t border-stone-200 dark:border-stone-800 ${i === MAPPINGS.length - 1 ? 'border-b' : ''}`}
        >
          <p className="text-[13px] text-stone-500 dark:text-stone-400 italic font-sans leading-snug">
            {row.requirement}
          </p>
          <span className="text-stone-300 dark:text-stone-700 font-sans text-[16px] select-none mt-0.5">→</span>
          <div>
            <p className="text-[13px] font-semibold text-ink dark:text-white font-mono leading-snug">
              {row.pattern}
            </p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 font-sans mt-0.5">
              {row.note}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
