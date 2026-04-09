import TOC from './TOC'
import Section from './Section'
import ScatterPlot from './ScatterPlot'
import ModeComparisonTable from './ModeComparisonTable'
import ApiBreakdown from './ApiBreakdown'
import AgentComparison from './AgentComparison'
import TestMatrix from './TestMatrix'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { BENCHMARKS, METHOD_COLORS, aggregate } from '../data/benchmarks'
import { CountUp } from './CountUp'

const SECTIONS = [
  { id: 'introduction',    label: 'Introduction' },
  { id: 'methodology',     label: 'Methodology – Setup' },
  { id: 'result-overview', label: 'Result overview' },
  { id: 'results-bare',    label: 'Results by API – Bare' },
  { id: 'results-sdk',     label: 'Results by SDK' },
  { id: 'results-mcp',     label: 'Results by SDK + MCP' },
  { id: 'model-compare',   label: 'Claude Opus vs Claude Sonnet vs Codex' },
  { id: 'how-to-use',      label: 'How to use this report' },
]

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-crimson underline underline-offset-2"
  >
    {children}
  </a>
)

export default function FullBenchmarkReport() {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <div className="relative">
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px]">

        {/* ─── INTRODUCTION ─── */}
        <Section
          id="introduction"
          chapterLabel="Introduction"
          headline="What 108 agent sessions taught us"
        >
          <div className="prose-custom space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              This report began with a reasonable assumption: giving{' '}
              <A href="https://claude.ai/code">AI coding agents</A> access to{' '}
              <A href="https://modelcontextprotocol.io">MCP tools</A> makes them
              better suited for API integration than simply leaving them with API or
              SDK knowledge alone.
            </p>
            <p>
              From our findings, SDK+MCP has the highest success rate, but it is also
              the slowest and most expensive. More importantly, agents are not only
              using MCP to read documentation, but also to check their own work:
              querying <A href="https://linear.app">Linear</A> to confirm an issue was
              actually created, inspecting <A href="https://resend.com">Resend</A>{' '}
              delivery logs to verify an email landed, and validating a{' '}
              <A href="https://www.pandadoc.com">PandaDoc</A> document lifecycle
              against a live workspace.
            </p>
            <p>
              The data also surfaced a behavioral difference between models that we
              did not set out to measure. GPT-5.4 made 45 MCP calls across 12 SDK+MCP
              sessions. Claude Sonnet and Opus made 9 combined. In bare sessions where
              no tooling was mentioned in the prompt, GPT-5.4 still made unprompted
              web searches to verify its work. Claude made none. The phenomenon
              researchers describe as{' '}
              <a
                href="https://www.knowledge-architecture.com/blog/why-epistemic-humility-might-be-the-most-important-skill-for-the-ai-era"
                target="_blank"
                rel="noopener noreferrer"
                className="text-crimson underline underline-offset-2"
              >
                epistemic humility
              </a>
              : the tendency to acknowledge the limits of your own knowledge and seek
              external verification before committing to an answer. GPT-5.4 displays
              it consistently. Claude, for the most part, does not.
            </p>
            <p>Here is what the full dataset shows:</p>
            <ul className="space-y-1 pl-5 list-disc">
              <li>
                SDK+MCP is the only method with a 100% success rate, but it costs
                more time and tokens. Bare and SDK both sit at 92%.
              </li>
              <li>
                GPT-5.4 made 45 MCP calls across 12 sessions, while Claude Sonnet
                and Opus made 9 combined.
              </li>
              <li>
                SDKs sometimes make things worse.{' '}
                <A href="https://www.metabase.com">Metabase</A>'s embedding SDK
                requires a paid plan, and information that wasn't known until the SDK
                implementation. Agents that reached for it spent up to 18 minutes and
                4.8 million tokens before hitting a paywall. Bare API calls on the
                same task were faster and more correct.
              </li>
              <li>
                GPT-5.4 ran a PandaDoc session for 50 minutes, inspecting every
                available endpoint and mapping template roles to application users
                before writing code. It was the most thorough session in the
                benchmark, and the only model to confirm the full end-to-end document
                lifecycle.
              </li>
              <li>
                Codex is slower. GPT-5.4 averaged 14 minutes per session while Claude
                Sonnet averaged 8 minutes.
              </li>
            </ul>
            <p>
              The rest of this report walks through the methodology, the data, and our
              observations, API by API and model by model.
            </p>
          </div>
        </Section>

        {/* ─── METHODOLOGY ─── */}
        <Section
          id="methodology"
          chapterLabel="Methodology — Setup"
          headline="108 attempts. 4 APIs. 9 combinations."
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              Each run started from a fresh clone of a freelance marketplace
              application built with{' '}
              <A href="https://nextjs.org">Next.js</A> and{' '}
              <A href="https://expressjs.com">Express.js</A>, with email and password
              authentication, signup and signing pages, profile pages, and an SQLite
              database.
            </p>
            <p>
              Each combination ran three times. For these runs, we also allowed the
              MCP configurations loaded into each session, and we used the prompts to
              direct the AI agents to use or not to use the MCP server's tools. In
              each combination, AI agents always had access to the internet.
            </p>
            <p>
              Due to the number of runs, measuring the success of implementation
              relied on two things:
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                E2E tests are written to make sure each implementation meets the
                requirements. The E2E was included in the project.
              </li>
              <li>
                Then, curl commands and database look-and-check.
              </li>
            </ul>
            <p>
              Failure occurs when testing fails or when cURL returns a response it
              shouldn't. For example, calling an endpoint that is supposed to return
              validation errors is considered a success, even if the response has a
              400 status code.
            </p>
            <p>
              This report was designed to verify a hypothesis rather than establish a
              definitive benchmark. 108 runs across 4 APIs is a small sample, and we
              acknowledge that limitation.
            </p>
            <p>
              Three models are used for the tests:{' '}
              <A href="https://www.anthropic.com/claude/opus">Claude Opus 4.6</A>,{' '}
              <A href="https://www.anthropic.com/claude/sonnet">Claude Sonnet 4.6</A>
              , and GPT-5.4.
            </p>
            <p>Four APIs were selected for distinct reasons:</p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">
                  <A href="https://resend.com">Resend</A>
                </strong>{' '}
                is a widely used email API with clean documentation. It tests whether
                tooling adds value when the agent already has strong training data
                coverage.
              </li>
              <li>
                <strong className="text-ink dark:text-white">
                  <A href="https://linear.app">Linear</A>
                </strong>{' '}
                has a well-designed GraphQL API. GraphQL mutations and typed schemas
                add enough complexity to reveal how agents handle non-trivial
                interfaces.
              </li>
              <li>
                <strong className="text-ink dark:text-white">
                  <A href="https://www.pandadoc.com">PandaDoc</A>
                </strong>{' '}
                is a niche document-signing platform with a large API surface. LLMs
                have limited training data on it, which means errors are more likely
                without access to live documentation.
              </li>
              <li>
                <strong className="text-ink dark:text-white">
                  <A href="https://www.metabase.com">Metabase</A>
                </strong>{' '}
                is a self-hosted analytics platform with sparse public documentation.
                It tests whether tooling compensates for weak training data.
              </li>
            </ul>
            <p>Three integration modes were tested:</p>
            <ul className="space-y-4 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Bare:</strong> the agent
                has only its training data, with internet access for documentation,
                SDK, or MCP server. Here is the prompt used:
                <pre className="mt-3 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded p-4 text-[12px] font-mono leading-relaxed whitespace-pre-wrap">
{`Hi Claude/Codex. Add [Tool] to this application so users can create issues directly from the app. Use the [Tool API] directly. Don't interrogate the MCP server of [Tool name] if installed. You have access to the internet if you need it.

When you are done, write a short report covering:
- Did the integration work? What did you test to confirm?
- What issues did you run into, if any?
- What resources did you use?
- What would have made this task harder or easier?`}
                </pre>
              </li>
              <li>
                <strong className="text-ink dark:text-white">SDK:</strong> Here is
                the prompt used:
                <pre className="mt-3 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded p-4 text-[12px] font-mono leading-relaxed whitespace-pre-wrap">
{`Hi Claude/Codex. Add [Tool] to this application so users can create issues directly from the app. Use the official [Tool SDK] — install it. You have access to the internet if you need it.

When you are done, write a short report covering:
- Did the integration work? What did you test to confirm?
- What issues did you run into, if any?
- What resources did you use?
- What would have made this task harder or easier?`}
                </pre>
              </li>
              <li>
                <strong className="text-ink dark:text-white">SDK+MCP:</strong> the
                SDK is installed by the agent, and the service's own MCP server is
                configured. Resend used the Resend MCP server, Metabase used{' '}
                <A href="https://www.npmjs.com/package/@cognitionai/metabase-mcp-server">
                  <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">@cognitionai/metabase-mcp-server</code>
                </A>
                , PandaDoc used the PandaDoc MCP server, and Linear used the Linear
                MCP server. Here is the prompt used:
                <pre className="mt-3 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded p-4 text-[12px] font-mono leading-relaxed whitespace-pre-wrap">
{`Hi Claude/Codex. Add [Tool] to this application so users can create issues directly from the app. Use the official [Tool SDK] — install it. We have installed the [Tool] MCP server — use it to guide the implementation and validate that the integration works correctly. You have access to the internet if you need it.

When you are done, write a short report covering:
- Did the integration work? What did you test to confirm?
- What issues did you run into, if any?
- What resources did you use? (internet, MCP tools, SDK docs, etc.)
- How did you use the MCP server? What specifically did it help with?
- What would the result have been without the MCP?
- What would have made this task harder or easier?`}
                </pre>
              </li>
            </ul>
            <p>
              Now, measuring time tokens, the MCP tool calls across different AI
              agents is difficult. If it's true that Codex, at the end of each
              session, provides you with tokens used in that session,{' '}
              <A href="https://claude.ai/code">Claude Code</A> only shows you the
              current time taken for a response to a prompt, and also the number of
              tokens used for thinking.
            </p>
            <p>
              To ensure accurate measurements while gathering extensive information,
              we used Conductor to orchestrate the benchmarks in this test. Conductor
              is an AI agent orchestration application for macOS that captures token
              usage, session duration, and tool call logs at the machine level.
              Conductor stores machine-level session, token, and MCP tool call
              information in a SQLite database, which is perfect for this report.
            </p>
          </div>
          <TestMatrix />
        </Section>

        {/* ─── RESULT OVERVIEW ─── */}
        <Section
          id="result-overview"
          chapterLabel="Results — Overview"
          headline="Result overview"
          subheadline="Each dot is a single session. Filter by any dimension."
        >
          <div className="space-y-5 text-stone-600 dark:text-stone-400 text-[14px] leading-relaxed mb-8">
            <p>
              The chart below shows all 108 runs across every combination of model,
              API, and tooling mode.
            </p>
            <p>
              Each dot represents one session. The x-axis shows session duration, the
              y-axis shows total context tokens consumed, the dot size reflects the
              number of output tokens generated, and the color indicates the tooling
              mode.
            </p>
          </div>
          <ScatterPlot />
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mt-10">
            <p>Two patterns are visible:</p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                First, GPT-5.4 sessions, the outlined circles, run along the bottom
                of the chart across all durations.
              </li>
              <li>
                Second, the two largest dots, both Claude sessions at around 28k and
                35k output tokens, are PandaDoc and Metabase SDK+MCP runs. More
                output did not guarantee better results. Both sessions hit constraints
                that the extra tokens could not resolve.
              </li>
            </ul>
            <p>
              Token consumption works differently across the two model families.{' '}
              <A href="https://claude.ai/code">Claude Code</A> uses prompt caching to
              store and reuse context across turns, meaning large sections of the
              codebase and conversation history are processed once and read back at
              roughly 10% of the original cost on subsequent turns. This keeps fresh
              input costs low but allows sessions to grow large in total context.
              GPT-5.4 sends fresh context each turn and produces far fewer output
              tokens across all configurations, including sessions with no MCP server.
            </p>
            <p>
              The two models have different output styles: Claude writes more,
              GPT-5.4 writes less, and verifies more.
            </p>
            <p>
              If speed matters in your workflow, Claude is the faster choice across
              all three tooling modes. If cost matters more than speed, GPT-5.4
              produces fewer tokens per session and reaches the same outcomes on niche
              APIs.
            </p>
          </div>
        </Section>

        {/* ─── RESULTS BY API – BARE ─── */}
        <Section
          id="results-bare"
          chapterLabel="Results — Per API"
          headline="Results by API – Bare"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              We split the four APIs into two groups before running a single session:
              Resend and Linear, which are well-documented and widely covered in LLM
              training data, and Metabase and PandaDoc, which are niche enough that
              agents cannot rely solely on training data.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://resend.com">Resend</A>
            </h3>
            <p>
              <strong className="text-ink dark:text-white">Resend</strong> was the
              fastest API across all three models and all three configurations. The
              bare method averaged 5 minutes 12 seconds. Sonnet completed it in 3
              minutes 43 seconds, the fastest single session for this API. Output
              tokens were low across all configurations, averaging 5,053 for bare.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://linear.app">Linear</A>
            </h3>
            <p>
              <strong className="text-ink dark:text-white">Linear</strong> followed a
              similar pattern on bare runs as Resend. Sonnet completed in 5 minutes 15
              seconds with 13,031 output tokens. Opus took 15 minutes 17 seconds for
              the same task, producing 14,393 tokens. The time gap with similar output
              volume suggests that Opus is exploring the codebase more thoroughly
              before writing. GPT-5.4 completed bare in 9 minutes 22 seconds but
              produced only 1,391 output tokens.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://www.metabase.com">Metabase</A>
            </h3>
            <p>
              With Metabase, Sonnet completed in 8 minutes and 18 seconds, producing
              12,687 output tokens. GPT-5.4 completed in 10 minutes 24 seconds with
              1,884 output tokens. All runs used the REST API, but also JWT signing
              without being told to.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://www.pandadoc.com">Pandadoc</A>
            </h3>
            <p>
              In the first run with Pandadoc, agents needed document UUIDs to run
              tests, but could not retrieve them from the environment. Outside of
              that, the integration completed without errors. Opus was the fastest
              model on this API.
            </p>

            <blockquote className="border-l-2 border-stone-300 dark:border-stone-700 pl-5 italic text-stone-500 dark:text-stone-400 mt-6">
              We can already note something. Integration using the API is faster only
              if the service is well-known and agents are trained on it, or if the
              service has very simple documentation.
            </blockquote>
          </div>
          <ApiBreakdown />
        </Section>

        {/* ─── RESULTS BY SDK ─── */}
        <Section
          id="results-sdk"
          chapterLabel="Results — SDK"
          headline="Results by SDK"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              In terms of quality, we expected SDK sessions to outperform bare across
              all four APIs.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://linear.app">Linear</A>
            </h3>
            <p>
              <strong className="text-ink dark:text-white">Linear</strong> showed the
              clearest improvement over bare. All three models passed. The SDK
              provided agents with a typed interface with structured payloads,
              replacing the generic HTTP wrappers that the bare sessions used. Sonnet
              completed in 5 minutes 5 seconds with 11,466 output tokens, slightly
              faster than its bare session at 5 minutes 15 seconds. Opus dropped from
              15 minutes 17 seconds bare to 6 minutes 4 seconds with the SDK, cutting
              session time by more than half while producing fewer output tokens.
              GPT-5.4 took longer with the SDK, 11 minutes 45 seconds against 9
              minutes 22 seconds bare.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://resend.com">Resend</A>
            </h3>
            <p>
              <strong className="text-ink dark:text-white">Resend</strong> produced
              the fastest SDK sessions in the entire benchmark. Sonnet completed in 2
              minutes 20 seconds with 4,357 output tokens, the fastest passing session
              across all 108 runs. Opus completed in 4 minutes 17 seconds. Both Claude
              models were faster with the SDK than with the bare API. GPT-5.4 took 6
              minutes 32 seconds, marginally slower than its bare session. For a
              well-known API like Resend, the SDK gave Claude models a shorter path to
              a working implementation. It also enabled live validation of the bare
              sessions never reached: we observed Opus return a live Resend message ID
              confirming actual email delivery, and catch a real-world constraint in
              the process. Resend's test API key only allows sending to the account
              owner's email address.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://www.metabase.com">Metabase</A>
            </h3>
            <p>
              <strong className="text-ink dark:text-white">Metabase</strong>{' '}
              initially appeared to reverse the pattern entirely. The first SDK
              sessions all failed, with Sonnet running for 18 minutes 21 seconds and
              GPT-5.4 running for 18 minutes 38 seconds before both hit
              authentication errors. We traced the failures to a missing API key in
              the benchmark environment rather than a model or SDK problem. After
              correcting the environment and rerunning, the SDK session passed. The
              agent wired the{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">@metabase/embedding-sdk-react</code>{' '}
              package into the dashboard, verified the{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">/api/metabase/config</code>{' '}
              endpoint returned an enabled configuration, and confirmed live dashboard
              content rendered through a Playwright smoke test. The implementation
              used JWT authentication for real users with an API key fallback for
              local evaluation. Two pre-existing lint and build errors in unrelated
              files were present throughout, but did not affect the integration.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://www.pandadoc.com">PandaDoc</A>
            </h3>
            <p>
              <strong className="text-ink dark:text-white">PandaDoc</strong> showed
              no clear quality gap between bare and SDK. The SDK sessions were more
              structured: Opus built a full six-endpoint contract lifecycle with a
              dedicated service layer. Both Sonnet with SDK and GPT-5.4 with bare
              discovered the same async constraint: a document cannot be sent
              immediately after creation because it needs to reach{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">document.draft</code>{' '}
              status first.
            </p>

            <blockquote className="border-l-2 border-stone-300 dark:border-stone-700 pl-5 italic text-stone-500 dark:text-stone-400 mt-6">
              The SDK improved integration quality when the library was mature and the
              environment was correctly configured. It gave agents a typed,
              discoverable interface that reduced exploration time and enabled live
              validation that bare API calls could not reach. Where the SDK failed,
              the cause was always environmental: a missing API key, an unsupported
              plan tier, or credentials that were not in place before the session
              started. Agents cannot diagnose environment problems from the outside.
            </blockquote>
          </div>
          <ModeComparisonTable />
        </Section>

        {/* ─── RESULTS BY SDK + MCP ─── */}
        <Section
          id="results-mcp"
          chapterLabel="Results — SDK + MCP"
          headline="Results by SDK + MCP"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mb-10">
            <p>
              In the first sessions, runs did not explicitly instruct agents to use
              MCP tools; Claude never called them. Codex made a few unsolicited calls
              to verify its own work, but neither model used MCP systematically. For
              the other runs, we specified agents not to use MCP servers, but the
              internet, in case of bare API or SDK only.
            </p>
            <p>
              Token usage did not increase consistently when MCP was added on top of
              the SDK. The variance across models was driven by session content and
              model behavior rather than the MCP tool definitions loading into the
              context. There was no reliable directional pattern.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://linear.app">Linear</A>
            </h3>
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
                to verify issues RIT-15 and RIT-16 from the Linear side after
                creation.
              </li>
              <li>
                Sonnet called{' '}
                <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">list_teams</code>{' '}
                before writing any code, retrieving the real team ID instead of
                hardcoding a guess.
              </li>
              <li>
                GPT-5.4 verified RIT-21 through MCP and cancelled the smoke-test
                issues afterward.
              </li>
            </ul>
            <p>
              Every SDK+MCP session on Linear confirmed a live issue was created and
              inspected on the Linear side. The SDK-only sessions reached the same
              pass rate, but had to infer workspace structure from environment
              variables. MCP gave agents the ground truth before they wrote a line of
              code.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://resend.com">Resend</A>
            </h3>
            <p>
              <strong className="text-ink dark:text-white">Resend</strong> produced
              the strongest quality lift of any API in the MCP sessions. GPT-5.4
              called{' '}
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
              subject and body. That is the only session across all 108 runs in which
              external delivery was confirmed by the provider's own records, not just
              a 200 response from the SDK. The difference matters in production: a
              successful response confirms that the API accepted the request. The MCP
              call confirmed the email reached the inbox.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://www.metabase.com">Metabase</A>
            </h3>
            <p>
              <strong className="text-ink dark:text-white">Metabase</strong> showed
              MCP being used before implementation rather than after. GPT-5.4
              launched{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">metabase-mcp-server</code>
              , listed available tools and resources, confirmed the dashboard existed,
              called{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">api_call</code>{' '}
              to inspect{' '}
              <code className="bg-stone-100 dark:bg-stone-850 px-1 rounded text-[12px]">/api/dashboard/1</code>
              , and verified that static embedding was enabled and that an embedding
              secret was present. We observed the agent use that information to
              implement against the real dashboard configuration rather than guessing
              at the settings. All three SDK+MCP sessions passed, compared to zero
              SDK-only sessions passing in the first round of testing.
            </p>

            <h3 className="font-serif text-lg font-semibold text-ink dark:text-white mt-6 mb-1">
              <A href="https://www.pandadoc.com">PandaDoc</A>
            </h3>
            <p>
              <strong className="text-ink dark:text-white">PandaDoc</strong> used MCP
              to navigate an API surface that was too large to cover with training
              data alone. GPT-5.4 ran for 50 minutes 26 seconds for 1,372 output
              tokens, inspecting available endpoints, confirming the create, send,
              details, and session flow, verifying workspace members and available
              templates, and inspecting template roles and tokens. The MCP server
              allowed the agent to map the application's client and freelancer users
              to the correct PandaDoc recipient roles.
            </p>

            <blockquote className="border-l-2 border-stone-300 dark:border-stone-700 pl-5 italic text-stone-500 dark:text-stone-400 mt-6">
              MCP did not necessarily teach agents how to integrate these tools. MCP
              gave them access to the actual state of the environment they were
              integrating into: a real team ID to run tests against, template roles,
              dashboard configuration, and email delivery record.
            </blockquote>

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
              Every combination ran with{' '}
              <A href="https://www.anthropic.com/claude/opus">Claude Sonnet 4.6</A>,{' '}
              <A href="https://www.anthropic.com/claude/opus">Claude Opus 4.6</A>, and
              GPT-5.4, using identical prompts, identical starting codebases, and
              identical tooling. The most consistent difference across all 108 sessions
              was not pass rate or code quality. It was how often each model reached
              for external verification before committing to an answer.
            </p>
            <p>
              GPT-5.4 made 45 MCP calls across 12 SDK+MCP sessions. Claude Sonnet and
              Opus made 9 combined across the same sessions.
            </p>
          </div>
          <AgentComparison />
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed mt-10">
            <p>
              In the bare sessions, GPT-5.4 made 7 web search calls to verify
              implementation details before writing code. Opus and Sonnet made zero
              external calls of any kind.
            </p>
            <p>
              Even when explicitly told to use the MCP server, Claude used it
              sparingly. Opus averaged 1.2 calls per SDK+MCP session. Sonnet averaged
              0.8. GPT-5.4 averaged 9.5.
            </p>
            <p>
              By API, Linear, Resend, and Metabase all reached 100% success. PandaDoc
              was the only API below that, at 92%. The failures were due to
              environment-level problems rather than model errors.
            </p>
            <p>
              By method, SDK+MCP is the only configuration with a perfect success
              rate. Bare and SDK both sit at 92%, one failure each. SDK+MCP is slower
              and more token-heavy, but nothing failed.
            </p>
            <p>
              By model, GPT-5.4 is the only model with a perfect success rate, but it
              is the slowest by a wide margin, averaging 14 minutes 14 seconds per
              session against 7 minutes 51 seconds for Opus and 8 minutes 26 seconds
              for Sonnet. GPT-5.4 also generates the fewest output tokens: an average
              of 1,386 per session against 9,091 for Opus and 15,748 for Sonnet. It
              writes short responses and spends the rest of its time on tool calls.
            </p>
          </div>
        </Section>

        {/* ─── HOW TO USE THIS REPORT ─── */}
        <Section
          id="how-to-use"
          chapterLabel="Recommendations"
          headline="How to use this report"
        >
          <div className="space-y-8 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <div>
              <h3 className="font-serif text-xl text-ink dark:text-white mb-3">
                MCP tools do not activate without an explicit instruction
              </h3>
              <p>
                MCP tools do not activate automatically. Claude never called them
                without a direct instruction across 72 sessions. Codex made a small
                number of unprompted web searches, but not systematically. The
                instruction does not need to be long. Telling the agent to use the MCP
                server to confirm the integration worked.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-ink dark:text-white mb-3">
                Tool descriptions matter more than endpoint lists
              </h3>
              <p>
                The most useful MCP calls in this benchmark were not documentation
                lookups. They were calls that resolved sequencing questions: what
                comes after creating a PandaDoc document, what the correct auth flow
                is for Metabase, and what the real team ID is in Linear. If you are
                building an MCP server that exposes a list of endpoints without
                describing their relationships, agents will still make ordering and
                dependency errors. Tool descriptions that explain what an endpoint
                expects and what should happen next are worth more than a complete
                endpoint catalogue.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-ink dark:text-white mb-3">
                Claude and GPT-5.4 are optimised for different parts of the same
                workflow
              </h3>
              <p>
                Claude and GPT models are optimised for different constraints. In a
                multi-agent setup, that difference is an asset:
              </p>
              <ul className="mt-4 space-y-2 pl-5 list-disc">
                <li>
                  Use <strong className="text-ink dark:text-white">GPT-5.4</strong> to
                  explore an unfamiliar codebase or environment before implementation
                  begins. It will search, verify, and surface constraints that Claude
                  would not look for.
                </li>
                <li>
                  Use{' '}
                  <strong className="text-ink dark:text-white">
                    <A href="https://www.anthropic.com/claude/sonnet">Claude Sonnet</A>
                  </strong>{' '}
                  to implement once the plan is clear. It is faster, writes more, and
                  performs well when the task is well-defined.
                </li>
                <li>
                  Use <strong className="text-ink dark:text-white">GPT-5.4</strong>{' '}
                  again for validation after implementation. It will reach for the MCP
                  tools to confirm the result without being asked, and it will catch
                  what Claude assumed was correct.
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
