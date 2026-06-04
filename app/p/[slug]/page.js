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
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Profile unavailable</p>
      </main>
    )
  }

  let doc
  try {
    doc = await db.collection('profiles').doc(slug).get()
  } catch {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Profile unavailable</p>
      </main>
    )
  }

  if (!doc.exists) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Profile not found</p>
      </main>
    )
  }

  const p = doc.data()

  const links = [
    p.instagram && { key: 'instagram', label: 'Instagram', icon: <InstagramIcon />, color: 'text-pink-400', href: resolve('instagram', p.instagram), appDeepLink: getAppDeepLink('instagram', p.instagram) },
    p.tiktok && { key: 'tiktok', label: 'TikTok', icon: <TikTokIcon />, color: 'text-cyan-400', href: resolve('tiktok', p.tiktok), appDeepLink: getAppDeepLink('tiktok', p.tiktok) },
    p.facebook && { key: 'facebook', label: 'Facebook', icon: <FacebookIcon />, color: 'text-blue-500', href: resolve('facebook', p.facebook), appDeepLink: getAppDeepLink('facebook', p.facebook) },
    p.whatsapp && { key: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={14} />, color: 'text-[#25D366]', href: resolve('whatsapp', p.whatsapp) },
    p.phone && { key: 'phone', label: 'Phone', icon: <Phone size={14} />, color: 'text-sky-400', href: resolve('phone', p.phone) },
  ].filter(Boolean)

  return (
    <main className="relative min-h-dvh bg-[#050505] overflow-hidden flex flex-col">

      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[80%] aspect-square rounded-full bg-purple-600/10 blur-[200px]" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[70%] aspect-square rounded-full bg-pink-600/5 blur-[180px]" />
      </div>

      <header className="relative z-10 pt-8 pb-2">
        <p className="text-center text-xs font-light tracking-[0.3em] uppercase text-gray-500">
          GoTap.eg
        </p>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-6 pb-8 max-w-sm mx-auto w-full">

        <div className="mb-6">
          {p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt={p.name}
              className="rounded-full w-28 h-28 object-cover mx-auto ring-2 ring-white/10 shadow-2xl shadow-black"
            />
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-full w-28 h-28 flex items-center justify-center mx-auto">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mt-4 mb-8 text-center">
          {p.name}
        </h1>

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
            <p className="text-gray-700 text-sm">No links available</p>
          </div>
        )}
      </div>

      <footer className="relative z-10 pb-6 text-center">
        <BrandBadge />
      </footer>

    </main>
  )
}
