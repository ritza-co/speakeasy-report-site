import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import type { BenchmarkRun, Tool, Model, Method } from '../data/benchmarks'
import { BENCHMARKS, METHOD_COLORS, MODEL_COLORS, TOOL_LABELS } from '../data/benchmarks'

const W = 820
const H = 480
const M = { top: 28, right: 36, bottom: 64, left: 96 }
const PW = W - M.left - M.right
const PH = H - M.top  - M.bottom

// Axes: x = elapsed_seconds, y = output tokens
const MAX_ELAPSED  = 3200   // 50m26s outlier
const MAX_OUTPUT   = 35_000

const xScale = (v: number) => Math.min((v / MAX_ELAPSED) * PW, PW)
const yScale = (v: number) => PH - Math.min((v / MAX_OUTPUT) * PH, PH)
const rScale = (output: number) => 5 + Math.min((output / 35000) * 14, 14)

const X_TICKS = [0, 600, 1200, 1800, 2400, 3000]
const Y_TICKS = [0, 7_000, 14_000, 21_000, 28_000, 35_000]
const fmtX = (v: number) => v === 0 ? '0' : `${v / 60 | 0}m`
const fmtY = (v: number) => v === 0 ? '0' : `${Math.round(v / 1000)}k`

function Pill({ label, active, color, onClick }: {
  label: string; active: boolean; color?: string; onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className="text-[11px] px-3 py-1 rounded-full border font-sans"
      animate={
        active && color
          ? { backgroundColor: color, borderColor: color, color: '#fff' }
          : active
          ? { backgroundColor: '#1c1917', borderColor: '#1c1917', color: '#fff' }
          : { backgroundColor: 'transparent', borderColor: 'var(--pill-border)', color: 'var(--pill-color)' }
      }
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  )
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
}

interface TooltipData { run: BenchmarkRun; mx: number; my: number }

function Tooltip({ data }: { data: TooltipData }) {
  const r = data.run
  return (
    <motion.div
      className="fixed z-50 bg-ink text-white text-xs font-sans rounded shadow-xl px-3 py-2.5 pointer-events-none"
      style={{ left: data.mx + 14, top: data.my - 10, minWidth: 200 }}
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.12 }}
    >
      <div className="flex justify-between gap-4 mb-1">
        <span className="text-stone-400">{TOOL_LABELS[r.tool]}</span>
        <span className={r.success ? 'text-green-400' : 'text-red-400'}>
          {r.success ? '✓ success' : '✗ failed'}
        </span>
      </div>
      <div className="space-y-0.5 text-stone-300">
        <div className="flex justify-between gap-4">
          <span>Model</span><span className="text-white">{r.model}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Method</span><span className="text-white">{r.method}</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-stone-700 space-y-0.5">
        <div className="flex justify-between gap-4">
          <span className="text-stone-400">Time</span><span>{r.elapsed}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone-400">Output</span>
          <span>{r.tokens.output.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone-400">Total ctx</span>
          <span>{(r.tokens.total_context / 1_000_000).toFixed(2)}M</span>
        </div>
        {r.mcp_calls > 0 && (
          <div className="flex justify-between gap-4">
            <span className="text-stone-400">MCP calls</span><span>{r.mcp_calls}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function ScatterPlot() {
  const [methods, setMethods] = useState<Method[]>(['Bare', 'SDK', 'SDK+MCP'])
  const [tools,   setTools]   = useState<Tool[]>  (['Linear', 'Resend', 'Metabase', 'Pandadoc'])
  const [models,  setModels]  = useState<Model[]> (['Opus', 'Sonnet', 'GPT-5.4'])
  const [tip,     setTip]     = useState<TooltipData | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [dotsVisible, setDotsVisible] = useState(false)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      setDotsVisible(true)
      setTimeout(() => { hasAnimated.current = true }, BENCHMARKS.length * 4 + 500)
    }
  }, [isInView])

  const activeSet = useMemo(() => new Set(
    BENCHMARKS
      .filter(r => methods.includes(r.method) && tools.includes(r.tool) && models.includes(r.model))
      .map(r => r.id)
  ), [methods, tools, models])

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-6 mb-6 text-xs font-sans">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">Method</p>
          <div className="flex gap-1.5">
            {(['Bare', 'SDK', 'SDK+MCP'] as Method[]).map(m => (
              <Pill key={m} label={m} active={methods.includes(m)}
                color={METHOD_COLORS[m]} onClick={() => setMethods(toggle(methods, m))} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">API</p>
          <div className="flex gap-1.5 flex-wrap">
            {(['Linear', 'Resend', 'Metabase', 'Pandadoc'] as Tool[]).map(t => (
              <Pill key={t} label={TOOL_LABELS[t]} active={tools.includes(t)}
                onClick={() => setTools(toggle(tools, t))} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">Model</p>
          <div className="flex gap-1.5">
            {(['Opus', 'Sonnet', 'GPT-5.4'] as Model[]).map(m => (
              <Pill key={m} label={m} active={models.includes(m)}
                color={MODEL_COLORS[m]} onClick={() => setModels(toggle(models, m))} />
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-stone-400 font-sans mb-3">
        Showing <strong className="text-ink dark:text-white">{activeSet.size}</strong> of {BENCHMARKS.length} sessions
      </p>

      <div className="w-full overflow-x-auto" ref={containerRef}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 480 }}
          onMouseLeave={() => setTip(null)}>
          <g transform={`translate(${M.left},${M.top})`}>

            {Y_TICKS.map(v => (
              <line key={v} x1={0} x2={PW} y1={yScale(v)} y2={yScale(v)}
                stroke="var(--scatter-grid)" strokeWidth={1} />
            ))}

            {X_TICKS.map(v => (
              <g key={v} transform={`translate(${xScale(v)},${PH})`}>
                <line y1={0} y2={6} stroke="var(--scatter-tick)" strokeWidth={1} />
                <text y={20} textAnchor="middle" fontSize={10} fill="var(--scatter-tick)" fontFamily="Inter, sans-serif">
                  {fmtX(v)}
                </text>
              </g>
            ))}
            <text x={PW / 2} y={PH + 50} textAnchor="middle" fontSize={11}
              fill="var(--scatter-label)" fontFamily="Inter, sans-serif">
              Session duration
            </text>

            {Y_TICKS.map(v => (
              <g key={v} transform={`translate(0,${yScale(v)})`}>
                <line x1={-5} x2={0} stroke="var(--scatter-tick)" strokeWidth={1} />
                <text x={-10} textAnchor="end" dominantBaseline="middle" fontSize={10}
                  fill="var(--scatter-tick)" fontFamily="Inter, sans-serif">
                  {fmtY(v)}
                </text>
              </g>
            ))}
            <text transform={`translate(${-76},${PH / 2}) rotate(-90)`}
              textAnchor="middle" fontSize={11} fill="var(--scatter-label)" fontFamily="Inter, sans-serif">
              Output tokens
            </text>

            {BENCHMARKS.map((run, index) => {
              const visible = activeSet.has(run.id)
              const cx = xScale(run.elapsed_seconds)
              const cy = yScale(run.tokens.output)
              const r  = rScale(run.tokens.output)
              const color = METHOD_COLORS[run.method]
              const modelColor = MODEL_COLORS[run.model]
              const isGpt = run.model === 'GPT-5.4'
              const isSonnet = run.model === 'Sonnet'

              const targetOpacity = dotsVisible
                ? (visible ? (run.success ? 0.82 : 0.25) : 0.04)
                : 0
              const delay = hasAnimated.current ? 0 : index * 0.006

              return (
                <motion.circle
                  key={run.id}
                  cx={cx} cy={cy} r={r}
                  fill={isGpt ? 'transparent' : color}
                  stroke={isGpt ? modelColor : isSonnet ? '#fff' : color}
                  strokeWidth={isGpt ? 2 : isSonnet ? 1 : 0}
                  animate={{ opacity: targetOpacity }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.35, delay, ease: 'easeOut' }}
                  style={{ cursor: visible ? 'pointer' : 'default' }}
                  onMouseEnter={e => visible && setTip({ run, mx: e.clientX, my: e.clientY })}
                  onMouseMove={e  => visible && setTip(t => t ? { ...t, mx: e.clientX, my: e.clientY } : null)}
                  onMouseLeave={() => setTip(null)}
                />
              )
            })}
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap gap-6 mt-4 text-[11px] font-sans text-stone-500">
        <div className="flex items-center gap-4">
          {(['Bare', 'SDK', 'SDK+MCP'] as Method[]).map(m => (
            <span key={m} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: METHOD_COLORS[m] }} />
              {m}
            </span>
          ))}
        </div>
        <span className="text-stone-300">·</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-stone-400 inline-block" />
          Opus/Sonnet = filled
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-emerald-500 inline-block" />
          GPT-5.4 = outline
        </span>
        <span className="text-stone-300">·</span>
        <span>Dot size = output tokens · Faded = failed</span>
      </div>

      {tip && <Tooltip data={tip} />}
    </div>
  )
}
