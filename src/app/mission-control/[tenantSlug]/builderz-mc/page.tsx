'use client';

export default function BuilderzMCPage() {
  const builderzUrl = process.env.NEXT_PUBLIC_BUILDERZ_MC_URL || 'http://localhost:3001';

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <div>
          <h1 className="text-lg font-semibold">Builderz Mission Control</h1>
          <p className="text-xs text-muted-foreground">
            Embedded from{' '}
            <a
              href={builderzUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {builderzUrl}
            </a>
          </p>
        </div>
        <a
          href={builderzUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Open in new tab ↗
        </a>
      </div>
      <p className="text-xs text-muted-foreground px-4 pt-1">
        If the frame is blank, Builderz MC may block embedding. Use &quot;Open in new tab&quot; above.
      </p>
      <iframe
        src={builderzUrl}
        className="flex-1 w-full border-0"
        title="Builderz Mission Control"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
