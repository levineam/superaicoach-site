import { redirect } from 'next/navigation'

export default function MeetJarvisPage() {
  redirect('/sign-in?next=/mission-control')
}
