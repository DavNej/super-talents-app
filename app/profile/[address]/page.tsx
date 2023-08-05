'use client'

import { useWeb3Auth } from '@/lib/web3auth'
import LogoutButton from '@/app/components/LogoutButton'

export default function Page({ params }: { params: { address: string } }) {
  return (
    <>
      <div>My Address: {params.address}</div>

      <LogoutButton />
    </>
  )
}
