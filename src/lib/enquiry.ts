// The enquiry sentence (spec 6.07): validation, the "n of 3 filled" counter, the sentence as text,
// and the mailto fallback.
export type Enquiry = {
  name: string
  company: string
  service: string
  budget: string
  timeline: string
  email: string
  note: string
}

export type Problem = 'empty' | 'email'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmail(value: string): boolean {
  return EMAIL.test(value.trim())
}

// The blanks a visitor types into. Company is optional but still counts towards "filled".
export function filledCount(e: Pick<Enquiry, 'name' | 'company' | 'email'>): number {
  return [e.name, e.company, e.email].filter((v) => v.trim()).length
}

// What stops the enquiry being sent, blank by blank. Empty when it can go.
export function problems(e: Pick<Enquiry, 'name' | 'email'>): Partial<Record<'name' | 'email', Problem>> {
  const out: Partial<Record<'name' | 'email', Problem>> = {}
  if (!e.name.trim()) out.name = 'empty'
  if (!e.email.trim()) out.email = 'empty'
  else if (!isEmail(e.email)) out.email = 'email'
  return out
}

// The line under Send after an early press.
export function problemMessage(p: ReturnType<typeof problems>): string | null {
  if (p.email === 'email' && !p.name) return "that email doesn't look right"
  if (p.name || p.email) return 'a couple of blanks are still empty'
  return null
}

export function sentence(e: Enquiry): string {
  const from = e.company.trim() ? ` from ${e.company.trim()}` : ''
  const note = e.note.trim() ? `\n\n${e.note.trim()}` : ''
  return (
    `Hi, I'm ${e.name.trim()}${from}. We need ${e.service} with a budget of ${e.budget}, ` +
    `ideally live by ${e.timeline}. Reach me at ${e.email.trim()}.${note}`
  )
}

export function mailtoHref(to: string, e: Enquiry): string {
  const subject = encodeURIComponent(`Project enquiry from ${e.name.trim() || 'the website'}`)
  return `mailto:${to}?subject=${subject}&body=${encodeURIComponent(sentence(e))}`
}
