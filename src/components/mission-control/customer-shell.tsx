import Link from 'next/link'

import { MissionControlActionPanel } from '@/components/mission-control/action-panel'
import { Button } from '@/components/ui/button'
import {
  type EndpointStatus,
  type MissionControlDashboardSnapshot,
} from '@/lib/mission-control/types'

function statusColor(status: EndpointStatus | undefined): string {
  switch (status) {
    case 'healthy':
      return 'text-emerald-400'
    case 'degraded':
      return 'text-amber-400'
    case 'offline':
      return 'text-red-400'
    default:
      return 'text-muted-foreground'
  }
}

export function CustomerMissionControlShell({
  snapshot,
}: {
  snapshot: MissionControlDashboardSnapshot
}) {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Mission Control · Customer</p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">{snapshot.tenant.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as {snapshot.user.email} ({snapshot.membership.role.replace('_', ' ')})
            </p>
          </div>
          <form action="/api/auth/sign-out" method="post">
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </header>

        <section className="rounded-xl border border-dashed border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
          <p className="font-medium">Customer-safe boundary</p>
          <p className="mt-1 text-muted-foreground">
            This dashboard intentionally excludes internal operator controls, destructive admin
            actions, and cross-tenant visibility.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Scope: read-only status + activity, approved safe-run actions, and support request hooks.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-card p-4 md:col-span-2">
            <h2 className="text-sm font-medium text-muted-foreground">Endpoint health</h2>
            <p className={`mt-2 text-2xl font-semibold ${statusColor(snapshot.endpoint?.status)}`}>
              {snapshot.endpoint?.status || 'unmapped'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Endpoint: {snapshot.endpoint?.endpointLabel || 'Not assigned'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Base URL: {snapshot.endpoint?.baseUrl || 'Pending mapping'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Last heartbeat: {snapshot.endpoint?.lastSeenAt || 'No heartbeat yet'}
            </p>
          </article>

          <article className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-sm font-medium text-muted-foreground">Pilot mode</h2>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {snapshot.tenant.pilotMode ? 'Vai safe slice active' : 'Standard tenant mode'}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {snapshot.tenant.pilotMode
                ? 'Only read + safe-run actions are enabled during pilot validation.'
                : 'Pilot restrictions are not applied for this tenant.'}
            </p>
            <Link href="/privacy" className="mt-3 inline-block text-xs text-accent underline">
              Security + privacy policy
            </Link>
          </article>
        </div>

        <MissionControlActionPanel
          actions={snapshot.availableActions}
          role={snapshot.membership.role}
          pilotMode={snapshot.tenant.pilotMode}
        />

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">Recent activity</h2>
          <div className="mt-4 space-y-2">
            {snapshot.activities.map((activity) => (
              <article
                key={activity.id}
                className="rounded-md border border-border bg-background p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{activity.summary}</p>
                  <span className="text-xs uppercase text-muted-foreground">{activity.outcome}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {activity.actor} · {activity.createdAt}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
