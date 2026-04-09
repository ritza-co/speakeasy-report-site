import { useState } from 'react'

type Highlight = 'red' | 'green' | 'none'

interface CodeLine {
  text: string
  highlight?: Highlight
}

const WEB_FINAL: CodeLine[] = [
  { text: '// Web-search agent — final index.ts' },
  { text: '// SDK downgraded to v4. Uses ToolExecutionError catch pattern.' },
  { text: '' },
  { text: 'import { generateText, tool, ToolExecutionError } from "ai";', highlight: 'red' },
  { text: 'import { anthropic } from "@ai-sdk/anthropic";' },
  { text: 'import { z } from "zod";' },
  { text: '' },
  { text: 'type ToolCallResult =' },
  { text: '  | { toolCallId: string; toolName: string; args: unknown;' },
  { text: '      errored: true;  errorMessage: string }' },
  { text: '  | { toolCallId: string; toolName: string; args: unknown;' },
  { text: '      errored: false; result: unknown };' },
  { text: '' },
  { text: 'async function callWithErroringTool(): Promise<ToolCallResult> {' },
  { text: '  try {' },
  { text: '    const result = await generateText({' },
  { text: '      model: anthropic("claude-haiku-4-5-20251001"),' },
  { text: '      tools: {' },
  { text: '        alwaysErrors: tool({' },
  { text: '          description: "A tool that always throws an error.",' },
  { text: '          parameters: z.object({    // v4 field name — renamed to inputSchema in v5', highlight: 'red' },
  { text: '            input: z.string().describe("Any input string"),' },
  { text: '          }),' },
  { text: '          execute: async (): Promise<string> => {' },
  { text: '            throw new Error("This tool always fails intentionally.");' },
  { text: '          },' },
  { text: '        }),' },
  { text: '      },' },
  { text: '      toolChoice: { type: "tool", toolName: "alwaysErrors" },' },
  { text: '      prompt: "Use the alwaysErrors tool with any input.",' },
  { text: '    });' },
  { text: '' },
  { text: '    for (const step of result.steps) {' },
  { text: '      for (const toolResult of step.toolResults) {   // v4 API', highlight: 'red' },
  { text: '        return {' },
  { text: '          toolCallId: toolResult.toolCallId,' },
  { text: '          toolName:   toolResult.toolName,' },
  { text: '          args:       toolResult.args,' },
  { text: '          errored:    false,' },
  { text: '          result:     toolResult.result,' },
  { text: '        };' },
  { text: '      }' },
  { text: '    }' },
  { text: '    throw new Error("No tool result found in response.");' },
  { text: '' },
  { text: '  } catch (err) {' },
  { text: '    if (ToolExecutionError.isInstance(err)) {   // v4 error class', highlight: 'red' },
  { text: '      return {' },
  { text: '        toolCallId:   err.toolCallId,' },
  { text: '        toolName:     err.toolName,' },
  { text: '        args:         err.toolArgs,' },
  { text: '        errored:      true,' },
  { text: '        errorMessage: err.cause instanceof Error' },
  { text: '          ? err.cause.message' },
  { text: '          : String(err.cause),' },
  { text: '      };' },
  { text: '    }' },
  { text: '    throw err;' },
  { text: '  }' },
  { text: '}' },
]

const MCP_FINAL: CodeLine[] = [
  { text: '// MCP agent — final index.ts' },
  { text: '// Stays on SDK v6. Uses step.content loop pattern from docs.' },
  { text: '' },
  { text: 'import { generateText } from "ai";' },
  { text: 'import { anthropic } from "@ai-sdk/anthropic";' },
  { text: 'import { z } from "zod";' },
  { text: 'import { zodSchema } from "@ai-sdk/provider-utils";  // internal workaround' },
  { text: '' },
  { text: 'export type ToolCallResult =' },
  { text: '  | { errored: false; text: string }' },
  { text: '  | { errored: true;  text: string; errorMessage: string };' },
  { text: '' },
  { text: 'export async function callWithErroringTool(): Promise<ToolCallResult> {' },
  { text: '  const result = await generateText({' },
  { text: '    model: anthropic("claude-sonnet-4-6"),' },
  { text: '    tools: {' },
  { text: '      alwaysErrors: {' },
  { text: '        description: "A tool that always throws an error when called.",' },
  { text: '        inputSchema: zodSchema(z.object({})),   // docs show: inputSchema: z.object({})' },
  { text: '        execute: async (): Promise<string> => {' },
  { text: '          throw new Error("This tool always fails.");' },
  { text: '        },' },
  { text: '      },' },
  { text: '    },' },
  { text: '    toolChoice: { type: "tool", toolName: "alwaysErrors" },' },
  { text: '    prompt: "Call the alwaysErrors tool.",' },
  { text: '  });' },
  { text: '' },
  { text: '  for (const step of result.steps) {' },
  { text: '    for (const part of step.content) {        // v6 API: step.content', highlight: 'green' },
  { text: '      if (part.type === "tool-error") {       // v6 content type', highlight: 'green' },
  { text: '        const errorMessage =' },
  { text: '          part.error instanceof Error' },
  { text: '            ? part.error.message' },
  { text: '            : String(part.error);' },
  { text: '        return { errored: true, text: result.text, errorMessage };' },
  { text: '      }' },
  { text: '    }' },
  { text: '  }' },
  { text: '' },
  { text: '  return { errored: false, text: result.text };' },
  { text: '}' },
]

type Tab = 'web' | 'mcp'

const LINE_STYLES: Record<Highlight, string> = {
  green: 'bg-emerald-50 dark:bg-emerald-950',
  red:   'bg-red-50 dark:bg-red-950',
  none:  '',
}

function CodeBlock({ lines }: { lines: CodeLine[] }) {
  return (
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
  )
}

export default function CodeComparison() {
  const [active, setActive] = useState<Tab>('web')

  const TABS: { id: Tab; label: string; note: string }[] = [
    { id: 'web', label: 'Web-search agent', note: 'Downgraded to SDK v4 · ToolExecutionError catch' },
    { id: 'mcp', label: 'MCP agent',        note: 'Stays on SDK v6 · step.content loop' },
  ]

  return (
    <div className="my-6 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
      <div className="flex border-b border-stone-200 dark:border-stone-800">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex flex-col gap-0.5 px-4 py-3 text-left border-b-2 transition-all ${
              active === tab.id
                ? 'border-crimson bg-white dark:bg-stone-950'
                : 'border-transparent bg-stone-50 dark:bg-stone-900 hover:bg-white dark:hover:bg-stone-950'
            }`}
          >
            <span className={`text-[12px] font-semibold font-sans ${
              active === tab.id ? 'text-ink dark:text-white' : 'text-stone-600 dark:text-stone-400'
            }`}>
              {tab.label}
            </span>
            <span className="text-[11px] text-stone-600 dark:text-stone-400 font-sans">{tab.note}</span>
          </button>
        ))}
      </div>
      <CodeBlock lines={active === 'web' ? WEB_FINAL : MCP_FINAL} />
    </div>
  )
}
