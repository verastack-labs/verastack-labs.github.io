const pad = (n: number) => String(n).padStart(2, '0')

// The nav pill's position readout, "02/06".
export function formatCounter(index: number, last: number): string {
  return `${pad(Math.min(Math.max(index, 0), last))}/${pad(last)}`
}
