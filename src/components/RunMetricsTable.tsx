interface RunMetric {
  id: string
  label: string
  promptStyle: 'vague' | 'precise'
  turns: number
  outputTokens: string
  cacheRead: string
  mcpCalls: number
  score: string
}

const RUNS: RunMetric[] = [
  { id: 'vague-raw-api',   label: 'Vague — Raw HTTP',   promptStyle: 'vague',   turns: 6,  outputTokens: '3.4k',  cacheRead: '111k',  mcpCalls: 0, score: '4.5 / 6' },
  { id: 'vague-sdk',       label: 'Vague — SDK',        promptStyle: 'vague',   turns: 10, outputTokens: '3.7k',  cacheRead: '190k',  mcpCalls: 0, score: '1.5 / 6' },
  { id: 'vague-sdk-mcp',   label: 'Vague — SDK + MCP',  promptStyle: 'vague',   turns: 19, outputTokens: '5.3k',  cacheRead: '441k',  mcpCalls: 4, score: '5.0 / 6' },
  { id: 'precise-raw-api', label: 'Precise — Raw HTTP', promptStyle: 'precise', turns: 11, outputTokens: '4.0k',  cacheRead: '667k',  mcpCalls: 0, score: '4.0 / 6' },
  { id: 'precise-sdk',     label: 'Precise — SDK',      promptStyle: 'precise', turns: 12, outputTokens: '4.1k',  cacheRead: '248k',  mcpCalls: 0, score: '4.0 / 6' },
  { id: 'precise-sdk-mcp', label: 'Precise — SDK + MCP',promptStyle: 'precise', turns: 55, outputTokens: '9.9k',  cacheRead: '2.2M',  mcpCalls: 8, score: '5.5 / 6' },
]

export default function RunMetricsTable() {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full font-sans border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-stone-200 dark:border-stone-850">
            <th className="text-left py-2.5 pr-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Run</th>
            <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Score</th>
            <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Turns</th>
            <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Output tokens</th>
            <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Cache read</th>
            <th className="text-center py-2.5 px-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">MCP calls</th>
          </tr>
        </thead>
        <tbody>
          {RUNS.map((run, i) => (
            <tr key={run.id} className={i % 2 === 0 ? 'bg-stone-100/50 dark:bg-stone-850/20' : ''}>
              <td className={`py-2.5 pr-4 font-medium ${run.promptStyle === 'precise' ? 'text-crimson' : 'text-stone-600 dark:text-stone-400'}`}>
                {run.label}
              </td>
              <td className="py-2.5 px-3 text-center text-stone-600 dark:text-stone-400">{run.score}</td>
              <td className="py-2.5 px-3 text-center text-stone-600 dark:text-stone-400">{run.turns}</td>
              <td className="py-2.5 px-3 text-center text-stone-600 dark:text-stone-400">{run.outputTokens}</td>
              <td className="py-2.5 px-3 text-center text-stone-600 dark:text-stone-400">{run.cacheRead}</td>
              <td className="py-2.5 px-3 text-center">
                {run.mcpCalls > 0
                  ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">{run.mcpCalls}</span>
                  : <span className="text-stone-400">0</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
