import Hero from './components/Hero'
import TOC from './components/TOC'
import ThemeToggle from './components/ThemeToggle'
import Section from './components/Section'
import PromptCards from './components/PromptCards'
import AgentActivity from './components/AgentActivity'
import ConceptScoreTable from './components/ConceptScoreTable'
import TokenBar from './components/TokenBar'
import RunSummaryCards from './components/RunSummaryCards'
import PromptDeltaTable from './components/PromptDeltaTable'
import RunMetricsTable from './components/RunMetricsTable'
import FabricationTable from './components/FabricationTable'
import FeatureCategoryTable from './components/FeatureCategoryTable'
import CostCorrectnessScatter from './components/CostCorrectnessScatter'
import ConfigAccessTable from './components/ConfigAccessTable'
import ConceptMappingTable from './components/ConceptMappingTable'
import { useScrollSpy } from './hooks/useScrollSpy'

const SECTIONS = [
  { id: 'hypothesis',    label: 'Hypothesis' },
  { id: 'methodology',   label: 'How we tested it' },
  { id: 'api-only',      label: 'API only' },
  { id: 'sdk-only',      label: 'SDK only' },
  { id: 'sdk-mcp',       label: 'SDK + MCP' },
  { id: 'all-runs',      label: 'Results and conclusions' },
]

export default function App() {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <div className="bg-parchment dark:bg-black min-h-screen">
      <ThemeToggle />
      <Hero />
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px]">

        {/* ─── HYPOTHESIS ─── */}
        <Section
          id="hypothesis"
          chapterLabel="Introduction"
          headline="Does live API context change what an agent builds?"
        >
          <div className="prose-custom space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              When an AI agent integrates an API it knows from training data, it will
              occasionally reach a point where it does not know the correct approach. The
              question is what it does next. Does it search for the answer, flag its
              uncertainty, or proceed as if it knows?
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Hypothesis 1: live documentation access improves correctness
            </h3>
            <p>
              Giving the agent access to a live MCP server for the API should change that
              behaviour. Live documentation access should reduce fabricated API constraints,
              improve architectural correctness, and increase the chance of a working
              implementation on features the agent does not know well.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Hypothesis 2: prompt precision can substitute for live documentation access
            </h3>
            <p>
              A developer who knows the correct API surface can write it into the prompt
              explicitly. Does that narrow the gap between MCP and no MCP? Or does
              fabrication persist regardless of how specific the instructions are?
            </p>

            <p>
              To test both, we ran six sessions: three tooling configurations crossed with
              two prompt styles, all against the same task.
            </p>
          </div>
        </Section>

        {/* ─── METHODOLOGY + THE TASK ─── */}
        <Section
          id="methodology"
          chapterLabel="Introduction"
          headline="How we tested it"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <p>
              We ran six benchmark sessions across three tooling configurations and two
              prompt styles, all against the same task. Each run used Claude Code with the
              same underlying question: can the agent correctly map a plain-English
              description of an integration task to the right API features?
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Three configurations, stacked incrementally
            </h3>
            <p>
              Raw HTTP is the baseline: the agent has its training data and writes HTTP
              requests directly. SDK only adds the Resend Node.js SDK — a typed library
              with named methods and known response shapes. SDK + MCP adds the Resend docs
              MCP server on top: a live tool the agent can query mid-session to look up
              documentation while it works. The agent was not instructed to use MCP on
              SDK + MCP runs. It was simply available in the environment.
            </p>

            <ConfigAccessTable />

            <p>
              The API is Resend, a widely used email platform with well-maintained
              documentation, a clean SDK, and an official MCP server. This was deliberate.
              Resend is well represented in LLM training data, which gives the non-MCP runs
              a reasonable chance of performing well. If MCP still adds value on an API the
              agent already knows, that is a stronger result than testing against an obscure
              API with poor training coverage.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              A task that requires composing several non-obvious API features
            </h3>
            <p>
              All six runs received the same underlying task: write a Node.js script that
              sends a personalized broadcast email to a group of premium contacts. The
              prompt does not name any Resend API. The agent must map plain-English
              requirements to the correct API features itself — and several of those
              mappings are non-obvious.
            </p>

            <ConceptMappingTable />

            <p>
              Each feature is documented individually. What makes the task hard is the
              composition: the agent must recognise all six mappings, implement them in the
              correct order, and know that some require multi-step flows not visible from
              the method names alone. None of this is stated in the prompt. The agent must
              know it or find it.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Two prompts describing the same task
            </h3>
            <p>
              The vague prompt describes the task as a non-technical user might: natural
              language, no API names, no structural requirements. The precise prompt
              describes the same task as a developer would: numbered steps, a specified
              runtime, explicit output expectations. Neither prompt names any Resend API.
            </p>

            <PromptCards
              vague="I want to send a newsletter to my premium subscribers. I have a list of customers and want to tag them as premium, store their subscription tier as extra info on their profile, then send them a broadcast email that uses that info to personalize the message. Embed our company logo so it shows up directly in the email body rather than as an attachment. Make sure the send is safe to retry without sending duplicates."
              preciseIntro="You are building a Node.js script that sends a personalized broadcast email to a group of premium customers using a transactional email API. The script should:"
              preciseSteps={[
                'Define a customer group for premium users.',
                'Create a customer profile with a custom property that stores their subscription tier.',
                'Add that customer to the premium group.',
                'Compose a broadcast email to the entire premium group where the message body is personalized using the customer\'s subscription tier property. The email should display the company logo inline in the HTML body, not as a downloadable attachment.',
                'Send the broadcast in a way that is safe to retry — if the script runs twice, the email should not be sent twice.',
              ]}
              preciseOutro="Use environment variables for all API keys. The script should be runnable from the command line and log the result of each step."
            />
          </div>
        </Section>

        {/* ─── API ONLY ─── */}
        <Section
          id="api-only"
          chapterLabel="Results — Raw HTTP"
          headline="API only: no SDK, no MCP"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <p className="text-stone-500 dark:text-stone-400 italic text-[13px]">
              Agent uses training data only. No installed library. No live documentation.
            </p>

            <p>
              The raw HTTP configuration is the baseline. No SDK, no MCP — the agent
              writes HTTP requests directly and draws entirely on what it knows from
              training data. The two runs in this section show what that looks like in
              practice: where training data is strong, the agent produces correct
              implementations confidently and quickly. Where it is thin or wrong, it
              produces confident wrong answers with no indication that anything went
              sideways.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              What the agent did
            </h3>
            <p>
              Both runs used the same base prompts shown in the task section above, with
              one addition:
            </p>
            <div className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1 my-3 text-[13px] text-stone-500 dark:text-stone-400 italic font-sans">
              "Use raw HTTP requests only (fetch or axios). Do not use any Resend SDK or npm package."
            </div>
            <p>
              No MCP was available. The agent drew entirely on training data.
            </p>

            <AgentActivity
              runs={[
                {
                  label: 'Vague — raw HTTP',
                  promptStyle: 'vague',
                  tools: [
                    { name: 'Agent', count: 2, category: 'other' },
                    { name: 'Bash',  count: 1, category: 'run'   },
                    { name: 'Write', count: 1, category: 'write' },
                  ],
                },
                {
                  label: 'Precise — raw HTTP',
                  promptStyle: 'precise',
                  tools: [
                    { name: 'Agent', count: 1, category: 'other' },
                    { name: 'Bash',  count: 2, category: 'run'   },
                    { name: 'Read',  count: 1, category: 'read'  },
                    { name: 'Skill', count: 1, category: 'other' },
                    { name: 'Write', count: 1, category: 'write' },
                  ],
                },
              ]}
            />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Qualitative results
            </h3>
            <p>
              The table below scores each run concept by concept. These are the six
              features the task required. Each is scored Yes, Partial, or No based on
              whether the agent implemented it correctly.
            </p>

            <ConceptScoreTable
              columns={['Vague', 'Precise']}
              rows={[
                { concept: 'Tag premium users (Segments API)',            scores: ['Partial', 'Yes']     },
                { concept: 'Store subscription tier (Contact Properties)', scores: ['Partial', 'Partial'] },
                { concept: 'Broadcast email (create + send)',              scores: ['Yes',     'Yes']     },
                { concept: 'Personalize with template variables',          scores: ['Yes',     'Yes']     },
                { concept: 'Inline logo (content_id + cid:)',              scores: ['Yes',     'No']      },
                { concept: 'Idempotency / safe to retry',                  scores: ['Yes',     'Yes']     },
              ]}
              scores={[
                { label: 'Vague',   value: '4.5 / 6' },
                { label: 'Precise', value: '4.0 / 6' },
              ]}
            />

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Vague prompt (4.5/6)
            </h4>
            <p>
              The agent used the Broadcasts API correctly, handled the inline logo with{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">content_id</code>{' '}
              (the correct Resend-native approach), and applied an idempotency key. These
              are well-covered patterns in training data and the agent reached for them
              without hesitation.
            </p>
            <p>
              The misses were architectural. The agent passed contact metadata as an
              inline{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">data</code>{' '}
              field rather than using the Contact Properties API, and it assumed the
              segment already existed rather than creating it programmatically. The code
              runs. The architecture is wrong. Neither gap was flagged.
            </p>

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Precise prompt (4.0/6)
            </h4>
            <p>
              The precise run produced the most structurally complete non-MCP
              implementation: segments, broadcasts, template variables, and an unsubscribe
              URL all present. The numbered prompt explicitly named features the agent
              then correctly implemented.
            </p>
            <p>
              Where the agent hit a gap in its training data, the extra specificity
              backfired. When it reached the inline logo requirement, it wrote a code
              comment stating that CID/attachment-based inline images are not supported
              by the Resend broadcasts endpoint. This is false. It then used a base64
              data URI instead, citing the invented constraint as justification. No
              clarifying question. The fabricated constraint was written as if it were
              documented behaviour.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Quantitative results
            </h3>

            <TokenBar
              visibleIds={['vague-raw-api', 'precise-raw-api']}
              highlightIds={['vague-raw-api', 'precise-raw-api']}
            />

            <p>
              The vague run completed in 6 turns with 111,136 cache read tokens. The
              precise run took 11 turns and read 667,099 cached tokens — six times more
              internal context retrieval before writing. More instruction produced more
              deliberation, still bounded entirely by training data. Neither run queried
              any external source despite it being available.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Summary
            </h3>

            <p>
              Both runs scored similarly: 4.5/6 (vague) and 4.0/6 (precise). The precise
              prompt did not improve the score. It produced a more complete implementation
              in some areas while creating a more confident wrong answer in others.
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Vague:</strong>{' '}
                Fast, mostly correct, silent gaps. The agent reached for familiar patterns
                and stopped. It did not search for what it did not know.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Precise:</strong>{' '}
                More complete, more deliberate, one fabricated constraint. The structured
                prompt unlocked more of what the agent knew, but when it hit the edge of
                its training data, it invented a fact rather than admitting uncertainty.
              </li>
            </ul>
            <p>
              Without live documentation access, the ceiling is set entirely by training
              data coverage. The agent will not tell you when it has reached that ceiling.
            </p>

            <RunSummaryCards
              runs={[
                {
                  label:     'Vague',
                  score:     '4.5 / 6',
                  turns:     6,
                  cacheRead: '111k',
                  keyMiss:   'Contact Properties API missed (used inline data field). Segment assumed to exist rather than created programmatically.',
                },
                {
                  label:     'Precise',
                  score:     '4.0 / 6',
                  turns:     11,
                  cacheRead: '667k',
                  keyMiss:   'Fabricated constraint: claimed CID inline images are unsupported by Resend broadcasts. Used base64 data URI instead.',
                },
              ]}
            />
          </div>
        </Section>

        {/* ─── SDK ONLY ─── */}
        <Section
          id="sdk-only"
          chapterLabel="Results — SDK"
          headline="SDK only: typed library, no MCP"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <p className="text-stone-500 dark:text-stone-400 italic text-[13px]">
              Resend Node.js SDK pre-installed. Agent uses training data and SDK types. No live documentation.
            </p>

            <p>
              The SDK gives the agent a typed, installable interface: method names,
              response shapes, and parameter structures encoded in the library. The
              question is whether this static scaffolding closes the gaps that raw HTTP
              left open, or whether the agent still relies on training data for anything
              not derivable from the types alone. These two runs give a clear answer: the
              SDK amplifies whatever the prompt provides. With a vague prompt, it made
              things worse. With a precise prompt, it made things significantly better.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              What the agent did
            </h3>
            <p>
              Both runs used the same base prompts with one addition:
            </p>
            <div className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1 my-3 text-[13px] text-stone-500 dark:text-stone-400 italic font-sans">
              "Use the Resend Node.js SDK (resend npm package)."
            </div>
            <p>
              The SDK was pre-installed. No MCP was available. The agent had training data
              and SDK types to work with.
            </p>

            <AgentActivity
              runs={[
                {
                  label: 'Vague — SDK',
                  promptStyle: 'vague',
                  tools: [
                    { name: 'Agent', count: 1, category: 'other' },
                    { name: 'Read',  count: 1, category: 'read'  },
                    { name: 'Bash',  count: 2, category: 'run'   },
                    { name: 'Write', count: 2, category: 'write' },
                  ],
                },
                {
                  label: 'Precise — SDK',
                  promptStyle: 'precise',
                  tools: [
                    { name: 'Agent', count: 1, category: 'other' },
                    { name: 'Read',  count: 2, category: 'read'  },
                    { name: 'Bash',  count: 3, category: 'run'   },
                    { name: 'Write', count: 1, category: 'write' },
                    { name: 'Edit',  count: 1, category: 'write' },
                  ],
                },
              ]}
            />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Qualitative results
            </h3>

            <ConceptScoreTable
              columns={['Vague', 'Precise']}
              rows={[
                { concept: 'Tag premium users (Segments API)',             scores: ['No',      'Yes']     },
                { concept: 'Store subscription tier (Contact Properties)', scores: ['No',      'Partial'] },
                { concept: 'Broadcast email (create + send)',              scores: ['No',      'Partial'] },
                { concept: 'Personalize with template variables',          scores: ['Partial', 'Yes']     },
                { concept: 'Inline logo (content_id + cid:)',              scores: ['Yes',     'No']      },
                { concept: 'Idempotency / safe to retry',                  scores: ['Partial', 'Yes']     },
              ]}
              scores={[
                { label: 'Vague',   value: '1.5 / 6' },
                { label: 'Precise', value: '4.0 / 6' },
              ]}
            />

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Vague prompt (1.5/6) — lowest score in the benchmark
            </h4>
            <p>
              The agent used{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">resend.emails.send()</code>{' '}
              in a loop, sending individual emails to each contact rather than using the
              Broadcasts API. It missed the Segments API entirely, filtering contacts
              locally in JavaScript instead. When it could not find the Contact Properties
              API, it acknowledged the gap in a code comment and moved on without
              searching for it. The SDK narrowed the agent's search space. Without prompt
              guidance toward broadcast-specific methods, it found{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">emails.send()</code>{' '}
              first and stopped.
            </p>

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Precise prompt (4.0/6) — largest prompt delta in the benchmark
            </h4>
            <p>
              The precise prompt explicitly named the Broadcasts API, the Segments API,
              and SDK method patterns like{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">resend.segments.create()</code>.
              The agent followed those references and got the core broadcast architecture
              right — the clearest example in the benchmark of prompt detail substituting
              for tooling. Where the developer knew enough to name the right methods, the
              agent used them.
            </p>
            <p>
              The fabrication pattern reappeared on inline images. The agent stated the
              Resend SDK does not support{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">contentId</code>{' '}
              on attachments, then worked around the constraint it invented. No SDK source
              check. Written as fact, built around as if documented.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Quantitative results
            </h3>

            <TokenBar
              visibleIds={['vague-raw-api', 'precise-raw-api', 'vague-sdk', 'precise-sdk']}
              highlightIds={['vague-sdk', 'precise-sdk']}
            />

            <p>
              Both runs followed the same pattern as their raw HTTP counterparts: more
              instructions produced more internal context retrieval, all bounded by
              training data. Neither run queried any external source despite it being
              available. The additional turns over the raw HTTP runs reflect SDK method
              exploration happening entirely within training data.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Summary
            </h3>

            <p>
              The SDK is a multiplier on prompt quality, not a floor. The 2.5-point gap
              between vague and precise is the largest delta of any configuration in the
              benchmark.
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Vague:</strong>{' '}
                Worse than raw HTTP with the same prompt. The SDK's familiar entry points
                led the agent away from broadcast-specific methods rather than toward them.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Precise:</strong>{' '}
                Better than raw HTTP with the same prompt. Named methods unlocked SDK
                features the vague prompt never found. The fabrication problem persisted
                regardless.
              </li>
            </ul>

            <PromptDeltaTable
              highlightConfig="SDK"
              visibleConfigs={['Raw HTTP', 'SDK']}
            />

            <RunSummaryCards
              runs={[
                {
                  label:     'Vague',
                  score:     '1.5 / 6',
                  turns:     10,
                  cacheRead: '190k',
                  keyMiss:   'Broadcasts API missed entirely — sent individual emails in a loop. Segments API also missed. Lowest score in the benchmark.',
                },
                {
                  label:     'Precise',
                  score:     '4.0 / 6',
                  turns:     12,
                  cacheRead: '248k',
                  keyMiss:   'Fabricated constraint: claimed SDK does not support contentId on attachments. Used base64 data URI instead.',
                },
              ]}
            />
          </div>
        </Section>

        {/* ─── SDK + MCP ─── */}
        <Section
          id="sdk-mcp"
          chapterLabel="Results — SDK + MCP"
          headline="SDK + MCP: typed library and live documentation server"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <p className="text-stone-500 dark:text-stone-400 italic text-[13px]">
              Resend Node.js SDK pre-installed. Resend MCP server active. Agent can query live API documentation.
            </p>

            <p>
              With MCP active, the agent had a third source to draw on beyond training
              data and SDK types: a live tool it could query mid-session to look up
              documentation. The question is not whether this helped — it did — but how.
              Both runs show MCP functioning as a discovery tool, letting the agent find
              correct API patterns it would otherwise have guessed at. In the precise run,
              it went further: the agent executed the code, hit real errors, and iterated
              against live API responses. No other run in the benchmark did this.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              What the agent did
            </h3>
            <p>
              The prompts were identical to the SDK runs. No configuration addition was
              needed: the MCP server was simply present in the environment. The agent was
              not instructed to use it. Both runs discovered and used it independently.
            </p>

            <AgentActivity
              runs={[
                {
                  label: 'Vague — SDK + MCP',
                  promptStyle: 'vague',
                  tools: [
                    { name: 'mcp__resend__search_resend', count: 4, category: 'mcp'   },
                    { name: 'ToolSearch',                 count: 2, category: 'other' },
                    { name: 'AskUserQuestion',            count: 1, category: 'other' },
                    { name: 'Read',                       count: 1, category: 'read'  },
                    { name: 'Bash',                       count: 2, category: 'run'   },
                    { name: 'Write',                      count: 3, category: 'write' },
                  ],
                },
                {
                  label: 'Precise — SDK + MCP',
                  promptStyle: 'precise',
                  tools: [
                    { name: 'mcp__resend__search_resend', count: 8,  category: 'mcp'   },
                    { name: 'ToolSearch',                 count: 1,  category: 'other' },
                    { name: 'Skill',                      count: 1,  category: 'other' },
                    { name: 'Read',                       count: 2,  category: 'read'  },
                    { name: 'Bash',                       count: 23, category: 'run'   },
                    { name: 'Write',                      count: 3,  category: 'write' },
                    { name: 'Edit',                       count: 2,  category: 'write' },
                  ],
                },
              ]}
            />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Qualitative results
            </h3>

            <ConceptScoreTable
              columns={['Vague', 'Precise']}
              rows={[
                { concept: 'Tag premium users (Segments API)',             scores: ['Yes',     'Partial'] },
                { concept: 'Store subscription tier (Contact Properties)', scores: ['Yes',     'Yes']     },
                { concept: 'Broadcast email (create + send)',              scores: ['Yes',     'Yes']     },
                { concept: 'Personalize with template variables',          scores: ['Yes',     'Yes']     },
                { concept: 'Inline logo (content_id + cid:)',              scores: ['Partial', 'Yes']     },
                { concept: 'Idempotency / safe to retry',                  scores: ['Yes',     'Yes']     },
              ]}
              scores={[
                { label: 'Vague',   value: '5.0 / 6' },
                { label: 'Precise', value: '5.5 / 6' },
              ]}
            />

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Vague prompt (5.0/6)
            </h4>
            <p>
              MCP compensated for what the vague prompt left unspecified. The agent
              queried the MCP server four times and discovered the Broadcasts API, the
              Segments API, and the Contact Properties API — all three of which the vague
              SDK run missed entirely. It correctly implemented the two-step Contact
              Properties flow (create property, then assign to contact) that no non-MCP
              run got right.
            </p>
            <p>
              The one miss: the agent used a data URI for the inline logo rather than{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">content_id</code>.
              It had the tooling to find the correct approach and did not use it here.
            </p>

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Precise prompt (5.5/6) — highest score in the benchmark
            </h4>
            <p>
              The precise MCP run is categorically different from every other run in the
              benchmark. The agent queried MCP eight times, used{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">content_id</code>{' '}
              for inline images correctly, implemented the Contact Properties API as a
              proper two-step create-then-assign flow, and then executed the code against
              the live API. It ran the script more than 20 times, reading real error
              responses and correcting the implementation between runs. Every other run in
              the benchmark wrote code and stopped. This run treated execution as part of
              the task.
            </p>
            <p>
              The one partial miss: the agent searched for{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">resend.segments</code>{' '}
              via MCP twice, concluded the SDK does not expose it cleanly, and fell back
              to Audiences as a pragmatic alternative. It flagged the gap explicitly
              rather than fabricating a constraint.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Quantitative results
            </h3>

            <TokenBar
              visibleIds={['vague-raw-api', 'precise-raw-api', 'vague-sdk', 'precise-sdk', 'vague-sdk-mcp', 'precise-sdk-mcp']}
              highlightIds={['vague-sdk-mcp', 'precise-sdk-mcp']}
            />

            <p>
              The numbers reflect two fundamentally different working modes. The vague run
              was more active than any non-MCP run but still recognisable in shape: 19
              turns, MCP queries mid-session, then done. The precise run is in a different
              category: 55 turns and 2.2M cache read tokens driven by the iterative
              cycle of run, fail, read error, correct, re-run. Neither run queried any
              external source despite it being available.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Summary
            </h3>

            <p>
              MCP changed how the agent worked, not just what it knew. The non-MCP runs
              wrote code and stopped. The MCP runs researched, wrote, and in the precise
              case ran and iterated. MCP also compressed the effect of prompt quality to
              its smallest value in the benchmark.
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Vague:</strong>{' '}
                5.0/6 — higher than every non-MCP run regardless of prompt style. MCP
                substituted for specificity the prompt never provided.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Precise:</strong>{' '}
                5.5/6 — the highest score in the benchmark. The only run to execute the
                code and validate against a live API. Gaps were acknowledged, not invented.
              </li>
            </ul>

            <PromptDeltaTable
              highlightConfig="SDK + MCP"
              visibleConfigs={['Raw HTTP', 'SDK', 'SDK + MCP']}
            />

            <RunSummaryCards
              runs={[
                {
                  label:     'Vague',
                  score:     '5.0 / 6',
                  turns:     19,
                  cacheRead: '441k',
                  keyMiss:   'Inline logo used data URI instead of content_id despite MCP being available to look up the correct approach.',
                },
                {
                  label:     'Precise',
                  score:     '5.5 / 6',
                  turns:     55,
                  cacheRead: '2.2M',
                  keyMiss:   'Segments API not exposed cleanly by SDK — fell back to Audiences. Gap flagged explicitly, not fabricated.',
                },
              ]}
            />
          </div>
        </Section>

        {/* ─── ALL SIX RUNS + CONCLUSIONS ─── */}
        <Section
          id="all-runs"
          chapterLabel="Results and conclusions"
          headline="What the data shows"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">

            <p>
              The three individual sections show each configuration in isolation. Placing
              all six runs side by side reveals patterns that only become visible at this
              scale: which API features no non-MCP run ever got right, which fabrications
              appeared across multiple runs, and how dramatically prompt precision affected
              results depending on what tooling was available.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Concept coverage across all six runs
            </h3>
            <p>
              Two rows stand out. Contact Properties was the only feature no non-MCP run
              implemented correctly — the two-step create-then-assign flow is not
              well-covered in training data and the agent consistently guessed the wrong
              shape or skipped it entirely. Inline logo handling split along the fabrication
              fault line: the two runs that got it right either happened to know the correct
              approach from training data (vague-raw-api) or confirmed it via MCP
              (precise-sdk-mcp). The three that got it wrong all invented a constraint to
              justify a fallback.
            </p>

            <ConceptScoreTable
              columns={['V-Raw', 'V-SDK', 'V-MCP', 'P-Raw', 'P-SDK', 'P-MCP']}
              rows={[
                { concept: 'Tag premium users (Segments API)',             scores: ['Partial', 'No',      'Yes',     'Yes',     'Yes',     'Partial'] },
                { concept: 'Store subscription tier (Contact Properties)', scores: ['Partial', 'No',      'Yes',     'Partial', 'Partial', 'Yes']     },
                { concept: 'Broadcast email (create + send)',               scores: ['Yes',     'No',      'Yes',     'Yes',     'Partial', 'Yes']     },
                { concept: 'Personalize with template variables',           scores: ['Yes',     'Partial', 'Yes',     'Yes',     'Yes',     'Yes']     },
                { concept: 'Inline logo (content_id + cid:)',               scores: ['Yes',     'Yes',     'Partial', 'No',      'No',      'Yes']     },
                { concept: 'Idempotency / safe to retry',                   scores: ['Yes',     'Partial', 'Yes',     'Yes',     'Yes',     'Yes']     },
              ]}
              scores={[
                { label: 'V-Raw', value: '4.5 / 6' },
                { label: 'V-SDK', value: '1.5 / 6' },
                { label: 'V-MCP', value: '5.0 / 6' },
                { label: 'P-Raw', value: '4.0 / 6' },
                { label: 'P-SDK', value: '4.0 / 6' },
                { label: 'P-MCP', value: '5.5 / 6' },
              ]}
            />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Without MCP, the agent fabricated constraints rather than admitting uncertainty
            </h3>
            <p>
              Across three non-MCP runs, the agent made incorrect claims about API
              capabilities and wrote them into code comments as if they were documented
              behaviour. It did not ask a clarifying question. It did not query an external
              source. It invented a constraint, cited it, and built around it. The MCP runs
              did not produce this pattern — when the agent had a tool to verify a claim, it
              used it.
            </p>

            <FabricationTable />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              MCP is necessary for some features, optional for others
            </h3>
            <p>
              MCP proved necessary for two categories of feature: those requiring API
              patterns not well-covered in training data (the Contact Properties two-step
              flow), and those where the agent would otherwise fabricate a false constraint
              (inline images via{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">content_id</code>).
              For features the agent already knows well — broadcast flow, idempotency keys,
              template variables — MCP added verification but not correctness.
            </p>

            <FeatureCategoryTable />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              MCP improved correctness at a real cost in tokens and turns
            </h3>
            <p>
              The vague-sdk-mcp run used roughly four times as many turns as vague-raw-api.
              The precise-sdk-mcp run is in a different category: 55 turns and 2.2M cache
              read tokens driven by an iterative cycle of run, fail, read error, correct,
              re-run. No non-MCP run executed the code. Every non-MCP run wrote a file and
              stopped. Whether that cost is worth it depends on how much correctness matters
              over plausibility.
            </p>

            <RunMetricsTable />

            <CostCorrectnessScatter />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Prompt precision had diminishing returns as tooling improved
            </h3>
            <p>
              Prompt detail had its largest effect in the SDK configuration, where a precise
              prompt added 2.5 concept score points over a vague one. Its smallest effect
              was with MCP, where the delta was only 0.5 points. The vague-raw-api run
              actually outscored precise-raw-api by 0.5 points: more specificity created
              more opportunities for confident wrong answers. Prompt detail changes what the
              agent attempts. It does not change whether the agent knows when it's wrong.
            </p>

            <PromptDeltaTable
              highlightConfig="SDK + MCP"
              visibleConfigs={['Raw HTTP', 'SDK', 'SDK + MCP']}
            />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              How to use MCP effectively
            </h3>
            <p>The data points to four practical adjustments for developers using agents on integration tasks.</p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Instruct agents to use MCP tools explicitly.</strong>{' '}
                Both MCP runs discovered and used the MCP server without being told to —
                but this is not guaranteed behaviour. Explicitly mentioning available tools
                in the prompt reduces the chance the agent overlooks them.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Use SDK + MCP for multi-step flows and features with sparse training coverage.</strong>{' '}
                The Contact Properties result is the clearest example: without MCP, no run
                got this right. With MCP, both did.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Use precise prompts when MCP is not available, but treat them as a partial fix.</strong>{' '}
                Fabrication in response to knowledge gaps requires live tooling to prevent,
                not better instructions.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Expect MCP runs to cost more.</strong>{' '}
                The precise-sdk-mcp run was the most expensive and the most correct. The
                agent was doing more work, not just generating more tokens.
              </li>
            </ul>

          </div>
        </Section>

        <footer className="pt-16 pb-24 border-t border-stone-200 dark:border-stone-850 mt-8">
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-sans">
            <span>© 2026 Speakeasy</span>
            <span>Do AI Agents Need MCP Servers? — Benchmark Report</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
