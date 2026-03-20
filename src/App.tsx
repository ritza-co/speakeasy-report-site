import Hero from './components/Hero'
import TOC from './components/TOC'
import ThemeToggle from './components/ThemeToggle'
import Section from './components/Section'
import ScatterPlot from './components/ScatterPlot'
import ModeComparisonTable from './components/ModeComparisonTable'
import ApiBreakdown from './components/ApiBreakdown'
import AgentComparison from './components/AgentComparison'
import KeyFindings from './components/KeyFindings'
import TestMatrix from './components/TestMatrix'
import { useScrollSpy } from './hooks/useScrollSpy'
import { BENCHMARKS, METHOD_COLORS, aggregate } from './data/benchmarks'
import { CountUp } from './components/CountUp'

const SECTIONS = [
  { id: 'the-question',   label: 'The Question' },
  { id: 'what-we-tested', label: 'What We Tested' },
  { id: 'the-numbers',    label: 'The Numbers' },
  { id: 'by-api',         label: 'Results by API' },
  { id: 'by-sdk',         label: 'Results by SDK' },
  { id: 'mcp-section',    label: 'SDK + MCP' },
  { id: 'model-compare',  label: 'Model Comparison' },
  { id: 'key-findings',   label: 'Key Findings' },
  { id: 'how-to-use-mcp', label: 'How to Use MCP' },
]

export default function App() {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <div className="bg-parchment dark:bg-black min-h-screen">
      <ThemeToggle />
      <Hero />
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px]">

        {/* ─── THE QUESTION ─── */}
        <Section
          id="the-question"
          chapterLabel="Introduction"
          headline="Do Agents need help with integrating popular APIs?"
        >
          <div className="prose-custom space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              This report started with a reasonable assumption: giving AI coding agents
              access to live API documentation through an MCP server makes them better at
              integrations.
            </p>
            <p>
              After 36 sessions across four APIs, three tooling configurations, and three
              models, that assumption holds, but not for the reasons anyone expected.
            </p>
            <p>
              First, SDK+MCP is the only configuration with a 100% success rate. It is
              also the slowest and most expensive. More importantly, agents are not using
              MCP to read documentation. They are using it to check their own work:
              querying Linear to confirm an issue was actually created, inspecting Resend
              delivery logs to verify an email landed, and validating a PandaDoc document
              lifecycle against a live workspace. MCP works in two distinct modes,
              documentation lookup and live work validation, and the second mode is where
              the real value sits.
            </p>
            <p>
              Secondly, when sessions did not explicitly instruct agents to use MCP tools,
              almost none of them did:
            </p>
            <ul className="space-y-1 pl-5 list-disc">
              <li>Claude Sonnet made zero unprompted MCP calls across all bare and SDK sessions.</li>
              <li>Claude Opus made one.</li>
              <li>GPT-5.4 made seven, without being asked.</li>
            </ul>
            <p>
              The difference is not in capability. It is{' '}
              <a
                href="https://www.knowledge-architecture.com/blog/why-epistemic-humility-might-be-the-most-important-skill-for-the-ai-era"
                target="_blank"
                rel="noopener noreferrer"
                className="text-crimson underline underline-offset-2"
              >
                epistemic humility
              </a>
              : the tendency to acknowledge the limits of your own knowledge and seek
              external verification before committing to an answer. GPT-5.4 has it.
              Claude, for the most part, does not. Claude trusts its training data. Most
              of the time, that trust is justified. When it is not, it fails quietly.
            </p>
            <p>Here is what the data shows:</p>
            <ul className="space-y-1 pl-5 list-disc">
              <li>SDK+MCP is the only method with a 100% success rate, but it costs more time and tokens. Bare and SDK both sit at 92%.</li>
              <li>GPT-5.4 made 45 MCP calls across 12 sessions. Claude Sonnet and Opus made 9 combined.</li>
              <li>SDKs sometimes make things worse. Metabase's embedding SDK requires a paid plan. Agents that reached for it spent up to 18 minutes and 4.8 million tokens before hitting a paywall. Bare API calls on the same task were faster and more correct.</li>
              <li>GPT-5.4 ran a PandaDoc session for 50 minutes, inspecting every available endpoint and mapping template roles to application users before writing code. It was the most thorough session in the benchmark and the only model to confirm the full document lifecycle end to end.</li>
              <li>Codex is slower. GPT-5.4 averaged 14 minutes per session. Claude Sonnet averaged 8 minutes.</li>
            </ul>
            <p>
              After the 36 runs, the experiment continued. A second test used a
              multi-agent setup on a fresh project. Agent 1 explored the codebase and
              briefed Agent 2, which handled a Supabase integration. A third agent, with
              access to the Supabase MCP server, then validated the work. The validator
              caught what the other two missed. That result points to where MCP belongs
              in a real development workflow, not as a documentation server, but as a
              dedicated validation layer.
            </p>
            <p>
              The rest of this report walks through the data, API by API and model by
              model.
            </p>
          </div>
        </Section>

        {/* ─── WHAT WE TESTED ─── */}
        <Section
          id="what-we-tested"
          chapterLabel="Methodology — Setup"
          headline="36 attempts. 4 APIs. 9 combinations."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              Each run started from a fresh clone of a freelance marketplace application
              built with Next.js and Express.js, with no shared context or tool call
              history between runs. Each combination ran three times. A run was marked
              successful if the integration produced working code that passed an automated
              smoke test.
            </p>
            <p>Four APIs were selected for distinct reasons:</p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Resend</strong> is a
                widely-used email API with clean documentation. It tests whether tooling
                adds value when the agent already has strong training data coverage.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Linear</strong> has a
                well-designed GraphQL API. GraphQL mutations and typed schemas add enough
                complexity to reveal how agents handle non-trivial interfaces.
              </li>
              <li>
                <strong className="text-ink dark:text-white">PandaDoc</strong> is a niche
                document-signing platform with a large API surface. LLMs have limited
                training data on it, which means errors are more likely without access to
                live documentation.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Metabase</strong> is a
                self-hosted analytics platform with sparse public documentation. It tests
                whether tooling compensates for weak training data.
              </li>
            </ul>
            <p>Three integration modes were tested:</p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Bare:</strong> the agent has
                only its training data. No documentation, no SDK, no MCP server.
              </li>
              <li>
                <strong className="text-ink dark:text-white">SDK:</strong> the official
                SDK is pre-installed before the session starts.
              </li>
              <li>
                <strong className="text-ink dark:text-white">SDK+MCP:</strong> the SDK is
                installed and the tool's own MCP server is configured. Resend used the
                Resend MCP server, Metabase used{' '}
                <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">@cognitionai/metabase-mcp-server</code>
                , PandaDoc used the PandaDoc MCP server, and Linear used the Linear MCP
                server.
              </li>
            </ul>
          </div>
          <TestMatrix />
        </Section>

        {/* ─── THE NUMBERS ─── */}
        <Section
          id="the-numbers"
          chapterLabel="Results — Overview"
          headline="All 36 runs, one chart"
          subheadline="Each dot is a single session. Filter by any dimension."
        >
          <div className="text-stone-600 dark:text-stone-400 text-[14px] leading-relaxed mb-8">
            <p>
              The chart below shows all 36 runs across every combination of model, API,
              and tooling mode.
            </p>
          </div>
          <ScatterPlot />
        </Section>

        {/* ─── BY API ─── */}
        <Section
          id="by-api"
          chapterLabel="Results — Per API"
          headline="Results by API"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              LLMs perform well with APIs that are popular and well-documented. The
              results split cleanly between the two familiar APIs, Resend and Linear,
              and the two niche ones, Metabase and PandaDoc.
            </p>
            <p>
              <strong className="text-ink dark:text-white">Resend</strong> worked on the
              first attempt across all three models. The average completion time for the
              bare method was 5 minutes 12 seconds, with Sonnet being the fastest at 3
              minutes 43 seconds. Resend is not technically complex, and agents know it
              well from training data.
            </p>
            <p>
              <strong className="text-ink dark:text-white">Linear</strong> followed the
              same pattern, with one exception. The bare runs completed without issues.
              The SDK runs introduced a type error: the ID sent to the GraphQL API was in
              the wrong format. The agents caught it by checking the internet and the SDK
              documentation, and corrected it without human intervention.
            </p>
            <p>The two niche APIs produced different failure modes.</p>
            <p>
              <strong className="text-ink dark:text-white">Metabase</strong> exposed a
              gap in documentation. Sonnet and Opus could not find the correct format for
              the embedding secret, so both tried multiple formats until they arrived at
              the correct one: a 64-character hex string (256-bit). No public
              documentation covers this directly.
            </p>
            <p>
              <strong className="text-ink dark:text-white">PandaDoc</strong> presented a
              different problem. The agents needed document UUIDs to run tests, and could
              not retrieve them from the environment. Outside of that, the integration
              completed without errors. Opus was the fastest model on this API.
            </p>
          </div>
          <ApiBreakdown />
        </Section>

        {/* ─── BY SDK ─── */}
        <Section
          id="by-sdk"
          chapterLabel="Results — SDK"
          headline="Results by SDK"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              The SDK integration used more tokens and more time, which was expected. The
              quality of the integration improved in most cases, but not all.
            </p>
            <p>
              <strong className="text-ink dark:text-white">Linear</strong> showed the
              clearest improvement. The bare sessions built generic HTTP wrappers. The SDK
              sessions produced proper typed responses using{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">.createIssue()</code>{' '}
              with structured payloads. Opus confirmed a real live issue was created,
              RIT-12 on Linear.app, using the provisioned API key. Sonnet confirmed
              RIT-14. The bare sessions could not reach this level of validation without
              building authentication and request logic from scratch first.
            </p>
            <p>
              <strong className="text-ink dark:text-white">Resend</strong> produced the
              strongest live validation of any SDK session. Opus was the only session
              across all 36 runs to confirm a real email was delivered, returning a live
              Resend message ID. It also caught a real-world constraint: Resend's test API
              key only allows sending to the account owner's email address, something the
              bare sessions never discovered because they never reached a working API call.
              Sonnet also got live delivery confirmation with two real message IDs, in 2
              minutes 20 seconds.
            </p>
            <p>
              <strong className="text-ink dark:text-white">Metabase</strong> is where the
              SDK caused problems. The{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">@metabase/embedding-sdk-react</code>{' '}
              package requires a Pro or Enterprise Metabase plan. Its authentication layer
              returns a 404 on free plans. Sonnet caught this and fell back to a public
              iframe. GPT-5.4 ran Playwright to verify rendering but hit the same wall.
              The bare sessions avoided the problem entirely by skipping the SDK and
              calling the REST API directly with JWT signing. The bare approach was faster
              and more correct for Metabase.
            </p>
            <p>
              <strong className="text-ink dark:text-white">PandaDoc</strong> showed no
              clear quality gap between bare and SDK. The SDK sessions were more
              structured: Opus built a full six-endpoint contract lifecycle with a
              dedicated service layer. Both Sonnet with SDK and GPT-5.4 with bare
              discovered the same async constraint: a document cannot be sent immediately
              after creation because it needs to reach{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">document.draft</code>{' '}
              status first.
            </p>
            <blockquote className="border-l-2 border-stone-300 dark:border-stone-700 pl-5 italic text-stone-500 dark:text-stone-400">
              The pattern is consistent across all four APIs. SDK wins when the library is
              mature and credentials are available. It gives agents a typed, discoverable
              interface that reduces exploration time and enables live validation. Bare wins
              when the SDK carries external requirements, such as licensing or plan tiers,
              that the environment does not meet.
            </blockquote>
          </div>
          <ModeComparisonTable />
        </Section>

        {/* ─── SDK + MCP ─── */}
        <Section
          id="mcp-section"
          chapterLabel="Results — SDK + MCP"
          headline="SDK + MCP"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              When sessions did not explicitly instruct agents to use MCP tools, Claude
              never called them. Codex made a few unprompted calls to verify its own work,
              but neither model used MCP in any systematic way. This reflects the epistemic
              confidence gap introduced earlier: Claude trusts its training data and the
              SDK type definitions. Codex checks.
            </p>
            <p>
              SDK+MCP sessions showed no consistent overhead in input or output token
              usage compared to SDK-only sessions. Variance between the two methods was
              driven primarily by session content and model behavior rather than MCP tool
              definitions loading into context: GPT-5.4 averaged +5.9% more fresh input
              tokens with MCP, while Opus averaged −89.6% and Sonnet +32.5%, with no
              clear directional pattern across tools or models.
            </p>
            <p>
              The results below are from sessions where agents were instructed to use the
              MCP server.
            </p>
            <p>
              <strong className="text-ink dark:text-white">Linear</strong> showed the
              clearest difference across all four APIs. All three models used the MCP
              tools properly:
            </p>
            <ul className="space-y-1 pl-5 list-disc">
              <li>
                Opus called{' '}
                <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">list_teams</code>
                ,{' '}
                <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">list_issue_statuses</code>
                , and{' '}
                <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">get_issue</code>{' '}
                to verify issues RIT-15 and RIT-16 from the Linear side after creation.
              </li>
              <li>
                Sonnet called{' '}
                <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">list_teams</code>{' '}
                before writing any code, retrieving the real team ID instead of
                hardcoding a guess.
              </li>
              <li>
                GPT-5.4 verified RIT-21 through MCP and cancelled the smoke-test issues
                afterward.
              </li>
            </ul>
            <p>
              Every MCP session on Linear confirmed a live issue was created and inspected
              on the Linear side. The SDK-only sessions reached the same outcome, but had
              to infer workspace structure from environment variables. MCP gave agents
              ground truth before they wrote a line of code.
            </p>
            <p>
              <strong className="text-ink dark:text-white">Resend</strong> produced the
              strongest quality lift of any API in the MCP sessions. GPT-5.4 called{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">list-domains</code>
              ,{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">list-api-keys</code>
              ,{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">list-emails</code>
              , and{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">get-email</code>{' '}
              to confirm that email{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">0b654d96…</code>{' '}
              was actually delivered on the Resend side, and inspected the rendered
              subject and body. That is the only session across all 36 runs where external
              delivery was confirmed through the provider's own records, not just a 200
              response from the SDK. The difference matters in production: a success
              response confirms the API accepted the request. The MCP call confirmed the
              email reached the inbox.
            </p>
            <p>
              <strong className="text-ink dark:text-white">Metabase</strong> used MCP to
              validate the architecture before implementation. GPT-5.4 launched{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">metabase-mcp-server</code>
              , listed available tools and resources, confirmed the dashboard existed,
              called{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">api_call</code>{' '}
              to inspect{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">/api/dashboard/1</code>
              , and verified that static embedding was enabled and an embedding secret was
              present. That let the agent implement against the real dashboard
              configuration instead of guessing at the settings.
            </p>
            <p>
              <strong className="text-ink dark:text-white">PandaDoc</strong> used MCP to
              navigate a large and complex API surface. GPT-5.4 inspected available
              endpoints, confirmed the create, send, details, and session flow, verified
              workspace members and available templates, and inspected template roles and
              tokens. That last step was the critical one: it let the agent map the
              application's client and freelancer users onto the correct PandaDoc recipient
              roles, something no amount of static documentation lookup would have resolved
              without live workspace access.
            </p>
            <p>
              The pattern across all four APIs is the same. MCP did not teach agents how
              to integrate these tools. They already knew that. MCP gave them access to
              the actual state of the environment they were integrating into, and that is
              a different kind of help entirely.
            </p>

            <div className="grid grid-cols-3 gap-4 my-8">
              {(['Bare', 'SDK', 'SDK+MCP'] as const).map(method => {
                const mcp = BENCHMARKS.filter(r => r.method === method).reduce((s, r) => s + r.mcp_calls, 0)
                const agg = aggregate(BENCHMARKS.filter(r => r.method === method))!
                return (
                  <div key={method} className="text-center py-6 border border-stone-200 dark:border-stone-850 bg-white/40 dark:bg-stone-900/40">
                    <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ backgroundColor: METHOD_COLORS[method] }} />
                    <div className="font-serif text-3xl font-bold text-ink dark:text-white">
                      <CountUp to={mcp} duration={900} />
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">
                      {method} MCP calls
                    </div>
                    <div className="text-[12px] text-stone-500 mt-2">
                      {Math.round(agg.successRate * 100)}% success rate
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Section>

        {/* ─── MODEL COMPARISON ─── */}
        <Section
          id="model-compare"
          chapterLabel="Results — Model Comparison"
          headline="Claude Opus vs Claude Sonnet vs Codex"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              Every combination ran with Claude Sonnet 4.6, Claude Opus 4.6, and GPT-5.4,
              using identical prompts, identical starting codebases, and identical tooling.
              The most consistent difference across all 36 sessions was not pass rate or
              code quality. It was how often each model reached for external verification.
            </p>
            <p>
              GPT-5.4 made 45 MCP calls across 12 sessions. Claude Sonnet and Opus made 9
              combined.
            </p>
          </div>
          <AgentComparison />
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mt-10">
            <p>
              The cache behavior reveals two completely different architectural approaches.
              Claude models accumulate massive cache reads across turns. Sonnet averaged
              1.84 million total context tokens per session, almost entirely from cache.
              GPT-5.4 averaged 197,000 total context tokens, with cache reads and fresh
              input roughly equal. Claude builds a long-running context and reads from it
              repeatedly. GPT-5.4 sends fresh context each turn and uses tool calls to
              retrieve what it needs. Neither approach is wrong, but they behave completely
              differently under MCP and explain most of the token cost gap between models.
            </p>
          </div>
        </Section>

        {/* ─── KEY FINDINGS ─── */}
        <Section
          id="key-findings"
          chapterLabel="Conclusions"
          headline="From the analysis, some interesting numbers"
        >
          <KeyFindings />
        </Section>

        {/* ─── HOW TO USE MCP ─── */}
        <Section
          id="how-to-use-mcp"
          chapterLabel="Recommendations"
          headline="How to use MCP with AI agents"
        >
          <div className="space-y-8 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <div>
              <h3 className="font-serif text-xl text-ink dark:text-white mb-3">
                Force your agents to use MCP tools
              </h3>
              <p>
                MCP tools do not activate automatically. The data from this benchmark is
                clear: without an explicit instruction to use them, Claude never calls them.
                Codex made a handful of unprompted calls, but not systematically. If you
                want agents to validate their work through MCP, you have to tell them to.
              </p>
              <p className="mt-3">
                A simple addition to your prompt is enough: instruct the agent to use the
                MCP server to confirm the integration worked, not just to write the code.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-ink dark:text-white mb-3">
                Agents should also read MCP documentation on the tools
              </h3>
              <p>
                When an agent gets confused about an API, the most useful thing in an MCP
                server is not the endpoint list. It is the tool descriptions and the flow
                explanations. A well-written tool description tells the agent what the
                endpoint does, what it expects, and what comes next in the sequence.
                PandaDoc is the clearest example from this benchmark: the agent used MCP
                to understand the create, send, details, and session flow in the correct
                order, which it could not have inferred from the SDK alone. If your MCP
                server exposes endpoints without describing their relationships, agents
                will still make sequencing errors.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-ink dark:text-white mb-3">
                Use GPT for exploring and questioning, Claude for planning and execution
                and GPT for QA
              </h3>
              <p>
                The epistemic confidence gap between GPT-5.4 and Claude has a practical
                implication for how you assemble a team of agents. GPT-5.4 checks its
                work, reaches for tools unprompted, and produces a 100% success rate at
                the cost of time. Claude moves faster, writes more, and trusts its
                training data. Those are not competing weaknesses. They are complementary
                strengths. A productive multi-agent setup uses each model where its
                instincts are an asset:
              </p>
              <ul className="mt-4 space-y-2 pl-5 list-disc">
                <li>
                  <strong className="text-ink dark:text-white">GPT-5.4</strong> for
                  exploration and validation: understanding an unfamiliar codebase,
                  inspecting live environment state, confirming that an integration
                  actually worked end to end.
                </li>
                <li>
                  <strong className="text-ink dark:text-white">Claude Opus</strong> for
                  planning and architecture: reasoning through the right approach,
                  structuring the implementation, making decisions that require judgment
                  over verification.
                </li>
                <li>
                  <strong className="text-ink dark:text-white">Claude Sonnet</strong> for
                  execution: writing the code quickly once the plan is set, where speed
                  and output volume matter more than external validation.
                </li>
                <li>
                  <strong className="text-ink dark:text-white">GPT-5.4 again for QA:</strong>{' '}
                  because it will reach for MCP tools to check the result without being
                  asked, and it will catch what the other agents assumed was fine.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        <footer className="pt-16 pb-24 border-t border-stone-200 dark:border-stone-850 mt-8">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-sans">
            <span>© 2026 Speakeasy</span>
            <span>Do Agents Need Help with Integrating Popular APIs? — Benchmark Report</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
