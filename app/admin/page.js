'use client'

import { useState, useRef } from 'react'
import { saveProfile } from './actions'
import InstagramIcon from '@/components/icons/InstagramIcon'
import TikTokIcon from '@/components/icons/TikTokIcon'
import FacebookIcon from '@/components/icons/FacebookIcon'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import PhoneIcon from '@/components/icons/PhoneIcon'

const platforms = [
  { key: 'instagram', label: 'Instagram', icon: InstagramIcon, hint: 'Username' },
  { key: 'tiktok', label: 'TikTok', icon: TikTokIcon, hint: '@username' },
  { key: 'facebook', label: 'Facebook', icon: FacebookIcon, hint: 'Username' },
  { key: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, hint: 'Phone number' },
  { key: 'phone', label: 'Phone', icon: PhoneIcon, hint: 'Phone number' },
]

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const urlPatterns = {
  instagram: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([^/?]+)/i,
  tiktok: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@?([^/?]+)/i,
  facebook: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([^/?]+)/i,
  whatsapp: /(?:https?:\/\/)?wa\.me\/([^/?]+)/i,
}

function sanitizeSocialInput(key, value) {
  value = value.trim()
  const pattern = urlPatterns[key]
  if (pattern) {
    const match = value.match(pattern)
    if (match) return match[1]
  }
  return value
}

export default function AdminPage() {
  const fileRef = useRef(null)
  const slugLocked = useRef(false)
  const [form, setForm] = useState({
    name: '', slug: '', imageUrl: '',
    instagram: '', tiktok: '', facebook: '', whatsapp: '', phone: '',
  })
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedLink, setSavedLink] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [wasCreated, setWasCreated] = useState(false)
  const [copied, setCopied] = useState(false)

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    setError(''); setSuccess(false); setSavedLink(''); setWasCreated(false); setCopied(false)
  }

  function handleNameChange(value) {
    set('name', value)
    if (!slugLocked.current) {
      set('slug', generateSlug(value))
    }
  }

  function handleSlugChange(value) {
    slugLocked.current = true
    set('slug', value)
  }

  function handleSocialChange(key, value) {
    set(key, sanitizeSocialInput(key, value))
  }

  async function uploadImage(file) {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setForm(f => ({ ...f, imageUrl: data.url }))
      else setError('Upload failed')
    } catch { setError('Upload error')
    } finally { setUploading(false) }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(savedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(false); setSavedLink(''); setWasCreated(false); setCopied(false)
    const name = form.name.trim()
    const slug = form.slug.trim().toLowerCase()
    if (!name || !slug) return setError('NAME and SLUG fields are required')
    if (!/^[a-z0-9_-]+$/.test(slug)) return setError('Use only: a-z, 0-9, hyphens, underscores')

    setSaving(true)
    const res = await saveProfile({
      slug, name, imageUrl: form.imageUrl,
      whatsapp: form.whatsapp.trim(), phone: form.phone.trim(),
      instagram: form.instagram.trim(), facebook: form.facebook.trim(),
      tiktok: form.tiktok.trim(),
    })
    setSaving(false)
    if (res.error) setError(res.error)
    else {
      setSuccess(true)
      setWasCreated(res.created)
      setSavedLink(`https://gotap-wep.vercel.app/p/${res.slug}`)
    }
  }

  const linkText = savedLink

  return (
    <div className="min-h-screen bg-[#0F111A] flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md">

        {/* Glow orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

        <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 shadow-2xl shadow-black/80">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-medium">System Online</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              GoTap<span className="text-cyan-400">.</span>eg
            </h1>
            <p className="text-gray-500 text-xs mt-1.5 font-mono tracking-wider uppercase">NFC Profile Deployment</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Image Upload */}
              <div
                onClick={() => fileRef.current?.click()}
                className={`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 group overflow-hidden
                  ${preview ? 'border-transparent' : 'border-white/[0.08] hover:border-cyan-500/40 bg-black/30'}`}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white text-xs font-medium tracking-wider uppercase">Change photo</span>
                    </div>
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-gray-500 group-hover:text-cyan-400 transition-colors duration-300">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                    </svg>
                    <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">Upload photo</p>
                    <p className="text-gray-600 text-[10px] uppercase tracking-wider">Click to browse</p>
                  </>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-cyan-400 text-[10px] uppercase tracking-wider font-mono">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e => uploadImage(e.target.files[0])} className="hidden" />

              {/* Name */}
              <div>
                <label className="block text-gray-400 text-[10px] mb-1.5 font-mono uppercase tracking-wider">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Ahmed Hassan"
                  className="w-full bg-black/40 border border-white/[0.08] rounded-lg text-white p-3 text-sm outline-none transition-all duration-200 placeholder-gray-700 focus:border-cyan-500/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-gray-400 text-[10px] mb-1.5 font-mono uppercase tracking-wider">
                  Slug <span className="text-cyan-400">*</span>
                </label>
                <div className="flex items-center gap-2 bg-black/40 border border-white/[0.08] rounded-lg p-3 transition-all duration-200 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                  <span className="text-gray-600 text-xs font-mono shrink-0">~/p/</span>
                  <input
                    value={form.slug}
                    onChange={e => handleSlugChange(e.target.value)}
                    placeholder="ahmed-hassan"
                    className="bg-transparent text-white placeholder-gray-700 outline-none flex-1 text-sm"
                  />
                </div>
                <p className="text-gray-600 text-[10px] mt-1 font-mono tracking-wider">Auto-generated from name. Edit to customize.</p>
              </div>

              {/* Social Links */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono">Social Links</h2>
                  <span className="text-gray-600 text-[9px] uppercase tracking-wider font-mono">Optional</span>
                </div>
                <p className="text-gray-600 text-[10px] mb-3 font-mono leading-relaxed">Paste full URLs — usernames are extracted automatically. Empty fields are hidden on the public page.</p>
                <div className="space-y-2">
                  {platforms.map(({ key, label, icon: Icon, hint }) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 bg-black/30 border border-white/[0.05] rounded-lg px-3 py-2.5 transition-all duration-200 focus-within:border-cyan-500/30 focus-within:shadow-[0_0_8px_rgba(6,182,212,0.08)]"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/[0.03] text-gray-600 group-focus-within:text-cyan-400 transition-colors">
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-[9px] uppercase tracking-[0.15em] text-gray-600 font-mono">{label}</label>
                        <input
                          value={form[key]}
                          onChange={e => handleSocialChange(key, e.target.value)}
                          placeholder={hint}
                          className="w-full bg-transparent text-white placeholder-gray-700 outline-none text-sm mt-0.5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-amber-500/10 border border-amber-500/25 rounded-lg px-4 py-3 flex items-start gap-3">
                  <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <p className="text-amber-300 text-xs font-mono">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving || uploading}
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 p-[1px] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <div className="relative flex items-center justify-center gap-2 rounded-[7px] bg-[#0F111A] px-4 py-3 transition-all duration-300 group-hover:bg-transparent group-active:scale-[0.98]">
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-cyan-300 text-sm font-mono tracking-wider">Deploying...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 15v3m0 0v3m0-3h3m-3 0H9m11.1-7.1a5 5 0 00-4.8-6.9c-.3 0-.6 0-.9.1a7 7 0 00-12.5 4.9A5.5 5.5 0 005.5 15H9" />
                      </svg>
                      <span className="text-white text-sm font-medium tracking-wide">Deploy Profile</span>
                    </>
                  )}
                </div>
              </button>
            </form>
          ) : (
            /* ───── SUCCESS STATE ───── */
            <div className="animate-in fade-in duration-500 space-y-6">
              {/* Header badge */}
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-cyan-400 text-xs font-mono tracking-[0.3em] uppercase">SYSTEM {wasCreated ? 'INITIALIZED' : 'SYNCHRONIZED'}</p>
                  <h2 className="text-white text-lg font-bold mt-1 tracking-tight">Profile {wasCreated ? 'Deployed' : 'Updated'}</h2>
                  <p className="text-gray-500 text-xs mt-1 font-mono">NFC link ready for deployment</p>
                </div>
              </div>

              {/* Scan lines */}
              <div className="relative overflow-hidden rounded-xl border border-cyan-500/15 bg-cyan-500/[0.02] p-5">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(6,182,212,0.3) 1px, rgba(6,182,212,0.3) 2px)' }} />
                <div className="relative z-10">
                  <p className="text-gray-500 text-[9px] font-mono uppercase tracking-[0.2em] mb-2">Terminal Link</p>
                  <div className="flex items-center gap-2 bg-black/60 border border-cyan-500/20 rounded-lg p-3">
                    <span className="text-gray-600 text-xs font-mono shrink-0">$</span>
                    <input
                      readOnly
                      value={linkText}
                      className="bg-transparent text-cyan-300 text-sm font-mono outline-none flex-1 truncate"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={copyLink}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-mono tracking-wider transition-all duration-300 active:scale-[0.97] ${copied ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.2)]' : 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:border-cyan-500/30 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'}`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Transferred</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <a
                  href={linkText}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-3 text-sm font-mono tracking-wider text-white transition-all duration-300 active:scale-[0.97] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  <span>Launch Profile</span>
                </a>
              </div>

              {/* Create another */}
              <div className="text-center pt-2">
                <button
                  onClick={() => { setSuccess(false); setSavedLink(''); setWasCreated(false); setCopied(false); setForm({ name: '', slug: '', imageUrl: '', instagram: '', tiktok: '', facebook: '', whatsapp: '', phone: '' }); setPreview(null); slugLocked.current = false }}
                  className="text-gray-600 hover:text-gray-400 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors"
                >
                  &lsaquo; Deploy Another Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[9px] text-gray-700 font-mono tracking-wider mt-6 uppercase">
          GoTap.eg NFC System v1.0
        </p>
      </div>
    </div>
  )
}
