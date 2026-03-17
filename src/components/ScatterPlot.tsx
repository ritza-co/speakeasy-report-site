import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import type { BenchmarkRun, Mode, API, Agent, PromptType } from '../data/benchmarks'
import {
  BENCHMARKS,
  MODE_COLORS, API_LABELS, AGENT_LABELS,
} from '../data/benchmarks'

// ─── SVG dimensions ─────────────────────────────────────────────────────────
const W = 820
const H = 480
const M = { top: 28, right: 36, bottom: 64, left: 88 }
const PW = W - M.left - M.right
const PH = H - M.top  - M.bottom

const MAX_TURNS  = 24
const MAX_TOKENS = 58000

const xScale = (v: number) => (v / MAX_TURNS) * PW
const yScale = (v: number) => PH - (v / MAX_TOKENS) * PH
const rScale = (v: number, min: number, max: number) =>
  5 + ((v - min) / (max - min + 1)) * 13

const X_TICKS = [0, 4, 8, 12, 16, 20, 24]
const Y_TICKS = [0, 10000, 20000, 30000, 40000, 50000]
const fmtK    = (v: number) => v === 0 ? '0' : `${v / 1000}k`

// ─── Toggle pill ─────────────────────────────────────────────────────────────
function Pill({
  label, active, color, onClick,
}: { label: string; active: boolean; color?: string; onClick: () => void }) {
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

// ─── Tooltip ─────────────────────────────────────────────────────────────────
interface TooltipData { run: BenchmarkRun; mx: number; my: number }

function Tooltip({ data }: { data: TooltipData }) {
  return (
    <motion.div
      className="fixed z-50 bg-ink text-white text-xs font-sans rounded shadow-xl px-3 py-2.5 pointer-events-none"
      style={{ left: data.mx + 14, top: data.my - 10, minWidth: 180 }}
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.12 }}
    >
      <div className="flex justify-between gap-4 mb-1">
        <span className="text-stone-400">{API_LABELS[data.run.api]}</span>
        <span className={data.run.success ? 'text-green-400' : 'text-red-400'}>
          {data.run.success ? '✓ success' : '✗ failed'}
        </span>
      </div>
      <div className="space-y-0.5 text-stone-300">
        <div className="flex justify-between gap-4">
          <span>Agent</span>
          <span className="text-white">{AGENT_LABELS[data.run.agent]}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Mode</span>
          <span className="text-white">{data.run.mode}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Prompt</span>
          <span className="text-white">{data.run.promptType}</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-stone-700 space-y-0.5">
        <div className="flex justify-between gap-4">
          <span className="text-stone-400">Turns</span>
          <span>{data.run.turns}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone-400">Tokens</span>
          <span>{data.run.totalTokens.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone-400">Time</span>
          <span>{data.run.timeSeconds}s</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ScatterPlot() {
  const [modes,   setModes]   = useState<Mode[]>      (['bare', 'sdk', 'sdk+mcp'])
  const [apis,    setApis]    = useState<API[]>        (['resend', 'linear', 'docusign'])
  const [agents,  setAgents]  = useState<Agent[]>      (['claude-sonnet', 'codex'])
  const [prompts, setPrompts] = useState<PromptType[]> (['lazy', 'detailed'])
  const [tip,     setTip]     = useState<TooltipData | null>(null)

  // Pop-in on first entry
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
      .filter(r =>
        modes.includes(r.mode) &&
        apis.includes(r.api) &&
        agents.includes(r.agent) &&
        prompts.includes(r.promptType)
      )
      .map(r => r.id)
  ), [modes, apis, agents, prompts])

  const times = BENCHMARKS.map(r => r.timeSeconds)
  const minT  = Math.min(...times)
  const maxT  = Math.max(...times)

  return (
    <div className="w-full">
      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-6 mb-6 text-xs font-sans">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">Mode</p>
          <div className="flex gap-1.5">
            {(['bare', 'sdk', 'sdk+mcp'] as Mode[]).map(m => (
              <Pill key={m} label={m} active={modes.includes(m)}
                color={MODE_COLORS[m]} onClick={() => setModes(toggle(modes, m))} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">API</p>
          <div className="flex gap-1.5">
            {(['resend', 'linear', 'docusign'] as API[]).map(a => (
              <Pill key={a} label={API_LABELS[a]} active={apis.includes(a)}
                onClick={() => setApis(toggle(apis, a))} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">Agent</p>
          <div className="flex gap-1.5">
            {(['claude-sonnet', 'codex'] as Agent[]).map(a => (
              <Pill key={a} label={AGENT_LABELS[a]} active={agents.includes(a)}
                onClick={() => setAgents(toggle(agents, a))} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-2">Prompt</p>
          <div className="flex gap-1.5">
            {(['lazy', 'detailed'] as PromptType[]).map(p => (
              <Pill key={p} label={p} active={prompts.includes(p)}
                onClick={() => setPrompts(toggle(prompts, p))} />
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-stone-400 font-sans mb-3">
        Showing <strong className="text-ink dark:text-white">{activeSet.size}</strong> of {BENCHMARKS.length} runs
      </p>

      {/* ── SVG ── */}
      <div className="w-full overflow-x-auto" ref={containerRef}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ minWidth: 480 }}
          onMouseLeave={() => setTip(null)}
        >
          <g transform={`translate(${M.left},${M.top})`}>

            {/* Grid lines */}
            {Y_TICKS.map(v => (
              <line key={v} x1={0} x2={PW} y1={yScale(v)} y2={yScale(v)}
                stroke="var(--scatter-grid)" strokeWidth={1} />
            ))}

            {/* X axis */}
            {X_TICKS.map(v => (
              <g key={v} transform={`translate(${xScale(v)},${PH})`}>
                <line y1={0} y2={6} stroke="var(--scatter-tick)" strokeWidth={1} />
                <text y={20} textAnchor="middle" fontSize={10} fill="var(--scatter-tick)" fontFamily="Inter, sans-serif">
                  {v}
                </text>
              </g>
            ))}
            <text x={PW / 2} y={PH + 50} textAnchor="middle" fontSize={11} fill="var(--scatter-label)" fontFamily="Inter, sans-serif">
              Number of turns
            </text>

            {/* Y axis */}
            {Y_TICKS.map(v => (
              <g key={v} transform={`translate(0,${yScale(v)})`}>
                <line x1={-5} x2={0} stroke="var(--scatter-tick)" strokeWidth={1} />
                <text x={-10} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="var(--scatter-tick)" fontFamily="Inter, sans-serif">
                  {fmtK(v)}
                </text>
              </g>
            ))}
            <text
              transform={`translate(${-68},${PH / 2}) rotate(-90)`}
              textAnchor="middle" fontSize={11} fill="var(--scatter-label)" fontFamily="Inter, sans-serif"
            >
              Total tokens
            </text>

            {/* Dots */}
            {BENCHMARKS.map((run, index) => {
              const visible = activeSet.has(run.id)
              const cx = xScale(run.turns)
              const cy = yScale(run.totalTokens)
              const r  = rScale(run.timeSeconds, minT, maxT)
              const color = MODE_COLORS[run.mode]
              const isClaude = run.agent === 'claude-sonnet'

              const targetOpacity = dotsVisible
                ? (visible ? (run.success ? 0.82 : 0.25) : 0.04)
                : 0

              const delay = hasAnimated.current ? 0 : index * 0.004

              return (
                <motion.circle
                  key={run.id}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={isClaude ? color : 'transparent'}
                  stroke={color}
                  strokeWidth={isClaude ? 0 : 2}
                  animate={{ opacity: targetOpacity }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.35, delay, ease: 'easeOut' }}
                  style={{ cursor: visible ? 'pointer' : 'default' }}
                  onMouseEnter={(e) => visible && setTip({ run, mx: e.clientX, my: e.clientY })}
                  onMouseMove={(e)  => visible && setTip(t => t ? { ...t, mx: e.clientX, my: e.clientY } : null)}
                  onMouseLeave={() => setTip(null)}
                />
              )
            })}
          </g>
        </svg>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-6 mt-4 text-[11px] font-sans text-stone-500">
        <div className="flex items-center gap-4">
          {(['bare', 'sdk', 'sdk+mcp'] as Mode[]).map(m => (
            <span key={m} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: MODE_COLORS[m] }} />
              {m}
            </span>
          ))}
        </div>
        <span className="text-stone-300">·</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-stone-400 inline-block" />
          Claude = filled
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border border-stone-400 inline-block" />
          Codex = outline
        </span>
        <span className="text-stone-300">·</span>
        <span>Dot size = time taken</span>
        <span className="text-stone-300">·</span>
        <span>Faded = failed run</span>
      </div>

      {tip && <Tooltip data={tip} />}
    </div>
  )
}
