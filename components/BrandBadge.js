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
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/[0.1] rounded-full backdrop-blur-md text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all text-[11px] tracking-[0.15em] uppercase font-light"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
      </svg>
      <span>Powered by GoTap.eg</span>
    </a>
  )
}
