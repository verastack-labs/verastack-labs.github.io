export type Currency = 'inr' | 'usd'

// Spec 6.07: rupees for an Indian time zone or an -IN language, dollars otherwise. No tracking or
// IP lookup, only what the browser already says about itself.
export function detectCurrency(i: { timeZone: string | undefined; languages: readonly string[] }): Currency {
  if (i.timeZone === 'Asia/Kolkata' || i.timeZone === 'Asia/Calcutta') return 'inr'
  return i.languages.some((l) => /-IN$/i.test(l)) ? 'inr' : 'usd'
}

export function formatMoney(amount: number, currency: Currency): string {
  const whole = Math.round(amount)
  return currency === 'inr' ? `₹${whole.toLocaleString('en-IN')}` : `$${whole.toLocaleString('en-US')}`
}
