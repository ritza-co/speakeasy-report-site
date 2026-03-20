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
import { BENCHMARKS, aggregate, METHOD_COLORS } from './data/benchmarks'
import { CountUp } from './components/CountUp'

const SECTIONS = [
  { id: 'the-question',   label: 'The Question' },
  { id: 'what-we-tested', label: 'What We Tested' },
  { id: 'the-numbers',    label: 'The Numbers' },
  { id: 'by-api',         label: 'By API' },
  { id: 'by-method',      label: 'By Method' },
  { id: 'mcp-section',    label: 'SDK + MCP' },
  { id: 'model-compare',  label: 'Model Comparison' },
  { id: 'key-findings',   label: 'Key Findings' },
  { id: 'how-to-use-mcp', label: 'How to Use MCP' },
]

function InlineStat({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex flex-col items-center mx-2 align-bottom">
      <span className="font-serif text-2xl text-crimson font-bold leading-none">{value}</span>
      <span className="text-[9px] uppercase tracking-widest text-stone-400">{label}</span>
    </span>
  )
}

export default function App() {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  const gptMcp    = BENCHMARKS.filter(r => r.model === 'GPT-5.4').reduce((s, r) => s + r.mcp_calls, 0)
  const claudeMcp = BENCHMARKS.filter(r => r.model !== 'GPT-5.4').reduce((s, r) => s + r.mcp_calls, 0)

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
          headline="The assumption and what the data showed"
          subheadline="Everyone knows agents can write code. The question is whether you should hand them a map."
        >
          <div className="prose-custom space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              This report started with a reasonable assumption: giving AI coding agents access
              to live API documentation through an MCP server makes them better at integrations.
            </p>
            <p>
              After
              <InlineStat value="36" label="sessions" />
              across
              <InlineStat value="4" label="APIs" />
              ,
              <InlineStat value="3" label="methods" />
              , and
              <InlineStat value="3" label="models" />
              , that assumption holds — but not for the reasons anyone expected.
            </p>
            <p>
              SDK+MCP is the only configuration with a 100% success rate. It is also the
              slowest and most expensive. More importantly, agents are not using MCP to read
              documentation. They are using it to check their own work: querying Linear to
              confirm an issue was actually created, inspecting Resend delivery logs to verify
              an email landed, and validating a PandaDoc document lifecycle against a live
              workspace. MCP works in two distinct modes — documentation lookup and live work
              validation — and the second mode is where the real value sits.
            </p>
            <p>
              The second finding is about epistemic humility: the tendency to acknowledge the
              limits of your own knowledge and seek external verification before committing to
              an answer. GPT-5.4 has it. Claude, for the most part, does not. Claude trusts
              its training data. Most of the time, that trust is justified. When it is not,
              it fails quietly.
            </p>
          </div>
        </Section>

        {/* ─── WHAT WE TESTED ─── */}
        <Section
          id="what-we-tested"
          chapterLabel="Methodology — Setup"
          headline="36 sessions. 4 APIs. 9 combinations."
        >
          <div className="space-y-6 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              Each run started from a fresh clone of a freelance marketplace application
              built with Next.js and Express.js, with no shared context or tool call history
              between runs. Each model ran one session per combination.
            </p>
            <p>
              Four APIs were selected for distinct reasons:{' '}
              <strong className="text-ink">Resend</strong> tests whether tooling adds value
              when the agent already has strong training data coverage.{' '}
              <strong className="text-ink">Linear</strong> has a well-designed GraphQL API —
              enough complexity to reveal how agents handle non-trivial interfaces.{' '}
              <strong className="text-ink">PandaDoc</strong> is a niche document-signing
              platform where LLMs have limited training data.{' '}
              <strong className="text-ink">Metabase</strong> is a self-hosted analytics
              platform with sparse public documentation.
            </p>
            <p>
              Three integration methods were tested:{' '}
              <em>Bare</em> (agent has only training data),{' '}
              <em>SDK</em> (the official SDK is pre-installed), and{' '}
              <em>SDK+MCP</em> (the SDK is installed and the tool's own MCP server is
              configured).
            </p>
          </div>
          <TestMatrix />
        </Section>

        {/* ─── THE NUMBERS ─── */}
        <Section
          id="the-numbers"
          chapterLabel="Results — Overview"
          headline="All 36 sessions, one chart"
          subheadline="Each dot is a session. Filter by any dimension."
        >
          <div className="text-stone-600 dark:text-stone-400 text-[14px] leading-relaxed mb-8">
            <p>
              X-axis is session duration. Y-axis is total context tokens consumed.
              Dot size encodes output tokens. Color encodes method. GPT-5.4 sessions are
              outlined; Opus and Sonnet are filled. Faded dots are failed sessions.
            </p>
          </div>
          <ScatterPlot />
        </Section>

        {/* ─── BY API ─── */}
        <Section
          id="by-api"
          chapterLabel="Results — Per API"
          headline="Results by API"
          subheadline="LLMs perform well with APIs that are popular and well-documented."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              <strong className="text-ink">Resend</strong> and{' '}
              <strong className="text-ink">Linear</strong> worked on the first attempt
              across all three models. Both are familiar from training data, and all three
              configurations produced working code. What changed was efficiency, not
              correctness.
            </p>
            <p>
              <strong className="text-ink">Metabase</strong> exposed a gap in
              documentation. Sonnet and Opus could not find the correct format for the
              embedding secret and tried multiple formats. The Metabase embedding SDK also
              requires a paid plan — agents that reached for it spent up to 18 minutes and
              4.8 million tokens before hitting a paywall. Bare API calls on the same task
              were faster and more correct.
            </p>
            <p>
              <strong className="text-ink">PandaDoc</strong> was the only API below 100%.
              The two failures were sessions without an API key and without local
              confirmation of the integration: one Opus bare session and one Sonnet SDK
              session. GPT-5.4's SDK+MCP session ran for 50 minutes, inspecting every
              available endpoint and mapping template roles before writing code — the most
              thorough session in the benchmark.
            </p>
          </div>
          <ApiBreakdown />
        </Section>

        {/* ─── BY METHOD ─── */}
        <Section
          id="by-method"
          chapterLabel="Results — Method Comparison"
          headline="Bare vs SDK vs SDK + MCP"
          subheadline="The full aggregate comparison across all 36 sessions."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              SDK+MCP is the only method with a 100% success rate. Bare and SDK both sit
              at 92%, one failure each. SDK+MCP is slower and more token-heavy, but
              nothing failed.
            </p>
            <p>
              For well-known APIs, SDK adds no value over bare. For niche APIs, neither
              SDK nor bare reaches the ceiling that SDK+MCP achieves — but the difference
              comes from live validation, not from documentation lookup.
            </p>
          </div>
          <ModeComparisonTable />
        </Section>

        {/* ─── SDK + MCP ─── */}
        <Section
          id="mcp-section"
          chapterLabel="Results — SDK + MCP"
          headline="How agents actually used MCP"
          subheadline="When sessions did not explicitly instruct agents to use MCP tools, Claude never called them."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              GPT-5.4 made{' '}
              <strong className="text-crimson">{gptMcp} MCP calls</strong> across 12
              sessions. Claude Sonnet and Opus made{' '}
              <strong className="text-ink dark:text-white">{claudeMcp} combined</strong>.
              The gap holds across every API and every tooling mode. GPT-5.4 checks its
              work. Claude trusts its training data.
            </p>
            <p>
              SDK+MCP sessions showed no consistent overhead in input or output token usage
              compared to SDK-only sessions. Variance was driven primarily by session
              content and model behavior rather than MCP tool definitions loading into
              context.
            </p>
            <p>
              The pattern across all four APIs is the same. MCP did not teach agents how
              to integrate these tools — they already knew. MCP gave them access to the
              actual state of the environment they were integrating into. That is a
              different kind of help entirely.
            </p>

            {/* MCP call stat cards */}
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
          headline="Opus vs Sonnet vs GPT-5.4"
          subheadline="Same tasks, same tools. The most consistent difference was how often each model reached for external verification."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              GPT-5.4 is the only model with a perfect success rate, but it is the slowest
              by a wide margin — averaging 14 minutes 14 seconds per session against 7
              minutes 51 seconds for Opus and 8 minutes 26 seconds for Sonnet. GPT-5.4
              also generates the fewest output tokens: an average of 1,386 per session
              against 9,091 for Opus and 15,748 for Sonnet. It writes short responses
              and spends the rest of its time on tool calls.
            </p>
            <p>
              The cache behavior reveals two completely different architectural approaches.
              Claude models accumulate massive cache reads across turns — Sonnet averaged
              1.84 million total context tokens per session, almost entirely from cache.
              GPT-5.4 averaged 197,000 total context tokens, with cache reads and fresh
              input roughly equal. Claude builds a long-running context and reads from it
              repeatedly. GPT-5.4 sends fresh context each turn and uses tool calls to
              retrieve what it needs.
            </p>
          </div>
          <AgentComparison />
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
                MCP tools do not activate automatically. Without an explicit instruction to
                use them, Claude never calls them. A simple addition to your prompt is
                enough: instruct the agent to use the MCP server to confirm the integration
                worked, not just to write the code.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-ink dark:text-white mb-3">
                Agents should read MCP documentation on the tools
              </h3>
              <p>
                When an agent gets confused about an API, the most useful thing in an MCP
                server is not the endpoint list — it is the tool descriptions and flow
                explanations. PandaDoc is the clearest example: the agent used MCP to
                understand the create, send, details, and session flow in the correct order,
                something it could not have inferred from the SDK alone.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-ink dark:text-white mb-3">
                Use the right model for the right role
              </h3>
              <p>
                GPT-5.4 checks its work, reaches for tools unprompted, and produces a 100%
                success rate at the cost of time. Claude moves faster, writes more, and
                trusts its training data. Those are complementary strengths:
              </p>
              <ul className="mt-4 space-y-2 pl-4 border-l-2 border-stone-200 dark:border-stone-700">
                <li>
                  <strong className="text-ink dark:text-white">GPT-5.4</strong> for
                  exploration and validation — understanding an unfamiliar codebase,
                  inspecting live environment state, confirming that an integration actually
                  worked end to end.
                </li>
                <li>
                  <strong className="text-ink dark:text-white">Claude Opus</strong> for
                  planning and architecture — reasoning through the right approach,
                  structuring the implementation, making decisions that require judgment
                  over verification.
                </li>
                <li>
                  <strong className="text-ink dark:text-white">Claude Sonnet</strong> for
                  execution — writing the code quickly once the plan is set, where speed
                  and output volume matter more than external validation.
                </li>
                <li>
                  <strong className="text-ink dark:text-white">GPT-5.4 again for QA</strong>{' '}
                  — because it will reach for MCP tools to check the result without being
                  asked, and it will catch what the other agents assumed was fine.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        <footer className="pt-16 pb-24 border-t border-stone-200 dark:border-stone-850 mt-8">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-sans">
            <span>© 2025 Speakeasy</span>
            <span>Do Agents Need Help with Integrating Popular APIs? — Benchmark Report</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
