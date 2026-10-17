// A small robots.txt reader, following RFC 9309: a crawler obeys the group that names it, or the
// `*` group when none does; within that group the longest matching rule wins, and Allow wins a tie.

type Rule = { allow: boolean; path: string }
type Group = { agents: string[]; rules: Rule[] }

export type Robots = { groups: Group[]; sitemaps: string[] }

export function parseRobots(text: string): Robots {
  const groups: Group[] = []
  const sitemaps: string[] = []
  let current: Group | null = null
  // A run of user-agent lines opens one group; the first rule after them closes the run.
  let collectingAgents = false

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim()
    const i = line.indexOf(':')
    if (i <= 0) continue
    const key = line.slice(0, i).trim().toLowerCase()
    const value = line.slice(i + 1).trim()

    if (key === 'user-agent') {
      if (!collectingAgents || !current) {
        current = { agents: [], rules: [] }
        groups.push(current)
      }
      current.agents.push(value.toLowerCase())
      collectingAgents = true
    } else if (key === 'allow' || key === 'disallow') {
      collectingAgents = false
      // An empty Disallow allows everything, which is the same as no rule.
      if (current && value) current.rules.push({ allow: key === 'allow', path: value })
    } else if (key === 'sitemap') {
      if (value) sitemaps.push(value)
    }
  }
  return { groups, sitemaps }
}

// Turns a robots path pattern into a test: `*` matches anything, a trailing `$` anchors the end.
function matches(pattern: string, path: string): boolean {
  const anchored = pattern.endsWith('$')
  const body = anchored ? pattern.slice(0, -1) : pattern
  const source = body.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*')
  return new RegExp(`^${source}${anchored ? '$' : ''}`).test(path)
}

export function isAllowed(robots: Robots, agent: string, path: string): boolean {
  const token = agent.toLowerCase()
  const named = robots.groups.filter((g) => g.agents.includes(token))
  const groups = named.length > 0 ? named : robots.groups.filter((g) => g.agents.includes('*'))
  const rules = groups.flatMap((g) => g.rules)

  let best: Rule | null = null
  for (const rule of rules) {
    if (!matches(rule.path, path)) continue
    const longer = !best || rule.path.length > best.path.length
    const tieAllow = best && rule.path.length === best.path.length && rule.allow && !best.allow
    if (longer || tieAllow) best = rule
  }
  return best ? best.allow : true
}
