import type { Mode } from '../data/benchmarks'
import { BENCHMARKS, aggregate, MODE_COLORS } from '../data/benchmarks'

const MODES: Mode[] = ['bare', 'sdk', 'sdk+mcp']
const MODE_LABELS: Record<Mode, string> = { bare: 'Bare', sdk: 'SDK', 'sdk+mcp': 'SDK + MCP' }

function pct(v: number) { return `${Math.round(v * 100)}%` }
function num(v: number, dec = 1) { return v.toFixed(dec) }
function kk(v: number) { return `${(v / 1000).toFixed(1)}k` }
function sec(v: number) { return `${Math.round(v)}s` }

function Delta({ base, val, lower = true }: { base: number; val: number; lower?: boolean }) {
  const pctChange = ((val - base) / base) * 100
  const good = lower ? pctChange < 0 : pctChange > 0
  if (Math.abs(pctChange) < 1) return <span className="text-stone-400 text-[11px]">—</span>
  return (
    <span className={`text-[11px] ml-1.5 ${good ? 'text-emerald-600' : 'text-red-500'}`}>
      {good ? '↓' : '↑'} {Math.abs(pctChange).toFixed(0)}%
    </span>
  )
}

export default function ModeComparisonTable() {
  const data = MODES.map(mode => ({
    mode,
    all:      aggregate(BENCHMARKS.filter(r => r.mode === mode))!,
    lazy:     aggregate(BENCHMARKS.filter(r => r.mode === mode && r.promptType === 'lazy'))!,
    detailed: aggregate(BENCHMARKS.filter(r => r.mode === mode && r.promptType === 'detailed')),
  }))

  const base = data[0].all

  const rows = [
    {
      label: 'Success rate',
      fmt:   (d: ReturnType<typeof aggregate>) => pct(d!.successRate),
      val:   (d: ReturnType<typeof aggregate>) => d!.successRate,
      lower: false,
    },
    {
      label: 'Avg turns',
      fmt:   (d: ReturnType<typeof aggregate>) => num(d!.avgTurns),
      val:   (d: ReturnType<typeof aggregate>) => d!.avgTurns,
      lower: true,
    },
    {
      label: 'Avg tokens',
      fmt:   (d: ReturnType<typeof aggregate>) => kk(d!.avgTokens),
      val:   (d: ReturnType<typeof aggregate>) => d!.avgTokens,
      lower: true,
    },
    {
      label: 'Avg time',
      fmt:   (d: ReturnType<typeof aggregate>) => sec(d!.avgTime),
      val:   (d: ReturnType<typeof aggregate>) => d!.avgTime,
      lower: true,
    },
  ]

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm font-sans border-collapse">
        <thead>
          <tr>
            <th className="text-left py-3 pr-8 text-[10px] uppercase tracking-widest text-stone-400 font-normal w-32" />
            {data.map(({ mode }) => (
              <th key={mode} className="text-center pb-3 pt-1 min-w-[150px]">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: MODE_COLORS[mode] }}
                  />
                  <span className="text-ink dark:text-white font-medium text-sm">{MODE_LABELS[mode]}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? 'bg-stone-100/60 dark:bg-stone-850/30' : ''}>
              <td className="py-3.5 pr-8 text-[11px] uppercase tracking-widest text-stone-400 font-normal">
                {row.label}
              </td>
              {data.map(({ mode, all }, j) => (
                <td key={mode} className="py-3.5 text-center text-ink dark:text-white">
                  <span className="text-base font-medium">{row.fmt(all)}</span>
                  {j > 0 && (
                    <Delta
                      base={row.val(base)}
                      val={row.val(all)}
                      lower={row.lower}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}

          {/* Prompt type sub-rows */}
          <tr>
            <td colSpan={4} className="pt-8 pb-2">
              <p className="text-[10px] uppercase tracking-widest text-stone-400">
                Broken out by prompt type
              </p>
            </td>
          </tr>
          {(['lazy', 'detailed'] as const).map(pt => (
            <tr key={pt} className={pt === 'lazy' ? 'bg-stone-100/60 dark:bg-stone-850/30' : ''}>
              <td className="py-3 pr-8 text-[11px] uppercase tracking-widest text-stone-400 font-normal capitalize">
                {pt}
              </td>
              {data.map(({ mode, lazy, detailed }) => {
                const d = pt === 'lazy' ? lazy : detailed
                return (
                  <td key={mode} className="py-3 text-center text-sm">
                    {d ? (
                      <>
                        <div className="text-ink dark:text-white font-medium">{pct(d.successRate)}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {num(d.avgTurns)} turns · {kk(d.avgTokens)}
                        </div>
                      </>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
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
