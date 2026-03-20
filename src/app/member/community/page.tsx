import { Users, ExternalLink } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Community
        </h1>
        <p className="mt-2 text-muted-foreground">
          Connect with other members building with AI.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-8">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Discord Community
            </h2>
            <p className="mt-2 text-muted-foreground">
              A small community of people using the same AI stack. Ask questions, share
              workflows, and get help from other members.
            </p>

            <div className="mt-6">
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6"
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Join Discord
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Discord invite link coming soon.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Community Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be helpful and constructive</li>
                <li>• Share what you build — configs, workflows, tips</li>
                <li>• No spam or self-promotion</li>
                <li>• Ask questions freely — everyone started somewhere</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
