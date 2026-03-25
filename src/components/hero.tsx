import { ConsultationCTA } from "@/components/consultation-cta"
import { MapPin } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex items-start justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(158_60%_40%/0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(30_20%_85%/0.5),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 pt-8 text-center sm:pt-10 md:pt-14">
        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Personal AI Coaching
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/75 md:text-xl">
          Automate the tedious. Amplify the meaningful.
          <br className="hidden sm:inline" />{' '}
          Practical AI coaching that gives you back time for what actually matters.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ConsultationCTA source="hero" />
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <a
            href="/philly"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            In Philadelphia? See in-person options
          </a>
        </div>
      </div>
    </section>
  )
}
