// Locks the screen height into CSS variables, measured once when the page loads.
//
// Why: on Android Chrome (seen on an OPPO Reno15 with the address bar at the bottom) the "stable"
// viewport units move as the toolbar hides and shows: svh read 769px at the top of the page and
// 695px once scrolled, lvh 842px then 769px. Every full-screen section sized in those units grew
// and shrank with them, and the page shifted by up to 366px as the scroll direction changed.
//
// So the height is measured once, in pixels, and frozen: --screen-small (the visible height at
// load, with the browser's bars showing) and --screen-large (100lvh at load, never less than that).
// On touch screens they are measured again only when the width changes (a rotation), never on a
// height-only change, which is all a toolbar ever causes. With a mouse there is no such toolbar, and
// a window that grows taller after load (maximised, a side or bottom panel closed) has to be
// followed, or every full-screen section stops short of the bottom; there any resize measures
// again. CSS falls back to the units themselves before this runs.
//
// The function is serialised into an inline <script> in the document head, so it runs before the
// first paint; it must stay self-contained.
export function lockScreenHeight() {
  const root = document.documentElement
  const measure = () => {
    const probe = document.createElement('div')
    probe.style.cssText = 'position:absolute;top:0;left:0;width:0;visibility:hidden;pointer-events:none'
    root.appendChild(probe)
    probe.style.height = '100lvh'
    const large = probe.getBoundingClientRect().height
    root.removeChild(probe)
    // The unit probes shift on that Chrome too; the visible height is the one number that held.
    const small = window.innerHeight
    if (small > 0) root.style.setProperty('--screen-small', `${Math.round(small)}px`)
    if (large > 0) root.style.setProperty('--screen-large', `${Math.round(Math.max(large, small))}px`)
  }
  measure()
  const touch = window.matchMedia('(pointer: coarse)').matches
  let width = window.innerWidth
  window.addEventListener('resize', () => {
    // On touch, a real change of width (a rotation); the toolbar can nudge the reported width by a pixel.
    if (touch && Math.abs(window.innerWidth - width) < 50) return
    width = window.innerWidth
    measure()
  })
}

export const screenLockScript = `(${lockScreenHeight.toString()})()`
