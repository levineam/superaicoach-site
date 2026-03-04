'use client'

import Script from 'next/script'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null // Safe no-op when not configured
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

// Helper function for custom event tracking
export function trackGA(eventName: string, parameters?: Record<string, unknown>) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return

  try {
    // @ts-expect-error - gtag is loaded dynamically
    window.gtag?.('event', eventName, parameters)
  } catch (error) {
    console.warn('GA tracking error:', error)
  }
}