import Section from './Section'
import TOC from './TOC'
import CorrectnessScorecard from './CorrectnessScorecard'
import FabricationTable from './FabricationTable'
import KeyFindings from './KeyFindings'
import { useScrollSpy } from '../hooks/useScrollSpy'

const SECTIONS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'vercel',    label: 'Vercel AI SDK' },
  { id: 'docusign',  label: 'DocuSign' },
  { id: 'resend',    label: 'Resend' },
  { id: 'agents',    label: 'How to Help Agents' },
  { id: 'full',      label: 'Full Benchmark' },
]

interface GuideArticleProps {
  onNavigate: (tab: 'resend' | 'vercel' | 'guide' | 'full' | 'agents' | 'docusign') => void
}

export default function GuideArticle({ onNavigate }: GuideArticleProps) {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <>
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px]">

        {/* ─── OVERVIEW ─── */}
        <Section
          id="overview"
          chapterLabel="Introduction"
          headline="Do agents produce better code when you give them better context?"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              AI agents generate code from their training data and whatever context arrives in the prompt. When an API or SDK changes after the training cutoff, that gap produces silent errors: code that compiles, type-checks, and then fails at runtime using a pattern that was correct two versions ago.
            </p>
            <p>
              We ran a series of benchmarks to measure how much this matters and what actually closes the gap. All sessions ran against real APIs using agents including Claude Code and GPT-5.4, scored on whether the agent produced code that reflects current best practices.
            </p>
          </div>
        </Section>

        {/* ─── VERCEL ─── */}
        <Section
          id="vercel"
          chapterLabel="Benchmark 1"
          headline="Vercel AI SDK: does version-specific documentation change the output?"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              The Vercel AI SDK had significant breaking changes between v4 and v6. Tool field names were renamed, the error class for handling tool failures was removed, and streaming changed. An agent drawing on training data writes code that looks right but fails at runtime. We tested three conditions against four tasks that each targeted one of the changed patterns: web search only, with the SDK installed, and with a v6-specific docs MCP server.
            </p>
            <p>
              Only the MCP condition got a perfect score. The SDK-only condition scored lower than web-only: the agent inspected the installed types but searched for the wrong method names because it didn't know the v6 replacements existed.
            </p>

            <CorrectnessScorecard />

            <button
              onClick={() => {
                onNavigate('vercel')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-[13px] font-semibold text-crimson hover:underline font-sans"
            >
              Read the Vercel AI SDK report →
            </button>
          </div>
        </Section>

        {/* ─── DOCUSIGN ─── */}
        <Section
          id="docusign"
          chapterLabel="Benchmark 2"
          headline="DocuSign: does an MCP server help agents use a complex API correctly?"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              DocuSign has two separate environments with different base URLs, and credentials for one don't work with the other. It's exactly the kind of configuration detail that isn't reliably in training data. We ran six sessions across three models, each twice: once with web search only, once with a DocuSign MCP server added.
            </p>
            <p>
              All six agents completed the task. But the gap between them tracked model capability, not tool access. Opus used the correct sandbox URL on the first attempt in both conditions. Haiku spent 27 tool calls finding it without MCP, and 16 with. The MCP server returned responses too large to read in full, but even the truncated preview was enough to change haiku's first guess.
            </p>

            <div className="my-4 overflow-x-auto">
              <table className="w-full font-sans border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800">
                    <th className="text-left py-2.5 pr-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Run</th>
                    <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Tool calls</th>
                    <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Context used</th>
                    <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">MCP calls</th>
                    <th className="text-left py-2.5 pl-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">First attempt</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { run: 'haiku-no-mcp',  calls: 27, ctx: '23%', mcp: 0, first: false, note: 'Discovered sandbox URL by trial-and-error' },
                    { run: 'haiku-mcp',     calls: 16, ctx: '26%', mcp: 3, first: false, note: 'MCP outputs unreadable; used sandbox URL from training data' },
                    { run: 'sonnet-no-mcp', calls: 10, ctx: '12%', mcp: 0, first: false, note: 'Queried OAuth userinfo endpoint to find correct base URI' },
                    { run: 'sonnet-mcp',    calls: 13, ctx: '14%', mcp: 2, first: false, note: 'MCP outputs unreadable; fell back to same userinfo approach' },
                    { run: 'opus-no-mcp',   calls: 8,  ctx: '11%', mcp: 0, first: true,  note: 'Used correct sandbox URL immediately; no debugging required' },
                    { run: 'opus-mcp',      calls: 7,  ctx: '11%', mcp: 1, first: true,  note: 'MCP output unreadable; succeeded on first real execution' },
                  ].map((row, i) => (
                    <tr key={row.run} className={i % 2 === 0 ? 'bg-stone-50/60 dark:bg-stone-800/20' : ''}>
                      <td className="py-2.5 pr-4 font-mono text-[12px] text-stone-600 dark:text-stone-400">{row.run}</td>
                      <td className="py-2.5 px-3 text-center text-stone-600 dark:text-stone-400">{row.calls}</td>
                      <td className="py-2.5 px-3 text-center text-stone-600 dark:text-stone-400">{row.ctx}</td>
                      <td className="py-2.5 px-3 text-center">
                        {row.mcp > 0
                          ? <span className="text-stone-600 dark:text-stone-400">{row.mcp}</span>
                          : <span className="text-stone-300 dark:text-stone-600">—</span>
                        }
                      </td>
                      <td className="py-2.5 pl-3 text-stone-500 dark:text-stone-500 text-[12px]">
                        {row.first
                          ? <span className="text-emerald-600 dark:text-emerald-400">Yes. </span>
                          : <span className="text-stone-400 dark:text-stone-500">No. </span>
                        }
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => {
                onNavigate('docusign')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-[13px] font-semibold text-crimson hover:underline font-sans"
            >
              Read the DocuSign report →
            </button>
          </div>
        </Section>

        {/* ─── RESEND ─── */}
        <Section
          id="resend"
          chapterLabel="Benchmark 3"
          headline="Resend: what happens when agents don't know the answer?"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              Resend is a well-documented REST API, but some of its features aren't well-represented in training data. We ran six sessions across three tooling configurations and two prompt styles to see how agents behave when they hit the edge of what they know.
            </p>
            <p>
              The most striking finding was behavioral. In three non-MCP runs, the agent invented API constraints that don't exist, wrote them into code comments as if they were documented behavior, and built workarounds for them. With a tool to verify a claim, the agent checked; without one, it guessed and moved on.
            </p>

            <FabricationTable />

            <button
              onClick={() => {
                onNavigate('resend')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-[13px] font-semibold text-crimson hover:underline font-sans"
            >
              Read the Resend report →
            </button>
          </div>
        </Section>

        {/* ─── HOW TO HELP AGENTS ─── */}
        <Section
          id="agents"
          chapterLabel="Benchmark 4"
          headline="How to help agents: private APIs and MCP documentation"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              Private APIs present a different challenge from public ones: they're not indexed, and their documentation is often difficult to navigate even for human developers. We set up a restaurant enterprise with internal microservices and asked Claude to build a new dashboard twice: once with no documentation, once with a structured MCP documentation server.
            </p>
            <p>
              Without documentation, the agent spent 54 minutes exploring the codebase, built a working dashboard, but routed all requests through a single endpoint and ignored the service architecture entirely. With the MCP server, it queried the docs first, planned before building, and finished in 18 minutes with correct per-service routing.
            </p>

            <div className="my-4 border border-stone-200 dark:border-stone-850 rounded overflow-hidden">
              <div className="grid grid-cols-3 border-b border-stone-200 dark:border-stone-850">
                <div className="px-4 py-2.5 text-[10px] uppercase tracking-widest text-stone-400 font-sans" />
                <div className="px-4 py-2.5 text-[10px] uppercase tracking-widest text-stone-400 font-sans border-l border-stone-200 dark:border-stone-850">Without MCP</div>
                <div className="px-4 py-2.5 text-[10px] uppercase tracking-widest text-crimson font-sans border-l border-stone-200 dark:border-stone-850">With MCP</div>
              </div>
              {[
                { metric: 'Time',             noMcp: '54 min',          mcp: '18 min' },
                { metric: 'Cache reads',      noMcp: '11.7M tokens',    mcp: '2.7M tokens' },
                { metric: 'Order updates',    noMcp: 'Not working',     mcp: 'Working' },
                { metric: 'API architecture', noMcp: 'Single endpoint', mcp: 'Correct per service' },
              ].map(row => (
                <div key={row.metric} className="grid grid-cols-3 border-b border-stone-100 dark:border-stone-850 last:border-0">
                  <div className="px-4 py-2.5 text-[13px] font-medium text-stone-600 dark:text-stone-400">{row.metric}</div>
                  <div className="px-4 py-2.5 text-[13px] text-stone-500 dark:text-stone-500 border-l border-stone-100 dark:border-stone-850">{row.noMcp}</div>
                  <div className="px-4 py-2.5 text-[13px] text-ink dark:text-white font-medium border-l border-stone-100 dark:border-stone-850">{row.mcp}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                onNavigate('agents')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-[13px] font-semibold text-crimson hover:underline font-sans"
            >
              Read the How to Help Agents report →
            </button>
          </div>
        </Section>

        {/* ─── FULL BENCHMARK ─── */}
        <Section
          id="full"
          chapterLabel="Benchmark 5"
          headline="Full benchmark: 108 sessions across 4 APIs and 3 models"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              The full benchmark ran 108 agent sessions across four APIs (Linear, Resend, Metabase, PandaDoc), three tooling configurations, and three models (Claude Opus, Claude Sonnet, GPT-5.4). The headline finding was a behavioral difference we didn't set out to measure: GPT-5.4 made 45 MCP calls across 12 sessions, while Claude Sonnet and Opus made 9 combined.
            </p>

            <KeyFindings />

            <button
              onClick={() => {
                onNavigate('full')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-[13px] font-semibold text-crimson hover:underline font-sans"
            >
              Read the full benchmark report →
            </button>
          </div>
        </Section>

      </main>
    </>
  )
}
