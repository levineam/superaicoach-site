'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Bot, Loader2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------

function MessageBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  const isUser = role === 'user'
  return (
    <motion.div
      className={cn('flex gap-2 max-w-full', isUser ? 'flex-row-reverse' : 'flex-row')}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {!isUser && (
        <div className="flex-shrink-0 flex items-end">
          <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-[10px] font-bold shadow-sm">
            J
          </div>
        </div>
      )}
      <div
        className={cn(
          'rounded-xl px-3 py-2 text-sm leading-relaxed max-w-[85%]',
          isUser
            ? 'bg-accent text-accent-foreground rounded-br-sm'
            : 'bg-muted/60 border border-border/50 text-foreground rounded-bl-sm',
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
      .filter((p) => p.type === 'text')
      .map((p) => p.text ?? '')
      .join('')
  }
  return message.content ?? ''
}

// ---------------------------------------------------------------------------
// Suggested starters — workspace-aware
// ---------------------------------------------------------------------------

const STARTERS = [
  "What needs my attention most urgently?",
  "Summarize what's in queue right now.",
  "What's blocked and waiting on me?",
  "What should I focus on today?",
]

// ---------------------------------------------------------------------------
// ConnectorSidepanel
// ---------------------------------------------------------------------------

interface ConnectorSidepanelProps {
  tenantSlug: string
  isOpen: boolean
  onClose: () => void
}

export function ConnectorSidepanel({ tenantSlug, isOpen, onClose }: ConnectorSidepanelProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/mission-control/connector/chat',
        headers: { 'x-tenant-slug': tenantSlug },
      }),
    [tenantSlug],
  )

  const { messages, status, sendMessage, setMessages } = useChat({ transport })
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasMessages = messages.length > 0
  const isBusy = status === 'streaming' || status === 'submitted'

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const onSubmit = useCallback(
    (textOverride?: string) => {
      const text = textOverride ?? input
      if (!text.trim() || isBusy) return
      sendMessage({ text })
      setInput('')
    },
    [input, isBusy, sendMessage],
  )

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  const handleClear = useCallback(() => {
    setMessages([])
    setInput('')
  }, [setMessages])

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return undefined
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape, isOpen])

  // Combine greeting + chat messages for display
  const displayMessages: Message[] = useMemo(() => {
    const greeting: Message = {
      id: 'greeting',
      role: 'assistant',
      content: "I'm looking at your board right now. Ask me anything about what's there.",
    }
    return [
      greeting,
      ...messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: getMessageText(m),
      })),
    ]
  }, [messages])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile only) */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={cn(
              'fixed right-0 top-0 bottom-0 z-50',
              'w-full sm:w-[380px]',
              'flex flex-col bg-background border-l border-border shadow-2xl',
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50">
              <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold shadow-sm flex-shrink-0">
                J
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Jarvis</p>
                <p className="text-[11px] text-muted-foreground/60 uppercase tracking-widest">
                  Workspace · Connected
                </p>
              </div>
              <div className="flex items-center gap-1">
                {hasMessages && (
                  <button
                    onClick={handleClear}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-border/40 transition-colors"
                    title="Clear conversation"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-border/40 transition-colors"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0">
              {displayMessages.map((m) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isBusy && (
                  <motion.div
                    className="flex gap-2"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-[10px] font-bold flex-shrink-0">
                      J
                    </div>
                    <div className="rounded-xl rounded-bl-sm bg-muted/60 border border-border/50 px-3 py-2 flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                      <span className="text-xs text-muted-foreground">Thinking…</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Starters (shown before first user message) */}
            <AnimatePresence>
              {!hasMessages && (
                <motion.div
                  className="px-4 pb-2 flex flex-col gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-[11px] text-muted-foreground/50 uppercase tracking-widest mb-1">
                    Suggested
                  </p>
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => onSubmit(s)}
                      disabled={isBusy}
                      className="text-left rounded-lg border border-border/50 bg-card/60 px-3 py-2 text-xs text-muted-foreground hover:border-accent/30 hover:text-foreground hover:bg-card transition-all disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-border bg-card/30">
              <form onSubmit={handleFormSubmit} className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your board…"
                    disabled={isBusy}
                    className={cn(
                      'w-full rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground',
                      'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40',
                      'transition-all duration-200',
                      'disabled:opacity-60 disabled:cursor-not-allowed',
                    )}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isBusy}
                  className={cn(
                    'flex-shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl',
                    'bg-accent text-accent-foreground shadow-sm shadow-accent/20',
                    'transition-all duration-200',
                    'hover:bg-accent/90 active:scale-95',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
                  )}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Toggle button — for use in the Project Board header
// ---------------------------------------------------------------------------

interface ConnectorToggleButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function ConnectorToggleButton({ isOpen, onClick, className }: ConnectorToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      title={isOpen ? 'Close Jarvis' : 'Ask Jarvis about this board'}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200',
        isOpen
          ? 'border-accent bg-accent/10 text-accent hover:bg-accent/20'
          : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-border/20',
        className,
      )}
    >
      <Bot className="h-4 w-4" />
      <span className="hidden sm:inline">Ask Jarvis</span>
    </button>
  )
}
