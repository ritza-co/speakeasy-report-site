interface EntireSessionLinkProps {
  label: string
  href: string
}

export default function EntireSessionLink({ label, href }: EntireSessionLinkProps) {
  return (
    <div className="my-4 flex items-start gap-3 border border-stone-200 dark:border-stone-800 rounded-lg px-4 py-3 bg-stone-50 dark:bg-stone-900">
      <svg className="mt-0.5 flex-shrink-0 text-crimson" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 font-sans mb-0.5">Session transcript</p>
        <p className="text-[13px] text-ink dark:text-white font-sans mb-1">{label}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-crimson hover:underline font-sans break-all"
        >
          View full session on GitHub →
        </a>
      </div>
    </div>
  )
}
