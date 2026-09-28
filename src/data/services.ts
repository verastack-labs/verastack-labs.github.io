export type Service = {
  id: string
  name: string
  blurb: string
  proof: string[]
  lead: boolean
}

// Spec 6.02, in this order. Proof lines credit the founder's work (spec voice, section 4.4).
export const services: Service[] = [
  {
    id: 'configurators',
    name: 'Configurators',
    blurb: '3D and visual build-your-own tools that turn browsing into buying.',
    proof: ['Ultraviolette X-47', 'E3 TRION'],
    lead: true,
  },
  {
    id: 'commerce',
    name: 'Commerce & web apps',
    blurb: 'Pre-bookings, payments, cancellations, QR event passes and the internal tools behind them.',
    proof: ['TRION pre-booking', 'Suggaa · Maven · Pee Empro'],
    lead: false,
  },
  {
    id: 'launch',
    name: 'Launch sites',
    blurb: 'Motion-rich marketing sites built for a launch moment.',
    proof: ['E3 TRION launch', 'PixelStack Studio'],
    lead: false,
  },
  {
    id: 'desktop',
    name: 'Desktop apps',
    blurb: 'Small, fast desktop apps with Tauri.',
    proof: ['rigseed', 'Riggit'],
    lead: false,
  },
]
