import { Button } from '@/components/button'

export default function NotFound() {
  return (
    <section className="page-head">
      <p className="eyebrow">404</p>
      <h1>
        Nothing here. <em>Yet.</em>
      </h1>
      <p className="lede">That page moved or never existed.</p>
      <Button href="/">Back to the start</Button>
    </section>
  )
}
