type Agent = 'web' | 'mcp'
type Highlight = 'red' | 'green' | 'none'

interface CodeLine {
  text: string
  highlight?: Highlight
}

const WEB_INITIAL: CodeLine[] = [
  { text: '// Web-search agent — initial index.ts' },
  { text: '' },
  { text: 'import { generateText, tool } from "ai";' },
  { text: 'import { anthropic } from "@ai-sdk/anthropic";' },
  { text: 'import { z } from "zod";' },
  { text: '' },
  { text: 'async function callWithErroringTool() {' },
  { text: '  try {' },
  { text: '    const result = await generateText({' },
  { text: '      model: anthropic("claude-haiku-4-5-20251001"),' },
  { text: '      tools: {' },
  { text: '        alwaysErrors: tool({' },
  { text: '          description: "A tool that always throws an error.",' },
  { text: '          parameters: z.object({          // v4 field name — renamed to inputSchema in v5', highlight: 'red' },
  { text: '            input: z.string(),' },
  { text: '          }),' },
  { text: '          execute: async (): Promise<string> => {' },
  { text: '            throw new Error("This tool always fails.");' },
  { text: '          },' },
  { text: '        }),' },
  { text: '      },' },
  { text: '      toolChoice: { type: "tool", toolName: "alwaysErrors" },' },
  { text: '      prompt: "Use the alwaysErrors tool with any input.",' },
  { text: '    });' },
  { text: '    return { success: true };  // always succeeds — SDK captures tool errors', highlight: 'red' },
  { text: '                               // in step.content, never re-throws to caller' },
  { text: '  } catch (err) {              // this catch never sees a tool error' },
  { text: '    return { success: false, error: err instanceof Error ? err.message : String(err) };' },
  { text: '  }' },
  { text: '}' },
]

const MCP_INITIAL: CodeLine[] = [
  { text: '// MCP agent — initial index.ts' },
  { text: '' },
  { text: 'import { generateText } from "ai";' },
  { text: 'import { anthropic } from "@ai-sdk/anthropic";' },
  { text: 'import { z } from "zod";' },
  { text: 'import { zodSchema } from "@ai-sdk/provider-utils";' },
  { text: '' },
  { text: 'export async function callWithErroringTool() {' },
  { text: '  const result = await generateText({' },
  { text: '    model: anthropic("claude-sonnet-4-6"),' },
  { text: '    tools: {' },
  { text: '      alwaysErrors: {' },
  { text: '        description: "A tool that always throws an error when called.",' },
  { text: '        inputSchema: zodSchema(z.object({})),   // docs use z.object() directly' },
  { text: '        execute: async (): Promise<string> => {' },
  { text: '          throw new Error("This tool always fails.");' },
  { text: '        },' },
  { text: '      },' },
  { text: '    },' },
  { text: '    toolChoice: { type: "tool", toolName: "alwaysErrors" },' },
  { text: '    prompt: "Call the alwaysErrors tool.",' },
  { text: '    maxSteps: 1,' },
  { text: '  });' },
  { text: '' },
  { text: '  for (const step of result.steps) {' },
  { text: '    for (const part of step.content) {   // step.content loop — correct', highlight: 'green' },
  { text: '      if (part.type === "tool-result" && part.isError) {  // wrong — type is "tool-error"', highlight: 'red' },
  { text: '        return { errored: true, errorMessage: "tool error" };' },
  { text: '      }' },
  { text: '    }' },
  { text: '  }' },
  { text: '  return { errored: false, text: result.text };' },
  { text: '}' },
]

const NOTES: Record<Agent, string> = {
  web: 'First draft — parameters (v4) · try/catch pattern',
  mcp: 'First draft — inputSchema correct · tool-error filter slightly off',
}

const LINE_STYLES: Record<Highlight, string> = {
  green: 'bg-emerald-50 dark:bg-emerald-950',
  red:   'bg-red-50 dark:bg-red-950',
  none:  '',
}

interface Props {
  agent: Agent
}

export default function InitialCodeViewer({ agent }: Props) {
  const lines = agent === 'web' ? WEB_INITIAL : MCP_INITIAL

  return (
    <div className="my-6 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <span className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold">
          First draft
        </span>
        <span className="text-[11px] text-stone-600 dark:text-stone-400 font-sans">{NOTES[agent]}</span>
      </div>
      <div className="overflow-x-auto bg-white dark:bg-stone-950 p-4">
        <pre className="text-[12px] leading-relaxed font-mono m-0 bg-transparent">
          {lines.map((line, i) => {
            const hl = line.highlight ?? 'none'
            return (
              <div key={i} className={`-mx-4 px-4 ${LINE_STYLES[hl]}`}>
                <code className={
                  hl === 'green' ? 'text-emerald-800 dark:text-emerald-200' :
                  hl === 'red'   ? 'text-red-800 dark:text-red-200' :
                  'text-ink dark:text-stone-200'
                }>
                  {line.text || '\u00A0'}
                </code>
              </div>
            )
          })}
        </pre>
      </div>
    </div>
  )
}
