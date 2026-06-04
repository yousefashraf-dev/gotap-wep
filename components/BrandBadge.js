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
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 group-hover:bg-cyan-400 transition-colors duration-200" />
      <span className="text-[8px] font-mono tracking-[0.25em] uppercase text-gray-500 group-hover:text-gray-300 transition-colors duration-200">
        Powered by GoTap.eg
      </span>
    </a>
  )
}
