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
  { id: 'methodology',     label: 'Methodology' },
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
              Over the past year, a confident claim has circulated through every developer conference
              and changelog announcement: <em>"just point the agent at the docs and it'll figure it
              out."</em> It's a seductive idea. And it's partially true. Agents can figure things
              out. They can read documentation, infer API shapes, and generate working integrations
              from scratch.
            </p>
            <p>
              But <em>how reliably?</em> At what cost? Over how many turns? And does the answer
              change when you give the agent an official SDK, or an MCP server with embedded
              documentation?
            </p>
            <p>
              We ran
              <InlineStat value="108" label="runs" />
              integration attempts across
              <InlineStat value="3" label="APIs" />
              integration modes, two agents, and two prompt styles. The results are unambiguous
              in some places, and surprisingly nuanced in others.
            </p>
            <blockquote className="border-l-2 border-crimson pl-5 py-1 my-8 font-serif italic text-stone-600 dark:text-stone-400 text-lg">
              "Giving an agent the right SDK is not cheating — it's engineering. Giving it an MCP
              server is not hand-holding — it's infrastructure."
            </blockquote>
            <p>
              The data below shows exactly how much each layer of tooling improves outcomes, and
              under what conditions the improvements are largest. Spoiler: the lazier your prompt,
              the more tooling matters.
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
              For each run, a fresh agent session was started with a standard full-stack React +
              Node.js application. The agent was asked to integrate a specific API. Each run was
              isolated: no shared context, no residual tool call history.
            </p>
            <p>
              <strong className="text-ink">Three integration modes</strong> were tested: <em>bare</em> (agent
              uses only its training knowledge), <em>SDK</em> (the official SDK is installed and the
              agent is told it exists), and <em>SDK + MCP</em> (the SDK is installed and an MCP
              server provides live documentation context).
            </p>
            <p>
              Each combination was run three times to account for non-determinism. A run was marked
              as <em>successful</em> if the integration produced working code that passed a
              smoke test (e.g. an email was actually sent, a Linear issue was actually created).
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
          headline="The uncomfortable truth about lazy prompts"
          subheadline="Detailed prompts help. But good tooling helps lazy prompts even more."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              We tested two prompt styles. The <em>lazy</em> prompt was a single sentence:
              <span className="bg-stone-100 dark:bg-stone-850 text-stone-700 dark:text-stone-300 text-[13px] px-3 py-1 rounded font-mono mx-2 inline-block">
                "Add Resend to this app"
              </span>
              — the kind of prompt a busy developer would actually type. The <em>detailed</em>
              prompt included the specific goal, expected behavior, error handling requirements,
              and a note about which SDK to use.
            </p>
            <p>
              The gap between them is real — but it narrows significantly as tooling improves.
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
              The most interesting finding: when using <strong className="text-ink">SDK + MCP</strong>,
              a lazy prompt achieves a{' '}
              <strong className="text-crimson">
                {Math.round(aggregate(BENCHMARKS.filter(r => r.mode === 'sdk+mcp' && r.promptType === 'lazy'))!.successRate * 100)}%
              </strong>{' '}
              success rate — higher than a detailed prompt on bare ({' '}
              {Math.round(aggregate(BENCHMARKS.filter(r => r.mode === 'bare' && r.promptType === 'detailed'))!.successRate * 100)}%
              ). Good tooling effectively compensates for lazy prompting up to a point.
            </p>
            <p>
              This has practical implications for teams: if your developers are going to prompt
              lazily anyway (and they will), investing in better tooling pays off more than
              writing a prompt engineering guide.
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
              The progression from bare to SDK to SDK + MCP tells a consistent story: each layer
              adds meaningful improvement. But the improvements are not equal in size, and they
              don't affect all metrics the same way.
            </p>
            <p>
              The jump from <strong className="text-ink">bare → SDK</strong> is primarily a
              reliability improvement: success rates climb and turns decrease. The agent stops
              guessing at method signatures. The jump from{' '}
              <strong className="text-ink">SDK → SDK + MCP</strong> is primarily an efficiency
              improvement: tokens drop sharply because the agent can query the docs directly
              instead of exploring the API surface through trial and error.
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
          headline="Resend was easy. DocuSign was not."
          subheadline="API complexity amplifies the benefit of better tooling."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              Not all APIs are equal. Resend has a flat, well-named REST API with minimal auth
              requirements. Linear uses OAuth, a GraphQL API, and has enough surface area that
              agents regularly get lost in schema exploration. DocuSign is an enterprise behemoth:
              multi-step auth flows, envelope lifecycles, and documentation scattered across
              multiple guides.
            </p>
            <p>
              The interesting finding: <strong className="text-ink">the harder the API, the bigger
              the gain from better tooling.</strong> SDK + MCP lifts DocuSign success by far more
              than it lifts Resend. Resend is simple enough that a capable agent can figure it out
              bare. DocuSign is not.
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
              We ran every combination with both Claude Sonnet and Codex, using identical
              prompts, identical starting codebases, and identical tooling. The results show
              consistent advantages for Claude Sonnet across all modes and APIs — but the gap
              narrows as tooling improves.
            </p>
            <p>
              Notably, Codex with SDK + MCP <em>outperforms</em> Claude Sonnet bare on several
              APIs. This suggests that for teams without a strong preference, investing in
              tooling infrastructure matters more than agent selection.
            </p>
            <p>
              Both agents show the same trend: better tooling → better outcomes. The underlying
              pattern is consistent even if the absolute numbers differ.
            </p>
          </div>
          <AgentComparison />
        </Section>

        {/* ─── KEY FINDINGS ─── */}
        <Section
          id="key-findings"
          chapterLabel="Conclusions"
          headline="Five numbers that matter"
        >
          <KeyFindings />
        </Section>

        {/* ─── METHODOLOGY ─── */}
        <Section
          id="methodology"
          chapterLabel="Appendix"
          headline="How we ran this"
        >
          <div className="space-y-5 text-stone-600 dark:text-stone-400 text-[14px] leading-relaxed max-w-2xl">
            <p>
              <strong className="text-ink">Test environment.</strong> Each run started from a
              fresh clone of a standard React + Express starter application. No existing API
              integrations were present. Node.js 20, TypeScript 5.3.
            </p>
            <p>
              <strong className="text-ink">APIs tested.</strong> Resend (v3 REST API), Linear
              (GraphQL API, OAuth), DocuSign (eSignature REST API v2.1). Each was tested against
              a sandbox/test account with pre-provisioned credentials available as environment
              variables.
            </p>
            <p>
              <strong className="text-ink">Bare mode.</strong> Agent session starts with only the
              task prompt. No SDK installed, no documentation provided beyond what the agent
              has in training data.
            </p>
            <p>
              <strong className="text-ink">SDK mode.</strong> The official npm SDK for the API
              is pre-installed. The prompt explicitly names it: <em>"use the resend npm package."</em>
            </p>
            <p>
              <strong className="text-ink">SDK + MCP mode.</strong> SDK is installed. An MCP
              server providing the API documentation is configured in the agent environment.
              The agent can query documentation, look up method signatures, and resolve ambiguities
              without consuming main context tokens.
            </p>
            <p>
              <strong className="text-ink">Success criteria.</strong> Each run was evaluated by
              an automated smoke test: for Resend, an email was received at a test inbox; for
              Linear, an issue appeared in the test workspace; for DocuSign, an envelope moved
              to "sent" status. Partial implementations (code that compiles but doesn't complete
              the task) were marked as failures.
            </p>
            <p>
              <strong className="text-ink">Token and turn counts.</strong> Captured from the
              agent session logs. Token counts include all turns in the session including tool
              call responses. Time is wall-clock from first prompt submission to task completion
              or abandonment.
            </p>
            <p>
              <strong className="text-ink">Reproducibility.</strong> Each condition was run
              three times with the same prompt text and environment to account for non-determinism.
              Data reported is the arithmetic mean across the three runs.
            </p>

            <div className="mt-8 pt-8 border-t border-stone-200 dark:border-stone-850">
              <p className="text-[11px] uppercase tracking-widest text-stone-400 mb-3">Data note</p>
              <p className="text-[13px] text-stone-500">
                The data on this page is representative benchmark data used to demonstrate the
                interactive report format. Final figures will be updated when the full benchmark
                run is complete. The relative patterns and directional findings are consistent
                with preliminary results.
              </p>
            </div>
          </div>
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
