import { notFound } from 'next/navigation'
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
  if (key === 'phone') return `tel:${clean.replace(/[^0-9+]/g, '')}`
  if (key === 'whatsapp') return `https://wa.me/${clean.replace(/^0/, '20').replace(/^\+/, '').replace(/[^0-9]/g, '')}`
  if (key === 'tiktok') return `https://tiktok.com/@${clean}`
  if (key === 'instagram') return `https://instagram.com/${clean}`
  if (key === 'facebook') return `https://facebook.com/${clean}`
  return clean
}

function getAppDeepLink(key, value) {
  if (!value) return null
  const clean = extractHandle(value)
  if (key === 'instagram') return `instagram://user?username=${clean}`
  if (key === 'tiktok') return `snssdk1128://user/profile/${clean}`
  if (key === 'facebook') return `fb://profile/${clean}`
  return null
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
  const hasLinks = p.instagram || p.tiktok || p.facebook || p.whatsapp || p.phone

  return (
    <main className="relative min-h-dvh bg-[#050505] overflow-hidden flex flex-col">

      {/* Radial glow background */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[80%] aspect-square rounded-full bg-purple-600/10 blur-[200px]" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[70%] aspect-square rounded-full bg-pink-600/5 blur-[180px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-2">
        <p className="text-center text-xs font-light tracking-[0.3em] uppercase text-gray-500">
          GoTap.eg
        </p>
      </header>

      {/* Profile Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-6 pb-8 max-w-sm mx-auto w-full">

        {/* Avatar */}
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

        {/* Name */}
        <h1 className="text-2xl font-bold tracking-tight text-white mt-4 mb-8 text-center">
          {p.name}
        </h1>

        {/* Social Buttons — absolute conditional rendering */}
        {hasLinks && (
          <div className="w-full space-y-3">
            {p.instagram && (
              <SocialButton
                href={resolve('instagram', p.instagram)}
                appDeepLink={getAppDeepLink('instagram', p.instagram)}
                label="Instagram"
                icon={InstagramIcon}
                iconColor="text-pink-400"
              />
            )}
            {p.tiktok && (
              <SocialButton
                href={resolve('tiktok', p.tiktok)}
                appDeepLink={getAppDeepLink('tiktok', p.tiktok)}
                label="TikTok"
                icon={TikTokIcon}
                iconColor="text-cyan-400"
              />
            )}
            {p.facebook && (
              <SocialButton
                href={resolve('facebook', p.facebook)}
                appDeepLink={getAppDeepLink('facebook', p.facebook)}
                label="Facebook"
                icon={FacebookIcon}
                iconColor="text-blue-500"
              />
            )}
            {p.whatsapp && (
              <SocialButton
                href={resolve('whatsapp', p.whatsapp)}
                label="WhatsApp"
                icon={MessageCircle}
                iconColor="text-[#25D366]"
              />
            )}
            {p.phone && (
              <SocialButton
                href={resolve('phone', p.phone)}
                label="Phone"
                icon={Phone}
                iconColor="text-sky-400"
              />
            )}
          </div>
        )}

        {/* Empty state */}
        {!hasLinks && (
          <div className="text-center py-8">
            <p className="text-gray-700 text-sm">No links available</p>
          </div>
        )}
      </div>

      {/* Brand Footer */}
      <footer className="relative z-10 pb-6 text-center">
        <BrandBadge />
      </footer>

    </main>
  )
}
