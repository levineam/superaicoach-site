import { type NextRequest, NextResponse } from 'next/server'

import { changePassword, getServerSession, setPasswordForUser } from '@/lib/mission-control/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = (await request.json()) as {
      currentPassword?: string
      newPassword?: string
      isSettingInitialPassword?: boolean
    }

    const { currentPassword, newPassword, isSettingInitialPassword } = body

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { ok: false, error: 'Password must be at least 8 characters' },
        { status: 400 },
      )
    }

    // If setting initial password (no current password required)
    if (isSettingInitialPassword) {
      const result = await setPasswordForUser(session.userId, newPassword)

      if (!result.success) {
        return NextResponse.json({ ok: false, error: result.error }, { status: 400 })
      }

      return NextResponse.json({ ok: true })
    }

    // Regular password change (requires current password)
    if (!currentPassword) {
      return NextResponse.json(
        { ok: false, error: 'Current password is required' },
        { status: 400 },
      )
    }

    const result = await changePassword(session.userId, currentPassword, newPassword)

    if (!result.success) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to change password' },
      { status: 500 },
    )
  }
}
