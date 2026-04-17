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
              When an organization releases a major SDK version, agents' training data become
              partially outdated. This benchmark tests whether giving an agent access
              to a curated, version-specific docs index changes the quality of its output.
            </p>

            <p>
              The Vercel AI SDK went through a significant restructuring between version 4
              and version 6. The new version handles streaming, message format, and
              structured output differently. Some of the old patterns still remain in the
              codebase but are no longer the right approach. Others have been removed entirely
              and replaced with new abstractions.
            </p>

            <p>
              This update creates a specific kind of problem for an AI agent. Its training data
              contains a large amount of material about how the SDK worked before the
              rewrite. The newer patterns are documented but less represented, and in some
              cases, the old method names still appear in the types alongside their
              replacements. When an agent writes code for the AI SDK 6, it draws on a mix of
              current and outdated knowledge. To measure how much that matters, we ran the
              same task three times with different tooling configurations: implement four TypeScript modules,
              each built around a core pattern that changed between v4 and v6.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Key findings
            </h3>

            <div>
              <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">MCP was the only condition with a perfect score</p>
              <p>When the agent had access to the MCP server, it got all four tasks correct. With only web search, it scored 2.5/4. When we prompted it to use the SDK, its score decreased to 1.5/4. Adding the SDK without a version-specific docs source made things worse, not better.</p>
            </div>

            <div>
              <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">The SDK condition scored lower than web</p>
              <p>The agent inspected the installed types confidently but searched for the wrong method names, because it didn't know about the v6 replacements. When given more tooling without better context, the agent produced more confident wrong answers.</p>
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
              itself, only to which tools the agent had available when completing it.
            </p>

            <TestEnvironmentCard />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Three tooling configurations, each adding a layer
            </h3>

            <p>
              The first configuration was the baseline. The agent could use only web search.
              The second added the pre-installed SDK, in addition to web access, so the agent could inspect type definitions directly.
              The third added a docs MCP server on top of the SDK and web search, with an explicit prompt instructing
              the agent to query it before writing each file. 
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
              To test each condition, we wrote a prompt that asked the agent to implement four
              TypeScript modules, one for each pattern that changed between the AI SDK 4 and 6.
            </p>

            <p>
              Between versions 4 and 6, four core patterns changed in the AI SDK:
            </p>
            <ul>
              <li>Structured output</li>
              <li>Streaming responses</li>
              <li>Message handling</li>
              <li>Passing data to the model</li>
            </ul>
            <p>
              None of these changes produce a compile error if you use the old pattern.
              The code type-checks and runs, and the failure only shows up at runtime
              or in the shape of the output.
            </p>

            <SdkChangesTable />

            <p>
              The prompt we constructed described each module in plain language, without naming
              any specific versions, changed methods, or deprecated patterns. The agent had to
              figure out the correct v6 approach from context alone.
            </p>

            <TaskMappingTable />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              How we scored the results
            </h3>

            <p>
              For each of the four files, we scored the agent based on whether it used the correct v6
              pattern:
            </p>
            <ul>
              <li><strong>Full pass</strong> if correct</li>
              <li><strong>Partial</strong> if mostly right but missing one step</li>
              <li><strong>Fail</strong> if it used the old pattern or got the approach wrong entirely</li>
            </ul>
            <p>
              The maximum score was 4.
            </p>
          </div>
        </Section>

        {/* ─── EXAMPLE SESSION ─── */}
        <Section
          id="example"
          chapterLabel="Testing workflow"
          headline="What a test run looked like"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              To demonstrate the scoring, let's look at two of the task runs in detail:
              the first session, when the agent had only web search, and the third session, when it had MCP access.
              These are the kinds of sessions we reviewed for every run in the benchmark, tool call by tool call, with the actual code
              and output alongside it.
            </p>

            <TaskCard />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              Web search: What the agent did and why it went wrong
            </h3>
            <p>
              The agent searched for Vercel AI SDK tool error handling before writing
              anything, found relevant documentation, and wrote an initial implementation.
              In the code, it used field names and error-handling patterns from an older SDK version.
            </p>

            <div className="my-6">
              <ToolCallSequence label="Web — first pass" calls={WEB_FIRST_CALLS} />
            </div>

            <InitialCodeViewer agent="web" />

            <p>
              When the code failed with a schema validation error, the agent dug through
              <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">node_modules</code> internals. After two failed attempts, it downgraded the entire
              SDK to v4, where its training data was reliable. The code then ran, but the
              project was on an older version that the developer hadn't asked for, using an
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
              A developer reviewing the terminal result would have had no reason to check <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">package.json</code>.
              The output was structurally correct, but the agent had quietly moved the project to a different
              SDK version using a pattern no longer supported by the current version.
            </p>

            <EntireSessionLink
              label="Web — full session transcript"
              transcriptHref="https://gisthost.github.io/?11281b85c534e01889c90d43494eb871/index.html"
              repoHref="https://github.com/jamesdanielwhitford/tool-error-web-only"
            />

            <DocReferences refs={WEB_DOCS} />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              MCP: How the agent did the same task with current documentation available
            </h3>
            <p>
              When the agent could access an MCP server exposing the current AI SDK 6 documentation, 
              it queried the docs before writing, found the current error-handling section,
              and produced an implementation using the right field names from the start.
            </p>

            <div className="my-6">
              <ToolCallSequence label="MCP — first pass" calls={MCP_FIRST_CALLS} />
            </div>

            <InitialCodeViewer agent="mcp" />

            <p>
              The agent hit a TypeScript type error and worked through it by inspecting
              the type definitions. The error-handling approach stayed intact throughout,
              and the agent fixed the code rather than the environment.
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
              In both runs, the agent produced nearly identical terminal output.
              They differed in which SDK version the agent used and whether the error-handling 
              matched the AI SDK 6 API. Terminal output alone couldn't reveal this — the scoring
              criterion was that the code should follow the correct v6 pattern.
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
          headline="Was the code correct?"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              For each run, the agent produced four files. Below is the overall scorecard, followed
              by an example from each that best illustrates why that tooling configuration succeeded or
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
              The three tooling configurations produced different results through very different processes.
              With web search, the agent completed the task in six tool calls; with MCP access, it completed
              the task in 37 tool calls.
            </p>

            <ToolCallBreakdown />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Web search: One research pass, then writing
            </h3>
            <p>
              When it only had access to web search, the agent ran a single subagent that searched for all
              four patterns at once, then wrote all four files from those results without checking
              again. Where the web search returned the right page, the output was correct. Where it
              returned a partial result or missed a page entirely, that gap carried
              straight through to the code.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              SDK: More preparation, similar gaps
            </h3>
            <p>
              When it had access to the SDK, the agent ran a second subagent specifically to inspect type
              definitions, checking method names and comparing response options. But its
              prompt named two methods for the subagent to compare, both from the AI SDK 4. It didn't search
              for the AI SDK 6 replacements because it didn't know those replacements existed. The type
              inspection confirmed what the agent already believed, rather than correcting it.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              MCP: Research first, verification second, then writing
            </h3>
            <p>
              When the agent could access both the MCP server and the SDK, it queried the docs index and
              fetched full documentation pages before writing each file. The index contained only the
              current AI SDK 6 docs, so the agent encountered the correct patterns before reaching for
              training memory. It then used type inspection to confirm what the docs described was present
              in the installed package, as verification rather than discovery. The result
              was 37 tool calls (compared to six tool calls in the web-only run) and a perfect score.
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
              The breakdown below shows the token use for each run.
            </p>

            <TokenUsageChart />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">Web: The lightest approach, and still half wrong</h3>
            <p>
              With only web search, the agent ran one search pass and wrote four files, keeping message tokens low. The search results were short and the agent didn't reread anything.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">SDK: More context, but the same mistakes</h3>
            <p>
              With the SDK installed, the agent added type inspection on top of web search. Reading
              compiled declaration files was verbose, which pushed message tokens higher.
              It used more context than the web-only configuration and still got two files wrong.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">MCP: Five times the tokens, and the only perfect score</h3>
            <p>
              With MCP access, the agent fetched four full documentation pages, each containing
              complete code examples and explanatory prose, then ran 12 type inspection
              steps to verify what the docs described against the installed package.
              That combination drove message tokens to nearly five times the web run
              total and produced the only perfect score.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">The cost of a silent failure</h3>
            <p>
              While the MCP run, with all three tools, used many more tokens than the web-only
              run, it was the only tooling configuration where every file was correct. Web search
              used fewer tokens and still got half the files wrong without any signal that
              anything had failed. The higher token cost of the MCP configuration is the
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
              At the end of each run, the agent described what it had built. Here, we
              show the agent's verbatim closing summaries alongside the actual code it produced.
            </p>

            <ConfidenceComparison />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Agents don't know what they don't know
            </h3>
            <p>
              In all three sessions, the agent described its output in the same confident tone, but it was wrong
              about two files in two of its runs, with nothing in the summaries to signal the error. An agent cannot
              express uncertainty about a mistake it doesn't know it's made.
            </p>
            <p>
              The agent's summary of the MCP session was accurate because its research was accurate.
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
              A curated docs index, in the form of an MCP server, removes that ambiguity.
              When the agent's source contains only current documentation, its output reflects that.
              Better source material is the most direct way to improve output quality.
            </p>
          </div>
        </Section>

      </main>
    </div>
  )
}
