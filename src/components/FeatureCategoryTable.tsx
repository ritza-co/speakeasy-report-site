interface FeatureRow {
  feature: string
  category: 'no-mcp' | 'needed-mcp' | 'fabricated'
}

const ROWS: FeatureRow[] = [
  { feature: 'Broadcast email (create + send)',     category: 'no-mcp'      },
  { feature: 'Personalize with template variables', category: 'no-mcp'      },
  { feature: 'Idempotency / safe to retry',         category: 'no-mcp'      },
  { feature: 'Tag premium users (Segments API)',    category: 'needed-mcp'  },
  { feature: 'Store subscription tier (Contact Properties two-step flow)', category: 'needed-mcp' },
  { feature: 'Inline logo (content_id + cid:)',     category: 'fabricated'  },
]

const CATEGORY_META = {
  'no-mcp':     { label: 'Correct without MCP',         style: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  'needed-mcp': { label: 'Only correct with MCP',        style: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  'fabricated': { label: 'Fabricated constraint without MCP', style: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
}

export default function FeatureCategoryTable() {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full font-sans border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-stone-200 dark:border-stone-850">
            <th className="text-left py-2.5 pr-6 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Feature</th>
            <th className="text-left py-2.5 text-[10px] uppercase tracking-widest text-stone-600 dark:text-stone-400 font-normal">Result without MCP</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => {
            const meta = CATEGORY_META[row.category]
            return (
              <tr key={row.feature} className={i % 2 === 0 ? 'bg-stone-100/50 dark:bg-stone-850/20' : ''}>
                <td className="py-2.5 pr-6 text-stone-600 dark:text-stone-400">{row.feature}</td>
                <td className="py-2.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-sans border ${meta.style}`}>
                    {meta.label}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
