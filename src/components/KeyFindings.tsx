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
  const sdk    = aggregate(BENCHMARKS.filter(r => r.method === 'SDK'))!

  const ctxIncrease    = Math.round(((sdkMcp.avgTotalContext - bare.avgTotalContext) / bare.avgTotalContext) * 100 * 10) / 10
  const successLift    = Math.round((sdkMcp.successRate - bare.successRate) * 100)
  const sdkWellKnown   = Math.round(
    (aggregate(BENCHMARKS.filter(r => r.method === 'SDK'    && (r.tool === 'Linear' || r.tool === 'Resend')))!.successRate -
     aggregate(BENCHMARKS.filter(r => r.method === 'Bare'   && (r.tool === 'Linear' || r.tool === 'Resend')))!.successRate) * 100
  )
  const nicheBarePct   = Math.round(aggregate(BENCHMARKS.filter(r => r.method === 'Bare' && (r.tool === 'Metabase' || r.tool === 'Pandadoc')))!.successRate * 100)
  const nicheSdkPct    = Math.round(aggregate(BENCHMARKS.filter(r => r.method === 'SDK'  && (r.tool === 'Metabase' || r.tool === 'Pandadoc')))!.successRate * 100)
  const sdkNicheDelta  = nicheSdkPct - nicheBarePct

  const gptTotal    = BENCHMARKS.filter(r => r.model === 'GPT-5.4').reduce((s, r) => s + r.mcp_calls, 0)
  const claudeTotal = BENCHMARKS.filter(r => r.model !== 'GPT-5.4').reduce((s, r) => s + r.mcp_calls, 0)
  const mcpRatio    = Math.round(gptTotal / claudeTotal * 10) / 10

  void sdk

  return [
    {
      prefix: '+', value: ctxIncrease, suffix: '%', decimals: 1,
      label: 'more total context tokens with sdk+mcp than bare',
      detail: `Bare sessions averaged ${Math.round(bare.avgTotalContext).toLocaleString()} tokens. SDK+MCP sessions averaged ${Math.round(sdkMcp.avgTotalContext).toLocaleString()}. The agent is actively consulting documentation and validating its work, which adds turns and context. The cost is real.`,
      color: '#c0392b',
    },
    {
      prefix: '+', value: successLift, suffix: ' pts', decimals: 0,
      label: 'percentage point improvement in success rate from bare to sdk+mcp',
      detail: `Bare and SDK both sat at ${Math.round(bare.successRate * 100)}%. SDK+MCP reached ${Math.round(sdkMcp.successRate * 100)}%. It is the only configuration that never failed.`,
      color: '#059669',
    },
    {
      prefix: '', value: Math.abs(sdkWellKnown), suffix: ' pts', decimals: 0,
      label: 'SDK improvement over bare on well-known APIs',
      detail: 'Both Linear and Resend hit 100% with bare API calls alone. Adding the SDK changed nothing on pass rate. For APIs the agent already knows well, the SDK is overhead, not an upgrade.',
      color: '#3b82f6',
    },
    {
      prefix: '', value: Math.abs(sdkNicheDelta), suffix: ' pts', decimals: 0,
      label: 'SDK improvement over bare on niche APIs',
      detail: `Metabase and PandaDoc both produced an ${nicheBarePct}% success rate with bare and with SDK. Static documentation injection made no difference. The agent absorbed the SDK and continued making the same errors.`,
      color: '#7c3aed',
    },
    {
      prefix: '', value: mcpRatio, suffix: 'x', decimals: 1,
      label: 'more MCP calls from GPT-5.4 than both Claude models combined',
      detail: `GPT-5.4 made ${gptTotal} calls across 12 sessions. Opus and Sonnet made ${claudeTotal} combined. The gap holds across every API and every tooling mode. GPT-5.4 checks its work. Claude trusts its training data.`,
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
    </div>
  )
}
