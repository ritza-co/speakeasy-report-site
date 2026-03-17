import { motion } from 'framer-motion'
import { BENCHMARKS, aggregate } from '../data/benchmarks'
import { CountUp } from './CountUp'

interface Finding {
  prefix: string
  value: number
  suffix: string
  decimals: number
  label: string
  detail: string
  color: string
}

function buildFindings(): Finding[] {
  const bare    = aggregate(BENCHMARKS.filter(r => r.mode === 'bare'))!
  const sdkMcp  = aggregate(BENCHMARKS.filter(r => r.mode === 'sdk+mcp'))!
  const sdk     = aggregate(BENCHMARKS.filter(r => r.mode === 'sdk'))!

  const lazyBare    = aggregate(BENCHMARKS.filter(r => r.promptType === 'lazy'     && r.mode === 'bare'))!
  const detailedMcp = aggregate(BENCHMARKS.filter(r => r.promptType === 'detailed' && r.mode === 'sdk+mcp'))!

  const tokenReduction = Math.round((1 - sdkMcp.avgTokens / bare.avgTokens) * 100)
  const turnReduction  = Math.round((1 - sdkMcp.avgTurns  / bare.avgTurns)  * 100)
  const successLift    = Math.round((sdkMcp.successRate - bare.successRate)  * 100)
  const promptGap      = Math.round((detailedMcp.successRate - lazyBare.successRate) * 100)
  const sdkSuccessLift = Math.round((sdk.successRate - bare.successRate)     * 100)

  return [
    {
      prefix: '', value: tokenReduction, suffix: '%', decimals: 0,
      label: 'fewer tokens with SDK + MCP',
      detail: `From an average of ${(bare.avgTokens / 1000).toFixed(0)}k tokens bare to ${(sdkMcp.avgTokens / 1000).toFixed(0)}k with SDK + MCP. Better tooling means the agent stops hallucinating paths and goes straight to the answer.`,
      color: '#c0392b',
    },
    {
      prefix: '', value: turnReduction, suffix: '%', decimals: 0,
      label: 'fewer turns to complete the task',
      detail: `Bare agents average ${bare.avgTurns.toFixed(1)} turns. SDK + MCP agents average ${sdkMcp.avgTurns.toFixed(1)}. Fewer wrong turns = fewer corrections = less context bloat.`,
      color: '#3b82f6',
    },
    {
      prefix: '+', value: successLift, suffix: 'pp', decimals: 0,
      label: 'higher success rate with SDK + MCP',
      detail: `${Math.round(bare.successRate * 100)}% success bare vs ${Math.round(sdkMcp.successRate * 100)}% with SDK + MCP. For complex APIs like DocuSign, the gap widens further.`,
      color: '#059669',
    },
    {
      prefix: '+', value: sdkSuccessLift, suffix: 'pp', decimals: 0,
      label: 'just from adding an SDK (no MCP)',
      detail: `Even without an MCP server, having a typed SDK raises success rate by ${sdkSuccessLift} percentage points over bare. The biggest single improvement comes from structured types alone.`,
      color: '#7c3aed',
    },
    {
      prefix: '+', value: promptGap, suffix: 'pp', decimals: 0,
      label: 'gap between lazy + bare vs detailed + MCP',
      detail: `The best-case scenario (detailed prompt + SDK + MCP) vs worst-case (lazy prompt + bare) shows a ${promptGap}pp success gap. Good tooling partially compensates for lazy prompts — but not fully.`,
      color: '#d97706',
    },
  ]
}

export default function KeyFindings() {
  const findings = buildFindings()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {findings.map((f, i) => (
        <motion.div
          key={i}
          className="border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 p-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.09, duration: 0.55 }}
          whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-end gap-0.5 mb-3">
            <span className="font-serif text-[2.6rem] leading-none font-bold" style={{ color: f.color }}>
              <CountUp
                to={f.value}
                decimals={f.decimals}
                prefix={f.prefix}
                suffix={f.suffix}
                duration={1200}
              />
            </span>
          </div>
          <p className="text-sm font-medium text-ink dark:text-white mb-2">{f.label}</p>
          <p className="text-[12px] text-stone-500 leading-relaxed">{f.detail}</p>
        </motion.div>
      ))}

      {/* Takeaway callout */}
      <motion.div
        className="border-2 border-crimson bg-crimson/5 dark:bg-crimson/10 p-6 md:col-span-2"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p className="text-[10px] uppercase tracking-widest text-crimson mb-3">The takeaway</p>
        <p className="font-serif text-xl text-ink dark:text-white leading-relaxed">
          The question isn't whether agents need help — they clearly do. The question is{' '}
          <em>how much</em> help, and from where. A well-structured SDK gets you 70% of the way.
          An MCP server covering documentation gets you the rest. The combination makes agents
          more consistent, faster, and dramatically cheaper to run.
        </p>
      </motion.div>
    </div>
  )
}
