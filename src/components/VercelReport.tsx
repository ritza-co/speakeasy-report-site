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
import { useScrollSpy } from '../hooks/useScrollSpy'

const SECTIONS = [
  { id: 'hypothesis',  label: 'Hypothesis' },
  { id: 'methodology', label: 'How we tested it' },
  { id: 'correctness', label: 'Is the code correct?' },
  { id: 'actions',     label: 'How the agent spent its time' },
  { id: 'tokens',      label: 'What it cost' },
  { id: 'confidence',  label: 'How confident did it sound?' },
  { id: 'conclusion', label: 'Conclusion' },
]

export default function VercelReport() {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <>
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px]">

        {/* ─── HYPOTHESIS ─── */}
        <Section
          id="hypothesis"
          chapterLabel="Introduction"
          headline="When an SDK changes, do the agents know?"
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
              What changed in v6
            </h3>

            <p>
              The table below shows four patterns that changed between v4 and v6, covering
              structured output, streaming responses, message handling, and passing data
              to the model, which covers the core of what most integrations do.
            </p>

            <SdkChangesTable />

            <p>
              None of these changes produce a compile error if you use the old pattern.
              The code type-checks and runs. The failure shows up at runtime, or sometimes
              only in the shape of the output, the kind of bug that takes time to diagnose.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Strengths and weaknesses of each approach
            </h3>

            <p>
              Web search can return current documentation, but the results are ranked by
              popularity and age. The internet contains the entire history of the SDK, so
              older v4 content can outrank newer v6 content even when both exist. The agent
              also has to choose which results to read, and that choice is shaped by what
              it already believes is relevant.
            </p>

            <p>
              An installed SDK gives the agent actual type definitions to inspect. That
              cuts out errors where a method was removed entirely. But types describe the
              shape of an API, not the intent behind it. When an old method and its
              replacement both appear in the definitions, the types alone do not tell the
              agent which one to use.
            </p>

            <p>
              A docs MCP server gives the agent a version-specific source of truth it can
              query directly while writing. Instead of weighing conflicting search results
              or inferring intent from types, it can look up the current recommended
              pattern and get a precise answer.
            </p>
          </div>
        </Section>

        {/* ─── METHODOLOGY ─── */}
        <Section
          id="methodology"
          chapterLabel="Introduction"
          headline="How we tested it"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              The hypothesis gives us three conditions to test, each one representing a
              realistic developer setup. We ran the same task in each, with no changes to
              the task itself, only to what the agent had available when completing it.
            </p>

            <p>
              All three runs used the same model and task, scored against the same criteria.
            </p>

            <TestEnvironmentCard />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Three conditions, each adding one layer
            </h3>

            <p>
              The first condition is the baseline, with no SDK installed and web search available.
              The agent has to research the current API before writing anything. The second
              adds the SDK to the project, so the agent can inspect type definitions
              directly and does not have to rely on web results alone. The third adds a
              docs MCP server on top of the installed SDK, with an explicit prompt
              instructing the agent to query it before writing each file.
            </p>

            <div className="my-4 space-y-0">
              {[
                {
                  label: 'Web-only',
                  setup: 'No SDK installed',
                  tools: 'Web search',
                  prompt: 'Research the current version and APIs before writing any code.',
                },
                {
                  label: 'SDK-only',
                  setup: 'SDK installed in node_modules',
                  tools: 'Web search + type inspection',
                  prompt: 'Inspect the installed packages to check the exact version and available exports.',
                },
                {
                  label: 'SDK + MCP',
                  setup: 'SDK installed + docs MCP server',
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
                    <p className="text-[12px] text-stone-400 dark:text-stone-500 font-sans italic">"{row.prompt}"</p>
                  </div>
                </div>
              ))}
            </div>

            <p>
              Each condition builds on the previous one, mapping directly to the hypothesis.
              If the limiting factor is search quality, the SDK-only condition should
              improve things. If it is type coverage, MCP should improve them further.
              If neither, all three should score similarly.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              A task designed around v6 patterns
            </h3>

            <p>
              The task asks the agent to build four TypeScript modules: a structured output
              function, a streaming chat route handler, a React chat component, and a
              tool-error handler. Each module targets one of the v6 patterns that changed
              from v4. The task is written in plain language, describing what each module
              should do. The agent has to map those requirements to the correct API calls.
            </p>

            <TaskMappingTable />

            <p>
              Most of these mappings are non-obvious. The task never mentions
              version numbers, never names the old API, and never hints at what changed.
              An agent that knows the v4 patterns well will produce code that looks
              reasonable but uses the wrong approach, and that code will not immediately
              announce itself as broken.
            </p>

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
              The web-only agent completed the task in 6 tool calls, the MCP agent in 37.
            </p>

            <ToolCallBreakdown />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Web-only: one research pass, then write
            </h3>
            <p>
              The web-only agent ran a single subagent that searched for all four patterns
              at once, then wrote all four files from those results without re-checking.
              Where search returned the right page, the output was correct. Where it
              returned a partial result or missed a page entirely, that gap carried
              straight through to the code.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              SDK-only: more preparation, similar gaps
            </h3>
            <p>
              The SDK-only agent ran a second subagent specifically to inspect type
              definitions, checking method names and comparing response options. But its
              prompt named two methods to compare, both from v4. It did not search for the
              v6 replacement because it did not know the replacement existed. The type
              inspection confirmed what the agent already believed rather than correcting it.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              SDK + MCP: research first, verify second, then write
            </h3>
            <p>
              The MCP agent queried the docs index and fetched full documentation pages
              before writing each file. The index contains only current v6 docs, so the
              agent encountered the correct patterns before reaching for training memory.
              It then used type inspection to confirm what the docs described was present
              in the installed package, as verification rather than discovery. The result
              was 37 tool calls versus 6 for the web-only agent, and a perfect score.
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

            <p>
              The web-only agent ran one search pass and wrote four files. That kept
              message tokens low. Search results are short, and the agent did not
              re-read anything.
            </p>
            <p>
              The SDK-only agent added type inspection on top of web search. Reading
              compiled declaration files is verbose, which pushed message tokens higher.
              It used more context than the web-only condition and still got two files wrong.
            </p>
            <p>
              The MCP agent fetched four full documentation pages, each containing
              complete code examples and explanatory prose, then ran 12 type inspection
              steps to verify what the docs described against the installed package.
              That combination drove message tokens to nearly five times the web-only
              total and produced the only perfect score.
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
              Confidence reflects the quality of the source
            </h3>
            <p>
              All three agents described their output in the same confident tone. The
              difference is that the web-only and SDK-only agents were wrong about two
              files each, with nothing in their summaries to signal it. An agent cannot
              express uncertainty about a mistake it does not know it made.
            </p>
            <p>
              The MCP agent's summaries were accurate because its research was accurate.
              It had read the correct patterns before writing, so when it described what
              it built, the description matched the code. Confidence is a reflection of
              what the model was given to work from.
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
    </>
  )
}
