/** Static "session loop" figure: show, listen, set up, adjust. Echoes the andrarchy dial. */
export function HeroLoop() {
  const points = [
    { label: 'SHOW', x: 230, y: 40, anchor: 'middle' as const, ty: -14 },
    { label: 'LISTEN', x: 420, y: 230, anchor: 'start' as const, tx: 14 },
    { label: 'SET UP', x: 230, y: 420, anchor: 'middle' as const, ty: 26 },
    { label: 'ADJUST', x: 40, y: 230, anchor: 'end' as const, tx: -14 },
  ]
  return (
    <svg viewBox="-40 -20 540 500" role="img" aria-label="A repeating loop: show, listen, set up, adjust">
      <g fill="none" stroke="#3a3d2f">
        <circle cx="230" cy="230" r="190" />
        <circle cx="230" cy="230" r="128" />
        <circle cx="230" cy="230" r="64" />
        <line x1="230" y1="20" x2="230" y2="440" />
        <line x1="20" y1="230" x2="440" y2="230" />
      </g>
      <g stroke="#9ba078">
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2
          const r1 = 190
          const r2 = i % 4 === 0 ? 178 : 184
          return (
            <line
              key={i}
              x1={230 + Math.cos(a) * r1}
              y1={230 + Math.sin(a) * r1}
              x2={230 + Math.cos(a) * r2}
              y2={230 + Math.sin(a) * r2}
            />
          )
        })}
      </g>
      <path
        d="M 230 40 A 190 190 0 1 1 41 250"
        fill="none"
        stroke="#e5fa83"
        strokeWidth="2"
      />
      <path d="M 41 250 l -7 -12 M 41 250 l 12 -6" stroke="#e5fa83" strokeWidth="2" fill="none" />
      {points.map((p) => (
        <g key={p.label}>
          <rect x={p.x - 6} y={p.y - 6} width="12" height="12" fill="#11120f" stroke="#e5fa83" />
          <text
            x={p.x + (p.tx ?? 0)}
            y={p.y + (p.ty ?? 4)}
            textAnchor={p.anchor}
            fill="#eae9d9"
            fontFamily="'Courier New', Courier, monospace"
            fontSize="13"
            letterSpacing="2"
          >
            {p.label}
          </text>
        </g>
      ))}
      <text
        x="230"
        y="236"
        textAnchor="middle"
        fill="#e5fa83"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="22"
      >
        repeat
      </text>
    </svg>
  )
}
