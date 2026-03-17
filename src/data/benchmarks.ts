export type API = 'resend' | 'linear' | 'docusign'
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
    lazy:     { turns: 13, tokens: 34000, time: 255, successProb: 0.50 },
    detailed: { turns: 9,  tokens: 24000, time: 185, successProb: 0.68 },
  },
  sdk: {
    lazy:     { turns: 8,  tokens: 19000, time: 145, successProb: 0.76 },
    detailed: { turns: 5,  tokens: 13000, time: 105, successProb: 0.88 },
  },
  'sdk+mcp': {
    lazy:     { turns: 4,  tokens: 10500, time: 85,  successProb: 0.83 },
    detailed: { turns: 3,  tokens: 7200,  time: 58,  successProb: 0.95 },
  },
}

const API_MULT: Record<API, number> = {
  resend: 1.0,
  linear: 1.22,
  docusign: 1.55,
}

const AGENT_MULT: Record<Agent, number> = {
  'claude-sonnet': 1.0,
  codex: 1.1,
}

export function generateBenchmarks(): BenchmarkRun[] {
  const rand = seededRandom(42)
  const runs: BenchmarkRun[] = []
  let n = 0

  const apis: API[]        = ['resend', 'linear', 'docusign']
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
  docusign: 'DocuSign',
}

export const AGENT_LABELS: Record<Agent, string> = {
  'claude-sonnet': 'Claude Sonnet',
  codex:           'Codex',
}
