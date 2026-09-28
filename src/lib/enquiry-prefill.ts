// Hands a chosen service from elsewhere on the page (the configurator's Pre-book button) to the
// contact form, which reads it once (spec 6.07). Session storage only; failures are ignored.
const KEY = 'verastack:enquiry-service'

export function setEnquiryPrefill(service: string) {
  try {
    sessionStorage.setItem(KEY, service)
  } catch {}
  window.dispatchEvent(new CustomEvent('enquiry-prefill', { detail: service }))
}

export function takeEnquiryPrefill(): string | null {
  try {
    const value = sessionStorage.getItem(KEY)
    sessionStorage.removeItem(KEY)
    return value
  } catch {
    return null
  }
}
