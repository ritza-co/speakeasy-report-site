# Speakeasy Benchmark Report Site

A static site visualizing benchmark results comparing AI agents (Claude Sonnet, Codex) across different API integration modes (bare, SDK, SDK + MCP).

Built with React, TypeScript, Vite, and Tailwind CSS.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

Output is written to `dist/`.

## Deploy on Render

Create a new **Static Site** on Render with the following settings:

| Setting | Value |
|---|---|
| Build command | `pnpm install && pnpm run build` |
| Publish directory | `dist` |

No start command is needed for static sites.
