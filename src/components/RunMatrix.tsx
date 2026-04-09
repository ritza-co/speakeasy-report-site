const CONFIGS = ['Raw HTTP', 'SDK', 'SDK + MCP']
const PROMPTS = ['Simple', 'Complex']

const RUN_IDS: Record<string, string> = {
  'Simple-Raw HTTP':   'simple-raw-api',
  'Simple-SDK':        'simple-sdk',
  'Simple-SDK + MCP':  'simple-sdk-mcp',
  'Complex-Raw HTTP':  'complex-raw-api',
  'Complex-SDK':       'complex-sdk',
  'Complex-SDK + MCP': 'complex-sdk-mcp',
}

export default function RunMatrix() {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="font-sans border-collapse text-[13px]">
        <thead>
          <tr>
            <th className="pb-3 pr-6" />
            {CONFIGS.map(config => (
              <th key={config} className="pb-3 px-4 text-center text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal min-w-[120px]">
                {config}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PROMPTS.map(prompt => (
            <tr key={prompt}>
              <td className={`py-3 pr-6 text-[10px] uppercase tracking-widest font-sans font-normal ${prompt === 'Complex' ? 'text-crimson' : 'text-stone-600 dark:text-stone-400'}`}>
                {prompt}
              </td>
              {CONFIGS.map(config => {
                const id = RUN_IDS[`${prompt}-${config}`]
                return (
                  <td key={config} className="py-3 px-4 text-center">
                    <span className="inline-block border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 px-3 py-1.5 text-[11px] text-stone-600 dark:text-stone-400 font-mono">
                      {id}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
