import { getConfigs } from '@/data/configs'
import { ConfigCard } from '@/components/member/config-card'

export default function ConfigsPage() {
  const configs = getConfigs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Starter Configs
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pre-built OpenClaw configuration packages. Pick a profile, copy the config,
          and get a working AI assistant in minutes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {configs.map((config) => (
          <ConfigCard key={config.slug} config={config} />
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/30 px-5 py-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Not sure which to pick?</span>{' '}
          Start with <span className="font-medium">Productivity Assistant</span> — it
          connects to the tools you already use and has the simplest setup. You can
          always add skills from other configs later.
        </p>
      </div>
    </div>
  )
}
