import { describe, expect, it } from 'vitest'
import { readShared, shareValue, withShared } from '@/lib/share-url'

describe('shareable report addresses', () => {
  it('drops the scheme and a trailing slash, keeps the path', () => {
    expect(shareValue(' https://syntaxsuite.io/ ')).toBe('syntaxsuite.io')
    expect(shareValue('HTTP://www.example.com/pricing')).toBe('www.example.com/pricing')
    expect(shareValue('example.com')).toBe('example.com')
  })

  it('reads ?url= with or without a scheme, and ignores an empty one', () => {
    expect(readShared('?url=syntaxsuite.io')).toBe('syntaxsuite.io')
    expect(readShared('?url=https%3A%2F%2Fexample.com%2Fa%3Fb%3D1')).toBe('https://example.com/a?b=1')
    expect(readShared('?url=%20')).toBeNull()
    expect(readShared('')).toBeNull()
  })

  it('writes ?url= encoded, keeping the path and other parameters', () => {
    expect(withShared('https://verastack.dev/tools/ai-search-check/', 'https://syntaxsuite.io/')).toBe(
      '/tools/ai-search-check/?url=syntaxsuite.io',
    )
    const out = withShared('https://verastack.dev/tools/what-ai-sees/?ref=x&url=old.com#r', 'example.com/a?b=1&c=2')
    expect(out).toBe('/tools/what-ai-sees/?ref=x&url=example.com%2Fa%3Fb%3D1%26c%3D2#r')
    expect(readShared(new URL(out, 'https://verastack.dev').search)).toBe('example.com/a?b=1&c=2')
  })
})
