import { db } from '@/lib/firebaseAdmin'
import { Phone, MessageCircle } from 'lucide-react'
import SocialButton from '@/components/SocialButton'
import BrandBadge from '@/components/BrandBadge'

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4h4a4 4 0 0 0 4 4" />
    </svg>
  )
}

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function extractHandle(value) {
  let v = (value || '').trim().replace(/^@/, '')
  if (v.includes('/') || v.includes('.')) {
    try {
      const url = new URL(v.startsWith('http') ? v : `https://${v}`)
      const parts = url.pathname.replace(/\/+$/, '').split('/')
      return parts[parts.length - 1] || v
    } catch {
      const parts = v.replace(/\/+$/, '').split('/')
      return parts[parts.length - 1] || v
    }
  }
  return v
}

function resolve(key, value) {
  if (!value) return null
  const clean = extractHandle(value)
  switch (key) {
    case 'phone':
      return `tel:${clean.replace(/[^0-9+]/g, '')}`
    case 'whatsapp':
      return `https://wa.me/${clean.replace(/^0/, '20').replace(/^\+/, '').replace(/[^0-9]/g, '')}`
    case 'tiktok':
      return `https://tiktok.com/@${clean}`
    case 'instagram':
      return `https://instagram.com/${clean}`
    case 'facebook':
      return `https://facebook.com/${clean}`
    default:
      return clean
  }
}

function getAppDeepLink(key, value) {
  if (!value) return null
  const clean = extractHandle(value)
  switch (key) {
    case 'instagram':
      return `instagram://user?username=${clean}`
    case 'tiktok':
      return `snssdk1128://user/profile/${clean}`
    case 'facebook':
      return `fb://profile/${clean}`
    default:
      return null
  }
}

export async function generateMetadata({ params }) {
  const slug = (await params).slug
  if (!db) return { title: 'GoTap.eg' }
  try {
    const doc = await db.collection('profiles').doc(slug).get()
    if (!doc.exists) return { title: 'Not Found' }
    const d = doc.data()
    return {
      title: `${d.name} · GoTap.eg`,
      description: `Connect with ${d.name}`,
      openGraph: d.imageUrl ? { images: [d.imageUrl] } : undefined,
    }
  } catch {
    return { title: 'GoTap.eg' }
  }
}

export default async function ProfilePage({ params }) {
  const slug = (await params).slug

  if (!db) {
    return (
      <main className="min-h-dvh bg-[#12131A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border border-cyan-400/40 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-xs font-mono tracking-widest uppercase">Connection lost</p>
        </div>
      </main>
    )
  }

  let doc
  try {
    doc = await db.collection('profiles').doc(slug).get()
  } catch {
    return (
      <main className="min-h-dvh bg-[#12131A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-amber-400/40 animate-pulse" />
          <p className="text-gray-500 text-xs font-mono tracking-widest uppercase">Profile unavailable</p>
        </div>
      </main>
    )
  }

  if (!doc.exists) {
    return (
      <main className="min-h-dvh bg-[#12131A] flex items-center justify-center">
        <p className="text-gray-500 text-xs font-mono tracking-widest uppercase">Profile not found</p>
      </main>
    )
  }

  const p = doc.data()

  const links = [
    p.instagram && { key: 'instagram', label: 'Instagram', icon: <InstagramIcon />, color: 'text-pink-400', href: resolve('instagram', p.instagram), appDeepLink: getAppDeepLink('instagram', p.instagram) },
    p.tiktok && { key: 'tiktok', label: 'TikTok', icon: <TikTokIcon />, color: 'text-cyan-400', href: resolve('tiktok', p.tiktok), appDeepLink: getAppDeepLink('tiktok', p.tiktok) },
    p.facebook && { key: 'facebook', label: 'Facebook', icon: <FacebookIcon />, color: 'text-blue-500', href: resolve('facebook', p.facebook), appDeepLink: getAppDeepLink('facebook', p.facebook) },
    p.whatsapp && { key: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={16} />, color: 'text-emerald-400', href: resolve('whatsapp', p.whatsapp) },
    p.phone && { key: 'phone', label: 'Phone', icon: <Phone size={16} />, color: 'text-sky-400', href: resolve('phone', p.phone) },
  ].filter(Boolean)

  return (
    <main className="relative min-h-dvh bg-[#12131A] flex flex-col overflow-x-hidden">

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[75%] aspect-square rounded-full bg-cyan-500/5 blur-[180px]" />
        <div className="absolute -bottom-24 -right-24 w-[65%] aspect-square rounded-full bg-purple-600/5 blur-[180px]" />
      </div>

      {/* Scan-line texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(34,211,238,0.5) 1px, rgba(34,211,238,0.5) 2px)' }} />

      <header className="relative z-10 pt-8 pb-1">
        <p className="text-center text-[8px] font-mono tracking-[0.35em] uppercase text-gray-600">
          GoTap.eg Terminal
        </p>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center px-5 pt-6 pb-4 max-w-sm mx-auto w-full">

        {/* Avatar with breathing neon ring */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 rounded-full bg-cyan-400/10 animate-pulse blur-md" />
          <div className="relative w-28 h-28 rounded-full border-2 border-cyan-400/70 shadow-[0_0_18px_rgba(34,211,238,0.25)] bg-[#1A1C24]">
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-500">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Name with neon glow */}
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white text-center mt-1 mb-7 [text-shadow:0_0_20px_rgba(34,211,238,0.25),0_0_40px_rgba(34,211,238,0.08)]">
          {p.name}
        </h1>

        {/* Social links grid */}
        {links.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5 w-full">
            {links.map((link) => (
              <SocialButton
                key={link.key}
                href={link.href}
                appDeepLink={link.appDeepLink}
                label={link.label}
                icon={link.icon}
                iconColor={link.color}
              />
            ))}
          </div>
        )}

        {links.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-xs font-mono tracking-wider">No links configured</p>
          </div>
        )}
      </div>

      <footer className="relative z-10 mt-auto pb-6 text-center">
        <BrandBadge />
      </footer>

    </main>
  )
}
