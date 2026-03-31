interface FabricationRow {
  run: string
  promptStyle: 'simple' | 'complex'
  claim: string
  reality: string
}

const ROWS: FabricationRow[] = [
  {
    run: 'complex-raw-api',
    promptStyle: 'complex',
    claim: '"CID/attachment-based inline images are not supported by the Resend broadcasts endpoint"',
    reality: 'Resend broadcasts support contentId attachments with cid: references in HTML. The complex-sdk-mcp run used this correctly.',
  },
  {
    run: 'complex-sdk',
    promptStyle: 'complex',
    claim: '"The Resend SDK does not support contentId on attachments"',
    reality: 'The Resend SDK accepts a contentId field on attachment objects. The agent worked around a constraint it invented.',
  },
  {
    run: 'simple-sdk',
    promptStyle: 'simple',
    claim: '"Resend\'s contact API does not expose a generic key/value metadata field"',
    reality: 'The Contact Properties API provides exactly this. The agent acknowledged the gap in a comment rather than looking it up.',
  },
]

export default function FabricationTable() {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full font-sans border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-stone-200 dark:border-stone-850">
            <th className="text-left py-2.5 pr-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal w-[110px]">Run</th>
            <th className="text-left py-2.5 px-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal">What the agent claimed</th>
            <th className="text-left py-2.5 pl-4 text-[10px] uppercase tracking-widest text-stone-400 font-normal">What is actually true</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={row.run} className={`align-top ${i % 2 === 0 ? 'bg-stone-100/50 dark:bg-stone-850/20' : ''}`}>
              <td className={`py-3 pr-4 font-medium text-[12px] ${row.promptStyle === 'complex' ? 'text-crimson' : 'text-stone-500 dark:text-stone-400'}`}>
                {row.run}
              </td>
              <td className="py-3 px-4 text-stone-600 dark:text-stone-400 italic leading-relaxed">
                {row.claim}
              </td>
              <td className="py-3 pl-4 text-stone-600 dark:text-stone-400 leading-relaxed">
                {row.reality}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
