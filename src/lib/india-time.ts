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
