import { ImageResponse } from 'next/og'

export const alt = 'SuperAICoach: one-on-one AI coaching in Philadelphia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: '#11120f',
          color: '#eae9d9',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: '#e5fa83' }}>
          AI COACHING · PHILADELPHIA
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, fontWeight: 700, lineHeight: 0.98, letterSpacing: -4 }}>
          <span>Using AI in your business</span>
          <span style={{ color: '#e5fa83', fontStyle: 'italic', fontWeight: 400, fontFamily: 'Georgia, serif' }}>
            starts with you.
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#9ba078' }}>
          <span>superaicoach.com</span>
          <span>One on one, in person or on video</span>
        </div>
      </div>
    ),
    size,
  )
}
