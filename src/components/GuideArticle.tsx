import TOC from './TOC'
import Section from './Section'
import TaskCard from './TaskCard'
import ToolCallComparison from './ToolCallComparison'
import CodeComparison from './CodeComparison'
import EntireSessionLink from './EntireSessionLink'
import ReportSeriesLinks from './ReportSeriesLinks'
import { useScrollSpy } from '../hooks/useScrollSpy'

const SECTIONS = [
  { id: 'problem',    label: 'AI agents and stale training data' },
  { id: 'scenario',   label: 'A common scenario' },
  { id: 'with-docs',  label: 'With direct documentation access' },
  { id: 'comparison', label: 'Comparing how each agent recovered' },
  { id: 'conclusion', label: 'The difference context makes' },
  { id: 'series',     label: 'What this series investigates' },
]

interface GuideArticleProps {
  onNavigate: (tab: 'resend' | 'vercel') => void
}

export default function GuideArticle({ onNavigate }: GuideArticleProps) {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <>
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px]">

        {/* ─── PROBLEM ─── */}
        <Section
          id="problem"
          chapterLabel="The problem"
          headline="AI agents confidently use APIs they have never seen"
          subheadline="Why giving your agent better context matters more than you think"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              [Placeholder: Open with the developer's intuition — "my agent can search the web, it'll find the current docs." Explain why this feels reasonable and when it breaks.]
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              The problem isn't hallucination. It's outdated training data.
            </h3>
            <p>
              [Placeholder: Distinguish between hallucination (inventing facts) and stale training data (confidently using a pattern that was correct 12 months ago). The agent isn't guessing — it learned from real documentation that is now out of date.]
            </p>
          </div>
        </Section>

        {/* ─── SCENARIO ─── */}
        <Section
          id="scenario"
          chapterLabel="A common scenario"
          headline="Integrating a recently updated SDK"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              [Placeholder: Frame the scenario — developer asks an agent to build a small utility with the Vercel AI SDK. The SDK had a major version update. The agent has web search. This is an everyday situation.]
            </p>

            <TaskCard />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              The agent has web search. It finds the current docs.
            </h3>
            <p>
              [Placeholder: The agent runs a web search first. It does find relevant pages. It reads them. It writes code based on what it found. Walk through the first few tool calls — it looks capable.]
            </p>

            <EntireSessionLink
              label="Web-search agent — full session transcript"
              href="https://github.com/[TBD]/entire/checkpoints/v1"
            />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              The agent hits a runtime error and makes a bad decision.
            </h3>
            <p>
              [Placeholder: Describe what happens when the first run fails. The agent can't resolve the schema error against what it found in the docs. It decides to downgrade the entire SDK from v6 to v4. The code works — but it's now running against a version the developer didn't ask for.]
            </p>
          </div>
        </Section>

        {/* ─── WITH DOCS ─── */}
        <Section
          id="with-docs"
          chapterLabel="With documentation access"
          headline="Giving the agent direct access to the documentation"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              [Placeholder: Introduce the second condition — same task, same model, but now the agent has an MCP server exposing the current Vercel AI SDK v6 docs directly. Explain briefly what that means: instead of searching the web, it calls search_docs and get_doc.]
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              The agent queries the docs directly instead of searching
            </h3>
            <p>
              [Placeholder: Walk through how the MCP agent starts — it calls search_docs immediately, finds the right section, reads the correct API shape for tool error handling in v6. First draft of the code uses the right pattern.]
            </p>

            <EntireSessionLink
              label="MCP agent — full session transcript"
              href="https://github.com/[TBD]/entire/checkpoints/v1"
            />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              The agent hits the same error and recovers correctly
            </h3>
            <p>
              [Placeholder: Describe the MCP agent hitting a type error — similar pressure point to the web-search agent. Instead of downgrading, it runs one targeted debug script, confirms the correct content part type name from the docs, applies a two-line fix.]
            </p>
          </div>
        </Section>

        {/* ─── COMPARISON ─── */}
        <Section
          id="comparison"
          chapterLabel="Comparison"
          headline="Comparing how each agent recovered"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <h3 className="font-serif text-xl text-ink dark:text-white mt-4 mb-3">
              Tool calls: how each agent tried to debug the problem
            </h3>
            <p>
              [Placeholder: Brief framing before the comparison — both agents hit an error, both kept working. The difference is what they did next.]
            </p>

            <ToolCallComparison />

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              Output code: what each agent shipped
            </h3>
            <p>
              [Placeholder: Both agents produced working code. But "working" means different things. Walk into the code comparison — the web-search agent is on v4, uses a try/catch around the whole generateText call. The MCP agent is on v6, uses the typed step.content inspection pattern.]
            </p>

            <CodeComparison />
          </div>
        </Section>

        {/* ─── CONCLUSION ─── */}
        <Section
          id="conclusion"
          chapterLabel="Conclusion"
          headline="The agent didn't lack intelligence. It lacked reliable context."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              [Placeholder: The web-search agent made a locally rational decision. Given what it could access and verify, downgrading the SDK was a reasonable way to get to working code. The problem is that it changed the environment to fit the code, rather than the other way around.]
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              Web search finds pages. It doesn't guarantee the agent uses them correctly under pressure.
            </h3>
            <p>
              [Placeholder: The web-search agent found accurate documentation in its first tool call. It still went wrong. Explain why — web search gives the agent text to read at the start of a session. When something fails mid-way through, the agent decides what to do next based on confidence, not verified sources.]
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">
              Direct documentation access changes how agents behave when things go wrong.
            </h3>
            <p>
              [Placeholder: The MCP agent had a way to check the docs at the moment it needed them — during debugging, not just upfront. That's the difference. Context that arrives at decision time is more useful than context that arrived at session start.]
            </p>
          </div>
        </Section>

        {/* ─── SERIES ─── */}
        <Section
          id="series"
          chapterLabel="This series"
          headline="This is the question the rest of this report series investigates"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              [Placeholder: The example above is one task, one SDK, one model. The reports below run this question at scale — multiple tasks, multiple APIs, measured correctness scores. Browse the reports to see how the pattern holds.]
            </p>

            <ReportSeriesLinks onNavigate={onNavigate} />
          </div>
        </Section>

      </main>
    </>
  )
}
