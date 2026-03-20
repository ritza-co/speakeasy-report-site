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

Create a new **Web Service** on Render with the following settings:

| Setting | Value |
|---|---|
| Build command | `pnpm install && pnpm run build` |
| Start command | `pnpm run preview` |
