import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { Agent, Mode } from '../data/benchmarks'
import { BENCHMARKS, aggregate, MODE_COLORS, AGENT_LABELS } from '../data/benchmarks'
import { CountUp } from './CountUp'

const AGENTS: Agent[] = ['claude-sonnet', 'codex']
const MODES:  Mode[]  = ['bare', 'sdk', 'sdk+mcp']

const AGENT_COLORS: Record<Agent, string> = {
  'claude-sonnet': '#c0392b',
  codex:           '#3b82f6',
}

function StatBlock({ label, numericValue, decimals = 0, suffix = '' }: {
  label: string; numericValue: number; decimals?: number; suffix?: string
}) {
  return (
    <div className="text-center">
      <div className="text-2xl font-serif text-ink dark:text-white font-semibold">
        <CountUp to={numericValue} decimals={decimals} suffix={suffix} duration={1000} />
      </div>
      <div className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">{label}</div>
    </div>
  )
}

function CompareBar({ labelA, valA, labelB, valB, max, colorA, colorB, inView }: {
  labelA: string; valA: number
  labelB: string; valB: number
  max: number; colorA: string; colorB: string; inView: boolean
}) {
  return (
    <div className="flex items-center gap-3 text-[11px]">
      <span className="w-20 text-right text-stone-500">{labelA}: {valA.toFixed(1)}</span>
      <div className="flex-1 flex gap-0.5 h-3 items-center">
        <div className="flex-1 flex justify-end">
          <div
            className="h-3 rounded-l"
            style={{
              width: inView ? `${(valA / max) * 100}%` : '0%',
              backgroundColor: colorA,
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
        <div className="w-[2px] h-4 bg-stone-300 flex-shrink-0" />
        <div className="flex-1">
          <div
            className="h-3 rounded-r"
            style={{
              width: inView ? `${(valB / max) * 100}%` : '0%',
              backgroundColor: colorB,
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.05s',
            }}
          />
        </div>
      </div>
      <span className="w-20 text-stone-500">{labelB}: {valB.toFixed(1)}</span>
    </div>
  )
}

export default function AgentComparison() {
  const [activeMode, setActiveMode] = useState<Mode | 'all'>('all')

  const barsRef = useRef<HTMLDivElement>(null)
  const barsInView = useInView(barsRef, { once: true, margin: '-60px' })

  const filter = (agent: Agent) =>
    BENCHMARKS.filter(r => r.agent === agent && (activeMode === 'all' || r.mode === activeMode))

  const statsA = aggregate(filter('claude-sonnet'))!
  const statsB = aggregate(filter('codex'))!

  const winner = (lower: boolean, a: number, b: number) => {
    if (lower) return a < b ? 'claude-sonnet' : 'codex'
    return a > b ? 'claude-sonnet' : 'codex'
  }

  return (
    <div className="w-full">
      {/* Mode filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <motion.button
          onClick={() => setActiveMode('all')}
          className="text-[11px] px-3 py-1 rounded-full border"
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

      {/* Head-to-head cards */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        {AGENTS.map((agent, i) => {
          const stats = agent === 'claude-sonnet' ? statsA : statsB
          const color = AGENT_COLORS[agent]
          return (
            <motion.div
              key={agent}
              className="border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 p-6"
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.07)' }}
            >
              <div className="flex items-center gap-2.5 mb-6">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <h3 className="font-serif text-xl text-ink dark:text-white">{AGENT_LABELS[agent]}</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <StatBlock label="Success rate" numericValue={stats.successRate * 100} suffix="%" />
                <StatBlock label="Avg turns"    numericValue={stats.avgTurns}           decimals={1} />
                <StatBlock label="Avg tokens"   numericValue={stats.avgTokens / 1000}   decimals={1} suffix="k" />
                <StatBlock label="Avg time"     numericValue={stats.avgTime}            suffix="s" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Direct comparison bars */}
      <div ref={barsRef} className="space-y-4">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4">
          Head-to-head comparison
        </p>

        {[
          { metric: 'Success rate (%)', valA: statsA.successRate * 100, valB: statsB.successRate * 100, max: 100,  lower: false },
          { metric: 'Avg turns',        valA: statsA.avgTurns,           valB: statsB.avgTurns,           max: 20,   lower: true  },
          { metric: 'Avg tokens (k)',   valA: statsA.avgTokens / 1000,   valB: statsB.avgTokens / 1000,   max: 50,   lower: true  },
          { metric: 'Avg time (s)',     valA: statsA.avgTime,            valB: statsB.avgTime,            max: 400,  lower: true  },
        ].map(({ metric, valA, valB, max, lower }) => {
          const w = winner(lower, valA, valB)
          return (
            <div key={metric}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-stone-500 w-32">{metric}</span>
                <span
                  className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: AGENT_COLORS[w] + '22',
                    color: AGENT_COLORS[w],
                  }}
                >
                  {AGENT_LABELS[w]} leads
                </span>
              </div>
              <CompareBar
                labelA="Claude" valA={valA}
                labelB="Codex"  valB={valB}
                max={max}
                colorA={AGENT_COLORS['claude-sonnet']}
                colorB={AGENT_COLORS['codex']}
                inView={barsInView}
              />
            </div>
          )
        })}
      </div>

      {/* Mode-by-mode table */}
      <div className="mt-10 overflow-x-auto">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4">
          Success rate by mode
        </p>
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-850">
              <th className="text-left py-2 text-[10px] uppercase tracking-widest text-stone-400 font-normal w-28">Mode</th>
              {AGENTS.map(a => (
                <th key={a} className="text-center py-2 text-[10px] uppercase tracking-widest font-normal"
                  style={{ color: AGENT_COLORS[a] }}>
                  {AGENT_LABELS[a]}
                </th>
              ))}
              <th className="text-center py-2 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Δ</th>
            </tr>
          </thead>
          <tbody>
            {MODES.map((mode, i) => {
              const rA = aggregate(BENCHMARKS.filter(r => r.agent === 'claude-sonnet' && r.mode === mode))
              const rB = aggregate(BENCHMARKS.filter(r => r.agent === 'codex'         && r.mode === mode))
              if (!rA || !rB) return null
              const diff = (rA.successRate - rB.successRate) * 100
              return (
                <motion.tr
                  key={mode}
                  className={i % 2 === 0 ? 'bg-stone-100/50' : ''}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <td className="py-3 text-[11px] uppercase tracking-widest text-stone-400">{mode}</td>
                  <td className="py-3 text-center font-medium text-ink dark:text-white">{Math.round(rA.successRate * 100)}%</td>
                  <td className="py-3 text-center font-medium text-ink dark:text-white">{Math.round(rB.successRate * 100)}%</td>
                  <td className="py-3 text-center text-[11px]">
                    <span className={diff > 0 ? 'text-crimson' : diff < 0 ? 'text-blue-500' : 'text-stone-400'}>
                      {diff > 0 ? `+${diff.toFixed(0)}% Claude` : diff < 0 ? `+${Math.abs(diff).toFixed(0)}% Codex` : '—'}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
