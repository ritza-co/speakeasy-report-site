import { useState, useRef, useEffect } from 'react'
import Hero from './components/Hero'
import ThemeToggle from './components/ThemeToggle'
import ResendReport from './components/ResendReport'
import VercelReport from './components/VercelReport'
import GuideArticle from './components/GuideArticle'
import HowToHelpAgentsReport from './components/HowToHelpAgentsReport'
import DocuSignReport from './components/DocuSignReport'

type Tab = 'guide' | 'resend' | 'vercel' | 'agents' | 'docusign'

const TABS: { id: Tab; label: string; subtitle: string }[] = [
  { id: 'guide',    label: 'Overview',                    subtitle: 'All findings' },
  { id: 'docusign', label: 'Model capability beats tooling', subtitle: 'DocuSign' },
  { id: 'vercel',   label: 'SDKs can mislead agents',     subtitle: 'Vercel AI SDK' },
  { id: 'resend',   label: 'Docs don\'t stop hallucinations', subtitle: 'Resend' },
  { id: 'agents',   label: 'No docs, no chance',          subtitle: 'Internal microservices' },
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
      <div id="tab-bar" ref={tabBarRef} className="sticky top-0 z-10 bg-parchment/95 dark:bg-black/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-850">
        <div className="px-8 md:px-16 xl:pl-24 max-w-[1280px]">
          <div className="flex gap-0">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    window.scrollTo({ top: tabBarTop.current, behavior: 'instant' })
                    setActiveTab(tab.id)
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
                      : 'text-stone-600 dark:text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300'
                  }`}>
                    {tab.label}
                  </span>
                  <span className="text-[10px] tracking-wide text-stone-600 dark:text-stone-400">
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
      {activeTab === 'agents'   && <HowToHelpAgentsReport />}
    </div>
  )
}
