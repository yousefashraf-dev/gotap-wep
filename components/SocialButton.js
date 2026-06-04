'use client'

import { ArrowUpRight } from 'lucide-react'

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
      rel="noopener noreferrer"
      className="relative rounded-lg border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] shadow-black/50 py-3.5 px-4 flex flex-col items-center gap-2 text-white/80 hover:text-white hover:bg-white/[0.04] hover:border-white/20 active:scale-[0.98] transition-all duration-200 group"
    >
      <ArrowUpRight size={12} className="absolute top-2 right-2 text-white/15 group-hover:text-white/50 transition-colors" />
      <div className={`${iconColor} w-4 h-4 flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </a>
  )
}
