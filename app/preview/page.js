import InstagramIcon from '@/components/icons/InstagramIcon'
import TikTokIcon from '@/components/icons/TikTokIcon'
import FacebookIcon from '@/components/icons/FacebookIcon'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import PhoneIcon from '@/components/icons/PhoneIcon'

const demo = {
  name: 'Ahmed Hassan',
  slug: 'ahmed',
  instagram: 'ahmed_hassan',
  tiktok: '@ahmedhassan',
  facebook: 'ahmed.hassan',
  whatsapp: '201234567890',
  phone: '201098765432',
}

const order = ['instagram', 'tiktok', 'facebook', 'whatsapp', 'phone']

const platformMeta = {
  instagram: { icon: InstagramIcon, label: 'Instagram', color: 'text-pink-400' },
  tiktok:    { icon: TikTokIcon,    label: 'TikTok',    color: 'text-white/70' },
  facebook:  { icon: FacebookIcon,  label: 'Facebook',  color: 'text-blue-400' },
  whatsapp:  { icon: WhatsAppIcon,  label: 'WhatsApp',  color: 'text-green-400' },
  phone:     { icon: PhoneIcon,     label: 'Phone',     color: 'text-cyan-400' },
}

const links = order
  .map(k => {
    const v = demo[k]
    if (!v) return null
    return { key: k, href: '#', ...platformMeta[k] }
  })
  .filter(Boolean)

export default function PreviewPage() {
  return (
    <main className="relative min-h-dvh bg-[#0A0A0A] overflow-hidden flex flex-col">

      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="absolute top-[-12%] left-[-10%] w-[75%] aspect-square rounded-full bg-[#d4a853]/5 blur-[180px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[65%] aspect-square rounded-full bg-purple-600/5 blur-[160px]" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[60%] h-[35%] rounded-full bg-white/[0.015] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 max-w-sm mx-auto w-full">
        <span className="text-gray-500 text-xs tracking-widest uppercase">
          GoTap.eg
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-gray-600" />
          <span className="text-gray-600 text-xs font-light">/&thinsp;{demo.slug}</span>
        </div>
      </header>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-5 pb-6">
        <div className="w-full max-w-sm">

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-1 ring-white/10 shadow-xl shadow-black/40 bg-white/[0.03] flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/25"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>

          {/* Name */}
          <h1 className="text-center text-2xl font-semibold text-white tracking-tight mb-6">
            {demo.name}
          </h1>

          {/* Buttons */}
          {links.length > 0 && (
            <div className="space-y-3">
              {links.map(l => (
                <a
                  key={l.key}
                  href={l.href}
                  className="group flex items-center gap-4 w-full bg-white/[0.04] backdrop-blur-lg border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/15 active:scale-[0.98] rounded-xl py-3.5 px-4 transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center ${l.color} group-hover:scale-110 transition-transform duration-200`}>
                    <l.icon size={19} />
                  </div>
                  <span className="text-white/70 text-sm font-medium tracking-wide group-hover:text-white/90 transition-colors">
                    {l.label}
                  </span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="ml-auto text-white/20 group-hover:text-white/40 transition-colors"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          )}

          {links.length === 0 && (
            <div className="text-center py-8">
              <p className="text-zinc-700 text-sm">No links available</p>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 flex justify-end px-5 pb-6 max-w-sm mx-auto w-full">
        <a
          href="https://instagram.com/gotap.eg"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-400 text-[10px] tracking-wider transition-colors"
        >
          <InstagramIcon size={12} />
          <span>Powered by GoTap.eg</span>
        </a>
      </footer>

    </main>
  )
}
