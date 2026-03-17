export type API = 'resend' | 'linear' | 'metabase'
export type Agent = 'claude-sonnet' | 'codex'
export type Mode = 'bare' | 'sdk' | 'sdk+mcp'
export type PromptType = 'lazy' | 'detailed'

export interface BenchmarkRun {
  id: string
  api: API
  agent: Agent
  mode: Mode
  promptType: PromptType
  success: boolean
  turns: number
  totalTokens: number
  timeSeconds: number
  run: number
}

// Seeded LCG random — same results every page load
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

interface BaseParams {
  turns: number
  tokens: number
  time: number
  successProb: number
}

const BASE: Record<Mode, Record<PromptType, BaseParams>> = {
  bare: {
    lazy:     { turns: 7,  tokens: 37000, time: 67,  successProb: 0.73 },
    detailed: { turns: 6,  tokens: 32000, time: 72,  successProb: 0.87 },
  },
  sdk: {
    lazy:     { turns: 7,  tokens: 30000, time: 52,  successProb: 0.84 },
    detailed: { turns: 5,  tokens: 25000, time: 58,  successProb: 0.95 },
  },
  'sdk+mcp': {
    lazy:     { turns: 15, tokens: 54000, time: 91,  successProb: 0.90 },
    detailed: { turns: 13, tokens: 48000, time: 100, successProb: 0.97 },
  },
}

const API_MULT: Record<API, number> = {
  resend: 1.0,
  linear: 1.15,
  metabase: 1.35,
}

const AGENT_MULT: Record<Agent, number> = {
  'claude-sonnet': 1.0,
  codex: 1.1,
}

export function generateBenchmarks(): BenchmarkRun[] {
  const rand = seededRandom(42)
  const runs: BenchmarkRun[] = []
  let n = 0

  const apis: API[]        = ['resend', 'linear', 'metabase']
  const agents: Agent[]    = ['claude-sonnet', 'codex']
  const modes: Mode[]      = ['bare', 'sdk', 'sdk+mcp']
  const prompts: PromptType[] = ['lazy', 'detailed']

  for (const api of apis) {
    for (const agent of agents) {
      for (const mode of modes) {
        for (const promptType of prompts) {
          for (let run = 1; run <= 3; run++) {
            const base   = BASE[mode][promptType]
            const am     = API_MULT[api]
            const agm    = AGENT_MULT[agent]
            const jitter = () => 0.72 + rand() * 0.56

            const turns       = Math.max(1, Math.round(base.turns   * am * agm * jitter()))
            const totalTokens = Math.max(1000, Math.round(base.tokens * am * agm * jitter()))
            const timeSeconds = Math.max(20,  Math.round(base.time   * am * agm * jitter()))
            const success     = rand() < base.successProb

            runs.push({
              id: `run-${++n}`,
              api, agent, mode, promptType,
              success, turns, totalTokens, timeSeconds, run,
            })
          }
        }
      }
    }
  }
  return runs
}

export const BENCHMARKS = generateBenchmarks()

// ─── Aggregation helpers ────────────────────────────────────────────────────

export interface Aggregate {
  count: number
  successRate: number
  avgTurns: number
  avgTokens: number
  avgTime: number
}

export function aggregate(runs: BenchmarkRun[]): Aggregate | null {
  if (!runs.length) return null
  return {
    count:       runs.length,
    successRate: runs.filter(r => r.success).length / runs.length,
    avgTurns:    runs.reduce((s, r) => s + r.turns, 0)        / runs.length,
    avgTokens:   runs.reduce((s, r) => s + r.totalTokens, 0)  / runs.length,
    avgTime:     runs.reduce((s, r) => s + r.timeSeconds, 0)   / runs.length,
  }
}

export const MODE_COLORS: Record<Mode, string> = {
  bare:      '#94a3b8',
  sdk:       '#3b82f6',
  'sdk+mcp': '#c0392b',
}

export const API_LABELS: Record<API, string> = {
  resend:   'Resend',
  linear:   'Linear',
  metabase: 'Metabase',
}

export const AGENT_LABELS: Record<Agent, string> = {
  'claude-sonnet': 'Claude Sonnet',
  codex:           'Codex',
}
