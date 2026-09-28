import type { Currency } from '@/lib/currency'

// Placeholder bands until confirmed (docs/STATUS.md, Waiting on Rigan). Both sets keep the same
// number of bands so switching currency keeps the visitor's position.
export const budgets: Record<Currency, string[]> = {
  inr: ['under ₹2L', '₹2-5L', '₹5-10L', '₹10L+', "we're not sure yet"],
  usd: ['under $3k', '$3-7k', '$7-15k', '$15k+', "we're not sure yet"],
}
