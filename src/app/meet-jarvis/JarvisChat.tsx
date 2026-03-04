"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useCallback, useEffect, useRef, useState, useId, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, ArrowLeft, Mail, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ─── Orb animation ────────────────────────────────────────────────────────────

type OrbState = "idle" | "listening" | "thinking" | "speaking"

function JarvisOrb({ state }: { state: OrbState }) {
  const glowConfig: Record<OrbState, { scale: number[]; boxShadow: string[]; duration: number }> = {
    idle: {
      scale: [1, 1.035, 1],
      boxShadow: [
        "0 0 30px 8px hsl(158 60% 40% / 0.25), 0 0 60px 20px hsl(158 60% 40% / 0.10)",
        "0 0 40px 12px hsl(158 60% 40% / 0.35), 0 0 80px 28px hsl(158 60% 40% / 0.14)",
        "0 0 30px 8px hsl(158 60% 40% / 0.25), 0 0 60px 20px hsl(158 60% 40% / 0.10)",
      ],
      duration: 3.5,
    },
    listening: {
      scale: [1.04, 1.07, 1.04],
      boxShadow: [
        "0 0 40px 14px hsl(158 60% 40% / 0.40), 0 0 80px 32px hsl(158 60% 40% / 0.18)",
        "0 0 50px 18px hsl(158 60% 40% / 0.50), 0 0 100px 40px hsl(158 60% 40% / 0.22)",
        "0 0 40px 14px hsl(158 60% 40% / 0.40), 0 0 80px 32px hsl(158 60% 40% / 0.18)",
      ],
      duration: 1.8,
    },
    thinking: {
      scale: [1, 1.05, 0.97, 1.04, 1],
      boxShadow: [
        "0 0 50px 16px hsl(158 60% 40% / 0.45), 0 0 100px 40px hsl(158 60% 40% / 0.20)",
        "0 0 70px 24px hsl(158 60% 40% / 0.60), 0 0 130px 56px hsl(158 60% 40% / 0.28)",
        "0 0 40px 12px hsl(158 60% 40% / 0.35), 0 0 80px 32px hsl(158 60% 40% / 0.16)",
        "0 0 65px 22px hsl(158 60% 40% / 0.55), 0 0 120px 50px hsl(158 60% 40% / 0.25)",
        "0 0 50px 16px hsl(158 60% 40% / 0.45), 0 0 100px 40px hsl(158 60% 40% / 0.20)",
      ],
      duration: 1.2,
    },
    speaking: {
      scale: [1, 1.06, 0.98, 1.07, 0.99, 1.05, 1],
      boxShadow: [
        "0 0 55px 18px hsl(158 60% 40% / 0.50), 0 0 110px 45px hsl(158 60% 40% / 0.22)",
        "0 0 75px 28px hsl(158 60% 40% / 0.65), 0 0 140px 60px hsl(158 60% 40% / 0.30)",
        "0 0 45px 14px hsl(158 60% 40% / 0.40), 0 0 90px 36px hsl(158 60% 40% / 0.18)",
        "0 0 80px 30px hsl(158 60% 40% / 0.68), 0 0 150px 65px hsl(158 60% 40% / 0.32)",
        "0 0 50px 16px hsl(158 60% 40% / 0.45), 0 0 100px 40px hsl(158 60% 40% / 0.20)",
        "0 0 70px 26px hsl(158 60% 40% / 0.60), 0 0 130px 55px hsl(158 60% 40% / 0.27)",
        "0 0 55px 18px hsl(158 60% 40% / 0.50), 0 0 110px 45px hsl(158 60% 40% / 0.22)",
      ],
      duration: 1.6,
    },
  }

  const config = glowConfig[state]

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Outer halo rings */}
      <div className="relative flex items-center justify-center">
        {/* Outermost ring */}
        <motion.div
          className="absolute rounded-full border border-accent/10"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: config.duration * 1.3, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 220, height: 220 }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute rounded-full border border-accent/20"
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: config.duration * 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          style={{ width: 172, height: 172 }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute rounded-full border border-accent/30"
          animate={{ scale: [1, 1.03, 1], opacity: [0.7, 0.45, 0.7] }}
          transition={{ duration: config.duration * 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          style={{ width: 136, height: 136 }}
        />

        {/* Core orb */}
        <motion.div
          className="relative z-10 rounded-full"
          animate={{
            scale: config.scale,
            boxShadow: config.boxShadow,
          }}
          transition={{
            duration: config.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: 100,
            height: 100,
            background:
              "radial-gradient(circle at 38% 32%, hsl(158 70% 60%), hsl(158 60% 38%) 50%, hsl(158 50% 22%) 100%)",
          }}
        >
          {/* Inner highlight */}
          <div
            className="absolute rounded-full"
            style={{
              width: 28,
              height: 28,
              top: 18,
              left: 22,
              background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </motion.div>
      </div>

      {/* State label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={state}
          className="text-xs font-medium uppercase tracking-widest text-accent/60"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          {state === "idle" && "Ready"}
          {state === "listening" && "Listening"}
          {state === "thinking" && "Processing…"}
          {state === "speaking" && "Responding"}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

// ─── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({ role, content }: { role: string; content: string }) {
  const isUser = role === "user"
  return (
    <motion.div
      className={cn("flex gap-3 max-w-full", isUser ? "flex-row-reverse" : "flex-row")}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 flex items-end">
          <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold shadow-sm">
            J
          </div>
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[80%] md:max-w-[70%]",
          isUser
            ? "bg-accent text-accent-foreground rounded-br-sm"
            : "bg-card border border-border/60 text-foreground rounded-bl-sm"
        )}
      >
        {content}
      </div>
    </motion.div>
  )
}

// ─── Helper to get the text content from a message ───────────────────────────

function getMessageText(message: { parts?: Array<{ type: string; text?: string }>; content?: string }): string {
  // SDK v6: messages have `parts` array
  if (message.parts) {
    return message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("")
  }
  // Fallback: older format with `content` string
  return message.content ?? ""
}

// ─── Main component ────────────────────────────────────────────────────────────

export function JarvisChat() {
  const sessionToken = useId()
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: { "x-session-token": sessionToken },
      }),
    [sessionToken]
  )
  const { messages, status, sendMessage } = useChat({ transport })

  const [input, setInput] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastSpokenMessageIdRef = useRef<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasStarted = messages.length > 0
  const inputRef = useRef<HTMLInputElement>(null)

  // ── TTS ────────────────────────────────────────────────────────────────────

  const speakText = useCallback(async (text: string) => {
    if (!text.trim()) return
    try {
      setIsSpeaking(true)
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!response.ok) {
        setIsSpeaking(false)
        return
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(url)
      }
      audio.onerror = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(url)
      }
      await audio.play()
    } catch {
      setIsSpeaking(false)
    }
  }, [])

  // Speak the last assistant message when it finishes streaming
  useEffect(() => {
    if (status !== "ready") return
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "assistant") return
    if (lastMessage.id === lastSpokenMessageIdRef.current) return
    lastSpokenMessageIdRef.current = lastMessage.id
    if (!isMuted) {
      // Defer to next tick so setState inside speakText doesn't run
      // synchronously within the effect body (react-hooks/set-state-in-effect)
      setTimeout(() => speakText(getMessageText(lastMessage)), 0)
    }
  }, [status, messages, isMuted, speakText])

  const toggleMute = () => {
    const willMute = !isMuted
    setIsMuted(willMute)
    // If muting while speaking, stop immediately
    if (willMute && audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setIsSpeaking(false)
    }
  }

  // Derive orb state — use "speaking" state when TTS audio is playing
  const orbState: OrbState =
    status === "submitted"
      ? "thinking"
      : isSpeaking
      ? "speaking"
      : status === "streaming"
      ? "thinking"
      : input.trim().length > 0
      ? "listening"
      : "idle"

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const onSubmit = (textOverride?: string) => {
    const text = textOverride ?? input
    if (!text.trim()) return
    sendMessage({ text })
    setInput("")
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  const handleSuggestion = (text: string) => {
    onSubmit(text)
    inputRef.current?.focus()
  }

  const isBusy = status === "streaming" || status === "submitted"

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Hero / Orb section ── */}
      <section className="relative flex flex-col items-center justify-center px-6 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,hsl(158_60%_40%/0.09),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(30_20%_85%/0.4),transparent_50%)]" />
        </div>

        {/* Back link */}
        <div className="absolute top-6 left-6">
          <Link
            href="/business"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        {/* Mute toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute Jarvis" : "Mute Jarvis"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
              isMuted
                ? "border-border/40 bg-card/60 text-muted-foreground hover:text-foreground"
                : "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20"
            )}
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
            {isMuted ? "Muted" : "Voice on"}
          </button>
        </div>

        {/* Label */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent mb-10"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Super AI Coach
        </motion.div>

        {/* Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <JarvisOrb state={orbState} />
        </motion.div>

        {/* Title */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            I&apos;m Jarvis.
          </h1>
          <p className="text-muted-foreground text-lg">
            How can I help?
          </p>
        </motion.div>

        {/* Speaking indicator */}
        <AnimatePresence>
          {isSpeaking && !isMuted && (
            <motion.div
              className="flex items-center gap-2 mt-4"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              {/* Sound wave bars */}
              {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full bg-accent"
                  animate={{ height: ["8px", "20px", "8px"] }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay }}
                />
              ))}
              <span className="ml-1 text-xs font-medium text-accent/80 tracking-widest uppercase">
                Speaking
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Chat section ── */}
      <section className="flex-1 flex flex-col px-4 md:px-6 max-w-3xl mx-auto w-full pb-6">

        {/* Messages */}
        <AnimatePresence>
          {hasStarted && (
            <motion.div
              className="flex-1 flex flex-col gap-4 mb-6 min-h-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} role={m.role} content={getMessageText(m)} />
              ))}
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome hint when empty */}
        {!hasStarted && (
          <motion.div
            className="flex flex-col gap-3 mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-center text-sm text-muted-foreground mb-2">
              Ask me anything about AI adoption or how Super AI Coach works.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "What does Super AI Coach actually do?",
                "How does the free pilot work?",
                "How do you assess AI readiness?",
                "What's Mission Control?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                  className="rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-sm text-muted-foreground hover:border-accent/40 hover:text-foreground hover:bg-card transition-all duration-200 text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input form */}
        <form
          onSubmit={handleFormSubmit}
          className="flex items-end gap-3"
        >
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Jarvis anything…"
              disabled={isBusy}
              className={cn(
                "w-full rounded-2xl border border-border/60 bg-card px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40",
                "transition-all duration-200",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isBusy}
            className={cn(
              "flex-shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-2xl",
              "bg-accent text-accent-foreground shadow-md shadow-accent/20",
              "transition-all duration-200",
              "hover:bg-accent/90 active:scale-95",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 bg-card/40 px-6 py-6 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-muted-foreground">
          <span>
            Powered by{" "}
            <Link
              href="/business"
              className="font-medium text-foreground hover:text-accent transition-colors underline underline-offset-4"
            >
              Super AI Coach
            </Link>
          </span>
          <span className="hidden sm:inline text-border">·</span>
          <a
            href="mailto:andrew@superaicoach.com"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            andrew@superaicoach.com
          </a>
        </div>
      </footer>
    </div>
  )
}
