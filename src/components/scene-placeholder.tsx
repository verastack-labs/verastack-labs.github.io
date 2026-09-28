// Stands in for a scene until its phase lands. Carries the id the nav tracks.
export function ScenePlaceholder({
  id,
  label,
  title,
  navTheme,
}: {
  id: string
  label: string
  title: string
  navTheme?: 'light'
}) {
  return (
    <section
      id={id}
      data-nav-theme={navTheme}
      className="flex min-h-dvh flex-col justify-center border-b border-line px-6 pt-24 md:px-10"
    >
      <p className="font-mono text-[11px] text-muted">
        {label} <span className="text-signal">{'//'}</span> in progress
      </p>
      <h2 className="mt-3 max-w-[14ch] text-[clamp(40px,7vw,96px)] font-extrabold leading-[0.9] tracking-[-0.055em] [font-variation-settings:'opsz'_96]">
        {title}
      </h2>
    </section>
  )
}
