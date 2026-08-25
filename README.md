# [easy cc]

Private project — **Akssh + invited collaborators only.** Do not share code,
screenshots, or the deployed URL outside the team.

Browser-only image color correction: drop an image, tune saturation / gamma /
color tone with three sliders, export full-res PNG. Nothing is ever uploaded —
all pixels stay on the user's device.

**Live:** Vercel auto-deploys `main` (project `auto-cc` until renamed).
**Repo:** github.com/aksshcode/easy-cc

## Working on this repo

Read [`AGENTS.md`](./AGENTS.md) before touching anything — it is the source of
truth for architecture and hard rules. `CLAUDE.md` imports it, so Claude-based
agents pick it up automatically; other tools (Gemini etc.) should be pointed at
the file explicitly.

Non-negotiables, short version:

- bun only (`bun run dev` / `lint` / `build`) — both lint and build must pass
- all processing client-side, zero network calls carrying pixel data
- color math lives only in `src/lib/color.ts`
- don't refactor the worker protocol or template primitives unprompted
- mobile-first Tailwind, zinc palette

## Dev setup

```bash
bun install
bun run dev      # http://localhost:3000
bun run lint     # must be clean
bun run build    # must be clean
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19 + React Compiler · Tailwind v4 ·
framer-motion · Web Worker for pixel processing · TypeScript 5.9 strict.

Note: this Next version has breaking changes vs. older training data — consult
`node_modules/next/dist/docs/` when unsure.

## Architecture

| File | Role |
| --- | --- |
| `src/app/page.tsx` | Landing ↔ Editor switch, owns selected File state |
| `src/components/landing.tsx` | Landing page + window-wide drag & drop |
| `src/components/editor.tsx` | Editor UI, worker lifecycle, canvas render, export |
| `src/components/cc.worker.ts` | Off-main-thread pixel processing |
| `src/lib/color.ts` | Single-source color math (preview + export parity) |

## Deployment

Vercel is connected to this GitHub repo; every push to `main` ships to
production. Rename the Vercel project to `easy-cc` (Settings → General) if you
want the `easy-cc.vercel.app` domain.
