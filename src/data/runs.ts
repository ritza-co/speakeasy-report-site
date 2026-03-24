export interface RunData {
  id: string
  label: string        // short display label
  config: string       // 'Raw HTTP' | 'SDK' | 'SDK + MCP'
  prompt: string       // 'Vague' | 'Precise'
  cacheRead: number
  output: number
  turns: number
  mcpCalls: number
  score: number        // out of 6
}

export const ALL_RUNS: RunData[] = [
  { id: 'vague-raw-api',  label: 'Vague / Raw HTTP',  config: 'Raw HTTP',  prompt: 'Vague',   cacheRead: 111136,   output: 3362,  turns: 6,  mcpCalls: 0, score: 4.5 },
  { id: 'precise-raw-api',label: 'Precise / Raw HTTP', config: 'Raw HTTP',  prompt: 'Precise', cacheRead: 667099,   output: 3959,  turns: 11, mcpCalls: 0, score: 4.0 },
  { id: 'vague-sdk',      label: 'Vague / SDK',        config: 'SDK',       prompt: 'Vague',   cacheRead: 190073,   output: 3690,  turns: 10, mcpCalls: 0, score: 1.5 },
  { id: 'precise-sdk',    label: 'Precise / SDK',      config: 'SDK',       prompt: 'Precise', cacheRead: 247965,   output: 4098,  turns: 12, mcpCalls: 0, score: 4.0 },
  { id: 'vague-sdk-mcp',  label: 'Vague / SDK+MCP',   config: 'SDK + MCP', prompt: 'Vague',   cacheRead: 440644,   output: 5252,  turns: 19, mcpCalls: 4, score: 5.0 },
  { id: 'precise-sdk-mcp',label: 'Precise / SDK+MCP',  config: 'SDK + MCP', prompt: 'Precise', cacheRead: 2238497,  output: 9933,  turns: 55, mcpCalls: 8, score: 5.5 },
]

export const DELTA_ROWS = [
  { config: 'Raw HTTP',  vagueScore: '4.5 / 6', preciseScore: '4.0 / 6', delta: '−0.5', positive: false },
  { config: 'SDK',       vagueScore: '1.5 / 6', preciseScore: '4.0 / 6', delta: '+2.5', positive: true  },
  { config: 'SDK + MCP', vagueScore: '5.0 / 6', preciseScore: '5.5 / 6', delta: '+0.5', positive: true  },
]
