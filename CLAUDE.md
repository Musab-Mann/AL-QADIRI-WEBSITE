# Al Qadri Restaurant website

Premium 2D restaurant site. Next.js 16 + TypeScript + CSS Modules + GSAP.

## Hard rules
- **2D only.** No Three.js, React Three Fiber, WebGL, canvas scenes, particles or fake 3D.
- **Menu accuracy.** `src/data/menu.ts` is the only source of menu names and prices, and it must match `docs/MENU_DATA.md` exactly. Never invent, change, remove or "correct" items or prices. Slash prices stay as separate values. `npm run validate` must pass.
- **No invented facts.** No reviews, ratings, awards, history, opening hours, map coordinates or statistics. Missing information is listed in `docs/MISSING_INFO.md` and shown as a clear placeholder or omitted.
- **Copy.** Zero em-dashes or en-dashes in visible text. No AI cliches.
- **Design.** Follow `docs/DESIGN.md` and `docs/DESIGN_TOKENS.md`: one dark theme, one copper accent, 0 radius, Cormorant Garamond + Geist, Phosphor icons.
- **Images.** Filename = dish slug. Never show a photo beside the wrong dish. No generated images of the venue or people.

## Next.js 16
APIs differ from older versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing routes, metadata or config.

## Environment
Node: `C:\WINDOWS\node.exe` (v26). npm/npx: prepend `C:\Users\Dell\Downloads\node-v26.8.2-win-x64\node-v26.8.2-win-x64` to PATH in PowerShell. Git Bash is not available.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
