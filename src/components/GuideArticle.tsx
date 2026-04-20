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
  { id: 'reports',        label: 'Read the reports' },
]

const FIRST_SECTION: Record<string, string> = {
  docusign: 'hypothesis',
  vercel:   'hypothesis',
  resend:   'hypothesis',
  agents:   'introduction',
}

function navigateTo(tab: string, onNavigate: (tab: 'resend' | 'vercel' | 'guide' | 'agents' | 'docusign') => void) {
  onNavigate(tab as 'resend' | 'vercel' | 'guide' | 'agents' | 'docusign')
  requestAnimationFrame(() => {
    const el = document.getElementById(FIRST_SECTION[tab])
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })
}

interface GuideArticleProps {
  onNavigate: (tab: 'resend' | 'vercel' | 'guide' | 'agents' | 'docusign') => void
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
              To produce better quality code, agents reach for a few different resources to gather accurate information:
            </p>
            <ul className="space-y-1 pl-5 list-disc text-stone-700 dark:text-stone-300 text-[15px]">
              <li>Most often they rely on their <strong>training data</strong></li>
              <li>Sometimes they conduct <strong>web searches</strong></li>
              <li>If installed they can read <strong>SDKs</strong> directly to check the types a library expects</li>
              <li>When configured, they consult <strong>MCP servers</strong> that expose documentation as callable tools</li>
            </ul>
            <p>
              Many platforms offer MCP servers and SDKs, presuming they help agents build faster and more accurately, but there is ongoing debate about how effective or necessary they actually are.
            </p>
            <p>
              To determine the impact of SDKs and MCP servers on agent performance, we varied agents' access to tools and assessed how well they could accomplish the following tasks:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { tab: 'docusign' as const, name: '1. The complex API benchmark',        task: 'Write a Python script to interact with DocuSign.' },
                { tab: 'vercel'   as const, name: '2. The breaking changes benchmark',   task: "Implement a TypeScript module for each of the patterns that changed between Vercel's AI SDK 4 and AI SDK 6." },
                { tab: 'resend'   as const, name: '3. The well-documented API benchmark', task: 'Generate a Node.js script that uses Resend to send personalized broadcast emails.' },
                { tab: 'agents'   as const, name: '4. The undocumented API benchmark',   task: 'Build a dashboard for a restaurant enterprise with internal microservices.' },
              ]).map(b => (
                <div key={b.tab} className="border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 space-y-1">
                  <button
                    onClick={() => navigateTo(b.tab, onNavigate)}
                    className="font-semibold text-[14px] text-crimson hover:underline font-sans text-left"
                  >
                    {b.name}
                  </button>
                  <p className="text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed">{b.task}</p>
                </div>
              ))}
            </div>
            <p>Here is what we found:</p>
            <ul className="space-y-3 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white font-medium">Model capability determined the outcome more than tooling:</strong>{' '}
                In the complex API benchmark, the three agents completed the DocuSign task both with and without access to the DocuSign MCP server. The quality of the code they produced varied across the six runs, but code quality tracked model capability more than tool access. The same broken MCP server helped the weakest model and hurt the middle one, depending on the documentation fragment it exposed.
              </li>
              <li>
                <strong className="text-ink dark:text-white font-medium">Without additional resources, adding only an SDK can make things worse:</strong>{' '}
                In the breaking changes benchmark, the agent scored lower when it had the SDK pre-installed than when it had access to web search alone. It used the SDK to inspect the code, became more confident, and applied outdated patterns. The agent only achieved a perfect score when it used the SDK combined with an MCP server, because the MCP server gave it the version-specific context that the SDK code couldn't.
              </li>
              <li>
                <strong className="text-ink dark:text-white font-medium">Great documentation does not prevent hallucinations:</strong>{' '}
                In the well-documented benchmark, despite Resend's excellent documentation and strong representation in agent training data, the agent produced fabricated API constraints in every run it didn't have access to the MCP server. The agent claimed certain features were unsupported, wrote them into comments, and came up with workarounds for them, even though Resend actually fully supported those features. When we gave the agent access to the MCP server, it didn't produce any fabrications. More detailed prompts improved some scores but didn't stop the agent from inventing answers at the edge of what it knew.
              </li>
              <li>
                <strong className="text-ink dark:text-white font-medium">Without any documentation, agents explore for a long time and still get it wrong.</strong>{' '}
                In the undocumented API benchmark, we tested a simulated private microservices API with no public documentation. Without access to an MCP docs server, the agent spent 54 minutes reading source files to piece together how the system connected, and still got the architecture wrong. With access to an MCP docs server, it understood the structure before writing any code, built the correct solution, and finished in 18 minutes.
              </li>
            </ul>
          </div>
        </Section>

        {/* ─── BROKEN MCP ─── */}
        <Section
          id="broken-mcp"
          chapterLabel="Finding 1"
          headline="Model capability determined the outcome more than tooling"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              We ran the same DocuSign task across three agent models. For each model, we ran the task once with web search only and once with the MCP server available. In all six runs, the agent completed the task, but code quality and debugging efficiency tracked model capability more than tool access.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              The same broken MCP helped one model and hurt another
            </h3>
            <p>
              In every single run, the MCP server returned responses that were too large for the agent to read in full. All it ever got was a truncated preview before the response cut off. And yet, agents that had the server available still did better than those that didn't.
            </p>
            <p>
              For Sonnet, the preview appeared to contain a fragment of a DocuSign example showing PDF document construction. Sonnet-no-MCP produced a minimal 60-line script, while Sonnet-MCP produced a 130-line version that hand-crafted a valid PDF binary from scratch, doing unnecessary work the task never required. The API call was identical, but the broken MCP left a clear mark on everything around it.
            </p>
            <p>
              Each model's performance across both conditions:
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
                    { run: 'Haiku-no-MCP',  calls: 27, ctx: '23%', mcp: 0, first: false, note: 'Discovered sandbox URL by trial-and-error' },
                    { run: 'Haiku-MCP',     calls: 16, ctx: '26%', mcp: 3, first: false, note: 'MCP outputs unreadable; used sandbox URL from training data' },
                    { run: 'Sonnet-no-MCP', calls: 10, ctx: '12%', mcp: 0, first: false, note: 'Queried OAuth userinfo endpoint to find correct base URI' },
                    { run: 'Sonnet-MCP',    calls: 13, ctx: '14%', mcp: 2, first: false, note: 'MCP outputs unreadable; fell back to same userinfo approach' },
                    { run: 'Opus-no-MCP',   calls: 8,  ctx: '11%', mcp: 0, first: true,  note: 'Used correct sandbox URL immediately; no debugging required' },
                    { run: 'Opus-MCP',      calls: 7,  ctx: '11%', mcp: 1, first: true,  note: 'MCP output unreadable; succeeded on first real execution' },
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
              With web search, agents found the right pages but not the right answer
            </h3>
            <p>
              When agents without MCP access hit errors and turned to web search, they found legitimate DocuSign documentation pages, but the pages didn't mention the sandbox address they needed. The information existed in the docs, just not on the pages one reaches when debugging a <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">401</code>.
            </p>
            <p>
              MCP matters most when model capability is lowest and training data coverage is thinnest; agents above a certain capability threshold will find another way regardless.
            </p>

            <button
              onClick={() => navigateTo('docusign', onNavigate)}
              className="text-[13px] font-semibold text-crimson hover:underline font-sans"
            >
              Model capability beats tooling →
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
              In the breaking changes benchmark, we tested what happens when an SDK has gone through significant breaking changes. We got an agent to run the same task three ways: with web search only; with web search and the SDK pre-installed; and with web search, the SDK, and the official MCP server.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              A pre-installed SDK poisoned the agent's context with outdated patterns
            </h3>
            <p>
              Adding the SDK actually caused the agent to score lower than when it relied on web search alone. Having the SDK installed meant the agent could inspect the code directly, which made it more confident. However, that confidence was misplaced.
            </p>
            <p>
              The SDK had gone through breaking changes in a recent major version, and the agent had no way of knowing that the patterns it was using had been replaced. Providing it with more access to the codebase just meant it had greater confidence in incorrect answers.
            </p>
            <p>
              The agent only achieved a perfect score when it had access to the MCP server in addition to the SDK, which finally provided the right context.
            </p>
            <p>
              The following table shows how the agent's score for each task varied based on the resources it could access:
            </p>

            <CorrectnessScorecard />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              The failures were invisible
            </h3>
            <p>
              What made the agent's overconfidence particularly bad was that none of the outdated code produced an error. There were no compile errors or type errors. We found the errors in the output at runtime.
            </p>
            <p>
              When an agent is confidently wrong and the code appears to work, it's hard to catch any problems.
            </p>

            <button
              onClick={() => navigateTo('vercel', onNavigate)}
              className="text-[13px] font-semibold text-crimson hover:underline font-sans"
            >
              SDKs can mislead agents →
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
              In the well-documented API benchmark, we chose an API with excellent documentation and strong representation in agent training data to test whether documentation quality alone is enough to stop agents from making things up.
            </p>
            <p>
              We also tried two different prompt styles to see whether writing more detailed prompts could close the gap.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              The agent invented constraints that don't exist
            </h3>
            <p>
              In every single run without MCP access, the agent fabricated at least one API limitation. It decided certain features weren't supported, wrote that into its code comments as if it were documented behavior, and then built workarounds for problems that weren't actually real.
            </p>
            <p>
              In the runs with MCP access, the agent didn't produce any fabricated constraints. When the agent had a tool to check something against, it checked. When it didn't, it just guessed and kept going.
            </p>
            <p>
              The table below shows what the agent claimed in each run and what was actually true:
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
              onClick={() => navigateTo('resend', onNavigate)}
              className="text-[13px] font-semibold text-crimson hover:underline font-sans"
            >
              Docs don't stop hallucinations →
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
              In the undocumented API benchmark, we tested what happens when you try to produce code for a private internal API with no public documentation at all, where the only way to understand the system is to read the code. We ran the same task (building a dashboard) with and without an MCP documentation server.
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
              With MCP, it built the right code in less than half the time
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
              onClick={() => navigateTo('agents', onNavigate)}
              className="text-[13px] font-semibold text-crimson hover:underline font-sans"
            >
              No docs, no chance →
            </button>
          </div>
        </Section>

        {/* ─── REPORTS ─── */}
        <Section
          id="reports"
          chapterLabel="Reports"
          headline="Read the reports"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                tab: 'docusign' as const,
                subtitle: 'DocuSign',
                label: 'Model capability beats tooling',
                description: 'All the agents completed the task, but code quality tracked model strength more than tool access. The same broken MCP helped the weakest model and hurt the middle one.',
              },
              {
                tab: 'vercel' as const,
                subtitle: 'Breaking changes benchmark',
                label: 'SDKs can mislead agents',
                description: 'Does version-specific documentation change what an agent builds when an SDK has breaking changes between versions?',
              },
              {
                tab: 'resend' as const,
                subtitle: 'Well-documented API benchmark',
                label: 'Docs don\'t stop hallucinations',
                description: 'Does great documentation prevent hallucinations, and can more detailed prompts close the gap that MCP covers?',
              },
              {
                tab: 'agents' as const,
                subtitle: 'Undocumented API benchmark',
                label: 'No docs, no chance',
                description: 'What happens when there is no public documentation at all? We tested agents against a private internal API with and without an MCP server.',
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
                    onClick={() => navigateTo(report.tab, onNavigate)}
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
