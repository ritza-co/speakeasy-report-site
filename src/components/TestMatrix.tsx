import type { API, Mode, Agent, PromptType } from '../data/benchmarks'
import { BENCHMARKS, aggregate, MODE_COLORS, API_LABELS, AGENT_LABELS } from '../data/benchmarks'

const APIS: API[]        = ['resend', 'linear', 'docusign']
const MODES: Mode[]      = ['bare', 'sdk', 'sdk+mcp']
const AGENTS: Agent[]    = ['claude-sonnet', 'codex']
const PROMPTS: PromptType[] = ['lazy', 'detailed']

function SuccessCell({ rate }: { rate: number }) {
  const pct = Math.round(rate * 100)
  const bg =
    pct >= 90 ? '#d1fae5' :
    pct >= 75 ? '#fef3c7' :
    pct >= 60 ? '#fed7aa' : '#fee2e2'
  const fg =
    pct >= 90 ? '#065f46' :
    pct >= 75 ? '#92400e' :
    pct >= 60 ? '#9a3412' : '#991b1b'

  return (
    <td
      className="text-center py-2 px-3 text-[12px] font-medium"
      style={{ backgroundColor: bg, color: fg }}
    >
      {pct}%
    </td>
  )
}

// Variable badge
function Badge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="inline-flex items-center gap-1.5 border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 px-3 py-1.5 text-[11px] font-sans">
      <span className="text-stone-400 uppercase tracking-widest text-[9px]">{label}</span>
      <span className="font-medium text-ink dark:text-white">{value}</span>
    </div>
  )
}

export default function TestMatrix() {
  return (
    <div className="w-full">
      {/* Variable summary */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Badge label="APIs" value="Resend · Linear · DocuSign" />
        <Badge label="Modes" value="bare · sdk · sdk+mcp" />
        <Badge label="Agents" value="Claude Sonnet · Codex" />
        <Badge label="Prompts" value="lazy · detailed" />
        <Badge label="Runs each" value={3} />
        <Badge label="Total runs" value={BENCHMARKS.length} />
      </div>

      {/* Heatmap: API × Mode, values = success rate */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4">
          Success rate heatmap — all agents, all prompts
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm font-sans border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 pr-6 text-[10px] font-normal text-stone-400 dark:text-stone-500 uppercase tracking-widest w-28" />
                {MODES.map(m => (
                  <th key={m} className="py-2 px-4 text-center min-w-[90px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: MODE_COLORS[m] }} />
                      <span className="text-[11px] font-normal text-ink dark:text-white">{m}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APIS.map(api => (
                <tr key={api}>
                  <td className="py-1 pr-6 text-[11px] text-stone-400 uppercase tracking-widest">
                    {API_LABELS[api]}
                  </td>
                  {MODES.map(mode => {
                    const runs = BENCHMARKS.filter(r => r.api === api && r.mode === mode)
                    const agg = aggregate(runs)
                    return agg ? <SuccessCell key={mode} rate={agg.successRate} /> : <td key={mode} />
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap: Agent × PromptType */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4">
          Success rate — by agent & prompt type (all modes)
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm font-sans border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 pr-6 text-[10px] font-normal text-stone-400 uppercase tracking-widest w-36" />
                {PROMPTS.map(p => (
                  <th key={p} className="py-2 px-8 text-center min-w-[110px] text-[11px] font-normal text-ink capitalize">
                    {p} prompt
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AGENTS.map(agent => (
                <tr key={agent}>
                  <td className="py-1 pr-6 text-[11px] text-stone-400">
                    {AGENT_LABELS[agent]}
                  </td>
                  {PROMPTS.map(pt => {
                    const runs = BENCHMARKS.filter(r => r.agent === agent && r.promptType === pt)
                    const agg = aggregate(runs)
                    return agg ? <SuccessCell key={pt} rate={agg.successRate} /> : <td key={pt} />
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total count callout */}
      <div className="border-t border-stone-200 dark:border-stone-850 pt-6 flex items-baseline gap-4">
        <span className="font-serif text-5xl text-ink dark:text-white font-bold">108</span>
        <div>
          <p className="text-sm text-ink dark:text-white font-medium">total integration attempts</p>
          <p className="text-[12px] text-stone-400 mt-0.5">
            3 APIs × 2 agents × 3 modes × 2 prompt types × 3 runs
          </p>
        </div>
      </div>
    </div>
  )
}
