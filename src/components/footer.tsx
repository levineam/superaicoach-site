export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xl text-foreground">
          <span className="font-semibold">SuperAI</span>
          <span className="font-display italic">coach</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="mailto:hello@superaicoach.com" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
          hello@superaicoach.com · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
