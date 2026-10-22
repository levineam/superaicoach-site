'use client'

import { useRef, useState } from 'react'

/** Copies a skill's prompt. If the clipboard is blocked, opens and selects the text instead. */
export function CopyPrompt({ prompt, slug }: { prompt: string; slug: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'select'>('idle')
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const preRef = useRef<HTMLPreElement>(null)

  const copy = async () => {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    w.gtag?.('event', 'skill_copy_prompt', { skill: slug })
    try {
      await navigator.clipboard.writeText(prompt)
      setStatus('copied')
    } catch {
      if (detailsRef.current) detailsRef.current.open = true
      const pre = preRef.current
      if (pre) {
        const range = document.createRange()
        range.selectNodeContents(pre)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(range)
      }
      setStatus('select')
    }
  }

  return (
    <div className="copy-prompt">
      <button type="button" className="ab-btn ab-secondary" onClick={copy}>
        <span className="ab-label">{status === 'copied' ? 'Copied' : 'Copy the prompt'}</span>
        <span className="ab-arrow" aria-hidden="true">
          {status === 'copied' ? '✓' : '⧉'}
        </span>
      </button>
      <p className="mono copy-status" role="status">
        {status === 'copied' && 'Paste it into a new chat in any AI app, then add your details.'}
        {status === 'select' && 'Your browser blocked copying. The prompt is selected below; copy it from there.'}
      </p>
      <details ref={detailsRef} className="prompt-text">
        <summary className="mono">Read the prompt</summary>
        <pre ref={preRef}>{prompt}</pre>
      </details>
    </div>
  )
}
