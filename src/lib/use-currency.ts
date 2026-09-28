'use client'

import { useSyncExternalStore } from 'react'
import { detectCurrency, type Currency } from '@/lib/currency'

// The visitor's currency: a guess from the browser, overridable through setCurrency (the contact
// form's toggle, phase 6). Shared by the configurator demo and the budget bands.
let override: Currency | null = null
const listeners = new Set<() => void>()

function read(): Currency {
  if (override) return override
  return detectCurrency({
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    languages: navigator.languages ?? [navigator.language],
  })
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

export function setCurrency(currency: Currency) {
  override = currency
  listeners.forEach((l) => l())
}

export function useCurrency(): Currency {
  return useSyncExternalStore(subscribe, read, () => 'usd')
}
