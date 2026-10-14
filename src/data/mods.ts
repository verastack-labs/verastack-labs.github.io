export type Mod = {
  id: 'secret-guard' | 'session-meter' | 'repo-board'
  name: string
  line: string
  // What it puts in front of you, shown on the card as a terminal line. Taken from the README.
  sample: string
  repo: string
  install: string
}

// Open-source Claude Code mods the studio publishes (Apache 2.0). Copy comes from each README.
export const mods: Mod[] = [
  {
    id: 'secret-guard',
    name: 'secret-guard',
    line: 'Stops Claude Code from writing, running or committing API keys, tokens and private keys, and asks it to read them from the environment instead.',
    sample: '/allow-secret',
    repo: 'https://github.com/verastack-labs/secret-guard',
    install: '/plugin install secret-guard --marketplace verastack-labs/secret-guard',
  },
  {
    id: 'session-meter',
    name: 'session-meter',
    line: 'Your usage limits, context window and session totals in a pane and the status line, with a warning before you hit a wall.',
    sample: '5h 62% · ctx 41%',
    repo: 'https://github.com/verastack-labs/session-meter',
    install: '/plugin install session-meter --marketplace verastack-labs/session-meter',
  },
  {
    id: 'repo-board',
    name: 'repo-board',
    line: 'Every repo you own in one pane: work that exists only on this machine, commits waiting to be pulled, and the pull requests that need you.',
    sample: '1 failing · 2 unpushed · 1 dirty',
    repo: 'https://github.com/verastack-labs/repo-board',
    install: '/plugin install repo-board --marketplace verastack-labs/repo-board',
  },
]

export const modsLicense = 'Apache 2.0'
