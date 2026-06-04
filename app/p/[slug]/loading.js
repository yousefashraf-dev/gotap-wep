export default function Loading() {
  return (
    <main className="relative min-h-dvh bg-[#0F111A] overflow-hidden flex flex-col">

      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[70%] aspect-square rounded-full bg-purple-600/8 blur-[200px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60%] aspect-square rounded-full bg-cyan-600/5 blur-[200px]" />
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(6,182,212,0.4) 1px, rgba(6,182,212,0.4) 2px)' }} />

      <header className="relative z-10 pt-6 pb-2">
        <p className="text-center text-[9px] font-mono tracking-[0.35em] uppercase text-gray-600">
          GoTap.eg Terminal
        </p>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-6 pb-8 max-w-sm mx-auto w-full">

        {/* Skeleton avatar */}
        <div className="relative mb-5">
          <div className="w-28 h-28 rounded-full bg-white/[0.03] border border-white/[0.05] animate-pulse" />
        </div>

        {/* Skeleton name */}
        <div className="h-7 w-44 rounded-md bg-white/[0.04] animate-pulse mt-2 mb-8" />

        {/* Skeleton buttons */}
        <div className="grid grid-cols-2 gap-2.5 w-full">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.04] bg-white/[0.01] py-3.5 px-4 flex flex-col items-center gap-2 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-5 h-5 rounded-full bg-white/[0.04]" />
              <div className="h-3 w-16 rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>
      </div>

      <footer className="relative z-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.01] border border-white/[0.04] animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-white/[0.04]" />
          <div className="h-3 w-36 rounded bg-white/[0.04]" />
        </div>
      </footer>

    </main>
  )
}
