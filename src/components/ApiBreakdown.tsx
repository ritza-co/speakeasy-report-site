import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { API, Mode } from '../data/benchmarks'
import { BENCHMARKS, aggregate, MODE_COLORS, API_LABELS } from '../data/benchmarks'

const APIS: API[]   = ['resend', 'linear', 'metabase']
const MODES: Mode[] = ['bare', 'sdk', 'sdk+mcp']

const API_DESCRIPTIONS: Record<API, string> = {
  resend:   'Modern transactional email API. Clean docs, official Node.js SDK, widely seen in training data — the best-case baseline.',
  linear:   'Project management GraphQL API. Comparable documentation quality to Resend, but a meaningful step up in schema complexity.',
  metabase: 'Self-hosted analytics platform with a REST API sparsely covered in training data. Session-based auth, non-obvious endpoints, and several patterns agents get wrong when working from training data alone.',
}

const API_DIFFICULTY: Record<API, number> = { resend: 1, linear: 2, metabase: 3 }

function Stars({ n }: { n: number }) {
  return (
    <span className="text-xs">
      {[1, 2, 3].map(i => (
        <span key={i} className={i <= n ? 'text-crimson' : 'text-stone-300'}>★</span>
      ))}
    </span>
  )
}

function Bar({ value, max, color, inView }: {
  value: number; max: number; color: string; inView: boolean
}) {
  return (
    <div className="flex-1 h-1.5 bg-stone-200 dark:bg-stone-850 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: inView ? `${(value / max) * 100}%` : '0%',
          backgroundColor: color,
          transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  )
}

export default function ApiBreakdown() {
  const [activeMode, setActiveMode] = useState<Mode | 'all'>('all')

  return (
    <div className="w-full">
      {/* Mode filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <motion.button
          onClick={() => setActiveMode('all')}
          className="text-[11px] px-3 py-1 rounded-full border transition-colors"
          animate={
            activeMode === 'all'
              ? { backgroundColor: '#1c1917', borderColor: '#1c1917', color: '#fff' }
              : { backgroundColor: 'transparent', borderColor: 'var(--pill-border)', color: 'var(--pill-color)' }
          }
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          All modes
        </motion.button>
        {MODES.map(m => (
          <motion.button
            key={m}
            onClick={() => setActiveMode(m)}
            className="text-[11px] px-3 py-1 rounded-full border"
            animate={
              activeMode === m
                ? { backgroundColor: MODE_COLORS[m], borderColor: MODE_COLORS[m], color: '#fff' }
                : { backgroundColor: 'transparent', borderColor: 'var(--pill-border)', color: 'var(--pill-color)' }
            }
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {m}
          </motion.button>
        ))}
      </div>

      {/* API cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {APIS.map((api, cardIndex) => {
          const runs = BENCHMARKS.filter(r =>
            r.api === api && (activeMode === 'all' || r.mode === activeMode)
          )
          const agg = aggregate(runs)!

          const cardRef = useRef<HTMLDivElement>(null)
          const inView  = useInView(cardRef, { once: true, margin: '-40px' })

          const maxTokens = 55000
          const maxTurns  = 20
          const maxTime   = 380

          return (
            <motion.div
              key={api}
              ref={cardRef}
              className="border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 p-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: cardIndex * 0.1 }}
              whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.07)' }}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-serif text-xl text-ink dark:text-white">{API_LABELS[api]}</h3>
                <Stars n={API_DIFFICULTY[api]} />
              </div>
              <p className="text-[11px] text-stone-400 mb-5 leading-relaxed">
                {API_DESCRIPTIONS[api]}
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-stone-400 uppercase tracking-wider">Success rate</span>
                    <span className="font-medium text-ink dark:text-white">{Math.round(agg.successRate * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-850 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: inView ? `${agg.successRate * 100}%` : '0%',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-stone-400 uppercase tracking-wider">Avg tokens</span>
                    <span className="font-medium text-ink dark:text-white">{(agg.avgTokens / 1000).toFixed(1)}k</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bar value={agg.avgTokens} max={maxTokens} color="#3b82f6" inView={inView} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-stone-400 uppercase tracking-wider">Avg turns</span>
                    <span className="font-medium text-ink dark:text-white">{agg.avgTurns.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bar value={agg.avgTurns} max={maxTurns} color="#c0392b" inView={inView} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-stone-400 uppercase tracking-wider">Avg time</span>
                    <span className="font-medium text-ink dark:text-white">{Math.round(agg.avgTime)}s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bar value={agg.avgTime} max={maxTime} color="#94a3b8" inView={inView} />
                  </div>
                </div>
              </div>

              {/* Mode breakdown */}
              {activeMode === 'all' && (
                <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-850">
                  <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">By mode</p>
                  <div className="space-y-1">
                    {MODES.map(m => {
                      const mr = aggregate(BENCHMARKS.filter(r => r.api === api && r.mode === m))
                      if (!mr) return null
                      return (
                        <div key={m} className="flex items-center gap-2 text-[11px]">
                          <span className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: MODE_COLORS[m] }} />
                          <span className="w-16 text-stone-500">{m}</span>
                          <div className="flex-1 h-1 bg-stone-200 dark:bg-stone-850 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: inView ? `${mr.successRate * 100}%` : '0%',
                                backgroundColor: MODE_COLORS[m],
                                transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                              }}
                            />
                          </div>
                          <span className="text-stone-500 w-8 text-right">
                            {Math.round(mr.successRate * 100)}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
