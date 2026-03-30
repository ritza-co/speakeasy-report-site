import { useState } from 'react'

const WEB_SEARCH_CODE = `// Web-search agent — final index.ts
// SDK downgraded to v4. Uses ToolExecutionError catch pattern.

import { generateText, tool, ToolExecutionError } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

type ToolCallResult =
  | { toolCallId: string; toolName: string; args: unknown;
      errored: true;  errorMessage: string }
  | { toolCallId: string; toolName: string; args: unknown;
      errored: false; result: unknown };

async function callWithErroringTool(): Promise<ToolCallResult> {
  try {
    const result = await generateText({
      model: anthropic("claude-haiku-4-5-20251001"),
      tools: {
        alwaysErrors: tool({
          description: "A tool that always throws an error.",
          parameters: z.object({
            input: z.string().describe("Any input string"),
          }),
          execute: async (): Promise<string> => {
            throw new Error("This tool always fails intentionally.");
          },
        }),
      },
      toolChoice: { type: "tool", toolName: "alwaysErrors" },
      prompt: "Use the alwaysErrors tool with any input.",
    });

    for (const step of result.steps) {
      for (const toolResult of step.toolResults) {
        return {
          toolCallId: toolResult.toolCallId,
          toolName:   toolResult.toolName,
          args:       toolResult.args,
          errored:    false,
          result:     toolResult.result,
        };
      }
    }
    throw new Error("No tool result found in response.");

  } catch (err) {
    if (ToolExecutionError.isInstance(err)) {
      return {
        toolCallId:   err.toolCallId,
        toolName:     err.toolName,
        args:         err.toolArgs,
        errored:      true,
        errorMessage: err.cause instanceof Error
          ? err.cause.message
          : String(err.cause),
      };
    }
    throw err;
  }
}`

const MCP_CODE = `// MCP agent — final index.ts
// Stays on SDK v6. Uses step.content loop pattern from docs.

import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { zodSchema } from "@ai-sdk/provider-utils";

export type ToolCallResult =
  | { errored: false; text: string }
  | { errored: true;  text: string; errorMessage: string };

export async function callWithErroringTool(): Promise<ToolCallResult> {
  const result = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    tools: {
      alwaysErrors: {
        description: "A tool that always throws an error when called.",
        inputSchema: zodSchema(z.object({})),
        execute: async (): Promise<string> => {
          throw new Error("This tool always fails.");
        },
      },
    },
    toolChoice: { type: "tool", toolName: "alwaysErrors" },
    prompt: "Call the alwaysErrors tool.",
  });

  for (const step of result.steps) {
    for (const part of step.content) {
      if (part.type === "tool-error") {
        const errorMessage =
          part.error instanceof Error
            ? part.error.message
            : String(part.error);
        return { errored: true, text: result.text, errorMessage };
      }
    }
  }

  return { errored: false, text: result.text };
}`

type Tab = 'web' | 'mcp'

export default function CodeComparison() {
  const [active, setActive] = useState<Tab>('web')

  const TABS: { id: Tab; label: string; note: string }[] = [
    { id: 'web', label: 'Web-search agent',    note: 'Downgraded to SDK v4 · ToolExecutionError catch' },
    { id: 'mcp', label: 'MCP agent',           note: 'Stays on SDK v6 · step.content loop' },
  ]

  return (
    <div className="my-6 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
      {/* tab bar */}
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
              active === tab.id ? 'text-ink dark:text-white' : 'text-stone-400'
            }`}>
              {tab.label}
            </span>
            <span className="text-[11px] text-stone-400 font-sans">{tab.note}</span>
          </button>
        ))}
      </div>

      {/* code */}
      <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed font-mono text-ink dark:text-stone-200 bg-white dark:bg-stone-950 m-0">
        <code>{active === 'web' ? WEB_SEARCH_CODE : MCP_CODE}</code>
      </pre>
    </div>
  )
}
