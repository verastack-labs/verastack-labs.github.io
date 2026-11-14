// The film player's keyboard shortcuts, kept apart from the player so the mapping can be tested and the
// shortcuts panel lists exactly what the keys do.

export type Action =
  | { type: 'toggle' }
  | { type: 'full' }
  | { type: 'mute' }
  | { type: 'captions' }
  | { type: 'pip' }
  | { type: 'help' }
  | { type: 'close' }
  | { type: 'skip'; by: number }
  | { type: 'frame'; by: number }
  | { type: 'jump'; to: number }
  | { type: 'volume'; by: number }
  | { type: 'speed'; by: number }

// Where focus and the film are when a key comes in.
export type Where = {
  // Focus is inside this player.
  inside: boolean
  // The film has been started and at least half of it is on screen.
  live: boolean
  // The player fills the screen.
  full: boolean
}

// The rates the speed keys step through.
export const RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export function nextRate(rate: number, by: number): number {
  const at = RATES.findIndex((r) => r >= rate - 0.001)
  const i = Math.min(RATES.length - 1, Math.max(0, (at === -1 ? RATES.indexOf(1) : at) + by))
  return RATES[i]
}

// What a key does, or null when it belongs to the page. f, m, c and k always reach the last used
// player. The rest only work while focus is inside the player or its film is playing on screen, so
// space and the arrows still scroll the page otherwise. Up and down change the volume only inside the
// player or in full screen, since they are the page's own scroll keys.
export function shortcutFor(key: string, where: Where): Action | null {
  const k = key.length === 1 ? key.toLowerCase() : key
  const always: Record<string, Action> = { f: { type: 'full' }, m: { type: 'mute' }, c: { type: 'captions' }, k: { type: 'toggle' } }
  if (always[k]) return always[k]
  if (!where.inside && !where.live) return null
  if (/^[0-9]$/.test(k)) return { type: 'jump', to: Number(k) / 10 }
  const live: Record<string, Action> = {
    ' ': { type: 'toggle' },
    ArrowLeft: { type: 'skip', by: -5 },
    ArrowRight: { type: 'skip', by: 5 },
    j: { type: 'skip', by: -10 },
    l: { type: 'skip', by: 10 },
    Home: { type: 'jump', to: 0 },
    End: { type: 'jump', to: 1 },
    ',': { type: 'frame', by: -1 },
    '.': { type: 'frame', by: 1 },
    '<': { type: 'speed', by: -1 },
    '>': { type: 'speed', by: 1 },
    p: { type: 'pip' },
    '?': { type: 'help' },
    Escape: { type: 'close' },
  }
  if (live[k]) return live[k]
  if (where.inside || where.full) {
    if (k === 'ArrowUp') return { type: 'volume', by: 0.1 }
    if (k === 'ArrowDown') return { type: 'volume', by: -0.1 }
  }
  return null
}

// The panel's list, in the order a viewer looks for them.
export const SHORTCUTS: { keys: string[]; does: string }[] = [
  { keys: ['Space', 'K'], does: 'Play or pause' },
  { keys: ['←', '→'], does: 'Back or forward 5 seconds' },
  { keys: ['J', 'L'], does: 'Back or forward 10 seconds' },
  { keys: ['0–9'], does: 'Jump to 0% to 90% of the film' },
  { keys: ['Home', 'End'], does: 'Start or end' },
  { keys: [',', '.'], does: 'One frame back or forward, paused' },
  { keys: ['<', '>'], does: 'Slower or faster' },
  { keys: ['↑', '↓'], does: 'Volume up or down' },
  { keys: ['M'], does: 'Mute' },
  { keys: ['C'], does: 'Captions' },
  { keys: ['F'], does: 'Full screen' },
  { keys: ['P'], does: 'Picture in picture' },
  { keys: ['?'], does: 'This list' },
]
