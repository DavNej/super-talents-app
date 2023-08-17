'use client'

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { redirect } from 'next/navigation'
import { uploadToPinata } from '@/lib/ipfs/pinata'

import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'
import { useProfile } from '@/app/hooks/profile'
import ProfilePreview from '@/app/components/ProfilePreview'
import { useUser } from '@/app/hooks/user'
import { useTalentLayerContract } from '@/app/hooks/talent-layer/contract'

export default function ProfilePreviewPage() {
  const { connectedProfile } = useProfile()
  const { connectedUser } = useUser()
  const [pinataCid, setPinataCid] = useLocalStorage('pinataCid', '')
  const [isLoading, setIsLoading] = React.useState(false)
  const talentLayerContract = useTalentLayerContract()

  async function uploadToIpfs() {
    if (!connectedProfile?.role) {
      console.error('missing connectedProfile role')
      console.error('connectedProfile.role', connectedProfile?.role)
      return
    }

    const ipfsHash = await uploadToPinata(
      connectedProfile,
      connectedProfile.handle
    )

    if (!ipfsHash) return

    await setPinataCid(ipfsHash)
  }

  async function handleMint() {
    if (!connectedProfile?.role) {
      console.error('missing connectedProfile role')
      console.error('connectedProfile.role', connectedProfile?.role)
      return
    }

    await talentLayerContract?.mintTalentLayerId({
      handle: connectedProfile.handle,
    })
  }

  async function handleClick() {
    setIsLoading(true)
    await uploadToIpfs()

    if (!connectedUser) {
      handleMint()
    } else {
      const talentLayerId = Number(connectedUser.id)

      if (Number.isNaN(talentLayerId)) return

      await talentLayerContract?.updateProfileData({
        talentLayerId,
        newCid: pinataCid,
      })
    }
    setIsLoading(false)
  }

  if (!connectedProfile) redirect('/login')
  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <div className='mb-12 flex justify-between items-center'>
          <h3 className='font-semibold text-5xl whitespace-nowrap'>
            Profile preview
          </h3>
          <Button isLoading={isLoading} onClick={handleClick}>
            {connectedUser ? 'Update profile' : 'Mint my profile NFT'}
          </Button>
        </div>

        <ProfilePreview
          isMinted={Boolean(connectedUser)}
          profile={connectedProfile}
        />
      </div>
    </main>
  )
}
