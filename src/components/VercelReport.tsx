import TOC from './TOC'
import Section from './Section'
import SdkChangesTable from './SdkChangesTable'
import TaskMappingTable from './TaskMappingTable'
import CorrectnessScorecard from './CorrectnessScorecard'
import CorrectnessExamples from './CorrectnessExamples'
import ToolCallBreakdown from './ToolCallBreakdown'
import TokenUsageChart from './TokenUsageChart'
import ConfidenceComparison from './ConfidenceComparison'
import TestEnvironmentCard from './TestEnvironmentCard'
import TaskCard from './TaskCard'
import ToolCallSequence from './ToolCallSequence'
import InitialCodeViewer from './InitialCodeViewer'
import CodeComparison from './CodeComparison'
import DocReferences from './DocReferences'
import EntireSessionLink from './EntireSessionLink'
import { useScrollSpy } from '../hooks/useScrollSpy'

const SECTIONS = [
  { id: 'hypothesis',  label: 'Introduction' },
  { id: 'methodology', label: 'How we tested it' },
  { id: 'example',     label: 'What a test run looks like' },
  { id: 'correctness', label: 'Is the code correct?' },
  { id: 'actions',     label: 'How the agent spent its time' },
  { id: 'tokens',      label: 'What it cost' },
  { id: 'confidence',  label: 'How confident did it sound?' },
  { id: 'conclusion',  label: 'Conclusion' },
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
      <div className="text-[11px] font-sans font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wide mb-1">{label}</div>
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        <pre className="text-[12px] leading-relaxed font-mono m-0 bg-stone-950 dark:bg-stone-950 text-stone-200 p-4 overflow-x-auto">{output}</pre>
      </div>
    </div>
  )
}

export default function VercelReport() {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <div className="relative">
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px] pt-16">

        {/* ─── HYPOTHESIS ─── */}
        <Section
          id="hypothesis"
          chapterLabel="Introduction"
          headline="When an SDK changes, does the agent know?"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              When an SDK releases a major version, an agent's training data becomes
              partially outdated. This benchmark tests whether giving the agent access
              to a curated, version-specific docs index changes the quality of its output.
            </p>

            <p>
              The Vercel AI SDK went through a significant restructuring between version 4
              and version 6. The new version handles streaming, message format, and
              structured output differently. Some of the old patterns still exist in the
              codebase but are no longer the right approach. Others are gone entirely and
              were replaced with new abstractions that did not exist before.
            </p>

            <p>
              This creates a specific kind of problem for an AI agent. Its training data
              contains a large amount of material about how the SDK worked before the
              rewrite. The newer patterns are documented but less represented, and in some
              cases the old method names still appear in the types alongside their
              replacements. When an agent writes code for v6, it is drawing on a mix of
              current and outdated knowledge.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Key findings
            </h3>

            <div>
              <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">MCP was the only condition with a perfect score</p>
              <p>The MCP condition got all four tasks correct. Web scored 2.5/4 and SDK scored 1.5/4. Adding the SDK without a version-specific docs source made things worse, not better.</p>
            </div>

            <div>
              <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">The SDK condition scored lower than web</p>
              <p>The agent inspected the installed types confidently but searched for the wrong method names because it didn't know the v6 replacements existed. More tooling without better context produced more confident wrong answers.</p>
            </div>

            <div>
              <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">All failures were silent</p>
              <p>None of the incorrect outputs produced a compile error or a type error. The code ran. The failures only appeared at runtime or in the shape of the output.</p>
            </div>
          </div>
        </Section>

        {/* ─── METHODOLOGY ─── */}
        <Section
          id="methodology"
          chapterLabel="Setup"
          headline="How we tested it"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              We ran the same task across three conditions, with no changes to the task
              itself, only to what the agent had available when completing it.
            </p>

            <TestEnvironmentCard />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Three conditions, each adding one layer
            </h3>

            <p>
              The first condition is the baseline: web search only, no SDK installed.
              The second adds the pre-installed SDK, so the agent can inspect type definitions directly.
              The third adds a docs MCP server on top, with an explicit prompt instructing
              the agent to query it before writing each file. Each condition has access to
              everything the previous one had, plus one more layer.
            </p>

            <div className="my-4 space-y-0">
              {[
                {
                  label: 'Web',
                  setup: 'Web only, no SDK installed',
                  tools: 'Web search',
                  prompt: 'Research the current version and APIs before writing any code.',
                },
                {
                  label: 'SDK',
                  setup: 'Web + pre-installed SDK',
                  tools: 'Web search + type inspection',
                  prompt: 'Inspect the installed packages to check the exact version and available exports.',
                },
                {
                  label: 'MCP',
                  setup: 'Web + pre-installed SDK + docs MCP server',
                  tools: 'Web search + type inspection + docs MCP',
                  prompt: 'Use the docs MCP tool first to get the current API shape, then verify against installed types.',
                },
              ].map((row, i, arr) => (
                <div
                  key={i}
                  className={`grid grid-cols-[120px_1fr] gap-4 py-3 border-t border-stone-200 dark:border-stone-800 ${i === arr.length - 1 ? 'border-b' : ''}`}
                >
                  <p className="text-[13px] font-semibold text-ink dark:text-white font-sans">{row.label}</p>
                  <div className="space-y-0.5">
                    <p className="text-[13px] text-stone-600 dark:text-stone-400 font-sans">{row.setup}. {row.tools}.</p>
                    <p className="text-[12px] text-stone-600 dark:text-stone-400 font-sans italic">"{row.prompt}"</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-4 overflow-x-auto">
              <table className="w-full font-sans border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800">
                    <th className="text-left py-2.5 pr-6 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Configuration</th>
                    <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Training data</th>
                    <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Web search</th>
                    <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Vercel AI SDK</th>
                    <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Vercel MCP</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Web',  trainingData: true, webSearch: true, sdk: false, mcp: false },
                    { label: 'SDK',  trainingData: true, webSearch: true, sdk: true,  mcp: false },
                    { label: 'MCP',  trainingData: true, webSearch: true, sdk: true,  mcp: true  },
                  ].map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-stone-100/50 dark:bg-stone-850/20' : ''}>
                      <td className="py-2.5 pr-6 font-medium text-ink dark:text-white">{row.label}</td>
                      <td className="py-2.5 px-4 text-center">{row.trainingData ? <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Yes</span> : <span className="text-stone-300 dark:text-stone-700">—</span>}</td>
                      <td className="py-2.5 px-4 text-center">{row.webSearch ? <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Yes</span> : <span className="text-stone-300 dark:text-stone-700">—</span>}</td>
                      <td className="py-2.5 px-4 text-center">{row.sdk ? <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Yes</span> : <span className="text-stone-300 dark:text-stone-700">—</span>}</td>
                      <td className="py-2.5 px-4 text-center">{row.mcp ? <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Yes</span> : <span className="text-stone-300 dark:text-stone-700">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Why each tooling approach has limits
            </h3>

            <p>
              <b>Web search</b> returns results ranked by popularity and age. The internet contains
              the entire history of the SDK, so older v4 content can outrank newer v6 content
              even when both exist. The agent also chooses which results to read based on what
              it already believes is relevant, which means it can find the right page and still
              miss the key change.
            </p>

            <p>
              <b>An installed SDK</b> gives the agent actual type definitions to inspect, which cuts
              out errors where a method was removed entirely. But types describe the shape of
              an API, not the intent behind it. When an old method and its replacement both
              appear in the definitions, the types alone do not tell the agent which one to use.
            </p>

            <p>
              <b>A docs MCP server</b> gives the agent a version-specific source of truth it can
              query directly while writing. Instead of weighing conflicting search results
              or inferring intent from types, it can look up the current recommended
              pattern and get a precise answer.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              A task built around changed v6 patterns
            </h3>

            <p>
              To test each condition, we wrote a prompt that asks the agent to implement four
              TypeScript modules, one for each pattern that changed between v4 and v6.
            </p>

            <p>
              Between v4 and v6, four core patterns changed: structured output, streaming
              responses, message handling, and passing data to the model. None of these changes
              produce a compile error if you use the old pattern. The code type-checks and runs.
              The failure shows up at runtime or in the shape of the output.
            </p>

            <SdkChangesTable />

            <p>
              The prompt we constructed describes each module in plain language, without naming
              any version, any changed method, or any deprecated pattern. The agent has to
              figure out the correct v6 approach from context alone.
            </p>

            <TaskMappingTable />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              How we scored the results
            </h3>

            <p>
              Each of the four files was scored on whether the agent used the correct v6
              pattern: full pass if correct, partial if mostly right but missing one step,
              fail if it uses the old pattern or gets the approach wrong entirely. The
              maximum score is 4.
            </p>
          </div>
        </Section>

        {/* ─── EXAMPLE SESSION ─── */}
        <Section
          id="example"
          chapterLabel="Testing workflow"
          headline="What a test run looks like"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              To make the scoring concrete, here is the tool-error handler task traced through
              two conditions: Web and MCP. This is the kind of session we reviewed
              for every run in the benchmark, tool call by tool call, with the actual code
              and output alongside it.
            </p>

            <TaskCard />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              Web: what the agent does and why it goes wrong
            </h3>
            <p>
              The agent searches for Vercel AI SDK tool error handling before writing
              anything, finds relevant documentation, and writes an initial implementation.
              The code uses field names and error-handling patterns from an older SDK version.
            </p>

            <div className="my-6">
              <ToolCallSequence label="Web — first pass" calls={WEB_FIRST_CALLS} />
            </div>

            <InitialCodeViewer agent="web" />

            <p>
              When the code fails with a schema validation error, the agent digs through
              node_modules internals. After two failed attempts, it downgrades the entire
              SDK to v4, where its training data is reliable. The code now runs, but the
              project is on an older version the developer didn't ask for, using an
              error-handling pattern removed two major versions ago.
            </p>

            <div className="my-6">
              <ToolCallSequence label="Web — debugging" calls={WEB_DEBUG_CALLS} />
            </div>

            <OutputBlock
              label="Web output"
              output={`{
  "toolCallId": "toolu_0127yV4xp7qBzc1m4wgCFerY",
  "toolName": "alwaysErrors",
  "args": { "input": "test" },
  "errored": true,
  "errorMessage": "This tool always fails intentionally."
}`}
            />

            <p>
              A developer reviewing the terminal result would have no reason to check <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">package.json</code>.
              The output is structurally correct, but the project has been quietly moved to a different
              SDK version using a pattern the current version no longer supports.
            </p>

            <EntireSessionLink
              label="Web — full session transcript"
              transcriptHref="https://gisthost.github.io/?11281b85c534e01889c90d43494eb871/index.html"
              repoHref="https://github.com/jamesdanielwhitford/tool-error-web-only"
            />

            <DocReferences refs={WEB_DOCS} />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              MCP: the same task with current documentation available
            </h3>
            <p>
              The MCP agent has the same task and the same web search, plus an MCP server
              exposing the current v6 documentation. It queries the docs before writing,
              finds the current error handling section, and produces an implementation
              using the right field names from the start.
            </p>

            <div className="my-6">
              <ToolCallSequence label="MCP — first pass" calls={MCP_FIRST_CALLS} />
            </div>

            <InitialCodeViewer agent="mcp" />

            <p>
              The agent hits a TypeScript type error and works through it by inspecting
              the type definitions. The error handling approach stays intact throughout,
              and the agent fixes the code rather than the environment.
            </p>

            <div className="my-6">
              <ToolCallSequence label="MCP — debugging" calls={MCP_DEBUG_CALLS} />
            </div>

            <OutputBlock
              label="MCP output"
              output={`{
  "errored": true,
  "text": "",
  "errorMessage": "This tool always fails."
}`}
            />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              What the comparison shows
            </h3>
            <p>
              The terminal outputs look nearly identical, but the difference is in what version
              each is running and whether the error-handling approach matches what the
              current SDK expects. The terminal output alone doesn't show that — the scoring
              criterion is whether the code reflects the correct v6 pattern.
            </p>

            <CodeComparison />

            <EntireSessionLink
              label="MCP — full session transcript"
              transcriptHref="https://gisthost.github.io/?c992aee978ca1d6110de1c342f53a549/index.html"
              repoHref="https://github.com/jamesdanielwhitford/tool-error-mcp"
            />

            <DocReferences refs={MCP_DOCS} />
          </div>
        </Section>

        {/* ─── CORRECTNESS ─── */}
        <Section
          id="correctness"
          chapterLabel="Results"
          headline="Is the code correct?"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              Each condition produced four files. Below is the overall scorecard, followed
              by one example from each condition that best illustrates why it succeeded or
              where it fell short.
            </p>

            <CorrectnessScorecard />

            <CorrectnessExamples />
          </div>
        </Section>

        {/* ─── ACTIONS ─── */}
        <Section
          id="actions"
          chapterLabel="Results"
          headline="How the agent spent its time"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              The three conditions produced different results through very different processes.
              The Web agent completed the task in 6 tool calls, the MCP agent in 37.
            </p>

            <ToolCallBreakdown />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Web: one research pass, then write
            </h3>
            <p>
              The Web agent ran a single subagent that searched for all four patterns
              at once, then wrote all four files from those results without re-checking.
              Where search returned the right page, the output was correct. Where it
              returned a partial result or missed a page entirely, that gap carried
              straight through to the code.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              SDK: more preparation, similar gaps
            </h3>
            <p>
              The SDK agent ran a second subagent specifically to inspect type
              definitions, checking method names and comparing response options. But its
              prompt named two methods to compare, both from v4. It did not search for the
              v6 replacement because it did not know the replacement existed. The type
              inspection confirmed what the agent already believed rather than correcting it.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              MCP: research first, verify second, then write
            </h3>
            <p>
              The MCP agent queried the docs index and fetched full documentation pages
              before writing each file. The index contains only current v6 docs, so the
              agent encountered the correct patterns before reaching for training memory.
              It then used type inspection to confirm what the docs described was present
              in the installed package, as verification rather than discovery. The result
              was 37 tool calls versus 6 for the Web agent, and a perfect score.
            </p>
          </div>
        </Section>

        {/* ─── TOKENS ─── */}
        <Section
          id="tokens"
          chapterLabel="Results"
          headline="What it cost"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              The breakdown below shows how token usage was distributed across each condition.
            </p>

            <TokenUsageChart />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">Web: the lightest approach, and still half wrong</h3>
            <p>
              The Web agent ran one search pass and wrote four files, keeping message tokens low. Search results are short and the agent did not re-read anything.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">SDK: more context, same mistakes</h3>
            <p>
              The SDK agent added type inspection on top of web search. Reading
              compiled declaration files is verbose, which pushed message tokens higher.
              It used more context than the Web condition and still got two files wrong.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">MCP: five times the tokens, the only perfect score</h3>
            <p>
              The MCP agent fetched four full documentation pages, each containing
              complete code examples and explanatory prose, then ran 12 type inspection
              steps to verify what the docs described against the installed package.
              That combination drove message tokens to nearly five times the Web
              total and produced the only perfect score.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">The cost of a silent failure</h3>
            <p>
              The MCP condition used approximately five times the tokens of the web-only
              condition and was the only condition where every file was correct. Web search
              used fewer tokens and still got half the files wrong without any signal that
              anything had failed. The five-times token cost of the MCP condition is the
              price of knowing the output is correct.
            </p>
          </div>
        </Section>

        {/* ─── CONFIDENCE ─── */}
        <Section
          id="confidence"
          chapterLabel="Analysis"
          headline="How confident did it sound?"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              At the end of each session, the agent described what it had built. Below
              are those verbatim closing summaries alongside the actual code produced.
            </p>

            <ConfidenceComparison />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Agents don't know what they don't know
            </h3>
            <p>
              All three agents described their output in the same confident tone, but two of them were wrong about two files each, with nothing in their summaries to signal it. An agent cannot express uncertainty about a mistake it does not know it made.
            </p>
            <p>
              The MCP agent's summaries were accurate because its research was accurate.
              It had read the correct patterns before writing, so when it described what
              it built, the description matched the code. The quality of the source
              determines whether the self-description is true.
            </p>
          </div>
        </Section>

        {/* ─── CONCLUSION ─── */}
        <Section
          id="conclusion"
          chapterLabel="Conclusion"
          headline="Quality in, quality out"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              Most of the errors in this benchmark were silent. The code compiled,
              TypeScript found nothing wrong, and the failures only surfaced at runtime.
            </p>
            <p>
              Training data and web search both carry the full history of an SDK. Old
              patterns stay on the internet after a new version ships, and deprecated
              methods often remain in the types alongside their replacements. There is
              no signal to tell the agent which patterns are current.
            </p>
            <p>
              A curated docs index removes that ambiguity. When the agent's source
              contains only current documentation, its output reflects that. Better
              source material is the most direct way to improve output quality.
            </p>
          </div>
        </Section>

      </main>
    </div>
  )
}
