import { motion } from 'framer-motion'
import type { Model } from '../data/benchmarks'
import { BENCHMARKS, aggregate, METHOD_COLORS, MODEL_COLORS, MODELS, METHODS } from '../data/benchmarks'
import { CountUp } from './CountUp'

function StatCard({ label, value, suffix = '', color }: {
  label: string; value: number; suffix?: string; color: string
}) {
  return (
    <div className="text-center">
      <div className="font-serif text-2xl font-bold" style={{ color }}>
        <CountUp to={value} suffix={suffix} duration={900} />
      </div>
      <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">{label}</p>
    </div>
  )
}

export default function AgentComparison() {
  return (
    <div className="w-full space-y-10">

      {/* MCP calls summary */}
      <div className="border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 p-6">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-6">
          Total MCP calls across all sessions
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-850">
                <th className="text-left py-2 pr-6 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Method</th>
                {MODELS.map(m => (
                  <th key={m} className="text-center py-2 px-6 text-[10px] uppercase tracking-widest font-normal"
                    style={{ color: MODEL_COLORS[m] }}>
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METHODS.map((method, i) => (
                <tr key={method} className={i % 2 === 0 ? 'bg-stone-50 dark:bg-stone-850/30' : ''}>
                  <td className="py-3 pr-6">
                    <span className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-stone-500">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: METHOD_COLORS[method] }} />
                      {method}
                    </span>
                  </td>
                  {MODELS.map(model => {
                    const runs = BENCHMARKS.filter(r => r.model === model && r.method === method)
                    const total = runs.reduce((s, r) => s + r.mcp_calls, 0)
                    const avg   = runs.length ? (total / runs.length).toFixed(1) : '—'
                    return (
                      <td key={model} className="py-3 text-center text-sm">
                        <span className="font-medium text-ink dark:text-white">{total}</span>
                        <span className="text-stone-400 text-[11px] ml-1">({avg} avg)</span>
                      </td>
                    )
                  })}
                </tr>
              ))}
              <tr className="border-t border-stone-200 dark:border-stone-850">
                <td className="py-3 pr-6 text-[11px] uppercase tracking-widest text-stone-400">Total</td>
                {MODELS.map(model => {
                  const total = BENCHMARKS.filter(r => r.model === model).reduce((s, r) => s + r.mcp_calls, 0)
                  return (
                    <td key={model} className="py-3 text-center font-bold text-ink dark:text-white">{total}</td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-method success + time table */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4">
          Success rate by model and method
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-850">
                <th className="text-left py-2 pr-6 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Method</th>
                {MODELS.map(m => (
                  <th key={m} className="text-center py-2 px-4 text-[10px] uppercase tracking-widest font-normal"
                    style={{ color: MODEL_COLORS[m] }}>
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METHODS.map((method, i) => (
                <motion.tr
                  key={method}
                  className={i % 2 === 0 ? 'bg-stone-100/50' : ''}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <td className="py-3 text-[11px] uppercase tracking-widest text-stone-400">{method}</td>
                  {MODELS.map(model => {
                    const agg = aggregate(BENCHMARKS.filter(r => r.model === model && r.method === method))
                    if (!agg) return <td key={model} className="py-3 text-center text-stone-400">—</td>
                    const mins = Math.floor(agg.avgElapsed / 60)
                    const secs = Math.round(agg.avgElapsed % 60)
                    return (
                      <td key={model} className="py-3 text-center text-sm">
                        <div className="font-medium text-ink dark:text-white">
                          {Math.round(agg.successRate * 100)}%
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {mins}m {secs}s avg
                        </div>
                      </td>
                    )
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {MODELS.map((model: Model) => {
          const agg = aggregate(BENCHMARKS.filter(r => r.model === model))!
          const totalMcp = BENCHMARKS.filter(r => r.model === model).reduce((s, r) => s + r.mcp_calls, 0)
          const mins = Math.floor(agg.avgElapsed / 60)
          const secs = Math.round(agg.avgElapsed % 60)
          return (
            <div key={model}
              className="text-center py-6 border border-stone-200 dark:border-stone-850 bg-white/40 dark:bg-stone-900/40">
              <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ backgroundColor: MODEL_COLORS[model] }} />
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4">{model}</p>
              <div className="space-y-3">
                <StatCard label="success" value={Math.round(agg.successRate * 100)} suffix="%" color={MODEL_COLORS[model]} />
                <div className="text-center">
                  <div className="font-serif text-xl font-bold text-ink dark:text-white">{mins}m {secs}s</div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">avg time</p>
                </div>
                <StatCard label="mcp calls total" value={totalMcp} color={MODEL_COLORS[model]} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
