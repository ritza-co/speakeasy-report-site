const CONFIGS = [
  { label: 'Raw HTTP',   trainingData: true, webSearch: true, sdk: false, mcp: false },
  { label: 'SDK',        trainingData: true, webSearch: true, sdk: true,  mcp: false },
  { label: 'SDK + MCP',  trainingData: true, webSearch: true, sdk: true,  mcp: true  },
]

function Tick({ yes }: { yes: boolean }) {
  return yes
    ? <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Yes</span>
    : <span className="text-stone-300 dark:text-stone-700">—</span>
}

export default function ConfigAccessTable() {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full font-sans border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-stone-200 dark:border-stone-850">
            <th className="text-left py-2.5 pr-6 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Configuration</th>
            <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Training data</th>
            <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Web search</th>
            <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Resend SDK</th>
            <th className="text-center py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Resend MCP</th>
          </tr>
        </thead>
        <tbody>
          {CONFIGS.map((config, i) => (
            <tr key={config.label} className={i % 2 === 0 ? 'bg-stone-100/50 dark:bg-stone-850/20' : ''}>
              <td className="py-2.5 pr-6 font-medium text-ink dark:text-white">{config.label}</td>
              <td className="py-2.5 px-4 text-center"><Tick yes={config.trainingData} /></td>
              <td className="py-2.5 px-4 text-center"><Tick yes={config.webSearch} /></td>
              <td className="py-2.5 px-4 text-center"><Tick yes={config.sdk} /></td>
              <td className="py-2.5 px-4 text-center"><Tick yes={config.mcp} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
