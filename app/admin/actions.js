'use server'

import { profilesCollection } from '@/lib/firebaseAdmin'

export async function saveProfile(data) {
  const { slug, name, imageUrl, whatsapp, phone, instagram, facebook, tiktok } =
    data

  if (!slug || !name) {
    return { error: 'Slug and Name are required' }
  }

  if (!profilesCollection) {
    return { error: 'Database not available. Check Firestore setup.' }
  }

  const docRef = profilesCollection.doc(slug)
  const doc = await docRef.get()

  const profile = {
    name,
    imageUrl: imageUrl || null,
    whatsapp: whatsapp || null,
    phone: phone || null,
    instagram: instagram || null,
    facebook: facebook || null,
    tiktok: tiktok || null,
    updatedAt: new Date().toISOString(),
  }

  const isNew = !doc.exists
  if (isNew) {
    profile.createdAt = new Date().toISOString()
  }

  await docRef.set(profile, { merge: true })

  return { success: true, slug, created: isNew }
}
