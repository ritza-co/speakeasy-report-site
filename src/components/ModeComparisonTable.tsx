import { motion } from 'framer-motion'
import type { Method } from '../data/benchmarks'
import { BENCHMARKS, aggregate, METHOD_COLORS, MODEL_COLORS, METHODS, MODELS } from '../data/benchmarks'
import { CountUp } from './CountUp'

function pct(v: number) { return `${Math.round(v * 100)}%` }
function ctx(v: number) { return `${(v / 1_000_000).toFixed(2)}M` }
function dur(v: number) {
  const m = Math.floor(v / 60)
  const s = Math.round(v % 60)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function ModeComparisonTable() {
  const base = aggregate(BENCHMARKS.filter(r => r.method === 'Bare'))!

  return (
    <div className="w-full space-y-8">

      {/* Method × Model table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-850">
              <th className="text-left py-3 pr-6 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Method</th>
              <th className="text-center py-3 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Success</th>
              <th className="text-center py-3 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Avg time</th>
              <th className="text-center py-3 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Avg ctx tokens</th>
              <th className="text-center py-3 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">MCP calls</th>
            </tr>
          </thead>
          <tbody>
            {METHODS.map((method, i) => {
              const agg = aggregate(BENCHMARKS.filter(r => r.method === method))!
              const mcp = BENCHMARKS.filter(r => r.method === method).reduce((s, r) => s + r.mcp_calls, 0)
              const ctxDelta = ((agg.avgTotalContext - base.avgTotalContext) / base.avgTotalContext * 100).toFixed(0)
              const isBase = method === 'Bare'
              return (
                <tr key={method} className={i % 2 === 0 ? 'bg-stone-100/50 dark:bg-stone-850/30' : ''}>
                  <td className="py-3.5 pr-6">
                    <span className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-stone-500">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: METHOD_COLORS[method] }} />
                      {method}
                    </span>
                  </td>
                  <td className="py-3.5 text-center font-medium text-ink dark:text-white">
                    {pct(agg.successRate)}
                  </td>
                  <td className="py-3.5 text-center text-stone-500 text-[13px]">
                    {dur(agg.avgElapsed)}
                  </td>
                  <td className="py-3.5 text-center text-stone-500 text-[13px]">
                    {ctx(agg.avgTotalContext)}
                    {!isBase && (
                      <span className={`ml-1.5 text-[11px] ${Number(ctxDelta) > 0 ? 'text-amber-500' : 'text-emerald-600'}`}>
                        {Number(ctxDelta) > 0 ? `+${ctxDelta}%` : `${ctxDelta}%`}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-center text-stone-500 text-[13px]">{mcp}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Broken out by prompt type sub-section */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-4">
          Broken out by model
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-850">
                <th className="text-left py-3 pr-6 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Model</th>
                {METHODS.map(m => (
                  <th key={m} className="text-center py-3 px-4 text-[10px] uppercase tracking-widest font-normal"
                    style={{ color: METHOD_COLORS[m] }}>
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODELS.map((model, i) => (
                <tr key={model} className={i % 2 === 0 ? 'bg-stone-100/60 dark:bg-stone-850/30' : ''}>
                  <td className="py-3 pr-6 text-[11px] uppercase tracking-widest text-stone-600 dark:text-stone-400"
                    style={{ color: MODEL_COLORS[model] }}>
                    {model}
                  </td>
                  {METHODS.map(method => {
                    const d = aggregate(BENCHMARKS.filter(r => r.model === model && r.method === method))
                    return (
                      <td key={method} className="py-3 text-center text-sm">
                        {d ? (
                          <>
                            <div className="text-ink dark:text-white font-medium">{pct(d.successRate)}</div>
                            <div className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                              {dur(d.avgElapsed)} · {ctx(d.avgTotalContext)}
                            </div>
                          </>
                        ) : (
                          <span className="text-stone-600 dark:text-stone-400">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Method summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {METHODS.map((method: Method) => {
          const a = aggregate(BENCHMARKS.filter(r => r.method === method))!
          return (
            <motion.div
              key={method}
              className="text-center py-6 border border-stone-200 dark:border-stone-850 bg-white/40 dark:bg-stone-900/40"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ backgroundColor: METHOD_COLORS[method] }} />
              <div className="font-serif text-3xl font-bold text-ink dark:text-white">
                <CountUp to={Math.round(a.successRate * 100)} suffix="%" duration={900} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 mt-1">{method} success</div>
              <div className="text-[12px] text-stone-500 mt-3">{dur(a.avgElapsed)} avg</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
