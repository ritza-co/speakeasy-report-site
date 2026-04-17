import TOC from './TOC'
import Section from './Section'
import PromptCards from './PromptCards'
import AgentActivity from './AgentActivity'
import ConceptScoreTable from './ConceptScoreTable'
import TokenBar from './TokenBar'
import RunSummaryCards from './RunSummaryCards'
import PromptDeltaTable from './PromptDeltaTable'
import RunMetricsTable from './RunMetricsTable'
import FabricationTable from './FabricationTable'
import FeatureCategoryTable from './FeatureCategoryTable'
import CostCorrectnessScatter from './CostCorrectnessScatter'
import ConfigAccessTable from './ConfigAccessTable'
import ConceptMappingTable from './ConceptMappingTable'
import TestEnvironmentCard from './TestEnvironmentCard'
import { useScrollSpy } from '../hooks/useScrollSpy'

const SECTIONS = [
  { id: 'hypothesis',    label: 'Introduction' },
  { id: 'methodology',   label: 'How we tested it' },
  { id: 'api-only',      label: 'API only' },
  { id: 'sdk-only',      label: 'SDK' },
  { id: 'sdk-mcp',       label: 'SDK + MCP' },
  { id: 'all-runs',      label: 'Results and conclusions' },
]

export default function ResendReport() {
  const activeId = useScrollSpy(SECTIONS.map(s => s.id))

  return (
    <div className="relative">
      <TOC sections={SECTIONS} activeId={activeId} />

      <main className="px-8 md:px-16 xl:pl-24 xl:pr-[320px] max-w-[1280px] pt-16">

        {/* ─── INTRODUCTION ─── */}
        <Section
          id="hypothesis"
          chapterLabel="Introduction"
          headline="When an agent doesn't know the answer, does it say so?"
        >
          <div className="prose-custom space-y-5 text-stone-700 dark:text-stone-300 leading-relaxed text-[15px]">
            <p>
              Resend is a widely used email API with good documentation and strong
              representation in LLM training data. We chose it because it gives the
              agent a reasonable chance of doing well without any extra tooling. If MCP
              server access changes how an agent interacts with an API it already knows,
              that is a stronger result than testing against something obscure.
            </p>

            <p>
              The task was the same in every session:
            </p>
            <p>
              Write a Node.js script that sends a personalized broadcast email to a group of premium contacts, using several Resend API features that are non-obvious to compose correctly.
            </p>
            <p>
              We ran six sessions using three tooling configurations and two prompt
              styles. The headline finding was behavioral.
              In the three non-MCP runs, the agent invented API constraints that didn't exist,
              wrote them into code comments as documented behavior, and built workarounds
              for them. When it had access to a tool for verifying a claim, the agent checked the tool.
              When it didn't, it guessed and moved on.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Key findings
            </h3>

            <div>
              <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">MCP eliminated fabrication</p>
              <p>
                In the non-MCP runs, the agent produced at least one fabricated constraint. The agent
                claimed CID inline images were unsupported by Resend broadcasts. In
                the SDK runs, it claimed that the SDK didn't support <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">contentId</code>
                on attachments. Both claims were false, but the agent stated both with confidence and developed alternative approaches.
                None of the runs where it had access to the MCP server resulted in any fabricated constraints.
              </p>
            </div>

            <div>
              <p className="font-sans font-semibold text-[14px] text-ink dark:text-white mb-1">A more detailed prompt did not help</p>
              <p>
                We ran each tooling configuration with two prompts: a simple natural-language
                description, and a detailed developer-style prompt with numbered steps and
                explicit output requirements. The complex prompt improved scores in some runs,
                but it didn't prevent fabrication. When the agent hit the edge of what it
                knew, it invented an answer regardless of how specific the instructions were.
              </p>
            </div>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              What we were testing
            </h3>
            <p>
              Does giving an agent access to live API documentation reduce fabrication?
              And can a more precise prompt substitute access to an MCP documentation server if the
              developer already knows the correct API surface and writes it into the instructions?
            </p>
          </div>
        </Section>

        {/* ─── METHODOLOGY + THE TASK ─── */}
        <Section
          id="methodology"
          chapterLabel="Setup"
          headline="How we tested it"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <p>
              We ran six benchmark sessions, testing the two prompt styles with each of the
              three tooling configurations.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Three configurations, stacked incrementally
            </h3>
            <p>
              <b>Raw HTTP</b> was our baseline configuration. The agent could access its training data and web search,
              and write HTTP requests directly. No SDK or MCP was installed.
            </p>
            <p>
              <b>SDK</b> added the Resend Node.js SDK on top of Raw HTTP, giving the agent access to a typed library 
              with named methods and known response shapes. Web search remained available.
            </p>
            <p>
              <b>SDK + MCP</b> added the Resend docs MCP server on top of the SDK,
              creating a live tool the agent could query mid-session to look up documentation
              while it worked. We didn't explicitly instruct the agent to use the MCP server on SDK + MCP runs,
              but the Resend MCP server was available in the environment.
            </p>

            <ConfigAccessTable />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              A task that requires composing several non-obvious API features
            </h3>
            <p>
              We set the agent the same task in each of the six benchmark sessions:
              Write a Node.js script that sends a personalized broadcast email to a 
              group of premium contacts. The prompt didn't name any Resend APIs. The
              agent had to map plain-English requirements to the correct API features
              itself, and several of those mappings were non-obvious.
            </p>

            <ConceptMappingTable />

            <p>
              Resend documents each feature individually. What made the task difficult was the
              composition: The agent had to recognize all six mappings, implement them in the
              correct order, and know that some required multi-step flows that aren't 
              visible from the method names alone. We didn't state any of this in the prompts.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Two prompts describing the same task
            </h3>
            <p>
              The simple prompt described the task as a non-technical user might: with natural
              language, no API names, and no structural requirements. The complex prompt
              described the same task as a developer would: with numbered steps, a specified
              runtime, and explicit output expectations. Neither prompt named any Resend APIs.
            </p>

            <PromptCards
              simple="I want to send a newsletter to my premium subscribers. I have a list of customers and want to tag them as premium, store their subscription tier as extra info on their profile, then send them a broadcast email that uses that info to personalize the message. Embed our company logo so it shows up directly in the email body rather than as an attachment. Make sure the send is safe to retry without sending duplicates."
              complexIntro="You are building a Node.js script that sends a personalized broadcast email to a group of premium customers using a transactional email API. The script should:"
              complexSteps={[
                'Define a customer group for premium users.',
                'Create a customer profile with a custom property that stores their subscription tier.',
                'Add that customer to the premium group.',
                'Compose a broadcast email to the entire premium group where the message body is personalized using the customer\'s subscription tier property. The email should display the company logo inline in the HTML body, not as a downloadable attachment.',
                'Send the broadcast in a way that is safe to retry — if the script runs twice, the email should not be sent twice.',
              ]}
              complexOutro="Use environment variables for all API keys. The script should be runnable from the command line and log the result of each step."
            />

            <TestEnvironmentCard model="Claude Sonnet 4.6" date="23 March 2026" />
          </div>
        </Section>

        {/* ─── API ONLY ─── */}
        <Section
          id="api-only"
          chapterLabel="Results — Raw HTTP"
          headline="API only: No SDK, no MCP"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <p className="text-stone-600 dark:text-stone-400 italic text-[13px]">
              The agent used training data and web search, without an installed library or live documentation.
            </p>

            <p>
              The raw HTTP configuration was the agent's baseline tool setup, with no SDK or MCP. The
              agent wrote HTTP requests directly and drew entirely on what it knew
              from training data. The two runs in this section show what that looked like
              in practice:
            </p>
            <ul>
              <li>Where its training data was strong, the agent produced correct implementations confidently and quickly.</li>
              <li>Where its training data was thin or wrong, the agent produced confident wrong answers with no indication that anything went sideways.</li>
            </ul>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              What the agent did
            </h3>
            <p>
              Both runs used the same base prompts shown in the task section above, with
              one addition:
            </p>
            <div className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1 my-3 text-[13px] text-stone-600 dark:text-stone-400 italic font-sans">
              "Use raw HTTP requests only (fetch or axios). Do not use any Resend SDK or npm package."
            </div>
            <p>
              No SDK or MCP server was available. The agent had training data and web search.
            </p>

            <AgentActivity
              runs={[
                {
                  label: 'Simple — raw HTTP',
                  promptStyle: 'simple',
                  tools: [
                    { name: 'Agent', count: 2, category: 'other' },
                    { name: 'Bash',  count: 1, category: 'run'   },
                    { name: 'Write', count: 1, category: 'write' },
                  ],
                },
                {
                  label: 'Complex — raw HTTP',
                  promptStyle: 'complex',
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
              The table below scores each run, concept by concept. These are the six
              features the task required. Each is scored <strong>Yes</strong>, <strong>Partial</strong>, or <strong>No</strong> based on
              whether the agent implemented it correctly.
            </p>

            <ConceptScoreTable
              columns={['Simple', 'Complex']}
              rows={[
                { concept: 'Tag premium users (Segments API)',            scores: ['Partial', 'Yes']     },
                { concept: 'Store subscription tier (Contact Properties)', scores: ['Partial', 'Partial'] },
                { concept: 'Broadcast email (create + send)',              scores: ['Yes',     'Yes']     },
                { concept: 'Personalize with template variables',          scores: ['Yes',     'Yes']     },
                { concept: 'Inline logo (content_id + cid:)',              scores: ['Yes',     'No']      },
                { concept: 'Idempotency / safe to retry',                  scores: ['Yes',     'Yes']     },
              ]}
              scores={[
                { label: 'Simple',  value: '4.5 / 6' },
                { label: 'Complex', value: '4.0 / 6' },
              ]}
            />

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Simple prompt (4.5/6)
            </h4>
            <p>
              The agent dispatched a subagent to fetch the Resend docs, got the real API
              documentation back from the subagent, and wrote the script. Where its training data was strong,
              it moved fast and got things right. It handled the inline logo correctly, using{' '}
              <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">content_id</code>{' '}
              and a <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">cid:</code>{' '}
              reference. The broadcast and idempotency key were both correct.
            </p>
            <p>
              Where the agent didn't know the correct approach, it substituted the nearest
              plausible one and kept moving. Nothing in the output indicated a gap had been
              filled. For example, contact metadata landed in the wrong place entirely. The
              agent used a generic field rather than the dedicated API, annotating it as{' '}
              <span className="italic">"stores arbitrary key/value metadata on the contact"</span>{''}
              as if that were the intended pattern. It also assumed the premium segment
              already existed. Neither problem was flagged or produced an error.
            </p>

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Complex prompt (4.0/6)
            </h4>
            <p>
              The complex prompt produced a more complete implementation. Where the prompt named
              a feature explicitly, the agent delivered it. But when the agent hit a gap
              in its knowledge, extra specificity made things worse, not better. Rather
              than flagging uncertainty, it treated an ambiguous research result as
              definitive, stated a false constraint as fact, and built a workaround for
              it. The output looked considered but was incorrect.
            </p>
            <p>
              The research step surfaced a caveat, noting that inline image embedding via
              CID is only documented on the standard email endpoint and suggesting the
              developer "confirm with Resend support" whether it works on broadcasts. The
              agent's response:
            </p>
            <div className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1 my-3 text-[13px] text-stone-600 dark:text-stone-400 italic font-sans">
              "Broadcasts don't support attachments, so inline CID images won't work for
              broadcasts."
            </div>
            <p>
              Without verification, the agent changed to a different approach. The claim was false:
              The correct method works on the broadcasts endpoint. A developer reviewing
              the output would have spotted it immediately, but the agent had no indication
              that anything had gone wrong.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Quantitative results
            </h3>

            <TokenBar
              visibleIds={['simple-raw-api', 'complex-raw-api']}
              highlightIds={['simple-raw-api', 'complex-raw-api']}
            />

            <p>
              The simple run completed in six agent actions with 111,136 cache read tokens. The
              complex run took 11 agent actions and read 667,099 cached tokens, using six times more
              internal context retrieval before writing. More instruction produced more
              deliberation, still bounded entirely by training data. Neither run queried
              any external sources, despite them being available.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Summary
            </h3>

            <p>
              Both runs scored similarly. The simple prompt got 4.5/6 and the complex prompt got 4.0/6.
              The complex prompt didn't improve the score. It produced a more complete
              implementation in some areas, while creating a more confident incorrect answer
              in others.
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Simple:</strong>{' '}
                This run was mostly correct, but the agent filled gaps silently. It reached for
                familiar patterns without searching for what it didn't know.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Complex:</strong>{' '}
                This run was more complete and deliberate, but had one fabricated constraint. The
                structured prompt unlocked more of what the agent knew, but when it hit the edge of
                its training data, it invented a fact rather than admitting uncertainty.
              </li>
            </ul>
            <p>
              Without live documentation access, the ceiling was set entirely by training
              data coverage. The agent won't tell you when it has reached that ceiling.
            </p>

            <RunSummaryCards
              runs={[
                {
                  label:     'Simple',
                  score:     '4.5 / 6',
                  turns:     6,
                  cacheRead: '111k',
                  keyMiss:   'Contact Properties API missed (used inline data field). Segment assumed to exist rather than created programmatically.',
                },
                {
                  label:     'Complex',
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
          headline="SDK: Typed library, no MCP"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <p className="text-stone-600 dark:text-stone-400 italic text-[13px]">
              The Resend Node.js SDK was pre-installed. The agent used training data, web search, and SDK types, but no live documentation.
            </p>

            <p>
              The SDK gave the agent a typed, installable interface, with method names,
              response shapes, and parameter structures encoded in the library. The
              question is whether this static scaffolding closed the gaps that the raw HTTP
              runs left open, or whether the agent still relied on training data for anything
              it couldn't derive from the types alone. These two runs gave a clear answer: The
              SDK amplifies whatever the prompt provides, making things worse with a simple
              prompt and significantly better with a complex one.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              What the agent did
            </h3>
            <p>
              Both runs used the same base prompts with one addition:
            </p>
            <div className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1 my-3 text-[13px] text-stone-600 dark:text-stone-400 italic font-sans">
              "Use the Resend Node.js SDK (resend npm package)."
            </div>
            <p>
              The SDK was pre-installed. No MCP was available. The agent had training data,
              web search, and SDK types to work with.
            </p>

            <AgentActivity
              runs={[
                {
                  label: 'Simple — SDK',
                  promptStyle: 'simple',
                  tools: [
                    { name: 'Agent', count: 1, category: 'other' },
                    { name: 'Read',  count: 1, category: 'read'  },
                    { name: 'Bash',  count: 2, category: 'run'   },
                    { name: 'Write', count: 2, category: 'write' },
                  ],
                },
                {
                  label: 'Complex — SDK',
                  promptStyle: 'complex',
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
              columns={['Simple', 'Complex']}
              rows={[
                { concept: 'Tag premium users (Segments API)',             scores: ['No',      'Yes']     },
                { concept: 'Store subscription tier (Contact Properties)', scores: ['No',      'Partial'] },
                { concept: 'Broadcast email (create + send)',              scores: ['No',      'Partial'] },
                { concept: 'Personalize with template variables',          scores: ['Partial', 'Yes']     },
                { concept: 'Inline logo (content_id + cid:)',              scores: ['Yes',     'No']      },
                { concept: 'Idempotency / safe to retry',                  scores: ['Partial', 'Yes']     },
              ]}
              scores={[
                { label: 'Simple',  value: '1.5 / 6' },
                { label: 'Complex', value: '4.0 / 6' },
              ]}
            />

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Simple prompt (1.5/6) — lowest score in the benchmark
            </h4>
            <p>
              The SDK gave the agent a starting point, and it went straight to the
              most familiar method and stopped. Without any prompt guidance toward
              broadcast-specific features, it solved the task as a basic email loop:
              iterating over contacts and sending each one individually. It missed all
              the broadcast architecture, contact grouping, and stored profile data.
              When it couldn't find a method for storing contact metadata, it noted
              the gap in a comment and kept going, without searching or asking.
            </p>
            <p>
              The agent's own summary of how it handled the subscription-tier requirement:
            </p>
            <div className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1 my-3 text-[13px] text-stone-600 dark:text-stone-400 italic font-sans">
              "Tier is held in your customer record and injected into the email at send
              time (Resend's v4 contact API doesn't expose a free-form metadata bag, so
              the tier lives in your data layer)"
            </div>
            <p>
              This was written as a design decision, not a limitation. Using the existing Contact
              Properties API would have been the correct approach.
            </p>

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Complex prompt (4.0/6) — largest prompt delta in the benchmark
            </h4>
            <p>
              Where the simple prompt let the agent default to what it knew, the complex
              prompt named what it needed to do. The agent followed these references and
              the core architecture came out correctly. This is the clearest example in the
              benchmark of developer knowledge substituting for tooling: When the prompt
              was specific enough, the agent delivered.
            </p>
            <p>
              The fabrication pattern reappeared when the agent hit a gap. Rather than
              searching the SDK or flagging uncertainty, it declared a constraint and
              built around it. From its pre-write notes:
            </p>
            <div className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1 my-3 text-[13px] text-stone-600 dark:text-stone-400 italic font-sans">
              "Inline logo: Broadcasts don't support attachments/CID the same way
              transactional emails do. I'll use a data URI (base64-encoded) for the
              inline logo in the HTML body, which works without attachments."
            </div>
            <p>
              The agent wrote the apparent lack of support as fact and built around it 
              as if it were documented, without making any checks. The correct approach was
              available in the SDK.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Quantitative results
            </h3>

            <TokenBar
              visibleIds={['simple-raw-api', 'complex-raw-api', 'simple-sdk', 'complex-sdk']}
              highlightIds={['simple-sdk', 'complex-sdk']}
            />

            <p>
              Both runs followed the same pattern as their raw HTTP counterparts: More
              instructions produced more internal context retrieval, all bounded by
              training data. The agent didn't query any external sources in either run, despite sources being
              available. The additional agent actions over the raw HTTP runs reflect that the agent's SDK method
              exploration happened entirely within training data.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Summary
            </h3>

            <p>
              The SDK acted as a multiplier of prompt quality, not a floor. The 2.5-point gap
              between the simple and complex prompts is the largest delta of any configuration
              in the benchmark.
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Simple:</strong>{' '}
                The agent produced a worse output than it did in the raw HTTP session with the same prompt.
                The SDK's familiar entry points led the agent away from broadcast-specific methods rather than toward them.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Complex:</strong>{' '}
                The agent produced a better output than it did in the raw HTTP session with the same prompt.
                Named methods unlocked SDK features that the simple prompt never found. The fabrication problem
                persisted regardless.
              </li>
            </ul>

            <PromptDeltaTable
              highlightConfig="SDK"
              visibleConfigs={['Raw HTTP', 'SDK']}
            />

            <RunSummaryCards
              runs={[
                {
                  label:     'Simple',
                  score:     '1.5 / 6',
                  turns:     10,
                  cacheRead: '190k',
                  keyMiss:   'Broadcasts API missed entirely — sent individual emails in a loop. Segments API also missed. Lowest score in the benchmark.',
                },
                {
                  label:     'Complex',
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
          headline="SDK + MCP: Typed library and live documentation server"
        >
          <div className="space-y-5 text-stone-700 dark:text-stone-300 text-[15px] leading-relaxed">
            <p className="text-stone-600 dark:text-stone-400 italic text-[13px]">
              The Resend Node.js SDK was pre-installed, and the Resend MCP server was active. The agent could query live API documentation.
            </p>

            <p>
              With MCP active, the agent had a third source to draw on beyond training
              data and SDK types. It could query the Resend MCP server mid-session to look
              up documentation. Both runs show the MCP server functioning as a discovery tool, letting
              the agent find correct API patterns it would otherwise have guessed at. The
              question is not whether it helped, but how. In the complex run, the agent went further:
              It executed the code, hit real errors, and iterated against live API
              responses, something it did in no other run in the benchmark.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              What the agent did
            </h3>
            <p>
              The prompts were identical to the SDK runs. No additional configuration was
              needed. The MCP server was present in the environment, but the agent wasn't
              instructed to use it. In both runs, the agent discovered and used
              the MCP server independently.
            </p>

            <AgentActivity
              runs={[
                {
                  label: 'Simple — SDK + MCP',
                  promptStyle: 'simple',
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
                  label: 'Complex — SDK + MCP',
                  promptStyle: 'complex',
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
              columns={['Simple', 'Complex']}
              rows={[
                { concept: 'Tag premium users (Segments API)',             scores: ['Yes',     'Partial'] },
                { concept: 'Store subscription tier (Contact Properties)', scores: ['Yes',     'Yes']     },
                { concept: 'Broadcast email (create + send)',              scores: ['Yes',     'Yes']     },
                { concept: 'Personalize with template variables',          scores: ['Yes',     'Yes']     },
                { concept: 'Inline logo (content_id + cid:)',              scores: ['Partial', 'Yes']     },
                { concept: 'Idempotency / safe to retry',                  scores: ['Yes',     'Yes']     },
              ]}
              scores={[
                { label: 'Simple',  value: '5.0 / 6' },
                { label: 'Complex', value: '5.5 / 6' },
              ]}
            />

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Simple prompt (5.0/6)
            </h4>
            <p>
              Adding the MCP server changed the agent's behavior before it wrote a single line.
              Instead of defaulting to what it knew, it queried the documentation four times,
              discovering the correct APIs for broadcast sending, contact grouping, and
              profile data storage, which it had missed entirely in the simple SDK run.
              It implemented the multi-step contact properties flow correctly, which was something
              no non-MCP run managed.
            </p>
            <p>
              The one miss was the inline logo. The agent had the tooling to look up the
              correct approach but didn't use it, falling back to a data URI instead.
            </p>

            <h4 className="font-sans font-semibold text-[14px] text-ink dark:text-white pt-2">
              Complex prompt (5.5/6) — highest score in the benchmark
            </h4>
            <p>
              This run was qualitatively different from every other in the benchmark.
              Where every other run wrote code and stopped, this one treated execution
              as part of the task. It ran the script against the live API, read real
              error responses, and corrected the implementation more than 20 times in total.
              When it hit a gap, it verified rather than guessing.
            </p>
            <p>
              For example, when the SDK didn't expose a Segments method, the agent
              inspected the installed package directly to confirm what was available:
            </p>
            <div className="border-l-2 border-stone-300 dark:border-stone-700 pl-4 py-1 my-3 text-[13px] text-stone-600 dark:text-stone-400 italic font-sans">
              "resend.segments isn't exposed on the SDK. Let me check the actual SDK
              surface."
            </div>
            <p>
              It ran a live introspection command, confirmed the gap, fell back to
              Audiences as a documented alternative, and noted the limitation explicitly
              in its output. The gap was real, acknowledged, and the agent worked around it with
              visible reasoning rather than inventing a false constraint.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Quantitative results
            </h3>

            <TokenBar
              visibleIds={['simple-raw-api', 'complex-raw-api', 'simple-sdk', 'complex-sdk', 'simple-sdk-mcp', 'complex-sdk-mcp']}
              highlightIds={['simple-sdk-mcp', 'complex-sdk-mcp']}
            />

            <p>
              The numbers reflect two fundamentally different working modes:
            </p>
            <ul>
              <li>The simple run was more active than any non-MCP run, but still recognizable in shape: 19 agent actions, MCP queries mid-session, and then done.</li>
              <li>The complex run was in a different category: 55 agent actions and 2.2M cache read tokens driven by the iterative cycle of run, fail, read error, correct, and re-run.</li>
            </ul>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Summary
            </h3>

            <p>
              MCP changed how the agent worked. In the non-MCP runs, the agent wrote code and stopped.
              In the MCP runs, it researched, wrote, and in the complex prompt case, ran and iterated
              against live API responses. MCP access also compressed the effect of prompt quality
              to its smallest value in the benchmark.
            </p>
            <ul className="space-y-2 pl-5 list-disc">
              <li>
                <strong className="text-ink dark:text-white">Simple:</strong>{' '}
                Scored 5.0/6, higher than every non-MCP run regardless of prompt style. MCP
                substituted the specificity that the prompt lacked.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Complex:</strong>{' '}
                Scored 5.5/6, the highest in the benchmark. This was the only run to execute the
                code and validate against a live API, acknowledging gaps rather than fabricating
                a constraint.
              </li>
            </ul>

            <PromptDeltaTable
              highlightConfig="SDK + MCP"
              visibleConfigs={['Raw HTTP', 'SDK', 'SDK + MCP']}
            />

            <RunSummaryCards
              runs={[
                {
                  label:     'Simple',
                  score:     '5.0 / 6',
                  turns:     19,
                  cacheRead: '441k',
                  keyMiss:   'Inline logo used data URI instead of content_id despite MCP being available to look up the correct approach.',
                },
                {
                  label:     'Complex',
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
              all six runs side by side reveals a pattern only visible at this scale.
              We can see which API features the agent got wrong in every non-MCP run, which fabrications
              appeared across multiple runs, and how dramatically prompt precision affected
              results depending on the available tooling.
            </p>

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Concept coverage across all six runs
            </h3>
            <p>
              Contact Properties was the only feature that none of the non-MCP runs implemented correctly.
              The two-step create-then-assign flow is not well covered in training data
              and the agent consistently guessed the wrong shape or skipped it entirely.
            </p>
            <p>
              Inline logo handling split along the fabrication fault line: In the runs where
              the agent handled the logo correctly, it either happened to know the right
              approach from its training data (simple-raw-api) or confirmed the approach via MCP
              (complex-sdk-mcp). In all three runs where the agent handled inline logos incorrectly,
              it invented a constraint to justify a fallback.
            </p>

            <ConceptScoreTable
              columns={['S-Raw', 'S-SDK', 'S-MCP', 'C-Raw', 'C-SDK', 'C-MCP']}
              rows={[
                { concept: 'Tag premium users (Segments API)',             scores: ['Partial', 'No',      'Yes',     'Yes',     'Yes',     'Partial'] },
                { concept: 'Store subscription tier (Contact Properties)', scores: ['Partial', 'No',      'Yes',     'Partial', 'Partial', 'Yes']     },
                { concept: 'Broadcast email (create + send)',               scores: ['Yes',     'No',      'Yes',     'Yes',     'Partial', 'Yes']     },
                { concept: 'Personalize with template variables',           scores: ['Yes',     'Partial', 'Yes',     'Yes',     'Yes',     'Yes']     },
                { concept: 'Inline logo (content_id + cid:)',               scores: ['Yes',     'Yes',     'Partial', 'No',      'No',      'Yes']     },
                { concept: 'Idempotency / safe to retry',                   scores: ['Yes',     'Partial', 'Yes',     'Yes',     'Yes',     'Yes']     },
              ]}
              scores={[
                { label: 'S-Raw', value: '4.5 / 6' },
                { label: 'S-SDK', value: '1.5 / 6' },
                { label: 'S-MCP', value: '5.0 / 6' },
                { label: 'C-Raw', value: '4.0 / 6' },
                { label: 'C-SDK', value: '4.0 / 6' },
                { label: 'C-MCP', value: '5.5 / 6' },
              ]}
            />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Without MCP, the agent fabricated constraints rather than admitting uncertainty
            </h3>
            <p>
              Across three of the non-MCP runs, the agent made incorrect claims about API
              capabilities and wrote them into code comments as if they were documented
              behavior. In each case, the agent invented a constraint, cited it, and built
              around it without asking a clarifying question or querying an external source.
              In the MCP runs that didn't produce this pattern, the agent had a tool for verifying
              claims and used it.
            </p>

            <FabricationTable />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              MCP is necessary for some features, but optional for others
            </h3>
            <p>
              MCP proved necessary for two categories of feature:
            </p>
            <ul>
              <li>Features requiring API patterns that aren't well covered in training data, like the Contact Properties two-step
              flow</li>
              <li>Features for which the agent would otherwise fabricate a false constraint, like inline images
              via{' '} <code className="bg-stone-100 dark:bg-stone-800 px-1 rounded text-[13px]">content_id</code></li>
              </ul>
            <p>
              For features the agent already knew well (broadcast flow, idempotency keys,
              and template variables), MCP added verification but not correctness.
            </p>

            <FeatureCategoryTable />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              MCP improved correctness at a real cost in tokens and agent actions
            </h3>
            <p>
              With a simple prompt, the agent used roughly four times as many actions in the SDK + MCP run as it did in the Raw HTTP run.
              With a complex prompt, the SDK + MCP run was in a different category: with 55 agent actions and 2.2M cache
              read tokens, driven by an iterative cycle of run, fail, read error, correct,
              and re-run. In every non-MCP run, the agent wrote a file and stopped without executing it.
              Whether that cost is worth it depends on how much correctness matters
              over plausibility.
            </p>

            <RunMetricsTable />

            <CostCorrectnessScatter />

            <h3 className="font-serif text-xl text-ink dark:text-white pt-4">
              Prompt precision had diminishing returns as tooling improved
            </h3>
            <p>
              Prompt detail most affected the SDK configuration, where a complex
              prompt added 2.5 concept score points over a simple one. It had the least impact
              on the MCP configuration, where the delta was only 0.5 points. In the Raw HTTP runs, the simple prompt
              actually outscored the complex prompt by 0.5 points. More specificity created
              more opportunities for confident wrong answers, demonstrating that prompt detail
              changes what the agent attempts, but not whether it knows when it's wrong.
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
                <strong className="text-ink dark:text-white">Instruct agents to use MCP tools explicitly:</strong>{' '}
                In both our MCP runs, the agent discovered and used the MCP server without being told to,
                but this isn't guaranteed behavior. Explicitly mentioning available tools
                in the prompt reduces the chance of the agent overlooking them.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Use SDK + MCP for multi-step flows and features with sparse training coverage:</strong>{' '}
                The Contact Properties result provides the clearest example: Without MCP, the agent didn't get Contact
                Properties right in any of its runs. With MCP, the agent got it right with both prompts.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Use complex prompts when MCP is not available, but treat them as a partial fix:</strong>{' '}
                Preventing fabrication in response to knowledge gaps requires live tooling,
                not better instructions.
              </li>
              <li>
                <strong className="text-ink dark:text-white">Expect MCP runs to cost more:</strong>{' '}
                The SDK + MCP run with the complex prompt was the most expensive and the most correct. The
                agent was doing more work, not just generating more tokens.
              </li>
            </ul>

          </div>
        </Section>

        <footer className="pt-16 pb-24 border-t border-stone-200 dark:border-stone-850 mt-8">
          <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 font-sans">
            <span>© 2026 Speakeasy</span>
            <span>Do AI Agents Need MCP Servers? — Benchmark Report</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
