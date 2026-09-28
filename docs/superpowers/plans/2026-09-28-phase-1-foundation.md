# Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A deployable Next.js static site with the Signal tokens, fonts, motion system, the path-pill nav, the cut-off-wordmark footer, placeholder scenes for all seven sections, content guards and CI.

**Architecture:** Next.js App Router with `output: "export"`. Design tokens live in one TypeScript module and are injected as CSS variables, mapped into Tailwind 4 via `@theme inline`. Pure logic (motion mode, active section, scramble, counters, font fitting, the India clock) lives in `src/lib` with Vitest tests; components are thin. Nav and footer use CSS modules because their motion needs more than utility classes.

**Tech Stack:** Next.js 16.3.6, React 19.2.8, TypeScript 5, Tailwind CSS 4.3.3, GSAP 3.15 with ScrollTrigger, Lenis 1.3.26, Vitest 5.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-28-verastack-labs-site-design.md`. Mockups: `docs/mockups/nav.html`, `docs/mockups/footer.html`.
- Tokens, exact: ink #0B0C0A, surface #1B1D18, line #2A2D25, text #F2F3EE, muted #A3A69B, dim #3B3E35, signal #D4FF3F, alert #FF6B4A. Dark only.
- Fonts: Bricolage Grotesque (variable, optical size axis) and JetBrains Mono 400/500, via `next/font/google` (self-hosted at build).
- Motion modes `full` / `lite` / `static` from one hook; `static` when `prefers-reduced-motion: reduce`.
- Never use the em dash character anywhere (copy, code comments, docs, commit messages). Tests build it from its code point.
- No AI attribution in commits, PR text, comments or docs.
- Commit prefixes: `chore:`, `feat:`, `test:`, `docs:`, `ci:`. Branch: `feat/phase-1-foundation`.
- No placeholder facts on the live site: unknown values (email, Cal.com link, availability) are `null` and their UI is hidden until set.
- Deployment is gated: the deploy job runs only when the repo variable `DEPLOY_ENABLED` is `true` (set in phase 7), so a half-built site is never public.

---

### Task 1: Scaffold the app

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `vitest.config.ts`, `.gitattributes`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Produces: `npm run dev | build | lint | typecheck | test`; path alias `@/*` → `src/*`; static export to `out/`.

- [ ] **Step 1: Branch and install**

```bash
cd verastack-labs.github.io
git checkout -b feat/phase-1-foundation
npm init -y
npm install next@16.3.6 react@19.2.8 react-dom@19.2.8 gsap@^3.15.0 lenis@^1.3.26
npm install -D typescript@^5 @types/node@^22 @types/react@^19 @types/react-dom@^19 tailwindcss@^4.3.3 @tailwindcss/postcss@^4.3.3 eslint@^9 eslint-config-next@16.3.6 vitest@^5.0.2
```

- [ ] **Step 2: Set package.json fields**

Replace the generated `name`, `version`, `scripts` and remove `main`, `keywords`, `author`, `license`, `description`, so the top of `package.json` reads:

```json
{
  "name": "verastack-labs.github.io",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint",
    "typecheck": "next typegen && tsc --noEmit",
    "test": "vitest run --passWithNoTests"
  }
}
```

(keep the `dependencies` and `devDependencies` npm wrote).

- [ ] **Step 3: Config files**

`next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.mts"],
  "exclude": ["node_modules"]
}
```

`eslint.config.mjs`:

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'docs/**']),
])
```

`postcss.config.mjs`:

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

`vitest.config.ts`:

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

`.gitattributes`:

```
* text=auto eol=lf
*.png binary
*.jpg binary
*.webp binary
*.woff2 binary
*.glb binary
```

- [ ] **Step 4: Minimal app**

`src/app/globals.css`:

```css
@import 'tailwindcss';
```

`src/app/layout.tsx`:

```tsx
import type { ReactNode } from 'react'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

`src/app/page.tsx`:

```tsx
export default function Home() {
  return <main id="main">verastack/labs</main>
}
```

- [ ] **Step 5: Verify**

Run: `npm run lint && npm run typecheck && npm test && npm run build`
Expected: all succeed; `out/index.html` exists and contains `verastack/labs`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold the Next.js static site"
```

---

### Task 2: Tokens, contrast test and base styles

**Files:**
- Create: `src/lib/contrast.ts`, `src/lib/contrast.test.ts`, `src/styles/tokens.ts`, `src/styles/tokens.test.ts`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Produces: `tokens` (record of the eight token names to hex), `TokenName`, `tokensToCss(): string`; `contrastRatio(a: string, b: string): number`. Tailwind colour utilities `bg-ink`, `text-text`, `text-muted`, `text-signal`, `bg-surface`, `border-line`, `text-dim`, `text-alert`, `bg-signal`, `text-ink`.

- [ ] **Step 1: Write the failing tests**

`src/lib/contrast.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { contrastRatio, parseHex, relativeLuminance } from '@/lib/contrast'

describe('parseHex', () => {
  it('parses #RRGGBB in any case', () => {
    expect(parseHex('#d4FF3f')).toEqual({ r: 212, g: 255, b: 63 })
  })

  it('rejects anything that is not #RRGGBB', () => {
    expect(() => parseHex('red')).toThrow('Expected #RRGGBB')
    expect(() => parseHex('#FFF')).toThrow('Expected #RRGGBB')
  })
})

describe('relativeLuminance', () => {
  it('is 0 for black and 1 for white', () => {
    expect(relativeLuminance('#000000')).toBe(0)
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5)
  })
})

describe('contrastRatio', () => {
  it('is 21 for black on white and symmetric', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
    expect(contrastRatio('#0B0C0A', '#F2F3EE')).toBeCloseTo(contrastRatio('#F2F3EE', '#0B0C0A'), 10)
  })

  it('matches a known WCAG value', () => {
    expect(contrastRatio('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2)
  })
})
```

`src/styles/tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@/lib/contrast'
import { tokens, tokensToCss } from '@/styles/tokens'

const AA = 4.5

describe('tokens', () => {
  it('are the spec values', () => {
    expect(tokens).toEqual({
      ink: '#0B0C0A',
      surface: '#1B1D18',
      line: '#2A2D25',
      text: '#F2F3EE',
      muted: '#A3A69B',
      dim: '#3B3E35',
      signal: '#D4FF3F',
      alert: '#FF6B4A',
    })
  })

  it.each([
    ['text', 'ink'],
    ['text', 'surface'],
    ['muted', 'ink'],
    ['muted', 'surface'],
    ['signal', 'ink'],
    ['signal', 'surface'],
    ['alert', 'ink'],
    ['ink', 'signal'],
  ] as const)('%s on %s meets AA', (fg, bg) => {
    expect(contrastRatio(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(AA)
  })

  it('writes every token as a CSS variable', () => {
    const css = tokensToCss()
    expect(css.startsWith(':root{')).toBe(true)
    for (const [name, value] of Object.entries(tokens)) expect(css).toContain(`--${name}:${value};`)
  })
})
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npm test`
Expected: FAIL, cannot resolve `@/lib/contrast` and `@/styles/tokens`.

- [ ] **Step 3: Implement**

`src/lib/contrast.ts`:

```ts
export type Rgb = { r: number; g: number; b: number }

export function parseHex(hex: string): Rgb {
  const match = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!match) throw new Error(`Expected #RRGGBB, got ${hex}`)
  const value = parseInt(match[1], 16)
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 }
}

function linearise(channel: number): number {
  const s = channel / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex)
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b)
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}
```

`src/styles/tokens.ts`:

```ts
// The Signal palette (spec 4.2). Dark only. `dim` is for inactive states and is below AA on
// purpose; `static` motion mode swaps it for `muted`.
export const tokens = {
  ink: '#0B0C0A',
  surface: '#1B1D18',
  line: '#2A2D25',
  text: '#F2F3EE',
  muted: '#A3A69B',
  dim: '#3B3E35',
  signal: '#D4FF3F',
  alert: '#FF6B4A',
} as const

export type TokenName = keyof typeof tokens

export function tokensToCss(): string {
  const vars = Object.entries(tokens)
    .map(([name, value]) => `--${name}:${value};`)
    .join('')
  return `:root{${vars}}`
}
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npm test`
Expected: PASS, all contrast and token tests green.

- [ ] **Step 5: Wire tokens into CSS**

`src/app/globals.css`:

```css
@import 'tailwindcss';

@theme inline {
  --color-ink: var(--ink);
  --color-surface: var(--surface);
  --color-line: var(--line);
  --color-text: var(--text);
  --color-muted: var(--muted);
  --color-dim: var(--dim);
  --color-signal: var(--signal);
  --color-alert: var(--alert);

  --font-display: var(--font-bricolage), system-ui, sans-serif;
  --font-body: var(--font-bricolage), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;
}

@layer base {
  html {
    background: var(--ink);
    color: var(--text);
    color-scheme: dark;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: var(--font-body);
  }

  ::selection {
    background: var(--signal);
    color: var(--ink);
  }

  :focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: 3px;
  }
}

/* Inactive states: dim when motion runs, muted when it does not (spec 5.1). */
html[data-motion='static'] {
  --dim: var(--muted);
}
```

In `src/app/layout.tsx`, add the token style tag:

```tsx
import type { ReactNode } from 'react'
import { tokensToCss } from '@/styles/tokens'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: tokensToCss() }} />
      </head>
      <body className="min-h-dvh bg-ink text-text">{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: Verify and commit**

Run: `npm run lint && npm run typecheck && npm test && npm run build`
Expected: all succeed.

```bash
git add -A
git commit -m "feat: add the Signal tokens with a contrast test"
```

---

### Task 3: Fonts, site data, metadata and favicon

**Files:**
- Create: `src/data/site.ts`, `src/app/icon.svg`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `site` with `name`, `url`, `title`, `description`, `email: string | null`, `calLink: string | null`, `availability: string | null`, `githubUrl`, `founderName`, `founderUrl`, `basedIn`. CSS variables `--font-bricolage`, `--font-jetbrains`.

- [ ] **Step 1: Site data**

`src/data/site.ts`:

```ts
// Values the site does not know yet are null; the UI hides anything that depends on them
// (docs/STATUS.md, Waiting on Rigan).
export const site = {
  name: 'VeraStack Labs',
  url: 'https://verastack-labs.github.io',
  title: 'VeraStack Labs: configurators, commerce and launch sites',
  description:
    'A design and engineering studio. We build configurators, commerce and launch sites for clients, and our own products alongside them.',
  email: null as string | null,
  calLink: null as string | null,
  availability: null as string | null,
  githubUrl: 'https://github.com/verastack-labs',
  founderName: 'Rigan Burnwal',
  founderUrl: 'https://riganb.github.io',
  basedIn: 'India',
}
```

- [ ] **Step 2: Favicon**

`src/app/icon.svg` (a signal slash on ink):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0B0C0A"/>
  <path d="M38 12 L26 52" stroke="#D4FF3F" stroke-width="9" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 3: Layout with fonts, metadata and skip link**

`src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import { site } from '@/data/site'
import { tokensToCss } from '@/styles/tokens'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-bricolage',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: { title: site.title, description: site.description, url: site.url, siteName: site.name, type: 'website' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: tokensToCss() }} />
      </head>
      <body className="min-h-dvh bg-ink text-text">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-signal focus:px-3 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verify and commit**

Run: `npm run lint && npm run typecheck && npm test && npm run build`
Expected: all succeed; `out/index.html` contains `<title>VeraStack Labs: configurators, commerce and launch sites</title>` and a `link rel="icon"`.

```bash
git add -A
git commit -m "feat: add fonts, site data, metadata and favicon"
```

---

### Task 4: Sections, products data and content guards

**Files:**
- Create: `src/data/sections.ts`, `src/data/products.ts`, `src/data/content.test.ts`

**Interfaces:**
- Consumes: `site` (Task 3).
- Produces: `sections: readonly Section[]` where `Section = { id: string; path: string; label: string }`, in order `top, services, work, products, process, about, contact`; `products: Product[]` where `Product = { name: string; platform: string; url: string | null; status: 'live' | 'coming-soon' }`.

- [ ] **Step 1: Write the failing test**

`src/data/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { site } from '@/data/site'
import { sections } from '@/data/sections'
import { products } from '@/data/products'

// Built from its code point so this file never contains the character itself.
const EM_DASH = String.fromCodePoint(0x2014)

// Add every data module here as it is created.
const modules: Record<string, unknown> = { site, sections, products }

function collectStrings(value: unknown, path: string): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]]
  if (Array.isArray(value)) return value.flatMap((item, i) => collectStrings(item, `${path}[${i}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, `${path}.${key}`))
  }
  return []
}

const strings = Object.entries(modules).flatMap(([name, value]) => collectStrings(value, name))

describe('content', () => {
  it('has strings to check', () => {
    expect(strings.length).toBeGreaterThan(20)
  })

  it('never uses an em dash', () => {
    const offenders = strings.filter(([, s]) => s.includes(EM_DASH)).map(([p]) => p)
    expect(offenders).toEqual([])
  })

  it('lists the seven sections in page order, each path matching its id', () => {
    expect(sections.map((s) => s.id)).toEqual(['top', 'services', 'work', 'products', 'process', 'about', 'contact'])
    for (const s of sections) expect(s.path).toBe(s.id === 'top' ? '/' : `/${s.id}`)
  })

  it('links live products and leaves coming-soon products unlinked', () => {
    for (const p of products) {
      if (p.status === 'live') expect(p.url).toMatch(/^https:\/\//)
      else expect(p.url).toBeNull()
    }
  })
})
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test`
Expected: FAIL, cannot resolve `@/data/sections` and `@/data/products`.

- [ ] **Step 3: Implement the data**

`src/data/sections.ts`:

```ts
export type Section = { id: string; path: string; label: string }

// Page order. `path` is what the nav pill shows; `id` is the element id each scene renders.
export const sections: readonly Section[] = [
  { id: 'top', path: '/', label: 'home' },
  { id: 'services', path: '/services', label: 'services' },
  { id: 'work', path: '/work', label: 'work' },
  { id: 'products', path: '/products', label: 'products' },
  { id: 'process', path: '/process', label: 'process' },
  { id: 'about', path: '/about', label: 'about' },
  { id: 'contact', path: '/contact', label: 'contact' },
]
```

`src/data/products.ts`:

```ts
export type Product = {
  name: string
  platform: string
  url: string | null
  status: 'live' | 'coming-soon'
}

// Extended with palettes, pitches and mockups in phase 4 (spec 6.04).
export const products: Product[] = [
  { name: 'rigseed', platform: 'Desktop · Tauri', url: 'https://verastack-labs.github.io/rigseed/', status: 'live' },
  { name: 'Riggit', platform: 'Desktop · Tauri', url: 'https://verastack-labs.github.io/riggit/', status: 'live' },
  { name: 'Mehfil', platform: 'Progressive web app', url: null, status: 'coming-soon' },
]
```

- [ ] **Step 4: Run to see it pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add section and product data with content guards"
```

---

### Task 5: Motion system

**Files:**
- Create: `src/lib/motion/mode.ts`, `src/lib/motion/mode.test.ts`, `src/lib/motion/use-motion-preference.ts`, `src/lib/motion/smooth-scroll.tsx`, `src/lib/motion/motion-attribute.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `type MotionMode = 'full' | 'lite' | 'static'`; `type MotionInputs = { reducedMotion: boolean; finePointer: boolean; wide: boolean; webgl: boolean; cores?: number; memoryGb?: number }`; `resolveMotionMode(inputs: MotionInputs): MotionMode`; `useMotionPreference(): MotionMode` (server snapshot `'static'`); `<SmoothScroll />`; `<MotionAttribute />` which sets `html[data-motion]`.

- [ ] **Step 1: Write the failing test**

`src/lib/motion/mode.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { resolveMotionMode, type MotionInputs } from '@/lib/motion/mode'

const desktop: MotionInputs = { reducedMotion: false, finePointer: true, wide: true, webgl: true, cores: 8, memoryGb: 8 }

describe('resolveMotionMode', () => {
  it('is full on a capable desktop', () => {
    expect(resolveMotionMode(desktop)).toBe('full')
  })

  it('is static whenever reduced motion is asked for, even on a capable desktop', () => {
    expect(resolveMotionMode({ ...desktop, reducedMotion: true })).toBe('static')
  })

  it('is lite on touch or narrow screens', () => {
    expect(resolveMotionMode({ ...desktop, finePointer: false })).toBe('lite')
    expect(resolveMotionMode({ ...desktop, wide: false })).toBe('lite')
  })

  it('is lite on weak devices or without WebGL', () => {
    expect(resolveMotionMode({ ...desktop, webgl: false })).toBe('lite')
    expect(resolveMotionMode({ ...desktop, cores: 2 })).toBe('lite')
    expect(resolveMotionMode({ ...desktop, memoryGb: 2 })).toBe('lite')
  })

  it('treats unknown cores and memory as capable', () => {
    expect(resolveMotionMode({ ...desktop, cores: undefined, memoryGb: undefined })).toBe('full')
  })
})
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- src/lib/motion/mode.test.ts`
Expected: FAIL, cannot resolve `@/lib/motion/mode`.

- [ ] **Step 3: Implement the pure resolver**

`src/lib/motion/mode.ts`:

```ts
export type MotionMode = 'full' | 'lite' | 'static'

export type MotionInputs = {
  reducedMotion: boolean
  finePointer: boolean
  wide: boolean
  webgl: boolean
  cores?: number
  memoryGb?: number
}

export const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
export const FINE_QUERY = '(hover: hover) and (pointer: fine)'
export const WIDE_QUERY = '(min-width: 1024px)'

// Spec 5.1: static for reduced motion; full only for a capable desktop; lite for everything else.
export function resolveMotionMode(i: MotionInputs): MotionMode {
  if (i.reducedMotion) return 'static'
  const weak = !i.webgl || (i.cores !== undefined && i.cores < 4) || (i.memoryGb !== undefined && i.memoryGb < 4)
  return i.finePointer && i.wide && !weak ? 'full' : 'lite'
}
```

- [ ] **Step 4: Run to see it pass**

Run: `npm test -- src/lib/motion/mode.test.ts`
Expected: PASS.

- [ ] **Step 5: The hook, smooth scroll and the html attribute**

`src/lib/motion/use-motion-preference.ts`:

```ts
'use client'

import { useSyncExternalStore } from 'react'
import { FINE_QUERY, REDUCED_QUERY, WIDE_QUERY, resolveMotionMode, type MotionMode } from '@/lib/motion/mode'

let webglCache: boolean | undefined
function hasWebGL(): boolean {
  if (webglCache === undefined) {
    try {
      webglCache = !!document.createElement('canvas').getContext('webgl')
    } catch {
      webglCache = false
    }
  }
  return webglCache
}

function read(): MotionMode {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return resolveMotionMode({
    reducedMotion: matchMedia(REDUCED_QUERY).matches,
    finePointer: matchMedia(FINE_QUERY).matches,
    wide: matchMedia(WIDE_QUERY).matches,
    webgl: hasWebGL(),
    cores: nav.hardwareConcurrency || undefined,
    memoryGb: nav.deviceMemory,
  })
}

function subscribe(onChange: () => void): () => void {
  const lists = [REDUCED_QUERY, FINE_QUERY, WIDE_QUERY].map((q) => matchMedia(q))
  lists.forEach((l) => l.addEventListener('change', onChange))
  return () => lists.forEach((l) => l.removeEventListener('change', onChange))
}

// The server renders the static state; the client upgrades after hydration.
export function useMotionPreference(): MotionMode {
  return useSyncExternalStore(subscribe, read, () => 'static')
}
```

`src/lib/motion/smooth-scroll.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'

gsap.registerPlugin(ScrollTrigger)

// One Lenis instance drives ScrollTrigger (spec 5.2). None in static mode.
export function SmoothScroll() {
  const mode = useMotionPreference()

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true })
    if (mode === 'static') return

    const lenis = new Lenis({ anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [mode])

  return null
}
```

`src/lib/motion/motion-attribute.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'

// Exposes the mode to CSS as html[data-motion] (globals.css swaps dim for muted in static).
export function MotionAttribute() {
  const mode = useMotionPreference()
  useEffect(() => {
    document.documentElement.dataset.motion = mode
  }, [mode])
  return null
}
```

In `src/app/layout.tsx`, import both and render them first inside `<body>`, after the skip link:

```tsx
import { MotionAttribute } from '@/lib/motion/motion-attribute'
import { SmoothScroll } from '@/lib/motion/smooth-scroll'
```

```tsx
        <MotionAttribute />
        <SmoothScroll />
        {children}
```

- [ ] **Step 6: Verify and commit**

Run: `npm run lint && npm run typecheck && npm test && npm run build`
Expected: all succeed.

```bash
git add -A
git commit -m "feat: add motion modes, Lenis smooth scroll and the motion attribute"
```

---

### Task 6: Scramble text and counters

**Files:**
- Create: `src/lib/scramble.ts`, `src/lib/scramble.test.ts`, `src/lib/counter.ts`, `src/lib/counter.test.ts`

**Interfaces:**
- Produces: `SCRAMBLE_CHARS: string`; `scrambleFrame(text: string, progress: number, random?: () => number): string`; `formatCounter(index: number, last: number): string` (for example `formatCounter(2, 6) === '02/06'`).

- [ ] **Step 1: Write the failing tests**

`src/lib/scramble.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { SCRAMBLE_CHARS, scrambleFrame } from '@/lib/scramble'

const zero = () => 0

describe('scrambleFrame', () => {
  it('is fully scrambled at the start and keeps the length', () => {
    const frame = scrambleFrame('/services', 0, zero)
    expect(frame).toHaveLength('/services'.length)
    expect(frame.slice(1)).not.toContain('s')
  })

  it('is the real text at the end', () => {
    expect(scrambleFrame('/services', 1, zero)).toBe('/services')
  })

  it('resolves left to right', () => {
    expect(scrambleFrame('abcd', 0.5, zero).slice(0, 2)).toBe('ab')
    expect(scrambleFrame('abcd', 0.5, zero).slice(2)).not.toContain('c')
  })

  it('never scrambles slashes, spaces or punctuation', () => {
    const frame = scrambleFrame('/a b', 0, zero)
    expect(frame[0]).toBe('/')
    expect(frame[2]).toBe(' ')
  })

  it('draws scrambled characters from the charset', () => {
    for (const char of scrambleFrame('abc', 0, () => 0.999)) expect(SCRAMBLE_CHARS).toContain(char)
  })
})
```

`src/lib/counter.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { formatCounter } from '@/lib/counter'

describe('formatCounter', () => {
  it('pads both numbers to two digits', () => {
    expect(formatCounter(2, 6)).toBe('02/06')
    expect(formatCounter(0, 6)).toBe('00/06')
  })

  it('clamps out-of-range indices', () => {
    expect(formatCounter(-1, 6)).toBe('00/06')
    expect(formatCounter(9, 6)).toBe('06/06')
  })
})
```

- [ ] **Step 2: Run to see them fail**

Run: `npm test`
Expected: FAIL, cannot resolve `@/lib/scramble` and `@/lib/counter`.

- [ ] **Step 3: Implement**

`src/lib/scramble.ts`:

```ts
// Glyphs from the brand mockups: code-like, never letters, so a scrambling label reads as decoding.
export const SCRAMBLE_CHARS = '!<>-_[]{}=+*^?#'

// One frame of a decoding label: characters before `progress` (0 to 1) show for real, the rest
// are random glyphs. Slashes, spaces and punctuation stay put so the path keeps its shape.
export function scrambleFrame(text: string, progress: number, random: () => number = Math.random): string {
  const resolved = Math.floor(text.length * Math.min(Math.max(progress, 0), 1))
  return [...text]
    .map((char, index) => {
      if (index < resolved || !/[\p{L}\p{N}]/u.test(char)) return char
      return SCRAMBLE_CHARS[Math.floor(random() * SCRAMBLE_CHARS.length)]
    })
    .join('')
}
```

`src/lib/counter.ts`:

```ts
const pad = (n: number) => String(n).padStart(2, '0')

// The nav pill's position readout, "02/06".
export function formatCounter(index: number, last: number): string {
  return `${pad(Math.min(Math.max(index, 0), last))}/${pad(last)}`
}
```

- [ ] **Step 4: Run to see them pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add scramble frames and the section counter"
```

---

### Task 7: Placeholder scenes and active-section tracking

**Files:**
- Create: `src/lib/active-section.ts`, `src/lib/active-section.test.ts`, `src/components/nav/use-active-section.ts`, `src/components/scene-placeholder.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `sections` (Task 4).
- Produces: `PROBE_Y = 60`; `activeIndex(tops: number[], probe: number): number`; `useActiveSection(ids: readonly string[]): { index: number; theme: 'dark' | 'light' }` (theme from the active element's `data-nav-theme`); `<ScenePlaceholder id label title navTheme? />`. Every scene element carries `id` and optional `data-nav-theme="light"` (the Products hand-over sets it on itself in phase 4 while Mehfil's cream is showing).

- [ ] **Step 1: Write the failing test**

`src/lib/active-section.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { activeIndex } from '@/lib/active-section'

describe('activeIndex', () => {
  const tops = [0, 800, 1600, 2400]

  it('is the last section whose top is at or above the probe', () => {
    expect(activeIndex(tops.map((t) => t - 0), 60)).toBe(0)
    expect(activeIndex(tops.map((t) => t - 800), 60)).toBe(1)
    expect(activeIndex(tops.map((t) => t - 1700), 60)).toBe(2)
  })

  it('switches exactly when a top crosses the probe', () => {
    expect(activeIndex(tops.map((t) => t - 740), 60)).toBe(1)
    expect(activeIndex(tops.map((t) => t - 739), 60)).toBe(0)
  })

  it('is 0 above the first section and for an empty list', () => {
    expect(activeIndex([100, 900], 60)).toBe(0)
    expect(activeIndex([], 60)).toBe(0)
  })
})
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- src/lib/active-section.test.ts`
Expected: FAIL, cannot resolve `@/lib/active-section`.

- [ ] **Step 3: Implement the pure function**

`src/lib/active-section.ts`:

```ts
// The nav decides the current section with a probe line this far below the top (spec 6.00).
export const PROBE_Y = 60

// `tops` are each section's top edge relative to the viewport, in page order.
export function activeIndex(tops: number[], probe: number): number {
  let index = 0
  tops.forEach((top, i) => {
    if (top <= probe) index = i
  })
  return index
}
```

- [ ] **Step 4: Run to see it pass**

Run: `npm test -- src/lib/active-section.test.ts`
Expected: PASS.

- [ ] **Step 5: The hook**

`src/components/nav/use-active-section.ts`:

```ts
'use client'

import { useEffect, useState } from 'react'
import { PROBE_Y, activeIndex } from '@/lib/active-section'

export type NavTheme = 'dark' | 'light'

export function useActiveSection(ids: readonly string[]): { index: number; theme: NavTheme } {
  const [state, setState] = useState<{ index: number; theme: NavTheme }>({ index: 0, theme: 'dark' })

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const els = ids.map((id) => document.getElementById(id))
      const tops = els.map((el) => (el ? el.getBoundingClientRect().top : Number.POSITIVE_INFINITY))
      const index = activeIndex(tops, PROBE_Y)
      const theme: NavTheme = els[index]?.dataset.navTheme === 'light' ? 'light' : 'dark'
      setState((prev) => (prev.index === index && prev.theme === theme ? prev : { index, theme }))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Scenes change their own data-nav-theme (the Products hand-over); watch for it.
    const observer = new MutationObserver(schedule)
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el, { attributes: true, attributeFilter: ['data-nav-theme'] })
    })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ids])

  return state
}
```

- [ ] **Step 6: Placeholder scene and page**

`src/components/scene-placeholder.tsx`:

```tsx
// Stands in for a scene until its phase lands. Carries the id the nav tracks.
export function ScenePlaceholder({
  id,
  label,
  title,
  navTheme,
}: {
  id: string
  label: string
  title: string
  navTheme?: 'light'
}) {
  return (
    <section
      id={id}
      data-nav-theme={navTheme}
      className="flex min-h-dvh flex-col justify-center border-b border-line px-6 pt-24 md:px-10"
    >
      <p className="font-mono text-[11px] text-muted">
        {label} <span className="text-signal">//</span> in progress
      </p>
      <h2 className="mt-3 max-w-[14ch] text-[clamp(40px,7vw,96px)] font-extrabold leading-[0.9] tracking-[-0.055em] [font-variation-settings:'opsz'_96]">
        {title}
      </h2>
    </section>
  )
}
```

`src/app/page.tsx`:

```tsx
import { ScenePlaceholder } from '@/components/scene-placeholder'

export default function Home() {
  return (
    <main id="main">
      <ScenePlaceholder id="top" label="/" title="Configurators, commerce and the sites that launch them." />
      <ScenePlaceholder id="services" label="/services" title="Services" />
      <ScenePlaceholder id="work" label="/work" title="Our founder has worked with" />
      <ScenePlaceholder id="products" label="/products" title="And we build our own" />
      <ScenePlaceholder id="process" label="/process" title="How we work" />
      <ScenePlaceholder id="about" label="/about" title="Design and engineering. One studio." />
      <ScenePlaceholder id="contact" label="/contact" title="Let's build something." />
    </main>
  )
}
```

- [ ] **Step 7: Verify and commit**

Run: `npm run lint && npm run typecheck && npm test && npm run build`
Expected: all succeed; `out/index.html` contains `id="services"` through `id="contact"`.

```bash
git add -A
git commit -m "feat: add placeholder scenes and active-section tracking"
```

---

### Task 8: The nav (path pill)

**Files:**
- Create: `src/components/nav/site-header.tsx`, `src/components/nav/path-pill.tsx`, `src/components/nav/path-pill.module.css`, `src/components/nav/use-scramble.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `sections` (Task 4), `useActiveSection` (Task 7), `scrambleFrame` (Task 6), `formatCounter` (Task 6), `useMotionPreference` (Task 5), `site.calLink` (Task 3).
- Produces: `<SiteHeader />` rendered once in the layout.

Behaviour (spec 6.00, mockup `docs/mockups/nav.html`): wordmark left; path pill; "Start a project" to `#contact` at every width. Fine pointers: hover or focus-within opens the dock row (measured widths), the signal highlight sits on the current section, folds back 260 ms after the pointer leaves, Escape closes. Touch (`(hover: none)`): tapping the pill toggles a vertical panel under the header with every section by number and name; picking one or tapping outside closes it. Light theme: `data-theme="light"` on the header switches to ink and vermilion. Static mode: no scramble, no stagger, no width animation.

- [ ] **Step 1: The scramble hook**

`src/components/nav/use-scramble.ts`:

```ts
'use client'

import { useEffect, useRef } from 'react'
import { scrambleFrame } from '@/lib/scramble'

const DURATION_MS = 480
const FRAME_MS = 40

// Writes a decoding animation into the returned element whenever `text` changes.
export function useScramble<T extends HTMLElement>(text: string, enabled: boolean) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!enabled) {
      el.textContent = text
      return
    }
    const start = performance.now()
    let timer = 0
    const step = () => {
      const progress = (performance.now() - start) / DURATION_MS
      el.textContent = scrambleFrame(text, progress)
      if (progress < 1) timer = window.setTimeout(step, FRAME_MS)
    }
    step()
    return () => window.clearTimeout(timer)
  }, [text, enabled])
  return ref
}
```

- [ ] **Step 2: Styles**

`src/components/nav/path-pill.module.css`:

```css
.header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  color: var(--text);
  pointer-events: none;
  --pill-bg: rgba(11, 12, 10, 0.72);
  --pill-line: var(--line);
  --hi: var(--signal);
  --hi-ink: var(--ink);
  --path: var(--signal);
  --idle: var(--muted);
  transition: color 0.35s;
}
.header > * { pointer-events: auto; }
.header[data-theme='light'] {
  color: #1a1410;
  --pill-bg: rgba(244, 235, 218, 0.82);
  --pill-line: rgba(26, 20, 16, 0.2);
  --hi: #1a1410;
  --hi-ink: #f4ebda;
  --path: #b93e29;
  --idle: #5b4d42;
}
.wordmark { font-weight: 800; font-size: 17px; letter-spacing: -0.04em; white-space: nowrap; padding-top: 9px; color: inherit; text-decoration: none; }
.wordmark em { font-style: normal; color: var(--path); }
.header:not([data-theme='light']) .wordmark em { color: var(--signal); }
.wordmark span { font-weight: 500; opacity: 0.55; }

.nav { position: relative; margin-left: auto; }
.pill {
  position: relative;
  height: 42px;
  border-radius: 999px;
  border: 1px solid var(--pill-line);
  background: var(--pill-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
  transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.35s, border-color 0.35s;
}
.path {
  position: absolute;
  inset: 0 auto 0 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 0 16px;
  white-space: nowrap;
  background: none;
  border: 0;
  color: inherit;
  cursor: pointer;
  transition: opacity 0.25s, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.seg { font: 500 12.5px var(--font-mono); color: var(--path); min-width: 9ch; text-align: left; }
.count { font: 400 11px var(--font-mono); opacity: 0.55; }
.caret {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 500 11px var(--font-mono);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.row {
  position: absolute; inset: 0 auto 0 0;
  display: flex; align-items: center; gap: 2px; padding: 0 4px;
  list-style: none; margin: 0; white-space: nowrap;
  pointer-events: none;
}
.row a {
  position: relative; z-index: 1;
  display: flex; align-items: baseline; gap: 6px;
  padding: 8px 12px; border-radius: 999px;
  font: 500 12px var(--font-mono); color: var(--idle); text-decoration: none;
  opacity: 0; transform: translateY(6px);
  transition: opacity 0.25s, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), color 0.25s;
  transition-delay: calc(var(--i) * 40ms);
}
.row a small { font-size: 10px; opacity: 0.6; }
.row a:hover, .row a:focus-visible { color: inherit; }
.row a[aria-current='true'] { color: var(--hi-ink); }
.highlight {
  list-style: none;
  position: absolute; top: 4px; bottom: 4px; left: 0; width: 0;
  border-radius: 999px; background: var(--hi); opacity: 0;
  transition: left 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s 0.1s, background 0.35s;
}
.open .path { opacity: 0; transform: translateX(-14px); pointer-events: none; }
.open .row { pointer-events: auto; }
.open .row a { opacity: 1; transform: none; }
.open .highlight { opacity: 1; }

.cta {
  flex: none; margin-left: 10px;
  background: var(--hi); color: var(--hi-ink);
  border-radius: 999px; padding: 10px 15px;
  font: 600 13px var(--font-body); white-space: nowrap; text-decoration: none;
}
.header:not([data-theme='light']) .cta { background: var(--signal); color: var(--ink); }

/* Touch: the pill stays a path; a vertical panel lists every section by name. */
.panel {
  position: fixed; left: 14px; right: 14px; top: 66px; z-index: 49;
  border-radius: 18px; border: 1px solid var(--pill-line);
  background: color-mix(in srgb, var(--ink) 94%, transparent);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  padding: 8px; display: grid; gap: 2px;
  transform-origin: top center; transform: translateY(-8px) scaleY(0.96); opacity: 0; pointer-events: none;
  transition: opacity 0.25s, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.panelOpen { opacity: 1; transform: none; pointer-events: auto; }
.panel a {
  display: flex; align-items: baseline; gap: 12px; padding: 12px 14px; border-radius: 12px;
  color: var(--text); text-decoration: none; font-weight: 700; font-size: 22px; letter-spacing: -0.04em;
  opacity: 0; transform: translateY(-6px);
  transition: opacity 0.25s, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.2s;
  transition-delay: calc(0.05s + var(--i) * 40ms);
}
.panel a small { font: 500 11px var(--font-mono); color: var(--muted); letter-spacing: 0; min-width: 18px; }
.panel a[aria-current='true'] { background: var(--signal); color: var(--ink); }
.panel a[aria-current='true'] small { color: var(--ink); }
.panelOpen a { opacity: 1; transform: none; }
.panelFoot { display: flex; justify-content: space-between; padding: 10px 14px 6px; margin-top: 6px; border-top: 1px solid var(--line); font: 400 11px var(--font-mono); color: var(--muted); text-decoration: none; }
.panelFoot b { color: var(--signal); font-weight: 500; }
.header[data-theme='light'] .panel { background: rgba(244, 235, 218, 0.96); border-color: rgba(26, 20, 16, 0.2); }
.header[data-theme='light'] .panel a { color: #1a1410; }
.header[data-theme='light'] .panel a small { color: #5b4d42; }
.header[data-theme='light'] .panel a[aria-current='true'] { background: #1a1410; color: #f4ebda; }
.header[data-theme='light'] .panel a[aria-current='true'] small { color: #f4ebda; }
.touch.open .caret { transform: rotate(180deg); }
.touch .path { opacity: 1; transform: none; pointer-events: auto; }
.touch .row { display: none; }

@media (max-width: 640px) {
  .header { padding: 14px; }
  .wordmark span { display: none; }
  .count { display: none; }
  .cta { padding: 10px 12px; font-size: 12px; margin-left: 8px; }
}

/* Static motion mode: no stagger, no width or slide animation. */
:global(html[data-motion='static']) .pill,
:global(html[data-motion='static']) .row a,
:global(html[data-motion='static']) .path,
:global(html[data-motion='static']) .panel,
:global(html[data-motion='static']) .panel a,
:global(html[data-motion='static']) .highlight {
  transition: none;
}
```

- [ ] **Step 3: The pill**

`src/components/nav/path-pill.tsx`:

```tsx
'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { sections } from '@/data/sections'
import { site } from '@/data/site'
import { formatCounter } from '@/lib/counter'
import { useMotionPreference } from '@/lib/motion/use-motion-preference'
import { useActiveSection } from '@/components/nav/use-active-section'
import { useScramble } from '@/components/nav/use-scramble'
import styles from '@/components/nav/path-pill.module.css'

const IDS = sections.map((s) => s.id)
const LAST = sections.length - 1
const CLOSE_DELAY_MS = 260

function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    const list = matchMedia('(hover: none)')
    const update = () => setTouch(list.matches)
    update()
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [])
  return touch
}

export function PathPill({ onTheme }: { onTheme: (theme: 'dark' | 'light') => void }) {
  const { index, theme } = useActiveSection(IDS)
  const mode = useMotionPreference()
  const touch = useIsTouch()
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(0)
  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<HTMLButtonElement>(null)
  const rowRef = useRef<HTMLUListElement>(null)
  const highlightRef = useRef<HTMLLIElement>(null)
  const segRef = useScramble<HTMLSpanElement>(sections[index].path, mode !== 'static')

  useEffect(() => onTheme(theme), [theme, onTheme])

  // Widths are measured so the morph always fits its content (spec 6.00).
  useLayoutEffect(() => {
    const pill = pillRef.current
    const path = pathRef.current
    const row = rowRef.current
    if (!pill || !path || !row) return
    const wide = open && !touch
    pill.style.width = `${wide ? row.scrollWidth : path.scrollWidth}px`
    const current = row.querySelector<HTMLElement>('a[aria-current="true"]')
    const hi = highlightRef.current
    if (hi && current) {
      hi.style.left = `${current.offsetLeft}px`
      hi.style.width = `${current.offsetWidth}px`
    }
  }, [open, touch, index])

  const openNow = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }, [])
  const closeSoon = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      if (!navRef.current?.contains(document.activeElement)) setOpen(false)
    }, CLOSE_DELAY_MS)
  }, [])

  // Touch: a tap outside closes the panel.
  useEffect(() => {
    if (!touch || !open) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!navRef.current?.contains(target) && !document.getElementById('section-panel')?.contains(target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [touch, open])

  const pick = () => setOpen(false)

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Sections"
        className={`${styles.nav} ${open ? styles.open : ''} ${touch ? styles.touch : ''}`}
        onPointerEnter={touch ? undefined : openNow}
        onPointerLeave={touch ? undefined : closeSoon}
        onFocus={touch ? undefined : openNow}
        onBlur={(e) => {
          if (!touch && !navRef.current?.contains(e.relatedTarget as Node)) closeSoon()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
            pathRef.current?.focus()
          }
        }}
      >
        <div ref={pillRef} className={styles.pill}>
          <button
            ref={pathRef}
            type="button"
            className={styles.path}
            aria-expanded={open}
            aria-controls={touch ? 'section-panel' : 'section-row'}
            onClick={() => (touch ? setOpen((v) => !v) : openNow())}
          >
            <span className="sr-only">Current section: {sections[index].label}. Show all sections</span>
            <span ref={segRef} className={styles.seg} aria-hidden="true">
              {sections[index].path}
            </span>
            <span className={styles.count} aria-hidden="true">
              {formatCounter(index, LAST)}
            </span>
            <span className={styles.caret} aria-hidden="true">
              ▾
            </span>
          </button>
          <ul id="section-row" ref={rowRef} className={styles.row}>
            <li ref={highlightRef} className={styles.highlight} aria-hidden="true" />
            {sections.slice(1).map((s, i) => (
              <li key={s.id} style={{ display: 'contents' }}>
                <a
                  href={`#${s.id}`}
                  aria-current={i + 1 === index}
                  tabIndex={open && !touch ? 0 : -1}
                  style={{ '--i': i } as CSSProperties}
                  onClick={pick}
                >
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {touch && (
        <div id="section-panel" className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={i === index}
              style={{ '--i': i } as CSSProperties}
              onClick={pick}
            >
              <small>{String(i).padStart(2, '0')}</small>
              {s.label}
            </a>
          ))}
          {site.calLink && (
            <a className={styles.panelFoot} href={site.calLink} target="_blank" rel="noreferrer">
              book a 20-min call <b>↗</b>
            </a>
          )}
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 4: The header**

`src/components/nav/site-header.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { PathPill } from '@/components/nav/path-pill'
import styles from '@/components/nav/path-pill.module.css'

export function SiteHeader() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  return (
    <header className={styles.header} data-theme={theme}>
      <a className={styles.wordmark} href="#top" aria-label="VeraStack Labs, back to top">
        verastack<em>/</em>
        <span>labs</span>
      </a>
      <PathPill onTheme={setTheme} />
      <a className={styles.cta} href="#contact">
        Start a project
      </a>
    </header>
  )
}
```

The touch panel is rendered by `PathPill` inside the header, so its light-theme rules use the descendant selector `.header[data-theme='light'] .panel`.

- [ ] **Step 5: Render it**

In `src/app/layout.tsx`, import `SiteHeader` and render it after `<SmoothScroll />`:

```tsx
import { SiteHeader } from '@/components/nav/site-header'
```

```tsx
        <MotionAttribute />
        <SmoothScroll />
        <SiteHeader />
        {children}
```

- [ ] **Step 6: Verify in the browser**

Run: `npm run lint && npm run typecheck && npm test && npm run build`, then start the dev server (`npm run dev`) and check at 1280 px and 390 px (touch emulation):
- Scrolling updates the path (`/services`, `/work` …) and the counter (`01/06` …).
- Hovering the pill opens the row with the highlight on the current section; leaving folds it back after about a quarter second; Tab into the pill opens it, Escape closes it.
- Setting `document.getElementById('products').dataset.navTheme = 'light'` while Products is in view switches the header to ink and vermilion.
- At 390 px with touch, tapping the pill opens the vertical panel with all seven names, the current one filled; picking a section scrolls there and closes it; tapping outside closes it.
- With reduced motion emulated, the path swaps without decoding.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add the path-pill nav with the hover dock and touch panel"
```

---

### Task 9: The footer

**Files:**
- Create: `src/lib/fit.ts`, `src/lib/fit.test.ts`, `src/lib/india-time.ts`, `src/lib/india-time.test.ts`, `src/components/footer/site-footer.tsx`, `src/components/footer/giant-wordmark.tsx`, `src/components/footer/india-clock.tsx`, `src/components/footer/footer.module.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `site`, `products` (Tasks 3, 4), `useMotionPreference` (Task 5).
- Produces: `fitFontSize(boxWidth: number, widthAt100: number): number`; `clipHeight(fontSize: number, cut: number): number`; `WORDMARK_CUT = 0.4`; `formatIndiaTime(date: Date): string`; `<SiteFooter />`.

- [ ] **Step 1: Write the failing tests**

`src/lib/fit.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { WORDMARK_CUT, clipHeight, fitFontSize } from '@/lib/fit'

describe('fitFontSize', () => {
  it('scales the 100px measurement to fill the box, with a hair of slack', () => {
    expect(fitFontSize(1129, 586)).toBeCloseTo((100 * 1129) / 586 * 0.995, 5)
  })

  it('returns 0 for an unmeasured word', () => {
    expect(fitFontSize(1000, 0)).toBe(0)
  })
})

describe('clipHeight', () => {
  it('keeps the uncut share of the letter height plus a small top margin', () => {
    expect(clipHeight(200, 0.4)).toBeCloseTo(200 * 0.74 * 0.6 + 200 * 0.06, 5)
  })

  it('shows the whole letter height at no cut', () => {
    expect(clipHeight(100, 0)).toBeCloseTo(80, 5)
  })

  it('uses a 40% cut for the footer (spec 6.08)', () => {
    expect(WORDMARK_CUT).toBe(0.4)
  })
})
```

`src/lib/india-time.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { formatIndiaTime } from '@/lib/india-time'

describe('formatIndiaTime', () => {
  it('shows India time in 12-hour lowercase form', () => {
    expect(formatIndiaTime(new Date('2026-09-28T02:05:00Z'))).toBe('7:35 am')
    expect(formatIndiaTime(new Date('2026-09-28T15:45:00Z'))).toBe('9:15 pm')
  })
})
```

- [ ] **Step 2: Run to see them fail**

Run: `npm test`
Expected: FAIL, cannot resolve `@/lib/fit` and `@/lib/india-time`.

- [ ] **Step 3: Implement**

`src/lib/fit.ts`:

```ts
// The footer's giant wordmark (spec 6.08).
export const WORDMARK_CUT = 0.4

// Font size that makes a word measured at 100px fill `boxWidth`.
export function fitFontSize(boxWidth: number, widthAt100: number): number {
  if (widthAt100 <= 0) return 0
  return ((100 * boxWidth) / widthAt100) * 0.995
}

// Height of the box that shows the wordmark with its bottom `cut` share hidden. Letters sit in a
// 0.74em band (Bricolage at line-height 0.8), plus a 0.06em margin above.
export function clipHeight(fontSize: number, cut: number): number {
  return fontSize * 0.74 * (1 - cut) + fontSize * 0.06
}
```

`src/lib/india-time.ts`:

```ts
const formatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

// "7:35 am". Normalises the narrow spaces some ICU versions put before am/pm.
export function formatIndiaTime(date: Date): string {
  return formatter.format(date).replace(/\s+/gu, ' ').toLowerCase()
}
```

- [ ] **Step 4: Run to see them pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Components and styles**

`src/components/footer/footer.module.css`:

```css
.footer { padding: 56px 24px 0; border-top: 1px solid var(--line); overflow: hidden; }
@media (min-width: 768px) { .footer { padding: 72px 40px 0; } }
.cols { display: grid; gap: 28px; grid-template-columns: 1fr 1fr; padding-bottom: 28px; border-bottom: 1px solid var(--line); }
@media (min-width: 900px) { .cols { grid-template-columns: 1.4fr repeat(3, 1fr); } }
.col { font: 400 12px/1.9 var(--font-mono); color: var(--muted); }
.col h3 { margin: 0 0 8px; font: 500 10.5px var(--font-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); opacity: 0.7; }
.col a { color: var(--text); text-decoration: none; transition: color 0.2s; }
.col a:hover { color: var(--signal); }
.lead { grid-column: 1 / -1; }
@media (min-width: 900px) { .lead { grid-column: auto; } }
.mail { display: inline-block; font: 800 clamp(22px, 2.8vw, 34px) var(--font-body); letter-spacing: -0.045em; border-bottom: 2px solid transparent; transition: border-color 0.3s; }
.mail:hover { border-color: var(--signal); color: var(--text) !important; }
.soon { opacity: 0.6; }
.dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--signal); box-shadow: 0 0 8px var(--signal); margin-right: 7px; vertical-align: 1px; animation: pulse 2.4s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: 0.35; } }
.time { color: var(--text); font-weight: 500; }
.bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; padding: 16px 0; font: 400 11px var(--font-mono); color: #6b6f63; }
.top { background: none; border: 1px solid var(--line); color: var(--text); border-radius: 999px; padding: 8px 13px; font: 500 11.5px var(--font-mono); text-decoration: none; }
.top:hover { border-color: var(--signal); color: var(--signal); }
.clip { overflow: hidden; display: flex; align-items: flex-start; }
.giant { display: inline-block; margin: 0.02em 0 0 -0.03em; line-height: 0.8; font-weight: 800; font-variation-settings: 'opsz' 96; letter-spacing: -0.065em; white-space: nowrap; user-select: none; }
.ch { display: inline-block; transform: translateY(105%); transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.in .ch { transform: none; }
.slash { color: var(--signal); }
.labs { opacity: 0.28; }
:global(html[data-motion='static']) .ch { transform: none; transition: none; }
:global(html[data-motion='static']) .dot { animation: none; }
```

`src/components/footer/india-clock.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { formatIndiaTime } from '@/lib/india-time'
import styles from '@/components/footer/footer.module.css'

export function IndiaClock() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const tick = () => setTime(formatIndiaTime(new Date()))
    tick()
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span>
      <span className={styles.dot} aria-hidden="true" />
      India <span className={styles.time}>{time ?? '--:--'}</span>
    </span>
  )
}
```

`src/components/footer/giant-wordmark.tsx`:

```tsx
'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { WORDMARK_CUT, clipHeight, fitFontSize } from '@/lib/fit'
import styles from '@/components/footer/footer.module.css'

const WORD = 'verastack/labs'

export function GiantWordmark() {
  const clipRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)

  // Fit the word edge to edge of its container, then hide the bottom 40% (spec 6.08).
  useEffect(() => {
    const clip = clipRef.current
    const word = wordRef.current
    if (!clip || !word) return
    const fit = () => {
      word.style.fontSize = '100px'
      const size = fitFontSize(clip.clientWidth, word.scrollWidth)
      word.style.fontSize = `${size}px`
      clip.style.height = `${clipHeight(size, WORDMARK_CUT)}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const resize = new ResizeObserver(fit)
    resize.observe(clip)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.1 })
    io.observe(clip)
    return () => {
      resize.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <div ref={clipRef} className={`${styles.clip} ${inView ? styles.in : ''}`} aria-hidden="true">
      <span ref={wordRef} className={styles.giant}>
        {[...WORD].map((ch, i) => (
          <span
            key={i}
            className={`${styles.ch} ${ch === '/' ? styles.slash : ''} ${i > 9 ? styles.labs : ''}`}
            style={{ transitionDelay: `${i * 45}ms` } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </span>
    </div>
  )
}
```

`src/components/footer/site-footer.tsx`:

```tsx
import { products } from '@/data/products'
import { site } from '@/data/site'
import { GiantWordmark } from '@/components/footer/giant-wordmark'
import { IndiaClock } from '@/components/footer/india-clock'
import styles from '@/components/footer/footer.module.css'

export function SiteFooter() {
  const year = 2026
  return (
    <footer className={styles.footer}>
      <div className={styles.cols}>
        <div className={`${styles.col} ${styles.lead}`}>
          <h3>start a project</h3>
          {site.email ? (
            <a className={styles.mail} href={`mailto:${site.email}`}>
              {site.email}
            </a>
          ) : (
            <a className={styles.mail} href="#contact">
              Start a project
            </a>
          )}
          {site.calLink && (
            <div>
              or{' '}
              <a href={site.calLink} target="_blank" rel="noreferrer">
                book a 20-min call ↗
              </a>
            </div>
          )}
        </div>
        <div className={styles.col}>
          <h3>products</h3>
          <ul className="m-0 list-none p-0">
            {products.map((p) => (
              <li key={p.name}>
                {p.url ? (
                  <a href={p.url}>{p.name} ↗</a>
                ) : (
                  <>
                    {p.name} <span className={styles.soon}>soon</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.col}>
          <h3>elsewhere</h3>
          <a href={site.githubUrl}>GitHub ↗</a>
          <br />
          <a href={site.founderUrl}>founder&apos;s portfolio ↗</a>
        </div>
        <div className={styles.col}>
          <h3>studio</h3>
          <IndiaClock />
          <br />
          based in {site.basedIn}
        </div>
      </div>
      <div className={styles.bar}>
        <span>
          © {year} {site.name}
        </span>
        <a className={styles.top} href="#top">
          back to top ↑
        </a>
      </div>
      <GiantWordmark />
    </footer>
  )
}
```

In `src/app/layout.tsx`, import and render after `{children}`:

```tsx
import { SiteFooter } from '@/components/footer/site-footer'
```

```tsx
        {children}
        <SiteFooter />
```

- [ ] **Step 6: Verify in the browser**

Run: `npm run lint && npm run typecheck && npm test && npm run build`, then `npm run dev` at 1280 px and 390 px:
- The wordmark fills the footer width edge to edge at both sizes; its bottom 40% is hidden; the slash is signal and `labs` faded.
- The letters rise one after another when the footer scrolls into view; with reduced motion they are simply there.
- The clock shows the current India time; products link to rigseed and Riggit; Mehfil shows "soon"; no email or booking link appears while they are null.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add the footer with the cut-off giant wordmark and India clock"
```

---

### Task 10: CI, gated deploy, docs and PR

**Files:**
- Create: `.github/workflows/nextjs.yml`, `THIRD_PARTY.md`
- Modify: `README.md`, `docs/STATUS.md`, `docs/superpowers/specs/2026-09-28-verastack-labs-site-design.md` (6.08 clip formula)

- [ ] **Step 1: Workflow**

`.github/workflows/nextjs.yml`:

```yaml
name: Build and deploy

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - uses: actions/cache@v6
        with:
          path: .next/cache
          key: ${{ runner.os }}-nextjs-${{ hashFiles('package-lock.json') }}-${{ hashFiles('src/**') }}
          restore-keys: ${{ runner.os }}-nextjs-${{ hashFiles('package-lock.json') }}-
      - run: npm run build
      - if: github.event_name != 'pull_request' && vars.DEPLOY_ENABLED == 'true'
        uses: actions/upload-pages-artifact@v5
        with:
          path: ./out

  # Gated until launch (phase 7 sets the DEPLOY_ENABLED repo variable), so a half-built site is
  # never public. Pull requests only build.
  deploy:
    if: github.event_name != 'pull_request' && vars.DEPLOY_ENABLED == 'true'
    needs: build
    runs-on: ubuntu-latest
    concurrency:
      group: pages
      cancel-in-progress: false
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Third-party record**

`THIRD_PARTY.md`:

```markdown
# Third-party code

Effects copied into this repo and restyled, with their licences. Record each one when it is
copied in (spec section 8).

| Where | Source | Licence |
| --- | --- | --- |
| `src/lib/contrast.ts`, `src/lib/scramble.ts` | adapted from riganb.github.io (same author) | n/a |

Fonts: Bricolage Grotesque and JetBrains Mono, both SIL Open Font License, served through
`next/font`.
```

- [ ] **Step 3: Docs**

`README.md`, replace the body with:

```markdown
# verastack-labs.github.io

The studio site for VeraStack Labs, served at https://verastack-labs.github.io once it launches.

Start with [docs/STATUS.md](docs/STATUS.md): what has landed, what is waiting on input and what is
planned.

    npm install
    npm run dev        # local site
    npm test           # unit and content tests
    npm run build      # static export to out/
```

In the spec's 6.08, replace "(a clipping box `0.74 × font size × 0.6` tall)" with "(a clipping box `font size × (0.74 × 0.6 + 0.06)` tall, `clipHeight()` in `src/lib/fit.ts`)".

In `docs/STATUS.md`: set phase 1 to `done` with its PR number; change "Nothing built yet" to "Foundation built: tokens, fonts, motion system, nav, footer, placeholder scenes, CI. Deploy is gated until launch."; add to **Planned, not started**: "- [ ] Launch: set the `DEPLOY_ENABLED` repo variable to `true` and enable Pages with GitHub Actions as the source (phase 7)."; add to **Waiting on Rigan** under the email item: "(the footer shows a 'Start a project' link instead until it is set)".

- [ ] **Step 4: Final verification**

Run: `npm run lint && npm run typecheck && npm test && npm run build`
Expected: all succeed.

- [ ] **Step 5: Commit, push, PR, merge**

```bash
git add -A
git commit -m "ci: build on every push, deploy gated until launch; docs for phase 1"
git push -u origin feat/phase-1-foundation
gh pr create --base main --title "feat: phase 1 foundation" --body "Phase 1 of the studio site (spec section 11).

- Next.js 16 static export with Tailwind 4, lint, typecheck and Vitest
- Signal tokens injected as CSS variables, with a WCAG AA contrast test
- Bricolage Grotesque and JetBrains Mono via next/font, metadata, favicon
- Section and product data with content guards (no em dashes, product links)
- Motion modes (full, lite, static), Lenis driving ScrollTrigger, html[data-motion]
- Path-pill nav: decoding path and counter, hover dock with highlight, touch panel, palette switch
- Footer: four columns, India clock, giant wordmark fitted to width with the bottom 40% cut off
- CI builds every push; deploy is gated behind the DEPLOY_ENABLED variable until launch

Verified: npm run lint, typecheck, test and build all pass; nav and footer checked in the browser at 1280 px and 390 px, with and without reduced motion."
```

Wait for the PR's build check to pass (`gh pr checks --watch`), then:

```bash
gh pr merge --merge --delete-branch
git checkout main && git pull
```
