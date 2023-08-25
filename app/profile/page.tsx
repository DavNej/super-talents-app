'use client'

import { redirect } from 'next/navigation'

import { useAuth } from '@/lib/web3auth/hooks'
import { useUser } from '@/features/profile/hooks'

export default function ProfilePage() {
  const { provider } = useAuth()

  const connectedUser = useUser({ address: provider?.signerAddress })

  const connectedUserHandle = connectedUser.data?.handle
  if (!connectedUserHandle) {
    return redirect('/profile/new/avatar')
  }

  return redirect(`/profile/${connectedUserHandle}`)
}
