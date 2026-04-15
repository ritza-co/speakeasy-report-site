type Highlight = 'amber' | 'green' | 'none'

interface CodeLine {
  text: string
  highlight?: Highlight
}

interface Example {
  condition: string
  result: 'fail' | 'partial' | 'pass'
  file: string
  intro: string
  analysis: string
  producedLabel: string
  correctLabel: string
  produced: CodeLine[]
  correct: CodeLine[]
  docUrl: string
  docLabel: string
}

const EXAMPLES: Example[] = [
  {
    condition: 'Web-only',
    result: 'fail',
    file: 'tool-errors.ts',
    intro: 'The agent searched for how tool errors work and found the right documentation page. That page shows two patterns: try/catch for schema errors, and inspecting step results for execution errors. The agent read the first half and stopped.',
    analysis: 'The code wraps the call in try/catch. That catches the wrong class of error. Tool execution failures don\'t throw — they appear in the results the SDK returns. The function always returns success.',
    producedLabel: 'What the agent wrote',
    correctLabel: 'Correct v6 pattern',
    produced: [
      { text: 'try {' },
      { text: '  await generateText({' },
      { text: '    model: openai("gpt-4o"),' },
      { text: '    tools: { alwaysFailingTool },' },
      { text: '    toolChoice: "required",' },
      { text: '    prompt: "Please use the alwaysFailingTool.",' },
      { text: '  });' },
      { text: '  return { succeeded: true };' },
      { text: '} catch (err) {', highlight: 'amber' },
      { text: '  return { succeeded: false, errorMessage: err.message };', highlight: 'amber' },
      { text: '}', highlight: 'amber' },
    ],
    correct: [
      { text: 'const { steps } = await generateText({' },
      { text: '  model: openai(\'gpt-4o-mini\'),' },
      { text: '  tools: { alwaysFails },' },
      { text: '  prompt: \'Please use the alwaysFails tool.\',' },
      { text: '});' },
      { text: '' },
      { text: 'const toolErrors = steps.flatMap(step =>' },
      { text: '  step.content.filter(part => part.type === \'tool-error\'),', highlight: 'green' },
      { text: ');' },
      { text: '' },
      { text: 'if (toolErrors.length > 0) {' },
      { text: '  return { success: false, error: toolErrors[0].error.message };' },
      { text: '}' },
      { text: 'return { success: true };' },
    ],
    docUrl: 'https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling',
    docLabel: 'Tool calling — error handling',
  },
  {
    condition: 'SDK-only',
    result: 'fail',
    file: 'structured.ts',
    intro: 'The agent inspected the installed type definitions before writing. It found generateObject in the exports, saw a valid function signature, and used it. There is no deprecation marker in the types — nothing to signal the function had been replaced.',
    analysis: 'The old function still exists in v6. It compiles, it runs, and it returns results. The types alone give no reason to prefer anything else. The agent looked carefully at the right place and still got the wrong answer.',
    producedLabel: 'What the agent wrote',
    correctLabel: 'Correct v6 pattern',
    produced: [
      { text: 'import { generateObject } from "ai";', highlight: 'amber' },
      { text: '' },
      { text: 'export async function extractTags(text: string) {' },
      { text: '  const { object } = await generateObject({', highlight: 'amber' },
      { text: '    model: openai("gpt-4o-mini"),' },
      { text: '    schema,' },
      { text: '    prompt: `Extract tags from: ${text}`,' },
      { text: '  });' },
      { text: '  return object;', highlight: 'amber' },
      { text: '}' },
    ],
    correct: [
      { text: 'import { generateText, Output } from \'ai\';', highlight: 'green' },
      { text: '' },
      { text: 'export async function extractTags(text: string) {' },
      { text: '  const { output } = await generateText({', highlight: 'green' },
      { text: '    model: openai(\'gpt-4o-mini\'),' },
      { text: '    output: Output.object({ schema }),', highlight: 'green' },
      { text: '    prompt: `Extract tags from: ${text}`,' },
      { text: '  });' },
      { text: '  return output;', highlight: 'green' },
      { text: '}' },
    ],
    docUrl: 'https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data',
    docLabel: 'Generating structured data',
  },
  {
    condition: 'SDK + MCP',
    result: 'pass',
    file: 'chat-route.ts',
    intro: 'Before writing this file, the agent queried the docs MCP server for the route handler pattern. The documentation page it retrieved showed convertToModelMessages and toUIMessageStreamResponse together in a single example. Neither web search nor type inspection surfaces convertToModelMessages — it has no visible connection to the streamText signature.',
    analysis: 'The code is correct because the agent saw the complete pattern before writing it. Without the docs, this function is not discoverable. It only exists in the documentation.',
    producedLabel: 'What the agent wrote',
    correctLabel: 'Correct v6 pattern',
    produced: [
      { text: '// identical to correct pattern', highlight: 'green' },
      { text: 'import { streamText, UIMessage, convertToModelMessages } from \'ai\';' },
      { text: '' },
      { text: 'export async function POST(req: Request): Promise<Response> {' },
      { text: '  const { messages }: { messages: UIMessage[] } = await req.json();' },
      { text: '' },
      { text: '  const result = streamText({' },
      { text: '    model: openai(\'gpt-4o-mini\'),' },
      { text: '    messages: await convertToModelMessages(messages),' },
      { text: '  });' },
      { text: '' },
      { text: '  return result.toUIMessageStreamResponse();' },
      { text: '}' },
    ],
    correct: [
      { text: 'import { streamText, UIMessage, convertToModelMessages } from \'ai\';' },
      { text: '' },
      { text: 'export async function POST(req: Request): Promise<Response> {' },
      { text: '  const { messages }: { messages: UIMessage[] } = await req.json();' },
      { text: '' },
      { text: '  const result = streamText({' },
      { text: '    model: openai(\'gpt-4o-mini\'),' },
      { text: '    messages: await convertToModelMessages(messages),' },
      { text: '  });' },
      { text: '' },
      { text: '  return result.toUIMessageStreamResponse();' },
      { text: '}' },
    ],
    docUrl: 'https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot',
    docLabel: 'Chatbot — route handler',
  },
]

const RESULT_BADGE: Record<string, { label: string; className: string }> = {
  pass:    { label: 'Pass',    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' },
  partial: { label: 'Partial', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400' },
  fail:    { label: 'Fail',    className: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400' },
}

const LINE_HIGHLIGHT: Record<Highlight, { bg: string; text: string }> = {
  amber: { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-800 dark:text-amber-200' },
  green: { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-800 dark:text-emerald-200' },
  none:  { bg: '', text: '' },
}

function CodeBlock({ lines, defaultTextClass }: { lines: CodeLine[]; defaultTextClass: string }) {
  return (
    <pre className="text-[11px] font-mono bg-stone-100 dark:bg-stone-900 px-3 py-3 rounded leading-relaxed overflow-x-auto">
      {lines.map((line, i) => {
        const hl = line.highlight ?? 'none'
        const { bg, text } = LINE_HIGHLIGHT[hl]
        return (
          <div key={i} className={`-mx-3 px-3 ${bg}`}>
            <code className={hl !== 'none' ? text : defaultTextClass}>
              {line.text || '\u00A0'}
            </code>
          </div>
        )
      })}
    </pre>
  )
}

export default function CorrectnessExamples() {
  return (
    <div className="my-6 space-y-12">
      {EXAMPLES.map((ex, i) => (
        <div key={i} className="border-t border-stone-200 dark:border-stone-800 pt-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[11px] tracking-[0.2em] uppercase font-sans font-medium text-stone-600 dark:text-stone-400">
              {ex.condition}
            </p>
            <span className={`text-[10px] font-sans px-1.5 py-0.5 rounded ${RESULT_BADGE[ex.result].className}`}>
              {RESULT_BADGE[ex.result].label}
            </span>
            <span className="text-[11px] font-mono text-stone-600 dark:text-stone-400">{ex.file}</span>
          </div>

          {/* Intro */}
          <p className="text-[15px] text-stone-700 dark:text-stone-300 leading-relaxed mb-3">
            {ex.intro}
          </p>

          {/* Code comparison */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className={`text-[10px] tracking-[0.2em] uppercase font-sans mb-1 ${ex.result === 'pass' ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-400'}`}>
                {ex.producedLabel}
              </p>
              <CodeBlock
                lines={ex.produced}
                defaultTextClass={ex.result === 'pass' ? 'text-ink dark:text-white' : 'text-stone-600 dark:text-stone-400'}
              />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-500 font-sans mb-1">
                {ex.correctLabel}
              </p>
              <CodeBlock
                lines={ex.correct}
                defaultTextClass="text-ink dark:text-white"
              />
            </div>
          </div>

          {/* Analysis */}
          <p className="text-[13px] text-stone-600 dark:text-stone-400 font-sans leading-relaxed mb-2">
            {ex.analysis}
          </p>

          {/* Doc link */}
          <p className="text-[12px] text-stone-600 dark:text-stone-400 font-sans">
            See the{' '}
            <a
              href={ex.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
            >
              {ex.docLabel}
            </a>
            {' '}page in the Vercel AI SDK docs.
          </p>
        </div>
      ))}
    </div>
  )
}
