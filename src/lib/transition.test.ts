import { describe, expect, it } from 'vitest'
import { shouldCurtain } from '@/lib/transition'

describe('shouldCurtain', () => {
  it('never runs on the first load', () => {
    expect(shouldCurtain('/', '/blog/', true)).toBe(false)
  })

  it('runs between pages of the site', () => {
    expect(shouldCurtain('/blog/', '/founder/', false)).toBe(true)
    expect(shouldCurtain('/founder/', '/', false)).toBe(true)
    expect(shouldCurtain('/founder/', '/#contact', false)).toBe(true)
  })

  it('stays out of hash jumps, same-page links, other sites and files', () => {
    expect(shouldCurtain('/', '/#contact', false)).toBe(false)
    expect(shouldCurtain('/founder/', '/founder', false)).toBe(false)
    expect(shouldCurtain('/', 'https://riganb.github.io', false)).toBe(false)
    expect(shouldCurtain('/', '/llms.txt', false)).toBe(false)
  })
})
