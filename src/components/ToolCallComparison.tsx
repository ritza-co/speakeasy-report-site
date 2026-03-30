import ToolCallSequence from './ToolCallSequence'

const WEB_SEARCH_CALLS = [
  { tool: 'Agent (Explore)',  description: 'Search web for Vercel AI SDK tool error handling',         outcome: 'neutral' as const },
  { tool: 'Write',            description: 'Write initial index.ts using tool() + try/catch pattern',  outcome: 'neutral' as const },
  { tool: 'Bash',             description: 'Run index.ts — fails: input_schema.type required',         outcome: 'failed' as const },
  { tool: 'Bash',             description: 'Inspect zod schema output to debug schema issue',          outcome: 'neutral' as const },
  { tool: 'Bash',             description: 'Check ai package version — finds v6 installed',            outcome: 'neutral' as const },
  { tool: 'Bash',             description: 'Inspect node_modules/ai internals for zodSchema wrapper',  outcome: 'neutral' as const },
  { tool: 'Bash',             description: 'Inspect @ai-sdk/anthropic version',                       outcome: 'neutral' as const },
  { tool: 'Bash',             description: 'Downgrade: npm install ai@4 @ai-sdk/anthropic@1 zod@3',   outcome: 'failed' as const },
  { tool: 'Edit',             description: 'Rewrite for SDK v4: tool() + parameters + ToolExecutionError catch', outcome: 'neutral' as const },
  { tool: 'Bash',             description: 'Run index.ts — works on v4',                              outcome: 'found' as const },
]

const MCP_CALLS = [
  { tool: 'Agent (Explore)',  description: 'search_docs: tool error handling in Vercel AI SDK v6',     outcome: 'found' as const },
  { tool: 'Write',            description: 'Write index.ts using inputSchema + step.content loop',     outcome: 'neutral' as const },
  { tool: 'Bash (tsc)',       description: 'Type-check — two issues found: lib config + tool overload', outcome: 'neutral' as const },
  { tool: 'Bash',             description: 'Inspect node_modules to understand tool() overload issue', outcome: 'neutral' as const },
  { tool: 'Edit',             description: 'Fix: use inline tool object instead of tool() helper',     outcome: 'neutral' as const },
  { tool: 'Bash (tsc)',       description: 'Type-check — index.ts clean, only node_modules noise',     outcome: 'found' as const },
]

export default function ToolCallComparison() {
  return (
    <div className="my-6 space-y-2">
      <div className="flex gap-3 mb-4 text-[12px] font-sans text-stone-500 dark:text-stone-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> correct API or working result</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> error or wrong decision</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-stone-600 inline-block" /> intermediate step</span>
      </div>
      <div className="flex gap-8 flex-col md:flex-row">
        <ToolCallSequence label="Web-search agent" calls={WEB_SEARCH_CALLS} />
        <ToolCallSequence label="MCP agent" calls={MCP_CALLS} />
      </div>
    </div>
  )
}
