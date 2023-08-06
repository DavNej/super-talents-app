'use client'

import LogoutButton from '@/app/components/LogoutButton'

export default function ProfilePage({ params }: { params: { address: string } }) {
  return (
    <>
      <div>My Address: {params.address}</div>

      <LogoutButton />
    </>
  )
}
