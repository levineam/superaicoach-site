"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { Send, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

// ─── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({
  role,
  content,
  agentInitial,
}: {
  role: string
  content: string
  agentInitial: string
}) {
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
            {agentInitial}
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

function getMessageText(message: {
  parts?: Array<{ type: string; text?: string }>
  content?: string
}): string {
  if (message.parts) {
    return message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("")
  }
  return message.content ?? ""
}

// ─── AgentChat ─────────────────────────────────────────────────────────────────

export interface AgentInfo {
  role: string
  description: string
  icon: LucideIcon
}

interface AgentChatProps {
  tenantSlug: string
  agent: AgentInfo
  hasEndpoint: boolean
}

export function AgentChat({ tenantSlug, agent, hasEndpoint }: AgentChatProps) {
  const systemPrompt = `You are the ${agent.role} on the AI team. ${agent.description} Respond as this specialist — be concise, focused, and helpful.`
  const greeting = `Hello! I'm your ${agent.role}. ${agent.description} How can I help you today?`
  const agentInitial = agent.role[0]?.toUpperCase() ?? "A"

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `/api/mission-control/jarvis/chat`,
        headers: {
          "x-tenant-slug": tenantSlug,
          "x-agent-system-prompt": systemPrompt,
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tenantSlug, agent.role]
  )

  const { messages, status, sendMessage } = useChat({ transport })
  const [input, setInput] = useState("")
  const [speechSupported, setSpeechSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayMessages = useMemo(
    () => [
      { id: "greeting", role: "assistant" as const, content: greeting },
      ...messages,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, agent.role]
  )

  useEffect(() => {
    setSpeechSupported(
      typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    )
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [displayMessages])

  const onSubmit = useCallback(() => {
    const text = input.trim()
    if (!text || !hasEndpoint) return
    sendMessage({ text })
    setInput("")
  }, [input, hasEndpoint, sendMessage])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  const startVoiceInput = useCallback(() => {
    if (!speechSupported || !hasEndpoint) {
      inputRef.current?.focus()
      return
    }

    type SpeechRecognitionCtor = new () => {
      continuous: boolean
      interimResults: boolean
      lang: string
      start(): void
      onresult:
        | ((event: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void)
        | null
      onerror: (() => void) | null
      onend: (() => void) | null
    }

    const SR = (
      (
        window as Window & {
          SpeechRecognition?: SpeechRecognitionCtor
          webkitSpeechRecognition?: SpeechRecognitionCtor
        }
      ).SpeechRecognition ||
      (
        window as Window & {
          SpeechRecognition?: SpeechRecognitionCtor
          webkitSpeechRecognition?: SpeechRecognitionCtor
        }
      ).webkitSpeechRecognition
    ) as SpeechRecognitionCtor

    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"
    recognition.start()

    recognition.onresult = (event) => {
      const transcript: string = event.results[0][0].transcript
      sendMessage({ text: transcript })
      setInput("")
    }

    recognition.onerror = () => {
      /* noop */
    }
  }, [speechSupported, hasEndpoint, sendMessage])

  const isBusy = status === "streaming" || status === "submitted"

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Message list */}
      <div className="flex flex-col gap-3 mb-4 max-h-[28rem] overflow-y-auto pr-1">
        {displayMessages.map((m) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            content={getMessageText(m)}
            agentInitial={agentInitial}
          />
        ))}
        {isBusy && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 flex items-end">
              <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold shadow-sm">
                {agentInitial}
              </div>
            </div>
            <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-card border border-border/60">
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleFormSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hasEndpoint ? `Message ${agent.role}…` : "No endpoint configured"}
            disabled={isBusy || !hasEndpoint}
            className={cn(
              "w-full rounded-2xl border border-border/60 bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40",
              "transition-all duration-200",
              "disabled:opacity-60 disabled:cursor-not-allowed",
              speechSupported && "pr-12"
            )}
            autoComplete="off"
          />
          {speechSupported && hasEndpoint && (
            <button
              type="button"
              onClick={startVoiceInput}
              disabled={isBusy}
              title="Click to speak"
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "p-1.5 rounded-xl transition-all duration-200",
                "text-muted-foreground/50 hover:text-accent hover:bg-accent/10",
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
            "flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-2xl",
            "bg-accent text-accent-foreground shadow-md shadow-accent/20",
            "transition-all duration-200",
            "hover:bg-accent/90 active:scale-95",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </motion.div>
  )
}
