import { Package } from 'lucide-react'

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Skill Catalog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse curated AI skills with install guides and setup instructions.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <Package className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-lg font-semibold text-foreground">
          Coming soon
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          The full skill catalog is being built. Check back soon for 40+ curated AI skills
          with one-command install guides.
        </p>
      </div>
    </div>
  )
}
