import Section from './Section'
import TOC from './TOC'
import CorrectnessScorecard from './CorrectnessScorecard'
import FabricationTable from './FabricationTable'
import { useScrollSpy } from '../hooks/useScrollSpy'

const SECTIONS = [
  { id: 'overview',       label: 'Introduction' },
  { id: 'broken-mcp',     label: 'Even a broken MCP server outperformed no MCP server at all' },
  { id: 'more-tooling',   label: 'Agents relying on the SDK were more confidently wrong' },
  { id: 'hallucinations', label: 'Great documentation doesn\'t prevent hallucinations' },
  { id: 'no-docs',        label: 'Without any documentation, agents waste time and still get it wrong' },
  { id: 'reports',        label: 'Read the full reports' },
]

interface GuideArticleProps {
  onNavigate: (tab: 'resend' | 'vercel' | 'guide' | 'full' | 'agents' | 'docusign') => void
}

export default function GuideArticle({ onNavigate }: GuideArticleProps) {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <div className="relative">
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px] pt-16">

        {/* ─── OVERVIEW ─── */}
        <Section
          id="overview"
          chapterLabel="Introduction"
          headline="Do agents produce better code when you give them better context?"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              When using AI agents to write code, keeping them up to date is harder than it looks. Agents are trained on data up to a certain point, and if the tools or APIs they're working with have changed since then, the results will be wrong.
            </p>
            <p>
              Web search helps sometimes, but you're not in control of what the agent finds, and old or partial sources can quietly poison its output without any obvious error.
            </p>
            <p>
              Documentation MCP servers are supposed to fix this. Instead of searching the web, the agent queries a server that holds up-to-date, official documentation and gets back only the most relevant results.
            </p>
            <p>
              We ran a series of benchmarks to find out if that actually makes a difference in practice. We found that MCP servers consistently help agents produce more accurate, working code, and that without one, agents consistently hallucinate product features or use outdated patterns.
            </p>
          </div>
        </Section>

        {/* ─── BROKEN MCP ─── */}
        <Section
          id="broken-mcp"
          chapterLabel="Finding 1"
          headline="Even a broken MCP server outperformed no MCP server at all"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              We tested agents against a complex enterprise API where small configuration details can break everything. We ran the same task across three different AI models, and each model ran it twice: once with web search only, and once with the MCP server available as well.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              The MCP server was broken and still helped
            </h3>
            <p>
              In every single run, the MCP server returned responses that were too large for the agent to read in full. All it ever got was a truncated preview before the response cut off. And yet agents that had the server available still did better than those that didn't.
            </p>
            <p>
              We tested three models with different capability levels. The smaller models struggled the most without MCP, spending a huge number of tool calls just trying to find basic configuration details they couldn't locate.
            </p>
            <p>
              Those same models with MCP, even only seeing a fragment of the documentation, got those details right on the first attempt.
            </p>
            <p>
              Here's how each model performed across both conditions:
            </p>

            <div className="my-4 overflow-x-auto">
              <table className="w-full font-sans border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800">
                    <th className="text-left py-2.5 pr-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Run</th>
                    <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Tool calls</th>
                    <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Context used</th>
                    <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">MCP calls</th>
                    <th className="text-left py-2.5 pl-3 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">First attempt</th>
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
                          : <span className="text-stone-600 dark:text-stone-400">No. </span>
                        }
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Web search found the right site but not the right answer
            </h3>
            <p>
              When agents without MCP hit errors and turned to web search for help, they found legitimate documentation pages. But the detail they needed wasn't on any of those pages.
            </p>
            <p>
              The information existed in the docs somewhere, it just wasn't where you naturally end up when something goes wrong. The MCP server, even broken, pointed agents in the right direction.
            </p>

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

        {/* ─── MORE TOOLING ─── */}
        <Section
          id="more-tooling"
          chapterLabel="Finding 2"
          headline="Agents relying on the SDK were more confidently wrong"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              To test what happens when an SDK has gone through significant breaking changes, we ran agents against the same task three ways: with web search only, with web search and the SDK pre-installed, and with web search, the SDK, and the official MCP server.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              A pre-installed SDK poisoned the agent's context with outdated patterns
            </h3>
            <p>
              The SDK condition actually scored lower than web search alone. Having the SDK installed meant agents could inspect the code directly, which made them more confident. But that confidence was misplaced.
            </p>
            <p>
              The SDK they were working with had gone through breaking changes in a recent major version, and the agents had no way of knowing that the patterns they were using had been replaced. More access to the codebase just meant more confidence in the wrong answer.
            </p>
            <p>
              The MCP condition was the only one with a perfect score, because it was the only one with the right context.
            </p>
            <p>
              Here's how each condition scored across the four tasks:
            </p>

            <CorrectnessScorecard />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              The failures were invisible
            </h3>
            <p>
              What made this particularly bad is that none of the outdated code produced an error. There were no compile errors, no type errors. We found the errors in the output at runtime.
            </p>
            <p>
              When an agent is confidently wrong and the code appears to work, that's a hard problem to catch.
            </p>

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

        {/* ─── HALLUCINATIONS ─── */}
        <Section
          id="hallucinations"
          chapterLabel="Finding 3"
          headline="Great documentation doesn't prevent hallucinations"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              We chose an API with really good documentation to test whether documentation quality alone is enough to stop agents from making things up.
            </p>
            <p>
              We also tried two different prompt styles to see if writing more detailed prompts could close the gap.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Agents invented constraints that don't exist
            </h3>
            <p>
              In every single run without MCP, agents fabricated at least one API limitation. They decided certain features weren't supported, wrote that into their code comments as if it was documented behavior, and then built workarounds for problems that weren't actually real.
            </p>
            <p>
              No run with MCP produced a single fabricated constraint. When agents had a tool to check something against, they checked. When they didn't, they just guessed and kept going.
            </p>
            <p>
              The table below shows what each agent claimed and what is actually true:
            </p>

            <FabricationTable />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              More detailed prompts made no difference
            </h3>
            <p>
              We tested each configuration with a simple prompt and with a much more detailed prompt that spelled out exactly what was needed. The detailed prompt improved some results, but it didn't stop fabrication.
            </p>
            <p>
              When agents hit the edge of what they knew, they invented answers no matter how specific the instructions were. With MCP, the simple prompt got correct results every time.
            </p>

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

        {/* ─── NO DOCS ─── */}
        <Section
          id="no-docs"
          chapterLabel="Finding 4"
          headline="Without any documentation, agents waste time and still get it wrong"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              We benchmarked what happens when you try to produce code for a private internal API with no public documentation at all, where the only way to understand the system is to read the code. We ran the same task with and without an MCP documentation server.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Without docs, the agent explored for a long time and still got it wrong
            </h3>
            <p>
              Without any documentation to refer to, the agent had to read through source files to try and piece together how everything connected before it could write anything.
            </p>
            <p>
              It eventually produced code that ran, but it got the underlying structure wrong because it never fully understood how the different parts of the system were supposed to connect.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              With MCP, it built the right thing in less than half the time
            </h3>
            <p>
              With the MCP server available, the agent understood the structure before touching any code and built the correct solution straight away. Here's how the two runs compared:
            </p>

            <div className="my-4 border border-stone-200 dark:border-stone-850 rounded overflow-hidden">
              <div className="grid grid-cols-3 border-b border-stone-200 dark:border-stone-850">
                <div className="px-4 py-2.5 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans" />
                <div className="px-4 py-2.5 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans border-l border-stone-200 dark:border-stone-850">Without MCP</div>
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

        {/* ─── REPORTS ─── */}
        <Section
          id="reports"
          chapterLabel="Reports"
          headline="Read the full reports"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                tab: 'vercel' as const,
                subtitle: 'SDK migration benchmark',
                label: 'Vercel AI SDK',
                description: 'Does version-specific documentation change what an agent builds when an SDK has breaking changes between versions?',
              },
              {
                tab: 'docusign' as const,
                subtitle: 'Complex enterprise API',
                label: 'DocuSign',
                description: 'Does an MCP server help agents use a complex API correctly, and does it help bridge the gap between less and more capable models?',
              },
              {
                tab: 'resend' as const,
                subtitle: 'Well-documented API',
                label: 'Resend',
                description: 'Does great documentation prevent hallucinations, and can more detailed prompts close the gap that MCP covers?',
              },
              {
                tab: 'agents' as const,
                subtitle: 'Private APIs and MCP docs',
                label: 'How to Help Agents',
                description: 'What happens when there is no public documentation at all? We tested agents against a private internal API with and without an MCP server.',
              },
              {
                tab: 'full' as const,
                subtitle: '108 sessions, 4 APIs, 3 models',
                label: 'Full Benchmark',
                description: 'The complete dataset across all configurations, APIs, and models with methodology and results broken down in full.',
              },
            ].map(report => (
              <div
                key={report.tab}
                className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden"
              >
                <div className="px-4 py-3 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold mb-0.5">
                    {report.subtitle}
                  </p>
                  <p className="text-[14px] font-semibold text-ink dark:text-white font-sans">
                    {report.label}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
                    {report.description}
                  </p>
                  <button
                    onClick={() => {
                      onNavigate(report.tab)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="text-[12px] font-semibold text-crimson hover:underline font-sans"
                  >
                    Read report →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

      </main>
    </div>
  )
}
