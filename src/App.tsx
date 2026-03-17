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
import { BENCHMARKS, aggregate, MODE_COLORS } from './data/benchmarks'
import { CountUp } from './components/CountUp'

const SECTIONS = [
  { id: 'the-question',    label: 'The Question' },
  { id: 'what-we-tested',  label: 'What We Tested' },
  { id: 'the-numbers',     label: 'The Numbers' },
  { id: 'prompt-laziness', label: 'Prompt Laziness' },
  { id: 'mode-comparison', label: 'Mode Comparison' },
  { id: 'by-api',          label: 'By API' },
  { id: 'agent-showdown',  label: 'Agent Showdown' },
  { id: 'key-findings',    label: 'Key Findings' },
]

// Inline mini-stat component for prose sections
function InlineStat({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex flex-col items-center mx-2 align-bottom">
      <span className="font-serif text-2xl text-crimson font-bold leading-none">{value}</span>
      <span className="text-[9px] uppercase tracking-widest text-stone-400">{label}</span>
    </span>
  )
}

// Horizontal mode bar chart
function ModeBar({ mode, value, max }: { mode: string; value: number; max: number }) {
  const color = MODE_COLORS[mode as keyof typeof MODE_COLORS] ?? '#94a3b8'
  return (
    <div className="flex items-center gap-3 text-[12px] font-sans">
      <span className="w-20 text-stone-500 text-right">{mode}</span>
      <div className="flex-1 h-2 bg-stone-200 dark:bg-stone-850 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-12 text-stone-600">{value.toFixed(1)}</span>
    </div>
  )
}

export default function App() {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  const lazyAgg    = aggregate(BENCHMARKS.filter(r => r.promptType === 'lazy'))!
  const detailAgg  = aggregate(BENCHMARKS.filter(r => r.promptType === 'detailed'))!

  return (
    <div className="bg-parchment dark:bg-black min-h-screen">
      <ThemeToggle />
      <Hero />
      <TOC sections={SECTIONS} activeId={activeId} />

      {/* Main content: left-biased to leave room for the fixed TOC */}
      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px]">

        {/* ─── THE QUESTION ─── */}
        <Section
          id="the-question"
          chapterLabel="Introduction"
          headline="The promise and the caveat"
          subheadline="Everyone knows agents can write code. The question is whether you should hand them a map."
        >
          <div className="prose-custom space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              How well do AI coding agents handle real-world integration tasks, and does giving
              them better tools help? This report benchmarks Claude Sonnet 4.6 and Codex on
              adding popular API integrations to a Node.js application, across three tooling
              configurations and two prompt styles.
            </p>
            <p>
              Three questions drove the benchmark: Does an SDK reduce the effort an agent needs
              to complete an integration? Does an MCP server on top of an SDK help further,
              or is it redundant? Do short, vague prompts benefit more from richer tooling than
              detailed ones?
            </p>
            <p>
              We ran
              <InlineStat value="108" label="runs" />
              integration attempts across
              <InlineStat value="3" label="APIs" />
              and
              <InlineStat value="3" label="modes" />
              , covering two agents, two prompt styles, and three runs per combination.
            </p>
            <p>
              For well-known APIs, all three configurations produce working code. What changes is
              efficiency. For niche APIs, tooling is the difference between success and failure.
            </p>
          </div>
        </Section>

        {/* ─── WHAT WE TESTED ─── */}
        <Section
          id="what-we-tested"
          chapterLabel="Methodology — Setup"
          headline="108 attempts. Three APIs. Six combinations."
        >
          <div className="space-y-6 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              Each run started from a fresh clone of a standard Node.js Express application,
              with no shared context or tool call history between runs.
            </p>
            <p>
              Two APIs were selected: <strong className="text-ink">Resend</strong>, a
              widely-used email API with clean documentation, and{' '}
              <strong className="text-ink">Metabase</strong>, a niche analytics platform with
              sparse public documentation. Resend tests whether tooling adds value when the
              agent already has good training data. Metabase tests whether tooling compensates
              for weak training data.
            </p>
            <p>
              Three integration modes were tested:{' '}
              <em>bare</em> (agent has only training data, no documentation provided),{' '}
              <em>sdk</em> (the official Software Development Kit is pre-installed), and{' '}
              <em>sdk+mcp</em> (the SDK is installed and the tool's own MCP server is
              configured: Resend MCP for Resend,{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">@cognitionai/metabase-mcp-server</code>{' '}
              for Metabase).
            </p>
            <p>
              Each combination ran three times. A run was marked successful if the integration
              produced working code that passed an automated smoke test.
            </p>
          </div>
          <TestMatrix />
        </Section>

        {/* ─── THE NUMBERS ─── */}
        <Section
          id="the-numbers"
          chapterLabel="Results — Overview"
          headline="All 108 runs, one chart"
          subheadline="Each dot is a single run. Filter by any dimension."
        >
          <div className="text-stone-600 dark:text-stone-400 text-[14px] leading-relaxed mb-8">
            <p>
              X-axis is number of turns. Y-axis is total tokens consumed. Dot size encodes time
              taken. Color encodes mode. Fill vs outline encodes agent. Faded dots are failed runs.
            </p>
          </div>
          <ScatterPlot />
        </Section>

        {/* ─── PROMPT LAZINESS ─── */}
        <Section
          id="prompt-laziness"
          chapterLabel="Results — Prompt Quality"
          headline="Lazy prompts work most of the time"
          subheadline="Detailed prompts improve accuracy. The difference narrows with better tooling."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              We tested two prompt styles. The <em>lazy</em> prompt was short and
              underspecified. The <em>detailed</em> prompt included the specific goal,
              expected behavior, error handling requirements, and the specific Software
              Development Kit (SDK) to use.
            </p>
            <p>
              We noticed this: the two runs that moved from fail to pass with sdk+mcp were
              both low-complexity, vague prompts. When a task is underspecified, searching
              for specific answers gives the agent something concrete to work from.
            </p>

            <div className="grid grid-cols-2 gap-6 my-8">
              <div className="border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 p-5">
                <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-4">Lazy prompt</p>
                <div className="space-y-3">
                  <ModeBar mode="bare"    value={lazyAgg.avgTurns} max={20} />
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-850 text-center">
                  <span className="font-serif text-3xl text-ink dark:text-white font-semibold">
                    {Math.round(lazyAgg.successRate * 100)}%
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">overall success</p>
                </div>
              </div>
              <div className="border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 p-5">
                <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-4">Detailed prompt</p>
                <div className="space-y-3">
                  <ModeBar mode="bare"    value={detailAgg.avgTurns} max={20} />
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-850 text-center">
                  <span className="font-serif text-3xl text-ink dark:text-white font-semibold">
                    {Math.round(detailAgg.successRate * 100)}%
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">overall success</p>
                </div>
              </div>
            </div>

            <p>
              With sdk+mcp, a lazy prompt achieves{' '}
              <strong className="text-crimson">
                {Math.round(aggregate(BENCHMARKS.filter(r => r.mode === 'sdk+mcp' && r.promptType === 'lazy'))!.successRate * 100)}%
              </strong>{' '}
              success, compared to{' '}
              {Math.round(aggregate(BENCHMARKS.filter(r => r.mode === 'bare' && r.promptType === 'detailed'))!.successRate * 100)}%
              {' '}for a detailed prompt in bare mode. Tooling compensates for prompt quality
              up to a point. For teams where developers write short prompts, investing in
              tooling pays off more than writing a prompt engineering guide.
            </p>
          </div>

          {/* Prompt type comparison table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-850">
                  <th className="text-left py-3 pr-8 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Mode</th>
                  <th className="text-center py-3 px-6 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Lazy — success</th>
                  <th className="text-center py-3 px-6 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Detailed — success</th>
                  <th className="text-center py-3 px-6 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Lazy — avg tokens</th>
                  <th className="text-center py-3 px-6 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Detailed — avg tokens</th>
                </tr>
              </thead>
              <tbody>
                {(['bare', 'sdk', 'sdk+mcp'] as const).map((mode, i) => {
                  const l = aggregate(BENCHMARKS.filter(r => r.mode === mode && r.promptType === 'lazy'))!
                  const d = aggregate(BENCHMARKS.filter(r => r.mode === mode && r.promptType === 'detailed'))!
                  return (
                    <tr key={mode} className={i % 2 === 0 ? 'bg-stone-100/50 dark:bg-stone-850/30' : ''}>
                      <td className="py-3.5 pr-8">
                        <span className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-stone-500">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: MODE_COLORS[mode] }} />
                          {mode}
                        </span>
                      </td>
                      <td className="py-3.5 text-center font-medium text-ink dark:text-white">
                        {Math.round(l.successRate * 100)}%
                      </td>
                      <td className="py-3.5 text-center font-medium text-ink">
                        {Math.round(d.successRate * 100)}%
                      </td>
                      <td className="py-3.5 text-center text-stone-500 text-[13px]">
                        {(l.avgTokens / 1000).toFixed(1)}k
                      </td>
                      <td className="py-3.5 text-center text-stone-500 text-[13px]">
                        {(d.avgTokens / 1000).toFixed(1)}k
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ─── MODE COMPARISON ─── */}
        <Section
          id="mode-comparison"
          chapterLabel="Results — Mode Comparison"
          headline="Bare vs SDK vs SDK + MCP"
          subheadline="The full aggregate comparison across all 108 runs."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              For Resend, all three configurations produced working code. The agent already had
              sufficient training data, so what changed across configurations was efficiency,
              not correctness. The sdk configuration ran in half the time of sdk+mcp and cost
              half as much, at the same pass rate. The sdk+mcp configuration spent extra turns
              consulting documentation the agent didn't need.
            </p>
            <p>
              For Metabase,{' '}
              <strong className="text-ink">neither the SDK nor the MCP server made a
              meaningful difference</strong>. Bare, sdk, and sdk+mcp all produced similar
              pass rates. The failures came from gaps in training data coverage that no
              amount of tooling resolved: wrong endpoint, wrong authentication header,
              wrong request format.
            </p>
            <p>
              The Metabase MCP server exposes tool descriptions the agent can use as
              documentation, but it didn't help much. The failures came from training data
              gaps the MCP server could not fill.
            </p>
          </div>
          <ModeComparisonTable />

          <div className="mt-10 grid grid-cols-3 gap-4">
            {(['bare', 'sdk', 'sdk+mcp'] as const).map(mode => {
              const a = aggregate(BENCHMARKS.filter(r => r.mode === mode))!
              return (
                <div key={mode} className="text-center py-6 border border-stone-200 dark:border-stone-850 bg-white/40 dark:bg-stone-900/40">
                  <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ backgroundColor: MODE_COLORS[mode] }} />
                  <div className="font-serif text-3xl font-bold text-ink dark:text-white">
                    <CountUp to={Math.round(a.successRate * 100)} suffix="%" duration={900} />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">
                    {mode} success
                  </div>
                  <div className="text-[12px] text-stone-500 mt-3">
                    {a.avgTurns.toFixed(1)} turns · {(a.avgTokens / 1000).toFixed(1)}k tokens
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* ─── BY API ─── */}
        <Section
          id="by-api"
          chapterLabel="Results — Per API"
          headline="Agents work well with good documentation"
          subheadline="API complexity amplifies the benefit of better tooling."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              Not all APIs are equal. Resend has a flat REST API with minimal auth requirements,
              a clean baseline for testing agents without tools. Linear uses GraphQL with enough
              surface area to require careful schema navigation. Metabase presents the hardest
              challenge: sparse training data coverage, session-based authentication, and
              endpoints that deviate from what most agents guess by default.
            </p>
            <p>
              The harder the API, the less tooling helps. For Resend, the SDK alone
              raised the pass rate to 100%. For Metabase, neither the SDK nor the MCP
              server moved the needle on the core failures.
            </p>
          </div>
          <ApiBreakdown />
        </Section>

        {/* ─── AGENT SHOWDOWN ─── */}
        <Section
          id="agent-showdown"
          chapterLabel="Results — Agent Comparison"
          headline="Claude Sonnet vs Codex"
          subheadline="Same tasks, same tools. Different outcomes."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              We ran every combination with both Claude Sonnet 4.6 and Codex, using identical
              prompts, identical starting codebases, and identical tooling.
            </p>
            <p>
              On the Linear integration, both Claude models reached for the{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1.5 py-0.5 rounded text-[13px]">@linear/sdk</code>{' '}
              package. Codex chose to call the GraphQL API directly via fetch, reasoning that
              a single mutation didn't warrant adding a new dependency. The difference reflects
              how each agent weighs scope against dependencies.
            </p>
            <p>
              With MCP available, all agents produced working integrations on the first try.
              The main value was resolving live, account-specific context, specifically the
              team ID, rather than improving code structure. MCP didn't teach the agents how
              to integrate Linear. They already knew. Its value was in resolving information
              training data could not provide.
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

        {/* Footer */}
        <footer className="pt-16 pb-24 border-t border-stone-200 dark:border-stone-850 mt-8">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-sans">
            <span>© 2025 Speakeasy</span>
            <span>Do Agents Actually Need Help? — Benchmark Report</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
