import TOC from './TOC'
import Section from './Section'
import TaskCard from './TaskCard'
import ToolCallSequence from './ToolCallSequence'
import InitialCodeViewer from './InitialCodeViewer'
import CodeComparison from './CodeComparison'
import DocReferences from './DocReferences'
import EntireSessionLink from './EntireSessionLink'
import ReportSeriesLinks from './ReportSeriesLinks'
import { useScrollSpy } from '../hooks/useScrollSpy'

const SECTIONS = [
  { id: 'context',    label: 'Is web search enough?' },
  { id: 'web-agent',  label: 'Agent with web search' },
  { id: 'mcp-agent',  label: 'Agent with documentation access' },
  { id: 'conclusion', label: 'What changes with better context' },
]

const GIST_WEB = 'https://gisthost.github.io/?11281b85c534e01889c90d43494eb871/page-001.html'
const GIST_MCP = 'https://gisthost.github.io/?c992aee978ca1d6110de1c342f53a549/page-001.html'

const WEB_FIRST_CALLS = [
  {
    tool: 'Agent (web search)',
    description: 'Search web for Vercel AI SDK tool error handling',
    outcome: 'neutral' as const,
    href: `${GIST_WEB}#msg-0001`,
  },
  {
    tool: 'Write',
    description: 'Write initial index.ts — tool() with parameters key, try/catch pattern',
    outcome: 'neutral' as const,
    href: `${GIST_WEB}#msg-0018`,
  },
  {
    tool: 'Bash',
    description: 'Run index.ts — fails: input_schema.type field required',
    outcome: 'failed' as const,
    href: `${GIST_WEB}#msg-0020`,
  },
]

const WEB_DEBUG_CALLS = [
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

const MCP_FIRST_CALLS = [
  {
    tool: 'Agent (search_docs)',
    description: 'Look up tool error handling in Vercel AI SDK v6 docs',
    outcome: 'found' as const,
    href: `${GIST_MCP}#msg-0004`,
  },
  {
    tool: 'Write',
    description: 'Write index.ts — inputSchema + step.content loop',
    outcome: 'neutral' as const,
    href: `${GIST_MCP}#msg-0012`,
  },
  {
    tool: 'Bash (tsc)',
    description: 'Type-check — two issues: lib config + tool() overload with never return',
    outcome: 'neutral' as const,
    href: `${GIST_MCP}#msg-0015`,
  },
]

const MCP_DEBUG_CALLS = [
  {
    tool: 'Bash ×6',
    description: 'Inspect node_modules types to understand tool() overload resolution',
    outcome: 'neutral' as const,
    href: `${GIST_MCP}#msg-0018`,
  },
  {
    tool: 'Edit',
    description: 'Fix: inline tool object with inputSchema instead of tool() helper',
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

const WEB_DOCS = [
  {
    label: 'Migration guide: parameters → inputSchema (v4 to v5)',
    href: 'https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0#tool-definition-changes-parameters--inputschema',
    note: 'Documents the rename of the tool field name that the web-search agent used.',
  },
  {
    label: 'Migration guide: ToolExecutionError removed (v4 to v5)',
    href: 'https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0#tool-execution-error-handling',
    note: 'Documents the removal of ToolExecutionError and introduction of tool-error content parts.',
  },
  {
    label: 'Tool calling: handling errors',
    href: 'https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling#handling-errors',
    note: 'Shows the current pattern: step.content.filter(part => part.type === "tool-error").',
  },
]

const MCP_DOCS = [
  {
    label: 'Tool calling: inputSchema field',
    href: 'https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling',
    note: 'Defines inputSchema as the field for tool input parameters (using z.object() directly, not zodSchema()).',
  },
  {
    label: 'Tool calling: steps and step.content',
    href: 'https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling#steps',
    note: 'Documents the steps property and how to iterate over step content.',
  },
  {
    label: 'Tool calling: handling errors',
    href: 'https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling#handling-errors',
    note: 'Confirms tool-error as the content part type and .error as the property for the thrown error.',
  },
]

function OutputBlock({ label, output }: { label: string; output: string }) {
  return (
    <div className="my-6">
      <div className="text-[11px] font-sans font-semibold text-stone-400 uppercase tracking-wide mb-1">{label}</div>
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        <pre className="text-[12px] leading-relaxed font-mono m-0 bg-stone-950 dark:bg-stone-950 text-stone-200 p-4 overflow-x-auto">{output}</pre>
      </div>
    </div>
  )
}

interface GuideArticleProps {
  onNavigate: (tab: 'resend' | 'vercel') => void
}

export default function GuideArticle({ onNavigate }: GuideArticleProps) {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <>
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px]">

        {/* ─── CONTEXT ─── */}
        <Section
          id="context"
          chapterLabel="The problem"
          headline="Is web search enough context for AI agents?"
          subheadline="A look at what happens when an AI agent encounters a recently updated SDK"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              AI agents generate code from two sources: their training data and whatever context arrives in the prompt. The quality of that output depends on the quality of both. For developers using agents today, the practical question is what good context looks like and how to get it in reliably.
            </p>
            <p>
              Web search is the obvious answer and it does improve things. But for APIs and SDKs that update frequently, training data often contains outdated patterns. Web search helps, but it has its own reliability problems. Results vary, agents don't always apply what they find, and once an agent is mid-session debugging a failed run it rarely goes back to re-read documentation it found earlier.
            </p>
            <p>
              This article looks at a specific case: two agents given the same task against a recently updated SDK. One has web search. The other has web search plus an MCP server exposing the SDK's current documentation directly. We look at what each agent produces, where things go wrong, and why the outcomes differ.
            </p>
            <p className="text-[13px] text-stone-500 dark:text-stone-500 border-l-2 border-stone-200 dark:border-stone-700 pl-4">
              Both sessions were run against live APIs with real tool calls. Code, tool call sequences, and full transcripts are in public GitHub repositories (links throughout this article).
            </p>
          </div>
        </Section>

        {/* ─── WEB AGENT ─── */}
        <Section
          id="web-agent"
          chapterLabel="Condition 1"
          headline="Agent with web search"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              The Vercel AI SDK has gone through several major versions with breaking changes. Tool definition field names were renamed across versions. The error class for handling tool failures was removed and replaced with a different pattern. An agent working from training data alone may have learned any of these generations without knowing which is current.
            </p>
            <p>
              The task given to both agents targets this area directly: tool error handling.
            </p>

            <TaskCard />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              First pass
            </h3>
            <p>
              The agent searches for Vercel AI SDK tool error handling before writing anything. It finds relevant documentation and writes an initial implementation.
            </p>

            <div className="my-6">
              <ToolCallSequence label="Web-search agent — first pass" calls={WEB_FIRST_CALLS} />
            </div>

            <p>
              The initial code uses field names and error-handling patterns from an older version of the SDK. The code always returns success, regardless of whether the tool threw.
            </p>

            <InitialCodeViewer agent="web" />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              Debugging and the downgrade decision
            </h3>
            <p>
              When the code fails with a schema validation error, the agent digs through node_modules internals trying to resolve it. After two failed attempts, it takes a different path. It downgrades the entire SDK to v4, where its training data is reliable, and rewrites the implementation to match.
            </p>

            <div className="my-6">
              <ToolCallSequence label="Web-search agent — debugging" calls={WEB_DEBUG_CALLS} />
            </div>

            <p>
              The downgraded code runs, but the project is now on an older SDK version the developer didn't ask for, using an error-handling pattern that was removed two major versions ago.
            </p>

            <OutputBlock
              label="Output"
              output={`{
  "toolCallId": "toolu_0127yV4xp7qBzc1m4wgCFerY",
  "toolName": "alwaysErrors",
  "args": { "input": "test" },
  "errored": true,
  "errorMessage": "This tool always fails intentionally."
}`}
            />

            <p>
              The output looks correct. Nothing here signals a problem. But the project is now pinned to SDK v4, and any further code the agent produces in this session will be written against v4 patterns that no longer exist in the current version.
            </p>

            <EntireSessionLink
              label="Web-search agent — full session transcript"
              transcriptHref="https://gisthost.github.io/?11281b85c534e01889c90d43494eb871/index.html"
              repoHref="https://github.com/jamesdanielwhitford/tool-error-web-only"
            />

            <DocReferences refs={WEB_DOCS} />
          </div>
        </Section>

        {/* ─── MCP AGENT ─── */}
        <Section
          id="mcp-agent"
          chapterLabel="Condition 2"
          headline="Agent with documentation access"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              The second agent has the same task, same model, and web search, plus an MCP server exposing the current Vercel AI SDK v6 documentation. It can query the documentation at any point in the session, not just at the start.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              First pass
            </h3>
            <p>
              The agent queries the docs before writing anything, finds the current tool error handling section, and produces an implementation that uses the right field names and the right approach. The first draft is close but not quite right.
            </p>

            <div className="my-6">
              <ToolCallSequence label="MCP agent — first pass" calls={MCP_FIRST_CALLS} />
            </div>

            <InitialCodeViewer agent="mcp" />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              Debugging and the type check fix
            </h3>
            <p>
              The agent hits a TypeScript type error and works through it by inspecting the type definitions. The approach to error handling stays intact throughout.
            </p>

            <div className="my-6">
              <ToolCallSequence label="MCP agent — debugging" calls={MCP_DEBUG_CALLS} />
            </div>

            <p>
              The final code correctly identifies and surfaces tool errors, matching what the current documentation shows.
            </p>

            <OutputBlock
              label="Output"
              output={`{
  "errored": true,
  "text": "",
  "errorMessage": "This tool always fails."
}`}
            />

            <EntireSessionLink
              label="MCP agent — full session transcript"
              transcriptHref="https://gisthost.github.io/?c992aee978ca1d6110de1c342f53a549/index.html"
              repoHref="https://github.com/jamesdanielwhitford/tool-error-mcp"
            />

            <DocReferences refs={MCP_DOCS} />
          </div>
        </Section>

        {/* ─── CONCLUSION ─── */}
        <Section
          id="conclusion"
          chapterLabel="Takeaway"
          headline="What changes with better context"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              Both agents hit errors and kept working, but they made different decisions when their first approach failed. The web-search agent, unable to resolve the schema error with the documentation it had read, changed the environment to match what it knew by downgrading to an older version. The MCP agent, with access to the current docs throughout the session, fixed the code and stayed on the current version.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white mt-6 mb-3">
              Final outputs
            </h3>
            <p>
              Both agents produced code that runs, but the difference is in what version each is running and whether the error-handling approach matches what the current SDK actually expects.
            </p>

            <CodeComparison />

            <p>
              The outputs look identical in shape: both report <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">errored: true</code> and surface the error message. Nothing in either output signals that one agent silently downgraded the SDK. A developer reviewing the terminal output would have no reason to check the <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">package.json</code>, and future code produced in the same session would continue to use v4 patterns that no longer work on the current SDK.
            </p>
            <p>
              The web-search agent found accurate documentation in its first tool call, but reading docs early in a session doesn't guarantee the agent applies that information correctly when debugging later. The MCP agent had a way to consult the documentation at the moment it needed it, not just at session start, and that produced the different result.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white mt-6 mb-3">
              Where this fits in a larger picture
            </h3>
            <p>
              The reports below run the same question across multiple tasks and APIs, with scored results. If you're building systems where agents write code against libraries that change, the reports show how documentation access affects outcomes at scale.
            </p>

            <ReportSeriesLinks onNavigate={onNavigate} />
          </div>
        </Section>

      </main>
    </>
  )
}
