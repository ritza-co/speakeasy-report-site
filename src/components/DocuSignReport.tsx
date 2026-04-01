import { useState } from 'react'
import TOC from './TOC'
import Section from './Section'
import ToolCallSequence from './ToolCallSequence'
import TestEnvironmentCard from './TestEnvironmentCard'
import { useScrollSpy } from '../hooks/useScrollSpy'

const SECTIONS = [
  { id: 'hypothesis',   label: 'Hypothesis' },
  { id: 'methodology',  label: 'Methodology' },
  { id: 'overview',     label: 'Overview' },
  { id: 'workflow',     label: 'Workflow' },
  { id: 'tool-content', label: 'What the tools returned' },
  { id: 'code',         label: 'Code quality' },
  { id: 'conclusion',   label: 'Conclusion' },
]

const TASK_LINES = [
  `Use DocuSign to send a short contract document to a recipient for their signature. The recipient should receive an email asking them to sign it.`,
  `When the script runs successfully, print the envelope ID.`,
  `Make sure to run and test your code to verify it works.`,
  `Your credentials are provided in a .env file in this folder.`,
  `You only have access to the files within this folder. Do not read files outside this folder.`,
]

function TaskCompare() {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* No-MCP */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <span className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold">
            No-MCP prompt
          </span>
        </div>
        <div className="px-4 py-4 space-y-3">
          {TASK_LINES.map((line, i) => (
            <p key={i} className="text-[13px] font-mono text-ink dark:text-stone-200 leading-relaxed">{line}</p>
          ))}
          <p className="text-[13px] font-mono text-ink dark:text-stone-200 leading-relaxed">
            <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">You also have access to the web search tool</span>
            {` if needed.`}
          </p>
        </div>
      </div>

      {/* MCP */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <span className="text-[10px] tracking-[0.25em] uppercase text-crimson font-sans font-semibold">
            MCP prompt
          </span>
        </div>
        <div className="px-4 py-4 space-y-3">
          {TASK_LINES.map((line, i) => (
            <p key={i} className="text-[13px] font-mono text-ink dark:text-stone-200 leading-relaxed">{line}</p>
          ))}
          <p className="text-[13px] font-mono text-ink dark:text-stone-200 leading-relaxed">
            <span className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">You also have access to the web search tool and the DocuSign MCP server</span>
            {` if needed.`}
          </p>
        </div>
      </div>
    </div>
  )
}

function GistLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[13px] text-crimson hover:underline font-sans"
    >
      {label} →
    </a>
  )
}

function SessionLinks() {
  const sessions = [
    { run: 'haiku-no-mcp',  href: 'https://gisthost.github.io/?03739716d9df6893fd6bd28913d8c088/index.html' },
    { run: 'haiku-mcp',     href: 'https://gisthost.github.io/?62a38f4a4546d315204ebe189b9c47e6/index.html' },
    { run: 'sonnet-no-mcp', href: 'https://gisthost.github.io/?7f399efa2d7d90218e3747583bdf8550/index.html' },
    { run: 'sonnet-mcp',    href: 'https://gisthost.github.io/?4051629166b094536a29fbb9ebd90b27/index.html' },
    { run: 'opus-no-mcp',   href: 'https://gisthost.github.io/?ea3dbb266159a430add48d3533f2b3d7/index.html' },
    { run: 'opus-mcp',      href: 'https://gisthost.github.io/?3e4cc09bddf58665a39823f7c322fb66/index.html' },
  ]
  return (
    <div className="my-6 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-sans font-semibold">
          Full session transcripts
        </span>
      </div>
      <div className="px-4 py-3 grid grid-cols-2 gap-2">
        {sessions.map(({ run, href }) => (
          <GistLink key={run} label={run} href={href} />
        ))}
      </div>
    </div>
  )
}

// ─── Workflow tab data ───────────────────────────────────────────────────────

const GIST_HAIKU_NO_MCP  = 'https://gisthost.github.io/?03739716d9df6893fd6bd28913d8c088'
const GIST_HAIKU_MCP     = 'https://gisthost.github.io/?62a38f4a4546d315204ebe189b9c47e6'
const GIST_SONNET_NO_MCP = 'https://gisthost.github.io/?7f399efa2d7d90218e3747583bdf8550'
const GIST_SONNET_MCP    = 'https://gisthost.github.io/?4051629166b094536a29fbb9ebd90b27'
const GIST_OPUS_NO_MCP   = 'https://gisthost.github.io/?ea3dbb266159a430add48d3533f2b3d7'
const GIST_OPUS_MCP      = 'https://gisthost.github.io/?3e4cc09bddf58665a39823f7c322fb66'

const HAIKU_NO_MCP_CALLS = [
  { tool: 'Read / Glob',    description: 'Read task.md, .env, check for existing .py files', outcome: 'neutral' as const, href: `${GIST_HAIKU_NO_MCP}/page-001.html#msg-0013` },
  { tool: 'Write',          description: 'Write send_contract.py — na4.docusign.net', outcome: 'neutral' as const, href: `${GIST_HAIKU_NO_MCP}/page-001.html#msg-0016` },
  { tool: 'Bash',           description: 'Run script — 401 Unauthorized', outcome: 'failed' as const, href: `${GIST_HAIKU_NO_MCP}/page-001.html#msg-0023` },
  { tool: 'WebSearch',      description: 'Search DocuSign API authentication bearer token 2026', outcome: 'neutral' as const, href: `${GIST_HAIKU_NO_MCP}/page-001.html#msg-0031` },
  { tool: 'WebFetch ×2',   description: 'Fetch two DocuSign auth docs pages — no sandbox URL mentioned', outcome: 'failed' as const, href: `${GIST_HAIKU_NO_MCP}/page-001.html#msg-0034` },
  { tool: 'Bash ×10',      description: 'Inline tests: vary base URL (na3, na4, eu, sandbox.docusign.net) — all 401', outcome: 'failed' as const, href: `${GIST_HAIKU_NO_MCP}/page-001.html#msg-0045` },
  { tool: 'Bash',           description: 'Inline test against demo.docusign.net — 200 OK', outcome: 'found' as const, href: `${GIST_HAIKU_NO_MCP}/page-001.html#msg-0070` },
  { tool: 'Edit',           description: 'Update base URL to demo.docusign.net', outcome: 'neutral' as const, href: `${GIST_HAIKU_NO_MCP}/page-001.html#msg-0072` },
  { tool: 'Bash',           description: 'Run script — envelope sent', outcome: 'found' as const, href: `${GIST_HAIKU_NO_MCP}/page-001.html#msg-0077` },
]

const HAIKU_MCP_CALLS = [
  { tool: 'Read / Glob',    description: 'Read task.md, .env, check for existing .py files', outcome: 'neutral' as const, href: `${GIST_HAIKU_MCP}/page-001.html#msg-0002` },
  { tool: 'searchDocusignDocs ×3', description: 'Three MCP queries — all responses 57–77KB, unreadable', outcome: 'failed' as const, href: `${GIST_HAIKU_MCP}/page-001.html#msg-0012` },
  { tool: 'Write',          description: 'Write send_contract.py — demo.docusign.net (from training data or preview fragment)', outcome: 'neutral' as const, href: `${GIST_HAIKU_MCP}/page-001.html#msg-0024` },
  { tool: 'Bash',           description: 'Run script — envelope sent on first attempt', outcome: 'found' as const, href: `${GIST_HAIKU_MCP}/page-001.html#msg-0040` },
]

const SONNET_NO_MCP_CALLS = [
  { tool: 'Bash',           description: 'Read task.md and .env in one command', outcome: 'neutral' as const, href: `${GIST_SONNET_NO_MCP}/page-001.html#msg-0005` },
  { tool: 'Write',          description: 'Write send_contract.py — na4.docusign.net', outcome: 'neutral' as const, href: `${GIST_SONNET_NO_MCP}/page-001.html#msg-0010` },
  { tool: 'Bash',           description: 'Run script — 401 Unauthorized', outcome: 'failed' as const, href: `${GIST_SONNET_NO_MCP}/page-001.html#msg-0015` },
  { tool: 'Bash',           description: 'Call account.docusign.com/oauth/userinfo — 401', outcome: 'failed' as const, href: `${GIST_SONNET_NO_MCP}/page-001.html#msg-0017` },
  { tool: 'Bash',           description: 'Call account-d.docusign.com/oauth/userinfo — 200, returns base URI', outcome: 'found' as const, href: `${GIST_SONNET_NO_MCP}/page-001.html#msg-0025` },
  { tool: 'Edit',           description: 'Update base URL to demo.docusign.net', outcome: 'neutral' as const, href: `${GIST_SONNET_NO_MCP}/page-001.html#msg-0028` },
  { tool: 'Bash',           description: 'Run script — envelope sent', outcome: 'found' as const, href: `${GIST_SONNET_NO_MCP}/page-001.html#msg-0030` },
]

const SONNET_MCP_CALLS = [
  { tool: 'Read / Glob',   description: 'Read task.md and .env, list directory', outcome: 'neutral' as const, href: `${GIST_SONNET_MCP}/page-001.html#msg-0002` },
  { tool: 'searchDocusignDocs ×2', description: 'Two MCP queries — both 68–83KB, unreadable', outcome: 'failed' as const, href: `${GIST_SONNET_MCP}/page-001.html#msg-0011` },
  { tool: 'Write',         description: 'Write send_contract.py — na4.docusign.net', outcome: 'neutral' as const, href: `${GIST_SONNET_MCP}/page-001.html#msg-0016` },
  { tool: 'Bash',          description: 'Run script — 401 Unauthorized', outcome: 'failed' as const, href: `${GIST_SONNET_MCP}/page-001.html#msg-0021` },
  { tool: 'Bash',          description: 'Call account-d.docusign.com/oauth/userinfo — 200, returns base URI', outcome: 'found' as const, href: `${GIST_SONNET_MCP}/page-001.html#msg-0027` },
  { tool: 'Edit',          description: 'Update base URL to demo.docusign.net', outcome: 'neutral' as const, href: `${GIST_SONNET_MCP}/page-001.html#msg-0029` },
  { tool: 'Bash',          description: 'Run script — envelope sent', outcome: 'found' as const, href: `${GIST_SONNET_MCP}/page-001.html#msg-0031` },
]

const OPUS_NO_MCP_CALLS = [
  { tool: 'Read',          description: 'Read task.md and .env', outcome: 'neutral' as const, href: `${GIST_OPUS_NO_MCP}/page-001.html#msg-0004` },
  { tool: 'Bash ×2',      description: 'Check requests and dotenv are importable', outcome: 'neutral' as const, href: `${GIST_OPUS_NO_MCP}/page-001.html#msg-0015` },
  { tool: 'Write',         description: 'Write send_envelope.py — demo.docusign.net, anchor-based tabs', outcome: 'neutral' as const, href: `${GIST_OPUS_NO_MCP}/page-001.html#msg-0021` },
  { tool: 'Bash',          description: 'Run script — envelope sent on first attempt', outcome: 'found' as const, href: `${GIST_OPUS_NO_MCP}/page-001.html#msg-0023` },
]

const OPUS_MCP_CALLS = [
  { tool: 'Read',          description: 'Read .env and task.md', outcome: 'neutral' as const, href: `${GIST_OPUS_MCP}/page-002.html#msg-0007` },
  { tool: 'searchDocusignDocs', description: 'One MCP query — 65.9KB, unreadable', outcome: 'failed' as const, href: `${GIST_OPUS_MCP}/page-002.html#msg-0015` },
  { tool: 'Write',         description: 'Write send_envelope.py — demo.docusign.net, anchor-based tabs', outcome: 'neutral' as const, href: `${GIST_OPUS_MCP}/page-002.html#msg-0018` },
  { tool: 'Bash',          description: 'Run script — envelope sent on first attempt', outcome: 'found' as const, href: `${GIST_OPUS_MCP}/page-002.html#msg-0023` },
]

const WORKFLOW_TABS = [
  {
    id: 'haiku',
    label: 'Haiku',
    summary: 'Haiku hit the wrong environment and iterated its way out, trying different base URLs until one worked. Without MCP, that took 27 tool calls. With MCP, the truncated preview was enough to suggest the right address upfront, cutting the session nearly in half. The MCP server didn\'t fix the root problem; it just happened to contain a clue.',
    noCalls: HAIKU_NO_MCP_CALLS,
    mcpCalls: HAIKU_MCP_CALLS,
  },
  {
    id: 'sonnet',
    label: 'Sonnet',
    summary: 'Sonnet also started with the wrong environment, but recovered differently. It asked the API directly which environment the token belonged to, got an answer, and fixed it in one step. The MCP version followed the exact same path. Having queried the documentation server twice beforehand made no difference; sonnet already knew how to diagnose the problem.',
    noCalls: SONNET_NO_MCP_CALLS,
    mcpCalls: SONNET_MCP_CALLS,
  },
  {
    id: 'opus',
    label: 'Opus',
    summary: 'Opus wrote the correct environment address on the first attempt and never needed to debug. Both runs succeeded immediately. The MCP query in the MCP run returned an unreadable response; opus acknowledged it and proceeded exactly as it would have without it.',
    noCalls: OPUS_NO_MCP_CALLS,
    mcpCalls: OPUS_MCP_CALLS,
  },
]

function WorkflowTabs() {
  const [active, setActive] = useState('haiku')
  const tab = WORKFLOW_TABS.find(t => t.id === active)!

  return (
    <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
      <p>
        Each model had a distinct way of handling the task, and a distinct relationship with failure.
      </p>

      {/* Tab strip */}
      <div className="flex gap-1 border-b border-stone-200 dark:border-stone-800">
        {WORKFLOW_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 text-[13px] font-sans font-medium transition-colors rounded-t
              ${active === t.id
                ? 'text-ink dark:text-white border-b-2 border-crimson -mb-px'
                : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <p>{tab.summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToolCallSequence label={`${tab.label} — no MCP`} calls={tab.noCalls} />
        <ToolCallSequence label={`${tab.label} — MCP`} calls={tab.mcpCalls} />
      </div>

      <div className="mt-8 space-y-5">
        <h3 className="font-serif text-xl text-ink dark:text-white">Three patterns, one conclusion</h3>

        <div className="space-y-4">
          <div>
            <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">MCP helped most where training data was weakest</p>
            <p>Haiku spent 27 tool calls without MCP finding an address it should have known. With MCP, a fragment in the truncated preview was enough to skip the loop entirely. The server was broken (responses too large to read), but even a partial clue changed the outcome.</p>
          </div>
          <div>
            <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">Stronger models had their own recovery strategies</p>
            <p>Sonnet didn't search for documentation when things went wrong. It queried the API itself, which is a more reliable approach than looking up the answer, and it worked regardless of whether MCP was available. The documentation server was present in sonnet's MCP run and had no influence on the outcome.</p>
          </div>
          <div>
            <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">At the top, there was nothing to fix</p>
            <p>Opus had the right answer before making a single API call. There was no gap in the model's knowledge for MCP to fill.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tool content section ────────────────────────────────────────────────────

const HAIKU_WEB_CALLS = [
  {
    tool: 'WebSearch',
    description: 'DocuSign API authentication bearer token 2026',
    outcome: 'neutral' as const,
    href: GIST_HAIKU_NO_MCP,
  },
  {
    tool: 'WebFetch',
    description: 'developers.docusign.com/docs/esign-rest-api/esign101/auth/ — authentication overview',
    outcome: 'neutral' as const,
    href: GIST_HAIKU_NO_MCP,
  },
  {
    tool: 'WebFetch',
    description: 'developers.docusign.com/platform/auth/reference/obtain-access-token/ — token reference',
    outcome: 'failed' as const,
    href: GIST_HAIKU_NO_MCP,
  },
]

const OPUS_NO_MCP_SHORT_CALLS = [
  { tool: 'Read',   description: 'Read task.md and .env', outcome: 'neutral' as const },
  { tool: 'Bash ×2', description: 'Check requests and dotenv are importable', outcome: 'neutral' as const },
  { tool: 'Write',  description: 'Write send_envelope.py — demo.docusign.net, anchor-based tabs', outcome: 'neutral' as const },
  { tool: 'Bash',   description: 'Run script — envelope sent on first attempt', outcome: 'found' as const, href: GIST_OPUS_NO_MCP },
]

const SONNET_USERINFO_CALLS = [
  { tool: 'Write',  description: 'Write send_contract.py — na4.docusign.net', outcome: 'neutral' as const },
  { tool: 'Bash',   description: 'Run script — 401 Unauthorized', outcome: 'failed' as const },
  { tool: 'Bash',   description: 'Call account.docusign.com/oauth/userinfo — 401', outcome: 'failed' as const },
  { tool: 'Bash',   description: 'Call account-d.docusign.com/oauth/userinfo — 200, returns base URI', outcome: 'found' as const },
  { tool: 'Edit',   description: 'Update base URL to demo.docusign.net', outcome: 'neutral' as const },
  { tool: 'Bash',   description: 'Run script — envelope sent', outcome: 'found' as const, href: GIST_SONNET_NO_MCP },
]

const HAIKU_MCP_QUERY_CALLS = [
  { tool: 'searchDocusignDocs', description: 'Query 1 — "How do I create and send an envelope?" → 64.6KB, unreadable', outcome: 'failed' as const, href: GIST_HAIKU_MCP },
  { tool: 'searchDocusignDocs', description: 'Query 2 — "DocuSign Python SDK authentication" → 57.3KB, unreadable', outcome: 'failed' as const, href: GIST_HAIKU_MCP },
  { tool: 'searchDocusignDocs', description: 'Query 3 — "eSignature REST API envelope" → 77.1KB, unreadable', outcome: 'failed' as const, href: GIST_HAIKU_MCP },
  { tool: 'Write',              description: 'Write send_contract.py — demo.docusign.net (fell back to training data)', outcome: 'neutral' as const },
  { tool: 'Bash',               description: 'Run script — envelope sent on first attempt', outcome: 'found' as const, href: GIST_HAIKU_MCP },
]

function ToolContentSection() {
  return (
    <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
      <p>
        Fixing the base URL problem required one of two things: find the sandbox address in documentation, or ask the API directly. The agents took different routes, and only one of those routes worked reliably.
      </p>

      <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">Most agents skipped documentation entirely</h3>
      <p>
        Opus didn't need to debug at all. It wrote <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">demo.docusign.net</code> on the first attempt, with no search and no trial and error.
      </p>

      <div className="my-6">
        <ToolCallSequence label="Opus — no MCP" calls={OPUS_NO_MCP_SHORT_CALLS} />
      </div>

      <p>
        Sonnet hit the same 401 as haiku, but recovered in one step. Rather than searching for documentation, it called the DocuSign OAuth <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">userinfo</code> endpoint directly, asking the API which environment the token belonged to. That call returned the correct base URI immediately.
      </p>

      <div className="my-6">
        <ToolCallSequence label="Sonnet — no MCP" calls={SONNET_USERINFO_CALLS} />
      </div>

      <p>
        Neither approach required documentation: opus already knew the answer, and sonnet asked the API.
      </p>

      <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">When web search was used, it didn't help</h3>
      <p>
        Haiku-no-mcp was the only run to use web search. After the 401, it searched for DocuSign API authentication and fetched two official documentation pages.
      </p>

      <div className="my-6">
        <ToolCallSequence label="Haiku — web search and fetches" calls={HAIKU_WEB_CALLS} />
      </div>

      <p>
        Both pages are legitimate: they cover bearer token authentication for the DocuSign REST API. Neither mentions <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">demo.docusign.net</code>. The sandbox URL is documented, but not on the authentication pages a developer reaches when debugging a 401. Haiku went to the right place and hit a documentation gap. It then spent 10 tool calls testing base URLs by trial and error before finding the right one.
      </p>

      <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">The MCP server returned responses no agent could read</h3>
      <p>
        All four MCP runs called <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">searchDocusignDocs</code> before writing code. Every response came back too large to read inline (between 57KB and 84KB). Agents received a 2KB truncated preview and fell back on training data.
      </p>

      <div className="my-6">
        <ToolCallSequence label="Haiku — MCP queries" calls={HAIKU_MCP_QUERY_CALLS} />
      </div>

      <p>
        Each agent tried to read the full saved file and failed: the files were 18,000–22,000 tokens, above the 10,000-token read limit. The preview did mention <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">demo.docusign.net</code>, cut off mid-sentence:
      </p>

      <div className="my-6 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <span className="text-[10px] tracking-[0.25em] uppercase text-stone-400 font-sans font-semibold">MCP response — haiku-mcp, first query</span>
        </div>
        <pre className="text-[12px] leading-relaxed font-mono m-0 bg-stone-950 text-stone-200 p-4 overflow-x-auto whitespace-pre-wrap">{`Output too large (64.6KB). Full output saved to: [path]/tool-results/toolu_016rcuSePhmDTmQEwtReiEuS.json

Preview (first 2KB):
[
  {
    "type": "text",
    "text": "{"prompt": "How do I create and send an envelope...",
      "results": [
        {
          "id": "40",
          "url": "https://developers.docusign.com/docs/workspaces-api/...",
          "title": "How to send an envelope with recipient information",
          "content": "...The base path value in the example code is set to
            target the developer environment at https://<domain>/restapi
            Where <domain> is demo.docusign.net for the developer
            environment...`}</pre>
      </div>

      <p>
        That fragment may explain why haiku-mcp used the sandbox URL immediately, while haiku-no-mcp spent most of its session finding it. But it was a fragment, with no complete example or context. The agents that got the right answer without MCP (opus and sonnet) got there through other means entirely.
      </p>

      <p className="text-[13px] text-stone-500 dark:text-stone-500 border-l-2 border-stone-200 dark:border-stone-700 pl-4">
        This is a retrieval design problem. The server returns full page content for every matching result in one response. A server that returned one result at a time, or summaries with on-demand detail, would fit within the inline response limit. As built, the MCP server was queried in all four MCP runs and actionable in none of them.
      </p>
    </div>
  )
}

// ─── Code section ────────────────────────────────────────────────────────────

type CodeHighlight = 'green' | 'amber' | 'none'
interface CodeLine { text: string; highlight?: CodeHighlight }

const CODE_LINE_STYLES: Record<CodeHighlight, string> = {
  green: 'bg-emerald-50 dark:bg-emerald-950',
  amber: 'bg-amber-50 dark:bg-amber-950',
  none:  '',
}
const CODE_TEXT_STYLES: Record<CodeHighlight, string> = {
  green: 'text-emerald-800 dark:text-emerald-200',
  amber: 'text-amber-800 dark:text-amber-200',
  none:  'text-ink dark:text-stone-200',
}

function CodeBlock({ lines }: { lines: CodeLine[] }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-stone-950 p-4">
      <pre className="text-[12px] leading-relaxed font-mono m-0 bg-transparent">
        {lines.map((line, i) => {
          const hl = line.highlight ?? 'none'
          return (
            <div key={i} className={`-mx-4 px-4 ${CODE_LINE_STYLES[hl]}`}>
              <code className={CODE_TEXT_STYLES[hl]}>{line.text || '\u00A0'}</code>
            </div>
          )
        })}
      </pre>
    </div>
  )
}

const CODE_TABS = [
  {
    id: 'haiku-no-mcp',
    label: 'haiku — no MCP',
    note: 'wrong URL · found by trial-and-error',
    lines: [
      { text: '# First script written — ran immediately', },
      { text: 'BASE_URL = "https://na4.docusign.net/restapi"', highlight: 'amber' as CodeHighlight },
      { text: '# → 401. Agent spent 10 more tool calls varying the URL', highlight: 'amber' as CodeHighlight },
      { text: '# before landing on demo.docusign.net empirically.' },
      { text: '' },
      { text: '"tabs": {' },
      { text: '    "signHereTabs": [{' },
      { text: '        "documentId": "1",' },
      { text: '        "pageNumber":  "1",' },
      { text: '        "xPosition":   "100",   # absolute pixel position', highlight: 'amber' as CodeHighlight },
      { text: '        "yPosition":   "300"', highlight: 'amber' as CodeHighlight },
      { text: '    }]' },
      { text: '}' },
    ],
  },
  {
    id: 'haiku-mcp',
    label: 'haiku — MCP',
    note: 'correct URL from the start · MCP responses unreadable',
    lines: [
      { text: '# Three searchDocusignDocs calls returned 57–77KB each.' },
      { text: '# Agent could not read any of them. Wrote from training data.' },
      { text: '' },
      { text: '# First script written — correct URL immediately', },
      { text: 'BASE_URL = "https://demo.docusign.net/restapi"', highlight: 'green' as CodeHighlight },
      { text: '# → envelope sent on first run. 16 tool calls vs 27.', highlight: 'green' as CodeHighlight },
      { text: '' },
      { text: '"tabs": {' },
      { text: '    "signHereTabs": [{' },
      { text: '        "documentId": "1",' },
      { text: '        "pageNumber":  "1",' },
      { text: '        "xPosition":   "100",   # absolute pixel position', highlight: 'amber' as CodeHighlight },
      { text: '        "yPosition":   "300"', highlight: 'amber' as CodeHighlight },
      { text: '    }]' },
      { text: '}' },
    ],
  },
  {
    id: 'opus-no-mcp',
    label: 'opus — no MCP',
    note: 'correct URL from training data · anchor-based tabs',
    lines: [
      { text: '# No MCP. No web search. Correct URL on the first write.' },
      { text: 'BASE_URL = "https://demo.docusign.net/restapi"', highlight: 'green' as CodeHighlight },
      { text: '' },
      { text: '# Anchor strings embedded in the document body', highlight: 'green' as CodeHighlight },
      { text: 'document_html = """' },
      { text: '    ...' },
      { text: '    <p>/sn1/</p>' },
      { text: '    <p>/ds1/</p>' },
      { text: '"""' },
      { text: '' },
      { text: '"tabs": {' },
      { text: '    "signHereTabs":   [{ "anchorString": "/sn1/", "anchorXOffset": "0",  "anchorYOffset": "-10" }],', highlight: 'green' as CodeHighlight },
      { text: '    "dateSignedTabs": [{ "anchorString": "/ds1/", "anchorXOffset": "0",  "anchorYOffset": "-10" }]', highlight: 'green' as CodeHighlight },
      { text: '}' },
    ],
  },
]

function CodeSection() {
  const [active, setActive] = useState('haiku-no-mcp')
  const tab = CODE_TABS.find(t => t.id === active)!

  return (
    <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
      <p>
        All six scripts sent a real envelope. But passing the task and writing production-ready code are different things. One detail in particular separates the runs cleanly: how each agent placed the signature field.
      </p>

      <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">Two approaches to the same problem</h3>
      <p>
        Haiku and sonnet both placed the signature box at a fixed pixel coordinate on the page. That works until the document changes; if the text shifts, the box stays where it was. Opus took a different approach in both runs: it embedded a short marker string directly in the document body and told DocuSign to find it. The signature field follows the marker, wherever it ends up on the page. That's the approach DocuSign recommends for exactly this reason.
      </p>

      <div className="my-6 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        <div className="flex border-b border-stone-200 dark:border-stone-800">
          {CODE_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex flex-col gap-0.5 px-4 py-3 text-left border-b-2 transition-all ${
                active === t.id
                  ? 'border-crimson bg-white dark:bg-stone-950'
                  : 'border-transparent bg-stone-50 dark:bg-stone-900 hover:bg-white dark:hover:bg-stone-950'
              }`}
            >
              <span className={`text-[12px] font-semibold font-mono ${active === t.id ? 'text-ink dark:text-white' : 'text-stone-400'}`}>
                {t.label}
              </span>
              <span className="text-[11px] text-stone-400 font-sans">{t.note}</span>
            </button>
          ))}
        </div>
        <CodeBlock lines={tab.lines} />
      </div>

      <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">More complexity, worse code</h3>
      <p>
        Sonnet-MCP wrote the most technically ambitious script of the six: it generated a hand-crafted PDF from scratch, constructing valid binary with font definitions and a proper cross-reference table. The task was to send a contract, and all that extra work produced the same fragile pixel-coordinate tab placement, wrapped in considerably more code.
      </p>
      <p>
        Opus-no-MCP wrote the simplest script and the most correct one: plain text document, anchor-based tabs, eight tool calls total. The quality difference came from what each model already knew, not from access to better tools or more documentation.
      </p>

      <p className="text-[13px] text-stone-500 dark:text-stone-500 border-l-2 border-stone-200 dark:border-stone-700 pl-4">
        Full scripts for all six runs are on the <a href="https://github.com/jamesdanielwhitford/docusign-benchmark" target="_blank" rel="noopener noreferrer" className="text-crimson hover:underline">docusign-benchmark</a> repository, one branch per condition.
      </p>
    </div>
  )
}

export default function DocuSignReport() {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <>
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px]">

        {/* ─── HYPOTHESIS ─── */}
        <Section
          id="hypothesis"
          chapterLabel="The question"
          headline="Does an MCP server help agents use a complex API correctly?"
          subheadline="Six runs across three models, with and without a DocuSign MCP server"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              When an AI agent integrates a complex API, it relies on what it already knows. The question is how far that gets it, and whether giving it access to live documentation changes the outcome.
            </p>
            <p>
              DocuSign is a good test for this. It has two separate environments with different base URLs, and credentials for one don't work with the other. It's exactly the kind of configuration detail that isn't reliably in training data and that a documentation server should be able to answer immediately.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Hypothesis 1: MCP documentation access reduces configuration mistakes
            </h3>
            <p>
              An agent with access to a DocuSign MCP server should be less likely to start with the wrong environment, recover faster when it does, and produce code that reflects current best practices rather than what was most common in its training data.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Hypothesis 2: Even a flawed MCP server is better than none
            </h3>
            <p>
              The DocuSign MCP server used in this benchmark had a significant limitation: its responses were too large for agents to read in full. If agents still performed better with it available, even when they couldn't use it properly, that tells us something about the value of partial context over no context at all.
            </p>

            <p>
              To test both, we ran the same task across three models, each twice: once with web search only, once with the DocuSign MCP server added.
            </p>

            <p className="text-[13px] text-stone-500 dark:text-stone-500 border-l-2 border-stone-200 dark:border-stone-700 pl-4">
              All six sessions ran against the DocuSign sandbox API with real credentials. Full transcripts and branch-per-condition code are linked throughout.
            </p>
          </div>
        </Section>

        {/* ─── METHODOLOGY ─── */}
        <Section
          id="methodology"
          chapterLabel="Setup"
          headline="How we tested it"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              The task was the same in every run: write a Python script that sends a DocuSign envelope to a recipient for signature, using credentials from a <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">.env</code> file, and print the envelope ID on success. No starter code, no context file, no hints about the environment.
            </p>
            <p>
              Three models ran the task: Haiku 4.5, Sonnet 4.6, and Opus 4.6. Each ran twice: once with web search only, once with web search plus the DocuSign MCP server. The only difference between the two prompts was one sentence at the end.
            </p>

            <TestEnvironmentCard model="Haiku 4.5 · Sonnet 4.6 · Opus 4.6" date="31 March 2026" />

            <TaskCompare />

            <p>
              The DocuSign MCP server exposes 36 tools. In this benchmark, agents used it as a documentation source: querying <code className="text-[12px] font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">searchDocusignDocs</code> to look up API details before writing code.
            </p>
            <p>
              Each run was conducted in a fresh folder with its own git repository. No session history carried over between runs. Each condition has a published branch on GitHub and a full session transcript linked below.
            </p>

            <SessionLinks />
          </div>
        </Section>

        {/* ─── OVERVIEW ─── */}
        <Section
          id="overview"
          chapterLabel="Results"
          headline="How each agent performed"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              All six agents completed the task. But the effort required varied dramatically, and the gap tracked model capability rather than whether the MCP server was available.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">Model capability was the clearest dividing line</h3>
            <p>
              Opus succeeded on the first execution in both runs. Sonnet hit one error and recovered in a single diagnostic step. Haiku required extended debugging loops: 27 tool calls without MCP, 16 with. In each case, the no-MCP and MCP versions of the same model followed the same basic path.
            </p>

            <div className="my-6 overflow-x-auto">
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

            <h3 className="font-serif text-xl text-ink dark:text-white mt-8 mb-3">A broken MCP server still helped</h3>
            <p>
              Every MCP agent queried the documentation server before writing code. Every response was too large to read in full, so agents received a truncated preview and fell back on training data. And yet haiku-mcp used the correct sandbox URL on the first attempt, while haiku-no-mcp spent most of its session finding it. The preview fragment was enough to change the outcome, even though no agent could read the full response.
            </p>
            <p>
              The problem was a server that returned too much at once. Even in that broken state, partial context was better than none.
            </p>
            <p className="text-[13px] text-stone-500 dark:text-stone-500 border-l-2 border-stone-200 dark:border-stone-700 pl-4">
              Context usage reflects total tokens at session end. Haiku carried a higher baseline than sonnet and opus because the full set of DocuSign MCP tools was pre-loaded into context on startup, rather than loaded on demand.
            </p>
          </div>
        </Section>

        {/* ─── WORKFLOW ─── */}
        <Section
          id="workflow"
          chapterLabel="Analysis"
          headline="How each agent approached the task"
        >
          <WorkflowTabs />
        </Section>

        {/* ─── TOOL CONTENT ─── */}
        <Section
          id="tool-content"
          chapterLabel="Analysis"
          headline="What the tools actually returned"
        >
          <ToolContentSection />
        </Section>

        {/* ─── CODE ─── */}
        <Section
          id="code"
          chapterLabel="Analysis"
          headline="Code produced by each agent"
        >
          <CodeSection />
        </Section>

        {/* ─── CONCLUSION ─── */}
        <Section
          id="conclusion"
          chapterLabel="Conclusion"
          headline="Context helps, even when it's broken"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              All six agents completed the task. But completing a task and understanding the API you're using are different things, and this benchmark tested both.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-2">Model capability set the ceiling</h3>
            <p>
              The clearest finding is that model strength determined the outcome more than any tool. Opus succeeded immediately in both conditions. Sonnet hit one error and self-corrected with a single diagnostic step. Haiku required an extended debugging loop. Within each model pair, the no-MCP and MCP runs followed the same basic path; the tool changed what happened early in the session, but not how the agent reasoned its way through problems.
            </p>
            <p>
              Code quality followed the same gradient. Haiku and sonnet both placed the signature field at a fixed pixel position (functional, but fragile). Opus used anchor strings in both runs, the approach DocuSign recommends, without being prompted. That gap came from what each model already knew, not from tool access.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">Web search and MCP failed differently</h3>
            <p>
              Haiku was the only model to use web search after hitting an error. It found the right documentation pages (official, legitimate sources), and neither mentioned the sandbox address it needed. The information existed in DocuSign's docs, just not on the pages a developer reaches when debugging an authentication failure. Web search got it to the right place and it still came up empty.
            </p>
            <p>
              MCP failed differently. The documentation was there, the queries were relevant, but every response came back too large to read. Agents received a truncated preview and fell back on training data. And yet haiku-mcp still reached the correct environment on the first attempt; the fragment visible in the preview was enough. Web search sent haiku to a documentation gap, while MCP, even broken, pointed it in the right direction.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">A bad MCP server is still better than none</h3>
            <p>
              That's the more useful framing for MCP in practice. A well-built documentation server is most valuable at the edges: smaller models, less familiar APIs, configuration details that aren't reliably in training data. Stronger models find their way regardless. At the edges, even partial context changes the outcome. If a broken server could do that, a well-built one should do considerably more.
            </p>
          </div>
        </Section>

      </main>
    </>
  )
}
