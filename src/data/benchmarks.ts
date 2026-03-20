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

// ─── Real data from two benchmark reports ────────────────────────────────────
//
// Report 2 — Claude Sonnet 4.6, Resend + Metabase, 3 modes, 15 scenarios each.
//   Token counts estimated from reported average cost at ~$5/MTok blended rate
//   (Claude Sonnet 4.6 input $3/MTok, output $15/MTok with moderate caching).
//   All scenarios mapped as lazy prompt (Report 2 used low/medium/high complexity,
//   not a lazy/detailed split).
//
// Report 1 — Claude Sonnet 4.6 + Codex, Resend + Linear, lazy bare + detailed
//   sdk+mcp only. Token counts as reported. Claude Sonnet counts in Report 1
//   appear to be output tokens; Codex counts are full input+output totals.
//   Turn counts for Report 1 are estimated from task descriptions (not reported).

function buildData(): BenchmarkRun[] {
  const runs: BenchmarkRun[] = []
  let n = 0

  const add = (
    api: API, agent: Agent, mode: Mode, promptType: PromptType,
    count: number, passes: number,
    turns: number, timeSeconds: number, totalTokens: number,
  ) => {
    for (let i = 0; i < count; i++) {
      runs.push({
        id: `run-${++n}`,
        api, agent, mode, promptType,
        success: i < passes,
        turns, totalTokens, timeSeconds,
        run: (i % 3) + 1,
      })
    }
  }

  // ── Report 2: Resend, Claude Sonnet 4.6 ──────────────────────────────────
  // All 3 bare failures were a test harness regex bug, not agent failures.
  add('resend', 'claude-sonnet', 'bare',    'lazy', 15, 15,  7,  65, 37600)
  add('resend', 'claude-sonnet', 'sdk',     'lazy', 15, 15,  7,  41, 25400)
  add('resend', 'claude-sonnet', 'sdk+mcp', 'lazy', 15, 15, 15,  83, 49600)

  // ── Report 2: Metabase, Claude Sonnet 4.6 ────────────────────────────────
  add('metabase', 'claude-sonnet', 'bare',    'lazy', 15, 10,  8,  68, 36200)
  add('metabase', 'claude-sonnet', 'sdk',     'lazy', 15, 10,  8,  63, 35400)
  add('metabase', 'claude-sonnet', 'sdk+mcp', 'lazy', 15, 12, 16,  99, 58400)

  // ── Report 1: Linear, both agents, lazy bare ──────────────────────────────
  // Claude Sonnet: explored project, reached for @linear/sdk on first try.
  // Codex: called GraphQL API directly via fetch; all runs passed.
  add('linear', 'claude-sonnet', 'bare', 'lazy', 3, 3,  7, 114,  1110)
  add('linear', 'codex',         'bare', 'lazy', 3, 3, 10, 150, 41419)

  // ── Report 1: Resend + Linear, both agents, detailed sdk+mcp ─────────────
  // All runs passed on first try with MCP available.
  add('resend', 'claude-sonnet',  'sdk+mcp', 'detailed', 3, 3,  8,  74,  1300)
  add('resend', 'codex',          'sdk+mcp', 'detailed', 3, 3, 12, 180, 48206)
  add('linear', 'claude-sonnet',  'sdk+mcp', 'detailed', 3, 3,  8, 107,  2300)
  add('linear', 'codex',          'sdk+mcp', 'detailed', 3, 3, 12, 300, 108909)

  return runs
}

export const BENCHMARKS = buildData()

// ─── Aggregation helpers ─────────────────────────────────────────────────────

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
    avgTokens:   runs.reduce((s, r) => r.totalTokens, 0)      / runs.length,
    avgTime:     runs.reduce((s, r) => s + r.timeSeconds, 0)  / runs.length,
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
