'use client'

export default function SocialButton({ href, appDeepLink, label, icon, iconColor }) {
  function handleClick(e) {
    if (appDeepLink) {
      e.preventDefault()
      const fallbackTimer = setTimeout(() => {
        window.location.href = href
      }, 600)
      window.location.href = appDeepLink
      const clear = () => { clearTimeout(fallbackTimer); document.removeEventListener('visibilitychange', clear) }
      document.addEventListener('visibilitychange', clear)
    }
  }

  return (
    <a
      href={appDeepLink || href}
      onClick={handleClick}
      target={appDeepLink ? undefined : '_blank'}
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-[1px] transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-[0.97]"
    >
      {/* Hover glow gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />

      <div className="relative flex flex-col items-center gap-2 py-3.5 px-4">
        {/* Scan corner accents */}
        <span className="absolute top-0 left-0 w-4 h-[1px] bg-cyan-400/0 group-hover:bg-cyan-400/40 transition-colors duration-300" />
        <span className="absolute top-0 right-0 w-[1px] h-4 bg-cyan-400/0 group-hover:bg-cyan-400/40 transition-colors duration-300" />
        <span className="absolute bottom-0 right-0 w-4 h-[1px] bg-cyan-400/0 group-hover:bg-cyan-400/40 transition-colors duration-300" />
        <span className="absolute bottom-0 left-0 w-[1px] h-4 bg-cyan-400/0 group-hover:bg-cyan-400/40 transition-colors duration-300" />

        <div className={`${iconColor} w-5 h-5 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
        <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/70 group-hover:text-white transition-colors duration-300">
          {label}
        </span>
      </div>
    </a>
  )
}
