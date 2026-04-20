import { Sparkles } from "lucide-react";

const messages: { who: "ai" | "user"; text: string }[] = [
  {
    who: "ai",
    text: "You've received an important work email from Priya about the Q4 board review. She's asking for the updated revenue deck by Thursday.",
  },
  { who: "ai", text: "Want me to draft a reply?" },
  {
    who: "user",
    text: "Yes — confirm Thursday and ask if she wants the one-pager too.",
  },
  {
    who: "ai",
    text: "Drafted. Professional tone, confirms Thursday EOD, offers the one-pager. Send now or review first?",
  },
];

export function HeroChat() {
  return (
    <div className="relative rounded-[1.75rem] border border-border bg-card p-5 shadow-[0_24px_80px_-32px_rgba(20,40,80,0.22)]">
      <div className="flex items-center gap-2 border-b border-border/70 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <div className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          Your AI assistant
        </div>
      </div>

      <div className="space-y-2 pt-4 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.who === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={[
                "max-w-[82%] rounded-2xl px-4 py-2.5 leading-relaxed",
                m.who === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground",
              ].join(" ")}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground">
        <span className="flex-1">Message your assistant…</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
          ⌘ K
        </span>
      </div>
    </div>
  );
}
