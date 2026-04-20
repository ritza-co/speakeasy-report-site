interface CodeComparison {
  label: string
  produced: string
  correct: string
  docUrl: string
  docLabel: string
  isMatch?: boolean
}

interface ConfidenceEntry {
  condition: string
  accurate: boolean
  summaryLine: string
  analysis: string
  comparisons: CodeComparison[]
}

const ENTRIES: ConfidenceEntry[] = [
  {
    condition: 'Web-only',
    accurate: false,
    summaryLine: 'callWithFailingTool() defines a tool whose execute always throws, instructs the model to use it via toolChoice: "required", and returns { succeeded: false, errorMessage: "..." } when caught.',
    analysis: 'The agent fetched the error handling docs and found the try/catch pattern — which is correct for schema errors. But the same page goes on to explain that tool execution errors work differently. The agent stopped reading before that part. The function it produced returns success every time, no matter what the tool does.',
    comparisons: [
      {
        label: 'Tool error detection',
        produced:
`try {
  await generateText({ ... })
  return { succeeded: true }
} catch (err) {
  return { succeeded: false, errorMessage: err.message }
}`,
        correct:
`const { steps } = await generateText({ ... })
const toolErrors = steps.flatMap(step =>
  step.content.filter(p => p.type === 'tool-error')
)
if (toolErrors.length > 0) {
  return { success: false, error: toolErrors[0].error.message }
}`,
        docUrl: 'https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling',
        docLabel: 'Tool calling — error handling',
      },
    ],
  },
  {
    condition: 'SDK-only',
    accurate: false,
    summaryLine: 'handleChatRequest reads messages from the request body, passes them to streamText, and returns a streaming text/plain response via .toTextStreamResponse().',
    analysis: 'The agent inspected the type definitions and compared two response methods it already knew about — both from the previous version of the SDK. It picked one and moved on. The correct method is a third one it never looked for. The message conversion step is not visible in the types at all — it only appears in the documentation that shows a complete route handler. The agent never fetched that page.',
    comparisons: [
      {
        label: 'Stream response method',
        produced:
`return result.toTextStreamResponse()`,
        correct:
`return result.toUIMessageStreamResponse()`,
        docUrl: 'https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot',
        docLabel: 'Chatbot — route handler',
      },
      {
        label: 'Message conversion',
        produced:
`const { messages } = await request.json()
const result = streamText({
  model: openai('gpt-4o-mini'),
  messages,
})`,
        correct:
`const { messages }: { messages: UIMessage[] } = await req.json()
const result = streamText({
  model: openai('gpt-4o-mini'),
  messages: await convertToModelMessages(messages),
})`,
        docUrl: 'https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot',
        docLabel: 'Chatbot — route handler',
      },
    ],
  },
  {
    condition: 'SDK + MCP',
    accurate: true,
    summaryLine: 'Uses UIMessage[] from the request body, converts to ModelMessage[] via convertToModelMessages, calls streamText, and returns toUIMessageStreamResponse().',
    analysis: 'The summary matches the code exactly. The agent queried the docs before writing each file, so when it described what it built, it was describing something it had already verified.',
    comparisons: [
      {
        label: 'Complete route handler',
        produced:
`import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request): Promise<Response> {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: await convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}`,
        correct:
`import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request): Promise<Response> {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: await convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}`,
        docUrl: 'https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot',
        docLabel: 'Chatbot — route handler',
        isMatch: true,
      },
    ],
  },
]

export default function ConfidenceComparison() {
  return (
    <div className="my-6 space-y-12">
      {ENTRIES.map((entry, i) => (
        <div key={i} className="border-t border-stone-200 dark:border-stone-800 pt-6">
          {/* Condition + badge */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[11px] tracking-[0.2em] uppercase font-sans font-medium text-stone-600 dark:text-stone-400">
              {entry.condition}
            </p>
            <span className={`text-[10px] font-sans px-1.5 py-0.5 rounded ${entry.accurate ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'}`}>
              {entry.accurate ? 'Accurate' : 'Incorrect'}
            </span>
          </div>

          {/* Framing prose */}
          <p className="text-[15px] text-stone-700 dark:text-stone-300 leading-relaxed mb-3">
            The agent closed its session with this summary:
          </p>

          {/* Verbatim quote */}
          <blockquote className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1 text-[13px] text-stone-600 dark:text-stone-400 italic font-sans leading-relaxed mb-4">
            "{entry.summaryLine}"
          </blockquote>

          {/* Analysis prose */}
          <p className="text-[15px] text-stone-700 dark:text-stone-300 leading-relaxed mb-5">
            {entry.analysis}
          </p>

          {/* Code comparisons */}
          {entry.comparisons.map((comp, j) => (
            <div key={j} className="mt-4">
              <p className="text-[11px] tracking-[0.15em] uppercase text-stone-600 dark:text-stone-400 font-sans mb-2">{comp.label}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className={`text-[10px] tracking-[0.2em] uppercase font-sans mb-1 ${comp.isMatch ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-400'}`}>
                    What the agent wrote
                  </p>
                  <pre className={`text-[11px] font-mono bg-stone-100 dark:bg-stone-900 px-3 py-3 rounded leading-relaxed overflow-x-auto whitespace-pre-wrap ${comp.isMatch ? 'text-ink dark:text-white' : 'text-stone-600 dark:text-stone-400'}`}>{comp.produced}</pre>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-500 font-sans mb-1">
                    Correct v6 pattern
                  </p>
                  <pre className="text-[11px] font-mono bg-stone-100 dark:bg-stone-900 text-ink dark:text-white px-3 py-3 rounded leading-relaxed overflow-x-auto whitespace-pre-wrap">{comp.correct}</pre>
                </div>
              </div>
              <p className="text-[12px] text-stone-600 dark:text-stone-400 font-sans mt-2">
                See the{' '}
                <a
                  href={comp.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                >
                  {comp.docLabel}
                </a>
                {' '}page in the Vercel AI SDK docs.
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
