'use client'

import { redirect } from 'next/navigation'

import { useAuth,  useTalentLayerUser } from '@/lib/hooks'

export default function ProfilePage() {
  const { provider } = useAuth()

  const connectedUser = useTalentLayerUser({ address: provider?.signerAddress })

  const connectedUserHandle = connectedUser.data?.handle
  if (!connectedUserHandle) {
    return redirect('/profile/new/avatar')
  }

  return redirect(`/profile/${connectedUserHandle}`)
}
