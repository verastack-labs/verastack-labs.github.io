import type { Currency } from '@/lib/currency'

type Money = Record<Currency, number>

export type Choice = { id: string; label: string; color: string; delta: Money }
export type GroupId = 'case' | 'keycaps' | 'switches'
export type OptionGroup = { id: GroupId; label: string; choices: Choice[] }
export type Selection = Record<GroupId, string>

const FREE: Money = { inr: 0, usd: 0 }

const groups: OptionGroup[] = [
  {
    id: 'case',
    label: 'case',
    choices: [
      { id: 'graphite', label: 'graphite', color: '#2F322A', delta: FREE },
      { id: 'silver', label: 'silver', color: '#B7BAAE', delta: { inr: 1500, usd: 19 } },
      { id: 'signal', label: 'signal', color: '#D4FF3F', delta: { inr: 2500, usd: 29 } },
    ],
  },
  {
    id: 'keycaps',
    label: 'keycaps',
    choices: [
      { id: 'bone', label: 'bone', color: '#D8D5C7', delta: FREE },
      { id: 'ink', label: 'ink pbt', color: '#1D1F17', delta: { inr: 2000, usd: 24 } },
    ],
  },
  {
    id: 'switches',
    label: 'switches',
    choices: [
      { id: 'linear', label: 'linear', color: '#FF6B4A', delta: FREE },
      { id: 'tactile', label: 'tactile', color: '#C98B45', delta: { inr: 1200, usd: 15 } },
    ],
  },
]

// The demo product (spec 6.02): a 65% mechanical keyboard, drawn in code rather than loaded from
// a model file. 3 cases x 2 keycap sets x 2 switch types = 12 combinations. Prices are illustrative.
export const configurator = {
  title: 'Configure it. Price it. Pre-book it.',
  product: 'VS-65 keyboard',
  base: { inr: 12999, usd: 149 } as Money,
  deposit: { inr: 999, usd: 12 } as Money,
  groups,
  // Esc, Enter and the arrows take this colour on either keycap set.
  accent: '#D4FF3F',
  defaults: { case: 'graphite', keycaps: 'bone', switches: 'linear' } as Selection,
}

export function choiceOf(group: GroupId, selection: Selection): Choice {
  const g = groups.find((x) => x.id === group)!
  return g.choices.find((c) => c.id === selection[group]) ?? g.choices[0]
}

export function priceOf(selection: Selection, currency: Currency): number {
  return groups.reduce((sum, g) => sum + choiceOf(g.id, selection).delta[currency], configurator.base[currency])
}
