export type Tool    = 'Linear' | 'Resend' | 'Metabase' | 'Pandadoc'
export type Model   = 'Opus' | 'Sonnet' | 'GPT-5.4'
export type Method  = 'Bare' | 'SDK' | 'SDK+MCP'

export interface TokenBreakdown {
  input_fresh:    number
  output:         number
  cache_read:     number
  cache_write:    number
  effective_input:number
  total_context:  number
}

export interface BenchmarkRun {
  id:              string   // workspace slug used as stable key
  tool:            Tool
  model:           Model
  method:          Method
  elapsed:         string
  elapsed_seconds: number
  success:         boolean
  mcp_calls:       number
  tokens:          TokenBreakdown
}

// ─── Success derived from report text ────────────────────────────────────────
// Linear, Resend, Metabase: 100% success across all sessions.
// PandaDoc: 78% — two failures: Opus/Bare and Sonnet/SDK.
//
// MCP calls derived from report model×method totals:
//   GPT-5.4/Bare:    7 total (Linear 0, Resend 2, Metabase 3, Pandadoc 2)
//   Opus/SDK:        1 total (Linear 1, rest 0)
//   Opus/SDK+MCP:    5 total (Linear 2, Resend 1, Metabase 1, Pandadoc 1)
//   Sonnet/SDK+MCP:  3 total (Linear 1, Resend 1, Metabase 1, Pandadoc 0)
//   GPT-5.4/SDK+MCP: 38 total (Linear 8, Resend 7, Metabase 6, Pandadoc 17)
//   All others: 0

export const BENCHMARKS: BenchmarkRun[] = [
  // ── Linear ──────────────────────────────────────────────────────────────────
  {
    id: 'linear-opus-bare',
    tool: 'Linear', model: 'Opus', method: 'Bare',
    elapsed: '15m 17s', elapsed_seconds: 917,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 23, output: 14393, cache_read: 736827, cache_write: 43856, effective_input: 736850, total_context: 751243 },
  },
  {
    id: 'linear-sonnet-bare',
    tool: 'Linear', model: 'Sonnet', method: 'Bare',
    elapsed: '5m 15s', elapsed_seconds: 315,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 36, output: 13031, cache_read: 1186524, cache_write: 39182, effective_input: 1186560, total_context: 1199591 },
  },
  {
    id: 'linear-gpt54-bare',
    tool: 'Linear', model: 'GPT-5.4', method: 'Bare',
    elapsed: '9m 22s', elapsed_seconds: 562,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 87345, output: 1391, cache_read: 87168, cache_write: 0, effective_input: 174513, total_context: 175904 },
  },
  {
    id: 'linear-opus-sdk',
    tool: 'Linear', model: 'Opus', method: 'SDK',
    elapsed: '6m 04s', elapsed_seconds: 364,
    success: true, mcp_calls: 1,
    tokens: { input_fresh: 35, output: 9556, cache_read: 1047650, cache_write: 34917, effective_input: 1047685, total_context: 1057241 },
  },
  {
    id: 'linear-sonnet-sdk',
    tool: 'Linear', model: 'Sonnet', method: 'SDK',
    elapsed: '5m 05s', elapsed_seconds: 305,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 38, output: 11466, cache_read: 1323749, cache_write: 37514, effective_input: 1323787, total_context: 1335253 },
  },
  {
    id: 'linear-gpt54-sdk',
    tool: 'Linear', model: 'GPT-5.4', method: 'SDK',
    elapsed: '11m 45s', elapsed_seconds: 705,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 117288, output: 1022, cache_read: 113280, cache_write: 0, effective_input: 230568, total_context: 231590 },
  },
  {
    id: 'linear-opus-sdkmcp',
    tool: 'Linear', model: 'Opus', method: 'SDK+MCP',
    elapsed: '5m 57s', elapsed_seconds: 357,
    success: true, mcp_calls: 2,
    tokens: { input_fresh: 37, output: 11559, cache_read: 1119692, cache_write: 34390, effective_input: 1119729, total_context: 1131288 },
  },
  {
    id: 'linear-sonnet-sdkmcp',
    tool: 'Linear', model: 'Sonnet', method: 'SDK+MCP',
    elapsed: '6m 07s', elapsed_seconds: 367,
    success: true, mcp_calls: 1,
    tokens: { input_fresh: 48, output: 15075, cache_read: 1522919, cache_write: 43125, effective_input: 1522967, total_context: 1538042 },
  },
  {
    id: 'linear-gpt54-sdkmcp',
    tool: 'Linear', model: 'GPT-5.4', method: 'SDK+MCP',
    elapsed: '9m 20s', elapsed_seconds: 560,
    success: true, mcp_calls: 8,
    tokens: { input_fresh: 101537, output: 1296, cache_read: 100992, cache_write: 0, effective_input: 202529, total_context: 203825 },
  },

  // ── Resend ───────────────────────────────────────────────────────────────────
  {
    id: 'resend-opus-bare',
    tool: 'Resend', model: 'Opus', method: 'Bare',
    elapsed: '5m 36s', elapsed_seconds: 336,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 32, output: 9020, cache_read: 816751, cache_write: 27453, effective_input: 816783, total_context: 825803 },
  },
  {
    id: 'resend-sonnet-bare',
    tool: 'Resend', model: 'Sonnet', method: 'Bare',
    elapsed: '3m 43s', elapsed_seconds: 223,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 19, output: 5165, cache_read: 424247, cache_write: 21511, effective_input: 424266, total_context: 429431 },
  },
  {
    id: 'resend-gpt54-bare',
    tool: 'Resend', model: 'GPT-5.4', method: 'Bare',
    elapsed: '6m 17s', elapsed_seconds: 377,
    success: true, mcp_calls: 2,
    tokens: { input_fresh: 54236, output: 973, cache_read: 54016, cache_write: 0, effective_input: 108252, total_context: 109225 },
  },
  {
    id: 'resend-opus-sdk',
    tool: 'Resend', model: 'Opus', method: 'SDK',
    elapsed: '4m 17s', elapsed_seconds: 257,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 27, output: 6048, cache_read: 630690, cache_write: 23809, effective_input: 630717, total_context: 636765 },
  },
  {
    id: 'resend-sonnet-sdk',
    tool: 'Resend', model: 'Sonnet', method: 'SDK',
    elapsed: '2m 20s', elapsed_seconds: 140,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 23, output: 4357, cache_read: 441039, cache_write: 18765, effective_input: 441062, total_context: 445419 },
  },
  {
    id: 'resend-gpt54-sdk',
    tool: 'Resend', model: 'GPT-5.4', method: 'SDK',
    elapsed: '6m 32s', elapsed_seconds: 392,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 54604, output: 1319, cache_read: 45696, cache_write: 0, effective_input: 100300, total_context: 101619 },
  },
  {
    id: 'resend-opus-sdkmcp',
    tool: 'Resend', model: 'Opus', method: 'SDK+MCP',
    elapsed: '3m 20s', elapsed_seconds: 200,
    success: true, mcp_calls: 1,
    tokens: { input_fresh: 60, output: 5095, cache_read: 457017, cache_write: 23499, effective_input: 457077, total_context: 462172 },
  },
  {
    id: 'resend-sonnet-sdkmcp',
    tool: 'Resend', model: 'Sonnet', method: 'SDK+MCP',
    elapsed: '3m 49s', elapsed_seconds: 229,
    success: true, mcp_calls: 1,
    tokens: { input_fresh: 28, output: 6046, cache_read: 659374, cache_write: 27995, effective_input: 659402, total_context: 665448 },
  },
  {
    id: 'resend-gpt54-sdkmcp',
    tool: 'Resend', model: 'GPT-5.4', method: 'SDK+MCP',
    elapsed: '5m 39s', elapsed_seconds: 339,
    success: true, mcp_calls: 7,
    tokens: { input_fresh: 55854, output: 1345, cache_read: 52864, cache_write: 0, effective_input: 108718, total_context: 110063 },
  },

  // ── Metabase ─────────────────────────────────────────────────────────────────
  {
    id: 'metabase-opus-bare',
    tool: 'Metabase', model: 'Opus', method: 'Bare',
    elapsed: '10m 23s', elapsed_seconds: 623,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 3, output: 27, cache_read: 43404, cache_write: 284, effective_input: 43407, total_context: 43434 },
  },
  {
    id: 'metabase-sonnet-bare',
    tool: 'Metabase', model: 'Sonnet', method: 'Bare',
    elapsed: '8m 18s', elapsed_seconds: 498,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 37, output: 12687, cache_read: 1301249, cache_write: 43679, effective_input: 1301286, total_context: 1313973 },
  },
  {
    id: 'metabase-gpt54-bare',
    tool: 'Metabase', model: 'GPT-5.4', method: 'Bare',
    elapsed: '10m 24s', elapsed_seconds: 624,
    success: true, mcp_calls: 3,
    tokens: { input_fresh: 77579, output: 1884, cache_read: 66432, cache_write: 0, effective_input: 144011, total_context: 145895 },
  },
  {
    id: 'metabase-opus-sdk',
    tool: 'Metabase', model: 'Opus', method: 'SDK',
    elapsed: '10m 51s', elapsed_seconds: 651,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 3, output: 50, cache_read: 56912, cache_write: 1210, effective_input: 56915, total_context: 56965 },
  },
  {
    id: 'metabase-sonnet-sdk',
    tool: 'Metabase', model: 'Sonnet', method: 'SDK',
    elapsed: '18m 21s', elapsed_seconds: 1101,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 261, output: 34543, cache_read: 4858310, cache_write: 78172, effective_input: 4858571, total_context: 4893114 },
  },
  {
    id: 'metabase-gpt54-sdk',
    tool: 'Metabase', model: 'GPT-5.4', method: 'SDK',
    elapsed: '18m 38s', elapsed_seconds: 1118,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 119193, output: 1530, cache_read: 110976, cache_write: 0, effective_input: 230169, total_context: 231699 },
  },
  {
    id: 'metabase-opus-sdkmcp',
    tool: 'Metabase', model: 'Opus', method: 'SDK+MCP',
    elapsed: '6m 50s', elapsed_seconds: 410,
    success: true, mcp_calls: 1,
    tokens: { input_fresh: 46, output: 11477, cache_read: 1409063, cache_write: 35340, effective_input: 1409109, total_context: 1420586 },
  },
  {
    id: 'metabase-sonnet-sdkmcp',
    tool: 'Metabase', model: 'Sonnet', method: 'SDK+MCP',
    elapsed: '11m 24s', elapsed_seconds: 684,
    success: true, mcp_calls: 1,
    tokens: { input_fresh: 60, output: 14014, cache_read: 2025486, cache_write: 44570, effective_input: 2025546, total_context: 2039560 },
  },
  {
    id: 'metabase-gpt54-sdkmcp',
    tool: 'Metabase', model: 'GPT-5.4', method: 'SDK+MCP',
    elapsed: '13m 47s', elapsed_seconds: 827,
    success: true, mcp_calls: 6,
    tokens: { input_fresh: 98732, output: 1366, cache_read: 92544, cache_write: 0, effective_input: 191276, total_context: 192642 },
  },

  // ── PandaDoc ─────────────────────────────────────────────────────────────────
  {
    id: 'pandadoc-opus-bare',
    tool: 'Pandadoc', model: 'Opus', method: 'Bare',
    elapsed: '7m 09s', elapsed_seconds: 429,
    success: false, mcp_calls: 0,
    tokens: { input_fresh: 3, output: 31, cache_read: 44558, cache_write: 533, effective_input: 44561, total_context: 44592 },
  },
  {
    id: 'pandadoc-sonnet-bare',
    tool: 'Pandadoc', model: 'Sonnet', method: 'Bare',
    elapsed: '10m 00s', elapsed_seconds: 600,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 3683, output: 28816, cache_read: 2678839, cache_write: 63885, effective_input: 2682522, total_context: 2711338 },
  },
  {
    id: 'pandadoc-gpt54-bare',
    tool: 'Pandadoc', model: 'GPT-5.4', method: 'Bare',
    elapsed: '13m 52s', elapsed_seconds: 832,
    success: true, mcp_calls: 2,
    tokens: { input_fresh: 135677, output: 1741, cache_read: 131200, cache_write: 0, effective_input: 266877, total_context: 268618 },
  },
  {
    id: 'pandadoc-opus-sdk',
    tool: 'Pandadoc', model: 'Opus', method: 'SDK',
    elapsed: '9m 31s', elapsed_seconds: 571,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 5423, output: 20136, cache_read: 2242453, cache_write: 60966, effective_input: 2247876, total_context: 2268012 },
  },
  {
    id: 'pandadoc-sonnet-sdk',
    tool: 'Pandadoc', model: 'Sonnet', method: 'SDK',
    elapsed: '7m 08s', elapsed_seconds: 428,
    success: false, mcp_calls: 0,
    tokens: { input_fresh: 47, output: 14879, cache_read: 1914405, cache_write: 50692, effective_input: 1914452, total_context: 1929331 },
  },
  {
    id: 'pandadoc-gpt54-sdk',
    tool: 'Pandadoc', model: 'GPT-5.4', method: 'SDK',
    elapsed: '14m 56s', elapsed_seconds: 896,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 118805, output: 1395, cache_read: 117376, cache_write: 0, effective_input: 236181, total_context: 237576 },
  },
  {
    id: 'pandadoc-opus-sdkmcp',
    tool: 'Pandadoc', model: 'Opus', method: 'SDK+MCP',
    elapsed: '8m 57s', elapsed_seconds: 537,
    success: true, mcp_calls: 1,
    tokens: { input_fresh: 430, output: 21704, cache_read: 2244431, cache_write: 64391, effective_input: 2244861, total_context: 2266565 },
  },
  {
    id: 'pandadoc-sonnet-sdkmcp',
    tool: 'Pandadoc', model: 'Sonnet', method: 'SDK+MCP',
    elapsed: '19m 48s', elapsed_seconds: 1188,
    success: true, mcp_calls: 0,
    tokens: { input_fresh: 353, output: 28902, cache_read: 3734415, cache_write: 72148, effective_input: 3734768, total_context: 3763670 },
  },
  {
    id: 'pandadoc-gpt54-sdkmcp',
    tool: 'Pandadoc', model: 'GPT-5.4', method: 'SDK+MCP',
    elapsed: '50m 26s', elapsed_seconds: 3026,
    success: true, mcp_calls: 17,
    tokens: { input_fresh: 177840, output: 1372, cache_read: 177664, cache_write: 0, effective_input: 355504, total_context: 356876 },
  },
]

// ─── Aggregation ──────────────────────────────────────────────────────────────

export interface Aggregate {
  count:            number
  successRate:      number
  avgElapsed:       number
  avgOutput:        number
  avgInputFresh:    number
  avgCacheRead:     number
  avgTotalContext:  number
  totalMcpCalls:    number
  avgMcpCalls:      number
}

export function aggregate(runs: BenchmarkRun[]): Aggregate | null {
  if (!runs.length) return null
  const n = runs.length
  return {
    count:           n,
    successRate:     runs.filter(r => r.success).length / n,
    avgElapsed:      runs.reduce((s, r) => s + r.elapsed_seconds, 0) / n,
    avgOutput:       runs.reduce((s, r) => s + r.tokens.output, 0) / n,
    avgInputFresh:   runs.reduce((s, r) => s + r.tokens.input_fresh, 0) / n,
    avgCacheRead:    runs.reduce((s, r) => s + r.tokens.cache_read, 0) / n,
    avgTotalContext: runs.reduce((s, r) => s + r.tokens.total_context, 0) / n,
    totalMcpCalls:   runs.reduce((s, r) => s + r.mcp_calls, 0),
    avgMcpCalls:     runs.reduce((s, r) => s + r.mcp_calls, 0) / n,
  }
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export const METHOD_COLORS: Record<Method, string> = {
  Bare:      '#94a3b8',
  SDK:       '#3b82f6',
  'SDK+MCP': '#c0392b',
}

export const MODEL_COLORS: Record<Model, string> = {
  Opus:      '#c0392b',
  Sonnet:    '#3b82f6',
  'GPT-5.4': '#059669',
}

export const TOOL_LABELS: Record<Tool, string> = {
  Linear:   'Linear',
  Resend:   'Resend',
  Metabase: 'Metabase',
  Pandadoc: 'PandaDoc',
}

export const TOOL_DIFFICULTY: Record<Tool, number> = {
  Resend:   1,
  Linear:   2,
  Metabase: 3,
  Pandadoc: 3,
}

export const TOOL_DESCRIPTIONS: Record<Tool, string> = {
  Resend:   'Modern transactional email API. Clean docs, official Node.js SDK, widely seen in training data — the best-case baseline.',
  Linear:   'Project management GraphQL API. Comparable documentation quality to Resend, but a meaningful step up in schema complexity.',
  Metabase: 'Self-hosted analytics platform. Sparse training data coverage, session-based auth, and embedding SDK that requires a paid plan.',
  Pandadoc: 'Niche document-signing platform with a large API surface. Limited LLM training data — errors are more likely without live documentation.',
}

export const TOOLS:   Tool[]   = ['Linear', 'Resend', 'Metabase', 'Pandadoc']
export const MODELS:  Model[]  = ['Opus', 'Sonnet', 'GPT-5.4']
export const METHODS: Method[] = ['Bare', 'SDK', 'SDK+MCP']

export function fmtSeconds(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}
