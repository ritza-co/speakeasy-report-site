import { BENCHMARKS, aggregate, METHOD_COLORS, TOOL_LABELS, TOOLS, MODELS, METHODS } from '../data/benchmarks'

function SuccessCell({ rate }: { rate: number }) {
  const pct = Math.round(rate * 100)
  const bg =
    pct >= 100 ? '#d1fae5' :
    pct >= 80  ? '#fef3c7' :
    pct >= 60  ? '#fed7aa' : '#fee2e2'
  const fg =
    pct >= 100 ? '#065f46' :
    pct >= 80  ? '#92400e' :
    pct >= 60  ? '#9a3412' : '#991b1b'
  return (
    <td className="text-center py-2 px-3 text-[12px] font-medium" style={{ backgroundColor: bg, color: fg }}>
      {pct}%
    </td>
  )
}

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
      <div className="flex flex-wrap gap-2 mb-10">
        <Badge label="APIs"       value="Linear · Resend · Metabase · PandaDoc" />
        <Badge label="Methods"    value="Bare · SDK · SDK+MCP" />
        <Badge label="Models"     value="Opus · Sonnet · GPT-5.4" />
        <Badge label="Sessions"   value={108} />
      </div>

      {/* Heatmap: Tool × Method */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4">
          Success rate — by API and method
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm font-sans border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 pr-6 text-[10px] font-normal text-stone-400 uppercase tracking-widest w-28" />
                {METHODS.map(m => (
                  <th key={m} className="py-2 px-4 text-center min-w-[90px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: METHOD_COLORS[m] }} />
                      <span className="text-[11px] font-normal text-ink dark:text-white">{m}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOOLS.map(tool => (
                <tr key={tool}>
                  <td className="py-1 pr-6 text-[11px] text-stone-400 uppercase tracking-widest">
                    {TOOL_LABELS[tool]}
                  </td>
                  {METHODS.map(method => {
                    const agg = aggregate(BENCHMARKS.filter(r => r.tool === tool && r.method === method))
                    return agg ? <SuccessCell key={method} rate={agg.successRate} /> : <td key={method} />
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap: Model × Method */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-4">
          Success rate — by model and method
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm font-sans border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 pr-6 text-[10px] font-normal text-stone-400 uppercase tracking-widest w-36" />
                {METHODS.map(m => (
                  <th key={m} className="py-2 px-8 text-center min-w-[110px] text-[11px] font-normal text-ink">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODELS.map(model => (
                <tr key={model}>
                  <td className="py-1 pr-6 text-[11px] text-stone-400">{model}</td>
                  {METHODS.map(method => {
                    const agg = aggregate(BENCHMARKS.filter(r => r.model === model && r.method === method))
                    return agg ? <SuccessCell key={method} rate={agg.successRate} /> : <td key={method} />
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-stone-200 dark:border-stone-850 pt-6 flex items-baseline gap-4">
        <span className="font-serif text-5xl text-ink dark:text-white font-bold">108</span>
        <div>
          <p className="text-sm text-ink dark:text-white font-medium">total sessions</p>
        </div>
      </div>
    </div>
  )
}
