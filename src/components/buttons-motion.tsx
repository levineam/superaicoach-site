'use client'

import { useEffect } from 'react'

/**
 * Click feedback for andrarchy buttons (ported from andrarchy.com assets/buttons.js).
 * Ticks pinch in on press and spring out on click. Also sends a GA event for
 * elements with data-track when GA is configured.
 */
export function ButtonsMotion() {
  useEffect(() => {
    const SELECTOR = '.ab-btn'
    const HOLD_MS = 200
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let pending: ReturnType<typeof setTimeout> | undefined
    const buttonFrom = (e: Event) =>
      e.target instanceof Element ? (e.target.closest(SELECTOR) as HTMLAnchorElement | null) : null
    const release = () =>
      document.querySelectorAll('.ab-press').forEach((b) => b.classList.remove('ab-press'))

    const onDown = (e: PointerEvent) => {
      const b = buttonFrom(e)
      if (!b || e.button !== 0) return
      b.classList.remove('ab-pop')
      b.classList.add('ab-press')
    }
    const onClick = (e: MouseEvent) => {
      const b = buttonFrom(e)
      if (!b) return
      const track = b.getAttribute('data-track')
      if (track) {
        const w = window as unknown as { gtag?: (...args: unknown[]) => void }
        w.gtag?.('event', track, { link_url: b.href, page_path: location.pathname })
      }
      b.classList.remove('ab-press', 'ab-pop')
      void b.offsetWidth
      b.classList.add('ab-pop')
      if (reduce.matches || e.defaultPrevented || b.tagName !== 'A') return
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if ((b.target && b.target !== '_self') || b.hasAttribute('download')) return
      const url = new URL(b.href, location.href)
      if (url.origin !== location.origin) return
      if (url.pathname === location.pathname && url.search === location.search) return
      e.preventDefault()
      clearTimeout(pending)
      pending = setTimeout(() => location.assign(url.href), HOLD_MS)
    }
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === 'ab-pop-tl') (e.target as Element).classList.remove('ab-pop')
    }
    const onShow = () =>
      document
        .querySelectorAll('.ab-pop, .ab-press')
        .forEach((b) => b.classList.remove('ab-pop', 'ab-press'))

    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', release)
    document.addEventListener('pointercancel', release)
    document.addEventListener('dragstart', release)
    document.addEventListener('click', onClick)
    document.addEventListener('animationend', onEnd)
    window.addEventListener('pageshow', onShow)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', release)
      document.removeEventListener('pointercancel', release)
      document.removeEventListener('dragstart', release)
      document.removeEventListener('click', onClick)
      document.removeEventListener('animationend', onEnd)
      window.removeEventListener('pageshow', onShow)
      clearTimeout(pending)
    }
  }, [])
  return null
}
