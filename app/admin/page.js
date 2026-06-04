'use client'

import { useState, useRef, useCallback } from 'react'
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
  const [copied, setCopied] = useState(false)

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    setError(''); setSuccess(false); setSavedLink(''); setCopied(false)
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
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(false); setSavedLink(''); setCopied(false)
    const name = form.name.trim()
    const slug = form.slug.trim().toLowerCase()
    if (!name || !slug) return setError('Name and Slug are required')
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
      setSavedLink(`https://gotap.eg/p/${res.slug}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F111A] flex items-center justify-center px-4 py-8">
      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 max-w-md w-full shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            GoTap<span className="text-gold">.</span>eg
          </h1>
          <p className="text-gray-500 text-sm mt-1">NFC Profile Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className={`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group overflow-hidden
              ${preview ? 'border-transparent' : 'border-white/10 hover:border-white/20 bg-black/20'}`}
          >
            {preview ? (
              <>
                <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Change photo</span>
                </div>
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                </svg>
                <p className="text-gray-400 text-sm">Upload photo</p>
                <p className="text-gray-600 text-xs">Click to browse</p>
              </>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center z-10">
                <span className="text-gray-400 text-xs">Uploading…</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={e => uploadImage(e.target.files[0])} className="hidden" />

          {/* Name */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-medium">Full Name <span className="text-gold">*</span></label>
            <input
              value={form.name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Ahmed Hassan"
              className="w-full bg-black/40 border border-white/10 rounded-lg text-white p-3 focus:border-purple-500 focus:outline-none transition-all placeholder-gray-600"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5 font-medium">Slug <span className="text-gold">*</span></label>
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg p-3 focus-within:border-purple-500 transition-all">
              <span className="text-gray-500 text-sm shrink-0">gotap.eg/p/</span>
              <input
                value={form.slug}
                onChange={e => handleSlugChange(e.target.value)}
                placeholder="ahmed-hassan"
                className="bg-transparent text-white placeholder-gray-600 outline-none flex-1"
              />
            </div>
            <p className="text-gray-600 text-xs mt-1">Auto-generated from name. Edit to customize.</p>
          </div>

          {/* Social Links */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs uppercase tracking-widest text-gray-500 font-medium">Social Links</h2>
              <span className="text-gray-600 text-[10px] uppercase tracking-wider">Optional</span>
            </div>
            <p className="text-gray-600 text-xs mb-4">Paste full URLs — usernames are extracted automatically. Empty fields are hidden on the public page.</p>
            <div className="space-y-2">
              {platforms.map(({ key, label, icon: Icon, hint }) => (
                <div
                  key={key}
                  className="flex items-center gap-3 bg-black/20 border border-white/5 rounded-lg px-3 py-2 focus-within:border-white/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/5 text-gray-500">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] uppercase tracking-wider text-gray-600">{label}</label>
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
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full bg-gold hover:bg-gold-light text-black font-semibold rounded-lg py-3 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm tracking-wide"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              'Create Profile'
            )}
          </button>
        </form>

        {/* NFC Success Output */}
        {success && savedLink && (
          <div className="mt-8 bg-gradient-to-b from-emerald-500/[0.08] to-transparent border border-emerald-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center ring-1 ring-emerald-500/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <span className="text-white text-sm font-medium block">Profile Created</span>
                <span className="text-gray-500 text-xs">Your NFC link is ready to copy</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3 font-medium uppercase tracking-wider">Copy this URL to your NFC Tag</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={savedLink}
                className="flex-1 bg-black/60 border border-white/10 rounded-lg text-white text-sm p-3 outline-none font-mono tracking-tight"
              />
              <button
                onClick={copyLink}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg px-5 text-sm transition-all active:scale-[0.98] shrink-0"
              >
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
