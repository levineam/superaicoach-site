import { Settings } from 'lucide-react'

export default function ConfigsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Starter Configs
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pre-built OpenClaw configuration packages — pick a profile and get a working AI
          assistant in minutes.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <Settings className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold text-foreground">
          Coming soon
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Four starter configs — Productivity, Content Creator, Researcher, and Builder —
          are being packaged. Each includes curated skills, a sample config, and a
          quickstart guide.
        </p>
      </div>
    </div>
  )
}
