import { requireAuth } from '@/lib/member/auth'
import { ChangePasswordForm } from '@/components/auth/change-password-form'

export default async function AccountPage() {
  const session = await requireAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Account
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings.
        </p>
      </div>

      <div className="max-w-md space-y-6">
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Email
          </h2>
          <p className="mt-2 text-foreground">{session.email}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Change Password
          </h2>
          <ChangePasswordForm hasExistingPassword={true} />
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Membership
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Membership management will be available once payment processing is set up.
          </p>
        </div>
      </div>
    </div>
  )
}
