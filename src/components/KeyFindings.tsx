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
  const successLift    = Math.round((sdkMcp.successRate - bare.successRate)  * 100)
  const promptGap      = Math.round((detailedMcp.successRate - lazyBare.successRate) * 100)
  const sdkSuccessLift = Math.round((sdk.successRate - bare.successRate)     * 100)

  return [
    {
      prefix: '', value: Math.abs(tokenReduction), suffix: '%', decimals: 0,
      label: tokenReduction < 0 ? 'more tokens with sdk+mcp than bare' : 'fewer tokens with sdk+mcp than bare',
      detail: `Bare averages ${(bare.avgTokens / 1000).toFixed(0)}k tokens vs ${(sdkMcp.avgTokens / 1000).toFixed(0)}k with sdk+mcp. sdk+mcp uses more tokens because the agent actively consults documentation, adding turns and context, but produces better results on niche APIs.`,
      color: '#c0392b',
    },
    {
      prefix: '+', value: successLift, suffix: ' pts', decimals: 0,
      label: 'percentage points higher success rate with sdk+mcp vs bare',
      detail: `${Math.round(bare.successRate * 100)}% success bare vs ${Math.round(sdkMcp.successRate * 100)}% with sdk+mcp. For Metabase, all three configurations produced similar pass rates. The failures came from gaps training data could not fill.`,
      color: '#059669',
    },
    {
      prefix: '+', value: sdkSuccessLift, suffix: ' pts', decimals: 0,
      label: 'percentage points lift from SDK alone over bare (well-known APIs)',
      detail: `For Resend, sdk raised the pass rate to 100% and ran in 41s at $0.127/run, faster and cheaper than bare (65s, $0.188) and sdk+mcp (83s, $0.248). For well-known APIs, sdk is the right choice.`,
      color: '#7c3aed',
    },
    {
      prefix: '', value: 0, suffix: ' pts', decimals: 0,
      label: 'SDK improvement over bare on niche APIs',
      detail: `Static documentation injection made no difference for Metabase. Both bare and sdk achieved 67% pass rate at nearly identical cost and time. The agent absorbed the README and continued making the same errors.`,
      color: '#3b82f6',
    },
    {
      prefix: '+', value: promptGap, suffix: ' pts', decimals: 0,
      label: 'percentage points gap: lazy+bare vs detailed+sdk+mcp',
      detail: `The best-case scenario (detailed prompt + sdk+mcp) vs worst-case (lazy prompt + bare) shows a ${promptGap}-point success gap. MCP raises the ceiling, but the ceiling is bounded by documentation quality.`,
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

      <motion.div
        className="border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 p-6 md:col-span-2"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <p className="text-[15px] text-stone-700 dark:text-stone-300 leading-relaxed">
          Moving from bare to SDK and SDK+MCP shows advantages in accuracy, but also higher
          token consumption. The truth is: APIs need to provide better access to documentation
          for agents, either through SDK comments or MCP tool descriptions. An agent working
          against a well-documented API produces reliable results. An agent working against a
          poorly documented one fails in ways that tooling alone does not fix.
        </p>
      </motion.div>
    </div>
  )
}
