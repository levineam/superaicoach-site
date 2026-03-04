"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, AlertCircle, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Orb animation ────────────────────────────────────────────────────────────

type OrbState = "idle" | "listening" | "thinking" | "speaking"

function JarvisOrb({ state, onClick }: { state: OrbState; onClick?: () => void }) {
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
      <div
        className={cn(
          "relative flex items-center justify-center",
          onClick && "cursor-pointer select-none",
        )}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        aria-label={onClick ? "Click to speak with Jarvis" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      >
        {/* Listening pulse ring — extra ring that intensifies when listening */}
        <AnimatePresence>
          {state === "listening" && (
            <motion.div
              className="absolute rounded-full border-2 border-accent/60"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: [1.15, 1.35, 1.15], opacity: [0.7, 0.2, 0.7] }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 140, height: 140 }}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="absolute rounded-full border border-accent/10"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: config.duration * 1.3, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 220, height: 220 }}
        />
        <motion.div
          className="absolute rounded-full border border-accent/20"
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: config.duration * 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          style={{ width: 172, height: 172 }}
        />
        <motion.div
          className="absolute rounded-full border border-accent/30"
          animate={{ scale: [1, 1.03, 1], opacity: [0.7, 0.45, 0.7] }}
          transition={{ duration: config.duration * 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          style={{ width: 136, height: 136 }}
        />
        <motion.div
          className="relative z-10 rounded-full"
          animate={{ scale: config.scale, boxShadow: config.boxShadow }}
          transition={{ duration: config.duration, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 100,
            height: 100,
            background:
              "radial-gradient(circle at 38% 32%, hsl(158 70% 60%), hsl(158 60% 38%) 50%, hsl(158 50% 22%) 100%)",
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 28, height: 28, top: 18, left: 22,
              background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </motion.div>
      </div>
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
      {!isUser && (
        <div className="flex-shrink-0 flex items-end">
          <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold shadow-sm">
            J
          </div>
        </div>
      )}
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

function getMessageText(message: { parts?: Array<{ type: string; text?: string }>; content?: string }): string {
  if (message.parts) {
    return message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("")
  }
  return message.content ?? ""
}

// ─── Main component ────────────────────────────────────────────────────────────

interface JarvisGatewayChatProps {
  tenantSlug: string
  tenantName: string
  userEmail: string
  hasEndpoint: boolean
  endpointLabel: string | null
}

export function JarvisGatewayChat({
  tenantSlug,
  tenantName: _tenantName,
  userEmail: _userEmail,
  hasEndpoint,
  endpointLabel: _endpointLabel,
}: JarvisGatewayChatProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `/api/mission-control/jarvis/chat`,
        headers: { "x-tenant-slug": tenantSlug },
      }),
    [tenantSlug]
  )
  const { messages, status, sendMessage } = useChat({ transport })

  const [input, setInput] = useState("")
  const [orbState, setOrbState] = useState<OrbState>("idle")
  const [speechSupported, setSpeechSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const orbStateRef = useRef<OrbState>("idle")
  const lastSpokenMessageIdRef = useRef<string>("greeting")
  const greetingSpoken = useRef(false)
  const startVoiceConversationRef = useRef<(() => void) | null>(null)

  // Keep ref in sync with state (for use in closures)
  const updateOrbState = useCallback((next: OrbState) => {
    orbStateRef.current = next
    setOrbState(next)
  }, [])

  // Pre-populate with Jarvis greeting; API messages are appended after
  const displayMessages = useMemo(() => [
    {
      id: "greeting",
      role: "assistant" as const,
      content: "Hello Andrew, how can I help you today?",
    },
    ...messages,
  ], [messages])

  // ── Detect speech API support (client-only) ──────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpeechSupported(
      typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    )
  }, [])

  // ── Sync orbState with gateway status (when not in voice-driven state) ──
  useEffect(() => {
    const cur = orbStateRef.current
    if (status === "submitted" && cur !== "listening") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateOrbState("thinking")
    } else if (status === "streaming" && cur === "thinking") {
      // speaking state will be set by speakResponse when message finalizes
      // keep "thinking" during streaming until TTS kicks in
    } else if (status === "ready" && (cur === "thinking" || cur === "listening")) {
      // fallback: if no TTS, go idle
      updateOrbState("idle")
    } else if (status === "error") {
      // Always return to idle on error — prevents orb from getting stuck on "Processing"
      updateOrbState("idle")
    }
  }, [status, updateOrbState])

  // ── TTS: browser fallback ────────────────────────────────────────────────
  const fallbackSpeak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      updateOrbState("idle")
      return
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => updateOrbState("idle")
    utterance.onerror = () => updateOrbState("idle")
    window.speechSynthesis.speak(utterance)
  }, [updateOrbState])

  // Track if we're in a voice conversation (should auto-listen after response)
  const voiceConversationActive = useRef(false)

  // ── TTS: speak a response via ElevenLabs (with browser fallback) ─────────
  const speakResponse = useCallback(async (text: string, autoListenAfter = false) => {
    if (!text.trim()) return

    // Cancel any ongoing browser speech
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    updateOrbState("speaking")

    // Helper to restart listening after speech ends
    const maybeRestartListening = () => {
      if (autoListenAfter && voiceConversationActive.current && hasEndpoint && speechSupported) {
        // Small delay before restarting to avoid cutting off audio
        setTimeout(() => {
          if (voiceConversationActive.current) {
            startVoiceConversationRef.current?.()
          }
        }, 300)
      } else {
        updateOrbState("idle")
      }
    }

    try {
      const response = await fetch("/api/mission-control/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        fallbackSpeak(text)
        return
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)

      audio.onended = () => {
        URL.revokeObjectURL(url)
        maybeRestartListening()
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        updateOrbState("idle")
      }

      await audio.play()
    } catch {
      fallbackSpeak(text)
    }
  }, [updateOrbState, fallbackSpeak, hasEndpoint, speechSupported])

  // ── Speak greeting on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (greetingSpoken.current) return
    greetingSpoken.current = true
    const timer = setTimeout(() => {
      void speakResponse("Hello Andrew, how can I help you today?")
    }, 800)
    return () => clearTimeout(timer)
  }, [speakResponse])

  // ── Speak new assistant messages as they arrive ──────────────────────────
  useEffect(() => {
    if (status !== "ready") return
    const lastMsg = messages[messages.length - 1]
    if (!lastMsg) return
    if (lastMsg.role !== "assistant") return
    if (lastMsg.id === lastSpokenMessageIdRef.current) return

    lastSpokenMessageIdRef.current = lastMsg.id
    const text = getMessageText(lastMsg)
    // Auto-listen after response if voice conversation is active.
    // Deferred via setTimeout to avoid calling setState synchronously within an effect.
    if (text) setTimeout(() => { void speakResponse(text, voiceConversationActive.current) }, 0)
  }, [messages, status, speakResponse])

  // ── Voice input ──────────────────────────────────────────────────────────
  const handleVoiceSubmit = useCallback((transcript: string) => {
    if (!transcript.trim()) {
      updateOrbState("idle")
      return
    }
    sendMessage({ text: transcript })
    setInput("")
  }, [sendMessage, updateOrbState])

  const startVoiceConversation = useCallback(() => {
    if (!hasEndpoint) return

    if (!speechSupported) {
      inputRef.current?.focus()
      return
    }

    // Mark voice conversation as active
    voiceConversationActive.current = true

    // Stop any ongoing speech before listening
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    type SpeechRecognitionCtor = new () => {
      continuous: boolean
      interimResults: boolean
      lang: string
      start(): void
      onresult: ((event: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void) | null
      onerror: (() => void) | null
      onend: (() => void) | null
    }
    const SpeechRecognition = (
      (window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor })
        .SpeechRecognition ||
      (window as Window & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor })
        .webkitSpeechRecognition
    ) as SpeechRecognitionCtor
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    updateOrbState("listening")

    recognition.start()

    recognition.onresult = (event) => {
      const transcript: string = event.results[0][0].transcript
      setInput(transcript)
      updateOrbState("thinking")
      handleVoiceSubmit(transcript)
    }

    recognition.onerror = () => {
      voiceConversationActive.current = false
      updateOrbState("idle")
    }

    recognition.onend = () => {
      if (orbStateRef.current === "listening") {
        voiceConversationActive.current = false
        updateOrbState("idle")
      }
    }
  }, [hasEndpoint, speechSupported, updateOrbState, handleVoiceSubmit])

  // Keep ref updated so speakResponse can call it
  useEffect(() => {
    startVoiceConversationRef.current = startVoiceConversation
  }, [startVoiceConversation])

  // ── Scroll to bottom ─────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [displayMessages])

  // ── Text submit ──────────────────────────────────────────────────────────
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

  const isBusy = status === "streaming" || status === "submitted"

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── No endpoint warning ── */}
      {!hasEndpoint && (
        <div className="mx-auto max-w-3xl w-full px-4 pt-6">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">No gateway endpoint configured</p>
              <p className="text-xs text-muted-foreground mt-1">
                This tenant has no OpenClaw endpoint mapped yet. Chat will be unavailable until an endpoint is configured in Mission Control.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Orb section ── */}
      <section className="relative flex flex-col items-center justify-center px-6 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,hsl(158_60%_40%/0.09),transparent_70%)]" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <JarvisOrb
            state={orbState}
            onClick={hasEndpoint && (orbState === "idle" || orbState === "speaking") ? () => {
              // If speaking and voice conversation active, clicking stops the conversation
              if (orbState === "speaking" && voiceConversationActive.current) {
                voiceConversationActive.current = false
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel()
                }
                updateOrbState("idle")
              } else {
                startVoiceConversation()
              }
            } : undefined}
          />
        </motion.div>

        {/* Click-to-speak hint */}
        <AnimatePresence>
          {(orbState === "idle" || orbState === "speaking") && hasEndpoint && speechSupported && (
            <motion.p
              className="mt-4 text-xs text-muted-foreground/50 select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {orbState === "speaking" ? "Click to interrupt" : "Click the orb to speak"}
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      {/* ── Chat section — always visible ── */}
      <section className="flex-1 flex flex-col px-4 md:px-6 max-w-3xl mx-auto w-full pb-6">
        <motion.div
          className="flex-1 flex flex-col gap-4 mb-6 min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {displayMessages.map((m) => (
            <MessageBubble key={m.id} role={m.role} content={getMessageText(m)} />
          ))}
          <div ref={messagesEndRef} />
        </motion.div>

        <form onSubmit={handleFormSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={hasEndpoint ? "Message Jarvis…" : "No endpoint configured"}
              disabled={isBusy || !hasEndpoint}
              className={cn(
                "w-full rounded-2xl border border-border/60 bg-card px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40",
                "transition-all duration-200",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                // Extra right padding to make room for mic icon
                speechSupported && "pr-12"
              )}
              autoComplete="off"
            />
            {/* Mic icon inside input */}
            {speechSupported && hasEndpoint && (
              <button
                type="button"
                onClick={startVoiceConversation}
                disabled={isBusy || orbState === "listening" || orbState === "thinking"}
                title={orbState === "speaking" ? "Click to interrupt" : "Click to speak"}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "p-1.5 rounded-xl transition-all duration-200",
                  orbState === "listening"
                    ? "text-accent animate-pulse"
                    : "text-muted-foreground/50 hover:text-accent hover:bg-accent/10",
                  "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                <Mic className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isBusy || !hasEndpoint}
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
    </div>
  )
}
