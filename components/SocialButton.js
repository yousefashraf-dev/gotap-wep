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
      className="group flex flex-col items-center gap-2 rounded-xl bg-[#1F222F] border-2 border-cyan-400/70 py-3.5 px-4 transition-all duration-200 active:scale-[0.97] hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.35)]"
    >
      <div className={`${iconColor} w-5 h-5 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}>
        {icon}
      </div>
      <span className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/80 group-hover:text-white transition-colors duration-200">
        {label}
      </span>
    </a>
  )
}
