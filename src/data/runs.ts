export interface RunData {
  id: string
  label: string        // short display label
  config: string       // 'Raw HTTP' | 'SDK' | 'SDK + MCP'
  prompt: string       // 'Simple' | 'Complex'
  cacheRead: number
  output: number
  turns: number
  mcpCalls: number
  score: number        // out of 6
}

export const ALL_RUNS: RunData[] = [
  { id: 'simple-raw-api',  label: 'Simple / Raw HTTP',  config: 'Raw HTTP',  prompt: 'Simple',  cacheRead: 111136,   output: 3362,  turns: 6,  mcpCalls: 0, score: 4.5 },
  { id: 'complex-raw-api', label: 'Complex / Raw HTTP', config: 'Raw HTTP',  prompt: 'Complex', cacheRead: 667099,   output: 3959,  turns: 11, mcpCalls: 0, score: 4.0 },
  { id: 'simple-sdk',      label: 'Simple / SDK',       config: 'SDK',       prompt: 'Simple',  cacheRead: 190073,   output: 3690,  turns: 10, mcpCalls: 0, score: 1.5 },
  { id: 'complex-sdk',     label: 'Complex / SDK',      config: 'SDK',       prompt: 'Complex', cacheRead: 247965,   output: 4098,  turns: 12, mcpCalls: 0, score: 4.0 },
  { id: 'simple-sdk-mcp',  label: 'Simple / SDK+MCP',  config: 'SDK + MCP', prompt: 'Simple',  cacheRead: 440644,   output: 5252,  turns: 19, mcpCalls: 4, score: 5.0 },
  { id: 'complex-sdk-mcp', label: 'Complex / SDK+MCP', config: 'SDK + MCP', prompt: 'Complex', cacheRead: 2238497,  output: 9933,  turns: 55, mcpCalls: 8, score: 5.5 },
]

export const DELTA_ROWS = [
  { config: 'Raw HTTP',  simpleScore: '4.5 / 6', complexScore: '4.0 / 6', delta: '−0.5', positive: false },
  { config: 'SDK',       simpleScore: '1.5 / 6', complexScore: '4.0 / 6', delta: '+2.5', positive: true  },
  { config: 'SDK + MCP', simpleScore: '5.0 / 6', complexScore: '5.5 / 6', delta: '+0.5', positive: true  },
]
