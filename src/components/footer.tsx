export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          {"© "}{new Date().getFullYear()}{" SuperAIcoach. All rights reserved."}
        </p>
        <div className="flex items-center gap-6">
          <a href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="mailto:hello@superaicoach.com" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
