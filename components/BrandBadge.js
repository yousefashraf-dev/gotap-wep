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
      className="group inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.02] border border-white/[0.06] rounded-full backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 group-hover:bg-cyan-400 transition-colors duration-300" />
      <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-gray-600 group-hover:text-gray-400 transition-colors duration-300">
        Powered by GoTap.eg
      </span>
    </a>
  )
}
