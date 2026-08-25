<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# [easy cc] — project rules (STRICT)

A minimal, mobile-first, browser-only image color-correction tool. Landing page
with drag & drop → editor with saturation / gamma / color-tone sliders → PNG export.

**You are expected to follow every rule below without exception. If a task seems to
require breaking one, STOP and ask instead of improvising.**

## Hard rules

1. **Package manager is bun. Always.** Never `npm run` / `npm install` / `pnpm`.
   Verify with: `bun run lint` and `bun run build`. Both must pass before you claim
   any work is done. Do not say "done" on an unverified build.
2. **Images never leave the device.** No server routes, no uploads, no analytics,
   no network calls that send pixel data. All processing stays client-side.
3. **Color math lives in exactly one place:** `src/lib/color.ts`. It is imported by
   BOTH the worker and the full-res export path. Never duplicate or fork this logic;
   if the math changes, it changes there only, or preview and export will diverge.
4. **Do not modify the worker protocol** in `src/components/cc.worker.ts` +
   `src/components/editor.tsx` unless explicitly asked. It is race-hardened:
   - main thread never transfers buffers (structured-clone copies only)
   - requests are matched by monotonic `reqIdRef`; stale responses are discarded
   - one in-flight job max; latest pending adjustment wins (`pendingRef` + `busyRef`)
   Naive "simplifications" here reintroduced black-frame bugs before. Leave it alone.
5. **Mobile-first design.** Base styles are for phones (large touch targets,
   min-h-11/min-h-12 buttons). Desktop enhancements go behind `lg:` breakpoints.
6. **Don't touch** `src/components/ui/*`, `src/hooks/*`, `components.json`,
   `tsconfig.json`, `next.config.ts`, or eslint config unless the task is exactly
   about them. They are shared template primitives.
7. **No new dependencies without asking.** Current runtime deps include framer-motion
   (animations), Tailwind v4, Next 16 + React 19 with React Compiler enabled.
8. **Styling:** plain Tailwind zinc-palette classes (`zinc-*`) with `dark:` variants
   matching the existing pages. The shadcn theme tokens (bg-primary, bg-muted…) are
   NOT defined in this template's `globals.css` — do not use them.
9. TypeScript 5.9 generics apply: worker ImageData arrays must be typed
   `Uint8ClampedArray<ArrayBuffer>` where they meet `new ImageData(...)`.
10. Keep code comment-free and minimal. Match existing file style.

## Architecture map

| File | Role |
| --- | --- |
| `src/app/page.tsx` | Client shell: AnimatePresence switch between Landing ↔ Editor, owns selected File state |
| `src/components/landing.tsx` | SaaS landing page; window-wide drag&drop capture; framer-motion animations |
| `src/components/editor.tsx` | Editor UI; owns Worker lifecycle, slider state, canvas rendering, full-res export |
| `src/components/cc.worker.ts` | Off-main-thread pixel processing; receives cloned pixels + adjustments, returns processed clone |
| `src/lib/color.ts` | THE color math (gamma LUT, saturation, tone shift) shared by worker + export |
| `src/app/layout.tsx` | Root layout + metadata ("[easy cc]") |

## Data flow

File dropped on landing → `page.tsx` sets File → `<Editor file>` mounts → loads
image once → builds downscaled preview pixels (≤2048px long side) + hidden
full-res source canvas → slider changes enqueue adjustments → worker processes a
clone → result drawn to visible canvas → Download runs the SAME math from
`color.ts` synchronously at full resolution.

## Verification checklist before finishing any change

```
bun run lint    # must be clean
bun run build   # must be clean
```

Then manually reason through: does the change affect the worker protocol, color
math parity between preview/export, or mobile layout? If yes, re-check those paths.
