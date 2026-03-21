import { redirect } from 'next/navigation'

import {
  getMissionControlRedirectPath,
  isMissionControlArchived,
} from '@/lib/mission-control/archive'

export default function MeetJarvisPage() {
  if (isMissionControlArchived()) {
    redirect(getMissionControlRedirectPath())
  }

  redirect('/sign-in?next=/mission-control')
}
