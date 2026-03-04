export default function Loading() {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-background px-6">
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading"
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-end gap-2 text-primary">
          <span
            className="text-8xl animate-bounce"
            style={{ animationDelay: '0ms' }}
          >
            🐾
          </span>
          <span
            className="text-8xl animate-bounce"
            style={{ animationDelay: '150ms' }}
          >
            🐾
          </span>
          <span
            className="text-8xl animate-bounce"
            style={{ animationDelay: '300ms' }}
          >
            🐾
          </span>
        </div>

        <div className="text-center">
          <p
            className="text-3xl font-extrabold tracking-wide"
            style={{
              color: '#fff',
              WebkitTextStroke: '1px #000',
              textShadow: '0 2px 0 rgba(0,0,0,0.35)',
            }}
          >
            Fetching the good stuff…
          </p>
          <p className="text-sm text-muted-foreground">Just a sec while we sniff out your page.</p>
        </div>

        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
