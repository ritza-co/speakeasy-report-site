import { useState } from 'react'
import Hero from './components/Hero'
import ThemeToggle from './components/ThemeToggle'
import ResendReport from './components/ResendReport'
import VercelReport from './components/VercelReport'
import GuideArticle from './components/GuideArticle'

type Tab = 'guide' | 'resend' | 'vercel'

const TABS: { id: Tab; label: string; subtitle: string }[] = [
  { id: 'guide',  label: 'Introduction',   subtitle: 'AI agents and context' },
  { id: 'resend', label: 'Resend',         subtitle: 'Well-documented API' },
  { id: 'vercel', label: 'Vercel AI SDK',  subtitle: 'SDK migration benchmark' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('guide')

  return (
    <div className="bg-parchment dark:bg-black min-h-screen">
      <ThemeToggle />
      <Hero />

      {/* ─── TAB BAR ─── */}
      <div className="sticky top-0 z-30 bg-parchment/95 dark:bg-black/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-850">
        <div className="px-8 md:px-16 xl:pl-24 max-w-[1280px]">
          <div className="flex gap-0">
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    window.scrollTo({ top: 0 })
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
      {activeTab === 'guide'  && <GuideArticle onNavigate={setActiveTab} />}
      {activeTab === 'resend' && <ResendReport />}
      {activeTab === 'vercel' && <VercelReport />}
    </div>
  )
}
