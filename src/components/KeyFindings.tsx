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
  const bare   = aggregate(BENCHMARKS.filter(r => r.method === 'Bare'))!
  const sdkMcp = aggregate(BENCHMARKS.filter(r => r.method === 'SDK+MCP'))!

  const ctxIncrease = Math.round(((sdkMcp.avgTotalContext - bare.avgTotalContext) / bare.avgTotalContext) * 100)
  const successLift = Math.round((sdkMcp.successRate - bare.successRate) * 100)

  const gptTotal    = BENCHMARKS.filter(r => r.model === 'GPT-5.4').reduce((s, r) => s + r.mcp_calls, 0)
  const claudeTotal = BENCHMARKS.filter(r => r.model !== 'GPT-5.4').reduce((s, r) => s + r.mcp_calls, 0)
  const mcpRatio    = Math.round(gptTotal / claudeTotal * 10) / 10

  return [
    {
      prefix: '+', value: ctxIncrease, suffix: '%', decimals: 0,
      label: 'more total context tokens with SDK+MCP than bare',
      detail: `Bare sessions averaged ${(bare.avgTotalContext / 1_000_000).toFixed(2)}M tokens. SDK+MCP sessions averaged ${(sdkMcp.avgTotalContext / 1_000_000).toFixed(2)}M. The agent actively validates its own work through live tool calls, adding context each turn. The cost is real — but it's also the only configuration that never failed.`,
      color: '#c0392b',
    },
    {
      prefix: '+', value: successLift, suffix: ' pts', decimals: 0,
      label: 'percentage points higher success rate with SDK+MCP vs bare',
      detail: `Bare: ${Math.round(bare.successRate * 100)}% success. SDK+MCP: ${Math.round(sdkMcp.successRate * 100)}%. SDK+MCP is the only configuration with a perfect pass rate across all four APIs. Both failures were PandaDoc sessions without SDK+MCP tooling.`,
      color: '#059669',
    },
    {
      prefix: '', value: 0, suffix: ' pts', decimals: 0,
      label: 'SDK improvement over bare on well-known APIs (Linear, Resend)',
      detail: 'Both Linear and Resend reached 100% success with bare API calls alone. Adding the SDK changed nothing on pass rate for APIs the agent already knows well. SDK is overhead, not an upgrade, when training data coverage is strong.',
      color: '#3b82f6',
    },
    {
      prefix: '', value: 0, suffix: ' pts', decimals: 0,
      label: 'SDK improvement over bare on niche APIs (Metabase, PandaDoc)',
      detail: 'Static SDK injection made no difference for Metabase or PandaDoc at the aggregate level. The agent absorbed the SDK and continued making the same errors. Live environment access — not static documentation — is what moves the needle.',
      color: '#7c3aed',
    },
    {
      prefix: '', value: mcpRatio, suffix: '×', decimals: 1,
      label: 'more MCP calls from GPT-5.4 than both Claude models combined',
      detail: `GPT-5.4 made ${gptTotal} MCP calls across 12 sessions. Opus and Sonnet made ${claudeTotal} combined. The gap holds across every API and every tooling mode. GPT-5.4 reaches for external verification unprompted. Claude trusts its training data.`,
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
          MCP works in two distinct modes: documentation lookup and live work validation.
          The second mode is where the real value sits. The most effective sessions used
          MCP to confirm that integrations <em>actually worked</em> — checking delivery
          logs, querying created issues, inspecting live dashboard configuration — rather
          than looking up endpoint signatures. An agent that can verify its own output
          against the real state of the system is doing something fundamentally different
          from one that just writes code.
        </p>
      </motion.div>
    </div>
  )
}
