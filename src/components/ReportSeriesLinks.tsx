interface ReportSeriesLinksProps {
  onNavigate: (tab: 'resend' | 'vercel') => void
}

const REPORTS = [
  {
    tab: 'resend' as const,
    label: 'Report 1: Resend',
    subtitle: 'Well-documented API',
    description: 'Does MCP tooling improve agent performance on a stable, well-documented REST API? Three conditions, six runs, quantified correctness scores.',
  },
  {
    tab: 'vercel' as const,
    label: 'Report 2: Vercel AI SDK',
    subtitle: 'SDK migration benchmark',
    description: 'Does access to version-specific docs change code quality when an SDK has breaking changes? Four conditions tested against a v4-to-v6 migration.',
  },
]

export default function ReportSeriesLinks({ onNavigate }: ReportSeriesLinksProps) {
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2">
      {REPORTS.map(report => (
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
  )
}
