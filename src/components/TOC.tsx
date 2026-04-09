import { useState, useEffect, useRef } from 'react'

interface Section {
  id: string
  label: string
}

interface TOCProps {
  sections: Section[]
  activeId: string
}

export default function TOC({ sections, activeId }: TOCProps) {
  const [visible, setVisible] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const activeIndex = sections.findIndex(s => s.id === activeId)
  const progress = sections.length > 1 ? activeIndex / (sections.length - 1) : 0

  return (
    <>
      {/* Sentinel: spans the full report so TOC stays visible while scrolling */}
      <div ref={sentinelRef} className="absolute inset-0 w-px pointer-events-none" />

      {visible && (
        <div className="hidden xl:block fixed right-6 top-[122px] w-60 z-20">
          <div className="bg-parchment/90 dark:bg-black/90 backdrop-blur-sm border-t-2 border-crimson pt-4 pb-5 px-5 shadow-sm dark:shadow-stone-900">
            <p className="text-[9px] tracking-[0.3em] uppercase text-stone-600 dark:text-stone-400 mb-4 font-sans">
              In this report
            </p>

            <nav className="space-y-1">
              {sections.map((s) => {
                const isActive = s.id === activeId
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`block w-full text-left text-xs py-1 pl-3 transition-all duration-200 border-l-2 ${
                      isActive
                        ? 'border-crimson text-ink dark:text-white font-medium'
                        : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600'
                    }`}
                  >
                    {s.label}
                  </button>
                )
              })}
            </nav>

            {/* Progress bar */}
            <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-850">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] tracking-widest uppercase text-stone-600 dark:text-stone-400">Progress</span>
                <span className="text-[9px] text-stone-600 dark:text-stone-400">{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full h-[2px] bg-stone-200 dark:bg-stone-850 rounded-full">
                <div
                  className="h-full bg-crimson rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
