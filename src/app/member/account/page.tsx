import { requireAuth } from '@/lib/member/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, User } from 'lucide-react'

export const metadata = {
  title: 'Account | SuperAIcoach',
  description: 'Manage your SuperAIcoach account',
}

export default async function AccountPage() {
  const session = await requireAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Account
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="text-foreground">{session.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Tenant
              </label>
              <p className="text-foreground">{session.tenantSlug}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-accent" />
            Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Account management features are coming soon. For now, contact
              support for account changes.
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:support@superaicoach.com">Contact Support</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
