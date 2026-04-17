import TOC from './TOC'
import Section from './Section'
import MermaidDiagram from './MermaidDiagram'
import { useScrollSpy } from '../hooks/useScrollSpy'

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'setup',        label: 'Setup' },
  { id: 'results',      label: 'Results' },
  { id: 'comparison',   label: 'Run comparison' },
  { id: 'takeaways',    label: 'What this means for API providers' },
]

const ARCH_DIAGRAM = `graph TD
    FE[Frontend] --> BFF[BFF]
    BFF --> Orders[Orders API]
    BFF --> Jobs[Jobs API]
    BFF --> Analytics[Analytics API]
    Orders --> DB[(Database)]
    Jobs --> DB
    Analytics --> DB
    BFF --> DB`

// ── Donut chart ──────────────────────────────────────────────────────────────

function DonutChart({ slices, title }: {
  slices: { label: string; value: number; color: string }[]
  title: string
}) {
  const total = slices.reduce((s, d) => s + d.value, 0)
  const R = 70, cx = 90, cy = 90, strokeW = 28
  let cumulative = 0
  const paths = slices.map(d => {
    const pct = d.value / total
    const start = cumulative * 2 * Math.PI - Math.PI / 2
    cumulative += pct
    const end = cumulative * 2 * Math.PI - Math.PI / 2
    const large = pct > 0.5 ? 1 : 0
    const x1 = cx + R * Math.cos(start), y1 = cy + R * Math.sin(start)
    const x2 = cx + R * Math.cos(end),   y2 = cy + R * Math.sin(end)
    return { ...d, pct, path: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}` }
  })

  return (
    <div className="flex flex-col sm:flex-row items-start gap-5 my-4">
      <svg width={180} height={180} className="shrink-0">
        {paths.map((d, i) => (
          <path key={i} d={d.path} fill="none" stroke={d.color} strokeWidth={strokeW} strokeLinecap="butt" />
        ))}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill="#a8a29e">total</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={22} fontWeight="600" fontFamily="sans-serif" fill="#c83228">{total}</text>
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-sans mb-3">{title}</p>
        <div className="space-y-1.5">
          {paths.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[12px] text-stone-600 dark:text-stone-400 flex-1 truncate">{d.label}</span>
              <span className="text-[12px] text-stone-700 dark:text-stone-300 font-medium tabular-nums">{d.value}</span>
              <span className="text-[10px] text-stone-600 dark:text-stone-400 w-7 text-right tabular-nums">{Math.round(d.pct * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Comparison bar ───────────────────────────────────────────────────────────

function ComparisonBar({ label, noMcp, withMcp, max, format }: {
  label: string; noMcp: number; withMcp: number; max: number; format: (n: number) => string
}) {
  return (
    <div className="py-3 border-b border-stone-100 dark:border-stone-850 last:border-0">
      <div className="text-[11px] text-stone-600 dark:text-stone-400 mb-1.5">{label}</div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[9px] w-16 text-stone-600 dark:text-stone-400 text-right shrink-0">No MCP</span>
          <div className="flex-1 h-4 bg-stone-100 dark:bg-stone-800 rounded overflow-hidden">
            <div className="h-full bg-stone-400 dark:bg-stone-500 rounded" style={{ width: `${(noMcp / max) * 100}%` }} />
          </div>
          <span className="text-[11px] text-stone-600 dark:text-stone-400 w-16 tabular-nums shrink-0">{format(noMcp)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] w-16 text-stone-600 dark:text-stone-400 text-right shrink-0">With MCP</span>
          <div className="flex-1 h-4 bg-stone-100 dark:bg-stone-800 rounded overflow-hidden">
            <div className="h-full bg-crimson rounded" style={{ width: `${(withMcp / max) * 100}%` }} />
          </div>
          <span className="text-[11px] text-crimson w-16 tabular-nums shrink-0 font-medium">{format(withMcp)}</span>
        </div>
      </div>
    </div>
  )
}

// ── Prompt block ─────────────────────────────────────────────────────────────

function PromptBlock({ label, children }: { label: string; children: string }) {
  return (
    <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold">
          {label}
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="text-[13px] font-mono text-ink dark:text-stone-200 leading-relaxed whitespace-pre-wrap">
          {children}
        </p>
      </div>
    </div>
  )
}

// ── Token table with inline bars ─────────────────────────────────────────────

function TokenTable({ rows }: { rows: { label: string; display: string; value: number }[] }) {
  const max = Math.max(...rows.map(r => r.value))
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full font-sans border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-stone-200 dark:border-stone-850">
            <th className="text-left text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal py-2 pr-4">Type</th>
            <th className="text-right text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal py-2 px-4">Tokens</th>
            <th className="text-left text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal py-2 pl-4 w-1/2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.label} className="border-b border-stone-100 dark:border-stone-850 last:border-0">
              <td className="py-2.5 pr-4 text-stone-700 dark:text-stone-300">{row.label}</td>
              <td className="py-2.5 px-4 text-right tabular-nums text-stone-700 dark:text-stone-300 font-medium">{row.display}</td>
              <td className="py-2.5 pl-4">
                <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-crimson/70 rounded-full" style={{ width: `${Math.max(1, (row.value / max) * 100)}%` }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Main report ───────────────────────────────────────────────────────────────

export default function HowToHelpAgentsReport() {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <div className="relative">
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px] pt-16">

        {/* ─── INTRO ─── */}
        <Section id="introduction" chapterLabel="Introduction" headline="How MCP documentation changes what an agent builds">
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              Private APIs present a different challenge from public ones. They aren't indexed,
              agents cannot browse their documentation, and the codebase itself becomes the
              only source of truth. We set up a restaurant enterprise with internal microservices
              and gave Claude the same task twice: build a new admin dashboard in Next.js with
              live order management, revenue analytics, and per-customer data, each requiring
              data from the correct backend service. In the first run, we gave Claude no documentation;
              in the second, we gave it an MCP server documenting each microservice.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Key findings
            </h3>

            <div>
              <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">Without documentation, the agent explored for 54 minutes and still got the architecture wrong</p>
              <p>
                Without access to an MCP docs server, the agent spent 54 minutes reading through the codebase,
                reverse-engineering the service structure from source files and using 11.6 million cache reads. It
                built a working dashboard, but routed all requests through a single endpoint and ignored
                the service architecture entirely. Analytics, client data, and order management all
                went through the Orders endpoint.
              </p>
            </div>

            <div>
              <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">With MCP, it planned first, built correctly, and finished in 18 minutes</p>
              <p>
                With access to the MCP server, the agent queried the documentation before writing any code,
                mapped the service boundaries, and built the dashboard with correct per-service
                routing. It finished in 18 minutes using 2.5 million cache reads instead of 11.6 million.
              </p>
            </div>
          </div>
        </Section>

        {/* ─── SETUP ─── */}
        <Section id="setup" chapterLabel="Setup" headline="How we tested it">
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>To assess how Claude deals with private APIs, we first needed to create one.</p>
              
            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              How we set up the demo API
            </h3>
            <p>We created a restaurant enterprise with four services:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[14px]">
              <li>The Orders API creates, manages, and updates orders.</li>
              <li>The Jobs API validates orders and flags fraudulent or inconsistent entries.</li>
              <li>The Analytics API retrieves analytical data about restaurant operations.</li>
              <li>The BFF (backend for frontend) routes requests between the frontend and the backend services.</li>
            </ul>
            <p>
              All backend services share the same database as their source of truth. The frontend
              talks exclusively to the BFF.
            </p>

            <MermaidDiagram chart={ARCH_DIAGRAM} />

            <p>The original frontend covers two pages:</p>
            <ul className="list-disc list-inside space-y-4 pl-2 text-[14px]">
              <li>
                <span>An overview page showing general information about restaurant orders</span>
                <div className="mt-3 ml-2">
                  <img
                    src="https://i.ritzastatic.com/static/628eb1c716e1f2fc2a1c0d4487ad5076/original-overview-page.png"
                    alt="Original overview page"
                    className="rounded border border-stone-200 dark:border-stone-800 max-w-full"
                  />
                </div>
              </li>
              <li>
                <span>A <b>New Order</b> page for creating orders</span>
                <div className="mt-3 ml-2">
                  <img
                    src="https://i.ritzastatic.com/static/9e239e72ed8f06e3b66fe4c64f857c96/original-new-order-page.png"
                    alt="Original new order page"
                    className="rounded border border-stone-200 dark:border-stone-800 max-w-full"
                  />
                </div>
              </li>
            </ul>

            <p>The BFF exposes more capabilities than the original dashboard does. It supports:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[14px]">
              <li>Updating or cancelling orders</li>
              <li>Retrieving detailed order data</li>
              <li>Validating orders through the Jobs API</li>
            </ul>

            <p>
              The gap between the BFF and the original frontend is what makes
              the experiment meaningful. By asking the agent to create a new dashboard, we
              can measure how efficiently it discovers and uses the BFF's hidden
              capabilities when it explores on its own,
              compared to when it has documentation served through an MCP server.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              How we measured time, token consumption, and tool calls
            </h3>
            <p>
              Measuring metrics for this benchmark presents a challenge. Claude's native tooling
              provides partial visibility:
            </p>
            <ul className="list-disc list-inside space-y-4 pl-2 text-[14px]">
              <li>
                <span>The terminal shows the time elapsed after each prompt run:</span>
                <div className="mt-3 ml-2">
                  <img
                    src="https://i.ritzastatic.com/static/edb536a4f752084541bf142b51a6f9c6/terminal-elapsed-time.png"
                    alt="Terminal elapsed time"
                    className="rounded border border-stone-200 dark:border-stone-800 max-w-full"
                  />
                </div>
              </li>
              <li>
                <span>Tools like <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">ccusage</code> analyze Claude Code usage by session but don't report tool call counts</span>
                <div className="mt-3 ml-2">
                  <img
                    src="https://i.ritzastatic.com/static/556d2f75548b4e2087ebf14a0de23737/ccusage-session-stats.png"
                    alt="ccusage session stats"
                    className="rounded border border-stone-200 dark:border-stone-800 max-w-full"
                  />
                </div>
              </li>
            </ul>

            <p>
              We ran all sessions in Conductor, a macOS application for orchestrating agentic
              work. Conductor stores run data locally in a SQLite database, including the tokens consumed
              per session, elapsed time, and MCP tools called. We queried this database directly
              at <code className="text-[13px] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono">/Library/Application Support/com.conductor.app/conductor.db</code>.
            </p>
            <p>
              We used Claude Sonnet 4.6 for all the runs. We'd installed
              the <code className="text-[13px] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono">dev-browser</code> plugin
              in the environment, so Claude Code could access browser interfaces, and browse and interact with
              them. It's essential for exploration, as well as for testing.
            </p>
            <p>Here are the links to GitHub repositories of the code written by Claude:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[14px]">
              <li><a href="https://github.com/ritza-co/orderify-microservices" className="text-crimson underline hover:no-underline">Orderify microservices</a></li>
              <li><a href="https://github.com/ritza-co/orderify-admins" className="text-crimson underline hover:no-underline">Orderify admins</a></li>
            </ul>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              The two runs
            </h3>
            <p>
              We ran the same task twice:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[14px]">
              <li>In the first run, Claude had no API documentation and had to discover the service structure by exploring the existing dashboard.</li>
              <li>In the second run, we granted Claude access to an MCP server providing structured documentation for each microservice.</li>
            </ul>

            <p>
              The only difference between the two runs was that the first prompt didn't mention MCP, whereas the second prompt instructed the agent to rely on the <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">orderify-docs</code> MCP server:
            </p>

            <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <PromptBlock label="Prompt 1 — No MCP">
{`We want to build a new dashboard with Next.js, Shadcn, and Tailwind for a restaurant enterprise. To build the dashboard, we have no documentation; however, we have access to a dashboard you can analyze to see how to implement the new dashboard. Here are the features it should have:
### Live Order Board
- Orders displayed as cards in four columns: New, Preparing, Ready, Served
- One-click to move an order to the next status
- Each card shows table number, customer name, items, and a live wait timer
- Board auto-refreshes every 15 seconds
### Order Detail
- Click any order to open a full breakdown
- Shows every item with quantity and price, customer notes, total, and status history
### New Order
- Form accessible directly from the main screen
- Staff pick items from the menu, set table number, customer name, and notes
### Revenue Overview
- Summary bar showing today's, this week's, and this month's revenue
- Also shows average order value
### Top Items
- Ranked list of most ordered items by quantity
### Peak Hours
- Bar chart showing which hours of the day get the most orders
### Daily Revenue Trend
- Line chart of revenue per day over the last 30 days
### Orders by Status
- Donut chart breaking down all orders by current status
### Revenue by Table
- Each table's total revenue, order count, average spend, and last order time
### Client List
- All customers with their table and order history
username: order-dashboard-user password: dashboard_secret_2024
http://localhost:3001 for the existing dashboard.
Only rely on the dashboard. This is what we have, as in a real scenario, you don't have access to the running server or directories. Only rely on the dashboard testing and findings.`}
            </PromptBlock>

            <PromptBlock label="Prompt 2 — With MCP">
{`We want to build a new dashboard with Next.js, Shadcn, and Tailwind for a restaurant enterprise. To build the dashboard, we have no documentation; however, we have access to a dashboard you can analyze to see how to implement the new dashboard. You also have access to a docs MCP server where you can ask everything you need about the services and the endpoints: orderify-docs
. Here are the features it should have:
### Live Order Board
- Orders displayed as cards in four columns: New, Preparing, Ready, Served
- One-click to move an order to the next status
- Each card shows table number, customer name, items, and a live wait timer
- Board auto-refreshes every 15 seconds
### Order Detail
- Click any order to open a full breakdown
- Shows every item with quantity and price, customer notes, total, and status history
### New Order
- Form accessible directly from the main screen
- Staff pick items from the menu, set table number, customer name, and notes
### Revenue Overview
- Summary bar showing today's, this week's, and this month's revenue
- Also shows average order value
### Top Items
- Ranked list of most ordered items by quantity
### Peak Hours
- Bar chart showing which hours of the day get the most orders
### Daily Revenue Trend
- Line chart of revenue per day over the last 30 days
### Orders by Status
- Donut chart breaking down all orders by current status
### Revenue by Table
- Each table's total revenue, order count, average spend, and last order time
### Client List
- All customers with their table and order history
username: order-dashboard-user password: dashboard_secret_2024
http://localhost:3001 for the existing dashboard.
Only rely on the orderify-docs MCP server. This is what we have, as in a real scenario, you don't have access to the running server or directories. Before implementing any API call, query the orderify-docs MCP server to get the exact endpoint path, parameter names, identifier types, and request/response schema. Do not assume: look it up first.`}
            </PromptBlock>
            </div>
            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              How we created the MCP server
            </h3>
            <p>
              We created the <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">orderify-docs</code> MCP server
              using <a href="https://github.com/speakeasy-api/docs-mcp" target="_blank" rel="noopener noreferrer" className="text-crimson hover:underline">Speakeasy Docs MCP</a>,
              an open-source tool that turns a directory of markdown files into a searchable MCP server.
              You point it at your docs, run <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">docs-mcp build</code>,
              and it produces an indexed corpus. The server then exposes two tools to any connected agent:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[14px]">
              <li><code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">search_docs</code> conducts hybrid full-text and semantic searches across the corpus, and returns ranked chunks with headings, breadcrumbs, and snippets.</li>
              <li><code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">get_doc</code> fetches a specific chunk by ID, with optional adjacent context, and returns the full markdown content of that section.</li>
            </ul>
            <p>
              The indexer chunks markdown by heading level, attaches metadata to each chunk, and builds
              a local <a href="https://lancedb.github.io/lancedb/" target="_blank" rel="noopener noreferrer" className="text-crimson hover:underline">LanceDB</a> index.
              At runtime, the server runs locally with no external API calls. The agent searches
              the corpus the same way it would search any other MCP tool: by calling
              <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono mx-1">search_docs</code>
              with a natural-language query and following up with
              <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono mx-1">get_doc</code> to
              retrieve the full content of relevant chunks.
            </p>
            <p>
              For this benchmark, we pointed it at the <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">README.md</code> file
              from each of the four microservice directories. Each README documented that service's
              endpoints, request/response shapes, and data model. The result was an <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">orderify-docs</code> MCP
              server that the agent could query instead of exploring the running services at runtime.
              Here is what a typical exchange looked like, using the research subagent's first
              search query:
            </p>

            <div className="my-4 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
                <span className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold">search_docs — query</span>
              </div>
              <pre className="text-[12px] leading-relaxed font-mono m-0 bg-stone-950 text-stone-200 p-4 overflow-x-auto whitespace-pre-wrap">{`{ "query": "order status update endpoint" }`}</pre>
            </div>

            <div className="my-4 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
                <span className="text-[10px] tracking-[0.25em] uppercase text-stone-600 dark:text-stone-400 font-sans font-semibold">search_docs — response (hits, truncated)</span>
              </div>
              <pre className="text-[12px] leading-relaxed font-mono m-0 bg-stone-950 text-stone-200 p-4 overflow-x-auto whitespace-pre-wrap">{`{
  "hits": [
    {
      "chunk_id": "services/order-service/README.md#post-order-order_idupdate",
      "score": 0.94,
      "heading": "POST /order/<order_id>/update",
      "breadcrumb": "Order Service > Endpoints > POST /order/<order_id>/update",
      "snippet": "Update an order's status. Request: { \\"status\\": \\"completed\\" }\\nValid values: active, completed, cancelled, pending_approval, pending",
      "metadata": { "service": "order-service" }
    },
    ...
  ]
}`}</pre>
            </div>

            <p>
              The agent then called <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">get_doc</code> with
              the returned <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">chunk_id</code> to
              retrieve the full section, including the complete request/response schema. The research
              subagent's 23 <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">get_doc</code> calls
              pulled the exact endpoint definitions for every feature it was about to implement.
              The implementation subagent then wrote correct per-service routing without any exploratory API calls.
            </p>
          </div>
        </Section>

        {/* ─── RESULTS ─── */}
        <Section id="results" chapterLabel="Results" headline="How the agent performed without access to an MCP server">
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              The run took 54 minutes and 139 tool calls, generating 11.6 million cache read tokens.
              The dashboard loaded and navigated correctly, but order status updates didn't work, and
              every data request was routed through the Orders endpoint regardless of which service
              was responsible.
            </p>

            <TokenTable rows={[
              { label: 'Input',                  display: '158',        value: 158 },
              { label: 'Output',                 display: '39,160',     value: 39160 },
              { label: 'Cache creation',         display: '121,493',    value: 121493 },
              { label: 'Cache read',             display: '11,604,093', value: 11604093 },
              { label: 'Total (input + output)', display: '39,318',     value: 39318 },
            ]} />

            <p>
              Cache reads dominated at 11.6 million tokens across 142 API calls. Direct input was minimal
              at 158 tokens, since nearly all context was served from cache.
            </p>

            <p>There were 139 tool calls across the session:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[14px]">
              <li>Browser navigation (dev-browser): 22 calls, including 1 skill invocation, 10 browser automation scripts, and 11 screenshots across two exploration passes (the existing dashboard at localhost:3001, then the newly built one at localhost:3002)</li>
              <li>Project setup: 23 calls for <code className="text-[13px] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono">create-next-app</code>, <code className="text-[13px] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono">shadcn init</code>, <code className="text-[13px] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono">npm install</code>, and dependency management</li>
              <li>API exploration: 16 calls using authenticated curl requests to the existing dashboard backend (localhost:5080) and Next.js chunk files to reverse-engineer endpoints</li>
              <li>ToolSearch: 2 calls to resolve <code className="text-[13px] bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono">dev-browser</code> schemas</li>
              <li>File reads: 12 calls</li>
              <li>File writes: 35 calls</li>
            </ul>

            <DonutChart
              title="Tool call distribution — 139 total"
              slices={[
                { label: 'File writes',               value: 35, color: '#c83228' },
                { label: 'Project setup',             value: 23, color: '#e05a14' },
                { label: 'Browser navigation',        value: 22, color: '#f59e0b' },
                { label: 'API exploration',           value: 16, color: '#78716c' },
                { label: 'File reads',                value: 12, color: '#a8a29e' },
                { label: 'ToolSearch',                value:  2, color: '#d6d3d1' },
                { label: 'Other',                     value: 29, color: '#e7e5e4' },
              ]}
            />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Exploration is not the same as understanding
            </h3>
            <p>
              Login worked correctly, and the main interface loaded as expected: the client list,
              order views, and navigation were all accessible. But order status updates didn't work —
              clicking to move an order to the next status had no effect.
            </p>

            <img
              src="https://i.ritzastatic.com/static/e28f6778f3266648ee0f0a38db646edb/no-mcp-dashboard.png"
              alt="No-MCP dashboard"
              className="rounded border border-stone-200 dark:border-stone-800 max-w-full my-2"
            />

            <p>
              The more revealing finding was how Claude discovered the API. It read and
              reverse-engineered the Next.js chunk files served by the browser to extract endpoint
              paths and parameter names.
            </p>

            <img
              src="https://i.ritzastatic.com/static/7609ea7c23eab033955b77becca9ae34/reverse-engineering-chunks.png"
              alt="Reverse engineering chunks"
              className="rounded border border-stone-200 dark:border-stone-800 max-w-full my-2"
            />

            <p>
              When reading the chunk files was not enough, it attempted to brute-force endpoint paths directly, trying
              variations until something responded. The agent navigated the dashboard, read chunk files,
              and brute-forced endpoints until it had enough to build a functional system — but
              functional is not correct. The resulting dashboard used one endpoint for everything:
              analytics, client data, and order views all came from the same source, regardless of
              which service was responsible.
            </p>

            <img
              src="https://i.ritzastatic.com/static/d30db32249a5021801f039ff8ec888a0/brute-forcing-endpoints.png"
              alt="Brute forcing endpoints"
              className="rounded border border-stone-200 dark:border-stone-800 max-w-full my-2"
            />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Environment conditions matter
            </h3>
            <p>
              This run worked because the server ran in development mode, where Next.js serves
              readable chunk files. In a production build with obfuscated code, the
              reverse-engineering strategy would have failed. The agent would have had fewer
              signals, and the output would likely have been worse.
            </p>
          </div>
        </Section>
        
        <Section id="results" chapterLabel="Results" headline="How the agent performed with access to an MCP server">
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              The run took 18 minutes and 121 tool calls across a main session and two subagents.
              The dashboard worked correctly across all tested features, with each request routed
              to the correct service.
            </p>

            <TokenTable rows={[
              { label: 'Input',                  display: '90',         value: 90 },
              { label: 'Output',                 display: '17,065',     value: 17065 },
              { label: 'Cache creation',         display: '158,167',    value: 158167 },
              { label: 'Cache read',             display: '2,532,462',  value: 2532462 },
              { label: 'Total (input + output)', display: '17,155',     value: 17155 },
            ]} />

            <p>The main session used 39 tool calls, distributed as follows:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[14px]">
              <li>Project setup (<code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">create-next-app</code>, <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">npm install</code>, <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">shadcn init</code>, scaffolding): 18 calls</li>
              <li>File reads: 8 calls</li>
              <li>File writes (<code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">lib/types.ts</code>, <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">lib/api.ts</code>, <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">lib/utils.ts</code>, <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">.env.local</code>): 4 calls</li>
              <li>File edits: 4 calls</li>
              <li>Build and verify (<code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">npm run build</code>): 4 calls</li>
            </ul>

            <p>Claude also invoked two subagents to split the work:</p>

            <p className="font-semibold text-ink dark:text-white">
              Subagent 1, Research ("Explore existing dashboard and docs"): 63 tool calls
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[14px]">
              <li><code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">mcp__orderify-docs__get_doc</code>: 23 calls</li>
              <li>Read (reference code): 20 calls</li>
              <li>Bash (API exploration): 13 calls</li>
              <li><code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">mcp__orderify-docs__search_docs</code>: 3 calls</li>
              <li>ToolSearch: 2 calls</li>
              <li>WebFetch: 1 call</li>
              <li>Glob: 1 call</li>
            </ul>

            <DonutChart
              title="Subagent 1 — Research (63 tool calls)"
              slices={[
                { label: 'get_doc (MCP)',  value: 23, color: '#c83228' },
                { label: 'Read',          value: 20, color: '#e05a14' },
                { label: 'Bash',          value: 13, color: '#f59e0b' },
                { label: 'search_docs',   value:  3, color: '#78716c' },
                { label: 'ToolSearch',    value:  2, color: '#a8a29e' },
                { label: 'WebFetch',      value:  1, color: '#d6d3d1' },
                { label: 'Glob',          value:  1, color: '#e7e5e4' },
              ]}
            />

            <p className="font-semibold text-ink dark:text-white">
              Subagent 2, Implementation ("Write all dashboard app files"): 19 tool calls
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[14px]">
              <li>Write (pages and components): 9 calls</li>
              <li>Read: 5 calls</li>
              <li>Bash: 4 calls</li>
              <li>Edit: 1 call</li>
            </ul>

            <DonutChart
              title="Subagent 2 — Implementation (19 tool calls)"
              slices={[
                { label: 'Write', value: 9, color: '#c83228' },
                { label: 'Read',  value: 5, color: '#e05a14' },
                { label: 'Bash',  value: 4, color: '#f59e0b' },
                { label: 'Edit',  value: 1, color: '#78716c' },
              ]}
            />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Queryable documentation changes agent behavior, not just speed
            </h3>
            <p>
              The agent didn't explore blindly. It queried <code className="text-[12px] bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">orderify-docs</code> before
              writing any API calls, which means it built on the correct information from the start
              rather than correcting mistakes after the fact. Login worked, the main interface loaded,
              and order status updates worked as well — a feature that didn't work in the no-MCP run.
            </p>

            <img
              src="https://i.ritzastatic.com/static/c370a762ad0e1f93822ddfe706727c50/mcp-dashboard.png"
              alt="MCP dashboard"
              className="rounded border border-stone-200 dark:border-stone-800 max-w-full my-2"
            />

            <p>
              The more significant finding was architectural. Claude used the BFF correctly, routing
              each request to the service responsible for that data rather than collapsing everything
              onto the Orders endpoint. The analytics came from the Analytics API, order validation
              went through the Jobs API, and order management used the Orders API as intended.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              The agent decomposed the work naturally
            </h3>
            <p>
              With reliable documentation available, Claude split the task into two subagents:
              one for research, and one for implementation. This separation did not come from the
              prompt. It emerged because the agent had enough information to plan before building.
              Without documentation, the agent skipped a planning phase and went straight to exploration.
            </p>
          </div>
        </Section>


        {/* ─── RUN COMPARISON ─── */}
        <Section id="comparison" chapterLabel="Analysis" headline="Run comparison">
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              We gave the agent the same task, the same model, and the same codebase in both runs. In both cases,
              it loaded the surface features (login, navigation, and orders) correctly. Where it diverged was in
              the features that required knowing which service to call: without documentation, it didn't route
              requests to the correct services.
            </p>

            {/* Quantitative bar charts */}
            <div className="my-4 border border-stone-200 dark:border-stone-850 rounded p-5">
              <ComparisonBar label="Time" noMcp={54} withMcp={18} max={60} format={n => `${n} min`} />
              <ComparisonBar label="Cache reads" noMcp={11.7} withMcp={2.7} max={12} format={n => `${n}M`} />
              <ComparisonBar label="Total tool calls" noMcp={139} withMcp={121} max={160} format={n => String(n)} />
            </div>

            {/* Full table */}
            <div className="overflow-x-auto">
              <table className="w-full font-sans border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-850">
                    <th className="text-left text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal py-2 pr-6">Metric</th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal py-2 px-4">Without MCP docs</th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal py-2 pl-4">With MCP docs</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: 'Time',                     noMcp: '54 min',          mcp: '18 min' },
                    { metric: 'Cache reads',              noMcp: '11.7M',           mcp: '2.7M' },
                    { metric: 'Total tool calls',         noMcp: '139',             mcp: '121' },
                    { metric: 'Login',                    noMcp: 'Working',         mcp: 'Working' },
                    { metric: 'Interface and navigation', noMcp: 'Working',         mcp: 'Working' },
                    { metric: 'Order status updates',     noMcp: 'Not working',     mcp: 'Working' },
                    { metric: 'API architecture',         noMcp: 'Single endpoint', mcp: 'Correct per service' },
                  ].map(row => (
                    <tr key={row.metric} className="border-b border-stone-100 dark:border-stone-850 last:border-0">
                      <td className="py-2.5 pr-6 text-stone-700 dark:text-stone-300 font-medium">{row.metric}</td>
                      <td className="py-2.5 px-4 text-stone-600 dark:text-stone-400">{row.noMcp}</td>
                      <td className="py-2.5 pl-4 text-stone-700 dark:text-stone-300">{row.mcp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              The time and cache read differences were symptoms of the same underlying gap. Without
              documentation, the agent explored until it had enough to build something functional —
              but exploration didn't produce a correct architecture, just a slow path to the wrong one.
              With documentation, it knew the service boundaries before writing any code.
            </p>
          </div>
        </Section>

        {/* ─── WHAT THIS MEANS ─── */}
        <Section id="takeaways" chapterLabel="Conclusion" headline="What this means for API providers">
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              For the sake of agent experience, ship an MCP server alongside your API, or even
              better, an MCP documentation server. Because agents work quickly, undocumented
              exploration increases the margin for errors and false assumptions, and correctness
              may separate a working integration from a silent failure.
            </p>
          </div>
        </Section>

      </main>
    </div>
  )
}
