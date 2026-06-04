'use client'

export default function BrandBadge() {
  const webUrl = 'https://www.instagram.com/gotap_eg?igsh=bW1pdGN4ZGZ0N2E5&utm_source=qr'
  const appDeepLink = 'instagram://user?username=gotap_eg'

  function handleClick(e) {
    e.preventDefault()
    const fallbackTimer = setTimeout(() => {
      window.location.href = webUrl
    }, 600)
    window.location.href = appDeepLink
    const clear = () => { clearTimeout(fallbackTimer); document.removeEventListener('visibilitychange', clear) }
    document.addEventListener('visibilitychange', clear)
  }

  return (
    <a
      href={appDeepLink}
      onClick={handleClick}
      className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1F222F]/60 border border-cyan-400/20 transition-all duration-200 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)]"
    >
      {/* Pulsing dot */}
      <span className="relative w-1.5 h-1.5 rounded-full bg-cyan-400/50 group-hover:bg-cyan-400 transition-colors duration-200">
        <span className="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping" />
      </span>

      <span className="text-[8px] font-mono tracking-[0.25em] uppercase text-gray-500 group-hover:text-gray-300 transition-colors duration-200">
        Powered by GoTap.eg
      </span>

      {/* Neon cyan Instagram icon */}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400/50 group-hover:text-cyan-400 transition-colors duration-200">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
      </svg>

      {/* Micro chevron indicator */}
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 group-hover:text-cyan-400 translate-x-0 group-hover:translate-x-0.5 transition-all duration-200">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </a>
  )
}
