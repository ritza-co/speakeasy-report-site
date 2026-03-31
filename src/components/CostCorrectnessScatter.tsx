const RUNS = [
  { id: 'simple-raw-api',   label: 'S-Raw',  cacheRead: 111,   score: 4.5, promptStyle: 'simple'  },
  { id: 'simple-sdk',       label: 'S-SDK',  cacheRead: 190,   score: 1.5, promptStyle: 'simple'  },
  { id: 'simple-sdk-mcp',   label: 'S-MCP',  cacheRead: 441,   score: 5.0, promptStyle: 'simple'  },
  { id: 'complex-raw-api',  label: 'C-Raw',  cacheRead: 667,   score: 4.0, promptStyle: 'complex' },
  { id: 'complex-sdk',      label: 'C-SDK',  cacheRead: 248,   score: 4.0, promptStyle: 'complex' },
  { id: 'complex-sdk-mcp',  label: 'C-MCP',  cacheRead: 2238,  score: 5.5, promptStyle: 'complex' },
]

const MAX_CACHE = 2238
const MAX_SCORE = 6
const W = 560
const H = 280
const PAD = { top: 20, right: 40, bottom: 48, left: 56 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom

function toX(cacheRead: number) {
  return PAD.left + (cacheRead / MAX_CACHE) * PLOT_W
}

function toY(score: number) {
  return PAD.top + PLOT_H - (score / MAX_SCORE) * PLOT_H
}

const X_TICKS = [0, 500, 1000, 1500, 2000, 2238]
const Y_TICKS = [0, 1, 2, 3, 4, 5, 6]

export default function CostCorrectnessScatter() {
  return (
    <div className="my-4">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-sans mb-3">
        Cache read tokens (k) vs concept score — all six runs
      </p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px] font-sans" aria-label="Cost vs correctness scatter">

          {/* Grid lines */}
          {Y_TICKS.map(y => (
            <line
              key={y}
              x1={PAD.left} y1={toY(y)}
              x2={PAD.left + PLOT_W} y2={toY(y)}
              className="stroke-stone-200 dark:stroke-stone-800"
              strokeWidth={1}
            />
          ))}

          {/* Y axis labels */}
          {Y_TICKS.map(y => (
            <text
              key={y}
              x={PAD.left - 8} y={toY(y) + 4}
              textAnchor="end"
              className="fill-stone-400 text-[10px]"
              fontSize={10}
            >
              {y}
            </text>
          ))}

          {/* X axis labels */}
          {X_TICKS.map(x => (
            <text
              key={x}
              x={toX(x)} y={H - PAD.bottom + 16}
              textAnchor="middle"
              className="fill-stone-400 text-[10px]"
              fontSize={10}
            >
              {x === 2238 ? '2.2M' : `${x}k`}
            </text>
          ))}

          {/* Axis labels */}
          <text
            x={PAD.left + PLOT_W / 2} y={H - 4}
            textAnchor="middle"
            className="fill-stone-400"
            fontSize={10}
          >
            Cache read tokens
          </text>
          <text
            x={14} y={PAD.top + PLOT_H / 2}
            textAnchor="middle"
            className="fill-stone-400"
            fontSize={10}
            transform={`rotate(-90, 14, ${PAD.top + PLOT_H / 2})`}
          >
            Score / 6
          </text>

          {/* Points */}
          {RUNS.map(run => {
            const cx = toX(run.cacheRead)
            const cy = toY(run.score)
            const isPrecise = run.promptStyle === 'complex'
            return (
              <g key={run.id}>
                <circle
                  cx={cx} cy={cy} r={6}
                  className={isPrecise ? 'fill-crimson/80' : 'fill-stone-400 dark:fill-stone-500'}
                />
                <text
                  x={cx} y={cy - 10}
                  textAnchor="middle"
                  className={isPrecise ? 'fill-crimson' : 'fill-stone-500 dark:fill-stone-400'}
                  fontSize={10}
                  fontWeight={600}
                >
                  {run.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="flex gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-stone-400 font-sans">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-stone-400 dark:bg-stone-500" /> Simple
        </span>
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-crimson font-sans">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-crimson/80" /> Complex
        </span>
      </div>
    </div>
  )
}
