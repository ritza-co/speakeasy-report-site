const MAPPINGS = [
  {
    prompt: '"tag as premium"',
    api: 'Segments API',
    detail: 'create segment, assign contacts',
  },
  {
    prompt: '"store subscription tier as extra info on their profile"',
    api: 'Contact Properties API',
    detail: 'separate create step before assignment — two calls',
  },
  {
    prompt: '"broadcast email"',
    api: 'Broadcasts API',
    detail: 'create then send separately — two calls',
  },
  {
    prompt: '"personalize using that info"',
    api: 'Template variables',
    detail: 'contact property key references in broadcast HTML',
  },
  {
    prompt: '"shows up directly in the body"',
    api: 'content_id + cid:',
    detail: 'inline attachment, not base64 data URI',
  },
  {
    prompt: '"safe to retry without duplicates"',
    api: 'Idempotency key',
    detail: 'header on the send call',
  },
]

export default function ConceptMappingTable() {
  return (
    <div className="my-4 space-y-0">
      {MAPPINGS.map((row, i) => (
        <div
          key={i}
          className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3 px-0 border-t border-stone-200 dark:border-stone-800 ${i === MAPPINGS.length - 1 ? 'border-b' : ''}`}
        >
          <p className="text-[13px] text-stone-500 dark:text-stone-400 italic font-sans leading-snug">
            {row.prompt}
          </p>
          <span className="text-stone-300 dark:text-stone-700 font-sans text-[16px] select-none">→</span>
          <div>
            <p className="text-[13px] font-semibold text-ink dark:text-white font-sans leading-snug">
              {row.api}
            </p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 font-sans mt-0.5">
              {row.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
