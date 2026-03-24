import Hero from './components/Hero'
import TOC from './components/TOC'
import ThemeToggle from './components/ThemeToggle'
import Section from './components/Section'
import PromptCards from './components/PromptCards'
import ConceptScoreTable from './components/ConceptScoreTable'
import TokenBar from './components/TokenBar'
import RunSummaryCards from './components/RunSummaryCards'
import PromptDeltaTable from './components/PromptDeltaTable'
import { useScrollSpy } from './hooks/useScrollSpy'

const SECTIONS = [
  { id: 'hypothesis',    label: 'Hypothesis' },
  { id: 'methodology',   label: 'How we tested it' },
  { id: 'the-task',      label: 'The task' },
  { id: 'api-only',      label: 'API only' },
  { id: 'sdk-only',      label: 'SDK only' },
  { id: 'sdk-mcp',       label: 'SDK + MCP' },
  { id: 'all-runs',      label: 'All six runs' },
  { id: 'conclusions',   label: 'Conclusions' },
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
            <p>
              This benchmark tests whether giving the agent access to a live MCP server
              for the API changes that behaviour. The hypothesis is that it does: live
              documentation access should reduce fabricated API constraints, improve
              architectural correctness, and increase the chance of a working
              implementation on features the agent does not know well.
            </p>
            <p>
              A secondary question emerged from the test design. Does prompt precision
              substitute for tooling? A developer who knows the correct API surface can
              write it into the prompt explicitly. Does that narrow the gap between MCP
              and no MCP? Or does fabrication persist regardless of how specific the
              instructions are?
            </p>

            {/* VISUALISATION: 2x3 grid or matrix diagram — the 6 run configurations laid out as a grid
                (vague/precise x raw-api/sdk/sdk+mcp), so the reader can see the shape of the experiment. */}
          </div>
        </Section>

        {/* ─── METHODOLOGY ─── */}
        <Section
          id="methodology"
          chapterLabel="Introduction — Setup"
          headline="Three tooling configurations, two prompt styles, one well-documented API"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <p>
              We ran six benchmark sessions across three tooling configurations and two
              prompt styles, all against the same task.
            </p>
            <p>
              The three configurations stack incrementally. Raw HTTP (no SDK, no MCP) is
              the baseline: the agent has its training data and makes HTTP requests
              directly. SDK only adds the Resend Node.js SDK: a typed library with named
              methods and known response shapes. SDK + MCP adds the Resend docs MCP server
              on top of the SDK: a live tool the agent can query to look up documentation
              while it works.
            </p>
            <p>
              The two prompt styles each describe the same task. One is vague, written as
              a non-technical user might describe it. The other is precise, written as a
              developer would, naming specific capabilities and constraints explicitly.
              Neither prompt tells the agent which Resend APIs to use. The agent must
              figure that out.
            </p>
            <p>
              The API is Resend, a widely used email platform with well-maintained
              documentation, a clean SDK, and an official MCP server. This was a
              deliberate choice. Resend is well represented in LLM training data, which
              gives the non-MCP runs a reasonable chance of performing well. If MCP still
              adds value on an API the agent already knows, that is a stronger result than
              if we had chosen an obscure API with poor training coverage.
            </p>

            {/* VISUALISATION: Short table or icon grid showing what each configuration had access to:
                training data, SDK, MCP — ticked or crossed per run. */}
          </div>
        </Section>

        {/* ─── THE TASK ─── */}
        <Section
          id="the-task"
          chapterLabel="Introduction — Task"
          headline="A non-trivial integration that requires composing several distinct API features"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <p>
              All six runs received the same underlying task: write a Node.js script that
              sends a personalized broadcast email to a group of premium contacts via the
              Resend API. The script must tag contacts as premium (Segments API), store a
              subscription tier on each contact's profile (Contact Properties API), send a
              broadcast email personalized with that property (Broadcasts API), embed a
              company logo inline in the email body rather than as an attachment
              (<code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">content_id</code>),
              and handle idempotency so the send is safe to retry.
            </p>
            <p>
              These features are each documented individually. What makes the task hard is
              the composition: the agent must recognize that "tag them as premium" maps to
              the Segments API, that "store their subscription tier" requires a separate
              Contact Properties create-then-assign flow, and that "show the logo inline"
              means <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">content_id</code> attachment
              with a <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">cid:</code> reference
              in the HTML, not a base64 data URI. None of this is stated in the prompt.
              The agent must know it or find it.
            </p>
            <p>
              The vague prompt described the task in plain English. The precise prompt
              spelled out each capability as a numbered requirement. Both are shown below.
            </p>

            {/* VISUALISATION: The two prompts side by side — styled as code block or callout cards. */}
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
              The two prompts
            </h3>
            <p>
              The vague prompt describes the task as a non-technical user might: natural
              language, no API names, no structural requirements. The precise prompt
              describes the same task as a developer would: numbered steps, a specified
              runtime, explicit output expectations. Neither prompt names any Resend API.
              The agent must figure out the correct mapping in both cases.
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

            <p>
              The key difference is not what the agent is asked to do, but how much
              architectural scaffolding the prompt provides. A vague prompt leaves the
              agent to structure the problem. A precise prompt hands it a skeleton to
              fill in. Whether that skeleton helps or creates new failure modes is one of
              the things this section reveals.
            </p>

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
              data URI instead, citing the invented constraint as justification. No web
              search. No clarifying question. The fabricated constraint was written as if
              it were documented behaviour.
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
              deliberation, still bounded entirely by training data. Neither run called
              the web search tool or any external source.
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
              The two prompts
            </h3>
            <p>
              The same prompts were used across all three configurations. The key dynamic
              in this section is what happens when a typed library is available but the
              prompt does not name any specific methods. The agent finds the most familiar
              entry point in the SDK and stops exploring.
            </p>

            <PromptCards
              vague="I want to send a newsletter to my premium subscribers. I have a list of customers and want to tag them as premium, store their subscription tier as extra info on their profile, then send them a broadcast email that uses that info to personalize the message. Embed our company logo so it shows up directly in the email body rather than as an attachment. Make sure the send is safe to retry without sending duplicates."
              preciseIntro="You are building a Node.js script that sends a personalized broadcast email to a group of premium customers using a transactional email API. The script should:"
              preciseSteps={[
                'Define a customer group for premium users.',
                'Create a customer profile with a custom property that stores their subscription tier.',
                'Add that customer to the premium group.',
                "Compose a broadcast email to the entire premium group where the message body is personalized using the customer's subscription tier property. The email should display the company logo inline in the HTML body, not as a downloadable attachment.",
                'Send the broadcast in a way that is safe to retry — if the script runs twice, the email should not be sent twice.',
              ]}
              preciseOutro="Use environment variables for all API keys. The script should be runnable from the command line and log the result of each step."
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
              on attachments, then worked around the constraint it invented. No web search.
              No SDK source check. Written as fact, built around as if documented.
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
              training data. Neither run called the web search tool or any external source.
              The additional turns over the raw HTTP runs reflect SDK method exploration
              happening entirely within training data.
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
              The two prompts
            </h3>
            <p>
              The same prompts used in the previous two sections. The key dynamic here is
              that MCP compressed the gap between them. A vague prompt with MCP scored
              higher than a precise prompt without it.
            </p>

            <PromptCards
              vague="I want to send a newsletter to my premium subscribers. I have a list of customers and want to tag them as premium, store their subscription tier as extra info on their profile, then send them a broadcast email that uses that info to personalize the message. Embed our company logo so it shows up directly in the email body rather than as an attachment. Make sure the send is safe to retry without sending duplicates."
              preciseIntro="You are building a Node.js script that sends a personalized broadcast email to a group of premium customers using a transactional email API. The script should:"
              preciseSteps={[
                'Define a customer group for premium users.',
                'Create a customer profile with a custom property that stores their subscription tier.',
                'Add that customer to the premium group.',
                "Compose a broadcast email to the entire premium group where the message body is personalized using the customer's subscription tier property. The email should display the company logo inline in the HTML body, not as a downloadable attachment.",
                'Send the broadcast in a way that is safe to retry — if the script runs twice, the email should not be sent twice.',
              ]}
              preciseOutro="Use environment variables for all API keys. The script should be runnable from the command line and log the result of each step."
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
              cycle of run, fail, read error, correct, re-run. Neither run used web search
              despite it being available.
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

        {/* ─── ALL SIX RUNS ─── */}
        <Section
          id="all-runs"
          chapterLabel="Results — Cross-run analysis"
          headline="Results across all six runs"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Tokens, turns, and MCP calls compared
            </h3>
            <p>
              Before looking at concept coverage, the raw activity numbers tell a story
              about how much the agent was actually doing in each run. MCP runs used
              substantially more of every resource. The precise-sdk-mcp run is an outlier
              even within the MCP group. And no non-MCP run ever queried an external source.
            </p>

            {/* VISUALISATION: Full 6-run comparison table. All metrics side by side. */}

            {/* VISUALISATION: Grouped bar chart — turns and output tokens by config and prompt style.
                The precise-sdk-mcp bar is visually isolated from everything else. */}

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Which API features each configuration got right
            </h3>
            <p>
              Two patterns stand out across the concept heatmap. First: the Contact
              Properties API was only implemented correctly by MCP runs. The two-step
              create-then-assign flow is not well-represented in training data, and without
              live documentation the agent either guessed the wrong shape or skipped it.
              Second: inline image handling via{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">content_id</code>{' '}
              was only correct in two runs — vague-raw-api (where the agent happened to get
              it right from training data) and precise-sdk-mcp (where MCP confirmed it).
              The precise-raw-api and precise-sdk runs both fabricated constraints to
              explain why they couldn't do it.
            </p>

            {/* VISUALISATION: Full concept heatmap — 6 columns (runs) x 6 rows (concepts),
                coloured Yes/Partial/No. The Contact Properties row and content_id row
                should be the visually striking ones. */}

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Without MCP, the agent fabricated API constraints rather than admitting uncertainty
            </h3>
            <p>
              Across non-MCP runs, the agent made incorrect claims about API capabilities
              and stated them as facts. It never searched the web. It never asked a
              clarifying question. It wrote the fabricated constraints into code comments
              and proceeded as if those constraints were documented.
            </p>
            <p>
              The MCP runs did not produce this pattern. When the agent had a tool to verify
              a claim, it used it. When it didn't, it invented.
            </p>

            {/* VISUALISATION: Callout table — 3 rows, one per fabricated claim: the run it appeared in,
                the claim the agent made, and what the correct API behaviour actually is. */}

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Prompt detail had the most impact without MCP and the least impact with it
            </h3>
            <p>
              Prompt detail had its largest effect in the SDK configuration, where a precise
              prompt added 2.5 concept score points over a vague one. Its smallest effect
              was in the MCP configuration, where the delta was only 0.5 points. The vague
              raw HTTP run actually outscored the precise raw HTTP run by 0.5 points: a
              more specific prompt created more opportunities for confident wrong answers on
              an API the agent thought it knew.
            </p>
            <p>
              This connects back to the secondary hypothesis. Prompt precision does not
              substitute for tooling. It narrows the agent's search space and can unlock
              SDK-specific methods. It cannot prevent the agent from fabricating facts it
              cannot verify. That requires live tooling.
            </p>

            {/* VISUALISATION: Delta bar chart — vague-to-precise score delta per config
                (raw HTTP −0.5, SDK +2.5, SDK+MCP +0.5). Three bars showing the compression
                effect of MCP. */}
          </div>
        </Section>

        {/* ─── CONCLUSIONS ─── */}
        <Section
          id="conclusions"
          chapterLabel="Conclusions"
          headline="What the data shows"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              MCP improved correctness and eliminated fabrication, at the cost of more tokens and more turns
            </h3>
            <p>
              MCP improved concept coverage in both prompt conditions and eliminated the
              fabrication pattern observed in non-MCP runs. The cost was real: more turns,
              more tokens, more cache activity. The precise-sdk-mcp run used roughly 20
              times more cache read tokens than the vague-raw-api run. Whether that cost is
              worth it depends on how much it matters that the implementation is correct
              rather than plausible.
            </p>

            {/* VISUALISATION: Cost vs correctness scatter — 6 runs plotted by cache token cost on
                x-axis and concept score on y-axis. The tradeoff is the point, not a verdict. */}

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              MCP is necessary for API features with sparse training data coverage
            </h3>
            <p>
              MCP proved necessary for two categories of feature: those that require live
              API patterns unlikely to be well-represented in training data (the Contact
              Properties two-step flow), and those where the agent would otherwise
              fabricate a false constraint (inline images via{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">content_id</code>).
              For features the agent already knows well from training data — standard
              broadcast flow, idempotency keys, template variables — MCP added verification
              but not correctness.
            </p>

            {/* VISUALISATION: Feature categorisation table — three columns: "agent got this right
                without MCP", "agent needed MCP to get this right", "agent fabricated a wrong
                answer without MCP". */}

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Precise prompts improve results without MCP but cannot prevent fabrication
            </h3>
            <p>
              If MCP is not available, prompt detail is the most effective substitute —
              but only up to a point. The precise-sdk run scored 4.0/6 versus 1.5/6 for
              vague-sdk: the structured prompt unlocked SDK-specific methods the agent
              would not have discovered alone. But precise prompting did not fix the
              fabrication problem. The agent still invented constraints it could not verify.
              Prompt detail changes what the agent attempts. It does not change whether the
              agent knows when it's wrong.
            </p>

            {/* VISUALISATION: Short two-column table: "what precise prompting fixes" vs "what it doesn't". */}

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              How to use MCP effectively
            </h3>
            <p>The data points to four practical adjustments for developers using agents on integration tasks.</p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Instruct agents to use MCP tools explicitly.</strong>{' '}
                In none of the MCP runs did the agent use MCP without being asked. The
                tools do not activate automatically.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Use SDK + MCP for multi-step API flows and sparsely documented features.</strong>{' '}
                The Contact Properties API result is the clearest example: without MCP, no
                run got this right. With MCP, both did.
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

            {/* VISUALISATION: Summary decision guide — when to use each config based on API
                familiarity, task complexity, and prompt quality. */}
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
