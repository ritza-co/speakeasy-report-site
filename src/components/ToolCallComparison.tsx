import ToolCallSequence from './ToolCallSequence'

const GIST_WEB = 'https://gisthost.github.io/?11281b85c534e01889c90d43494eb871/page-001.html'
const GIST_MCP = 'https://gisthost.github.io/?c992aee978ca1d6110de1c342f53a549/page-001.html'

const WEB_SEARCH_CALLS = [
  {
    tool: 'Agent (web search)',
    description: 'Search web for Vercel AI SDK tool error handling',
    outcome: 'neutral' as const,
    href: `${GIST_WEB}#msg-0001`,
  },
  {
    tool: 'Write',
    description: 'Write initial index.ts using tool() + try/catch pattern',
    outcome: 'neutral' as const,
    href: `${GIST_WEB}#msg-0018`,
  },
  {
    tool: 'Bash',
    description: 'Run index.ts — fails: input_schema.type field required',
    outcome: 'failed' as const,
    href: `${GIST_WEB}#msg-0020`,
  },
  {
    tool: 'Bash ×4',
    description: 'Inspect node_modules: zod schema output, ai version, zod version, zodSchema wrapper',
    outcome: 'neutral' as const,
    href: `${GIST_WEB}#msg-0025`,
  },
  {
    tool: 'Bash',
    description: 'Run again with zodSchema fix — still fails, input property stripped',
    outcome: 'failed' as const,
    href: `${GIST_WEB}#msg-0050`,
  },
  {
    tool: 'Bash',
    description: 'Downgrade: npm install ai@4 @ai-sdk/anthropic@1 zod@3',
    outcome: 'failed' as const,
    href: `${GIST_WEB}#msg-0055`,
  },
  {
    tool: 'Edit',
    description: 'Rewrite for SDK v4: tool() + parameters + ToolExecutionError catch',
    outcome: 'neutral' as const,
    href: `${GIST_WEB}#msg-0059`,
  },
  {
    tool: 'Bash',
    description: 'Run on v4 — works',
    outcome: 'found' as const,
    href: `${GIST_WEB}#msg-0063`,
  },
]

const MCP_CALLS = [
  {
    tool: 'Agent (search_docs)',
    description: 'Look up tool error handling in Vercel AI SDK v6 docs',
    outcome: 'found' as const,
    href: `${GIST_MCP}#msg-0004`,
  },
  {
    tool: 'Write',
    description: 'Write index.ts using inputSchema + step.content loop',
    outcome: 'neutral' as const,
    href: `${GIST_MCP}#msg-0012`,
  },
  {
    tool: 'Bash (tsc)',
    description: 'Type-check — two issues: lib config + tool() overload with never return',
    outcome: 'neutral' as const,
    href: `${GIST_MCP}#msg-0015`,
  },
  {
    tool: 'Bash ×6',
    description: 'Inspect node_modules types to understand tool() overload resolution',
    outcome: 'neutral' as const,
    href: `${GIST_MCP}#msg-0018`,
  },
  {
    tool: 'Edit',
    description: 'Fix: use inline tool object (inputSchema) instead of tool() helper',
    outcome: 'neutral' as const,
    href: `${GIST_MCP}#msg-0044`,
  },
  {
    tool: 'Bash (tsc)',
    description: 'Type-check — index.ts clean, only node_modules noise remaining',
    outcome: 'found' as const,
    href: `${GIST_MCP}#msg-0046`,
  },
]

export default function ToolCallComparison() {
  return (
    <div className="my-6 space-y-4">
      <div className="flex flex-wrap gap-4 text-[12px] font-sans text-stone-600 dark:text-stone-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
          correct API or working result
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          error or wrong decision
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-stone-300 dark:bg-stone-600 inline-block" />
          intermediate step
        </span>
        <span className="text-stone-600 dark:text-stone-400 italic">Each step links to the full transcript</span>
      </div>
      <div className="flex gap-8 flex-col md:flex-row">
        <ToolCallSequence label="Web-search agent" calls={WEB_SEARCH_CALLS} />
        <ToolCallSequence label="MCP agent" calls={MCP_CALLS} />
      </div>
    </div>
  )
}
