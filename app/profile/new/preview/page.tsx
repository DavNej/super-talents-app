'use client'

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { redirect } from 'next/navigation'
import { uploadToPinata } from '@/lib/ipfs/pinata'

import BackLink from '@/app/components/BackLink'
import Button from '@/app/components/Button'
import { useProfile } from '@/app/hooks/profile'
import { useWeb3Auth } from '@/app/hooks/web3auth'
import { mintTalentLayerId, updateProfileData } from '@/lib/talent-layer'
import ProfilePreview from '@/app/components/ProfilePreview'

export default function ProfilePreviewPage() {
  const { profile } = useProfile()
  const { signer } = useWeb3Auth()
  const [pinataCid, setPinataCid] = useLocalStorage('pinataCid', '')
  const [isMinting, setIsMinting] = React.useState(false)

  if (!profile.handle) redirect('/login')

  async function onSubmit() {
    if (!profile.role || !signer?.address) {
      console.error('missing role or signer')
      console.error('profile.role', profile.role)
      console.error('signer', signer)
      return
    }

    setIsMinting(true)
    const ipfsHash = await uploadToPinata(profile, signer.address)
    if (!ipfsHash) {
      setIsMinting(false)
      return
    }

    await setPinataCid(ipfsHash)

    const talentLayerId = await mintTalentLayerId(profile.handle, signer)

    if (!talentLayerId) {
      setIsMinting(false)
      return
    }

    await updateProfileData(talentLayerId, pinataCid, signer)
    setIsMinting(false)
  }

  return (
    <main className='px-24 flex flex-1 place-items-center bg-avatar bg-right bg-no-repeat bg-contain'>
      <div className='flex flex-col flex-1'>
        <BackLink />
        <div className='mb-12 flex justify-between items-center'>
          <h3 className='font-semibold text-5xl whitespace-nowrap'>
            Profile preview
          </h3>
          <Button isLoading={isMinting} onClick={onSubmit} isDisabled={false}>
            Mint my profile NFT
          </Button>
        </div>

        <ProfilePreview />
      </div>
    </main>
  )
}
