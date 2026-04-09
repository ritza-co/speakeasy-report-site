import { useState, useRef, useEffect } from 'react'
import Hero from './components/Hero'
import ThemeToggle from './components/ThemeToggle'
import ResendReport from './components/ResendReport'
import VercelReport from './components/VercelReport'
import GuideArticle from './components/GuideArticle'
import FullBenchmarkReport from './components/FullBenchmarkReport'
import HowToHelpAgentsReport from './components/HowToHelpAgentsReport'
import DocuSignReport from './components/DocuSignReport'

type Tab = 'guide' | 'resend' | 'vercel' | 'full' | 'agents' | 'docusign'

const TABS: { id: Tab; label: string; subtitle: string }[] = [
  { id: 'guide',   label: 'Introduction',       subtitle: 'AI agents and context' },
  { id: 'vercel',  label: 'Vercel AI SDK',      subtitle: 'SDK migration benchmark' },
  { id: 'docusign', label: 'DocuSign',          subtitle: 'Complex enterprise API' },
  { id: 'resend',  label: 'Resend',             subtitle: 'Well-documented API' },
  { id: 'agents',  label: 'How to Help Agents', subtitle: 'Private APIs & MCP docs' },
  { id: 'full',    label: 'Full Benchmark',     subtitle: '108 sessions, 4 APIs, 3 models' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('guide')
  const tabBarRef = useRef<HTMLDivElement>(null)
  const tabBarTop = useRef<number>(0)

  useEffect(() => {
    if (tabBarRef.current) {
      // Walk up offsetParent chain to get true document offset
      let el: HTMLElement | null = tabBarRef.current
      let top = 0
      while (el) {
        top += el.offsetTop
        el = el.offsetParent as HTMLElement | null
      }
      tabBarTop.current = top
    }
  }, [])

  return (
    <div className="bg-parchment dark:bg-black min-h-screen">
      <ThemeToggle />
      <Hero />

      {/* ─── TAB BAR ─── */}
      <div id="tab-bar" ref={tabBarRef} className="sticky top-0 z-30 bg-parchment/95 dark:bg-black/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-850">
        <div className="px-8 md:px-16 xl:pl-24 max-w-[1280px]">
          <div className="flex gap-0">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    window.scrollTo({ top: tabBarTop.current, behavior: 'smooth' })
                  }}
                  className={`group flex flex-col gap-0.5 px-6 py-4 border-b-2 transition-all duration-200 text-left ${
                    isActive
                      ? 'border-crimson'
                      : 'border-transparent hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <span className={`text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'text-ink dark:text-white'
                      : 'text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300'
                  }`}>
                    {tab.label}
                  </span>
                  <span className="text-[10px] tracking-wide text-stone-400">
                    {tab.subtitle}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── REPORT CONTENT ─── */}
      {activeTab === 'guide'    && <GuideArticle onNavigate={setActiveTab} />}
      {activeTab === 'vercel'   && <VercelReport />}
      {activeTab === 'docusign' && <DocuSignReport />}
      {activeTab === 'resend'   && <ResendReport />}
      {activeTab === 'full'     && <FullBenchmarkReport />}
      {activeTab === 'agents'   && <HowToHelpAgentsReport />}
    </div>
  )
}
