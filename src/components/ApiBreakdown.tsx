import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Method } from '../data/benchmarks'
import { BENCHMARKS, aggregate, METHOD_COLORS, TOOL_LABELS, TOOL_DESCRIPTIONS, TOOL_DIFFICULTY, TOOLS, METHODS } from '../data/benchmarks'

function Stars({ n }: { n: number }) {
  return (
    <span className="text-xs">
      {[1, 2, 3].map(i => (
        <span key={i} className={i <= n ? 'text-crimson' : 'text-stone-300'}>★</span>
      ))}
    </span>
  )
}

function Bar({ value, max, color, inView }: { value: number; max: number; color: string; inView: boolean }) {
  return (
    <div className="flex-1 h-1.5 bg-stone-200 dark:bg-stone-850 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: inView ? `${Math.min((value / max) * 100, 100)}%` : '0%',
          backgroundColor: color,
          transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  )
}

export default function ApiBreakdown() {
  const [activeMethod, setActiveMethod] = useState<Method | 'all'>('all')

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-8 flex-wrap">
        <motion.button
          onClick={() => setActiveMethod('all')}
          className="text-[11px] px-3 py-1 rounded-full border transition-colors"
          animate={
            activeMethod === 'all'
              ? { backgroundColor: '#1c1917', borderColor: '#1c1917', color: '#fff' }
              : { backgroundColor: 'transparent', borderColor: 'var(--pill-border)', color: 'var(--pill-color)' }
          }
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          All methods
        </motion.button>
        {METHODS.map(m => (
          <motion.button
            key={m}
            onClick={() => setActiveMethod(m)}
            className="text-[11px] px-3 py-1 rounded-full border"
            animate={
              activeMethod === m
                ? { backgroundColor: METHOD_COLORS[m], borderColor: METHOD_COLORS[m], color: '#fff' }
                : { backgroundColor: 'transparent', borderColor: 'var(--pill-border)', color: 'var(--pill-color)' }
            }
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {m}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {TOOLS.map((tool, cardIndex) => {
          const runs = BENCHMARKS.filter(r =>
            r.tool === tool && (activeMethod === 'all' || r.method === activeMethod)
          )
          const agg = aggregate(runs)!
          const cardRef = useRef<HTMLDivElement>(null)
          const inView  = useInView(cardRef, { once: true, margin: '-40px' })

          const maxCtx     = 5_000_000
          const maxElapsed = 1800
          const totalMcp   = runs.reduce((s, r) => s + r.mcp_calls, 0)

          return (
            <motion.div
              key={tool}
              ref={cardRef}
              className="border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 p-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: cardIndex * 0.08 }}
              whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.07)' }}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-serif text-xl text-ink dark:text-white">{TOOL_LABELS[tool]}</h3>
                <Stars n={TOOL_DIFFICULTY[tool]} />
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 mb-5 leading-relaxed">
                {TOOL_DESCRIPTIONS[tool]}
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-stone-600 dark:text-stone-400 uppercase tracking-wider">Success rate</span>
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
                    <span className="text-stone-600 dark:text-stone-400 uppercase tracking-wider">Avg total ctx</span>
                    <span className="font-medium text-ink dark:text-white">
                      {(agg.avgTotalContext / 1_000_000).toFixed(2)}M
                    </span>
                  </div>
                  <Bar value={agg.avgTotalContext} max={maxCtx} color="#3b82f6" inView={inView} />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-stone-600 dark:text-stone-400 uppercase tracking-wider">Avg duration</span>
                    <span className="font-medium text-ink dark:text-white">
                      {Math.floor(agg.avgElapsed / 60)}m {Math.round(agg.avgElapsed % 60)}s
                    </span>
                  </div>
                  <Bar value={agg.avgElapsed} max={maxElapsed} color="#c0392b" inView={inView} />
                </div>

                {totalMcp > 0 && (
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-600 dark:text-stone-400 uppercase tracking-wider">MCP calls</span>
                    <span className="font-medium text-ink dark:text-white">{totalMcp} total</span>
                  </div>
                )}
              </div>

              {activeMethod === 'all' && (
                <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-850">
                  <p className="text-[9px] uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-2">By method</p>
                  <div className="space-y-1">
                    {METHODS.map(m => {
                      const mr = aggregate(BENCHMARKS.filter(r => r.tool === tool && r.method === m))
                      if (!mr) return null
                      return (
                        <div key={m} className="flex items-center gap-2 text-[11px]">
                          <span className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: METHOD_COLORS[m] }} />
                          <span className="w-16 text-stone-500">{m}</span>
                          <div className="flex-1 h-1 bg-stone-200 dark:bg-stone-850 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: inView ? `${mr.successRate * 100}%` : '0%',
                                backgroundColor: METHOD_COLORS[m],
                                transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                              }}
                            />
                          </div>
                          <span className="text-stone-500 w-8 text-right">{Math.round(mr.successRate * 100)}%</span>
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
