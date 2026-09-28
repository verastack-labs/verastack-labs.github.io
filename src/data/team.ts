export type TeamMember = { name: string; role: string; portrait: string | null; link: string | null }

// Empty until there are real people to show. The About team row renders only when this has
// entries (spec 6.06). Never add invented people.
export const team: TeamMember[] = []
