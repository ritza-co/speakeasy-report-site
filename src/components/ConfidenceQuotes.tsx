interface Quote {
  condition: string
  quote: string
  reality: string
  accurate: boolean
}

const QUOTES: Quote[] = [
  {
    condition: 'Web-only',
    quote: 'All files use @ai-sdk/openai as the provider and the SDK v6 APIs (Output.object, toUIMessageStreamResponse, tool, useChat).',
    reality: 'Two of the four files used incorrect patterns. The agent did not know.',
    accurate: false,
  },
  {
    condition: 'SDK-only',
    quote: 'handleChatRequest reads messages from the request body, passes them to streamText, and returns a streaming text/plain response via .toTextStreamResponse().',
    reality: 'Both the response method and the missing conversion step were wrong. The summary described the code as if it were correct.',
    accurate: false,
  },
  {
    condition: 'MCP-explicit',
    quote: 'Uses UIMessage[] from the request body, converts to ModelMessage[] via convertToModelMessages, calls streamText, and returns toUIMessageStreamResponse().',
    reality: 'Accurate. The agent described exactly what it implemented and why.',
    accurate: true,
  },
]

export default function ConfidenceQuotes() {
  return (
    <div className="my-6 space-y-0">
      {QUOTES.map((q, i) => (
        <div
          key={i}
          className={`py-4 border-t border-stone-200 dark:border-stone-800 ${i === QUOTES.length - 1 ? 'border-b' : ''}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <p className="text-[11px] tracking-[0.2em] uppercase font-sans font-medium text-stone-500 dark:text-stone-400">
              {q.condition}
            </p>
            <span className={`text-[10px] font-sans px-1.5 py-0.5 rounded ${q.accurate ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'}`}>
              {q.accurate ? 'Accurate' : 'Incorrect'}
            </span>
          </div>
          <blockquote className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1 text-[13px] text-stone-500 dark:text-stone-400 italic font-sans leading-relaxed mb-2">
            "{q.quote}"
          </blockquote>
          <p className="text-[12px] text-stone-400 dark:text-stone-500 font-sans leading-relaxed">
            {q.reality}
          </p>
        </div>
      ))}
    </div>
  )
}
