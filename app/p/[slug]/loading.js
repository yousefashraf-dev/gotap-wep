export default function Loading() {
  return (
    <main className="relative min-h-dvh bg-[#12131A] flex flex-col overflow-x-hidden">

      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[75%] aspect-square rounded-full bg-cyan-500/5 blur-[180px]" />
        <div className="absolute -bottom-24 -right-24 w-[65%] aspect-square rounded-full bg-purple-600/5 blur-[180px]" />
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(34,211,238,0.5) 1px, rgba(34,211,238,0.5) 2px)' }} />

      <header className="relative z-10 pt-8 pb-1">
        <p className="text-center text-[8px] font-mono tracking-[0.35em] uppercase text-gray-600">
          GoTap.eg Terminal
        </p>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center px-5 pt-6 pb-4 max-w-sm mx-auto w-full">

        {/* Skeleton avatar */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full border-2 border-white/[0.06] bg-white/[0.02] animate-pulse" />
        </div>

        {/* Skeleton name */}
        <div className="h-6 w-44 rounded-md bg-white/[0.04] animate-pulse mt-1 mb-7" />

        {/* Skeleton buttons */}
        <div className="grid grid-cols-2 gap-2.5 w-full">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-[#1F222F] border-2 border-white/[0.04] py-3.5 px-4 flex flex-col items-center gap-2 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-5 h-5 rounded-full bg-white/[0.05]" />
              <div className="h-3 w-16 rounded bg-white/[0.05]" />
            </div>
          ))}
        </div>
      </div>

      <footer className="relative z-10 mt-auto pb-6 text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1F222F]/40 border border-white/[0.04] animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-white/[0.05]" />
          <div className="h-2.5 w-32 rounded bg-white/[0.05]" />
        </div>
      </footer>

    </main>
  )
}
